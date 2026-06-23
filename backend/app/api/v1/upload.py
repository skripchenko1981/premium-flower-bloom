from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
from app.core.security import oauth2_scheme, get_current_user_id
from app.repositories.repositories import UserRepository
from app.models.models import UserRole
import os
import shutil
import uuid

router = APIRouter(prefix="/upload", tags=["upload"])


async def require_admin(token: str, db: AsyncSession) -> int:
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.get(user_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user_id


@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {ext} not allowed. Allowed: {settings.ALLOWED_EXTENSIONS}",
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {"filename": filename, "url": f"/uploads/{filename}", "size": os.path.getsize(filepath)}
