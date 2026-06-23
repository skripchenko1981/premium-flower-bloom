"""Products API endpoints."""

import uuid
import os
import shutil

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import settings
from app.repositories.product import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut, ProductListResponse
from app.api.deps import get_current_admin_user, get_current_user_optional
from app.utils.slug import slugify

router = APIRouter(prefix="/products", tags=["products"])


def _product_to_out(product) -> ProductOut:
    """Convert a product ORM object to its output schema, normalising image format."""
    d = product.to_dict()
    if d.get("images") and isinstance(d["images"], list):
        d["images"] = [img["url"] if isinstance(img, dict) else img for img in d["images"]]
    return ProductOut(**d)


@router.get("", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    search: str | None = None,
    category_id: str | None = None,
    category_slug: str | None = Query(None, alias="category"),
    min_price: float | None = Query(None, alias="min_price"),
    max_price: float | None = Query(None, alias="max_price"),
    sort_by: str | None = Query(None, alias="sort_by"),
    sort_desc: bool = Query(False, alias="sort_desc"),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    products, total = await repo.get_all(
        page=page,
        size=size,
        search=search,
        category_slug=category_slug,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        sort_desc=sort_desc,
        active_only=True,
    )
    items = [_product_to_out(p) for p in products]
    return ProductListResponse(products=items, total=total, page=page, size=size)


@router.get("/featured", response_model=list[ProductOut])
async def get_featured_products(
    limit: int = Query(8, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    products = await repo.get_featured(limit=limit)
    return [_product_to_out(p) for p in products]


@router.get("/category/{slug}", response_model=ProductListResponse)
async def get_products_by_category(
    slug: str,
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    products, total = await repo.get_by_category_slug(slug, page=page, size=size)
    items = [_product_to_out(p) for p in products]
    return ProductListResponse(products=items, total=total, page=page, size=size)


@router.get("/{slug_or_id}", response_model=ProductOut)
async def get_product(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    repo = ProductRepository(db)
    # Try by slug first, then by ID
    product = await repo.get_by_slug(slug_or_id)
    if not product:
        try:
            product = await repo.get_by_id(uuid.UUID(slug_or_id))
        except ValueError:
            pass
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return _product_to_out(product)


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    req: ProductCreate,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    product = await repo.create(
        name=req.name,
        slug=req.slug or slugify(req.name),
        description=req.description,
        price=req.price,
        old_price=req.old_price,
        category_id=uuid.UUID(req.category_id) if req.category_id else None,
        sizes=[s.model_dump() for s in req.sizes] if req.sizes else None,
        in_stock=req.in_stock,
        stock=req.stock,
        featured=req.featured,
        popular=req.popular,
        tags=req.tags,
        care_tips=req.care_tips,
    )
    return _product_to_out(product)


@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    req: ProductUpdate,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    kwargs = req.model_dump(exclude_none=True)
    if "sizes" in kwargs and kwargs["sizes"] is not None:
        kwargs["sizes"] = [s.model_dump() if hasattr(s, "model_dump") else s for s in kwargs["sizes"]]
    if "category_id" in kwargs and kwargs["category_id"]:
        kwargs["category_id"] = uuid.UUID(kwargs["category_id"])

    product = await repo.update(uuid.UUID(product_id), **kwargs)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return _product_to_out(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    deleted = await repo.delete(uuid.UUID(product_id))
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")


@router.post("/{product_id}/images", status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = ProductRepository(db)
    product = await repo.get_by_id(uuid.UUID(product_id))
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Save file
    upload_dir = os.path.join(settings.UPLOAD_DIR, "products")
    os.makedirs(upload_dir, exist_ok=True)

    ext = os.path.splitext(file.filename or "image.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(upload_dir, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = f"/uploads/products/{filename}"
    img = await repo.add_image(product.id, url, sort_order=len(product.images))

    return {"id": str(img.id), "url": url, "sort_order": img.sort_order}
