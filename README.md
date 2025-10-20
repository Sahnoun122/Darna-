# 🏠 Plateforme Web de Gestion et Publication d’Annonces Immobilières

## 📘 Contexte du projet

Ce projet a pour objectif de concevoir et développer une **plateforme web moderne** de gestion et de publication d’annonces immobilières, destinée aussi bien aux **particuliers** qu’aux **entreprises** (agences, promoteurs).

Cette solution se veut **scalable**, **sécurisée** et **intelligente**, exploitant les technologies récentes de l’écosystème **Node.js** afin de garantir **performance**, **modularité** et **évolutivité**.

---

## 🚀 Fonctionnalités principales

### 🔹 Gestion complète des biens immobiliers
- Création, modification, suppression et publication des annonces.
- Vente, location journalière, mensuelle ou longue durée.
- Promotion de biens selon le plan d’abonnement.

### 🔹 Comptes et abonnements différenciés
- Profils : **Visiteur**, **Particulier**, **Entreprise (Agence/Promoteur)**, **Administrateur**.
- Types d’abonnement : **Gratuit**, **Pro**, **Premium**.
- Impact sur la visibilité et la priorité d’affichage.

### 🔹 Stockage de médias
- Hébergement d’images et vidéos sur **MinIO**.
- Génération automatique de vignettes.

### 🔹 Communication en temps réel
- Chat instantané avec **WebSocket / Socket.IO**.
- Notifications en temps réel (in-app + email).

### 🔹 Estimation de prix intelligente
- Calcul automatique d’un **intervalle de prix recommandé** basé sur les caractéristiques du bien via un **modèle d’intelligence artificielle (LLM)**.

### 🔹 Système de notification
- Envoi de notifications lors de :
  - Réception d’un message ou d’un lead.
  - Expiration d’un abonnement.
  - Validation ou suppression d’une annonce.

### 🔹 Recherche et filtrage avancés
- Recherche multi-critères : localisation, prix, surface, type, équipements, etc.
- Tri par **pertinence**, **récence**, ou **prix**.

### 🔹 Gestion des leads
- Création automatique d’un lead lorsqu’un utilisateur manifeste un intérêt.
- Ouverture automatique d’un canal de discussion.

### 🔹 Espace administrateur
- Tableau de bord complet : gestion des utilisateurs, annonces, abonnements, statistiques, modération.

### 🔹 Options de financement
- Présentation de **banques partenaires** et simulateur de crédit immobilier.
- Interconnexion avec la plateforme **Tirelire (Daret l Darna)** pour les épargnes collectives.

---

## 🧩 Technologies utilisées

| Catégorie | Technologies |
|------------|--------------|
| **Backend** | Node.js, Express.js |
| **Base de données** | MongoDB + Mongoose |
| **Authentification** | JWT + OAuth + 2FA |
| **Stockage fichiers** | MinIO |
| **Temps réel** | Socket.IO / WS |
| **Tests** | Jest |
| **Gestion projet** | JIRA (Epics, User Stories, Tasks, Subtasks) |
| **CI/CD** | GitHub Actions / Jenkins |
| **Déploiement** | Docker + PM2 |
| **Architecture** | N-tiers (Controller / Service / Model / Route / Middleware) |

---

## 🧱 Structure du projet

```bash
📦 real-estate-platform
├── 📁 src
│   ├── 📁 config
│   │   ├── db.js                # Connexion MongoDB
│   │   ├── minio.js             # Configuration MinIO
│   │   └── jwt.js               # Configuration JWT
│   │
│   ├── 📁 models
│   │   ├── user.model.js
│   │   ├── property.model.js
│   │   ├── subscription.model.js
│   │   ├── message.model.js
│   │   ├── notification.model.js
│   │   └── lead.model.js
│   │
│   ├── 📁 controllers
│   │   ├── user.controller.js
│   │   ├── property.controller.js
│   │   ├── auth.controller.js
│   │   ├── message.controller.js
│   │   ├── notification.controller.js
│   │   └── admin.controller.js
│   │
│   ├── 📁 services
│   │   ├── user.service.js
│   │   ├── property.service.js
│   │   ├── auth.service.js
│   │   ├── notification.service.js
│   │   └── aiPrice.service.js
│   │
│   ├── 📁 routes
│   │   ├── user.routes.js
│   │   ├── property.routes.js
│   │   ├── auth.routes.js
│   │   ├── message.routes.js
│   │   ├── notification.routes.js
│   │   └── admin.routes.js
│   │
│   ├── 📁 middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── 📁 utils
│   │   ├── logger.js
│   │   ├── email.js
│   │   └── helpers.js
│   │
│   ├── app.js                   # Initialisation de l’application Express
│   └── server.js                # Point d’entrée principal
│
├── 📁 tests                     # Tests unitaires avec Jest
│   ├── user.test.js
│   ├── property.test.js
│   └── auth.test.js
│
├── 📁 docker
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── .env.example                 # Exemple des variables d’environnement
├── .gitignore
├── package.json
├── README.md
└── LICENSE

⚙️ Installation et exécution locale
1️⃣ Cloner le projet
git clone https://github.com/sahnoun122/darna.git
cd darna

2️⃣ Installer les dépendances
npm install

3️⃣ Configurer les variables d’environnement

Créer un fichier .env à la racine :

PORT=5000
MONGO_URI=mongodb://localhost:27017/realestate
JWT_SECRET=yourSecretKey
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

4️⃣ Lancer le serveur
npm run dev


Le serveur sera accessible sur :
👉 http://localhost:5000/api

🧪 Tests unitaires

Lancer les tests avec Jest :

npm test


Exemple de test simple :

test("Doit créer une propriété", async () => {
  const result = await propertyService.createProperty({ titre: "Villa", prix: 1500000 });
  expect(result.titre).toBe("Villa");
});

🐳 Exécution avec Docker
1️⃣ Construire les images :
docker-compose build

2️⃣ Lancer les conteneurs :
docker-compose up -d

3️⃣ Vérifier le statut :
docker ps


L’API tourne sur le port 5000 et MongoDB sur 27017.

🔄 CI/CD (GitHub Actions)

Chaque push sur la branche main déclenche :

Installation des dépendances.

Exécution des tests Jest.

Déploiement automatique via PM2 ou Docker.

Exemple de workflow .github/workflows/deploy.yml :

name: Deploy API

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Installation
        run: npm install
      - name: Tests
        run: npm test
      - name: Déploiement
        run: pm2 restart all

🔐 Authentification (JWT)

Les utilisateurs s’authentifient avec un token JWT.
Chaque requête protégée doit inclure le header :

Authorization: Bearer <token>


Middleware :

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
}

🧱 Architecture logicielle

Controller → reçoit la requête et appelle le service.

Service → applique la logique métier.

Model → définit la structure des données (Mongoose).

Middleware → gère la sécurité et les erreurs.

Routes → lie les endpoints aux contrôleurs.

Schéma du flux :

Request → Route → Controller → Service → Model → Database → Response

🧑‍💼 Gestion de projet (JIRA)

La planification du projet se fait sur JIRA, avec :

Épics : modules majeurs (Auth, CRUD, Messagerie...).

User stories : fonctionnalités concrètes.

Tasks/Subtasks : étapes techniques.

Automatisation : lien direct avec GitHub pour suivi des commits et branches.

🧭 Bonnes pratiques

✅ Respect des conventions de nommage.
✅ Code commenté et documenté.
✅ Validation des données côté backend.
✅ Gestion centralisée des erreurs.
✅ OOP et architecture n-tiers.
✅ Dockerisation complète.
✅ CI/CD automatisé.
✅ Sécurité et RGPD respectés.

📄 Licence

Projet sous licence MIT – libre d’utilisation, modification et distribution à des fins éducatives ou professionnelles.
