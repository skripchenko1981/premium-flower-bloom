"""Promocode Pydantic schemas."""

from pydantic import BaseModel


class PromocodeCheckResponse(BaseModel):
    code: str
    discount_percent: float
