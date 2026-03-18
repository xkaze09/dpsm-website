import os

from supabase import AsyncClient, acreate_client

_db: AsyncClient | None = None


async def init_db() -> None:
    global _db
    _db = await acreate_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_ROLE_KEY"],
    )


async def close_db() -> None:
    global _db
    _db = None


async def get_db() -> AsyncClient:
    if _db is None:
        raise RuntimeError("Database client not initialized")
    return _db
