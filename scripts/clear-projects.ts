import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearProjects() {
  console.log('🗑️  Suppression de tous les projets...')

  try {
    // Supprimer tous les tickets d'abord (car ils référencent les projets)
    const deletedTickets = await prisma.ticket.deleteMany({})
    console.log(`✅ ${deletedTickets.count} tickets supprimés`)

    // Supprimer toutes les étapes de projets
    const deletedSteps = await prisma.projectStep.deleteMany({})
    console.log(`✅ ${deletedSteps.count} étapes de projets supprimées`)

    // Supprimer tous les fichiers de projets
    const deletedFiles = await prisma.projectFile.deleteMany({})
    console.log(`✅ ${deletedFiles.count} fichiers de projets supprimés`)

    // Supprimer tous les projets
    const deletedProjects = await prisma.project.deleteMany({})
    console.log(`✅ ${deletedProjects.count} projets supprimés`)

    console.log('🎉 Tous les projets ont été supprimés avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des projets:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearProjects()
