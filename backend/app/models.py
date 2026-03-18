from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator


# ─────────────────────────────────────────────────────────────────────────────
# Article status machine:
#
#   draft ──[admin publish]──▶ published
#     │                           │
#     └──[admin archive]──▶ archived ◀──[admin archive]──┘
#
# No direct path from published back to draft.
# Soft-delete only: DELETE sets status = 'archived', never hard-deletes.
# ─────────────────────────────────────────────────────────────────────────────

VALID_STATUSES = {"draft", "published", "archived"}
VALID_ROLES = {"admin", "editor"}


# ─────────────────────────────────────────────────────────────────────────────
# User / Profile
# ─────────────────────────────────────────────────────────────────────────────


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    display_name: Optional[str] = None
    role: str
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None


class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(BaseModel):
    email: str
    display_name: str
    role: str

    @field_validator("role")
    @classmethod
    def role_must_be_valid(cls, v: str) -> str:
        if v not in VALID_ROLES:
            raise ValueError(f"role must be one of: {', '.join(VALID_ROLES)}")
        return v


class UserRoleUpdate(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def role_must_be_valid(cls, v: str) -> str:
        if v not in VALID_ROLES:
            raise ValueError(f"role must be one of: {', '.join(VALID_ROLES)}")
        return v


# ─────────────────────────────────────────────────────────────────────────────
# Articles
# ─────────────────────────────────────────────────────────────────────────────


class ArticleCreate(BaseModel):
    title: str
    content: str  # Quill HTML — sanitized by nh3 on the backend before INSERT
    excerpt: str
    tags: list[str]
    cover_image: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v.strip()

    @field_validator("excerpt")
    @classmethod
    def excerpt_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("excerpt is required")
        return v.strip()

    @field_validator("tags")
    @classmethod
    def tags_not_empty(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("at least one tag is required")
        return [t.strip().lower() for t in v if t.strip()]


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None  # sanitized on backend
    excerpt: Optional[str] = None
    tags: Optional[list[str]] = None
    cover_image: Optional[str] = None

    @field_validator("tags")
    @classmethod
    def tags_not_empty(cls, v: Optional[list[str]]) -> Optional[list[str]]:
        if v is not None and not v:
            raise ValueError("tags list must not be empty if provided")
        if v is not None:
            return [t.strip().lower() for t in v if t.strip()]
        return v


class ArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    slug: str
    content: str
    excerpt: str
    cover_image: Optional[str] = None
    author_id: Optional[str] = None
    author_name: Optional[str] = None
    status: str
    tags: list[str] = []
    view_count: int = 0
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class ArticleListResponse(BaseModel):
    items: list[ArticleResponse]
    total: int
    page: int
    limit: int


class ImageUploadResponse(BaseModel):
    url: str
