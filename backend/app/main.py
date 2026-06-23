from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import auth, users, products, orders, reviews, contacts, dashboard, upload


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Create upload dir
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (uploads)
uploads_path = settings.UPLOAD_DIR
os.makedirs(uploads_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

# Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(users.cat_router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(contacts.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(upload.router, prefix="/api/v1")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "flower-shop-api"}
