# 🚀 Guide de Déploiement Render - Lexia Onboarding

Ce guide détaille le processus de déploiement de l'application Lexia Onboarding sur Render.

## 📋 Prérequis

- Compte Render (gratuit)
- Repository GitHub connecté
- Base de données PostgreSQL (fournie par Render)

## 🔧 Configuration Automatique (Recommandée)

### 1. Connexion du Repository

1. **Connectez-vous à Render** : https://render.com
2. **Cliquez sur "New +"** → "Blueprint"
3. **Connectez votre repository GitHub**
4. **Sélectionnez le repository** `ondboarding`
5. **Render détectera automatiquement** le fichier `render.yaml`

### 2. Configuration Automatique

Le fichier `render.yaml` configure automatiquement :
- ✅ **Base de données PostgreSQL** (gratuite)
- ✅ **Service web Next.js**
- ✅ **Variables d'environnement**
- ✅ **Déploiement automatique**

### 3. Variables d'Environnement

Les variables suivantes sont configurées automatiquement :
```env
NODE_ENV=production
DATABASE_URL=postgresql://... (généré automatiquement)
JWT_SECRET=... (généré automatiquement)
NEXTAUTH_URL=https://lexia-onboarding.onrender.com
NEXTAUTH_SECRET=... (généré automatiquement)
SEED_PRODUCTION=true
```

## 🔧 Configuration Manuelle (Alternative)

Si vous préférez configurer manuellement :

### 1. Créer la Base de Données

1. **New +** → "PostgreSQL"
2. **Nom** : `lexia-database`
3. **Plan** : Free
4. **Database** : `lexia_production`
5. **User** : `lexia_user`

### 2. Créer le Service Web

1. **New +** → "Web Service"
2. **Connecter le repository GitHub**
3. **Configuration** :
   - **Name** : `lexia-onboarding`
   - **Environment** : `Node`
   - **Build Command** : `npm install && npx prisma generate && npm run build`
   - **Start Command** : `npm start`
   - **Plan** : Free

### 3. Variables d'Environnement

Ajouter manuellement :
```env
NODE_ENV=production
DATABASE_URL=postgresql://... (copier depuis la base de données)
JWT_SECRET=votre-clé-secrète-jwt
NEXTAUTH_URL=https://votre-app.onrender.com
NEXTAUTH_SECRET=votre-clé-secrète-nextauth
SEED_PRODUCTION=true
```

## 🚀 Processus de Déploiement

### Étapes Automatiques

1. **Installation des dépendances** : `npm install`
2. **Génération Prisma** : `npx prisma generate`
3. **Application des migrations** : `npx prisma migrate deploy`
4. **Seeding de la base** : `npm run db:seed:prod`
5. **Build de l'application** : `npm run build`
6. **Démarrage du service** : `npm start`

### Scripts Disponibles

```bash
# Déploiement complet
./scripts/render-deploy.sh

# Configuration de production
./scripts/setup-production.sh

# Scripts npm
npm run build:prod    # Build optimisé pour la production
npm run start:prod    # Démarrage avec migrations
npm run db:deploy     # Application des migrations
```

## 📊 Monitoring et Logs

### Accès aux Logs

1. **Dashboard Render** → Votre service
2. **Onglet "Logs"**
3. **Filtres disponibles** :
   - Build logs
   - Runtime logs
   - Error logs

### Métriques Disponibles

- **Uptime** : Disponibilité du service
- **Response Time** : Temps de réponse
- **Memory Usage** : Utilisation mémoire
- **CPU Usage** : Utilisation CPU

## 🔍 Dépannage

### Problèmes Courants

#### 1. Erreur de Base de Données
```bash
# Vérifier la connexion
npx prisma db execute --stdin <<< "SELECT 1;"

# Appliquer les migrations
npx prisma migrate deploy
```

#### 2. Erreur de Build
```bash
# Nettoyer et rebuilder
rm -rf node_modules .next
npm install
npm run build
```

#### 3. Erreur de Variables d'Environnement
- Vérifier que toutes les variables sont définies
- Redémarrer le service après modification

### Commandes de Debug

```bash
# Vérifier l'état de la base de données
npx prisma studio

# Vérifier les migrations
npx prisma migrate status

# Tester la connexion
npx prisma db execute --stdin <<< "SELECT version();"
```

## 🔐 Sécurité

### Variables Sensibles

- **JWT_SECRET** : Clé secrète pour les tokens JWT
- **NEXTAUTH_SECRET** : Clé secrète NextAuth
- **DATABASE_URL** : URL de connexion PostgreSQL

### Headers de Sécurité

L'application inclut automatiquement :
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

## 📈 Optimisations

### Performance

- **Build optimisé** : Next.js standalone
- **Images optimisées** : Next.js Image component
- **CSS optimisé** : Tailwind CSS purged
- **Caching** : Headers de cache appropriés

### Base de Données

- **Index optimisés** : Prisma génère automatiquement
- **Connexions poolées** : Configuration PostgreSQL
- **Migrations optimisées** : Déploiement incrémental

## 🔄 Mises à Jour

### Déploiement Automatique

- **Push sur main** → Déploiement automatique
- **Pull requests** → Déploiement de preview (optionnel)

### Déploiement Manuel

1. **Dashboard Render** → Votre service
2. **"Manual Deploy"** → "Deploy latest commit"

## 📞 Support

### Logs d'Erreur

En cas de problème, vérifiez :
1. **Logs de build** dans Render
2. **Logs runtime** dans Render
3. **Logs de base de données** dans Render

### Contact

- **Email** : support@lexia.com
- **Documentation** : Ce fichier
- **Issues** : Repository GitHub

## 🎯 Checklist de Déploiement

- [ ] Repository connecté à Render
- [ ] Base de données PostgreSQL créée
- [ ] Service web configuré
- [ ] Variables d'environnement définies
- [ ] Premier déploiement réussi
- [ ] Base de données seedée
- [ ] Tests de connexion effectués
- [ ] Monitoring configuré
- [ ] Documentation mise à jour

---

**✅ Déploiement réussi !** Votre application est maintenant accessible sur `https://lexia-onboarding.onrender.com`
