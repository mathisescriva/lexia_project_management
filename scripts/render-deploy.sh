#!/bin/bash

# Script de déploiement Render pour Lexia Onboarding
# Ce script est optimisé pour le déploiement sur Render

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du déploiement Render pour Lexia Onboarding..."

# Vérification de l'environnement
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Configuration pour la production..."
    export NODE_ENV=production
fi

# Étape 1: Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --only=production

# Étape 2: Génération du client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Étape 3: Vérification de la base de données
echo "🗄️ Vérification de la connexion à la base de données..."
if [ -n "$DATABASE_URL" ]; then
    echo "✅ Variable DATABASE_URL détectée"
    
    # Test de connexion à la base de données
    npx prisma db execute --stdin <<< "SELECT 1;" || {
        echo "❌ Erreur de connexion à la base de données"
        echo "Vérifiez votre variable DATABASE_URL"
        exit 1
    }
    echo "✅ Connexion à la base de données réussie"
else
    echo "⚠️ Variable DATABASE_URL non définie"
    exit 1
fi

# Étape 4: Application des migrations
echo "🔄 Application des migrations de base de données..."
npx prisma migrate deploy

# Étape 5: Seeding optionnel
if [ "$SEED_PRODUCTION" = "true" ]; then
    echo "🌱 Seeding de la base de données..."
    npm run db:seed:prod || {
        echo "⚠️ Erreur lors du seeding, continuation..."
    }
else
    echo "⚠️ Seeding ignoré (SEED_PRODUCTION != true)"
fi

# Étape 6: Build de l'application
echo "🏗️ Build de l'application Next.js..."
npm run build

# Étape 7: Vérification du build
if [ -d ".next" ]; then
    echo "✅ Build réussi"
    echo "📊 Taille du build: $(du -sh .next | cut -f1)"
else
    echo "❌ Erreur: dossier .next non trouvé"
    exit 1
fi

# Étape 8: Nettoyage
echo "🧹 Nettoyage des fichiers temporaires..."
rm -rf node_modules/.cache
rm -rf .next/cache

echo "✅ Déploiement terminé avec succès!"
echo ""
echo "📋 Informations de déploiement:"
echo "- Environnement: $NODE_ENV"
echo "- Base de données: PostgreSQL"
echo "- Build: Next.js standalone"
echo "- Seeding: $SEED_PRODUCTION"
echo ""
echo "🌐 L'application sera accessible sur:"
echo "https://lexia-onboarding.onrender.com"
