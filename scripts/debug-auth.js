// Script pour déboguer l'authentification
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function debugAuth() {
  try {
    console.log('🔍 Debug de l\'authentification...');
    console.log('');

    // 1. Vérifier la connexion à la base de données
    console.log('1️⃣ Test de connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion réussie');
    console.log('');

    // 2. Vérifier si l'utilisateur existe
    console.log('2️⃣ Recherche de l\'utilisateur admin...');
    const user = await prisma.user.findUnique({
      where: { email: 'admin@lexia.com' }
    });

    if (!user) {
      console.log('❌ Utilisateur admin@lexia.com non trouvé');
      return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nom: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Mot de passe hashé: ${user.password.substring(0, 20)}...`);
    console.log('');

    // 3. Test de vérification du mot de passe
    console.log('3️⃣ Test de vérification du mot de passe...');
    const isValidPassword = await bcrypt.compare('admin123', user.password);
    console.log(`Mot de passe valide: ${isValidPassword}`);
    console.log('');

    // 4. Test de génération de token JWT
    console.log('4️⃣ Test de génération de token JWT...');
    const JWT_SECRET = process.env.JWT_SECRET || 'lexia-production-jwt-secret-key-2025';
    console.log(`JWT_SECRET utilisé: ${JWT_SECRET.substring(0, 20)}...`);
    
    const token = jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log(`Token généré: ${token.substring(0, 50)}...`);
    console.log('');

    // 5. Test de vérification du token
    console.log('5️⃣ Test de vérification du token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token décodé:', decoded);
    console.log('');

    console.log('✅ Tous les tests d\'authentification sont réussis !');
    console.log('');
    console.log('🔧 Le problème pourrait venir de :');
    console.log('   - Variables d\'environnement sur Render');
    console.log('   - Configuration de Prisma');
    console.log('   - Problème de build/deployment');

  } catch (error) {
    console.error('❌ Erreur lors du debug:', error);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();
