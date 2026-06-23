"""Contacts API endpoints."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.contact import ContactRepository
from app.schemas.contact import ContactCreate, ContactOut
from app.api.deps import get_current_admin_user

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.post("", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
async def submit_contact(req: ContactCreate, db: AsyncSession = Depends(get_db)):
    repo = ContactRepository(db)
    contact = await repo.create(
        name=req.name,
        email=req.email,
        message=req.message,
        phone=req.phone,
        subject=req.subject,
    )
    return ContactOut(**contact.to_dict())


@router.get("", response_model=list[ContactOut])
async def get_contacts(
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = ContactRepository(db)
    contacts = await repo.get_all()
    return [ContactOut(**c.to_dict()) for c in contacts]


@router.put("/{contact_id}/read", response_model=ContactOut)
async def mark_contact_read(
    contact_id: str,
    admin: ... = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    repo = ContactRepository(db)
    contact = await repo.mark_read(uuid.UUID(contact_id))
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found")
    return ContactOut(**contact.to_dict())
