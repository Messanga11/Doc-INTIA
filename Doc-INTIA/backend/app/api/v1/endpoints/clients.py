from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.client import Client
from app.core.security import get_current_user
from app.services.client_service import ClientService
from app.schemas.client import (
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientList
)

router = APIRouter()

@router.get("/", response_model=ClientList)
def read_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    branch_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of clients with pagination and filtering."""
    client_service = ClientService(db)

    clients = client_service.get_clients(
        current_user=current_user,
        skip=skip,
        limit=limit,
        search=search,
        branch_id=branch_id
    )

    total_count = client_service.get_client_count(
        current_user=current_user,
        search=search,
        branch_id=branch_id
    )

    total_pages = (total_count + limit - 1) // limit

    return ClientList(
        data=[ClientResponse.model_validate(client) for client in clients],
        meta={
            "page": (skip // limit) + 1,
            "per_page": limit,
            "total": total_count,
            "total_pages": total_pages
        }
    )

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new client."""
    client_service = ClientService(db)
    created_client = client_service.create_client(client, current_user)
    return ClientResponse.model_validate(created_client)

@router.get("/{client_id}", response_model=dict)
def read_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific client with their policies."""
    client_service = ClientService(db)
    client = client_service.get_client_by_id(client_id, current_user)

    # Get associated policies
    policies = db.query(Client).filter(Client.id == client_id).first().policies

    return {
        "client": ClientResponse.model_validate(client),
        "policies": [
            {
                "id": policy.id,
                "policy_number": policy.policy_number,
                "type": policy.type,
                "status": policy.status,
                "premium": policy.premium,
                "start_date": policy.start_date,
                "end_date": policy.end_date
            }
            for policy in policies
        ]
    }

@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: int,
    client_update: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing client."""
    client_service = ClientService(db)
    updated_client = client_service.update_client(client_id, client_update, current_user)
    return ClientResponse.model_validate(updated_client)

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a client."""
    client_service = ClientService(db)
    client_service.delete_client(client_id, current_user)
    return {"message": "Client deleted successfully"}
