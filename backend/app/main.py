import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()  # loads backend/.env when running locally; no-op on Render (env vars set in dashboard)

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import close_db, init_db
from .routers import articles, auth, chat, users

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


app = FastAPI(title="DPSM API", version="1.0.0", lifespan=lifespan)

_origins_raw = os.getenv(
    "CORS_ORIGINS",
    "https://upvdpsm.com,http://localhost:5500,http://localhost:3000,http://127.0.0.1:5500",
)
CORS_ORIGINS = [o.strip() for o in _origins_raw.split(",") if o.strip()]

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
app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "ok", "version": "1.0.0"}
