from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import (
    create_access_token, create_refresh_token, decode_token,
    verify_password, get_current_user_id, oauth2_scheme,
)
from app.repositories.repositories import UserRepository
from app.schemas.schemas import (
    LoginRequest, RegisterRequest, Token, TokenRefresh, UserResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)

    existing = await repo.get_by_email(request.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = await repo.create_with_password(
        email=request.email,
        password=request.password,
        first_name=request.first_name,
        last_name=request.last_name,
        phone=request.phone,
    )

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=Token)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    user = await repo.get_by_email(request.email)

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
async def refresh_token(request: TokenRefresh):
    payload = decode_token(request.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user_id = payload.get("sub")
    access_token = create_access_token(data={"sub": user_id})
    new_refresh_token = create_refresh_token(data={"sub": user_id})

    return Token(access_token=access_token, refresh_token=new_refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    user_id = await get_current_user_id(token)
    repo = UserRepository(db)
    user = await repo.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
