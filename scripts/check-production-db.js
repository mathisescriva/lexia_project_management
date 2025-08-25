// Script pour vérifier les utilisateurs dans la base de données de production
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProductionDatabase() {
  try {
    console.log('🔍 Vérification de la base de données de production...');
    console.log('');

    // Vérifier la connexion
    console.log('📡 Test de connexion...');
    await prisma.$connect();
    console.log('✅ Connexion réussie');
    console.log('');

    // Compter les utilisateurs
    console.log('👥 Utilisateurs dans la base de données :');
    const userCount = await prisma.user.count();
    console.log(`Total: ${userCount} utilisateur(s)`);
    console.log('');

    if (userCount > 0) {
      // Lister les utilisateurs
      console.log('📋 Liste des utilisateurs :');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          company: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Entreprise: ${user.company?.name || 'Aucune'}`);
        console.log(`   Créé: ${user.createdAt.toLocaleDateString('fr-FR')}`);
        console.log('');
      });
    } else {
      console.log('❌ Aucun utilisateur trouvé');
      console.log('');
      console.log('🌱 Pour ajouter des utilisateurs de test :');
      console.log('1. Allez sur https://lexia-onboarding.onrender.com/login');
      console.log('2. Créez un compte administrateur');
      console.log('3. Ou exécutez le script de seeding en production');
    }

    // Vérifier les entreprises
    console.log('🏢 Entreprises dans la base de données :');
    const companyCount = await prisma.company.count();
    console.log(`Total: ${companyCount} entreprise(s)`);
    console.log('');

    if (companyCount > 0) {
      const companies = await prisma.company.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          _count: {
            select: {
              users: true,
              projects: true
            }
          }
        }
      });

      companies.forEach((company, index) => {
        console.log(`${index + 1}. ${company.name}`);
        console.log(`   Description: ${company.description || 'Aucune'}`);
        console.log(`   Utilisateurs: ${company._count.users}`);
        console.log(`   Projets: ${company._count.projects}`);
        console.log(`   Créé: ${company.createdAt.toLocaleDateString('fr-FR')}`);
        console.log('');
      });
    }

    // Vérifier les projets
    console.log('📁 Projets dans la base de données :');
    const projectCount = await prisma.project.count();
    console.log(`Total: ${projectCount} projet(s)`);
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification :', error.message);
    
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
  console.log('Pour tester localement, utilisez : npm run db:studio');
  console.log('');
}

checkProductionDatabase();
