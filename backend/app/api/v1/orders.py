"""Orders API endpoints."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.order import OrderRepository
from app.schemas.order import OrderCreate, OrderOut, OrderListResponse, OrderStatusUpdate
from app.api.deps import get_current_user, get_current_admin_user, get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    req: OrderCreate,
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    repo = OrderRepository(db)

    subtotal = sum(item.price * item.quantity for item in req.items)
    shipping_cost = 0
    if req.shipping_method == "express":
        shipping_cost = 300
    elif req.shipping_method == "standard":
        shipping_cost = 150 if subtotal < 2000 else 0

    total = subtotal + shipping_cost

    order = await repo.create(
        user_id=current_user.id if current_user else None,
        items_data=[item.model_dump() for item in req.items],
        subtotal=subtotal,
        shipping_method=req.shipping_method,
        shipping_cost=shipping_cost,
        total_amount=total,
        payment_method=req.payment_method,
        recipient_name=req.recipient_name,
        recipient_phone=req.delivery_phone,
        recipient_email=req.recipient_email,
        delivery_address=req.delivery_address,
        delivery_city=req.delivery_city,
        delivery_date=req.delivery_date,
        delivery_time=req.delivery_time,
        delivery_notes=req.delivery_notes,
        card_message=req.card_message,
        notes=req.notes,
    )
    return OrderOut(**order.to_dict())


@router.get("", response_model=OrderListResponse)
async def get_orders(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status_filter: str | None = Query(None, alias="status_filter"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's orders (or all orders for admin)."""
    repo = OrderRepository(db)

    if current_user.role == "admin":
        orders, total = await repo.get_all(page=page, size=size, status_filter=status_filter)
    else:
        orders, total = await repo.get_by_user(current_user.id, page=page, size=size)

    items = [OrderOut(**o.to_dict()) for o in orders]
    return OrderListResponse(orders=items, total=total, page=page, size=size)


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = OrderRepository(db)
    order = await repo.get_by_id(uuid.UUID(order_id))
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Check ownership or admin
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return OrderOut(**order.to_dict())


@router.put("/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: str,
    req: OrderStatusUpdate,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = OrderRepository(db)
    order = await repo.update_status(uuid.UUID(order_id), req.status)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return OrderOut(**order.to_dict())
