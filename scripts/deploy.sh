#!/bin/bash

echo "🚀 Démarrage du déploiement..."

# Variables d'environnement
export NODE_ENV=production

# 1. Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# 2. Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# 3. Appliquer les migrations de base de données
echo "🗄️ Application des migrations de base de données..."
npx prisma migrate deploy

# 4. Vérifier si des données de base sont nécessaires
echo "🌱 Vérification des données de base..."
if [ "$SEED_DATABASE" = "true" ]; then
    echo "📊 Seeding de la base de données..."
    npx ts-node scripts/seed.ts
else
    echo "⚠️ Seeding ignoré (SEED_DATABASE != true)"
fi

# 5. Build de l'application
echo "🏗️ Build de l'application..."
npm run build

echo "✅ Déploiement terminé avec succès!"
echo ""
echo "📋 Points importants :"
echo "- Les migrations de base de données ont été appliquées"
echo "- Le client Prisma a été régénéré"
echo "- L'application est prête pour la production"
echo ""
echo "🔧 Pour activer le seeding en production, définissez :"
echo "export SEED_DATABASE=true"
