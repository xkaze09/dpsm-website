"""
Users router tests — C20 through C21.

C20: POST /api/users (admin) → creates account, sends invite
C21: POST /api/users (editor) → 403
"""
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.db import get_db
from app.deps import get_current_user, require_admin
from app.main import app
from tests.conftest import ADMIN_USER, EDITOR_USER, make_mock_db


@pytest.mark.asyncio
async def test_editor_cannot_create_users(editor_client, mock_db_factory):
    """C21: Editor calling POST /api/users gets 403."""
    db, _, _ = mock_db_factory()
    app.dependency_overrides[get_db] = lambda: db

    response = await editor_client.post("/api/users", json={
        "email": "new@upvdpsm.com",
        "display_name": "New User",
        "role": "editor",
    })

    assert response.status_code == 403
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_admin_creates_user_sends_invite(admin_client, mock_db_factory):
    """C20: Admin creates a user — invite is sent, profile is created."""
    profile_row = {
        "id": "new-user-uuid",
        "display_name": "New Editor",
        "role": "editor",
        "avatar_url": None,
        "created_at": "2026-01-01T00:00:00+00:00",
    }
    db, qb, _ = mock_db_factory(data=[profile_row])

    # Mock the Supabase Auth admin invite call
    invite_result = MagicMock()
    invite_result.user = MagicMock()
    invite_result.user.id = "new-user-uuid"
    db.auth.admin.invite_user_by_email = AsyncMock(return_value=invite_result)

    app.dependency_overrides[get_db] = lambda: db

    response = await admin_client.post("/api/users", json={
        "email": "new@upvdpsm.com",
        "display_name": "New Editor",
        "role": "editor",
    })

    assert response.status_code == 201
    assert response.json()["role"] == "editor"
    db.auth.admin.invite_user_by_email.assert_called_once_with("new@upvdpsm.com")
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_admin_cannot_deactivate_own_account(admin_client, mock_db_factory):
    """Admin deactivating themselves returns 400."""
    db, _, _ = mock_db_factory()
    app.dependency_overrides[get_db] = lambda: db

    response = await admin_client.delete(f"/api/users/{ADMIN_USER.id}")

    assert response.status_code == 400
    assert "own account" in response.json()["detail"].lower()
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_create_user_duplicate_email_returns_409(admin_client, mock_db_factory):
    """POST /api/users with existing email returns 409."""
    db, _, _ = mock_db_factory()
    db.auth.admin.invite_user_by_email = AsyncMock(
        side_effect=Exception("User already registered")
    )
    app.dependency_overrides[get_db] = lambda: db

    response = await admin_client.post("/api/users", json={
        "email": "existing@upvdpsm.com",
        "display_name": "Duplicate",
        "role": "editor",
    })

    assert response.status_code == 409
    app.dependency_overrides.clear()
