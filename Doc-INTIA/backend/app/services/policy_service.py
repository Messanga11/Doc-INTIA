from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from fastapi import HTTPException, status

from app.models.policy import InsurancePolicy
from app.models.client import Client
from app.models.user import User
from app.schemas.policy import PolicyCreate, PolicyUpdate, PolicyResponse
from app.core.security import check_user_access, ROLE_ADMIN
from app.core.audit import log_action, ACTION_CREATE, ACTION_UPDATE, ACTION_DELETE, RESOURCE_POLICY

class PolicyService:
    def __init__(self, db: Session):
        self.db = db

    def get_policies(
        self,
        current_user: User,
        skip: int = 0,
        limit: int = 20,
        client_id: Optional[int] = None,
        status: Optional[str] = None,
        branch_id: Optional[int] = None
    ) -> List[InsurancePolicy]:
        """Get policies with filtering and access control."""
        query = self.db.query(InsurancePolicy)

        # Apply access control
        if current_user.role != ROLE_ADMIN:
            # Non-admin users can only see policies from their branch
            query = query.filter(InsurancePolicy.branch_id == current_user.branch_id)
        elif branch_id:
            # Admin can filter by specific branch
            query = query.filter(InsurancePolicy.branch_id == branch_id)

        # Apply filters
        if client_id:
            query = query.filter(InsurancePolicy.client_id == client_id)
        if status:
            query = query.filter(InsurancePolicy.status == status)

        return query.offset(skip).limit(limit).all()

    def get_policy_count(
        self,
        current_user: User,
        client_id: Optional[int] = None,
        status: Optional[str] = None,
        branch_id: Optional[int] = None
    ) -> int:
        """Get total count of policies for pagination."""
        query = self.db.query(InsurancePolicy)

        # Apply access control
        if current_user.role != ROLE_ADMIN:
            query = query.filter(InsurancePolicy.branch_id == current_user.branch_id)
        elif branch_id:
            query = query.filter(InsurancePolicy.branch_id == branch_id)

        # Apply filters
        if client_id:
            query = query.filter(InsurancePolicy.client_id == client_id)
        if status:
            query = query.filter(InsurancePolicy.status == status)

        return query.count()

    def get_policy_by_id(self, policy_id: int, current_user: User) -> InsurancePolicy:
        """Get a specific policy by ID with access control."""
        policy = self.db.query(InsurancePolicy).filter(InsurancePolicy.id == policy_id).first()

        if not policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Policy not found"
            )

        # Check access permissions
        if not check_user_access(current_user, branch_id=policy.branch_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this policy"
            )

        return policy

    def create_policy(self, policy_data: PolicyCreate, current_user: User) -> InsurancePolicy:
        """Create a new insurance policy."""
        # Verify client exists and get branch
        client = self.db.query(Client).filter(Client.id == policy_data.client_id).first()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Client not found"
            )

        # Check if user can create policies for this branch
        if not check_user_access(current_user, branch_id=client.branch_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot create policies for this branch"
            )

        # Check for duplicate policy number
        existing_policy = self.db.query(InsurancePolicy).filter(
            InsurancePolicy.policy_number == policy_data.policy_number
        ).first()
        if existing_policy:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Policy number already exists"
            )

        # Create policy
        policy_dict = policy_data.model_dump()
        policy_dict['branch_id'] = client.branch_id
        policy_dict['status'] = 'pending'  # Default status

        policy = InsurancePolicy(**policy_dict)
        self.db.add(policy)
        self.db.commit()
        self.db.refresh(policy)

        # Log creation
        log_action(
            db_session=self.db,
            user_id=current_user.id,
            action=ACTION_CREATE,
            resource_type=RESOURCE_POLICY,
            resource_id=policy.id,
            new_values=policy_dict
        )

        return policy

    def update_policy(
        self,
        policy_id: int,
        policy_data: PolicyUpdate,
        current_user: User
    ) -> InsurancePolicy:
        """Update an existing policy."""
        policy = self.get_policy_by_id(policy_id, current_user)

        # Check if user can update policies for this branch
        if not check_user_access(current_user, branch_id=policy.branch_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot update policies for this branch"
            )

        # Store old values for audit
        old_values = {
            'policy_number': policy.policy_number,
            'client_id': policy.client_id,
            'type': policy.type,
            'coverage': policy.coverage,
            'premium': str(policy.premium),
            'start_date': policy.start_date.isoformat(),
            'end_date': policy.end_date.isoformat(),
            'status': policy.status
        }

        # Update policy
        update_data = policy_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(policy, field, value)

        self.db.commit()
        self.db.refresh(policy)

        # Log update
        log_action(
            db_session=self.db,
            user_id=current_user.id,
            action=ACTION_UPDATE,
            resource_type=RESOURCE_POLICY,
            resource_id=policy.id,
            old_values=old_values,
            new_values=update_data
        )

        return policy

    def delete_policy(self, policy_id: int, current_user: User) -> bool:
        """Delete a policy."""
        policy = self.get_policy_by_id(policy_id, current_user)

        # Check if user can delete policies for this branch
        if not check_user_access(current_user, branch_id=policy.branch_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot delete policies for this branch"
            )

        # Store old values for audit
        old_values = {
            'policy_number': policy.policy_number,
            'client_id': policy.client_id,
            'type': policy.type,
            'coverage': policy.coverage,
            'premium': str(policy.premium),
            'start_date': policy.start_date.isoformat(),
            'end_date': policy.end_date.isoformat(),
            'status': policy.status
        }

        # Delete policy
        self.db.delete(policy)
        self.db.commit()

        # Log deletion
        log_action(
            db_session=self.db,
            user_id=current_user.id,
            action=ACTION_DELETE,
            resource_type=RESOURCE_POLICY,
            resource_id=policy_id,
            old_values=old_values
        )

        return True
