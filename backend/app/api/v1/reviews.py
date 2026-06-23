from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.core.security import oauth2_scheme
from app.repositories.repositories import ReviewRepository, UserRepository
from app.schemas.schemas import ReviewCreate, ReviewResponse
from app.core.security import get_current_user_id

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    data: ReviewCreate,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    repo = ReviewRepository(db)

    # Check if user already reviewed this product
    existing_reviews, _ = await repo.get_all(filters={
        "product_id": data.product_id,
        "user_id": user_id,
    })
    if existing_reviews:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already reviewed this product",
        )

    review = await repo.create(
        product_id=data.product_id,
        user_id=user_id,
        rating=data.rating,
        comment=data.comment,
        is_moderated=False,
    )
    return review


@router.get("/product/{product_id}", response_model=list[ReviewResponse])
async def get_product_reviews(
    product_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    repo = ReviewRepository(db)
    reviews, _ = await repo.get_by_product(
        product_id,
        skip=(page - 1) * size,
        limit=size,
    )
    return reviews


@router.put("/{id}/moderate")
async def moderate_review(
    id: int,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    if not user or user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    repo = ReviewRepository(db)
    review = await repo.get(id)
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    return await repo.update(id, is_moderated=not review.is_moderated)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    id: int,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    repo = ReviewRepository(db)
    review = await repo.get(id)

    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    # Only author or admin can delete
    if review.user_id != user_id and (not user or user.role != "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    await repo.delete(id)
