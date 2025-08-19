# 🚀 Guide de Déploiement

## Prérequis

- Node.js 18+ installé
- Base de données SQLite (ou PostgreSQL/MySQL pour la production)
- Variables d'environnement configurées

## Variables d'environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Base de données
DATABASE_URL="file:./dev.db"

# JWT Secret (générez une clé sécurisée)
JWT_SECRET="votre-secret-jwt-tres-securise"

# Google Drive (optionnel)
GOOGLE_CLIENT_ID="votre-client-id"
GOOGLE_CLIENT_SECRET="votre-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
```

## Déploiement Automatique

### Option 1 : Script de déploiement

```bash
# Déploiement complet avec seeding
npm run deploy

# Ou manuellement
./scripts/deploy.sh
```

### Option 2 : Déploiement manuel

```bash
# 1. Installer les dépendances
npm install

# 2. Générer le client Prisma
npx prisma generate

# 3. Appliquer les migrations
npx prisma migrate deploy

# 4. Seeding de production (optionnel)
npm run db:seed:prod

# 5. Build de l'application
npm run build

# 6. Démarrer en production
npm start
```

## Déploiement sur Vercel

### 1. Configuration Vercel

Créez un fichier `vercel.json` :

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

### 2. Variables d'environnement Vercel

Dans les paramètres de votre projet Vercel :

- `DATABASE_URL` : URL de votre base de données
- `JWT_SECRET` : Clé secrète JWT
- `GOOGLE_CLIENT_ID` : ID client Google (optionnel)
- `GOOGLE_CLIENT_SECRET` : Secret client Google (optionnel)

### 3. Build Hooks

Ajoutez ces hooks dans `package.json` :

```json
{
  "scripts": {
    "vercel-build": "npx prisma generate && npx prisma migrate deploy && npm run build"
  }
}
```

## Déploiement sur Railway

### 1. Configuration Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

### 2. Variables d'environnement Railway

Configurez les variables dans le dashboard Railway :

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`

## Déploiement sur Docker

### 1. Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./data.db
      - JWT_SECRET=your-secret
    volumes:
      - ./data:/app/data
```

## Vérification Post-Déploiement

### 1. Vérifier la base de données

```bash
# Ouvrir Prisma Studio
npx prisma studio

# Vérifier les migrations
npx prisma migrate status
```

### 2. Tester l'API

```bash
# Test de l'API d'authentification
curl -X GET https://votre-domaine.com/api/auth/me

# Test de création d'un commentaire
curl -X POST https://votre-domaine.com/api/comments \
  -H "Content-Type: application/json" \
  -d '{"projectId":"test","content":"Test comment"}'
```

### 3. Comptes par défaut

Après le seeding de production :

- **Admin** : `admin@lexia.com` / `admin123`
- **⚠️ Important** : Changez le mot de passe admin après le premier login !

## Dépannage

### Erreur "IDs invalides"

1. Vérifiez que les migrations ont été appliquées
2. Videz le cache du navigateur
3. Supprimez les cookies de session
4. Redémarrez l'application

### Erreur de base de données

```bash
# Réinitialiser la base de données
npx prisma migrate reset

# Régénérer le client
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy
```

### Erreur de build

```bash
# Nettoyer le cache
rm -rf .next
rm -rf node_modules/.cache

# Réinstaller les dépendances
npm install

# Rebuild
npm run build
```

## Support

Pour toute question ou problème de déploiement, consultez :

- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Vercel](https://vercel.com/docs)
