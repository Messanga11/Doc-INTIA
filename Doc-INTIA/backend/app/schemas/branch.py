from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class BranchBase(BaseModel):
    name: str
    code: str
    address: str
    phone: str

class BranchCreate(BranchBase):
    pass

class BranchUpdate(BranchBase):
    name: Optional[str] = None
    code: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

class BranchResponse(BranchBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: datetime
