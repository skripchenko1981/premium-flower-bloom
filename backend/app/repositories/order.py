"""Order repository."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.order import Order, OrderItem


def generate_order_number() -> str:
    """Generate a short order number like FB-1234."""
    import random
    return f"FB-{random.randint(1000, 9999)}"


class OrderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, order_id: uuid.UUID) -> Order | None:
        stmt = select(Order).options(joinedload(Order.items)).where(Order.id == order_id)
        result = await self.db.execute(stmt)
        return result.unique().scalar_one_or_none()

    async def get_by_user(self, user_id: uuid.UUID, page: int = 1, size: int = 10) -> tuple[list[Order], int]:
        count_stmt = select(func.count(Order.id)).where(Order.user_id == user_id)
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0

        stmt = select(Order).options(joinedload(Order.items)).where(Order.user_id == user_id).order_by(Order.created_at.desc())
        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)
        result = await self.db.execute(stmt)
        orders = list(result.unique().scalars().all())
        return orders, total

    async def get_all(self, page: int = 1, size: int = 10, status_filter: str | None = None) -> tuple[list[Order], int]:
        count_stmt = select(func.count(Order.id))
        stmt = select(Order).options(joinedload(Order.items)).order_by(Order.created_at.desc())

        if status_filter:
            count_stmt = count_stmt.where(Order.status == status_filter)
            stmt = stmt.where(Order.status == status_filter)

        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0

        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)
        result = await self.db.execute(stmt)
        orders = list(result.unique().scalars().all())
        return orders, total

    async def create(
        self,
        user_id: uuid.UUID | None,
        items_data: list[dict],
        **kwargs,
    ) -> Order:
        order = Order(
            user_id=user_id,
            order_number=generate_order_number(),
            status="pending",
            **kwargs,
        )
        self.db.add(order)
        await self.db.flush()

        for item_data in items_data:
            order_item = OrderItem(
                order_id=order.id,
                product_id=uuid.UUID(item_data["product_id"]) if isinstance(item_data.get("product_id"), str) and item_data["product_id"] else None,
                product_name=item_data.get("product_name", ""),
                price=item_data.get("price", 0),
                quantity=item_data.get("quantity", 1),
                size=item_data.get("size"),
                image_url=item_data.get("image_url"),
            )
            self.db.add(order_item)

        await self.db.flush()
        return order

    async def update_status(self, order_id: uuid.UUID, status: str) -> Order | None:
        order = await self.get_by_id(order_id)
        if not order:
            return None
        order.status = status
        await self.db.flush()
        return order

    async def count(self) -> int:
        result = await self.db.execute(select(func.count(Order.id)))
        return result.scalar() or 0

    async def sum_revenue(self) -> float:
        result = await self.db.execute(
            select(func.coalesce(func.sum(Order.total_amount), 0)).where(Order.status.in_(["delivered", "shipped", "confirmed"]))
        )
        return float(result.scalar() or 0)

    async def count_pending(self) -> int:
        result = await self.db.execute(
            select(func.count(Order.id)).where(Order.status == "pending")
        )
        return result.scalar() or 0

    async def get_recent(self, limit: int = 5) -> list[Order]:
        stmt = select(Order).order_by(Order.created_at.desc()).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
