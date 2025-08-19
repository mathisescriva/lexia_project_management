# Guide d'Installation - Lexia Project Management

## 🚀 Installation Rapide

### 1. Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### 2. Cloner et installer
```bash
git clone <repository-url>
cd lexia-project-management
npm install
```

### 3. Configuration
```bash
cp env.example .env
# Éditer .env avec vos configurations
```

### 4. Base de données
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🔐 Comptes de test

Après avoir exécuté `npm run db:seed`, vous pouvez vous connecter avec :

### Admin
- **Email**: admin@lexia.com
- **Mot de passe**: admin123
- **Rôle**: Administrateur (accès complet)

### Clients
- **Email**: client1@example.com
- **Mot de passe**: client123
- **Rôle**: Client (accès limité)

- **Email**: client2@example.com
- **Mot de passe**: client123
- **Rôle**: Client (accès limité)

## 📁 Structure des fichiers

```
├── app/                    # App Router Next.js
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentification
│   │   ├── projects/      # Gestion projets
│   │   ├── tickets/       # Gestion tickets
│   │   └── users/         # Gestion utilisateurs
│   ├── dashboard/         # Page dashboard
│   ├── login/            # Page connexion
│   ├── projects/         # Page projets
│   ├── tickets/          # Page tickets
│   └── globals.css       # Styles globaux
├── components/           # Composants React
├── hooks/               # Hooks personnalisés
├── lib/                 # Utilitaires et services
├── prisma/              # Schéma et migrations DB
├── scripts/             # Scripts utilitaires
└── public/              # Assets statiques
```

## 🔧 Configuration avancée

### Variables d'environnement

```env
# Base de données
DATABASE_URL="file:./dev.db"

# JWT Secret (changez en production)
JWT_SECRET="your-super-secret-jwt-key"

# Google Drive API (optionnel)
GOOGLE_SERVICE_ACCOUNT_KEY_FILE="path/to/service-account-key.json"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

### Base de données

L'application utilise SQLite par défaut pour le développement. Pour la production :

1. **PostgreSQL** (recommandé)
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/lexia_db"
   ```

2. **MySQL**
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/lexia_db"
   ```

### Google Drive Integration

Pour activer le partage de fichiers :

1. Créer un projet Google Cloud
2. Activer l'API Google Drive
3. Créer un compte de service
4. Télécharger la clé JSON
5. Configurer les variables d'environnement

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Railway

1. Connecter le repository
2. Configurer les variables d'environnement
3. Déployer

### Docker (Optionnel)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔍 Dépannage

### Erreurs courantes

1. **"Environment variable not found: DATABASE_URL"**
   - Vérifiez que le fichier `.env` existe
   - Vérifiez la syntaxe de la variable

2. **"Prisma Client not generated"**
   - Exécutez `npx prisma generate`

3. **"Database not found"**
   - Exécutez `npx prisma db push`

4. **Erreurs de dépendances**
   - Supprimez `node_modules` et `package-lock.json`
   - Réinstallez avec `npm install`

### Logs

Les logs de l'application sont disponibles dans la console du terminal.

## 📞 Support

Pour toute question ou problème :

1. Vérifiez la documentation
2. Consultez les logs de l'application
3. Vérifiez les variables d'environnement
4. Contactez l'équipe Lexia

## 🔄 Mise à jour

Pour mettre à jour l'application :

```bash
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
```

---

**Développé pour Lexia** - MVPIA 2024
