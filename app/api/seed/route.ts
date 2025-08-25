import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Vérifier que nous sommes en production
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(
        { error: 'Seeding uniquement autorisé en production' },
        { status: 403 }
      )
    }

    // Vérifier si des utilisateurs existent déjà
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return NextResponse.json(
        { error: 'La base de données contient déjà des utilisateurs' },
        { status: 409 }
      )
    }

    console.log('🌱 Début du seeding en production...')

    // Créer l'administrateur
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Administrateur Lexia',
        email: 'admin@lexia.com',
        password: adminPassword,
        role: 'ADMIN',
        avatar: '/avatars/avatar_homme.svg'
      }
    })

    // Créer les entreprises
    const company1 = await prisma.company.create({
      data: {
        name: 'TechCorp',
        description: 'Entreprise de développement logiciel',
        logo: '/atlas-logo.png'
      }
    })

    const company2 = await prisma.company.create({
      data: {
        name: 'ProMemoria',
        description: 'Spécialiste en solutions de sténotypie',
        logo: '/atlas-logo.png'
      }
    })

    // Créer les clients
    const clientPassword = await bcrypt.hash('client123', 10)
    const client1 = await prisma.user.create({
      data: {
        name: 'Jean Dupont',
        email: 'client1@example.com',
        password: clientPassword,
        role: 'CLIENT',
        companyId: company1.id,
        avatar: '/avatars/avatar_homme.svg'
      }
    })

    const client2 = await prisma.user.create({
      data: {
        name: 'Marie Martin',
        email: 'client2@example.com',
        password: clientPassword,
        role: 'CLIENT',
        companyId: company2.id,
        avatar: '/avatars/avatar_femme.svg'
      }
    })

    const promemoriaClient = await prisma.user.create({
      data: {
        name: 'Pierre Durand',
        email: 'client@promemoria.com',
        password: clientPassword,
        role: 'CLIENT',
        companyId: company2.id,
        avatar: '/avatars/avatar_homme.svg'
      }
    })

    // Créer des projets
    const project1 = await prisma.project.create({
      data: {
        name: 'Site Web E-commerce',
        description: 'Développement d\'un site web e-commerce moderne',
        status: 'IN_PROGRESS',
        progress: 65,
        clientId: client1.id,
        adminId: admin.id,
        companyId: company1.id,
        steps: {
          create: [
            {
              title: 'Analyse des besoins',
              description: 'Étude des fonctionnalités requises',
              order: 1,
              completed: true,
              completedAt: new Date('2024-01-05'),
            },
            {
              title: 'Design UI/UX',
              description: 'Création des maquettes et prototypes',
              order: 2,
              completed: true,
              completedAt: new Date('2024-01-15'),
            },
            {
              title: 'Développement Frontend',
              description: 'Implémentation de l\'interface utilisateur',
              order: 3,
              completed: false,
            },
            {
              title: 'Développement Backend',
              description: 'Création de l\'API et de la base de données',
              order: 4,
              completed: false,
            },
            {
              title: 'Tests et déploiement',
              description: 'Tests finaux et mise en production',
              order: 5,
              completed: false,
            },
          ],
        },
      },
    })

    const project2 = await prisma.project.create({
      data: {
        name: 'Application Mobile',
        description: 'Application mobile iOS et Android',
        status: 'NOT_STARTED',
        progress: 0,
        clientId: client2.id,
        adminId: admin.id,
        companyId: company2.id,
        steps: {
          create: [
            {
              title: 'Analyse des besoins',
              description: 'Étude des fonctionnalités mobiles',
              order: 1,
              completed: false,
            },
            {
              title: 'Design mobile',
              description: 'Création des maquettes mobiles',
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

    const project3 = await prisma.project.create({
      data: {
        name: 'Solution Sténotypie IA',
        description: 'Développement d\'une solution d\'intelligence artificielle pour la sténotypie',
        status: 'IN_PROGRESS',
        progress: 35,
        clientId: promemoriaClient.id,
        adminId: admin.id,
        companyId: company2.id,
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

    // Créer des tickets
    await prisma.ticket.create({
      data: {
        title: 'Question sur le design',
        description: 'Bonjour, j\'aimerais savoir si nous pouvons modifier la couleur principale du site ?',
        priority: 'MEDIUM',
        userId: client1.id,
        projectId: project1.id,
      },
    })

    await prisma.ticket.create({
      data: {
        title: 'Problème de connexion',
        description: 'Je n\'arrive pas à me connecter à l\'espace client depuis hier.',
        priority: 'HIGH',
        userId: client2.id,
      },
    })

    console.log('✅ Seeding terminé avec succès !')

    return NextResponse.json({
      success: true,
      message: 'Base de données initialisée avec succès',
      data: {
        users: 4,
        companies: 2,
        projects: 3,
        tickets: 2
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation de la base de données' },
      { status: 500 }
    )
  }
}
