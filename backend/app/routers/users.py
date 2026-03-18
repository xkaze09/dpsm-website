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
    """List all user profiles. Admin only."""
    result = await db.table("profiles").select("*").order("created_at", desc=False).execute()
    return [UserProfile(**row) for row in (result.data or [])]


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
    # Step 1: Invite via Supabase Auth admin API
    try:
        invite_response = await db.auth.admin.invite_user_by_email(data.email)
    except Exception as exc:
        err_str = str(exc).lower()
        if "already registered" in err_str or "already exists" in err_str or "unique" in err_str:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists",
            )
        logger.error("Failed to invite user %s: %s", data.email, exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not create user account",
        )

    user_id = invite_response.user.id

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


@router.put("/{user_id}/role", response_model=UserProfile)
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
async def deactivate_user(
    user_id: str,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    """
    Deactivate a user account. Admin only. Soft disable — does not delete.
    Uses Supabase ban_duration to prevent login. Articles remain attributed.
    """
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot deactivate your own account",
        )

    try:
        from gotrue.types import AdminUserAttributes
        await db.auth.admin.update_user_by_id(
            user_id,
            AdminUserAttributes(ban_duration=_BAN_DURATION),
        )
    except Exception as exc:
        logger.error("Failed to deactivate user %s: %s", user_id, exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not deactivate user",
        )

    logger.info("User deactivated: user=%s by admin=%s", user_id, current_user.id)
