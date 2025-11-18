# Doc-INTIA - Système de Gestion INTIA Assurance

Système de gestion des clients et polices d'assurance pour INTIA Assurance.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18.0.0 ou supérieure)
- **Python** (version 3.12 recommandée - Python 3.13 n'est pas compatible avec Pydantic v1)
- **npm** (généralement inclus avec Node.js)
- **pip** (généralement inclus avec Python)

## 🚀 Installation rapide

### 1. Cloner le projet (si nécessaire)

```bash
git clone git@github.com:Messanga11/Doc-INTIA.git
cd Doc-INTIA
```

### 2. Installer toutes les dépendances

Depuis la racine du projet, exécutez :
`

```bash
npm install
npm run install:all
```

Cette commande va :

- Installer les dépendances Node.js (concurrently)
- Créer l'environnement virtuel Python pour le backend
- Installer les dépendances Python du backend
- Installer les dépendances Node.js du frontend

### 3. Configuration

#### Backend

Créez un fichier `.env` dans `Doc-INTIA/backend/` :

```env
DATABASE_URL=sqlite:///./intia_assurance.db
SECRET_KEY=your-secret-key-here-change-in-production
JWT_SECRET_KEY=your-jwt-secret-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ADMIN_PASSWORD=ChangeMe123!
```

#### Frontend

Créez un fichier `.env.local` dans `Doc-INTIA/frontend/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="INTIA Assurance"
```

### 4. Initialiser la base de données

```bash
npm run seed
```

Cela créera :

- 3 succursales (Direction Générale, INTIA-Douala, INTIA-Yaoundé)
- 1 utilisateur admin (username: `admin`, password: `ChangeMe123!`)

## ▶️ Lancer le projet

### Option 1 : Lancer les deux services en parallèle (recommandé)

Depuis la racine du projet :

```bash
npm run dev
```

Cette commande lance automatiquement :

- Le backend FastAPI sur http://localhost:8000
- Le frontend Next.js sur http://localhost:3000

### Option 2 : Lancer séparément

**Backend uniquement :**

```bash
npm run dev:backend
```

**Frontend uniquement :**

```bash
npm run dev:frontend
```

## 🌐 Accès à l'application

Une fois l'application lancée :

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **Documentation API (Swagger)** : http://localhost:8000/docs
- **Documentation API alternative (ReDoc)** : http://localhost:8000/redoc

## 🔐 Connexion

1. Accédez à http://localhost:3000/login
2. Connectez-vous avec :
   - **Username** : `admin`
   - **Password** : `ChangeMe123!`

## 📦 Installation manuelle (si nécessaire)

Si l'installation automatique ne fonctionne pas, vous pouvez installer manuellement :

### Backend

```bash
cd Doc-INTIA/backend

# Créer l'environnement virtuel (utiliser Python 3.12)
python3.12 -m venv venv

# Activer l'environnement virtuel
# Sur macOS/Linux :
source venv/bin/activate
# Sur Windows :
# venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

⚠️ **Note importante** : Si vous utilisez Python 3.13, vous devez utiliser Python 3.12. Voir `Doc-INTIA/backend/SETUP.md` pour plus de détails.

### Frontend

```bash
cd Doc-INTIA/frontend
npm install
```

## 🛠️ Scripts disponibles

Depuis la racine du projet :

- `npm run dev` - Lance le backend et le frontend en parallèle
- `npm run dev:backend` - Lance uniquement le backend
- `npm run dev:frontend` - Lance uniquement le frontend
- `npm run install:all` - Installe toutes les dépendances
- `npm run seed` - Initialise la base de données avec des données de test
- `npm run build` - Compile le frontend pour la production
- `npm run start` - Lance l'application en mode production
- `npm run test` - Lance tous les tests (backend + frontend)
- `npm run test:backend` - Lance uniquement les tests du backend
- `npm run test:frontend` - Lance uniquement les tests du frontend

## 🧪 Tests et TDD (Test-Driven Development)

### Philosophie TDD

Le Test-Driven Development (TDD) suit le cycle **Red-Green-Refactor** :

1. **Red** : Écrire un test qui échoue
2. **Green** : Écrire le code minimal pour faire passer le test
3. **Refactor** : Améliorer le code tout en gardant les tests verts

### Installation des outils de test

#### Backend

Les dépendances de test sont déjà incluses dans `requirements.txt` :
- `pytest` : Framework de test Python
- `httpx` : Client HTTP pour tester les endpoints FastAPI

#### Frontend

Installez les dépendances de test :

```bash
cd Doc-INTIA/frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

Ajoutez la configuration Jest dans `package.json` :

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/$1"
    }
  }
}
```

Créez `jest.setup.js` :

```javascript
import '@testing-library/jest-dom';
```

### Structure des tests

```
Doc-INTIA/
├── backend/
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py          # Configuration pytest
│       ├── test_auth.py         # Tests d'authentification
│       ├── test_clients.py      # Tests des clients
│       ├── test_policies.py    # Tests des polices
│       └── test_users.py        # Tests des utilisateurs
└── frontend/
    └── tests/
        ├── components/          # Tests des composants
        ├── pages/              # Tests des pages
        └── utils/              # Tests des utilitaires
```

### Configuration Backend (pytest)

Créez `Doc-INTIA/backend/tests/conftest.py` :

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app

# Base de données de test en mémoire
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db():
    """Créer une base de données de test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    """Créer un client de test FastAPI."""
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def auth_headers(client):
    """Obtenir les headers d'authentification pour les tests."""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "ChangeMe123!"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
```

### Exemple de test Backend (TDD)

**Étape 1 : Red - Écrire le test qui échoue**

Créez `Doc-INTIA/backend/tests/test_clients.py` :

```python
def test_create_client(client, auth_headers):
    """Test de création d'un client."""
    response = client.post(
        "/api/v1/clients",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "+237 6 12 34 56 78",
            "address": "123 Main St",
            "branch_id": 1
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert "id" in data
```

**Étape 2 : Green - Implémenter le code minimal**

Le code dans `app/api/v1/endpoints/clients.py` devrait déjà exister, sinon l'implémenter.

**Étape 3 : Refactor - Améliorer le code**

Améliorer la logique métier, la validation, etc.

### Exemple de test Frontend (TDD)

**Étape 1 : Red - Écrire le test qui échoue**

Créez `Doc-INTIA/frontend/tests/components/ClientForm.test.tsx` :

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientForm } from '@/components/forms/ClientForm';

describe('ClientForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<ClientForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/prénom/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john.doe@example.com' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com'
    });
  });
});
```

**Étape 2 : Green - Implémenter le composant**

**Étape 3 : Refactor - Améliorer le composant**

### Lancer les tests

#### Backend

```bash
cd Doc-INTIA/backend
source venv/bin/activate

# Lancer tous les tests
pytest

# Lancer avec couverture
pytest --cov=app --cov-report=html

# Lancer en mode watch (redémarre automatiquement)
pytest-watch

# Lancer un fichier spécifique
pytest tests/test_clients.py

# Lancer un test spécifique
pytest tests/test_clients.py::test_create_client
```

#### Frontend

```bash
cd Doc-INTIA/frontend

# Lancer tous les tests
npm test

# Lancer en mode watch
npm run test:watch

# Lancer avec couverture
npm run test:coverage
```

#### Depuis la racine

Ajoutez ces scripts dans `package.json` à la racine :

```json
{
  "scripts": {
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && source venv/bin/activate && pytest",
    "test:frontend": "cd frontend && npm test",
    "test:watch": "concurrently \"npm run test:backend -- --watch\" \"npm run test:frontend -- --watch\""
  }
}
```

### Bonnes pratiques TDD

1. **Écrire d'abord le test** : Ne pas écrire de code sans test
2. **Un test = une assertion** : Un test doit vérifier une seule chose
3. **Nommer clairement** : Les noms de tests doivent décrire ce qu'ils testent
4. **Tests indépendants** : Chaque test doit pouvoir s'exécuter seul
5. **Tests rapides** : Les tests doivent s'exécuter rapidement
6. **Couverture de code** : Viser au moins 80% de couverture

### Types de tests

#### Tests unitaires
Testent une fonction ou méthode isolément.

```python
def test_hash_password():
    """Test du hashage de mot de passe."""
    from app.core.security import get_password_hash, verify_password
    password = "test123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed)
    assert not verify_password("wrong", hashed)
```

#### Tests d'intégration
Testent l'interaction entre plusieurs composants.

```python
def test_client_creation_flow(client, auth_headers):
    """Test du flux complet de création d'un client."""
    # Créer un client
    response = client.post("/api/v1/clients", json={...}, headers=auth_headers)
    client_id = response.json()["id"]
    
    # Vérifier qu'il existe
    response = client.get(f"/api/v1/clients/{client_id}", headers=auth_headers)
    assert response.status_code == 200
```

#### Tests end-to-end (E2E)
Testent le flux complet depuis l'interface utilisateur.

Pour les tests E2E, utilisez Playwright ou Cypress :

```bash
# Installer Playwright
cd Doc-INTIA/frontend
npm install --save-dev @playwright/test
npx playwright install
```

### CI/CD avec les tests

Ajoutez un workflow GitHub Actions (`.github/workflows/test.yml`) :

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - run: |
          cd Doc-INTIA/backend
          pip install -r requirements.txt
          pytest --cov=app

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: |
          cd Doc-INTIA/frontend
          npm install
          npm test
```

### Checklist TDD

- [ ] Écrire le test avant le code
- [ ] Le test échoue d'abord (Red)
- [ ] Écrire le code minimal pour passer le test (Green)
- [ ] Refactoriser le code
- [ ] Maintenir une couverture de code élevée (>80%)
- [ ] Tests rapides et indépendants
- [ ] Tests documentés et clairs

## 📚 Documentation complète

Pour plus de détails sur :

- L'architecture du projet
- Les endpoints API
- Les rôles utilisateurs
- Les notes de développement

Consultez le [README détaillé dans Doc-INTIA/README.md](Doc-INTIA/README.md)

## 🐛 Dépannage

### Problème avec Python 3.13

Si vous rencontrez des erreurs liées à Pydantic, vous utilisez probablement Python 3.13. Utilisez Python 3.12 :

```bash
# Avec pyenv
pyenv install 3.12.0
pyenv local 3.12.0

# Puis recréer l'environnement virtuel
cd Doc-INTIA/backend
rm -rf venv
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Le backend ne démarre pas

Vérifiez que :

- L'environnement virtuel est activé
- Le fichier `.env` existe dans `Doc-INTIA/backend/`
- Le port 8000 n'est pas déjà utilisé

### Le frontend ne démarre pas

Vérifiez que :

- Node.js est installé (version 18+)
- Le fichier `.env.local` existe dans `Doc-INTIA/frontend/`
- Le port 3000 n'est pas déjà utilisé

## 📝 Structure du projet

```
Doc-INTIA/
├── Doc-INTIA/
│   ├── backend/          # API FastAPI
│   │   ├── app/          # Code de l'application
│   │   ├── main.py       # Point d'entrée
│   │   └── requirements.txt
│   ├── frontend/         # Application Next.js
│   │   ├── app/          # Pages Next.js
│   │   └── components/  # Composants React
│   └── README.md        # Documentation détaillée
└── README.md            # Ce fichier
```

## 🚀 Déploiement

### Préparation pour la production

Avant de déployer, assurez-vous de :

1. **Modifier les variables d'environnement** pour la production
2. **Changer les mots de passe par défaut**
3. **Configurer une base de données de production** (PostgreSQL recommandé au lieu de SQLite)
4. **Configurer HTTPS** pour la sécurité

### Configuration de production

#### Backend

Mettez à jour le fichier `.env` dans `Doc-INTIA/backend/` :

```env
DATABASE_URL=postgresql://user:password@host:5432/intia_db
SECRET_KEY=<générer-une-clé-secrète-forte>
JWT_SECRET_KEY=<générer-une-clé-jwt-forte>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com
ADMIN_PASSWORD=<mot-de-passe-fort>
```

#### Frontend

Mettez à jour le fichier `.env.local` dans `Doc-INTIA/frontend/` :

```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
NEXT_PUBLIC_APP_NAME="INTIA Assurance"
```

### Option 1 : Déploiement manuel sur serveur

#### Backend

```bash
cd Doc-INTIA/backend

# Créer l'environnement virtuel
python3.12 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Initialiser la base de données
python3 init_db.py

# Lancer avec un serveur de production (Gunicorn recommandé)
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Frontend

```bash
cd Doc-INTIA/frontend

# Installer les dépendances
npm install

# Build pour la production
npm run build

# Lancer le serveur de production
npm start
```

### Option 2 : Déploiement avec Docker

#### Créer les Dockerfiles

**Backend Dockerfile** (`Doc-INTIA/docker/backend/Dockerfile`) :

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY ../backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ../backend .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile** (`Doc-INTIA/docker/frontend/Dockerfile`) :

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY ../frontend/package*.json ./
RUN npm install
COPY ../frontend .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "start"]
```

#### Docker Compose

Créez un fichier `docker-compose.yml` à la racine :

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Doc-INTIA/docker/backend/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    volumes:
      - ./Doc-INTIA/backend:/app

  frontend:
    build:
      context: .
      dockerfile: Doc-INTIA/docker/frontend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    depends_on:
      - backend
```

Lancer avec :
```bash
docker-compose up -d
```

### Option 3 : Déploiement sur plateformes cloud

#### Vercel (Frontend Next.js)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement dans le dashboard Vercel
3. Déployez automatiquement à chaque push

#### Railway / Render (Backend FastAPI)

1. Connectez votre repository GitHub
2. Configurez les variables d'environnement
3. Spécifiez la commande de démarrage : `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Déployez

#### Heroku

**Backend :**

```bash
# Créer un Procfile dans Doc-INTIA/backend/
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Déployer
heroku create intia-backend
heroku config:set DATABASE_URL=...
git push heroku main
```

**Frontend :**

```bash
# Créer un Procfile dans Doc-INTIA/frontend/
echo "web: npm start" > Procfile

# Déployer
heroku create intia-frontend
heroku config:set NEXT_PUBLIC_API_URL=...
git push heroku main
```

### Option 4 : Déploiement avec Nginx (reverse proxy)

Configuration Nginx pour servir le frontend et proxy le backend :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Checklist de déploiement

- [ ] Variables d'environnement configurées pour la production
- [ ] Mots de passe par défaut changés
- [ ] Base de données de production configurée
- [ ] HTTPS configuré (certificat SSL)
- [ ] CORS configuré avec les bons domaines
- [ ] Backups de base de données configurés
- [ ] Monitoring et logs configurés
- [ ] Tests de production effectués

## 🤝 Contribution

Pour contribuer au projet, veuillez suivre les conventions de code et créer une branche pour vos modifications.
