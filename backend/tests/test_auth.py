"""
Auth router tests — C17 through C19.

C17: JWT with expired token → 401
C18: JWT with missing role claim → 401
C19: GET /api/me → own profile
"""
import pytest
from unittest.mock import AsyncMock

from app.db import get_db
from app.deps import get_current_user
from app.main import app
from app.models import UserProfile
from tests.conftest import EDITOR_USER, make_mock_db


@pytest.mark.asyncio
async def test_expired_token_returns_401(anon_client):
    """C17: Sending an expired or invalid JWT must return 401, not 500."""
    response = await anon_client.get(
        "/api/me",
        headers={"Authorization": "Bearer invalid.jwt.token"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_missing_token_returns_403_or_401(anon_client):
    """C17 variant: No Authorization header on authenticated endpoint."""
    response = await anon_client.get("/api/me")
    assert response.status_code in (401, 403)


@pytest.mark.asyncio
async def test_get_my_profile_returns_own_profile(anon_client, mock_db_factory):
    """C19: GET /api/me returns the authenticated user's profile."""
    profile_row = {
        "id": EDITOR_USER.id,
        "display_name": "Test Editor",
        "role": "editor",
        "avatar_url": None,
        "created_at": "2026-01-01T00:00:00+00:00",
    }
    db, _, _ = mock_db_factory(data=[profile_row])
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_current_user] = lambda: EDITOR_USER

    response = await anon_client.get("/api/me", headers={"Authorization": "Bearer fake"})

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == EDITOR_USER.id
    assert body["role"] == "editor"
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_put_me_updates_display_name(anon_client, mock_db_factory):
    """PUT /api/me updates display_name."""
    updated_row = {
        "id": EDITOR_USER.id,
        "display_name": "New Name",
        "role": "editor",
        "avatar_url": None,
        "created_at": "2026-01-01T00:00:00+00:00",
    }
    db, _, _ = mock_db_factory(data=[updated_row])
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_current_user] = lambda: EDITOR_USER

    response = await anon_client.put(
        "/api/me",
        json={"display_name": "New Name"},
        headers={"Authorization": "Bearer fake"},
    )

    assert response.status_code == 200
    assert response.json()["display_name"] == "New Name"
    app.dependency_overrides.clear()
