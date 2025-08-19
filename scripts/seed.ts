import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create companies
  const company1 = await prisma.company.upsert({
    where: { name: 'TechCorp' },
    update: {},
    create: {
      name: 'TechCorp',
      description: 'Entreprise de technologie innovante',
      logo: 'https://via.placeholder.com/150x50/3B82F6/FFFFFF?text=TechCorp'
    },
  })

  const company2 = await prisma.company.upsert({
    where: { name: 'DesignStudio' },
    update: {},
    create: {
      name: 'DesignStudio',
      description: 'Studio de design créatif',
      logo: 'https://via.placeholder.com/150x50/10B981/FFFFFF?text=DesignStudio'
    },
  })

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lexia.com' },
    update: {},
    create: {
      email: 'admin@lexia.com',
      password: adminPassword,
      name: 'Admin Lexia',
      role: 'ADMIN',
    },
  })

  // Create client users
  const client1Password = await bcrypt.hash('client123', 12)
  const client1 = await prisma.user.upsert({
    where: { email: 'client1@example.com' },
    update: {},
    create: {
      email: 'client1@example.com',
      password: client1Password,
      name: 'Jean Dupont',
      role: 'CLIENT',
      companyId: company1.id,
    },
  })

  const client2Password = await bcrypt.hash('client123', 12)
  const client2 = await prisma.user.upsert({
    where: { email: 'client2@example.com' },
    update: {},
    create: {
      email: 'client2@example.com',
      password: client2Password,
      name: 'Marie Martin',
      role: 'CLIENT',
      companyId: company2.id,
    },
  })

  // Create ProMemoria client
  const promemoriaClientPassword = await bcrypt.hash('client123', 12)
  const promemoriaClient = await prisma.user.upsert({
    where: { email: 'client@promemoria.com' },
    update: {},
    create: {
      email: 'client@promemoria.com',
      password: promemoriaClientPassword,
      name: 'Sophie Bernard',
      role: 'CLIENT',
      companyId: company2.id, // ProMemoria est company2
    },
  })

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Site Web E-commerce',
      description: 'Développement d\'un site web e-commerce moderne avec paiement en ligne',
      status: 'IN_PROGRESS',
      progress: 65,
      clientId: client1.id,
      adminId: admin.id,
      companyId: company1.id,
      steps: {
        create: [
          {
            title: 'Analyse des besoins',
            description: 'Réunion avec le client pour définir les fonctionnalités',
            order: 1,
            completed: true,
            completedAt: new Date('2024-01-15'),
          },
          {
            title: 'Design UI/UX',
            description: 'Création des maquettes et de l\'expérience utilisateur',
            order: 2,
            completed: true,
            completedAt: new Date('2024-01-25'),
          },
          {
            title: 'Développement Frontend',
            description: 'Implémentation de l\'interface utilisateur',
            order: 3,
            completed: true,
            completedAt: new Date('2024-02-10'),
          },
          {
            title: 'Développement Backend',
            description: 'Création de l\'API et de la base de données',
            order: 4,
            completed: false,
          },
          {
            title: 'Intégration paiement',
            description: 'Mise en place du système de paiement sécurisé',
            order: 5,
            completed: false,
          },
          {
            title: 'Tests et déploiement',
            description: 'Tests complets et mise en production',
            order: 6,
            completed: false,
          },
        ],
      },
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Application Mobile',
      description: 'Application mobile iOS et Android pour la gestion de tâches',
      status: 'NOT_STARTED',
      progress: 0,
      clientId: client2.id,
      adminId: admin.id,
      companyId: company2.id,
      steps: {
        create: [
          {
            title: 'Spécifications techniques',
            description: 'Définition de l\'architecture et des technologies',
            order: 1,
            completed: false,
          },
          {
            title: 'Design des écrans',
            description: 'Création des maquettes pour iOS et Android',
            order: 2,
            completed: false,
          },
          {
            title: 'Développement iOS',
            description: 'Implémentation de la version iOS',
            order: 3,
            completed: false,
          },
          {
            title: 'Développement Android',
            description: 'Implémentation de la version Android',
            order: 4,
            completed: false,
          },
          {
            title: 'Tests et validation',
            description: 'Tests sur appareils réels et validation client',
            order: 5,
            completed: false,
          },
        ],
      },
    },
  })

  // Create ProMemoria project
  const project3 = await prisma.project.create({
    data: {
      name: 'Solution Sténotypie IA',
      description: 'Développement d\'une solution d\'intelligence artificielle pour la sténotypie',
      status: 'IN_PROGRESS',
      progress: 35,
      clientId: promemoriaClient.id,
      adminId: admin.id,
      companyId: company2.id, // ProMemoria
      steps: {
        create: [
          {
            title: 'Analyse des besoins',
            description: 'Étude des processus de sténotypie existants',
            order: 1,
            completed: true,
            completedAt: new Date('2024-01-10'),
          },
          {
            title: 'Développement IA',
            description: 'Création des modèles d\'IA pour la reconnaissance vocale',
            order: 2,
            completed: true,
            completedAt: new Date('2024-01-20'),
          },
          {
            title: 'Interface utilisateur',
            description: 'Développement de l\'interface pour les sténotypistes',
            order: 3,
            completed: false,
          },
          {
            title: 'Tests et validation',
            description: 'Tests avec des sténotypistes professionnels',
            order: 4,
            completed: false,
          },
        ],
      },
    },
  })

  // Create tickets
  await prisma.ticket.create({
    data: {
      subject: 'Question sur le design',
      message: 'Bonjour, j\'aimerais savoir si nous pouvons modifier la couleur principale du site ?',
      priority: 'MEDIUM',
      userId: client1.id,
      projectId: project1.id,
    },
  })

  await prisma.ticket.create({
    data: {
      subject: 'Problème de connexion',
      message: 'Je n\'arrive pas à me connecter à l\'espace client depuis hier.',
      priority: 'HIGH',
      userId: client2.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Test accounts:')
  console.log('Admin: admin@lexia.com / admin123')
  console.log('Client 1 (TechCorp): client1@example.com / client123')
  console.log('Client 2 (DesignStudio): client2@example.com / client123')
  console.log('Client ProMemoria: client@promemoria.com / client123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
