from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.repositories import ContactRepository
from app.schemas.schemas import ContactCreate, ContactResponse
from app.core.security import oauth2_scheme, get_current_user_id
from app.repositories.repositories import UserRepository
from app.models.models import UserRole

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(data: ContactCreate, db: AsyncSession = Depends(get_db)):
    repo = ContactRepository(db)
    return await repo.create(**data.model_dump())


@router.get("/", response_model=list[ContactResponse])
async def list_contacts(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    repo = ContactRepository(db)
    items, _ = await repo.get_all(order_by="created_at", descending=True)
    return items


@router.put("/{id}/read")
async def mark_read(
    id: int,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    repo = ContactRepository(db)
    contact = await repo.update(id, is_read=True)
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    return contact
