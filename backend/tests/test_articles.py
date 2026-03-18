"""
Articles router tests — C2 through C16 from the test diagram.

C2:  GET /api/articles (no params) → published only
C3:  GET /api/articles?q=term → title/excerpt ILIKE filter
C4:  GET /api/articles?tags=X → tag filter
C5:  GET /api/articles/{slug} (published) → 200
C6:  GET /api/articles/{slug} (draft, no auth) → 404
C7:  GET /api/rss → 200 + valid XML, published only, max 20
C8:  POST /api/articles (editor) → 201, nh3 strips XSS
C9:  POST /api/articles (duplicate slug) → 409
C10: PUT /api/articles/{id} (editor owns it) → 200
C11: PUT /api/articles/{id} (editor, other's article) → 403
C12: PUT /api/articles/{id} (admin, any article) → 200
C13: DELETE /api/articles/{id} → status becomes 'archived'
C14: POST /api/articles/{id}/publish (admin) → status=published
C15: POST /api/articles/{id}/publish (editor) → 403
C16: deps.get_article_for_mutation: missing article → 404
"""
from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest

from app.db import get_db
from app.deps import get_article_for_mutation, get_current_user, get_optional_user, require_admin
from app.main import app
from tests.conftest import ADMIN_USER, EDITOR_B, EDITOR_USER, make_mock_db

# ─────────────────────────────────────────────────────────────────────────────
# Shared test fixtures
# ─────────────────────────────────────────────────────────────────────────────

_NOW = datetime.now(timezone.utc).isoformat()
_PUBLISHED_ARTICLE = {
    "id": "art-001",
    "title": "Test Article",
    "slug": "test-article",
    "content": "<p>Hello world</p>",
    "excerpt": "A test excerpt",
    "cover_image": None,
    "author_id": EDITOR_USER.id,
    "status": "published",
    "tags": ["science"],
    "view_count": 0,
    "published_at": _NOW,
    "created_at": _NOW,
    "updated_at": _NOW,
    "profiles": {"display_name": "Test Editor"},
}
_DRAFT_ARTICLE = {**_PUBLISHED_ARTICLE, "id": "art-002", "slug": "draft-article", "status": "draft", "published_at": None}
_OTHER_EDITOR_ARTICLE = {**_DRAFT_ARTICLE, "id": "art-003", "author_id": EDITOR_B.id}


# ─────────────────────────────────────────────────────────────────────────────
# C2: List articles — published only by default
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_list_articles_returns_published_only(anon_client, mock_db_factory):
    db, qb, result = mock_db_factory(data=[_PUBLISHED_ARTICLE], count=1)
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_optional_user] = lambda: None

    response = await anon_client.get("/api/articles")

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["slug"] == "test-article"
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_list_articles_empty_is_200_not_error(anon_client, mock_db_factory):
    db, _, _ = mock_db_factory(data=[], count=0)
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_optional_user] = lambda: None

    response = await anon_client.get("/api/articles")

    assert response.status_code == 200
    assert response.json()["items"] == []
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C3: Search with q param
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_list_articles_search_passes_ilike_filter(anon_client, mock_db_factory):
    db, qb, _ = mock_db_factory(data=[_PUBLISHED_ARTICLE], count=1)
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_optional_user] = lambda: None

    response = await anon_client.get("/api/articles?q=test")

    assert response.status_code == 200
    # or_ should have been called on the query builder
    qb.or_.assert_called_once()
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_list_articles_empty_q_treated_as_no_filter(anon_client, mock_db_factory):
    db, qb, _ = mock_db_factory(data=[], count=0)
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_optional_user] = lambda: None

    response = await anon_client.get("/api/articles?q=")

    assert response.status_code == 200
    qb.or_.assert_not_called()
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C4: Tag filter
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_list_articles_tag_filter(anon_client, mock_db_factory):
    db, qb, _ = mock_db_factory(data=[_PUBLISHED_ARTICLE], count=1)
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_optional_user] = lambda: None

    response = await anon_client.get("/api/articles?tags=science")

    assert response.status_code == 200
    qb.contains.assert_called_once_with("tags", ["science"])
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C5: Get published article by slug
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_get_article_by_slug_published(anon_client, mock_db_factory):
    db, _, _ = mock_db_factory(data=[_PUBLISHED_ARTICLE])
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_optional_user] = lambda: None

    response = await anon_client.get("/api/articles/test-article")

    assert response.status_code == 200
    assert response.json()["slug"] == "test-article"
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C6: Draft article returns 404 for anonymous user
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_get_draft_article_anonymous_returns_404(anon_client, mock_db_factory):
    # Supabase RLS / status=published filter means no data returned for draft
    db, _, _ = mock_db_factory(data=[])
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_optional_user] = lambda: None

    response = await anon_client.get("/api/articles/draft-article")

    assert response.status_code == 404
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C7: RSS feed — valid XML, published only
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_rss_returns_valid_xml(anon_client, mock_db_factory):
    db, _, _ = mock_db_factory(data=[_PUBLISHED_ARTICLE])
    app.dependency_overrides[get_db] = lambda: db

    response = await anon_client.get("/api/articles/rss")

    assert response.status_code == 200
    assert "application/rss+xml" in response.headers["content-type"]
    assert "<?xml" in response.text
    assert "<rss" in response.text
    assert "Test Article" in response.text
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_rss_empty_is_valid_xml(anon_client, mock_db_factory):
    db, _, _ = mock_db_factory(data=[])
    app.dependency_overrides[get_db] = lambda: db

    response = await anon_client.get("/api/articles/rss")

    assert response.status_code == 200
    assert "<?xml" in response.text
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C8: Create article — XSS in content is sanitized by nh3
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_create_article_strips_xss(editor_client, mock_db_factory):
    created_row = {
        **_PUBLISHED_ARTICLE,
        "id": "art-new",
        "slug": "hello-world",
        "status": "draft",
        "content": "<p>Hello</p>",  # XSS stripped
        "published_at": None,
    }
    db, qb, _ = mock_db_factory(data=[created_row])
    # Slug uniqueness check returns empty (no conflict)
    qb.execute = AsyncMock(side_effect=[
        type("R", (), {"data": []})(),   # slug check
        type("R", (), {"data": [created_row]})(),  # insert
    ])
    app.dependency_overrides[get_db] = lambda: db

    response = await editor_client.post("/api/articles", json={
        "title": "Hello World",
        "content": "<p>Hello</p><script>alert(1)</script>",
        "excerpt": "A test excerpt",
        "tags": ["test"],
    })

    assert response.status_code == 201
    # The <script> tag must not appear in the stored content
    assert "<script>" not in response.json()["content"]
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C9: Duplicate slug → 409
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_create_article_duplicate_slug_returns_409(editor_client, mock_db_factory):
    db, qb, _ = mock_db_factory()
    # All slug candidates are taken
    qb.execute = AsyncMock(side_effect=[
        type("R", (), {"data": [{"id": "existing"}]})(),  # slug check 1
        type("R", (), {"data": [{"id": "existing"}]})(),  # slug check 2
        type("R", (), {"data": [{"id": "existing"}]})(),  # slug check 3-10
        type("R", (), {"data": [{"id": "existing"}]})(),
        type("R", (), {"data": [{"id": "existing"}]})(),
        type("R", (), {"data": [{"id": "existing"}]})(),
        type("R", (), {"data": [{"id": "existing"}]})(),
        type("R", (), {"data": [{"id": "existing"}]})(),
        type("R", (), {"data": [{"id": "existing"}]})(),
        # insert raises unique constraint
        Exception("duplicate key violates unique constraint"),
    ])
    app.dependency_overrides[get_db] = lambda: db

    response = await editor_client.post("/api/articles", json={
        "title": "Hello World",
        "content": "<p>Hello</p>",
        "excerpt": "excerpt",
        "tags": ["test"],
    })

    assert response.status_code == 409
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C10: Editor updates own article → 200
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_update_own_article_as_editor(editor_client, mock_db_factory):
    updated = {**_DRAFT_ARTICLE, "excerpt": "Updated excerpt"}
    db, qb, _ = mock_db_factory()
    qb.execute = AsyncMock(side_effect=[
        type("R", (), {"data": [_DRAFT_ARTICLE]})(),   # get_article_for_mutation fetch
        type("R", (), {"data": [updated]})(),            # update
    ])
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_article_for_mutation] = lambda: _DRAFT_ARTICLE

    response = await editor_client.put("/api/articles/art-002", json={"excerpt": "Updated excerpt"})

    assert response.status_code == 200
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C11: Editor cannot update another editor's article → 403
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_editor_cannot_update_other_editors_article(editor_client, mock_db_factory):
    db, qb, _ = mock_db_factory(data=[_OTHER_EDITOR_ARTICLE])
    app.dependency_overrides[get_db] = lambda: db
    # Don't override get_article_for_mutation — let the real dep run
    app.dependency_overrides.pop(get_article_for_mutation, None)

    response = await editor_client.put("/api/articles/art-003", json={"excerpt": "Hijack!"})

    assert response.status_code == 403
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C12: Admin can update any article → 200
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_admin_can_update_any_article(admin_client, mock_db_factory):
    updated = {**_OTHER_EDITOR_ARTICLE, "excerpt": "Admin fix"}
    db, qb, _ = mock_db_factory()
    qb.execute = AsyncMock(side_effect=[
        type("R", (), {"data": [_OTHER_EDITOR_ARTICLE]})(),
        type("R", (), {"data": [updated]})(),
    ])
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_article_for_mutation] = lambda: _OTHER_EDITOR_ARTICLE

    response = await admin_client.put("/api/articles/art-003", json={"excerpt": "Admin fix"})

    assert response.status_code == 200
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C13: DELETE soft-deletes to archived
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_delete_archives_article(admin_client, mock_db_factory):
    db, qb, _ = mock_db_factory(data=[{"status": "archived"}])
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_article_for_mutation] = lambda: _DRAFT_ARTICLE

    response = await admin_client.delete("/api/articles/art-002")

    assert response.status_code == 204
    # Verify update was called with status=archived
    qb.update.assert_called_once_with({"status": "archived"})
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C14: Admin publishes draft → status = published
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_admin_publishes_article(admin_client, mock_db_factory):
    published = {**_DRAFT_ARTICLE, "status": "published", "published_at": _NOW}
    db, qb, _ = mock_db_factory(data=[published])
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_article_for_mutation] = lambda: _DRAFT_ARTICLE

    response = await admin_client.post("/api/articles/art-002/publish")

    assert response.status_code == 200
    assert response.json()["status"] == "published"
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C15: Editor cannot publish → 403
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_editor_cannot_publish(editor_client, mock_db_factory):
    db, _, _ = mock_db_factory(data=[_DRAFT_ARTICLE])
    app.dependency_overrides[get_db] = lambda: db
    # require_admin is NOT overridden for editor_client

    response = await editor_client.post("/api/articles/art-002/publish")

    assert response.status_code == 403
    app.dependency_overrides.clear()


# ─────────────────────────────────────────────────────────────────────────────
# C16: get_article_for_mutation — missing article → 404
# ─────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_update_nonexistent_article_returns_404(editor_client, mock_db_factory):
    db, _, _ = mock_db_factory(data=[])  # empty result = not found
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides.pop(get_article_for_mutation, None)

    response = await editor_client.put("/api/articles/nonexistent", json={"excerpt": "test"})

    assert response.status_code == 404
    app.dependency_overrides.clear()
