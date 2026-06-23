"""Contact Pydantic schemas."""

from pydantic import BaseModel, EmailStr


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    subject: str | None = None
    message: str


class ContactOut(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    subject: str
    message: str
    is_read: bool
    created_at: str | None
