from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.core.security import get_current_user
from app.services.policy_service import PolicyService
from app.schemas.policy import (
    PolicyCreate,
    PolicyUpdate,
    PolicyResponse,
    PolicyList
)

router = APIRouter()

@router.get("/", response_model=PolicyList)
def read_policies(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    client_id: Optional[int] = None,
    status: Optional[str] = Query(None, regex="^(active|pending|cancelled|expired)$"),
    branch_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of policies with pagination and filtering."""
    policy_service = PolicyService(db)

    policies = policy_service.get_policies(
        current_user=current_user,
        skip=skip,
        limit=limit,
        client_id=client_id,
        status=status,
        branch_id=branch_id
    )

    total_count = policy_service.get_policy_count(
        current_user=current_user,
        client_id=client_id,
        status=status,
        branch_id=branch_id
    )

    total_pages = (total_count + limit - 1) // limit

    return PolicyList(
        data=[PolicyResponse.model_validate(policy) for policy in policies],
        meta={
            "page": (skip // limit) + 1,
            "per_page": limit,
            "total": total_count,
            "total_pages": total_pages
        }
    )

@router.post("/", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
def create_policy(
    policy: PolicyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new insurance policy."""
    policy_service = PolicyService(db)
    created_policy = policy_service.create_policy(policy, current_user)
    return PolicyResponse.model_validate(created_policy)

@router.get("/{policy_id}", response_model=PolicyResponse)
def read_policy(
    policy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific policy."""
    policy_service = PolicyService(db)
    policy = policy_service.get_policy_by_id(policy_id, current_user)
    return PolicyResponse.model_validate(policy)

@router.put("/{policy_id}", response_model=PolicyResponse)
def update_policy(
    policy_id: int,
    policy_update: PolicyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing policy."""
    policy_service = PolicyService(db)
    updated_policy = policy_service.update_policy(policy_id, policy_update, current_user)
    return PolicyResponse.model_validate(updated_policy)

@router.delete("/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_policy(
    policy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a policy."""
    policy_service = PolicyService(db)
    policy_service.delete_policy(policy_id, current_user)
    return {"message": "Policy deleted successfully"}
