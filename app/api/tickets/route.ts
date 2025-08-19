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

    let tickets
    if (user.role === 'ADMIN') {
      // Admin sees all tickets
      tickets = await prisma.ticket.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          project: {
            select: { id: true, name: true }
          },
          responses: {
            include: {
              user: {
                select: { id: true, name: true, role: true }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    } else {
      // Client sees only their tickets
      tickets = await prisma.ticket.findMany({
        where: { userId: user.id },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          project: {
            select: { id: true, name: true }
          },
          responses: {
            include: {
              user: {
                select: { id: true, name: true, role: true }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    }

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Get tickets error:', error)
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

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const { subject, message, projectId, priority } = await request.json()

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Sujet et message requis' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        message,
        priority: priority || 'MEDIUM',
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
    console.error('Create ticket error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
