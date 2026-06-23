from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.core.security import oauth2_scheme, get_current_user_id
from app.repositories.repositories import (
    OrderRepository, UserRepository, ProductRepository, Product,
)
from app.schemas.schemas import (
    OrderCreate, OrderResponse, OrderListResponse, OrderStatusUpdate,
)
from app.models.models import OrderStatus, UserRole

router = APIRouter(prefix="/orders", tags=["orders"])


async def require_admin(token: str, db: AsyncSession) -> int:
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.get(user_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user_id


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    data: OrderCreate,
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = None
    if token:
        try:
            user_id = await get_current_user_id(token)
        except Exception:
            pass

    order_repo = OrderRepository(db)
    product_repo = ProductRepository(db)

    # Calculate total and validate products
    total_amount = 0.0
    items_data = []
    for item in data.items:
        product = await product_repo.get(item.product_id)
        if not product or not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {item.product_id} not found",
            )
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}",
            )
        total_amount += product.price * item.quantity
        items_data.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "price": product.price,
        })

    order = await order_repo.create(
        user_id=user_id,
        total_amount=total_amount,
        delivery_address=data.delivery_address,
        delivery_city=data.delivery_city,
        delivery_phone=data.delivery_phone,
        delivery_notes=data.delivery_notes,
        payment_method=data.payment_method,
        status=OrderStatus.PENDING,
    )

    # Create order items
    from app.models.models import OrderItem
    for item_data in items_data:
        order_item = OrderItem(order_id=order.id, **item_data)
        db.add(order_item)

    await db.flush()

    # Update stock
    for item in data.items:
        product = await product_repo.get(item.product_id)
        if product:
            await product_repo.update(product.id, stock=product.stock - item.quantity)

    return await order_repo.get_with_items(order.id)


@router.get("/", response_model=OrderListResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status_filter: Optional[str] = None,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.get(user_id)
    order_repo = OrderRepository(db)

    if user and user.role == UserRole.ADMIN:
        filters = {}
        if status_filter:
            filters["status"] = status_filter
        orders, total = await order_repo.get_all(
            skip=(page - 1) * size,
            limit=size,
            filters=filters,
            order_by="created_at",
            descending=True,
        )
    else:
        orders, total = await order_repo.get_by_user(
            user_id,
            skip=(page - 1) * size,
            limit=size,
        )

    return OrderListResponse(
        orders=orders,
        total=total,
        page=page,
        size=size,
        total_pages=(total + size - 1) // size,
    )


@router.get("/{id}", response_model=OrderResponse)
async def get_order(
    id: int,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    repo = OrderRepository(db)
    order = await repo.get_with_items(id)

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Check access
    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    if order.user_id != user_id and (not user or user.role != UserRole.ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return order


@router.put("/{id}/status", response_model=OrderResponse)
async def update_order_status(
    id: int,
    data: OrderStatusUpdate,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(token, db)
    order_repo = OrderRepository(db)

    try:
        new_status = OrderStatus(data.status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed: {[s.value for s in OrderStatus]}",
        )

    order = await order_repo.update(id, status=new_status)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return await order_repo.get_with_items(id)
