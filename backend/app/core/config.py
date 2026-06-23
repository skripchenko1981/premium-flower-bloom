from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    APP_NAME: str = "Flower Shop API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://flower_user:flower_pass@postgres:5432/flower_shop"
    DATABASE_SYNC_URL: str = "postgresql://flower_user:flower_pass@postgres:5432/flower_shop"

    # Security
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "https://flower-shop.local"]

    # Upload
    UPLOAD_DIR: str = "/app/uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp", ".gif"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
