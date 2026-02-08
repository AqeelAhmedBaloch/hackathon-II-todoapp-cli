"""
Authentication router for user registration and login.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.

    - **email**: Valid email address (must be unique)
    - **password**: Minimum 6 characters
    - **full_name**: User's full name

    Returns JWT token and user information.
    """
    # Check if user already exists (case-insensitive)
    existing_user = db.query(User).filter(User.email.ilike(user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token = create_access_token(data={"sub": str(new_user.id)})

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(new_user)
    )


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password.

    - **email**: Registered email address
    - **password**: User password

    Returns JWT token and user information.
    """
    try:
        # Find user by email (case-insensitive)
        user = db.query(User).filter(User.email.ilike(credentials.email)).first()
        if not user:
            logger.warning(f"Login failed: User with email {credentials.email} not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Verify password
        if not verify_password(credentials.password, user.password_hash):
            logger.warning(f"Login failed: Incorrect password for email {credentials.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})

        logger.info(f"Successful login for user: {credentials.email}")
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.from_orm(user)
        )
    except HTTPException:
        # Re-raise HTTP exceptions to keep 401s as 401s
        raise
    except Exception as e:
        logger.error(f"UNEXPECTED ERROR during login for {credentials.email}: {str(e)}", exc_info=True)
        # Re-raise standard 500 so FastAPI handles it, but we've logged it
        raise


# Dependency to get current authenticated user
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_access_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from JWT token.

    Raises 401 if token is invalid or user not found.
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.

    Requires valid JWT token in Authorization header.
    """
    return UserResponse.from_orm(current_user)
