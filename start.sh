#!/bin/bash

echo "🚀 Starting Lexia application..."

# Générer le client Prisma
echo "📦 Generating Prisma client..."
npx prisma generate

# Attendre que la base de données soit prête
echo "⏳ Waiting for database to be ready..."
sleep 10

# Appliquer les migrations
echo "🗄️ Applying database migrations..."
npx prisma migrate deploy || {
    echo "⚠️ Migration failed, trying to reset..."
    npx prisma migrate reset --force || {
        echo "❌ Database setup failed"
        exit 1
    }
}

# Démarrer l'application
echo "🎯 Starting Next.js application..."
npm start
