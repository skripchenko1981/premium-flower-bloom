"""User repository."""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.core.security import hash_password


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        return await self.db.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, email: str, password: str, first_name: str = "", last_name: str = "", phone: str | None = None) -> User:
        user = User(
            email=email,
            hashed_password=hash_password(password),
            first_name=first_name,
            last_name=last_name,
            phone=phone,
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def update(self, user_id: uuid.UUID, **kwargs) -> User | None:
        user = await self.get_by_id(user_id)
        if not user:
            return None
        for key, value in kwargs.items():
            if value is not None and hasattr(user, key):
                setattr(user, key, value)
        await self.db.flush()
        return user

    async def count(self) -> int:
        result = await self.db.execute(select(func.count(User.id)))
        return result.scalar() or 0
