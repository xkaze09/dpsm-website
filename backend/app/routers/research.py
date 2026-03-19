import logging

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import AsyncClient

from ..db import get_db
from ..deps import require_admin
from ..models import ResearchItem, ResearchItemCreate, ResearchItemUpdate, UserProfile

logger = logging.getLogger(__name__)
router = APIRouter()

# Section order for the public response (matches the original JSON order)
_SECTION_ORDER = ["research_projects", "publications", "conferences", "public_service"]

# Maps DB section key → containerId used in research.js
_CONTAINER_ID = {
    "research_projects": "research-projects",
    "publications": "publications",
    "conferences": "conferences",
    "public_service": "public-service",
}


@router.get("")
async def list_research(db: AsyncClient = Depends(get_db)):
    """
    Public endpoint. Returns all research items grouped into SECTIONS
    in the same shape as the original researchData.json so research.js
    needs no changes to its rendering logic.
    """
    result = (
        await db.table("research_items")
        .select("*")
        .order("section")
        .order("sort_order")
        .execute()
    )
    rows = result.data or []

    # Group by section
    by_section: dict[str, list] = {s: [] for s in _SECTION_ORDER}
    for row in rows:
        sec = row.get("section")
        if sec in by_section:
            item: dict = {"title": row["title"], "link": row.get("link") or ""}
            if sec == "research_projects":
                item["authors"] = row.get("authors") or ""
                item["dates"] = row.get("dates") or ""
            else:
                item["citation"] = row.get("citation") or ""
            by_section[sec].append(item)

    sections = [
        {"containerId": _CONTAINER_ID[sec], "items": by_section[sec]}
        for sec in _SECTION_ORDER
    ]
    return {"SECTIONS": sections}


@router.get("/admin", response_model=list[ResearchItem])
async def list_research_admin(
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    """Admin endpoint — returns flat list with full row data (ids, timestamps)."""
    result = (
        await db.table("research_items")
        .select("*")
        .order("section")
        .order("sort_order")
        .execute()
    )
    return [ResearchItem(**row) for row in (result.data or [])]


@router.post("", response_model=ResearchItem, status_code=status.HTTP_201_CREATED)
async def create_research_item(
    data: ResearchItemCreate,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    result = await db.table("research_items").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Insert failed")
    logger.info("Research item created by %s: %s", current_user.id, result.data[0]["id"])
    return ResearchItem(**result.data[0])


@router.patch("/{item_id}", response_model=ResearchItem)
async def update_research_item(
    item_id: str,
    data: ResearchItemUpdate,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    patch = {k: v for k, v in data.model_dump().items() if v is not None}
    if not patch:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.table("research_items").update(patch).eq("id", item_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Item not found")
    return ResearchItem(**result.data[0])


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_research_item(
    item_id: str,
    current_user: UserProfile = Depends(require_admin),
    db: AsyncClient = Depends(get_db),
):
    await db.table("research_items").delete().eq("id", item_id).execute()
    logger.info("Research item deleted by %s: %s", current_user.id, item_id)
