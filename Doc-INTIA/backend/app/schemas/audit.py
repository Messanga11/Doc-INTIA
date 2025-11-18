from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, Any
from datetime import datetime
import json

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    action: str
    resource_type: str
    resource_id: int
    old_values: Optional[dict] = None
    new_values: Optional[dict] = None
    timestamp: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    @field_validator('old_values', 'new_values', mode='before')
    @classmethod
    def parse_json_strings(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return v
        return v

class AuditLogList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    data: list[AuditLogResponse]
    meta: dict
