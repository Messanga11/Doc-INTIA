"""Initialize database with seed data."""
import bcrypt
from datetime import date
from sqlalchemy.orm import Session

from app.core.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.branch import Branch
from app.models.client import Client
from app.models.policy import InsurancePolicy


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def seed_branches(db: Session):
    """Seed branches (succursales)."""
    branches_data = [
        {
            "name": "Succursale Yaoundé",
            "code": "YAO001",
            "address": "Avenue Kennedy, Yaoundé, Cameroun",
            "phone": "+237 6 12 34 56 78"
        },
        {
            "name": "Succursale Douala",
            "code": "DOU001",
            "address": "Boulevard de la Liberté, Douala, Cameroun",
            "phone": "+237 6 23 45 67 89"
        },
        {
            "name": "Succursale Bafoussam",
            "code": "BAF001",
            "address": "Avenue des Alliés, Bafoussam, Cameroun",
            "phone": "+237 6 34 56 78 90"
        },
        {
            "name": "Succursale Garoua",
            "code": "GAR001",
            "address": "Rue du Marché, Garoua, Cameroun",
            "phone": "+237 6 45 67 89 01"
        }
    ]

    created_count = 0
    for branch_data in branches_data:
        existing = db.query(Branch).filter(Branch.code == branch_data["code"]).first()
        if not existing:
            branch = Branch(**branch_data)
            db.add(branch)
            created_count += 1
            print(f"  ✓ Created branch: {branch_data['name']} ({branch_data['code']})")
        else:
            print(f"  - Branch already exists: {branch_data['name']} ({branch_data['code']})")

    if created_count > 0:
        db.commit()
        print(f"✓ Created {created_count} new branch(es)")
    else:
        print("✓ All branches already exist")


def seed_users(db: Session):
    """Seed users (admin and test users)."""
    branches = db.query(Branch).all()
    
    users_data = [
        {
            "username": "admin",
            "email": "admin@intia.com",
            "password": "ChangeMe123!",
            "role": "ADMIN",
            "branch_id": None
        }
    ]

    # Add test users for each branch
    if branches:
        for i, branch in enumerate(branches[:3]):  # Max 3 branches for test users
            users_data.extend([
                {
                    "username": f"agent{branch.code.lower()}",
                    "email": f"agent{branch.code.lower()}@intia.com",
                    "password": "ChangeMe123!",
                    "role": "AGENT",
                    "branch_id": branch.id
                },
                {
                    "username": f"viewer{branch.code.lower()}",
                    "email": f"viewer{branch.code.lower()}@intia.com",
                    "password": "ChangeMe123!",
                    "role": "VIEWER",
                    "branch_id": branch.id
                }
            ])

    created_count = 0
    updated_count = 0
    for user_data in users_data:
        existing = db.query(User).filter(User.username == user_data["username"]).first()
        password_hash = get_password_hash(user_data["password"])
        
        if not existing:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                password_hash=password_hash,
                role=user_data["role"],
                branch_id=user_data["branch_id"],
                is_active=True
            )
            db.add(user)
            created_count += 1
            print(f"  ✓ Created user: {user_data['username']} ({user_data['role']})")
        else:
            # Update password if needed
            if not verify_password(user_data["password"], existing.password_hash):
                existing.password_hash = password_hash
                updated_count += 1
                print(f"  ✓ Updated password for user: {user_data['username']}")
            else:
                print(f"  - User already exists: {user_data['username']}")

    if created_count > 0 or updated_count > 0:
        db.commit()
        if created_count > 0:
            print(f"✓ Created {created_count} new user(s)")
        if updated_count > 0:
            print(f"✓ Updated {updated_count} user password(s)")
    else:
        print("✓ All users already exist")


def seed_clients_and_policies(db: Session):
    """Seed clients and insurance policies."""
    branches = db.query(Branch).all()
    if not branches:
        print("⚠ No branches found, skipping clients and policies")
        return

    # Use first branch for seed data
    branch = branches[0]

    clients_data = [
        {
            "first_name": "Jean",
            "last_name": "Mboum",
            "email": "jean.mboum@example.com",
            "phone": "+237 6 11 22 33 44",
            "address": "Quartier Bastos, Yaoundé",
            "date_of_birth": date(1985, 5, 15),
            "policies": [
                {
                    "policy_number": "POL-2024-001",
                    "type": "Assurance Auto",
                    "coverage": "Couverture complète véhicule",
                    "premium": 150000.00,
                    "start_date": date(2024, 1, 1),
                    "end_date": date(2024, 12, 31),
                    "status": "active"
                }
            ]
        },
        {
            "first_name": "Marie",
            "last_name": "Ndong",
            "email": "marie.ndong@example.com",
            "phone": "+237 6 22 33 44 55",
            "address": "Quartier Akwa, Douala",
            "date_of_birth": date(1990, 8, 20),
            "policies": [
                {
                    "policy_number": "POL-2024-002",
                    "type": "Assurance Habitation",
                    "coverage": "Couverture habitation complète",
                    "premium": 200000.00,
                    "start_date": date(2024, 2, 1),
                    "end_date": date(2025, 1, 31),
                    "status": "active"
                },
                {
                    "policy_number": "POL-2024-003",
                    "type": "Assurance Santé",
                    "coverage": "Couverture santé familiale",
                    "premium": 120000.00,
                    "start_date": date(2024, 3, 1),
                    "end_date": date(2025, 2, 28),
                    "status": "active"
                }
            ]
        },
        {
            "first_name": "Paul",
            "last_name": "Fotso",
            "email": "paul.fotso@example.com",
            "phone": "+237 6 33 44 55 66",
            "address": "Quartier Centre, Bafoussam",
            "date_of_birth": date(1978, 12, 10),
            "policies": [
                {
                    "policy_number": "POL-2024-004",
                    "type": "Assurance Vie",
                    "coverage": "Assurance vie décès",
                    "premium": 300000.00,
                    "start_date": date(2024, 1, 15),
                    "end_date": date(2029, 1, 14),
                    "status": "active"
                }
            ]
        }
    ]

    created_clients = 0
    created_policies = 0

    for client_data in clients_data:
        # Check if client already exists
        existing_client = db.query(Client).filter(Client.email == client_data["email"]).first()
        if existing_client:
            print(f"  - Client already exists: {client_data['first_name']} {client_data['last_name']}")
            continue

        # Extract policies
        policies_data = client_data.pop("policies")

        # Create client
        client = Client(
            branch_id=branch.id,
            **client_data
        )
        db.add(client)
        db.flush()  # Get client ID
        created_clients += 1
        print(f"  ✓ Created client: {client_data['first_name']} {client_data['last_name']}")

        # Create policies for this client
        for policy_data in policies_data:
            existing_policy = db.query(InsurancePolicy).filter(
                InsurancePolicy.policy_number == policy_data["policy_number"]
            ).first()
            if existing_policy:
                continue

            policy = InsurancePolicy(
                client_id=client.id,
                branch_id=branch.id,
                **policy_data
            )
            db.add(policy)
            created_policies += 1
            print(f"    ✓ Created policy: {policy_data['policy_number']} ({policy_data['type']})")

    if created_clients > 0 or created_policies > 0:
        db.commit()
        if created_clients > 0:
            print(f"✓ Created {created_clients} new client(s)")
        if created_policies > 0:
            print(f"✓ Created {created_policies} new policy(ies)")
    else:
        print("✓ All clients and policies already exist")


def init_db():
    """Initialize database tables and seed all data."""
    # Create all tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created\n")

    db: Session = SessionLocal()
    try:
        # Seed branches
        print("Seeding branches...")
        seed_branches(db)
        print()

        # Seed users
        print("Seeding users...")
        seed_users(db)
        print()

        # Seed clients and policies
        print("Seeding clients and policies...")
        seed_clients_and_policies(db)
        print()

    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    print("✓ Database initialization complete!")

