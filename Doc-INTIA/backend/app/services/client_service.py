from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status

from app.models.client import Client
from app.models.user import User
from app.models.policy import InsurancePolicy
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse
from app.core.security import check_user_access, ROLE_ADMIN
from app.core.audit import log_action, ACTION_CREATE, ACTION_UPDATE, ACTION_DELETE, RESOURCE_CLIENT

class ClientService:
    def __init__(self, db: Session):
        self.db = db

    def get_clients(
        self,
        current_user: User,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        branch_id: Optional[int] = None
    ) -> List[Client]:
        """Get clients with filtering and access control."""
        query = self.db.query(Client)

        # Apply access control
        if current_user.role != ROLE_ADMIN:
            # Non-admin users can only see clients from their branch
            query = query.filter(Client.branch_id == current_user.branch_id)
        elif branch_id:
            # Admin can filter by specific branch
            query = query.filter(Client.branch_id == branch_id)

        # Apply search filter
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Client.first_name.ilike(search_filter),
                    Client.last_name.ilike(search_filter),
                    Client.email.ilike(search_filter)
                )
            )

        return query.offset(skip).limit(limit).all()

    def get_client_count(
        self,
        current_user: User,
        search: Optional[str] = None,
        branch_id: Optional[int] = None
    ) -> int:
        """Get total count of clients for pagination."""
        query = self.db.query(Client)

        # Apply access control
        if current_user.role != ROLE_ADMIN:
            query = query.filter(Client.branch_id == current_user.branch_id)
        elif branch_id:
            query = query.filter(Client.branch_id == branch_id)

        # Apply search filter
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Client.first_name.ilike(search_filter),
                    Client.last_name.ilike(search_filter),
                    Client.email.ilike(search_filter)
                )
            )

        return query.count()

    def get_client_by_id(self, client_id: int, current_user: User) -> Client:
        """Get a specific client by ID with access control."""
        client = self.db.query(Client).filter(Client.id == client_id).first()

        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found"
            )

        # Check access permissions
        if not check_user_access(current_user, branch_id=client.branch_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this client"
            )

        return client

    def create_client(self, client_data: ClientCreate, current_user: User) -> Client:
        """Create a new client."""
        # Check if user can create clients for this branch
        if not check_user_access(current_user, branch_id=client_data.branch_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot create clients for this branch"
            )

        # Check for duplicate email
        existing_client = self.db.query(Client).filter(Client.email == client_data.email).first()
        if existing_client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Client with this email already exists"
            )

        # Create client
        client_dict = client_data.model_dump()
        client = Client(**client_dict)
        self.db.add(client)
        self.db.commit()
        self.db.refresh(client)

        # Log creation
        log_action(
            db_session=self.db,
            user_id=current_user.id,
            action=ACTION_CREATE,
            resource_type=RESOURCE_CLIENT,
            resource_id=client.id,
            new_values=client_dict
        )

        return client

    def update_client(
        self,
        client_id: int,
        client_data: ClientUpdate,
        current_user: User
    ) -> Client:
        """Update an existing client."""
        client = self.get_client_by_id(client_id, current_user)

        # Check if user can update clients for this branch
        update_data = client_data.model_dump(exclude_unset=True)
        new_branch_id = update_data.get('branch_id', client.branch_id)
        if not check_user_access(current_user, branch_id=new_branch_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot update clients for this branch"
            )

        # Check for duplicate email if email is being updated
        if 'email' in update_data and update_data['email'] != client.email:
            existing_client = self.db.query(Client).filter(
                and_(Client.email == update_data['email'], Client.id != client_id)
            ).first()
            if existing_client:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Client with this email already exists"
                )

        # Store old values for audit
        old_values = {
            'branch_id': client.branch_id,
            'first_name': client.first_name,
            'last_name': client.last_name,
            'email': client.email,
            'phone': client.phone,
            'address': client.address,
            'date_of_birth': client.date_of_birth.isoformat() if client.date_of_birth else None
        }

        # Update client
        for field, value in update_data.items():
            setattr(client, field, value)

        self.db.commit()
        self.db.refresh(client)

        # Log update
        log_action(
            db_session=self.db,
            user_id=current_user.id,
            action=ACTION_UPDATE,
            resource_type=RESOURCE_CLIENT,
            resource_id=client.id,
            old_values=old_values,
            new_values=update_data
        )

        return client

    def delete_client(self, client_id: int, current_user: User) -> bool:
        """Delete a client if no active policies exist."""
        client = self.get_client_by_id(client_id, current_user)

        # Check for active policies
        active_policies = self.db.query(InsurancePolicy).filter(
            and_(
                InsurancePolicy.client_id == client_id,
                InsurancePolicy.status == 'active'
            )
        ).count()

        if active_policies > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete client with active insurance policies"
            )

        # Store old values for audit
        old_values = {
            'branch_id': client.branch_id,
            'first_name': client.first_name,
            'last_name': client.last_name,
            'email': client.email,
            'phone': client.phone,
            'address': client.address,
            'date_of_birth': client.date_of_birth.isoformat() if client.date_of_birth else None
        }

        # Delete client
        self.db.delete(client)
        self.db.commit()

        # Log deletion
        log_action(
            db_session=self.db,
            user_id=current_user.id,
            action=ACTION_DELETE,
            resource_type=RESOURCE_CLIENT,
            resource_id=client_id,
            old_values=old_values
        )

        return True
