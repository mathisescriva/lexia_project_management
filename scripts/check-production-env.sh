#!/bin/bash

# Script de vérification de l'environnement de production
# Ce script vérifie que toutes les variables nécessaires sont configurées

echo "🔍 Vérification de l'environnement de production..."

# Variables requises
REQUIRED_VARS=(
    "NODE_ENV"
    "DATABASE_URL"
    "JWT_SECRET"
    "NEXTAUTH_URL"
    "NEXTAUTH_SECRET"
)

# Variables optionnelles
OPTIONAL_VARS=(
    "SEED_PRODUCTION"
    "GOOGLE_DRIVE_CLIENT_ID"
    "GOOGLE_DRIVE_CLIENT_SECRET"
)

echo "📋 Variables d'environnement requises :"
echo "======================================"

# Vérifier les variables requises
MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var : Configurée"
    else
        echo "❌ $var : Manquante"
        MISSING_VARS+=("$var")
    fi
done

echo ""
echo "📋 Variables d'environnement optionnelles :"
echo "=========================================="

# Vérifier les variables optionnelles
for var in "${OPTIONAL_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var : Configurée"
    else
        echo "⚠️ $var : Non configurée (optionnel)"
    fi
done

echo ""
echo "🔧 Vérification de la base de données :"
echo "======================================"

# Vérifier la connexion à la base de données
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL détectée"
    
    # Test de connexion
    if command -v npx &> /dev/null; then
        if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
            echo "✅ Connexion à la base de données réussie"
        else
            echo "❌ Erreur de connexion à la base de données"
        fi
    else
        echo "⚠️ npx non disponible, impossible de tester la connexion"
    fi
else
    echo "❌ DATABASE_URL non configurée"
fi

echo ""
echo "📊 Résumé :"
echo "==========="

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "✅ Toutes les variables requises sont configurées"
    echo "🚀 L'environnement est prêt pour la production"
    exit 0
else
    echo "❌ Variables manquantes :"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "🔧 Veuillez configurer ces variables avant le déploiement"
    exit 1
fi
