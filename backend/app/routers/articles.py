import logging
import time
import uuid
from datetime import datetime, timezone
from email.utils import formatdate
from typing import Optional
from xml.etree.ElementTree import Element, SubElement, tostring

import nh3
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import Response
from slugify import slugify
from supabase import AsyncClient

from ..db import get_db
from ..deps import get_article_for_mutation, get_current_user, get_optional_user, require_admin
from ..models import (
    ArticleCreate,
    ArticleListResponse,
    ArticleResponse,
    ArticleUpdate,
    ImageUploadResponse,
    UserProfile,
)

logger = logging.getLogger(__name__)
router = APIRouter()

# ─────────────────────────────────────────────────────────────────────────────
# HTML sanitization
# Quill editor output is allowed; <script>, event handlers, etc. are stripped.
# ─────────────────────────────────────────────────────────────────────────────
_ALLOWED_TAGS = {
    "p", "br", "strong", "em", "u", "s",
    "h1", "h2", "h3", "h4", "blockquote",
    "ul", "ol", "li", "a", "img", "figure", "figcaption",
    "pre", "code", "span", "div", "hr",
}
_ALLOWED_ATTRS: dict[str, set[str]] = {
    "a": {"href", "target"},  # "rel" is managed by nh3 internally
    "img": {"src", "alt", "width", "height"},
    "span": {"class"},
    "div": {"class"},
    "p": {"class"},
    "pre": {"class"},
    "code": {"class"},
}


def _sanitize(html: str) -> str:
    return nh3.clean(html, tags=_ALLOWED_TAGS, attributes=_ALLOWED_ATTRS)


# ─────────────────────────────────────────────────────────────────────────────
# Image magic-byte validation
# Checks actual file content, not just the MIME type the client claims.
# ─────────────────────────────────────────────────────────────────────────────
def _is_valid_image(data: bytes) -> bool:
    if len(data) < 12:
        return False
    if data[:3] == b"\xff\xd8\xff":            # JPEG
        return True
    if data[:8] == b"\x89PNG\r\n\x1a\n":       # PNG
        return True
    if data[:6] in (b"GIF87a", b"GIF89a"):     # GIF
        return True
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":  # WebP
        return True
    return False


# ─────────────────────────────────────────────────────────────────────────────
# Slug generation with collision retry
# ─────────────────────────────────────────────────────────────────────────────
async def _generate_slug(title: str, db: AsyncClient, exclude_id: str | None = None) -> str:
    base = slugify(title) or "article"
    candidate = base
    for i in range(2, 11):
        q = db.table("articles").select("id").eq("slug", candidate)
        if exclude_id:
            q = q.neq("id", exclude_id)
        result = await q.execute()
        if not result.data:
            return candidate
        candidate = f"{base}-{i}"
    return f"{base}-{int(time.time())}"


# ─────────────────────────────────────────────────────────────────────────────
# Response helper
# Supabase returns the profiles join as a nested dict; flatten to author_name.
# ─────────────────────────────────────────────────────────────────────────────
def _to_response(row: dict) -> ArticleResponse:
    author_name = None
    profiles = row.get("profiles")
    if isinstance(profiles, dict):
        author_name = profiles.get("display_name")
    return ArticleResponse(
        **{k: v for k, v in row.items() if k not in ("profiles", "tags", "view_count")},
        author_name=author_name,
        tags=row.get("tags") or [],
        view_count=row.get("view_count", 0),
    )


# ─────────────────────────────────────────────────────────────────────────────
# Per-status counts helper
# ─────────────────────────────────────────────────────────────────────────────
async def _get_status_counts(db: AsyncClient, author_id: str | None = None) -> dict[str, int]:
    """Run three lightweight count queries and return published/draft/archived counts.
    When author_id is provided (editor scope), counts are limited to that author's articles.
    """
    counts = {}
    for s in ("published", "draft", "archived"):
        q = db.table("articles").select("id", count="exact").eq("status", s)
        if author_id:
            q = q.eq("author_id", author_id)
        res = await q.execute()
        counts[s] = res.count or 0
    return counts


# ─────────────────────────────────────────────────────────────────────────────
# RSS cache (5-minute in-memory)
# ─────────────────────────────────────────────────────────────────────────────
_rss_cache: tuple[str, float] | None = None
_RSS_TTL = 300  # seconds

SITE_URL = "https://upvdpsm.com"


def _build_rss_xml(articles: list[dict]) -> str:
    rss = Element("rss", version="2.0")
    channel = SubElement(rss, "channel")

    SubElement(channel, "title").text = "DPSM News"
    SubElement(channel, "link").text = f"{SITE_URL}/news.html"
    SubElement(channel, "description").text = (
        "News and articles from the Division of Physical Sciences and Mathematics, UPV"
    )
    SubElement(channel, "language").text = "en-ph"

    for art in articles:
        item = SubElement(channel, "item")
        slug = art.get("slug", "")
        link = f"{SITE_URL}/article.html?slug={slug}"
        pub_dt = art.get("published_at")
        pub_rfc822 = formatdate(
            datetime.fromisoformat(pub_dt).timestamp() if pub_dt else time.time(),
            usegmt=True,
        )
        SubElement(item, "title").text = art.get("title", "")
        SubElement(item, "link").text = link
        SubElement(item, "description").text = art.get("excerpt", "")
        SubElement(item, "pubDate").text = pub_rfc822
        SubElement(item, "guid").text = link

    return '<?xml version="1.0" encoding="UTF-8"?>' + tostring(rss, encoding="unicode")


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/articles
#
# Public: returns published articles only (default).
# Authenticated: pass include_drafts=true to get all statuses, or status=X.
#
# Filters: q, tags, category, status, include_drafts, page, page_size
# ─────────────────────────────────────────────────────────────────────────────
@router.get("", response_model=ArticleListResponse)
async def list_articles(
    q: Optional[str] = Query(None, description="Search title and excerpt"),
    tags: Optional[str] = Query(None, description="Filter by tag"),
    category: Optional[str] = Query(None, description="Filter by category"),
    filter_status: Optional[str] = Query(None, alias="status"),
    include_drafts: bool = Query(False, description="Return all statuses (auth required)"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50, alias="page_size"),
    current_user: Optional[UserProfile] = Depends(get_optional_user),
    db: AsyncClient = Depends(get_db),
):
    # ── Determine status filter ───────────────────────────────────────────────
    if include_drafts:
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        # Honor an explicit status filter alongside include_drafts (e.g. admin filtering by draft)
        if filter_status and filter_status not in {"draft", "published", "archived"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status value")
        status_filter = filter_status or None  # None = return all statuses
    elif filter_status and filter_status != "published":
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        if filter_status not in {"draft", "published", "archived"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status value")
        status_filter = filter_status
    else:
        status_filter = "published"

    offset = (page - 1) * page_size

    query = db.table("articles").select("*, profiles(display_name)", count="exact")

    if status_filter:
        query = query.eq("status", status_filter)

    if q and q.strip():
        safe_q = q.strip().replace("%", r"\%").replace("_", r"\_")
        query = query.or_(f"title.ilike.%{safe_q}%,excerpt.ilike.%{safe_q}%")

    if tags:
        query = query.contains("tags", [tags.strip().lower()])

    if category:
        if category not in {"announcement", "event", "student_award"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category value")
        query = query.eq("category", category)

    query = query.order("published_at", desc=True).range(offset, offset + page_size - 1)

    result = await query.execute()
    items = [_to_response(row) for row in (result.data or [])]

    # ── Status counts (only when include_drafts — i.e., admin dashboard) ─────
    published_count = draft_count = archived_count = 0
    if include_drafts and current_user:
        counts = await _get_status_counts(db)
        published_count = counts.get("published", 0)
        draft_count = counts.get("draft", 0)
        archived_count = counts.get("archived", 0)

    return ArticleListResponse(
        items=items,
        total=result.count or 0,
        page=page,
        page_size=page_size,
        published_count=published_count,
        draft_count=draft_count,
        archived_count=archived_count,
    )


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/articles/rss
# NOTE: registered BEFORE /{slug} to avoid route shadowing
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/rss")
async def get_rss(db: AsyncClient = Depends(get_db)):
    global _rss_cache
    now = time.time()
    if _rss_cache and (now - _rss_cache[1]) < _RSS_TTL:
        return Response(_rss_cache[0], media_type="application/rss+xml; charset=utf-8")

    result = (
        await db.table("articles")
        .select("slug, title, excerpt, published_at")
        .eq("status", "published")
        .order("published_at", desc=True)
        .limit(20)
        .execute()
    )
    xml = _build_rss_xml(result.data or [])
    _rss_cache = (xml, now)
    return Response(xml, media_type="application/rss+xml; charset=utf-8")


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/articles/upload-image
# NOTE: registered BEFORE /{slug} to avoid route shadowing
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/upload-image", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    current_user: UserProfile = Depends(get_current_user),
    db: AsyncClient = Depends(get_db),
):
    content = await file.read()

    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large (max 5MB)")

    if not _is_valid_image(content):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image file")

    ext_map = {
        b"\xff\xd8\xff": "jpg",
        b"\x89PNG": "png",
        b"GIF8": "gif",
    }
    ext = "jpg"
    for magic, detected_ext in ext_map.items():
        if content[: len(magic)] == magic:
            ext = detected_ext
            break
    if content[:4] == b"RIFF" and content[8:12] == b"WEBP":
        ext = "webp"

    filename = f"covers/{uuid.uuid4()}.{ext}"
    content_type = file.content_type or f"image/{ext}"

    await db.storage.from_("article-images").upload(
        filename, content, file_options={"content-type": content_type}
    )
    url = db.storage.from_("article-images").get_public_url(filename)
    logger.info("Uploaded image: %s by user %s", filename, current_user.id)
    return ImageUploadResponse(url=url)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/articles/id/{article_id}
# Load article by UUID — used by the admin editor.
# NOTE: registered BEFORE /{slug} to avoid route shadowing.
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/id/{article_id}", response_model=ArticleResponse)
async def get_article_by_id(
    article_id: str,
    current_user: Optional[UserProfile] = Depends(get_optional_user),
    db: AsyncClient = Depends(get_db),
):
    try:
        uuid.UUID(article_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid article ID format")

    query = db.table("articles").select("*, profiles(display_name)").eq("id", article_id)
    if not current_user:
        query = query.eq("status", "published")

    try:
        result = await query.execute()
    except Exception as exc:
        logger.error("Failed to fetch article by id=%s: %s", article_id, exc)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not fetch article")

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    return _to_response(result.data[0])


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/articles/{slug}
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/{slug}", response_model=ArticleResponse)
async def get_article(
    slug: str,
    current_user: Optional[UserProfile] = Depends(get_optional_user),
    db: AsyncClient = Depends(get_db),
):
    query = db.table("articles").select("*, profiles(display_name)").eq("slug", slug)

    if not current_user:
        query = query.eq("status", "published")

    result = await query.execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    return _to_response(result.data[0])


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/articles
# ─────────────────────────────────────────────────────────────────────────────
@router.post("", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    data: ArticleCreate,
    current_user: UserProfile = Depends(get_current_user),
    db: AsyncClient = Depends(get_db),
):
    slug = await _generate_slug(data.title, db)
    clean_content = _sanitize(data.content)

    row = {
        "title": data.title,
        "slug": slug,
        "content": clean_content,
        "excerpt": data.excerpt,
        "image_url": data.image_url,
        "author_id": current_user.id,
        "status": "draft",
        "tags": data.tags,
        "category": data.category,
        "event_date": data.event_date.isoformat() if data.event_date else None,
    }

    try:
        result = await db.table("articles").insert(row).execute()
    except Exception as exc:
        if "unique" in str(exc).lower() or "duplicate" in str(exc).lower():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An article with this title already exists")
        logger.error("Failed to create article: %s", exc)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not create article")

    if not result.data:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not create article")

    logger.info("Article created: slug=%s category=%s by user=%s", slug, data.category, current_user.id)
    return _to_response(result.data[0])


# ─────────────────────────────────────────────────────────────────────────────
# PATCH /api/articles/{article_id}
# ─────────────────────────────────────────────────────────────────────────────
@router.patch("/{article_id}", response_model=ArticleResponse)
async def update_article(
    data: ArticleUpdate,
    article: dict = Depends(get_article_for_mutation),
    current_user: UserProfile = Depends(get_current_user),
    db: AsyncClient = Depends(get_db),
):
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    if "content" in update_data:
        update_data["content"] = _sanitize(update_data["content"])

    if "title" in update_data and update_data["title"] != article["title"]:
        if article["status"] == "draft":
            update_data["slug"] = await _generate_slug(update_data["title"], db, exclude_id=article["id"])

    if "event_date" in update_data and update_data["event_date"] is not None:
        update_data["event_date"] = update_data["event_date"].isoformat()

    await db.table("articles").update(update_data).eq("id", article["id"]).execute()

    result = await db.table("articles").select("*, profiles(display_name)").eq("id", article["id"]).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    logger.info("Article updated: id=%s by user=%s", article["id"], current_user.id)
    return _to_response(result.data[0])


# ─────────────────────────────────────────────────────────────────────────────
# DELETE /api/articles/{article_id}  (hard delete)
# ─────────────────────────────────────────────────────────────────────────────
@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article: dict = Depends(get_article_for_mutation),
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    await db.table("articles").delete().eq("id", article["id"]).execute()
    logger.info("Article deleted: id=%s by admin=%s", article["id"], current_user.id)


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/articles/{article_id}/publish
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/{article_id}/publish", response_model=ArticleResponse)
async def publish_article(
    article: dict = Depends(get_article_for_mutation),
    current_user: UserProfile = Depends(get_current_user),
    db: AsyncClient = Depends(get_db),
):
    if article["status"] == "published":
        return _to_response(article)

    if article["status"] == "archived":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Archived articles cannot be published. Create a new article.",
        )

    await db.table("articles").update({
        "status": "published",
        "published_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", article["id"]).eq("status", "draft").execute()

    result = await db.table("articles").select("*, profiles(display_name)").eq("id", article["id"]).eq("status", "published").execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Article could not be published (status may have changed)")

    logger.info("Article published: id=%s by admin=%s", article["id"], current_user.id)
    return _to_response(result.data[0])
