"""
Test configuration and shared fixtures.

Strategy:
- Tests use httpx.AsyncClient without triggering the lifespan (no DB connection needed)
- get_db dependency is overridden to return a mock Supabase client
- get_current_user is overridden per-test to inject the desired user identity
- All Supabase query builder calls are mocked via MagicMock chaining
"""

import os

# Set env vars BEFORE importing the app so startup checks don't fail
os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")
os.environ.setdefault("SUPABASE_JWT_SECRET", "test-jwt-secret-must-be-at-least-32-chars!!")
os.environ.setdefault("SENTRY_DSN", "")

import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import AsyncMock, MagicMock

from app.db import get_db
from app.deps import get_current_user, require_admin
from app.main import app
from app.models import UserProfile

# ─────────────────────────────────────────────────────────────────────────────
# Canonical test users
# ─────────────────────────────────────────────────────────────────────────────
EDITOR_USER = UserProfile(id="editor-uuid-001", role="editor", display_name="Test Editor")
ADMIN_USER = UserProfile(id="admin-uuid-001", role="admin", display_name="Test Admin")
EDITOR_B = UserProfile(id="editor-uuid-002", role="editor", display_name="Editor B")


# ─────────────────────────────────────────────────────────────────────────────
# Mock Supabase query builder
# Chains: .table().select().eq().execute() etc.
# ─────────────────────────────────────────────────────────────────────────────
def make_query_builder(data=None, count=None):
    """
    Build a mock that mimics the supabase-py fluent query builder.
    Every chained method returns the same mock; .execute() returns a result mock.
    """
    result = MagicMock()
    result.data = data if data is not None else []
    result.count = count if count is not None else len(result.data)

    qb = MagicMock()
    execute_mock = AsyncMock(return_value=result)

    # Every builder method returns qb itself (for chaining)
    for method in (
        "select", "eq", "neq", "or_", "contains", "ilike",
        "order", "range", "limit", "insert", "update", "delete",
        "upsert", "filter", "in_", "not_",
    ):
        getattr(qb, method).return_value = qb

    qb.execute = execute_mock
    return qb, result


def make_mock_db(data=None, count=None):
    """Return a mock AsyncClient whose .table() calls return a configurable query builder."""
    db = MagicMock()
    qb, result = make_query_builder(data=data, count=count)
    db.table.return_value = qb
    db.storage = MagicMock()
    db.auth = MagicMock()
    db.auth.admin = MagicMock()
    db.auth.admin.invite_user_by_email = AsyncMock()
    db.auth.admin.update_user_by_id = AsyncMock()
    return db, qb, result


# ─────────────────────────────────────────────────────────────────────────────
# Test client fixtures
# ─────────────────────────────────────────────────────────────────────────────
@pytest.fixture
async def anon_client():
    """HTTP client with no authentication (anonymous visitor)."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
async def editor_client():
    """HTTP client authenticated as an editor."""
    app.dependency_overrides[get_current_user] = lambda: EDITOR_USER
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
async def admin_client():
    """HTTP client authenticated as an admin."""
    app.dependency_overrides[get_current_user] = lambda: ADMIN_USER
    app.dependency_overrides[require_admin] = lambda: ADMIN_USER
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def mock_db_factory():
    """
    Factory fixture: call with data/count to get a pre-configured mock DB.
    Usage:
        db, qb, result = mock_db_factory(data=[{"id": "1", ...}])
        app.dependency_overrides[get_db] = lambda: db
    """
    def _factory(data=None, count=None):
        return make_mock_db(data=data, count=count)
    return _factory
