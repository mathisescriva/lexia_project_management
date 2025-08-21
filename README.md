# Lexia Onboarding - Application de Gestion de Projets

Application web de gestion de projets pour Lexia, permettant aux administrateurs de gérer les projets clients et aux clients de suivre l'avancement de leurs projets.

## 🚀 Fonctionnalités

- **Gestion des entreprises** : Création et gestion des entreprises clientes
- **Gestion des utilisateurs** : Création d'utilisateurs avec rôles (ADMIN/CLIENT)
- **Gestion des projets** : Création, modification et suppression de projets
- **Timeline des projets** : Étapes avec dates de début/fin et progression
- **Actions à effectuer** : Actions côté client et côté Lexia
- **Fichiers partagés** : Intégration Google Drive
- **Commentaires** : Système de commentaires par projet
- **Chatbot** : Assistant intégré dans chaque projet
- **Avatars** : Gestion des avatars utilisateurs

## 🛠️ Technologies

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL (production) / SQLite (développement)
- **ORM** : Prisma
- **Authentification** : JWT
- **Déploiement** : Render

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- PostgreSQL (pour la production)

## 🔧 Installation locale

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd ondboarding
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créer un fichier `.env.local` :
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   ```

4. **Initialiser la base de données**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npm run db:seed
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

6. **Accéder à l'application**
   Ouvrir http://localhost:3000

## 🚀 Déploiement sur Render

### Méthode 1 : Via render.yaml (Recommandée)

1. **Connecter le repository** à Render
2. **Utiliser le fichier render.yaml** fourni
3. **Render détectera automatiquement** la configuration

### Méthode 2 : Configuration manuelle

1. **Créer un nouveau Web Service** sur Render
2. **Connecter le repository** GitHub
3. **Configurer les variables d'environnement** :
   - `NODE_ENV`: production
   - `DATABASE_URL`: URL de la base PostgreSQL
   - `JWT_SECRET`: Clé secrète générée
   - `NEXTAUTH_URL`: URL de votre application
   - `NEXTAUTH_SECRET`: Clé secrète NextAuth

4. **Configurer les commandes de build** :
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

## 📊 Base de données

### Migration vers PostgreSQL (Production)

Pour passer de SQLite à PostgreSQL en production :

1. **Modifier le schema Prisma** si nécessaire
2. **Créer une migration** :
   ```bash
   npx prisma migrate dev --name production-setup
   ```
3. **Appliquer les migrations** en production :
   ```bash
   npx prisma migrate deploy
   ```

### Données de test

L'application inclut des données de test :
- **Admin** : admin@lexia.com / admin123
- **Clients** : Créés automatiquement via le script de seed

## 🔐 Authentification

- **JWT** pour l'authentification
- **Rôles** : ADMIN et CLIENT
- **Sessions** persistantes via cookies

## 📁 Structure du projet

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── companies/         # Gestion des entreprises
│   ├── projects/          # Gestion des projets
│   └── users/             # Gestion des utilisateurs
├── components/            # Composants React réutilisables
├── hooks/                 # Hooks personnalisés
├── lib/                   # Utilitaires et configuration
├── prisma/                # Schema et migrations
├── public/                # Assets statiques
└── scripts/               # Scripts utilitaires
```

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 📝 Scripts disponibles

```bash
npm run dev          # Développement local
npm run build        # Build de production
npm run start        # Démarrage production
npm run db:seed      # Peupler la base de données
npm run db:reset     # Réinitialiser la base
npm run db:clear-projects  # Supprimer tous les projets
```

## 🔧 Configuration avancée

### Google Drive API

Pour activer l'intégration Google Drive :

1. **Créer un projet Google Cloud**
2. **Activer l'API Google Drive**
3. **Créer des credentials OAuth2**
4. **Ajouter les variables d'environnement** :
   ```env
   GOOGLE_DRIVE_CLIENT_ID="your-client-id"
   GOOGLE_DRIVE_CLIENT_SECRET="your-client-secret"
   GOOGLE_DRIVE_REDIRECT_URI="your-redirect-uri"
   ```

### Variables d'environnement complètes

```env
# Base de données
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentification
JWT_SECRET="your-jwt-secret"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google Drive (optionnel)
GOOGLE_DRIVE_CLIENT_ID="your-google-client-id"
GOOGLE_DRIVE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_DRIVE_REDIRECT_URI="https://your-domain.com/api/auth/google/callback"

# Environnement
NODE_ENV="production"
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de base de données** :
   ```bash
   npx prisma generate
   npx prisma migrate reset
   ```

2. **Erreur de build** :
   ```bash
   rm -rf node_modules .next
   npm install
   npm run build
   ```

3. **Problèmes de permissions** :
   Vérifier que l'utilisateur a les droits ADMIN

## 📞 Support

Pour toute question ou problème :
- **Email** : support@lexia.com
- **Documentation** : [Lien vers la documentation]

## 📄 Licence

© 2024 Lexia. Tous droits réservés.
