import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding production database...')

  // Vérifier si un admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists, skipping admin creation')
  } else {
    // Créer un admin par défaut pour la production
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@lexia.com',
        password: adminPassword,
        name: 'Admin Lexia',
        role: 'ADMIN',
      },
    })
    console.log('✅ Admin user created:', admin.email)
  }

  // Vérifier si des entreprises existent déjà
  const existingCompanies = await prisma.company.count()
  
  if (existingCompanies === 0) {
    // Créer une entreprise par défaut
    const defaultCompany = await prisma.company.create({
      data: {
        name: 'Entreprise par défaut',
        description: 'Entreprise créée automatiquement lors du déploiement',
        logo: 'https://via.placeholder.com/150x50/3B82F6/FFFFFF?text=Default'
      },
    })
    console.log('✅ Default company created:', defaultCompany.name)
  } else {
    console.log('✅ Companies already exist, skipping company creation')
  }

  console.log('✅ Production database seeded successfully!')
  console.log('\n📋 Default admin account:')
  console.log('Email: admin@lexia.com')
  console.log('Password: admin123')
  console.log('\n⚠️ IMPORTANT: Change the default password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding production database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
