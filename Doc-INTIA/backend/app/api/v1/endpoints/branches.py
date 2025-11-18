from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.branch import Branch
from app.core.security import get_current_user
from app.schemas.branch import BranchResponse

router = APIRouter()

@router.get("/", response_model=List[BranchResponse])
def read_branches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all branches."""
    branches = db.query(Branch).all()
    return [BranchResponse.model_validate(branch) for branch in branches]

@router.get("/{branch_id}", response_model=BranchResponse)
def read_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific branch."""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Branch not found"
        )
    return BranchResponse.model_validate(branch)
