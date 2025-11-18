from pydantic import BaseModel, model_validator, ConfigDict
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class PolicyBase(BaseModel):
    policy_number: str
    client_id: int
    type: str
    coverage: str
    premium: Decimal
    start_date: date
    end_date: date

    @model_validator(mode='after')
    def end_date_must_be_after_start_date(self):
        if self.end_date <= self.start_date:
            raise ValueError('end_date must be after start_date')
        return self


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(BaseModel):
    type: Optional[str] = None
    coverage: Optional[str] = None
    premium: Optional[Decimal] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None

    @model_validator(mode='after')
    def end_date_must_be_after_start_date(self):
        if (self.start_date and self.end_date and
                self.end_date <= self.start_date):
            raise ValueError('end_date must be after start_date')
        return self


class PolicyResponse(PolicyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    branch_id: int
    status: str
    created_at: datetime
    updated_at: datetime


class PolicyList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    data: list[PolicyResponse]
    meta: dict
