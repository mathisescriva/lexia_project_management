import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { googleDriveService } from '@/lib/google-drive'

export async function POST(
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

    // Récupérer le projet
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        driveFolderId: true, 
        driveFolderUrl: true,
        files: true
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    if (!project.driveFolderId) {
      return NextResponse.json({ 
        error: 'Aucun dossier Google Drive configuré pour ce projet' 
      }, { status: 400 })
    }

    // Vérifier si Google Drive est configuré
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
      return NextResponse.json({ 
        error: 'Google Drive API non configurée' 
      }, { status: 500 })
    }

    try {
      // Récupérer les fichiers depuis Google Drive
      const driveFiles = await googleDriveService.listFiles(project.driveFolderId)
      
      // Synchroniser avec la base de données
      const syncedFiles = []
      
      for (const driveFile of driveFiles) {
        // Vérifier si le fichier existe déjà dans la base de données
        const existingFile = project.files.find(
          file => file.driveFileId === driveFile.id
        )

        if (!existingFile) {
          // Ajouter le nouveau fichier
          const newFile = await prisma.projectFile.create({
            data: {
              name: driveFile.name,
              driveFileId: driveFile.id,
              driveFileUrl: driveFile.webViewLink,
              mimeType: driveFile.mimeType,
              size: driveFile.size ? parseInt(driveFile.size) : null,
              projectId: project.id
            }
          })
          syncedFiles.push(newFile)
        }
      }

      // Récupérer tous les fichiers mis à jour
      const updatedFiles = await prisma.projectFile.findMany({
        where: { projectId: project.id },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        message: `Synchronisation terminée. ${syncedFiles.length} nouveau(x) fichier(s) ajouté(s).`,
        syncedFiles,
        totalFiles: updatedFiles.length,
        files: updatedFiles
      })

    } catch (driveError) {
      console.error('Google Drive sync error:', driveError)
      return NextResponse.json({ 
        error: 'Erreur lors de la synchronisation avec Google Drive' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Sync files error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
