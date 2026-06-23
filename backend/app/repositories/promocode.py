"""Promocode repository."""

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.promocode import Promocode


class PromocodeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_code(self, code: str) -> Promocode | None:
        result = await self.db.execute(select(Promocode).where(Promocode.code == code.upper()))
        return result.scalar_one_or_none()

    async def check_valid(self, code: str) -> Promocode | None:
        promo = await self.get_by_code(code)
        if not promo:
            return None
        if not promo.is_active:
            return None
        if promo.expires_at and promo.expires_at < datetime.now(timezone.utc):
            return None
        if promo.max_uses is not None and promo.used_count >= promo.max_uses:
            return None
        return promo

    async def use(self, code: str) -> Promocode | None:
        promo = await self.check_valid(code)
        if not promo:
            return None
        promo.used_count += 1
        await self.db.flush()
        return promo
