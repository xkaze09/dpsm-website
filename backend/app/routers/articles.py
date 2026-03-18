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
    "a": {"href", "target"},  # "rel" is managed by nh3 internally — panics if included here
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
    # Exhausted retries — append timestamp as last resort
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
# RSS cache (5-minute in-memory)
# ─────────────────────────────────────────────────────────────────────────────
_rss_cache: tuple[str, float] | None = None
_RSS_TTL = 300  # seconds

SITE_URL = "https://upvdpsm.com"


def _build_rss_xml(articles: list[dict]) -> str:
    """
    Build RSS 2.0 XML from a list of article dicts.
    Uses stdlib xml.etree.ElementTree — no extra dependency.
    """
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
# Query params:
#   q      - search in title + excerpt (ILIKE)
#   tags   - filter by tag (exact match in array)
#   status - 'published' (default, public) | 'draft' | 'archived' (auth required)
#   page   - page number, default 1
#   limit  - items per page, default 10, max 50
#
# ┌──────────────────────────────────────────────────────────┐
# │  GET /api/articles  FILTER PIPELINE                      │
# │                                                          │
# │  parse params                                            │
# │       │                                                  │
# │  status != 'published'? ──▶ require auth                 │
# │       │                                                  │
# │  q present? ──▶ OR(title ILIKE, excerpt ILIKE)           │
# │       │                                                  │
# │  tags present? ──▶ array contains [tag]                  │
# │       │                                                  │
# │  paginate via .range()                                   │
# │       │                                                  │
# │  join profiles(display_name)                             │
# └──────────────────────────────────────────────────────────┘
# ─────────────────────────────────────────────────────────────────────────────
@router.get("", response_model=ArticleListResponse)
async def list_articles(
    q: Optional[str] = Query(None, description="Search title and excerpt"),
    tags: Optional[str] = Query(None, description="Filter by tag"),
    filter_status: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: Optional[UserProfile] = Depends(get_optional_user),
    db: AsyncClient = Depends(get_db),
):
    if filter_status and filter_status != "published":
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        if filter_status not in {"draft", "published", "archived"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status value")
        status_filter = filter_status
    else:
        status_filter = "published"

    offset = (page - 1) * limit

    query = db.table("articles").select("*, profiles(display_name)", count="exact")
    query = query.eq("status", status_filter)

    if q and q.strip():
        safe_q = q.strip().replace("%", r"\%").replace("_", r"\_")
        query = query.or_(f"title.ilike.%{safe_q}%,excerpt.ilike.%{safe_q}%")

    if tags:
        query = query.contains("tags", [tags.strip().lower()])

    query = query.order("published_at", desc=True).range(offset, offset + limit - 1)

    result = await query.execute()

    items = [_to_response(row) for row in (result.data or [])]
    return ArticleListResponse(
        items=items,
        total=result.count or 0,
        page=page,
        limit=limit,
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
# GET /api/articles/{slug}
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/{slug}", response_model=ArticleResponse)
async def get_article(
    slug: str,
    current_user: Optional[UserProfile] = Depends(get_optional_user),
    db: AsyncClient = Depends(get_db),
):
    query = db.table("articles").select("*, profiles(display_name)").eq("slug", slug)

    # Authenticated users (admin/editor) can view drafts; public sees published only
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
        "cover_image": data.cover_image,
        "author_id": current_user.id,
        "status": "draft",
        "tags": data.tags,
    }

    try:
        result = await db.table("articles").insert(row).execute()
    except Exception as exc:
        # Unique constraint violation on slug (race condition)
        if "unique" in str(exc).lower() or "duplicate" in str(exc).lower():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An article with this title already exists")
        logger.error("Failed to create article: %s", exc)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not create article")

    if not result.data:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not create article")

    logger.info("Article created: slug=%s by user=%s", slug, current_user.id)
    return _to_response(result.data[0])


# ─────────────────────────────────────────────────────────────────────────────
# PUT /api/articles/{article_id}
# ─────────────────────────────────────────────────────────────────────────────
@router.put("/{article_id}", response_model=ArticleResponse)
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
        # Only regenerate slug if the article hasn't been published yet
        if article["status"] == "draft":
            update_data["slug"] = await _generate_slug(update_data["title"], db, exclude_id=article["id"])

    await db.table("articles").update(update_data).eq("id", article["id"]).execute()

    result = await db.table("articles").select("*, profiles(display_name)").eq("id", article["id"]).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    logger.info("Article updated: id=%s by user=%s", article["id"], current_user.id)
    return _to_response(result.data[0])


# ─────────────────────────────────────────────────────────────────────────────
# DELETE /api/articles/{article_id}  (soft delete → archived)
# ─────────────────────────────────────────────────────────────────────────────
@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article: dict = Depends(get_article_for_mutation),
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    await db.table("articles").update({"status": "archived"}).eq("id", article["id"]).execute()
    logger.info("Article archived: id=%s by admin=%s", article["id"], current_user.id)


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/articles/{article_id}/publish
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/{article_id}/publish", response_model=ArticleResponse)
async def publish_article(
    article: dict = Depends(get_article_for_mutation),
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    if article["status"] == "published":
        # Idempotent — already published, return as-is
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
