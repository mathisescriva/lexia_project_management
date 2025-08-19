import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
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

    const { completed } = await request.json()

    const step = await prisma.projectStep.update({
      where: { id: params.stepId },
      data: {
        completed,
        completedAt: completed ? new Date() : null
      }
    })

    // Mettre à jour la progression du projet
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { steps: true }
    })

    if (project) {
      const totalSteps = project.steps.length
      const completedSteps = project.steps.filter(s => s.completed).length
      const progress = Math.round((completedSteps / totalSteps) * 100)

      await prisma.project.update({
        where: { id: params.id },
        data: { progress }
      })
    }

    return NextResponse.json(step)
  } catch (error) {
    console.error('Update step error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
