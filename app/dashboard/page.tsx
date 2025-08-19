'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { 
  FolderIcon, 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline'

interface ProjectAction {
  id: string
  title: string
  description: string
  type: string
  completed: boolean
  dueDate?: string
  order: number
}

interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  steps: any[]
  actions: ProjectAction[]
  _count: { tickets: number }
  client?: { id: string; name: string; email: string }
}

interface Ticket {
  id: string
  subject: string
  status: string
  priority: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
    fetchTickets()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed'
      case 'IN_PROGRESS':
        return 'status-in-progress'
      case 'ON_HOLD':
        return 'status-on-hold'
      default:
        return 'status-not-started'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Terminé'
      case 'IN_PROGRESS':
        return 'En cours'
      case 'ON_HOLD':
        return 'En attente'
      case 'NOT_STARTED':
        return 'Non démarré'
      default:
        return status
    }
  }

  // Récupérer toutes les actions côté client non terminées
  const getClientActions = () => {
    const allActions: Array<{ project: Project; action: ProjectAction }> = []
    projects.forEach(project => {
      if (project.actions) {
        project.actions
          .filter(action => action.type === 'CLIENT' && !action.completed)
          .forEach(action => {
            allActions.push({ project, action })
          })
      }
    })
    return allActions.sort((a, b) => {
      // Priorité par date d'échéance
      if (a.action.dueDate && b.action.dueDate) {
        return new Date(a.action.dueDate).getTime() - new Date(b.action.dueDate).getTime()
      }
      if (a.action.dueDate) return -1
      if (b.action.dueDate) return 1
      return a.action.order - b.action.order
    })
  }

  const clientActions = getClientActions()

  // Actions urgentes (échéance dans les 3 jours)
  const getUrgentActions = () => {
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    
    return clientActions.filter(({ action }) => {
      if (!action.dueDate) return false
      const dueDate = new Date(action.dueDate)
      return dueDate <= threeDaysFromNow
    })
  }

  const urgentActions = getUrgentActions()

  // Compter les tickets ouverts
  const openTicketsCount = tickets.filter(ticket => 
    ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS'
  ).length

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-10">
        {/* Header professionnel */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-sage-800 mb-2">
                Tableau de bord
              </h1>
              <p className="text-sage-600">
                {user?.role === 'ADMIN' 
                  ? 'Vue d\'ensemble de tous les projets et activités'
                  : 'Suivi de vos projets et actions en cours'
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-sage-500">Dernière mise à jour</p>
              <p className="text-sm font-medium text-sage-700">
                {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions prioritaires pour les clients - Section principale */}
        {user?.role === 'CLIENT' && (
          <div className="space-y-8">
            {/* Actions urgentes */}
            {urgentActions.length > 0 && (
              <div className="card-elegant">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FireIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-sage-800">
                        Actions prioritaires
                      </h2>
                      <p className="text-sm text-sage-600">
                        {urgentActions.length} tâche(s) à traiter en priorité
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{urgentActions.length}</div>
                    <div className="text-xs text-sage-500">En attente</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {urgentActions.slice(0, 4).map(({ project, action }) => (
                    <div 
                      key={action.id}
                      className="action-card-urgent"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm font-bold text-red-700 bg-red-200 px-3 py-1 rounded-full">
                              {project.name}
                            </span>
                            <span className="text-sm font-bold text-red-700 bg-red-200 px-3 py-1 rounded-full flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {new Date(action.dueDate!).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-sage-800 mb-2">
                            {action.title}
                          </h3>
                          {action.description && (
                            <p className="text-sage-700">
                              {action.description}
                            </p>
                          )}
                        </div>
                        <ArrowRightIcon className="h-6 w-6 text-red-600 ml-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Toutes les actions côté client */}
            {clientActions.length > 0 && (
              <div className="card-elegant">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-sage-100 rounded-lg">
                      <UserIcon className="h-5 w-5 text-sage-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-sage-800">
                        Actions à effectuer
                      </h2>
                      <p className="text-sm text-sage-600">
                        {clientActions.length} tâche(s) en attente
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push('/projects')}
                    className="btn-secondary flex items-center text-sm"
                  >
                    Voir tous les projets
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {clientActions.slice(0, 6).map(({ project, action }) => {
                    const isUrgent = urgentActions.some(ua => ua.action.id === action.id)
                    const cardClass = isUrgent ? 'action-card-urgent' : 'action-card'
                    
                    return (
                      <div 
                        key={action.id}
                        className={`bg-white border border-sage-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
                          isUrgent ? 'border-l-4 border-l-red-500' : ''
                        }`}
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xs font-medium text-sage-600 bg-sage-100 px-2 py-1 rounded">
                                {project.name}
                              </span>
                              {action.dueDate && (
                                <span className={`text-xs font-medium px-2 py-1 rounded flex items-center ${
                                  isUrgent 
                                    ? 'text-red-700 bg-red-100' 
                                    : 'text-orange-700 bg-orange-100'
                                }`}>
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  {new Date(action.dueDate).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-semibold text-sage-800 mb-1">
                              {action.title}
                            </h3>
                            {action.description && (
                              <p className="text-xs text-sage-600 line-clamp-2">
                                {action.description}
                              </p>
                            )}
                          </div>
                          <ArrowRightIcon className="h-4 w-4 text-sage-400 ml-3 flex-shrink-0" />
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {clientActions.length > 6 && (
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => router.push('/projects')}
                      className="text-sage-700 hover:text-sage-900 font-semibold text-lg transition-colors duration-200"
                    >
                      Voir toutes les actions ({clientActions.length - 6} de plus)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Statistiques élégantes */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="stat-icon-blue">
                <FolderIcon className="h-6 w-6" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-medium text-sage-500">Projets actifs</p>
                <p className="text-3xl font-bold text-sage-800">
                  {projects.filter(p => p.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="stat-icon-green">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-medium text-sage-500">Projets terminés</p>
                <p className="text-3xl font-bold text-sage-800">
                  {projects.filter(p => p.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="stat-icon-purple">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-medium text-sage-500">Tickets ouverts</p>
                <p className="text-3xl font-bold text-sage-800">
                  {openTicketsCount}
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <div className="stat-icon">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-medium text-sage-500">En attente</p>
                <p className="text-3xl font-bold text-sage-800">
                  {projects.filter(p => p.status === 'ON_HOLD').length}
                </p>
              </div>
            </div>
          </div>
        </div>

                {/* Projets récents */}
        <div className="card-elegant">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-sage-800">
                {user?.role === 'ADMIN' ? 'Projets récents' : 'Mes projets'}
              </h2>
              <p className="text-sm text-sage-600 mt-1">
                {user?.role === 'ADMIN' 
                  ? 'Vue d\'ensemble des projets en cours' 
                  : 'Suivi de vos projets actifs'
                }
              </p>
            </div>
            <button
              onClick={() => router.push('/projects')}
              className="btn-secondary flex items-center text-sm"
            >
              Voir tous les projets
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mb-6">
                <FolderIcon className="h-10 w-10 text-beige-600" />
              </div>
              <h3 className="text-xl font-bold text-sage-800 mb-3">Aucun projet</h3>
              <p className="text-sage-600 max-w-md mx-auto">
                {user?.role === 'ADMIN' 
                  ? 'Commencez par créer un nouveau projet pour vos clients.' 
                  : 'Aucun projet ne vous a été assigné pour le moment.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project) => (
                <div 
                  key={project.id} 
                  className="action-card"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-sage-800 mb-3">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sage-700 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <span className={`status-badge ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-sage-600 mb-3">
                      <span className="font-medium">Progression</span>
                      <span className="font-bold">{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-sage-500">
                    <div className="flex items-center space-x-6">
                      <span className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        {project.steps.length} étapes
                      </span>
                      <span className="flex items-center">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                        {project._count.tickets} tickets
                      </span>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-sage-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
