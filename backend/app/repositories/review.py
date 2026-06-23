"""Review repository."""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.review import Review


class ReviewRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_product(self, product_id: uuid.UUID, page: int = 1, size: int = 10) -> tuple[list[Review], int]:
        count_stmt = select(func.count(Review.id)).where(Review.product_id == product_id)
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0

        stmt = select(Review).where(Review.product_id == product_id).order_by(Review.created_at.desc())
        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)
        result = await self.db.execute(stmt)
        reviews = list(result.scalars().all())
        return reviews, total

    async def get_all(self) -> list[Review]:
        stmt = select(Review).order_by(Review.created_at.desc())
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, review_id: uuid.UUID) -> Review | None:
        return await self.db.get(Review, review_id)

    async def create(self, user_id: uuid.UUID | None, product_id: uuid.UUID, user_name: str, rating: int, comment: str | None) -> Review:
        review = Review(
            user_id=user_id,
            product_id=product_id,
            user_name=user_name,
            rating=rating,
            comment=comment,
        )
        self.db.add(review)
        await self.db.flush()
        return review

    async def moderate(self, review_id: uuid.UUID) -> Review | None:
        review = await self.get_by_id(review_id)
        if not review:
            return None
        review.is_moderated = True
        await self.db.flush()
        return review

    async def delete(self, review_id: uuid.UUID) -> bool:
        review = await self.get_by_id(review_id)
        if not review:
            return False
        await self.db.delete(review)
        await self.db.flush()
        return True
