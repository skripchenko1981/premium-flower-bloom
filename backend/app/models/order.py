"""Order and OrderItem models."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), default=None)
    order_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, confirmed, processing, shipped, delivered, cancelled
    subtotal: Mapped[float] = mapped_column(Float, default=0)
    discount: Mapped[float] = mapped_column(Float, default=0)
    promocode: Mapped[str | None] = mapped_column(String(50), default=None)
    shipping_method: Mapped[str] = mapped_column(String(50), default="standard")
    shipping_cost: Mapped[float] = mapped_column(Float, default=0)
    total_amount: Mapped[float] = mapped_column(Float, default=0)
    payment_method: Mapped[str] = mapped_column(String(50), default="card")
    recipient_name: Mapped[str] = mapped_column(String(255), default="")
    recipient_phone: Mapped[str] = mapped_column(String(20), default="")
    recipient_email: Mapped[str | None] = mapped_column(String(255), default=None)
    delivery_address: Mapped[str] = mapped_column(Text, default="")
    delivery_city: Mapped[str] = mapped_column(String(100), default="")
    delivery_date: Mapped[str | None] = mapped_column(String(20), default=None)
    delivery_time: Mapped[str | None] = mapped_column(String(20), default=None)
    delivery_notes: Mapped[str | None] = mapped_column(Text, default=None)
    card_message: Mapped[str | None] = mapped_column(Text, default=None)
    notes: Mapped[str | None] = mapped_column(Text, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "user_id": str(self.user_id) if self.user_id else None,
            "order_number": self.order_number,
            "status": self.status,
            "subtotal": self.subtotal,
            "discount": self.discount,
            "promocode": self.promocode or "",
            "shipping_method": self.shipping_method,
            "shipping_cost": self.shipping_cost,
            "total_amount": self.total_amount,
            "payment_method": self.payment_method,
            "recipient_name": self.recipient_name,
            "recipient_phone": self.recipient_phone,
            "recipient_email": self.recipient_email or "",
            "delivery_address": self.delivery_address,
            "delivery_city": self.delivery_city,
            "delivery_date": self.delivery_date or "",
            "delivery_time": self.delivery_time or "",
            "delivery_notes": self.delivery_notes or "",
            "card_message": self.card_message or "",
            "notes": self.notes or "",
            "items": [item.to_dict() for item in self.items] if self.items else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="SET NULL"), default=None)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    size: Mapped[str | None] = mapped_column(String(10), default=None)
    image_url: Mapped[str | None] = mapped_column(String(500), default=None)

    order = relationship("Order", back_populates="items")
    product_rel = relationship("Product", back_populates="order_items")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "product_id": str(self.product_id) if self.product_id else None,
            "product_name": self.product_name,
            "price": self.price,
            "quantity": self.quantity,
            "size": self.size or "",
            "image_url": self.image_url or "",
        }
