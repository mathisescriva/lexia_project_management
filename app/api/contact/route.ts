import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const { subject, message, projectId } = await request.json()

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Sujet et message requis' },
        { status: 400 }
      )
    }

    // Créer un ticket de contact
    const ticket = await prisma.ticket.create({
      data: {
        subject: `[CONTACT] ${subject.trim()}`,
        message: message.trim(),
        priority: 'MEDIUM',
        status: 'OPEN',
        userId: user.id,
        projectId: projectId || null
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
