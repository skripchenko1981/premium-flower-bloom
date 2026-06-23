from typing import Optional, List, Type, TypeVar, Generic
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from sqlalchemy.sql import Select
from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def create(self, **kwargs) -> ModelType:
        instance = self.model(**kwargs)
        self.session.add(instance)
        await self.session.flush()
        return instance

    async def get(self, id: int) -> Optional[ModelType]:
        result = await self.session.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[dict] = None,
        order_by: Optional[str] = None,
        descending: bool = False,
    ) -> tuple[List[ModelType], int]:
        query = select(self.model)
        count_query = select(func.count()).select_from(self.model)

        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key) and value is not None:
                    query = query.where(getattr(self.model, key) == value)
                    count_query = count_query.where(getattr(self.model, key) == value)

        # Count total
        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        # Ordering
        if order_by and hasattr(self.model, order_by):
            order_col = getattr(self.model, order_by)
            query = query.order_by(order_col.desc() if descending else order_col)

        # Pagination
        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        items = list(result.scalars().all())

        return items, total

    async def update(self, id: int, **kwargs) -> Optional[ModelType]:
        instance = await self.get(id)
        if not instance:
            return None
        for key, value in kwargs.items():
            if hasattr(instance, key) and value is not None:
                setattr(instance, key, value)
        await self.session.flush()
        return instance

    async def delete(self, id: int) -> bool:
        instance = await self.get(id)
        if not instance:
            return False
        await self.session.delete(instance)
        await self.session.flush()
        return True
