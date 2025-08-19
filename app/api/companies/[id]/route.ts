import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { name, description, logo } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Nom de l\'entreprise requis' },
        { status: 400 }
      )
    }

    const company = await prisma.company.update({
      where: { id: params.id },
      data: {
        name,
        description,
        logo
      },
      include: {
        _count: {
          select: {
            users: true,
            projects: true
          }
        }
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Update company error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // Vérifier si l'entreprise existe
    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            users: true,
            projects: true
          }
        }
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Entreprise non trouvée' }, { status: 404 })
    }

    // Désassocier les utilisateurs et projets avant de supprimer l'entreprise
    await prisma.$transaction([
      // Désassocier les utilisateurs
      prisma.user.updateMany({
        where: { companyId: params.id },
        data: { companyId: null }
      }),
      // Désassocier les projets
      prisma.project.updateMany({
        where: { companyId: params.id },
        data: { companyId: null }
      }),
      // Supprimer l'entreprise
      prisma.company.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({ 
      success: true, 
      message: `Entreprise supprimée. ${company._count.users} utilisateur(s) et ${company._count.projects} projet(s) ont été désassociés.`
    })
  } catch (error) {
    console.error('Delete company error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
