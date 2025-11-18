from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.models.user import User

# Security constants
SECRET_KEY = "your-secret-key-change-in-production"  # TODO: Move to environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Role constants
ROLE_ADMIN = "ADMIN"
ROLE_AGENT = "AGENT"
ROLE_VIEWER = "VIEWER"

# Security scheme
security = HTTPBearer(auto_error=False)


class TokenData(BaseModel):
    username: Optional[str] = None


def verify_token(token: str, credentials_exception: HTTPException) -> TokenData:
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data


def get_token_from_request(request: Request) -> Optional[str]:
    """Extract token from cookie or Authorization header."""
    # Try cookie first
    token = request.cookies.get("token")
    if token:
        return token
    
    # Try Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    
    return None


def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to get current authenticated user from cookie or header."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Try to get token from cookie or header
    token = get_token_from_request(request)
    
    if not token:
        raise credentials_exception

    token_data = verify_token(token, credentials_exception)

    user = db.query(User).filter(User.username == token_data.username).first()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    return user


def check_user_access(current_user: User, branch_id: Optional[int] = None) -> bool:
    """Check if user has access to a specific branch."""
    # Admin users have access to all branches
    if current_user.role == ROLE_ADMIN:
        return True

    # Non-admin users can only access their own branch
    if branch_id is None:
        return False

    return current_user.branch_id == branch_id


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

