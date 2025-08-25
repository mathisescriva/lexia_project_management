#!/bin/bash

# Script de vérification de l'environnement de production
# À exécuter avant le déploiement

echo "🔍 Vérification de l'environnement de production..."

# Vérification des variables d'environnement critiques
required_vars=("DATABASE_URL" "JWT_SECRET" "NEXTAUTH_SECRET" "NEXTAUTH_URL")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Variable $var manquante"
        exit 1
    else
        echo "✅ Variable $var configurée"
    fi
done

# Vérification de la connexion à la base de données
echo "🗄️ Test de connexion à la base de données..."
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Connexion à la base de données réussie"
else
    echo "❌ Erreur de connexion à la base de données"
    exit 1
fi

# Vérification des migrations
echo "🔄 Vérification des migrations..."
npx prisma migrate status

# Vérification du build
echo "🏗️ Test du build..."
npm run build

echo "✅ Environnement de production prêt pour le déploiement!"
