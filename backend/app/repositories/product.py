"""Product repository."""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.product import Product, ProductImage


class ProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        page: int = 1,
        size: int = 12,
        search: str | None = None,
        category_slug: str | None = None,
        category_id: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        sort_by: str | None = None,
        sort_desc: bool = False,
        active_only: bool = True,
    ) -> tuple[list[Product], int]:
        stmt = select(Product).options(joinedload(Product.images), joinedload(Product.category_rel))

        # Count query
        count_stmt = select(func.count(Product.id))

        if active_only:
            stmt = stmt.where(Product.is_active == True)
            count_stmt = count_stmt.where(Product.is_active == True)

        if category_slug:
            from app.models.category import Category
            stmt = stmt.join(Category, Product.category_id == Category.id).where(Category.slug == category_slug)
            count_stmt = count_stmt.join(Category, Product.category_id == Category.id).where(Category.slug == category_slug)

        if category_id:
            stmt = stmt.where(Product.category_id == uuid.UUID(category_id))
            count_stmt = count_stmt.where(Product.category_id == uuid.UUID(category_id))

        if search:
            search_term = f"%{search}%"
            stmt = stmt.where(Product.name.ilike(search_term) | Product.description.ilike(search_term))
            count_stmt = count_stmt.where(Product.name.ilike(search_term) | Product.description.ilike(search_term))

        if min_price is not None:
            stmt = stmt.where(Product.price >= min_price)
            count_stmt = count_stmt.where(Product.price >= min_price)

        if max_price is not None:
            stmt = stmt.where(Product.price <= max_price)
            count_stmt = count_stmt.where(Product.price <= max_price)

        # Sorting
        if sort_by == "price":
            stmt = stmt.order_by(Product.price.desc() if sort_desc else Product.price.asc())
        elif sort_by == "name":
            stmt = stmt.order_by(Product.name.asc())
        elif sort_by == "created_at":
            stmt = stmt.order_by(Product.created_at.desc() if sort_desc else Product.created_at.asc())
        else:
            stmt = stmt.order_by(Product.created_at.desc())

        # Count
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0

        # Paginate
        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)

        result = await self.db.execute(stmt)
        # Use unique() because of joinedload
        products = list(result.unique().scalars().all())

        return products, total

    async def get_by_id(self, product_id: uuid.UUID) -> Product | None:
        stmt = select(Product).options(joinedload(Product.images), joinedload(Product.category_rel)).where(Product.id == product_id)
        result = await self.db.execute(stmt)
        return result.unique().scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Product | None:
        stmt = select(Product).options(joinedload(Product.images), joinedload(Product.category_rel)).where(Product.slug == slug)
        result = await self.db.execute(stmt)
        return result.unique().scalar_one_or_none()

    async def get_featured(self, limit: int = 8) -> list[Product]:
        stmt = select(Product).options(joinedload(Product.images), joinedload(Product.category_rel)).where(
            Product.featured == True, Product.is_active == True
        ).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.unique().scalars().all())

    async def get_by_category_slug(self, slug: str, page: int = 1, size: int = 12) -> tuple[list[Product], int]:
        from app.models.category import Category
        count_stmt = select(func.count(Product.id)).join(Category, Product.category_id == Category.id).where(
            Category.slug == slug, Product.is_active == True
        )
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0

        stmt = select(Product).options(joinedload(Product.images), joinedload(Product.category_rel)).join(
            Category, Product.category_id == Category.id
        ).where(Category.slug == slug, Product.is_active == True).order_by(Product.created_at.desc())

        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)
        result = await self.db.execute(stmt)
        products = list(result.unique().scalars().all())
        return products, total

    async def create(self, **kwargs) -> Product:
        product = Product(**kwargs)
        self.db.add(product)
        await self.db.flush()
        return product

    async def update(self, product_id: uuid.UUID, **kwargs) -> Product | None:
        product = await self.get_by_id(product_id)
        if not product:
            return None
        for key, value in kwargs.items():
            if value is not None and hasattr(product, key):
                setattr(product, key, value)
        await self.db.flush()
        return product

    async def delete(self, product_id: uuid.UUID) -> bool:
        product = await self.get_by_id(product_id)
        if not product:
            return False
        await self.db.delete(product)
        await self.db.flush()
        return True

    async def add_image(self, product_id: uuid.UUID, url: str, sort_order: int = 0) -> ProductImage:
        img = ProductImage(product_id=product_id, url=url, sort_order=sort_order)
        self.db.add(img)
        await self.db.flush()
        return img
