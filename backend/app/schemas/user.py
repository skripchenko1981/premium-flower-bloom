"""User Pydantic schemas."""

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    phone: str
    role: str
    is_active: bool
    created_at: str | None = None


class UpdateProfileRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    email: str | None = None
