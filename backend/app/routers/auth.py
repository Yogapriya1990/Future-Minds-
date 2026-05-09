import secrets

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.google import get_google_auth_url, get_google_tokens, get_google_user
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.refresh_token import RefreshToken
from app.models.user import User, UserRole, SubscriptionTier
from app.schemas.auth import ProfileUpdate, RegisterRequest, Token, UserResponse

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(
        email=req.email,
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role=UserRole.student,
        subscription_tier=SubscriptionTier.free,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
async def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not user.hashed_password or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
async def refresh(body: dict, db: Session = Depends(get_db)):
    token = body.get("refresh_token")
    if not token:
        raise HTTPException(status_code=400, detail="refresh_token required")
    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = int(payload["sub"])
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access_token = create_access_token({"sub": str(user.id)})
    new_refresh = create_refresh_token({"sub": str(user.id)})
    return Token(access_token=access_token, refresh_token=new_refresh)


@router.post("/logout")
async def logout(body: dict, db: Session = Depends(get_db)):
    token = body.get("refresh_token")
    if token:
        rt = db.query(RefreshToken).filter(RefreshToken.token == token).first()
        if rt:
            rt.revoked = True
            db.commit()
    return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_profile(
    body: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.full_name is not None:
        current_user.full_name = body.full_name
    if body.avatar_url is not None:
        current_user.avatar_url = body.avatar_url
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/google")
async def google_login():
    state = secrets.token_urlsafe(16)
    url = get_google_auth_url(state)
    return RedirectResponse(url)


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    try:
        tokens = await get_google_tokens(code)
        google_user = await get_google_user(tokens["access_token"])
    except Exception:
        raise HTTPException(status_code=400, detail="Google OAuth failed")

    google_id = google_user.get("id")
    email = google_user.get("email")
    name = google_user.get("name")

    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
        else:
            user = User(
                email=email,
                google_id=google_id,
                full_name=name,
                role=UserRole.student,
                subscription_tier=SubscriptionTier.free,
            )
            db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    redirect_url = f"{settings.FRONTEND_URL}/dashboard?access_token={access_token}&refresh_token={refresh_token}"
    return RedirectResponse(redirect_url)
