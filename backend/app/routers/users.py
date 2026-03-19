import logging

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import AsyncClient

from ..db import get_db
from ..deps import require_admin
from ..models import UserCreate, UserProfile, UserRoleUpdate

logger = logging.getLogger(__name__)
router = APIRouter()

# Ban duration used to "deactivate" a user. ~10 years effectively permanent.
_BAN_DURATION = "87600h"


@router.get("", response_model=list[UserProfile])
async def list_users(
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    """List all user profiles with email and active status. Admin only."""
    result = await db.table("profiles").select("*").order("created_at", desc=False).execute()
    rows = {row["id"]: row for row in (result.data or [])}

    # Augment with email + banned status from Supabase auth
    try:
        auth_users_resp = await db.auth.admin.list_users()
        auth_by_id = {str(u.id): u for u in (auth_users_resp or [])}
    except Exception as exc:
        logger.warning("Could not fetch auth users: %s", exc)
        auth_by_id = {}

    users = []
    for uid, row in rows.items():
        auth_u = auth_by_id.get(uid)
        email = auth_u.email if auth_u else None
        banned = getattr(auth_u, "banned_until", None) if auth_u else None
        is_active = banned is None or str(banned).lower() in ("", "none", "0001-01-01t00:00:00z")
        users.append(UserProfile(**row, email=email, is_active=is_active))

    return users


@router.post("", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
async def create_user(
    data: UserCreate,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    """
    Create a new editor or admin account. Admin only.

    Flow:
    1. Invite user via Supabase Auth admin API (sends invite email with magic link)
    2. Create profile record in the profiles table

    The invited user sets their own password — the admin never handles credentials.
    """
    # Step 1: Create user via Supabase Auth admin API (no invite email needed)
    try:
        create_response = await db.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True,
        })
    except Exception as exc:
        err_str = str(exc).lower()
        if "already registered" in err_str or "already exists" in err_str or "unique" in err_str:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists",
            )
        logger.error("Failed to create user %s: %s", data.email, exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not create user account: {exc}",
        )

    user_id = create_response.user.id

    # Step 2: Create profile
    try:
        result = await db.table("profiles").insert({
            "id": user_id,
            "display_name": data.display_name,
            "role": data.role,
        }).execute()
    except Exception as exc:
        # Profile insert failed — auth user exists but has no profile.
        # Log for manual cleanup; don't expose internal details.
        logger.error(
            "Profile insert failed for user %s (auth_id=%s): %s",
            data.email, user_id, exc,
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Account created but profile setup failed. Contact a developer.",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not create user profile",
        )

    logger.info("User created: email=%s role=%s by admin=%s", data.email, data.role, current_user.id)
    return UserProfile(**result.data[0])


@router.patch("/{user_id}/role", response_model=UserProfile)
async def change_role(
    user_id: str,
    data: UserRoleUpdate,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    """Change a user's role. Admin only."""
    result = await db.table("profiles").update({"role": data.role}).eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    logger.info("Role changed: user=%s new_role=%s by admin=%s", user_id, data.role, current_user.id)
    return UserProfile(**result.data[0])


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    """
    Delete a user account. Admin only. Hard delete — removes from auth and profiles.
    """
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account",
        )

    try:
        await db.auth.admin.delete_user(user_id)
    except Exception as exc:
        logger.error("Failed to delete user %s: %s", user_id, exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not delete user",
        )

    # Profile row is removed via ON DELETE CASCADE from auth.users, but clean up explicitly
    await db.table("profiles").delete().eq("id", user_id).execute()

    logger.info("User deleted: user=%s by admin=%s", user_id, current_user.id)
