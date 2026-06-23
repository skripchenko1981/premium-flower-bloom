"""Review Pydantic schemas."""

from pydantic import BaseModel


class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    comment: str | None = None


class ReviewOut(BaseModel):
    id: str
    user_id: str | None
    product_id: str
    user_name: str
    rating: int
    comment: str
    is_moderated: bool
    created_at: str | None


class ReviewListResponse(BaseModel):
    reviews: list[ReviewOut]
    total: int
    page: int
    size: int
