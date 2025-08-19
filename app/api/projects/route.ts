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

    let projects
    if (user.role === 'ADMIN') {
      // Admin sees all projects
      projects = await prisma.project.findMany({
        include: {
          client: {
            select: { id: true, name: true, email: true }
          },
          steps: true,
          actions: {
            orderBy: { order: 'asc' }
          },
          files: true,
          _count: {
            select: { tickets: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    } else {
      // Client sees projects from their company
      projects = await prisma.project.findMany({
        where: { 
          companyId: user.companyId 
        },
        include: {
          client: {
            select: { id: true, name: true, email: true }
          },
          steps: true,
          actions: {
            orderBy: { order: 'asc' }
          },
          files: true,
          _count: {
            select: { tickets: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const { name, description, companyId, startDate, endDate, steps, actions } = await request.json()

    if (!name || !companyId) {
      return NextResponse.json(
        { error: 'Nom et entreprise requis' },
        { status: 400 }
      )
    }

    // Récupérer le premier client de l'entreprise pour le champ clientId (requis par le schéma)
    const firstClient = await prisma.user.findFirst({
      where: { 
        companyId: companyId,
        role: 'CLIENT'
      },
      select: { id: true }
    })

    if (!firstClient) {
      return NextResponse.json(
        { error: 'Aucun client trouvé dans cette entreprise' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        clientId: firstClient.id,
        adminId: user.id,
        companyId: companyId,
        steps: {
          create: steps?.map((step: any, index: number) => ({
            title: step.title,
            description: step.description,
            startDate: step.startDate ? new Date(step.startDate) : null,
            endDate: step.endDate ? new Date(step.endDate) : null,
            order: index + 1
          })) || []
        },
        actions: {
          create: actions?.map((action: any, index: number) => ({
            title: action.title,
            description: action.description,
            type: action.type,
            dueDate: action.dueDate ? new Date(action.dueDate) : null,
            order: index + 1
          })) || []
        }
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        steps: true,
        actions: true
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
