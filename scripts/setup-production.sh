#!/bin/bash

# Script de configuration pour la production
# Ce script aide à configurer l'environnement de production

echo "🚀 Configuration de l'environnement de production Lexia Onboarding..."

# Vérifier que nous sommes en production
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️ Attention: Ce script est destiné à la production"
    echo "Définissez NODE_ENV=production pour continuer"
    exit 1
fi

echo "📦 Configuration de la base de données PostgreSQL..."

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "🗄️ Application des migrations de base de données..."
npx prisma migrate deploy

# Vérifier la connexion à la base de données
echo "🔍 Vérification de la connexion à la base de données..."
npx prisma db execute --stdin <<< "SELECT 1;" || {
    echo "❌ Erreur de connexion à la base de données"
    echo "Vérifiez votre variable DATABASE_URL"
    exit 1
}

echo "✅ Connexion à la base de données réussie!"

# Optionnel: Seeding de données de base
if [ "$SEED_PRODUCTION" = "true" ]; then
    echo "🌱 Seeding de la base de données..."
    npm run db:seed:prod
else
    echo "⚠️ Seeding ignoré (SEED_PRODUCTION != true)"
fi

echo "✅ Configuration de production terminée!"
echo ""
echo "📋 Points importants :"
echo "- La base de données PostgreSQL est configurée"
echo "- Les migrations ont été appliquées"
echo "- Le client Prisma est généré"
echo ""
echo "🔧 Variables d'environnement requises :"
echo "- DATABASE_URL: URL PostgreSQL"
echo "- JWT_SECRET: Clé secrète JWT"
echo "- NEXTAUTH_URL: URL de l'application"
echo "- NEXTAUTH_SECRET: Clé secrète NextAuth"
