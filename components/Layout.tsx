'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from './Logo'
import Avatar from './Avatar'
import { 
  HomeIcon, 
  FolderIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  BuildingOfficeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projets', href: '/projects', icon: FolderIcon },
    { name: 'Support', href: '/tickets', icon: ChatBubbleLeftRightIcon },
  ]

  if (user?.role === 'ADMIN') {
    navigation.push({ name: 'Entreprises', href: '/companies', icon: BuildingOfficeIcon })
    navigation.push({ name: 'Utilisateurs', href: '/users', icon: UserIcon })
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-beige-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 bg-sage-50">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-sage-400 hover:text-sage-600 transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-1 ${
                  isActive(item.href)
                    ? 'bg-sage-100 text-sage-800 shadow-sm'
                    : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800 hover:shadow-sm'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`mr-3 h-5 w-5 transition-all duration-300 ease-in-out transform group-hover:scale-110 ${
                  isActive(item.href) 
                    ? 'text-sage-700' 
                    : 'text-sage-500 group-hover:text-sage-700'
                }`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-sage-200 p-4 bg-sage-50">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <Avatar user={user || undefined} size="md" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sage-800">{user?.name}</p>
                <p className="text-xs text-sage-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-sage-600 hover:bg-sage-100 hover:text-sage-800 rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-1"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-sage-200 shadow-sm">
          <div className="flex h-16 items-center px-4 bg-sage-50">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-1 ${
                  isActive(item.href)
                    ? 'bg-sage-100 text-sage-800 shadow-sm'
                    : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800 hover:shadow-sm'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 transition-all duration-300 ease-in-out transform group-hover:scale-110 ${
                  isActive(item.href) 
                    ? 'text-sage-700' 
                    : 'text-sage-500 group-hover:text-sage-700'
                }`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-sage-200 p-4 bg-sage-50">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <Avatar user={user || undefined} size="md" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sage-800">{user?.name}</p>
                <p className="text-xs text-sage-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-sage-600 hover:bg-sage-100 hover:text-sage-800 rounded-lg transition-all duration-200"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile menu button - floating */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button
            type="button"
            className="p-2 bg-white/90 backdrop-blur-sm border border-sage-200/50 rounded-lg shadow-lg text-sage-700 hover:bg-white hover:shadow-xl transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
