#!/bin/bash

# Script pour vérifier le statut du déploiement Render
# Nécessite l'API Render (optionnel)

echo "🔍 Vérification du statut du déploiement Render..."

# URL de l'application
APP_URL="https://lexia-onboarding.onrender.com"

echo "🌐 URL de l'application: $APP_URL"
echo ""

# Test de connectivité
echo "📡 Test de connectivité..."
if curl -s --head "$APP_URL" | head -n 1 | grep "HTTP/1.[01] [23].." > /dev/null; then
    echo "✅ L'application répond"
else
    echo "❌ L'application ne répond pas"
    echo "   Cela peut être normal si le déploiement est encore en cours"
fi

echo ""
echo "📋 Prochaines étapes:"
echo "1. Allez sur https://dashboard.render.com"
echo "2. Vérifiez le statut du service 'lexia-onboarding'"
echo "3. Consultez les logs de déploiement"
echo "4. Une fois déployé, testez l'application sur: $APP_URL"
echo ""
echo "🔧 En cas de problème:"
echo "- Vérifiez les logs dans l'interface Render"
echo "- Assurez-vous que toutes les variables d'environnement sont configurées"
echo "- Vérifiez que la base de données est accessible"
