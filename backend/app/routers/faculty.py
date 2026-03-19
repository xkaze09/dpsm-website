import logging
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from supabase import AsyncClient

from ..db import get_db
from ..deps import get_current_user, require_admin
from ..models import FacultyMember, FacultyMemberCreate, FacultyMemberUpdate, UserProfile
from ..utils import is_valid_image

logger = logging.getLogger(__name__)
router = APIRouter()

_DEPT_ORDER = ["admin", "appmath", "cs", "statistics", "physics"]


@router.get("", response_model=list[FacultyMember])
async def list_faculty(
    department: str | None = None,
    db: AsyncClient = Depends(get_db),
):
    """Public endpoint. Returns active faculty, optionally filtered by department."""
    q = db.table("faculty_members").select("*").eq("is_active", True)
    if department:
        q = q.eq("department", department)
    result = await q.order("department").order("sort_order").order("name").execute()
    return [FacultyMember(**row) for row in (result.data or [])]


@router.post("", response_model=FacultyMember, status_code=status.HTTP_201_CREATED)
async def create_faculty_member(
    data: FacultyMemberCreate,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    result = await db.table("faculty_members").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Insert failed")
    logger.info("Faculty member created by %s: %s", current_user.id, result.data[0]["id"])
    return FacultyMember(**result.data[0])


@router.patch("/{member_id}", response_model=FacultyMember)
async def update_faculty_member(
    member_id: str,
    data: FacultyMemberUpdate,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    patch = {k: v for k, v in data.model_dump().items() if v is not None}
    if not patch:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.table("faculty_members").update(patch).eq("id", member_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Member not found")
    return FacultyMember(**result.data[0])


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faculty_member(
    member_id: str,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    await db.table("faculty_members").delete().eq("id", member_id).execute()
    logger.info("Faculty member deleted by %s: %s", current_user.id, member_id)


@router.post("/upload-photo", status_code=status.HTTP_200_OK)
async def upload_photo(
    file: UploadFile = File(...),
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    """Upload a faculty/staff photo to Supabase storage."""
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large (max 5MB)")
    if not is_valid_image(content):
        raise HTTPException(status_code=400, detail="Invalid image file")
    ext = (file.filename or "photo").rsplit(".", 1)[-1].lower()
    if ext not in {"jpg", "jpeg", "png", "webp"}:
        ext = "jpg"
    filename = f"faculty/{uuid.uuid4()}.{ext}"
    content_type = file.content_type or f"image/{ext}"
    await db.storage.from_("article-images").upload(
        filename, content, file_options={"content-type": content_type}
    )
    url = await db.storage.from_("article-images").get_public_url(filename)
    return {"url": url}
