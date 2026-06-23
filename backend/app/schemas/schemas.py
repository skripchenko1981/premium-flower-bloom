from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ============ Auth ============

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone: Optional[str] = None


# ============ Users ============

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    page: int
    size: int


# ============ Categories ============

class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Products ============

class ProductImageResponse(BaseModel):
    id: int
    url: str
    alt_text: Optional[str] = None
    sort_order: int
    is_primary: bool

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(gt=0)
    old_price: Optional[float] = None
    stock: int = 0
    category_id: int
    is_featured: bool = False


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    stock: Optional[int] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    slug: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryResponse] = None
    images: List[ProductImageResponse] = []

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    size: int
    total_pages: int


# ============ Orders ============

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    price: float
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    delivery_address: str
    delivery_city: str
    delivery_phone: str
    delivery_notes: Optional[str] = None
    payment_method: str
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: Optional[int]
    status: str
    total_amount: float
    delivery_address: str
    delivery_city: str
    delivery_phone: str
    delivery_notes: Optional[str]
    payment_method: str
    is_paid: bool
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
    total: int
    page: int
    size: int
    total_pages: int


class OrderStatusUpdate(BaseModel):
    status: str


# ============ Reviews ============

class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    user_name: str
    rating: int
    comment: Optional[str]
    is_moderated: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Contacts ============

class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str = Field(min_length=1)


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    subject: Optional[str]
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Dashboard ============

class DashboardStats(BaseModel):
    total_products: int
    total_categories: int
    total_orders: int
    total_users: int
    total_revenue: float
    pending_orders: int
    recent_orders: List[OrderResponse] = []
