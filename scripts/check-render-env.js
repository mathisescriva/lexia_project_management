// Script pour vérifier les variables d'environnement sur Render
const https = require('https');

async function checkRenderEnvironment() {
  console.log('🔍 Vérification des variables d\'environnement sur Render...');
  console.log('');

  // Test de connexion à la base de données
  console.log('📊 Test de connexion à la base de données...');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$connect();
    console.log('✅ DATABASE_URL: Configurée et fonctionnelle');
    await prisma.$disconnect();
  } catch (error) {
    console.log('❌ DATABASE_URL: Erreur de connexion');
    console.log('   Erreur:', error.message);
  }

  console.log('');

  // Test de JWT_SECRET
  console.log('🔐 Test de JWT_SECRET...');
  try {
    const jwt = require('jsonwebtoken');
    const testSecret = process.env.JWT_SECRET || 'default-secret';
    
    const token = jwt.sign({ test: 'data' }, testSecret);
    const decoded = jwt.verify(token, testSecret);
    
    if (decoded.test === 'data') {
      console.log('✅ JWT_SECRET: Configuré et fonctionnel');
    } else {
      console.log('❌ JWT_SECRET: Problème de configuration');
    }
  } catch (error) {
    console.log('❌ JWT_SECRET: Erreur de configuration');
    console.log('   Erreur:', error.message);
  }

  console.log('');
  console.log('📋 Variables d\'environnement nécessaires:');
  console.log('   ✅ DATABASE_URL (PostgreSQL sur Render)');
  console.log('   ❌ JWT_SECRET (manquante sur Render)');
  console.log('   ⚠️ NODE_ENV (production)');
  console.log('');

  console.log('🔧 Solution:');
  console.log('1. Allez sur https://dashboard.render.com');
  console.log('2. Sélectionnez votre service web');
  console.log('3. Allez dans "Environment"');
  console.log('4. Ajoutez la variable:');
  console.log('   Clé: JWT_SECRET');
  console.log('   Valeur: votre-super-secret-jwt-key-change-this-in-production');
  console.log('5. Redéployez le service');
}

checkRenderEnvironment();
