import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Vérifier que nous sommes en production
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(
        { error: 'Route uniquement disponible en production' },
        { status: 403 }
      )
    }

    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Un administrateur existe déjà' },
        { status: 409 }
      )
    }

    // Récupérer les données de la requête
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nom, email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'administrateur
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        avatar: '/avatars/avatar_homme.svg'
      }
    })

    console.log('✅ Premier administrateur créé:', admin.email)

    return NextResponse.json({
      success: true,
      message: 'Administrateur créé avec succès',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'administrateur' },
      { status: 500 }
    )
  }
}
