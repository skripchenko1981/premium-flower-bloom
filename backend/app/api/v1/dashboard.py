"""Dashboard API endpoints (admin stats)."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.user import UserRepository
from app.repositories.category import CategoryRepository
from app.repositories.product import ProductRepository
from app.repositories.order import OrderRepository
from app.schemas.dashboard import DashboardStats
from app.api.deps import get_current_admin_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    product_repo = ProductRepository(db)
    category_repo = CategoryRepository(db)
    order_repo = OrderRepository(db)
    user_repo = UserRepository(db)

    total_products, _ = await product_repo.get_all(page=1, size=1, active_only=False)
    total_categories = await category_repo.count()
    total_orders = await order_repo.count()
    total_users = await user_repo.count()
    total_revenue = await order_repo.sum_revenue()
    pending_orders = await order_repo.count_pending()
    recent_orders_raw = await order_repo.get_recent(limit=5)

    recent_orders = []
    for o in recent_orders_raw:
        d = o.to_dict()
        recent_orders.append({
            "id": d["id"],
            "order_number": d["order_number"],
            "total_amount": d["total_amount"],
            "status": d["status"],
            "created_at": d["created_at"],
        })

    return DashboardStats(
        total_products=total_products,
        total_categories=total_categories,
        total_orders=total_orders,
        total_users=total_users,
        total_revenue=total_revenue,
        pending_orders=pending_orders,
        recent_orders=recent_orders,
    )
