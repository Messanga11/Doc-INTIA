# Development Quick Start Guide

**Feature**: INTIA Assurance Web Application
**Branch**: 001-soci-intia-assurance
**Date**: 2025-11-18

## Prerequisites

Before starting development, ensure you have the following installed:

### System Requirements
- **Python**: 3.11 or higher
- **Node.js**: 18.x or higher
- **npm** or **yarn**: Latest stable version
- **Git**: Latest version
- **SQLite3**: Command line tools (usually included with Python)

### Development Tools
- **VS Code** or preferred IDE with TypeScript support
- **Git** for version control
- **Docker** and **Docker Compose** (for containerized development)

## Project Setup

### 1. Clone and Branch Setup
```bash
# Navigate to project root
cd /path/to/afreetech

# Ensure you're on the feature branch
git checkout 001-soci-intia-assurance
```

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (if using Alembic)
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend Dependencies** (requirements.txt):
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

### 3. Frontend Setup (Next.js + Shadcn UI)

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend Dependencies** (package.json):
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-dialog": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "@radix-ui/react-icons": "^1.3.0",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^1.2.2",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-table": "^1.0.3",
    "@radix-ui/react-toast": "^1.1.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.3"
  }
}
```

### 4. Database Setup

```bash
# Initialize SQLite database
cd database
python seed.py  # Run seeding script to create initial data
```

**Initial Data Seeding**:
- Creates the three branches: Direction Générale, INTIA-Douala, INTIA-Yaoundé
- Creates an initial admin user
- Adds sample clients and policies for testing

### 5. Docker Development (Alternative)

```bash
# From project root
docker-compose up --build

# Access services:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

## Development Workflow

### 1. Starting Development

```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Database operations (as needed)
cd database && python seed.py
```

### 2. API Testing

- **Interactive Documentation**: Visit `http://localhost:8000/docs` for Swagger UI
- **Alternative Documentation**: Visit `http://localhost:8000/redoc` for ReDoc
- **Authentication**: Use `/auth/login` endpoint to get JWT token

### 3. Database Operations

```bash
# Create new migration
cd backend && alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### 4. Testing

```bash
# Backend tests
cd backend && python -m pytest

# Frontend tests
cd frontend && npm test

# Integration tests
cd backend && python -m pytest tests/integration/
```

## Environment Configuration

### Backend Environment Variables (.env)

```bash
# Database
DATABASE_URL=sqlite:///./intia_assurance.db

# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Initial Admin User
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@intia-assurance.com
ADMIN_PASSWORD=ChangeMe123!
```

### Frontend Environment Variables (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="INTIA Assurance"
```

## Key Development URLs

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## Common Development Tasks

### Creating a New Client

1. **API Call**:
```bash
curl -X POST "http://localhost:8000/api/v1/clients" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "branch_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+237 123 456 789",
    "address": "123 Main St, Douala, Cameroon",
    "date_of_birth": "1980-01-15"
  }'
```

### Creating a New Policy

1. **API Call**:
```bash
curl -X POST "http://localhost:8000/api/v1/policies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "policy_number": "POL-2025-001",
    "client_id": 1,
    "type": "Auto Insurance",
    "coverage": "Comprehensive coverage for vehicles",
    "premium": 150000.00,
    "start_date": "2025-01-01",
    "end_date": "2025-12-31"
  }'
```

### User Authentication

1. **Login**:
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "ChangeMe123!"
  }'
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000 (frontend) and 8000 (backend) are available
2. **Database Errors**: Check that SQLite database file exists and has proper permissions
3. **CORS Issues**: Verify ALLOWED_ORIGINS in backend configuration
4. **Authentication Errors**: Ensure JWT token is valid and not expired

### Database Reset

```bash
# Remove existing database
rm backend/intia_assurance.db

# Recreate and seed
cd database && python seed.py
```

### Dependency Issues

```bash
# Backend: Reinstall dependencies
cd backend && rm -rf venv && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Frontend: Clear cache and reinstall
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## Branch-Specific Development Notes

- **Direction Générale**: Has access to all branches and administrative functions
- **INTIA-Douala**: Limited to clients and policies from Douala branch
- **INTIA-Yaoundé**: Limited to clients and policies from Yaoundé branch

## Next Steps

1. Review the API documentation at `http://localhost:8000/docs`
2. Test basic CRUD operations for clients and policies
3. Implement frontend components for the user interface
4. Add comprehensive test coverage
5. Set up CI/CD pipeline for automated testing and deployment
