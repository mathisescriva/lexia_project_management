import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({ results: {} })
    }

    const results: any = {}

    // Recherche dans les projets
    const projectWhere = user.role === 'ADMIN' 
      ? {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } }
          ]
        }
      : {
          clientId: user.id,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } }
          ]
        }

    results.projects = await prisma.project.findMany({
      where: projectWhere,
      include: {
        client: { select: { name: true } },
        admin: { select: { name: true } }
      },
      take: 10
    })

    // Recherche dans les actions
    const actionWhere = user.role === 'ADMIN'
      ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ]
        }
      : {
          project: { clientId: user.id },
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ]
        }

    results.actions = await prisma.projectAction.findMany({
      where: actionWhere,
      include: {
        project: { select: { name: true } }
      },
      take: 10
    })

    // Recherche dans les tickets
    const ticketWhere = user.role === 'ADMIN'
      ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ]
        }
      : {
          userId: user.id,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ]
        }

    results.tickets = await prisma.ticket.findMany({
      where: ticketWhere,
      include: {
        project: { select: { name: true } }
      },
      take: 10
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

