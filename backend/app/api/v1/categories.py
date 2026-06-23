"""Categories API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryOut
from app.api.deps import get_current_admin_user
from app.utils.slug import slugify

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryOut])
async def get_active_categories(db: AsyncSession = Depends(get_db)):
    """Return only active categories (public)."""
    repo = CategoryRepository(db)
    cats = await repo.get_all(active_only=True)
    return [c.to_dict() for c in cats]


@router.get("/all", response_model=list[CategoryOut])
async def get_all_categories(
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all categories including inactive (admin)."""
    repo = CategoryRepository(db)
    cats = await repo.get_all(active_only=False)
    return [c.to_dict() for c in cats]


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(
    req: CategoryCreate,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = CategoryRepository(db)
    slug = slugify(req.name)
    # Ensure unique slug
    existing = await repo.get_by_slug(slug)
    if existing:
        slug = f"{slug}-{hash(req.name) % 1000}"

    cat = await repo.create(
        name=req.name,
        slug=slug,
        description=req.description,
        image_url=req.image_url,
        sort_order=req.sort_order or 0,
    )
    return cat.to_dict()


@router.put("/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: str,
    req: CategoryUpdate,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    import uuid
    repo = CategoryRepository(db)
    cat = await repo.update(uuid.UUID(category_id), **req.model_dump(exclude_none=True))
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return cat.to_dict()


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    import uuid
    repo = CategoryRepository(db)
    deleted = await repo.delete(uuid.UUID(category_id))
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
