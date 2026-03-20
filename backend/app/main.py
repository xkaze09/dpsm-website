import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()  # loads backend/.env when running locally; no-op on Render (env vars set in dashboard)

import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .db import close_db, get_db, init_db
from .limiter import limiter
from .routers import articles, auth, facilities, faculty, research, users

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

SENTRY_DSN = os.getenv("SENTRY_DSN", "")
if SENTRY_DSN:
    sentry_sdk.init(dsn=SENTRY_DSN, traces_sample_rate=0.1)
    logger.info("Sentry initialized")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    logger.info("Supabase AsyncClient initialized")
    yield
    await close_db()
    logger.info("Supabase AsyncClient closed")


_debug = os.getenv("ENV", "production").lower() != "production"
app = FastAPI(
    title="DPSM API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if _debug else None,
    redoc_url="/redoc" if _debug else None,
    openapi_url="/openapi.json" if _debug else None,
)

_origins_raw = os.getenv(
    "CORS_ORIGINS",
    "https://upvdpsm.com,http://localhost:5500,http://localhost:3000,http://127.0.0.1:5500",
)
CORS_ORIGINS = [o.strip() for o in _origins_raw.split(",") if o.strip()]

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(articles.router, prefix="/api/articles", tags=["articles"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(research.router, prefix="/api/research", tags=["research"])
app.include_router(faculty.router, prefix="/api/faculty", tags=["faculty"])
app.include_router(facilities.router, prefix="/api/facilities", tags=["facilities"])

@app.get("/api/health", tags=["health"])
async def health(request: Request):
    db_ok = False
    try:
        db = await get_db()
        await db.table("profiles").select("id").limit(1).execute()
        db_ok = True
    except Exception:
        pass
    status = "ok" if db_ok else "degraded"
    return JSONResponse(
        status_code=200 if db_ok else 503,
        content={"status": status, "version": "1.0.0", "db": db_ok},
    )
