import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
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

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        },
        steps: {
          orderBy: { order: 'asc' }
        },
        actions: {
          orderBy: { order: 'asc' }
        },
        files: {
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { tickets: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    // Vérifier les permissions
    if (user.role === 'CLIENT' && project.companyId !== user.companyId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

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

    const {
      name,
      description,
      status,
      startDate,
      endDate,
      clientId,
      companyId,
      driveFolderUrl,
      steps,
      actions
    } = await request.json()

    if (!name || !clientId) {
      return NextResponse.json(
        { error: 'Nom et client requis' },
        { status: 400 }
      )
    }

    // Mettre à jour le projet
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        name,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        clientId,
        companyId: companyId || null,
        driveFolderUrl
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        },
        steps: {
          orderBy: { order: 'asc' }
        },
        files: {
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { tickets: true }
        }
      }
    })

    // Mettre à jour les étapes
    if (steps && Array.isArray(steps)) {
      // Supprimer toutes les étapes existantes
      await prisma.projectStep.deleteMany({
        where: { projectId: params.id }
      })

      // Créer les nouvelles étapes
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        await prisma.projectStep.create({
          data: {
            title: step.title,
            description: step.description,
            completed: step.completed,
            startDate: step.startDate ? new Date(step.startDate) : null,
            endDate: step.endDate ? new Date(step.endDate) : null,
            order: i,
            projectId: params.id
          }
        })
      }

      // Recalculer la progression
      const completedSteps = steps.filter((step: any) => step.completed).length
      const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0

      await prisma.project.update({
        where: { id: params.id },
        data: { progress }
      })
    }

    // Mettre à jour les actions
    if (actions && Array.isArray(actions)) {
      // Supprimer toutes les actions existantes
      await prisma.projectAction.deleteMany({
        where: { projectId: params.id }
      })

      // Créer les nouvelles actions
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i]
        await prisma.projectAction.create({
          data: {
            title: action.title,
            description: action.description,
            type: action.type,
            completed: action.completed,
            dueDate: action.dueDate ? new Date(action.dueDate) : null,
            order: i,
            projectId: params.id
          }
        })
      }
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Update project error:', error)
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

    // Vérifier que le projet existe
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    // Supprimer le projet (les relations seront supprimées en cascade)
    await prisma.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Projet supprimé avec succès' })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
