"""Category repository."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category


class CategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, active_only: bool = True) -> list[Category]:
        stmt = select(Category).order_by(Category.sort_order, Category.name)
        if active_only:
            stmt = stmt.where(Category.is_active == True)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, category_id: uuid.UUID) -> Category | None:
        return await self.db.get(Category, category_id)

    async def get_by_slug(self, slug: str) -> Category | None:
        result = await self.db.execute(select(Category).where(Category.slug == slug))
        return result.scalar_one_or_none()

    async def create(self, name: str, slug: str, description: str | None = None, image_url: str | None = None, sort_order: int = 0) -> Category:
        cat = Category(name=name, slug=slug, description=description, image_url=image_url, sort_order=sort_order)
        self.db.add(cat)
        await self.db.flush()
        return cat

    async def update(self, category_id: uuid.UUID, **kwargs) -> Category | None:
        cat = await self.get_by_id(category_id)
        if not cat:
            return None
        for key, value in kwargs.items():
            if value is not None and hasattr(cat, key):
                setattr(cat, key, value)
        await self.db.flush()
        return cat

    async def delete(self, category_id: uuid.UUID) -> bool:
        cat = await self.get_by_id(category_id)
        if not cat:
            return False
        await self.db.delete(cat)
        await self.db.flush()
        return True

    async def count(self) -> int:
        result = await self.db.execute(select(Category))
        return len(result.scalars().all())
