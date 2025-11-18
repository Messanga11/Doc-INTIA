from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    username: str
    email: EmailStr
    role: str
    branch_id: Optional[int]
    is_active: bool
    created_at: datetime
    updated_at: datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str  # ADMIN, AGENT, VIEWER
    branch_id: Optional[int] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    branch_id: Optional[int] = None
    is_active: Optional[bool] = None
