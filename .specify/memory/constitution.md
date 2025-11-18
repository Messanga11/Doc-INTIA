# Application Web INTIA Assurance Constitution
<!-- Technical and Functional Constitution for INTIA Assurance Management System -->

## Core Principles

### I. Security-First Architecture
Security is the foundation of all development decisions. Every component must implement authentication, authorization, and audit capabilities. HTTPS is mandatory in production, sensitive data must be hashed, and all critical actions must be logged immutably. Role-based access control (ADMIN, AGENT, VIEWER) must be enforced at all levels.

### II. 3-Tier Architecture
Application follows strict 3-tier separation: Frontend (responsive web interface), Backend API (RESTful services with business logic), and Database (relational with integrity constraints). Each tier communicates only through defined interfaces - no direct database access from frontend, no business logic in presentation layer.

### III. Data Integrity & Validation (NON-NEGOTIABLE)
All data operations must enforce strict validation and integrity constraints. Unique constraints on sensitive fields (email, policy numbers), referential integrity between related entities, controlled status transitions, and comprehensive input validation are mandatory. No data corruption or integrity violation is acceptable.

### IV. Audit & Compliance
Complete audit trail is mandatory for all sensitive operations: user authentication, client/policy CRUD operations, and administrative actions. Audit logs must be immutable, timestamped in UTC, and accessible only to administrators. All changes to critical data must be tracked with user attribution and detailed context.

### V. Performance & Reliability
System must maintain >99% availability with API response times <300ms average. Pagination is mandatory for all large datasets, monitoring and logging infrastructure must be comprehensive. Containerized deployment ensures consistent performance across development, staging, and production environments.

## Technical Constraints & Standards

### API Architecture
- RESTful API with structured endpoints by module (/auth, /users, /clients, /policies, /branches, /audit-logs)
- JSON-only responses with standardized error formats
- Systematic input validation and sanitization
- CORS protection and rate limiting implementation

### Database Standards
- Relational database with enforced referential integrity
- No cascade deletes on audit logs (immutable data protection)
- Unique constraints on business-critical fields
- Controlled foreign key relationships

### Security Standards
- Password hashing with secure algorithms
- JWT/session-based authentication
- Role-based permissions (ADMIN, AGENT, VIEWER) with branch-level restrictions for AGENT role
- HTTPS mandatory in production environments

## Development & Deployment Workflow

### Environment Structure
- **Development**: Local development with full debugging capabilities
- **Staging/Recette**: Pre-production testing environment mirroring production
- **Production**: Live system accessible from three branch locations (Direction Générale, INTIA Douala, INTIA Yaoundé)

### Deployment Requirements
- Containerized infrastructure (backend, frontend, database as separate services)
- Automated daily backups with configurable retention (minimum 14 days)
- Disaster recovery procedures documented and tested
- Monitoring and logging infrastructure for all components

### Quality Gates
- All modules must implement authentication and authorization checks
- Data integrity constraints must be tested before deployment
- Audit logging must be verified for all critical operations
- Performance benchmarks must be met before production release

## Governance

### Constitution Authority
This constitution supersedes all other development practices and architectural decisions. Any violation of these principles must be explicitly justified, documented, and approved by project leadership.

### Compliance Requirements
- All code changes must be reviewed for constitution compliance
- Security-first principle cannot be violated under any circumstances
- Data integrity violations require immediate remediation
- Performance standards must be maintained or improved

### Change Management
- Constitution amendments require: documentation, impact analysis, migration plan, and leadership approval
- Breaking changes to core principles require full regression testing
- New features must align with established architectural patterns

### Accountability
- Development teams are responsible for constitution compliance
- Security violations must be reported immediately
- Performance regressions must be addressed before release

**Version**: 1.0.0 | **Ratified**: 2025-11-18 | **Last Amended**: 2025-11-18
