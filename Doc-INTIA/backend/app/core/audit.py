from sqlalchemy import (
    Column, Integer, String, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship, Session
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, Any

from app.core.database import Base

# Action constants
ACTION_CREATE = "CREATE"
ACTION_READ = "READ"
ACTION_UPDATE = "UPDATE"
ACTION_DELETE = "DELETE"
ACTION_LOGIN = "LOGIN"
ACTION_LOGOUT = "LOGOUT"

# Resource type constants
RESOURCE_CLIENT = "client"
RESOURCE_POLICY = "policy"
RESOURCE_USER = "user"
RESOURCE_BRANCH = "branch"


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False, index=True
    )
    action = Column(String(20), nullable=False, index=True)
    resource_type = Column(String(50), nullable=False, index=True)
    resource_id = Column(Integer, nullable=False, index=True)
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    timestamp = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
        index=True
    )
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="audit_logs")

    def __repr__(self):
        return (
            f"<AuditLog(id={self.id}, user_id={self.user_id}, "
            f"action='{self.action}', "
            f"resource_type='{self.resource_type}')>"
        )


def serialize_for_json(obj: Any) -> Any:
    """Convert non-serializable objects to JSON-compatible types."""
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    elif isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, dict):
        return {
            key: serialize_for_json(value)
            for key, value in obj.items()
        }
    elif isinstance(obj, list):
        return [serialize_for_json(item) for item in obj]
    else:
        return obj


def log_action(
    db_session: Session,
    user_id: int,
    action: str,
    resource_type: str,
    resource_id: int,
    old_values: Optional[dict] = None,
    new_values: Optional[dict] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> AuditLog:
    """Log an action to the audit log."""
    # Serialize date/datetime objects to strings for JSON storage
    serialized_old_values = (
        serialize_for_json(old_values) if old_values else None
    )
    serialized_new_values = (
        serialize_for_json(new_values) if new_values else None
    )

    audit_log = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        old_values=serialized_old_values,
        new_values=serialized_new_values,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db_session.add(audit_log)
    db_session.commit()
    db_session.refresh(audit_log)
    return audit_log
