"""Contact repository."""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact import ContactMessage


class ContactRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[ContactMessage]:
        stmt = select(ContactMessage).order_by(ContactMessage.created_at.desc())
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, contact_id: uuid.UUID) -> ContactMessage | None:
        return await self.db.get(ContactMessage, contact_id)

    async def create(self, name: str, email: str, message: str, phone: str | None = None, subject: str | None = None) -> ContactMessage:
        contact = ContactMessage(name=name, email=email, message=message, phone=phone, subject=subject)
        self.db.add(contact)
        await self.db.flush()
        return contact

    async def mark_read(self, contact_id: uuid.UUID) -> ContactMessage | None:
        contact = await self.get_by_id(contact_id)
        if not contact:
            return None
        contact.is_read = True
        await self.db.flush()
        return contact

    async def count_unread(self) -> int:
        result = await self.db.execute(
            select(func.count(ContactMessage.id)).where(ContactMessage.is_read == False)
        )
        return result.scalar() or 0
