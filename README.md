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
git clone <url-du-repo>
cd afreetech
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
afreetech/
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

## 🤝 Contribution

Pour contribuer au projet, veuillez suivre les conventions de code et créer une branche pour vos modifications.
