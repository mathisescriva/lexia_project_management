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

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'ID du projet requis' }, { status: 400 })
    }

    // Récupérer les commentaires depuis la table Comment
    const comments = await prisma.comment.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, role: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transformer en format attendu par le frontend
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.user
    }))

    return NextResponse.json(formattedComments)
  } catch (error) {
    console.error('Get comments error:', error)
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

    const { projectId, content } = await request.json()

    if (!projectId || !content?.trim()) {
      return NextResponse.json(
        { error: 'ID du projet et contenu requis' },
        { status: 400 }
      )
    }

    // Créer un commentaire dans la table Comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: payload.userId,
        projectId
      },
      include: {
        user: {
          select: { id: true, name: true, role: true, avatar: true }
        }
      }
    })

    // Transformer en format attendu par le frontend
    const formattedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.user
    }

    return NextResponse.json(formattedComment, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
