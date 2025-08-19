# Lexia - Application de Gestion de Projet (MVPIA)

Application web moderne pour la gestion de projets clients chez Lexia, offrant un dashboard centralisé pour le suivi des projets, le partage de fichiers et le support client.

## 🚀 Fonctionnalités

### Pour les Clients
- **Dashboard personnalisé** avec vue d'ensemble des projets
- **Suivi de l'avancement** avec barres de progression et étapes
- **Accès aux fichiers** via intégration Google Drive
- **Support client** via chatbot/tickets
- **Interface responsive** et moderne

### Pour les Admins (Lexia)
- **Gestion complète des projets** (création, modification, suivi)
- **Interface d'administration** pour tous les clients
- **Gestion des tickets** et réponses aux demandes
- **Upload et partage de fichiers** via Google Drive
- **Vue d'ensemble** de tous les projets

## 🛠️ Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: Next.js API Routes
- **Base de données**: SQLite (Prisma ORM)
- **Authentification**: JWT + bcrypt
- **Stockage fichiers**: Google Drive API
- **UI Components**: Heroicons, React Hook Form

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <repository-url>
cd lexia-project-management
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
```bash
cp env.example .env.local
```

Éditer `.env.local` avec vos configurations :
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Initialiser la base de données
```bash
npx prisma generate
npx prisma db push
```

### 5. Créer un utilisateur admin (optionnel)
```bash
npx prisma studio
```
Ou utiliser l'API pour créer un utilisateur.

### 6. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🔧 Configuration Google Drive (Optionnel)

Pour activer le partage de fichiers via Google Drive :

1. **Créer un projet Google Cloud**
2. **Activer l'API Google Drive**
3. **Créer un compte de service** et télécharger la clé JSON
4. **Configurer les variables d'environnement** :

```env
GOOGLE_SERVICE_ACCOUNT_KEY_FILE="path/to/service-account-key.json"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

## 📁 Structure du Projet

```
├── app/                    # App Router Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Page dashboard
│   ├── login/            # Page connexion
│   └── globals.css       # Styles globaux
├── components/           # Composants React
├── hooks/               # Hooks personnalisés
├── lib/                 # Utilitaires et services
├── prisma/              # Schéma et migrations DB
└── public/              # Assets statiques
```

## 🔐 Authentification

L'application utilise un système d'authentification JWT simple :

- **Login/Logout** via API routes
- **Cookies HTTP-only** pour la sécurité
- **Rôles** : ADMIN et CLIENT
- **Protection des routes** automatique

## 📊 Base de Données

### Tables principales :
- **Users** : Utilisateurs (admin/client)
- **Projects** : Projets avec progression
- **ProjectSteps** : Étapes des projets
- **Tickets** : Demandes de support
- **ProjectFiles** : Métadonnées des fichiers

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes
- **Railway** : Backend + Base de données
- **Supabase** : Alternative à la base de données
- **Netlify** : Alternative au frontend

## 📝 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Vérifier l'auth

### Projets
- `GET /api/projects` - Lister les projets
- `POST /api/projects` - Créer un projet
- `PUT /api/projects/[id]` - Modifier un projet

### Tickets
- `GET /api/tickets` - Lister les tickets
- `POST /api/tickets` - Créer un ticket
- `PUT /api/tickets/[id]` - Modifier un ticket

## 🎨 Personnalisation

### Couleurs
Les couleurs Lexia sont définies dans `tailwind.config.js` :
```js
lexia: {
  50: '#f0f9ff',
  // ... autres teintes
}
```

### Composants
Tous les composants sont dans `/components` et utilisent Tailwind CSS.

## 🔧 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Démarrer production
npm run lint         # Linter
npm run db:migrate   # Migrations DB
npm run db:studio    # Interface DB
```

## 📞 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les logs de l'application
3. Contacter l'équipe Lexia

## 🔄 Roadmap

### Phase 1 ✅ (2-3 semaines)
- [x] Authentification basique
- [x] Dashboard minimal
- [x] Gestion des projets
- [x] Interface admin

### Phase 2 🔄 (2 semaines)
- [ ] Chatbot MVP
- [ ] Intégration Google Drive
- [ ] Gestion des tickets avancée

### Phase 3 📋 (1-2 semaines)
- [ ] Amélioration UI/UX
- [ ] FAQ automatisée
- [ ] Notifications push

---

**Développé pour Lexia** - MVPIA 2024
