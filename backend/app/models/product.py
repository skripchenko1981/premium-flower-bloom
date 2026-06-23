"""Product and ProductImage models."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(280), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    price: Mapped[float] = mapped_column(Float, nullable=False)
    old_price: Mapped[float | None] = mapped_column(Float, default=None)
    category_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), default=None)
    sizes: Mapped[list | None] = mapped_column(JSON, default=None)  # [{name, label, price}]
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    popular: Mapped[bool] = mapped_column(Boolean, default=False)
    tags: Mapped[list | None] = mapped_column(JSON, default=None)
    care_tips: Mapped[str | None] = mapped_column(Text, default=None)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    category_rel = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", order_by="ProductImage.sort_order", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product_rel")
    order_items = relationship("OrderItem", back_populates="product_rel")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "price": self.price,
            "old_price": self.old_price,
            "category_id": str(self.category_id) if self.category_id else None,
            "category": self.category_rel.slug if self.category_rel else None,
            "category_name": self.category_rel.name if self.category_rel else None,
            "images": [img.to_dict() for img in self.images] if self.images else [],
            "sizes": self.sizes or [],
            "in_stock": self.in_stock,
            "is_active": self.is_active,
            "stock": self.stock,
            "featured": self.featured,
            "popular": self.popular,
            "tags": self.tags or [],
            "care_tips": self.care_tips or "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    product = relationship("Product", back_populates="images")

    def to_dict(self) -> dict:
        return {"id": str(self.id), "url": self.url, "sort_order": self.sort_order}
