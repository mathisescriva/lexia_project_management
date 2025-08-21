#!/bin/bash

# Script de déploiement pour Render
# Ce script est exécuté automatiquement par Render lors du déploiement

echo "🚀 Démarrage du déploiement Lexia Onboarding..."

# Vérifier que nous sommes en production
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Environnement de production détecté"
    
    # Générer le client Prisma
    echo "🔧 Génération du client Prisma..."
    npx prisma generate
    
    # Appliquer les migrations de base de données
    echo "🗄️ Application des migrations de base de données..."
    npx prisma migrate deploy
    
    # Build de l'application
    echo "🏗️ Build de l'application..."
    npm run build
    
    echo "✅ Déploiement terminé avec succès!"
else
    echo "🔧 Environnement de développement détecté"
    
    # Générer le client Prisma
    echo "🔧 Génération du client Prisma..."
    npx prisma generate
    
    # Build de l'application
    echo "🏗️ Build de l'application..."
    npm run build
    
    echo "✅ Build terminé avec succès!"
fi
