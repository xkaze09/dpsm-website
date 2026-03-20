import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from supabase import AsyncClient

from ..db import get_db
from ..deps import get_current_user
from ..limiter import limiter
from ..models import UserProfile, UserProfileUpdate

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/me", response_model=UserProfile)
@limiter.limit("30/minute")
async def get_my_profile(
    request: Request,
    current_user: UserProfile = Depends(get_current_user),
    db: AsyncClient = Depends(get_db),
):
    """Return the full profile for the currently authenticated user."""
    result = await db.table("profiles").select("*").eq("id", current_user.id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return UserProfile(**result.data[0])


@router.put("/me", response_model=UserProfile)
@limiter.limit("10/minute")
async def update_my_profile(
    request: Request,
    data: UserProfileUpdate,
    current_user: UserProfile = Depends(get_current_user),
    db: AsyncClient = Depends(get_db),
):
    """Update the current user's display name or avatar URL."""
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    result = await db.table("profiles").update(update_data).eq("id", current_user.id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    logger.info("Profile updated: user=%s", current_user.id)
    return UserProfile(**result.data[0])
