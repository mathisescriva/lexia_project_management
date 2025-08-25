import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test route appelée')
    
    // Test 1: Connexion à la base de données
    console.log('1️⃣ Test de connexion à la base de données...')
    await prisma.$connect()
    console.log('✅ Connexion DB réussie')
    
    // Test 2: Recherche d'utilisateur
    console.log('2️⃣ Recherche d\'utilisateur...')
    const user = await prisma.user.findFirst()
    console.log('✅ Utilisateur trouvé:', user ? user.email : 'Aucun')
    
    // Test 3: Variables d'environnement
    console.log('3️⃣ Variables d\'environnement...')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configuré' : 'Non configuré')
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Configuré' : 'Non configuré')
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Tests réussis',
      data: {
        database: 'Connecté',
        user: user ? user.email : 'Aucun utilisateur',
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    })
    
  } catch (error) {
    console.error('❌ Erreur dans la route de test:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
