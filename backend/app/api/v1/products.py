from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from slugify import slugify
from app.core.database import get_db
from app.core.config import settings
from app.core.security import oauth2_scheme, get_current_user_id
from app.repositories.repositories import (
    ProductRepository, UserRepository, ProductImage,
)
from app.schemas.schemas import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
)
from app.models.models import UserRole
import os
import shutil
import uuid

router = APIRouter(prefix="/products", tags=["products"])


async def require_admin(token: str, db: AsyncSession) -> int:
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.get(user_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user_id


@router.get("/", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    featured: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_desc: bool = True,
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    skip = (page - 1) * size

    if search or category_id or min_price or max_price or featured is not None:
        products, total = await repo.search(
            query=search or "",
            category_id=category_id,
            min_price=min_price,
            max_price=max_price,
            is_featured=featured,
            sort_by=sort_by,
            sort_desc=sort_desc,
            skip=skip,
            limit=size,
        )
    else:
        products, total = await repo.get_all(
            skip=skip,
            limit=size,
            filters={"is_active": True},
            order_by=sort_by,
            descending=sort_desc,
        )

    return ProductListResponse(
        products=products,
        total=total,
        page=page,
        size=size,
        total_pages=(total + size - 1) // size,
    )


@router.get("/featured", response_model=list[ProductResponse])
async def featured_products(
    limit: int = Query(8, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    return await repo.get_featured(limit)


@router.get("/category/{slug}", response_model=ProductListResponse)
async def products_by_category(
    slug: str,
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    skip = (page - 1) * size
    products, total = await repo.get_by_category(slug, skip=skip, limit=size)

    return ProductListResponse(
        products=products,
        total=total,
        page=page,
        size=size,
        total_pages=(total + size - 1) // size,
    )


@router.get("/{slug}", response_model=ProductResponse)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    repo = ProductRepository(db)
    product = await repo.get_by_slug(slug)
    if not product or not product.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    repo = ProductRepository(db)

    base_slug = slugify(data.name)
    slug = base_slug
    counter = 1
    while True:
        existing = await repo.get_by_slug(slug)
        if not existing:
            break
        slug = f"{base_slug}-{counter}"
        counter += 1

    return await repo.create(slug=slug, **data.model_dump())


@router.put("/{id}", response_model=ProductResponse)
async def update_product(
    id: int,
    data: ProductUpdate,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    repo = ProductRepository(db)

    update_data = data.model_dump(exclude_none=True)
    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"])

    product = await repo.update(id, **update_data)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    id: int,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    repo = ProductRepository(db)
    deleted = await repo.delete(id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")


@router.post("/{id}/images", status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    id: int,
    file: UploadFile = File(...),
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    repo = ProductRepository(db)
    product = await repo.get(id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Validate file
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {ext} not allowed. Allowed: {settings.ALLOWED_EXTENSIONS}",
        )

    # Save file
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    image_url = f"/uploads/{filename}"

    # Check if this is the first image — make it primary
    existing_images, _ = await repo.get_all(filters={"product_id": id})
    is_primary = len(existing_images) == 0

    image = ProductImage(
        product_id=id,
        url=image_url,
        alt_text=file.filename,
        sort_order=len(existing_images),
        is_primary=is_primary,
    )
    db.add(image)
    await db.flush()

    return {"id": image.id, "url": image_url, "is_primary": is_primary}
