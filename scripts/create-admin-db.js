// Script pour créer un administrateur directement en base de données
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminDirect() {
  try {
    console.log('🔍 Connexion à la base de données de production...');
    
    // Vérifier la connexion
    await prisma.$connect();
    console.log('✅ Connexion réussie');
    console.log('');

    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('⚠️ Un administrateur existe déjà :');
      console.log(`   Nom: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Rôle: ${existingAdmin.role}`);
      console.log('');
      console.log('🔗 Vous pouvez vous connecter sur :');
      console.log('https://lexia-onboarding.onrender.com/login');
      return;
    }

    console.log('👤 Création du premier administrateur...');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer l'administrateur
    const admin = await prisma.user.create({
      data: {
        name: 'Administrateur Lexia',
        email: 'admin@lexia.com',
        password: hashedPassword,
        role: 'ADMIN',
        avatar: '/avatars/avatar_homme.svg'
      }
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log('');
    console.log('🔐 Identifiants de connexion :');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Mot de passe: admin123`);
    console.log('');
    console.log('🔗 Connectez-vous sur :');
    console.log('https://lexia-onboarding.onrender.com/login');
    console.log('');
    console.log('⚠️ IMPORTANT : Changez le mot de passe après la première connexion !');

  } catch (error) {
    console.error('❌ Erreur :', error.message);
    
    if (error.code === 'P1001') {
      console.log('🔧 Problème de connexion à la base de données');
      console.log('Vérifiez que la variable DATABASE_URL est configurée');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Vérifier si on est en production
if (process.env.NODE_ENV !== 'production') {
  console.log('⚠️ Attention : Ce script est conçu pour la production');
  console.log('Pour tester localement, utilisez : npm run db:seed');
  console.log('');
}

createAdminDirect();
