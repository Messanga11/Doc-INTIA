---
# 📘 Documentation Technique — Spécifications Fonctionnelles & Techniques

## Application Web INTIA Assurance
---

# 1. Objectif du Projet

L’application doit permettre à la société **INTIA Assurance** de gérer :

- Les **clients**
- Les **assurances (polices d’assurance)**
- Les **succursales**
- Les **utilisateurs internes**
- L’historique des actions (audit log)

Le système doit être accessible depuis les trois sites de la société :

- Direction Générale
- INTIA Douala
- INTIA Yaoundé

---

# 2. Architecture Applicative

## 2.1 Architecture globale

L’application repose sur une architecture **web 3-tiers** :

1. **Frontend**

   - Interface utilisateur web responsive
   - Accès via navigateur moderne
   - Communication via requêtes HTTP/HTTPS et API REST

2. **Backend API**

   - Expose des services RESTful
   - Gère la logique métier : règles de validation, permissions, traitements métiers
   - Intègre la gestion des utilisateurs et des rôles
   - Enregistre toutes les actions sensibles (audit log)

3. **Base de données**

   - Système relationnel
   - Stockage des clients, assurances, succursales, utilisateurs, logs
   - Contraintes d’intégrité et relations entre tables

---

# 3. Modules Fonctionnels

L’application est composée de modules indépendants mais interconnectés.

---

## 3.1 Module Utilisateurs

### Fonctionnalités

- Gestion des employés internes :

  - Création d’un utilisateur
  - Attribution d’un rôle
  - Affectation à une succursale (optionnel)

- Authentification par identifiant + mot de passe
- Rôles disponibles :

  - **ADMIN** : droits totaux, gestion de tous les modules + utilisateurs
  - **AGENT** : gestion clients + policies de sa succursale
  - **VIEWER** : consultation uniquement

### Exigences techniques

- Système d’authentification sécurisé
- Gestion des sessions via tokens ou équivalent
- Toutes les routes critiques doivent être restreintes par rôle
- Stockage sécurisé des mots de passe (hash)

---

## 3.2 Module Succursales

### Fonctionnalités

- Gérer les succursales :

  - Direction Générale
  - INTIA Douala
  - INTIA Yaoundé

- Associer un client ou une police à une succursale
- Filtrer l’accès selon la succursale d’un agent

### Exigences techniques

- Structure permettant l’ajout futur d’autres sites
- Liaison entre succursale et données (clients, policies)
- Restrictions d’accès basées sur la succursale de l’utilisateur connecté

---

## 3.3 Module Clients

### Fonctionnalités

- Création, modification, suppression et consultation d’un client
- Stockage des informations personnelles :

  - Nom, prénom
  - Contacts (email, téléphone)
  - Adresse
  - Succursale d’affectation
  - Métadonnées éventuelles

- Affichage des polices liées à ce client
- Historique des modifications

### Exigences techniques

- Unicité des informations sensibles (ex : email)
- Système de pagination et filtrage
- Journalisation des modifications (audit log)
- Protégé par authentification et permissions

---

## 3.4 Module Assurances / Policies

### Fonctionnalités

- Gestion complète des polices d’assurance :

  - Numéro de police
  - Type d’assurance
  - Prime
  - Dates de validité
  - Statut (active, en attente, annulée…)
  - Description
  - Liée à un client
  - Liée à une succursale

- Actions possibles :

  - Créer une police
  - Modifier
  - Supprimer
  - Consulter

### Exigences techniques

- Unicité du numéro de police
- Validation des dates (date de début < date de fin)
- Gestion des statuts avec transitions contrôlées
- Gestion du lien obligatoire avec un client

---

## 3.5 Module Audit Log

### Fonctionnalités

- Enregistrer toutes les actions sensibles :

  - Connexion / déconnexion
  - Création / modification / suppression de client
  - Création / modification / suppression d’une police
  - Administration utilisateurs

- Permettre la consultation filtrée par :

  - Date
  - Utilisateur
  - Type d’action
  - Ressource

### Exigences techniques

- Stockage horodaté
- Immuabilité des logs
- Horodatage en UTC
- Niveau de détail configurable

---

# 4. Exigences Techniques Backend

### 4.1 Caractéristiques principales

- API REST structurée par ressources
- Respect du format JSON pour toutes les réponses
- Validation systématique des entrées
- Système d’erreurs standardisé
- Protection contre :

  - Injection
  - Bruteforce (via rate limiting si nécessaire)
  - Accès non autorisés

### 4.2 Structure de l’API

Endpoints regroupés par modules :

- `/auth`
- `/users`
- `/clients`
- `/policies`
- `/branches`
- `/audit-logs`

---

# 5. Exigences Techniques Frontend

### 5.1 Interface utilisateur

- Interface web responsive utilisable sur PC, tablettes
- Navigation simple en modules :

  - Tableau de bord
  - Clients
  - Assurances
  - Succursales
  - Administration

- Formulaires validés côté client
- Tableaux avec :

  - Pagination
  - Filtres
  - Recherche

### 5.2 Gestion de la sécurité

- Stockage des tokens en local sécurisé
- Déconnexion automatique si token expiré
- Redirection vers login en cas d’accès non autorisé

### 5.3 Accessibilité

- Respect des standards UI/UX
- Labels, feedbacks d’erreurs, statuts visuels

---

# 6. Base de Données

### 6.1 Exigences

- Système relationnel
- Relations entre tables :

  - 1 succursale → plusieurs clients
  - 1 client → plusieurs polices
  - 1 utilisateur → n actions dans audit log

- Respect des contraintes :

  - Unicité (email client, numéro police)
  - Intégrité référentielle
  - Cascades contrôlées (jamais supprimer en cascade les logs)

### 6.2 Sauvegardes & Restauration

- Sauvegardes automatiques quotidiennes
- Rétention configurable (ex : 14 jours)
- Méchanisme de restauration en catastrophe

---

# 7. Sécurité & Conformité

### 7.1 Données sensibles

- Hash des mots de passe avec algorithme sécurisé
- Aucune donnée sensible en clair
- Journalisation des accès

### 7.2 Communication

- HTTPS obligatoire en production
- Filtrage CORS

### 7.3 Rôles et permissions

- Contrôle d'accès basé sur le rôle de l'utilisateur
- Restriction par succursale pour les agents

### 7.4 Audit log

- Non modifiable
- Stockage sécurisé
- Accessible aux administrateurs uniquement

---

# 8. Performance & Fiabilité

### 8.1 Objectifs

- Temps de réponse API moyen < 300 ms
- Disponibilité > 99%
- Pagination obligatoire sur toutes les grandes listes

### 8.2 Monitoring

- Logs système
- Monitoring du backend
- Supervision de la base de données

---

# 9. Déploiement & Infrastructure

### 9.1 Environnement serveur

- Infrastructure conteneurisée
- Services séparés :

  - Serveur backend
  - Frontend statique
  - Base de données

### 9.2 Environnements

- **Développement**
- **Recette**
- **Production**

### 9.3 CI/CD (optionnel)

- Tests automatiques
- Déploiement automatique après validation

---

# 10. Maintenance & Évolutivité

### Prévu pour :

- Ajouter de nouveaux types d’assurances
- Ajouter d’autres succursales
- Ajouter un portail client futur (optionnel)
- Étendre le moteur d’audit
- Générer des exports PDF/Excel (phase 2 possible)

---

# 11. Conclusion

Cette documentation décrit de manière complète **les spécifications techniques** de la solution prévue pour l’application web de gestion d’assurance d’INTIA Assurance :

- Architecture
- Modules
- Contraintes
- Permissions
- Données
- Sécurité
- Déploiement

---

Souhaites-tu maintenant :

✅ une **documentation fonctionnelle** ?
✅ une **analyse des besoins (cahier des charges)** ?
✅ un **diagramme UML (texte)** ?
✅ un **schéma de base de données visuel** ?
