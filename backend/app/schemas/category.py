"""Category Pydantic schemas."""

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None
    sort_order: int | None = 0


class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image_url: str | None = None
    sort_order: int | None = None


class CategoryOut(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    image_url: str
    sort_order: int
    is_active: bool
