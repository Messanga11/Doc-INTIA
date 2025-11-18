# INTIA Assurance Web Application

Système de gestion des clients et polices d'assurance pour INTIA Assurance.

## Architecture

- **Frontend**: Next.js 14+ avec React, TypeScript, Shadcn UI
- **Backend**: FastAPI avec Python 3.12 (⚠️ Python 3.13 n'est pas compatible avec Pydantic v1)
- **Database**: SQLite avec SQLAlchemy ORM

## Structure du Projet

```
Doc-INTIA/
├── backend/          # API FastAPI
│   ├── app/
│   │   ├── api/      # Endpoints API
│   │   ├── core/     # Configuration (DB, security, audit)
│   │   ├── models/   # Modèles SQLAlchemy
│   │   ├── schemas/  # Schémas Pydantic
│   │   └── services/ # Logique métier
│   └── requirements.txt
├── frontend/         # Application Next.js
│   ├── app/          # Pages Next.js App Router
│   ├── components/   # Composants React
│   └── lib/          # Utilitaires
├── database/         # Scripts de base de données
│   └── seed.py       # Script de seeding
└── docker/           # Configuration Docker
```

## Installation

### Installation complète (depuis la racine)

```bash
# Installer toutes les dépendances (backend + frontend)
npm run install:all
```

### Installation séparée

**Backend:**

⚠️ **Important**: Python 3.12 est requis. Python 3.13 n'est pas compatible avec Pydantic v1.

```bash
cd backend

# Si vous utilisez Python 3.13, vous devez utiliser Python 3.12
# Option 1: Avec pyenv
pyenv install 3.12.0
pyenv local 3.12.0

# Option 2: Utiliser directement python3.12
# (remplacez python3 par python3.12 ci-dessous)

python3.12 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Voir `backend/SETUP.md` pour plus de détails sur la configuration de Python.

**Frontend:**

```bash
cd frontend
npm install
```

## Configuration

### Backend

Créez un fichier `.env` dans le dossier `backend/` avec:

```env
DATABASE_URL=sqlite:///./intia_assurance.db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ADMIN_PASSWORD=ChangeMe123!
```

### Frontend

Créez un fichier `.env.local` dans le dossier `frontend/` avec:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="INTIA Assurance"
```

## Démarrage

### 1. Initialiser la base de données

```bash
npm run seed
```

Cela créera:
- 3 succursales (Direction Générale, INTIA-Douala, INTIA-Yaoundé)
- 1 utilisateur admin (username: admin, password: ChangeMe123!)

### 2. Lancer l'application

**Option 1: Lancer les deux services en parallèle (recommandé)**

```bash
npm run dev
```

Cette commande lance automatiquement:
- Le backend FastAPI sur http://localhost:8000
- Le frontend Next.js sur http://localhost:3000

**Option 2: Lancer séparément**

Backend:
```bash
npm run dev:backend
```

Frontend:
```bash
npm run dev:frontend
```

### Accès

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentation API (Swagger)**: http://localhost:8000/docs
- **Documentation API alternative (ReDoc)**: http://localhost:8000/redoc

## Utilisation

1. Accédez à http://localhost:3000/login
2. Connectez-vous avec:
   - Username: `admin`
   - Password: `ChangeMe123!`
3. Naviguez dans l'application pour gérer les clients et polices

## API Endpoints

- `POST /api/v1/auth/login` - Authentification
- `GET /api/v1/auth/me` - Profil utilisateur actuel
- `GET /api/v1/clients` - Liste des clients
- `POST /api/v1/clients` - Créer un client
- `GET /api/v1/clients/{id}` - Détails d'un client
- `PUT /api/v1/clients/{id}` - Modifier un client
- `DELETE /api/v1/clients/{id}` - Supprimer un client
- `GET /api/v1/policies` - Liste des polices
- `POST /api/v1/policies` - Créer une police
- `GET /api/v1/policies/{id}` - Détails d'une police
- `PUT /api/v1/policies/{id}` - Modifier une police
- `DELETE /api/v1/policies/{id}` - Supprimer une police
- `GET /api/v1/branches` - Liste des succursales
- `GET /api/v1/users` - Liste des utilisateurs (ADMIN seulement)
- `GET /api/v1/audit-logs` - Journal d'audit (ADMIN seulement)

## Rôles Utilisateurs

- **ADMIN**: Accès complet à toutes les fonctionnalités et toutes les succursales
- **AGENT**: Gestion des clients et polices de sa succursale uniquement
- **VIEWER**: Consultation en lecture seule de sa succursale

## Notes de Développement

- Le système utilise JWT pour l'authentification
- Toutes les actions sensibles sont enregistrées dans le journal d'audit
- Les mots de passe sont hashés avec bcrypt
- Les contraintes d'intégrité référentielle sont appliquées
