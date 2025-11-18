from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.core.database import get_db
from app.models.user import User
from app.core.security import get_current_user, ROLE_ADMIN
from app.core.audit import AuditLog
from app.schemas.audit import AuditLogResponse, AuditLogList

router = APIRouter()

@router.get("/", response_model=AuditLogList)
def read_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[int] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get audit logs (ADMIN only)."""
    # Only ADMIN users can access audit logs
    if current_user.role != ROLE_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access audit logs"
        )

    query = db.query(AuditLog)

    # Apply filters
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    if action:
        query = query.filter(AuditLog.action == action)
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)
    if start_date:
        query = query.filter(AuditLog.timestamp >= start_date)
    if end_date:
        query = query.filter(AuditLog.timestamp <= end_date)

    # Order by timestamp descending (most recent first)
    query = query.order_by(AuditLog.timestamp.desc())

    total_count = query.count()
    logs = query.offset(skip).limit(limit).all()

    total_pages = (total_count + limit - 1) // limit if limit > 0 else 0

    return AuditLogList(
        data=[AuditLogResponse.model_validate(log) for log in logs],
        meta={
            "page": (skip // limit) + 1 if limit > 0 else 1,
            "per_page": limit,
            "total": total_count,
            "total_pages": total_pages
        }
    )
