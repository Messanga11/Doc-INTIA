# Configuration Python pour le Backend

## Problème de compatibilité

**Python 3.13 n'est pas compatible avec Pydantic v1.** 

Si vous utilisez Python 3.13, vous devez soit :
1. **Utiliser Python 3.12 (recommandé)** - voir instructions ci-dessous
2. Migrer vers Pydantic v2 (nécessite des modifications de code importantes)

## Solution : Utiliser Python 3.12

### Option 1 : Utiliser pyenv (recommandé)

```bash
# Installer pyenv si pas déjà installé
# macOS: brew install pyenv
# Linux: voir https://github.com/pyenv/pyenv#installation

# Installer Python 3.12
pyenv install 3.12.0

# Utiliser Python 3.12 pour ce projet
cd backend
pyenv local 3.12.0

# Re-créer l'environnement virtuel
rm -rf venv
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Option 2 : Utiliser directement python3.12

```bash
cd backend

# Supprimer l'ancien venv
rm -rf venv

# Créer un nouveau venv avec Python 3.12
python3.12 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### Option 3 : Utiliser conda

```bash
conda create -n intia-backend python=3.12
conda activate intia-backend
cd backend
pip install -r requirements.txt
```

## Vérification

Après avoir configuré Python 3.12, vérifiez :

```bash
python --version  # Devrait afficher Python 3.12.x
```

Ensuite, relancez le projet :

```bash
cd /Users/paulmessanga/dev/afreetech/Doc-INTIA
npm run dev
```


