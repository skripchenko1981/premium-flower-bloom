from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from slugify import slugify
from app.core.database import get_db
from app.core.security import oauth2_scheme, get_current_user_id
from app.repositories.repositories import UserRepository, CategoryRepository
from app.schemas.schemas import (
    CategoryCreate, CategoryUpdate, CategoryResponse,
    UserUpdate, UserResponse, UserListResponse,
)
from app.models.models import UserRole

router = APIRouter(prefix="/users", tags=["users"])


async def require_admin(token: str, db: AsyncSession) -> int:
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.get(user_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user_id


@router.get("/me", response_model=UserResponse)
async def get_profile(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put("/me", response_model=UserResponse)
async def update_profile(
    data: UserUpdate,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.update(user_id, **data.model_dump(exclude_none=True))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


# ========== Categories (Admin) ==========

cat_router = APIRouter(prefix="/categories", tags=["categories"])


@cat_router.get("/", response_model=list[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    repo = CategoryRepository(db)
    return await repo.get_active()


@cat_router.get("/all", response_model=list[CategoryResponse])
async def list_all_categories(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    repo = CategoryRepository(db)
    items, _ = await repo.get_all()
    return items


@cat_router.get("/{id}", response_model=CategoryResponse)
async def get_category(id: int, db: AsyncSession = Depends(get_db)):
    repo = CategoryRepository(db)
    category = await repo.get(id)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@cat_router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    repo = CategoryRepository(db)

    slug = slugify(data.name)
    existing = await repo.get_by_slug(slug)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category with this name already exists")

    return await repo.create(slug=slug, **data.model_dump())


@cat_router.put("/{id}", response_model=CategoryResponse)
async def update_category(
    id: int,
    data: CategoryUpdate,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    repo = CategoryRepository(db)

    update_data = data.model_dump(exclude_none=True)
    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"])

    category = await repo.update(id, **update_data)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@cat_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    id: int,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    repo = CategoryRepository(db)
    deleted = await repo.delete(id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
