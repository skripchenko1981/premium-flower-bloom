from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from app.repositories.base import BaseRepository
from app.models.models import (
    User, Category, Product, ProductImage,
    Order, OrderItem, Contact, Review, OrderStatus
)
from app.core.security import get_password_hash
from typing import Optional, List, Tuple


class UserRepository(BaseRepository[User]):
    def __init__(self, session):
        super().__init__(User, session)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def create_with_password(self, **kwargs) -> User:
        password = kwargs.pop("password")
        kwargs["hashed_password"] = get_password_hash(password)
        return await self.create(**kwargs)


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, session):
        super().__init__(Category, session)

    async def get_by_slug(self, slug: str) -> Optional[Category]:
        result = await self.session.execute(
            select(Category).where(Category.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_active(self) -> List[Category]:
        result = await self.session.execute(
            select(Category)
            .where(Category.is_active == True)
            .order_by(Category.sort_order)
        )
        return list(result.scalars().all())


class ProductRepository(BaseRepository[Product]):
    def __init__(self, session):
        super().__init__(Product, session)

    async def get_by_slug(self, slug: str) -> Optional[Product]:
        result = await self.session.execute(
            select(Product)
            .options(joinedload(Product.images), joinedload(Product.category))
            .where(Product.slug == slug)
        )
        return result.unique().scalar_one_or_none()

    async def search(
        self,
        query: str = "",
        category_id: Optional[int] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        is_featured: Optional[bool] = None,
        sort_by: str = "created_at",
        sort_desc: bool = True,
        skip: int = 0,
        limit: int = 12,
    ) -> Tuple[List[Product], int]:
        base_query = select(Product).options(
            joinedload(Product.images), joinedload(Product.category)
        )
        count_query = select(func.count()).select_from(Product)

        conditions = [Product.is_active == True]

        if query:
            conditions.append(Product.name.ilike(f"%{query}%"))
        if category_id:
            conditions.append(Product.category_id == category_id)
        if min_price is not None:
            conditions.append(Product.price >= min_price)
        if max_price is not None:
            conditions.append(Product.price <= max_price)
        if is_featured is not None:
            conditions.append(Product.is_featured == is_featured)

        for cond in conditions:
            base_query = base_query.where(cond)
            count_query = count_query.where(cond)

        # Sorting
        sort_col = getattr(Product, sort_by, Product.created_at)
        base_query = base_query.order_by(sort_col.desc() if sort_desc else sort_col)

        # Count
        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        # Paginate
        base_query = base_query.offset(skip).limit(limit)
        result = await self.session.execute(base_query)
        items = list(result.unique().scalars().all())

        return items, total

    async def get_featured(self, limit: int = 8) -> List[Product]:
        result = await self.session.execute(
            select(Product)
            .options(joinedload(Product.images))
            .where(Product.is_active == True, Product.is_featured == True)
            .order_by(Product.created_at.desc())
            .limit(limit)
        )
        return list(result.unique().scalars().all())

    async def get_by_category(self, category_slug: str, skip: int = 0, limit: int = 12) -> Tuple[List[Product], int]:
        count_query = select(func.count()).select_from(Product).join(Category).where(
            Category.slug == category_slug,
            Product.is_active == True,
        )
        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        result = await self.session.execute(
            select(Product)
            .options(joinedload(Product.images))
            .join(Category)
            .where(Category.slug == category_slug, Product.is_active == True)
            .offset(skip).limit(limit)
        )
        items = list(result.unique().scalars().all())
        return items, total


class OrderRepository(BaseRepository[Order]):
    def __init__(self, session):
        super().__init__(Order, session)

    async def get_with_items(self, id: int) -> Optional[Order]:
        result = await self.session.execute(
            select(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product).joinedload(Product.images))
            .where(Order.id == id)
        )
        return result.unique().scalar_one_or_none()

    async def get_by_user(self, user_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[Order], int]:
        count_query = select(func.count()).select_from(Order).where(Order.user_id == user_id)
        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        result = await self.session.execute(
            select(Order)
            .options(joinedload(Order.items))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .offset(skip).limit(limit)
        )
        items = list(result.unique().scalars().all())
        return items, total

    async def get_revenue_stats(self) -> float:
        result = await self.session.execute(
            select(func.coalesce(func.sum(Order.total_amount), 0))
            .where(Order.status != OrderStatus.CANCELLED)
        )
        return float(result.scalar() or 0)

    async def count_by_status(self, status: OrderStatus) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(Order).where(Order.status == status)
        )
        return result.scalar() or 0


class ContactRepository(BaseRepository[Contact]):
    def __init__(self, session):
        super().__init__(Contact, session)


class ReviewRepository(BaseRepository[Review]):
    def __init__(self, session):
        super().__init__(Review, session)

    async def get_by_product(self, product_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[Review], int]:
        count_query = select(func.count()).select_from(Review).where(
            Review.product_id == product_id,
            Review.is_moderated == True,
        )
        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        result = await self.session.execute(
            select(Review)
            .options(joinedload(Review.user))
            .where(Review.product_id == product_id, Review.is_moderated == True)
            .order_by(Review.created_at.desc())
            .offset(skip).limit(limit)
        )
        items = list(result.unique().scalars().all())
        return items, total
