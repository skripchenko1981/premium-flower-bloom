"""Product Pydantic schemas."""

from pydantic import BaseModel


class SizeItem(BaseModel):
    name: str
    label: str | None = None
    price: float


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str = ""
    price: float
    old_price: float | None = None
    category_id: str | None = None
    sizes: list[SizeItem] | None = None
    in_stock: bool = True
    stock: int = 0
    featured: bool = False
    popular: bool = False
    tags: list[str] | None = None
    care_tips: str | None = None


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    price: float | None = None
    old_price: float | None = None
    category_id: str | None = None
    sizes: list[SizeItem] | None = None
    in_stock: bool | None = None
    stock: int | None = None
    featured: bool | None = None
    popular: bool | None = None
    tags: list[str] | None = None
    care_tips: str | None = None
    is_active: bool | None = None


class ProductImageOut(BaseModel):
    id: str
    url: str
    sort_order: int


class ProductOut(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    price: float
    old_price: float | None
    category_id: str | None
    category: str | None
    category_name: str | None
    images: list[str]
    sizes: list[SizeItem]
    in_stock: bool
    is_active: bool
    stock: int
    featured: bool
    popular: bool
    tags: list[str]
    care_tips: str
    created_at: str | None


class ProductListResponse(BaseModel):
    products: list[ProductOut]
    total: int
    page: int
    size: int
