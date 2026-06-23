from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.security import oauth2_scheme, get_current_user_id
from app.repositories.repositories import (
    UserRepository, ProductRepository, OrderRepository, CategoryRepository,
)
from app.schemas.schemas import DashboardStats
from app.models.models import UserRole, Order, OrderStatus

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


async def require_admin(token: str, db: AsyncSession) -> int:
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.get(user_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user_id


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)

    product_repo = ProductRepository(db)
    order_repo = OrderRepository(db)
    category_repo = CategoryRepository(db)
    user_repo = UserRepository(db)

    # Counts
    product_items, product_total = await product_repo.get_all(limit=1)
    category_items, category_total = await category_repo.get_all(limit=1)
    order_items, order_total = await order_repo.get_all(limit=1)
    user_items, user_total = await user_repo.get_all(limit=1)

    # Revenue
    total_revenue = await order_repo.get_revenue_stats()

    # Pending orders
    pending_count = await order_repo.count_by_status(OrderStatus.PENDING)

    # Recent orders
    recent_orders, _ = await order_repo.get_all(
        limit=5,
        order_by="created_at",
        descending=True,
    )

    return DashboardStats(
        total_products=product_total,
        total_categories=category_total,
        total_orders=order_total,
        total_users=user_total,
        total_revenue=total_revenue,
        pending_orders=pending_count,
        recent_orders=recent_orders,
    )
