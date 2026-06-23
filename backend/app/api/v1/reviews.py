"""Reviews API endpoints."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.review import ReviewRepository
from app.repositories.product import ProductRepository
from app.schemas.review import ReviewCreate, ReviewOut, ReviewListResponse
from app.api.deps import get_current_user, get_current_admin_user, get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def create_review(
    req: ReviewCreate,
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    # Validate product exists
    product_repo = ProductRepository(db)
    product = await product_repo.get_by_id(uuid.UUID(req.product_id))
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    repo = ReviewRepository(db)
    user_name = f"{current_user.first_name} {current_user.last_name}".strip() if current_user else "Anonymous"
    if not user_name:
        user_name = current_user.email if current_user else "Anonymous"

    review = await repo.create(
        user_id=current_user.id if current_user else None,
        product_id=uuid.UUID(req.product_id),
        user_name=user_name,
        rating=max(1, min(5, req.rating)),
        comment=req.comment,
    )
    return ReviewOut(**review.to_dict())


@router.get("/product/{product_id}", response_model=ReviewListResponse)
async def get_product_reviews(
    product_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    repo = ReviewRepository(db)
    reviews, total = await repo.get_by_product(uuid.UUID(product_id), page=page, size=size)
    items = [ReviewOut(**r.to_dict()) for r in reviews]
    return ReviewListResponse(reviews=items, total=total, page=page, size=size)


@router.put("/{review_id}/moderate", response_model=ReviewOut)
async def moderate_review(
    review_id: str,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = ReviewRepository(db)
    review = await repo.moderate(uuid.UUID(review_id))
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    return ReviewOut(**review.to_dict())


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: str,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = ReviewRepository(db)
    deleted = await repo.delete(uuid.UUID(review_id))
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
