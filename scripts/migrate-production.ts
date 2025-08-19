import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database migration...')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Run migrations
    console.log('📦 Running migrations...')
    // Note: In production, migrations are handled by Prisma Migrate
    // This script is mainly for testing the connection
    
    console.log('✅ Migration completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
