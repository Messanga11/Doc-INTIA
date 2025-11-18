from fastapi import APIRouter

from app.api.v1.endpoints import auth, branches, clients, policies, users, audit

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(branches.router, prefix="/branches", tags=["branches"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(policies.router, prefix="/policies", tags=["policies"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(audit.router, prefix="/audit-logs", tags=["audit"])

