# Tasks: INTIA Assurance Web Application

**Input**: Design documents from `/specs/001-soci-intia-assurance/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/` (FastAPI), `frontend/` (Next.js), `database/` (SQLite)
- Backend follows FastAPI structure: `backend/app/api/v1/endpoints/`, `backend/app/models/`, etc.
- Frontend follows Next.js structure: `frontend/app/`, `frontend/components/`, etc.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure per implementation plan
- [x] T002 Create frontend directory structure per implementation plan
- [x] T003 Create database directory and migration structure
- [x] T004 Initialize Python virtual environment and install FastAPI dependencies
- [x] T005 Initialize Next.js project with Shadcn UI components
- [x] T006 Configure Docker setup for backend, frontend, and database services
- [x] T007 Setup environment configuration files for development and production

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Setup SQLite database with SQLAlchemy engine configuration in backend/app/core/database.py
- [x] T009 [P] Create base SQLAlchemy models (Branch, User) in backend/app/models/branch.py and backend/app/models/user.py
- [x] T010 [P] Implement JWT authentication and authorization in backend/app/core/security.py
- [x] T011 Setup FastAPI application structure with CORS and middleware in backend/app/main.py
- [x] T012 Create Pydantic schemas for authentication in backend/app/schemas/auth.py
- [x] T013 Implement audit logging infrastructure in backend/app/core/audit.py
- [x] T014 Setup database seeding script for initial branches and admin user in database/seed.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Client Information Management (Priority: P1) 🎯 MVP

**Goal**: Enable INTIA employees to add, view, modify, and delete client information with proper branch association

**Independent Test**: Create, read, update, and delete client records through API endpoints, verify data persistence and basic CRUD functionality

### Implementation for User Story 1

- [x] T015 [US1] Create Client SQLAlchemy model in backend/app/models/client.py
- [x] T016 [US1] Create Pydantic schemas for Client CRUD operations in backend/app/schemas/client.py
- [x] T017 [US1] Implement ClientService with business logic in backend/app/services/client_service.py
- [x] T018 [US1] Create client API endpoints (CRUD) in backend/app/api/v1/endpoints/clients.py
- [x] T019 [US1] Add branch-based access control middleware for client operations
- [x] T020 [US1] Integrate audit logging for all client CRUD operations
- [x] T021 [US1] Create Next.js client list page in frontend/app/clients/page.tsx
- [x] T022 [US1] Create Next.js client detail/edit page in frontend/app/clients/[id]/page.tsx
- [x] T023 [US1] Create Next.js add client page in frontend/app/clients/new/page.tsx
- [x] T024 [US1] Create ClientForm React component in frontend/components/forms/ClientForm.tsx
- [x] T025 [US1] Create ClientTable React component in frontend/components/tables/ClientTable.tsx
- [x] T026 [US1] Create API client functions for client operations in frontend/lib/api.ts
- [x] T027 [US1] Add client management navigation to main layout in frontend/app/layout.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Insurance Policy Management (Priority: P2)

**Goal**: Enable INTIA employees to create, view, modify, and delete insurance policies linked to clients

**Independent Test**: Create policies for existing clients, view policy details, modify policy information, and delete policies through API and UI

### Implementation for User Story 2

- [x] T028 [US2] Create Insurance Policy SQLAlchemy model in backend/app/models/policy.py
- [x] T029 [US2] Create Pydantic schemas for Policy CRUD operations in backend/app/schemas/policy.py
- [x] T030 [US2] Implement PolicyService with business logic in backend/app/services/policy_service.py
- [x] T031 [US2] Create policy API endpoints (CRUD) in backend/app/api/v1/endpoints/policies.py
- [x] T032 [US2] Add referential integrity validation (prevent policy creation for non-existent clients)
- [x] T033 [US2] Add branch-based access control for policy operations
- [x] T034 [US2] Integrate audit logging for all policy CRUD operations
- [x] T035 [US2] Create Next.js policy list page in frontend/app/policies/page.tsx
- [x] T036 [US2] Create Next.js policy detail/edit page in frontend/app/policies/[id]/page.tsx
- [x] T037 [US2] Create Next.js add policy page in frontend/app/policies/new/page.tsx
- [x] T038 [US2] Create PolicyForm React component in frontend/components/forms/PolicyForm.tsx
- [x] T039 [US2] Create PolicyTable React component in frontend/components/tables/PolicyTable.tsx
- [x] T040 [US2] Create API client functions for policy operations in frontend/lib/api.ts
- [x] T041 [US2] Add policy management navigation to main layout in frontend/app/layout.tsx
- [x] T042 [US2] Integrate client selection in policy creation forms

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Multi-Branch Access Control (Priority: P3)

**Goal**: Implement branch-level data access restrictions for users from different INTIA locations

**Independent Test**: Verify that Direction Générale users can access all branches, while branch-specific users can only access their authorized data

### Implementation for User Story 3

- [x] T043 [US3] Enhance user authentication to include branch assignment in JWT tokens
- [x] T044 [US3] Implement branch-scoped data filtering middleware in backend
- [x] T045 [US3] Add branch validation to all client and policy operations
- [x] T046 [US3] Create branch API endpoints for branch management in backend/app/api/v1/endpoints/branches.py
- [x] T047 [US3] Create Pydantic schemas for branch operations in backend/app/schemas/branch.py
- [ ] T048 [US3] Implement BranchService for branch management in backend/app/services/branch_service.py
- [x] T049 [US3] Create Next.js branch selection/management interface in frontend/app/branches/
- [x] T050 [US3] Add branch context to user session management in frontend
- [x] T051 [US3] Implement branch-based navigation filtering in frontend components
- [x] T052 [US3] Add visual indicators for branch access restrictions in UI
- [x] T053 [US3] Create user management interface for admin users in frontend/app/admin/users/
- [x] T054 [US3] Implement role-based UI component visibility (ADMIN vs AGENT vs VIEWER)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T055 [P] Create comprehensive API documentation in docs/api.md
- [x] T056 [P] Add input validation and error handling improvements across all endpoints
- [x] T057 [P] Implement pagination for large client/policy lists
- [x] T058 [P] Add search and filtering capabilities to client and policy tables
- [x] T059 [P] Optimize database queries and add proper indexing
- [x] T060 [P] Implement comprehensive error boundaries in React components
- [x] T061 [P] Add loading states and user feedback throughout the application
- [x] T062 [P] Implement audit log viewer for admin users in frontend/app/admin/audit/
- [ ] T063 [P] Add data export functionality (CSV/Excel) for reports
- [ ] T064 [P] Setup automated testing infrastructure with pytest and Jest
- [ ] T065 [P] Add deployment configuration and CI/CD pipeline setup
- [ ] T066 [P] Performance optimization and monitoring setup
- [ ] T067 [P] Security hardening and penetration testing preparation
- [ ] T068 [P] Run quickstart.md validation and update documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Endpoints before frontend components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- Frontend components for a user story can be developed in parallel

---

## Parallel Example: User Story 1

```bash
# Backend API development can proceed in parallel:
Task: "Create Client SQLAlchemy model in backend/app/models/client.py"
Task: "Create Pydantic schemas for Client CRUD operations in backend/app/schemas/client.py"
Task: "Implement ClientService with business logic in backend/app/services/client_service.py"
Task: "Create client API endpoints (CRUD) in backend/app/api/v1/endpoints/clients.py"

# Frontend development can proceed in parallel:
Task: "Create Next.js client list page in frontend/app/clients/page.tsx"
Task: "Create ClientForm React component in frontend/components/forms/ClientForm.tsx"
Task: "Create ClientTable React component in frontend/components/tables/ClientTable.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Client Management)
   - Developer B: User Story 2 (Policy Management)
   - Developer C: User Story 3 (Branch Access Control)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
