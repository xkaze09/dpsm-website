import logging
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from supabase import AsyncClient

from ..db import get_db
from ..deps import require_admin
from ..models import Facility, FacilityCreate, FacilityUpdate
from ..utils import is_valid_image

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("", response_model=list[Facility])
async def list_facilities(
    category: str | None = None,
    db: AsyncClient = Depends(get_db),
):
    """Public endpoint. Returns active facilities, optionally filtered by category."""
    q = db.table("facilities").select("*").eq("is_active", True)
    if category:
        q = q.eq("category", category)
    result = await q.order("category").order("sort_order").order("name").execute()
    return [Facility(**row) for row in (result.data or [])]


@router.post("", response_model=Facility, status_code=status.HTTP_201_CREATED)
async def create_facility(
    data: FacilityCreate,
    current_user=Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    result = await db.table("facilities").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Insert failed")
    logger.info("Facility created by %s: %s", current_user.id, result.data[0]["id"])
    return Facility(**result.data[0])


@router.patch("/{facility_id}", response_model=Facility)
async def update_facility(
    facility_id: str,
    data: FacilityUpdate,
    current_user=Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    patch = {k: v for k, v in data.model_dump().items() if v is not None}
    if not patch:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.table("facilities").update(patch).eq("id", facility_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Facility not found")
    return Facility(**result.data[0])


@router.delete("/{facility_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_facility(
    facility_id: str,
    current_user=Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    await db.table("facilities").delete().eq("id", facility_id).execute()
    logger.info("Facility deleted by %s: %s", current_user.id, facility_id)


@router.post("/upload-photo", status_code=status.HTTP_200_OK)
async def upload_photo(
    file: UploadFile = File(...),
    current_user=Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    """Upload a facility photo to Supabase storage."""
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large (max 5MB)")
    if not is_valid_image(content):
        raise HTTPException(status_code=400, detail="Invalid image file")
    ext = (file.filename or "photo").rsplit(".", 1)[-1].lower()
    if ext not in {"jpg", "jpeg", "png", "webp"}:
        ext = "jpg"
    filename = f"facilities/{uuid.uuid4()}.{ext}"
    content_type = file.content_type or f"image/{ext}"
    await db.storage.from_("article-images").upload(
        filename, content, file_options={"content-type": content_type}
    )
    url = await db.storage.from_("article-images").get_public_url(filename)
    return {"url": url}
