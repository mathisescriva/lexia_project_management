const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test query
    const users = await prisma.user.findMany()
    console.log('✅ Query successful, found users:', users.length)
    
    // Test specific user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@lexia.com' }
    })
    
    if (admin) {
      console.log('✅ Admin user found:', {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      })
    } else {
      console.log('❌ Admin user not found')
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
