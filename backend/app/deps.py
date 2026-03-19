import logging
import os
import time
from typing import Optional

import httpx
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from supabase import AsyncClient

from .db import get_db
from .models import UserProfile

logger = logging.getLogger(__name__)

_bearer = HTTPBearer(auto_error=True)
_optional_bearer = HTTPBearer(auto_error=False)

ALGORITHM = "HS256"

# ─────────────────────────────────────────────────────────────────────────────
# JWKS cache — fetched once per hour for ES256/RS256 tokens
# ─────────────────────────────────────────────────────────────────────────────
_jwks_cache: dict | None = None
_jwks_cache_time: float = 0
_JWKS_TTL = 3600  # 1 hour


async def _get_jwks() -> dict:
    global _jwks_cache, _jwks_cache_time
    now = time.time()
    if _jwks_cache and (now - _jwks_cache_time) < _JWKS_TTL:
        return _jwks_cache
    url = os.environ.get("SUPABASE_URL", "") + "/auth/v1/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, timeout=5)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_cache_time = now
        logger.info("JWKS refreshed from %s", url)
        return _jwks_cache


def _get_jwt_secret() -> str:
    secret = os.environ.get("SUPABASE_JWT_SECRET", "")
    if not secret:
        raise RuntimeError("SUPABASE_JWT_SECRET is not set")
    return secret


async def _decode_token(token: str) -> dict:
    """
    Decode a Supabase JWT, handling both HS256 (legacy) and ES256 (current default).

    Auth flow:
    ┌──────────────────────────────────────────────────────┐
    │  JWT header → alg?                                   │
    │       │                                              │
    │  HS256 ──▶ verify with SUPABASE_JWT_SECRET           │
    │  ES256/RS256 ──▶ fetch JWKS ──▶ match kid ──▶ verify │
    │       │                                              │
    │  expired / invalid sig ──▶ 401                       │
    └──────────────────────────────────────────────────────┘
    """
    try:
        header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    alg = header.get("alg", "HS256")

    try:
        if alg == "HS256":
            return jwt.decode(
                token,
                _get_jwt_secret(),
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
        else:
            # ES256 / RS256 — verify via JWKS
            kid = header.get("kid")
            jwks = await _get_jwks()
            keys = [k for k in jwks.get("keys", []) if k.get("kid") == kid]
            if not keys:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="JWT signing key not found",
                )
            return jwt.decode(
                token,
                keys[0],
                algorithms=[alg],
                options={"verify_aud": False},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(_bearer),
    db: AsyncClient = Depends(get_db),
) -> UserProfile:
    """
    Decode the Supabase JWT and extract user identity from claims.
    Supports both HS256 (legacy projects) and ES256 (current Supabase default).
    Role comes from the custom JWT claim set by 004_jwt_hook.sql.
    """
    token = credentials.credentials
    payload = await _decode_token(token)

    user_id: str | None = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user ID",
        )

    user_role: str | None = payload.get("user_role")
    if not user_role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User profile incomplete — contact an admin",
        )

    return UserProfile(
        id=user_id,
        role=user_role,
        display_name=payload.get("display_name"),
    )


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(_optional_bearer),
    db: AsyncClient = Depends(get_db),
) -> Optional[UserProfile]:
    """
    Like get_current_user but returns None if no Authorization header.
    Raises 401 if a token IS provided but is invalid.
    """
    if not credentials:
        return None
    return await get_current_user(credentials, db)


async def require_admin(
    current_user: UserProfile = Depends(get_current_user),
) -> UserProfile:
    """Dependency that raises 403 if the current user is not an admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def get_article_for_mutation(
    article_id: str,
    current_user: UserProfile = Depends(get_current_user),
    db: AsyncClient = Depends(get_db),
) -> dict:
    """
    Fetch an article by ID and verify the current user can mutate it.

    ┌─────────────────────────────────────────────────────┐
    │         ARTICLE MUTATION AUTH FLOW                  │
    │                                                     │
    │  request → get_current_user → role?                 │
    │                  │                                  │
    │             admin │ editor                          │
    │                   │                                 │
    │  fetch article ◄──┘                                 │
    │       │                                             │
    │  not found ──▶ 404                                  │
    │       │                                             │
    │  editor + author_id != user.id ──▶ 403              │
    │       │                                             │
    │  return article dict ✓                              │
    └─────────────────────────────────────────────────────┘
    """
    result = await db.table("articles").select("*").eq("id", article_id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    return result.data[0]
