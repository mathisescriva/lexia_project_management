-- Script SQL pour créer les tables de Lexia Project Management
-- À exécuter dans Supabase SQL Editor

-- Table companies
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT UNIQUE NOT NULL,
  logo TEXT,
  description TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'CLIENT',
  "companyId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("companyId") REFERENCES companies(id)
);

-- Table projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'IN_PROGRESS',
  progress INTEGER DEFAULT 0,
  "startDate" TIMESTAMP WITH TIME ZONE,
  "endDate" TIMESTAMP WITH TIME ZONE,
  "driveFolderId" TEXT,
  "driveFolderUrl" TEXT,
  "clientId" TEXT NOT NULL,
  "adminId" TEXT NOT NULL,
  "companyId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("clientId") REFERENCES users(id),
  FOREIGN KEY ("adminId") REFERENCES users(id),
  FOREIGN KEY ("companyId") REFERENCES companies(id)
);

-- Table project_steps
CREATE TABLE IF NOT EXISTS project_steps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  "completedAt" TIMESTAMP WITH TIME ZONE,
  "startDate" TIMESTAMP WITH TIME ZONE,
  "endDate" TIMESTAMP WITH TIME ZONE,
  "projectId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE CASCADE
);

-- Table project_actions
CREATE TABLE IF NOT EXISTS project_actions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'CLIENT',
  completed BOOLEAN DEFAULT FALSE,
  "completedAt" TIMESTAMP WITH TIME ZONE,
  "dueDate" TIMESTAMP WITH TIME ZONE,
  "order" INTEGER NOT NULL,
  "projectId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE CASCADE
);

-- Table project_files
CREATE TABLE IF NOT EXISTS project_files (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  "driveFileId" TEXT NOT NULL,
  "driveFileUrl" TEXT NOT NULL,
  "mimeType" TEXT,
  size INTEGER,
  "projectId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE CASCADE
);

-- Table tickets
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN',
  priority TEXT DEFAULT 'MEDIUM',
  "userId" TEXT NOT NULL,
  "projectId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES users(id),
  FOREIGN KEY ("projectId") REFERENCES projects(id)
);

-- Table ticket_responses
CREATE TABLE IF NOT EXISTS ticket_responses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  message TEXT NOT NULL,
  "isAdmin" BOOLEAN DEFAULT FALSE,
  "ticketId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("ticketId") REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES users(id)
);

-- Table comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES users(id)
);

-- Créer un utilisateur admin par défaut
INSERT INTO users (email, password, name, role) 
VALUES ('admin@lexia.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', 'Admin Lexia', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Créer une entreprise par défaut
INSERT INTO companies (name, description) 
VALUES ('Lexia', 'Entreprise de développement web')
ON CONFLICT (name) DO NOTHING;
