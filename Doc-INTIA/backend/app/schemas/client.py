from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import date, datetime


class ClientBase(BaseModel):
    branch_id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: str
    date_of_birth: Optional[date] = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    branch_id: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None


class ClientResponse(ClientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class ClientList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    data: list[ClientResponse]
    meta: dict
