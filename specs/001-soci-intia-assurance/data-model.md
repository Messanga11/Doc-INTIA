# Data Model: INTIA Assurance Web Application

**Date**: 2025-11-18
**Feature**: 001-soci-intia-assurance

## Overview

The INTIA Assurance system manages insurance clients and policies across three branches. The data model ensures referential integrity, audit compliance, and branch-level access control.

## Entity-Relationship Diagram

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Branch    │     │     Client      │     │     User    │
│-------------│     │-----------------│     │-------------│
│ id (PK)     │◄────┤ branch_id (FK)  │     │ id (PK)     │
│ name        │     │ id (PK)         │     │ username    │
│ code        │     │ first_name      │     │ email       │
│ address     │     │ last_name       │     │ password_hash│
│ phone       │     │ email           │     │ role        │
│ created_at  │     │ phone           │     │ branch_id   │
│ updated_at  │     │ address         │     │ is_active   │
│             │     │ date_of_birth   │     │ created_at  │
│             │     │ created_at      │     │ updated_at  │
│             │     │ updated_at      │     │             │
└─────────────┘     └─────────────────┘     └─────────────┘
        ▲                   ▲                       ▲
        │                   │                       │
        │                   │                       │
        ▼                   ▼                       ▼
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│  Insurance  │     │   Audit Log     │     │  Activity   │
│   Policy    │     │-----------------│     │   Log       │
│-------------│     │-----------------│     │-------------│
│ id (PK)     │     │ id (PK)         │     │ id (PK)     │
│ policy_num  │     │ user_id (FK)    │     │ user_id (FK)│
│ client_id   │     │ action          │     │ action      │
│ branch_id   │     │ resource_type   │     │ timestamp   │
│ type        │     │ resource_id     │     │ details     │
│ coverage    │     │ old_values      │     │ ip_address  │
│ premium     │     │ new_values      │     │ user_agent  │
│ start_date  │     │ timestamp       │     │             │
│ end_date    │     │ ip_address      │     │             │
│ status      │     │ user_agent      │     │             │
│ created_at  │     │                 │     │             │
│ updated_at  │     │                 │     │             │
└─────────────┘     └─────────────────┘     └─────────────┘
```

## Entity Definitions

### Branch
Represents organizational locations with access control boundaries.

**Fields:**
- `id`: INTEGER (Primary Key, Auto-increment)
- `name`: VARCHAR(100) - Full branch name (e.g., "Direction Générale", "INTIA-Douala")
- `code`: VARCHAR(10) - Short code for the branch (e.g., "DG", "DOU", "YDE")
- `address`: TEXT - Physical address of the branch
- `phone`: VARCHAR(20) - Contact phone number
- `created_at`: DATETIME - UTC timestamp
- `updated_at`: DATETIME - UTC timestamp

**Constraints:**
- UNIQUE(code) - Branch codes must be unique
- NOT NULL: name, code

**Relationships:**
- One-to-many with Client (branch_id)
- One-to-many with Insurance Policy (branch_id)
- One-to-many with User (branch_id)

### Client
Represents insurance customers with personal and contact information.

**Fields:**
- `id`: INTEGER (Primary Key, Auto-increment)
- `branch_id`: INTEGER (Foreign Key to Branch)
- `first_name`: VARCHAR(50) - Client's first name
- `last_name`: VARCHAR(50) - Client's last name
- `email`: VARCHAR(255) - Primary email address
- `phone`: VARCHAR(20) - Primary phone number
- `address`: TEXT - Full address
- `date_of_birth`: DATE - Date of birth for age verification
- `created_at`: DATETIME - UTC timestamp
- `updated_at`: DATETIME - UTC timestamp

**Constraints:**
- UNIQUE(email) - Email addresses must be unique across all clients
- FOREIGN KEY(branch_id) REFERENCES Branch(id) ON DELETE RESTRICT
- NOT NULL: branch_id, first_name, last_name, email

**Relationships:**
- Many-to-one with Branch
- One-to-many with Insurance Policy (client_id)

**Business Rules:**
- Cannot delete clients with active insurance policies (referential integrity)

### Insurance Policy
Represents insurance contracts with coverage details and status.

**Fields:**
- `id`: INTEGER (Primary Key, Auto-increment)
- `policy_number`: VARCHAR(50) - Unique policy identifier
- `client_id`: INTEGER (Foreign Key to Client)
- `branch_id`: INTEGER (Foreign Key to Branch)
- `type`: VARCHAR(100) - Type of insurance (e.g., "Auto", "Health", "Property")
- `coverage`: TEXT - Description of coverage details
- `premium`: DECIMAL(10,2) - Monthly/annual premium amount
- `start_date`: DATE - Policy effective start date
- `end_date`: DATE - Policy expiration date
- `status`: VARCHAR(20) - Policy status (active, pending, cancelled, expired)
- `created_at`: DATETIME - UTC timestamp
- `updated_at`: DATETIME - UTC timestamp

**Constraints:**
- UNIQUE(policy_number) - Policy numbers must be unique across all branches
- FOREIGN KEY(client_id) REFERENCES Client(id) ON DELETE RESTRICT
- FOREIGN KEY(branch_id) REFERENCES Branch(id) ON DELETE RESTRICT
- CHECK(start_date < end_date) - Start date must be before end date
- CHECK(status IN ('active', 'pending', 'cancelled', 'expired'))
- NOT NULL: policy_number, client_id, branch_id, type, premium, start_date, end_date, status

**Relationships:**
- Many-to-one with Client
- Many-to-one with Branch

### User
Represents system users with authentication and authorization details.

**Fields:**
- `id`: INTEGER (Primary Key, Auto-increment)
- `username`: VARCHAR(50) - Unique login username
- `email`: VARCHAR(255) - Contact email address
- `password_hash`: VARCHAR(255) - Hashed password using bcrypt
- `role`: VARCHAR(20) - User role (ADMIN, AGENT, VIEWER)
- `branch_id`: INTEGER (Foreign Key to Branch, nullable for ADMIN)
- `is_active`: BOOLEAN - Account status (default: true)
- `created_at`: DATETIME - UTC timestamp
- `updated_at`: DATETIME - UTC timestamp

**Constraints:**
- UNIQUE(username) - Usernames must be unique
- UNIQUE(email) - Email addresses must be unique
- FOREIGN KEY(branch_id) REFERENCES Branch(id) ON DELETE RESTRICT
- CHECK(role IN ('ADMIN', 'AGENT', 'VIEWER'))
- NOT NULL: username, email, password_hash, role, is_active

**Relationships:**
- Many-to-one with Branch (optional for ADMIN users)
- One-to-many with Audit Log (user_id)

**Business Rules:**
- ADMIN users have no branch restriction (branch_id can be null)
- AGENT users can only access data from their assigned branch
- VIEWER users have read-only access within their branch restrictions

### Audit Log
Immutable record of all system activities for compliance and security.

**Fields:**
- `id`: INTEGER (Primary Key, Auto-increment)
- `user_id`: INTEGER (Foreign Key to User)
- `action`: VARCHAR(100) - Action performed (CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT)
- `resource_type`: VARCHAR(50) - Type of resource affected (client, policy, user, branch)
- `resource_id`: INTEGER - ID of the affected resource
- `old_values`: JSON - Previous state (for UPDATE operations)
- `new_values`: JSON - New state (for CREATE/UPDATE operations)
- `timestamp`: DATETIME - UTC timestamp of action
- `ip_address`: VARCHAR(45) - Client IP address (supports IPv4/IPv6)
- `user_agent`: TEXT - Browser/client user agent string

**Constraints:**
- FOREIGN KEY(user_id) REFERENCES User(id) ON DELETE RESTRICT
- NOT NULL: user_id, action, resource_type, timestamp
- No UPDATE operations allowed (immutable)
- No CASCADE DELETE (audit logs must persist)

**Business Rules:**
- All CREATE, UPDATE, DELETE operations on critical entities must be logged
- Authentication events (LOGIN/LOGOUT) must be logged
- Only ADMIN users can access audit logs

## Validation Rules

### Client Validation
- Email format validation using regex pattern
- Phone number format validation (international formats supported)
- Date of birth cannot be in the future
- Required fields: first_name, last_name, email, branch_id

### Policy Validation
- Policy number format: alphanumeric with dashes/underscores
- Premium must be positive decimal
- Start date cannot be in the past (for new policies)
- End date must be after start date
- Status transitions: pending → active/cancelled, active → expired/cancelled

### User Validation
- Username: alphanumeric + underscores, 3-50 characters
- Email format validation
- Password complexity requirements (enforced at creation)
- Role assignment validation based on branch affiliation

## Data Integrity Rules

1. **Referential Integrity**: All foreign key relationships maintained with RESTRICT delete behavior
2. **Unique Constraints**: Email addresses, policy numbers, usernames globally unique
3. **Business Logic Constraints**:
   - Clients cannot be deleted if they have active policies
   - Users cannot be deleted if they have audit log entries
   - Branch deletion requires all associated records to be migrated first
4. **Status Transition Control**: Policy status changes follow defined workflow
5. **Branch Access Control**: Data filtering based on user role and branch assignment

## Indexing Strategy

**Performance Indexes:**
- Client: (email), (branch_id, last_name), (created_at)
- Policy: (policy_number), (client_id), (branch_id, status), (start_date, end_date)
- User: (username), (email), (branch_id, role)
- Audit Log: (timestamp), (user_id, timestamp), (resource_type, resource_id)

**Unique Indexes:**
- Client: (email)
- Policy: (policy_number)
- User: (username), (email)

## Migration Strategy

**Initial Setup:**
1. Create branch records for the three locations
2. Create initial admin user
3. Set up audit logging infrastructure

**Future Extensions:**
- Additional policy types and coverage fields
- Client document attachments
- Policy renewal workflows
- Reporting and analytics tables
