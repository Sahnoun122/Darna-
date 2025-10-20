🏡 Plateforme de Gestion d’Annonces Immobilières

Projet Node.js / Express / MongoDB / OOP / Docker / CI-CD

📘 Description du projet

Ce projet a pour objectif de concevoir et développer une API web moderne pour la gestion et la publication d’annonces immobilières, destinée aussi bien aux particuliers qu’aux entreprises (agences immobilières, promoteurs).

La solution est pensée pour être sécurisée, scalable, performante et modulaire, exploitant les technologies récentes de l’écosystème Node.js et suivant les principes de programmation orientée objet (OOP) et architecture n-tiers.

🚀 Fonctionnalités principales

🔹 Gestion complète des biens immobiliers (ajout, modification, suppression, publication).

🔹 Comptes utilisateurs différenciés (Visiteur, Particulier, Entreprise, Admin).

🔹 Système d’authentification sécurisé avec JWT et middleware d’accès.

🔹 Stockage des médias (images, vidéos) via MinIO.

🔹 Messagerie instantanée avec WebSocket (Socket.IO).

🔹 Notifications en temps réel et par e-mail.

🔹 Système de plans d’abonnement (Gratuit / Pro / Premium).

🔹 Estimation intelligente du prix via un module IA (LLM).

🔹 Module de financement et simulateur de crédit immobilier.

🔹 Tableau de bord administrateur (modération, statistiques, gestion des comptes).

🔹 Intégration avec Tirelire (Daret l Darna) pour le financement collaboratif.

🧰 Technologies utilisées
Domaine	Technologie
Langage principal	JavaScript (ES6+)
Framework serveur	Express.js
Paradigme	Programmation Orientée Objet (OOP)
Base de données	MongoDB (ODM : Mongoose)
Sécurité	JWT, bcrypt, Helmet, CORS
Communication temps réel	WebSocket (Socket.IO)
Tests unitaires	Jest
Conteneurisation	Docker / Docker Compose
Déploiement continu	GitHub Actions / PM2 / Jenkins
Gestion de projet	JIRA (Epics, User Stories, Tasks, Automatisations)
🏗️ Structure du projet
real-estate-api/
│
├── src/
│   ├── config/                     # Configuration (DB, MinIO, JWT, etc.)
│   │   ├── database.js
│   │   ├── minio.js
│   │   └── env.js
│   │
│   ├── models/                     # Modèles MongoDB (Schemas)
│   │   ├── User.model.js
│   │   ├── Property.model.js
│   │   ├── Message.model.js
│   │   ├── Notification.model.js
│   │   └── Subscription.model.js
│   │
│   ├── controllers/                # Logique de contrôle (connexion avec routes)
│   │   ├── Auth.controller.js
│   │   ├── Property.controller.js
│   │   ├── Message.controller.js
│   │   ├── Notification.controller.js
│   │   └── Admin.controller.js
│   │
│   ├── services/                   # Logique métier (Business Logic)
│   │   ├── Auth.service.js
│   │   ├── Property.service.js
│   │   ├── Message.service.js
│   │   ├── Notification.service.js
│   │   └── Estimation.service.js
│   │
│   ├── routes/                     # Points d’entrée de l’API
│   │   ├── auth.routes.js
│   │   ├── property.routes.js
│   │   ├── message.routes.js
│   │   ├── notification.routes.js
│   │   └── admin.routes.js
│   │
│   ├── middlewares/                # Vérifications et sécurité
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validation.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── utils/                      # Fonctions réutilisables
│   │   ├── sendEmail.js
│   │   ├── generateToken.js
│   │   └── logger.js
│   │
│   ├── tests/                      # Tests unitaires avec Jest
│   │   ├── property.test.js
│   │   ├── auth.test.js
│   │   └── message.test.js
│   │
│   ├── app.js                      # Initialisation d’Express, middlewares, routes
│   └── server.js                   # Point d’entrée principal
│
├── .env                            # Variables d’environnement
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── jest.config.js
├── README.md
└── LICENSE

⚙️ Installation et exécution locale
1️⃣ Cloner le projet
git clone https://github.com/sahnoun122/darna.git
cd real-estate-api

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