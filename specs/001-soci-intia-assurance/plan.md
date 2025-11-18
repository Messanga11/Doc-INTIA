# Implementation Plan: INTIA Assurance Web Application

**Branch**: `001-soci-intia-assurance` | **Date**: 2025-11-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-soci-intia-assurance/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a web application for INTIA Assurance to manage client information and insurance policies across three branches (Direction Générale, INTIA-Douala, INTIA-Yaoundé). The application will provide CRUD operations for clients and policies with branch-level access control, implemented using Next.js with Shadcn UI for the frontend, FastAPI for the backend, and SQLite for data persistence.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Python 3.11 (backend), TypeScript/JavaScript (frontend)
**Primary Dependencies**: FastAPI, SQLAlchemy, Pydantic (backend); Next.js 14+, React, Shadcn UI (frontend)
**Storage**: SQLite database with SQLAlchemy ORM
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Modern web browsers, Linux/Windows/Mac development environments
**Project Type**: Web application with separate frontend and backend
**Performance Goals**: API response times <300ms average, 99% availability
**Constraints**: Branch-level data access control, referential integrity, audit logging
**Scale/Scope**: Support for 3 branches with role-based access, client/policy management workflows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ PASS - All Principles Satisfied (Post-Phase 1 Design)

**I. Security-First Architecture**: ✅
- FastAPI supports JWT authentication and role-based permissions
- Branch-level access control can be implemented via middleware
- Audit logging capabilities through FastAPI dependency injection

**II. 3-Tier Architecture**: ✅
- Next.js frontend (presentation layer)
- FastAPI backend (business logic and API layer)
- SQLite database (data persistence layer)
- Strict separation maintained with RESTful communication

**III. Data Integrity & Validation (NON-NEGOTIABLE)**: ✅
- Pydantic models provide comprehensive input validation
- SQLAlchemy ensures referential integrity constraints
- Unique constraints on policy numbers and client emails
- Controlled deletion rules (no cascade deletes for active policies)

**IV. Audit & Compliance**: ✅
- FastAPI dependency injection for automatic audit trail creation
- UTC timestamped immutable logs
- User attribution for all critical operations
- Admin-only audit log access

**V. Performance & Reliability**: ✅
- FastAPI and Next.js provide high performance
- SQLite suitable for expected user load (3-branch insurance company)
- Containerized deployment support
- API response time targets align with <300ms requirement

### ✅ PASS - Technical Constraints Satisfied

**API Architecture**: FastAPI provides RESTful endpoints with JSON responses, CORS protection, and rate limiting capabilities.

**Database Standards**: SQLite with SQLAlchemy provides relational integrity, unique constraints, and controlled foreign key relationships.

**Security Standards**: JWT authentication, password hashing (passlib), role-based permissions with branch restrictions.

**Deployment**: Containerization support for frontend, backend, and database services.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── app/                    # FastAPI application
│   ├── api/               # API routes organized by module
│   │   ├── v1/           # API version 1
│   │   │   ├── endpoints/
│   │   │   │   ├── clients.py
│   │   │   │   ├── policies.py
│   │   │   │   ├── branches.py
│   │   │   │   ├── auth.py
│   │   │   │   └── audit.py
│   │   │   └── api.py    # Main API router
│   ├── core/             # Core functionality
│   │   ├── config.py     # Application configuration
│   │   ├── security.py   # Authentication & authorization
│   │   └── database.py   # Database connection & session
│   ├── models/           # SQLAlchemy models
│   │   ├── client.py
│   │   ├── policy.py
│   │   ├── branch.py
│   │   ├── user.py
│   │   └── audit.py
│   ├── schemas/          # Pydantic schemas
│   │   ├── client.py
│   │   ├── policy.py
│   │   ├── branch.py
│   │   ├── user.py
│   │   └── audit.py
│   ├── services/         # Business logic services
│   │   ├── client_service.py
│   │   ├── policy_service.py
│   │   ├── auth_service.py
│   │   └── audit_service.py
│   ├── utils/            # Utility functions
│   │   ├── validators.py
│   │   └── helpers.py
│   └── main.py           # FastAPI application entry point
├── tests/
│   ├── conftest.py       # Test configuration
│   ├── test_clients.py
│   ├── test_policies.py
│   ├── test_auth.py
│   └── test_audit.py
└── requirements.txt      # Python dependencies

frontend/
├── app/                  # Next.js 14+ app directory
│   ├── (auth)/          # Route groups for authentication
│   │   ├── login/
│   │   └── layout.tsx
│   ├── clients/         # Client management pages
│   │   ├── page.tsx     # Client list
│   │   ├── [id]/       # Client detail/edit
│   │   │   ├── page.tsx
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   └── new/         # Create new client
│   │       └── page.tsx
│   ├── policies/        # Policy management pages
│   │   ├── page.tsx     # Policy list
│   │   ├── [id]/       # Policy detail/edit
│   │   │   ├── page.tsx
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   └── new/         # Create new policy
│   │       └── page.tsx
│   ├── dashboard/       # Main dashboard
│   │   └── page.tsx
│   ├── layout.tsx       # Root layout with navigation
│   └── page.tsx         # Home page
├── components/          # Reusable React components
│   ├── ui/             # Shadcn UI components
│   ├── forms/          # Form components
│   │   ├── ClientForm.tsx
│   │   ├── PolicyForm.tsx
│   │   └── LoginForm.tsx
│   ├── tables/         # Data table components
│   │   ├── ClientTable.tsx
│   │   └── PolicyTable.tsx
│   └── layout/         # Layout components
│       ├── Navigation.tsx
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/                # Utility libraries
│   ├── api.ts          # API client functions
│   ├── auth.ts         # Authentication utilities
│   ├── utils.ts        # General utilities
│   └── validations.ts  # Form validation schemas
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useClients.ts
│   └── usePolicies.ts
├── types/              # TypeScript type definitions
│   ├── client.ts
│   ├── policy.ts
│   ├── user.ts
│   └── api.ts
└── tests/
    ├── components/     # Component tests
    ├── pages/         # Page tests
    └── utils/         # Utility tests

database/
├── migrations/        # Database migration files
└── seed.py           # Database seeding script

docker/                # Docker configuration
├── backend/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   └── Dockerfile
└── docker-compose.yml

docs/                  # Additional documentation
├── api.md            # API documentation
└── deployment.md     # Deployment guide
```

**Structure Decision**: Web application with separate frontend (Next.js with Shadcn UI) and backend (FastAPI) services. Database managed separately with migrations. Containerized deployment using Docker. Clear separation of concerns with dedicated directories for business logic, UI components, and utilities.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
