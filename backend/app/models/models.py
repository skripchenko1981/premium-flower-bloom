import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    CUSTOMER = "customer"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(280), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    old_price = Column(Float, nullable=True)
    stock = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_primary = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    product = relationship("Product", back_populates="images")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, index=True, nullable=False, default=lambda: f"ORD-{uuid.uuid4().hex[:8].upper()}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(SAEnum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    total_amount = Column(Float, nullable=False)
    delivery_address = Column(Text, nullable=False)
    delivery_city = Column(String(100), nullable=False)
    delivery_phone = Column(String(20), nullable=False)
    delivery_notes = Column(Text, nullable=True)
    payment_method = Column(String(50), nullable=False)
    is_paid = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    is_moderated = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
