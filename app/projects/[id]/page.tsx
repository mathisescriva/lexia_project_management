'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/Layout'
import Comments from '@/components/Comments'
import ContactForm from '@/components/ContactForm'
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Chatbot from '@/components/Chatbot'

interface ProjectStep {
  id: string
  title: string
  description: string
  order: number
  completed: boolean
  completedAt?: string
}

interface ProjectFile {
  id: string
  name: string
  driveFileUrl: string
  mimeType?: string
  size?: number
  createdAt: string
}

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
  startDate?: string
  endDate?: string
  driveFolderUrl?: string
  steps: ProjectStep[]
  actions: ProjectAction[]
  files: ProjectFile[]
  client?: { id: string; name: string; email: string }
  _count: { tickets: number }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'files' | 'actions' | 'comments'>('overview')
  const [showContactForm, setShowContactForm] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        toast.error('Projet non trouvé')
        router.push('/projects')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Erreur lors du chargement du projet')
    } finally {
      setLoading(false)
    }
  }

  const updateStepStatus = async (stepId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/projects/${project?.id}/steps/${stepId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      })

      if (response.ok) {
        toast.success(completed ? 'Étape marquée comme terminée' : 'Étape marquée comme en cours')
        fetchProject(project?.id || '')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800'
      case 'NOT_STARTED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'IN_PROGRESS':
        return <ClockIcon className="h-5 w-5 text-blue-600" />
      case 'ON_HOLD':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      default:
        return <FolderIcon className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lexia-600"></div>
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h2 className="text-lg font-medium text-gray-900">Projet non trouvé</h2>
          <button
            onClick={() => router.push('/projects')}
            className="mt-4 btn-primary"
          >
            Retour aux projets
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Chatbot */}
        <Chatbot projectId={project.id} projectName={project.name} />
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/projects')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(project.status)}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => router.push(`/projects/${params.id}/edit`)}
                className="btn-primary flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Modifier
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Progression globale</h2>
            <span className="text-sm font-medium text-gray-600">{project.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Vue d\'ensemble', icon: EyeIcon },
              { id: 'timeline', name: 'Timeline', icon: ClockIcon },
              { id: 'files', name: 'Fichiers partagés', icon: FolderIcon },
              { id: 'actions', name: 'Actions', icon: ChatBubbleLeftRightIcon },
              { id: 'comments', name: 'Commentaires', icon: ChatBubbleLeftRightIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-lexia-500 text-lexia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du projet</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Client</dt>
                    <dd className="text-sm text-gray-900">{project.client?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date de début</dt>
                    <dd className="text-sm text-gray-900">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString('fr-FR') : 'Non définie'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date de fin prévue</dt>
                    <dd className="text-sm text-gray-900">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString('fr-FR') : 'Non définie'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tickets ouverts</dt>
                    <dd className="text-sm text-gray-900">{project._count.tickets}</dd>
                  </div>
                </dl>
              </div>

              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-900">Gérer la timeline</span>
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('files')}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-900">Accéder aux fichiers</span>
                    <FolderIcon className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full flex items-center justify-between p-3 border border-orange-200 rounded-lg hover:bg-orange-50 text-orange-700"
                  >
                    <span className="text-sm font-medium">Contacter votre responsable projet</span>
                    <PhoneIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-900">Voir les commentaires</span>
                    <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Timeline du projet</h3>
              <div className="space-y-4">
                {project.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        {step.completed ? (
                          <CheckCircleIcon className="h-5 w-5 text-white" />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          step.completed ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h4>
                        {user?.role === 'ADMIN' && (
                          <button
                            onClick={() => updateStepStatus(step.id, !step.completed)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {step.completed && step.completedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Terminé le {new Date(step.completedAt).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Fichiers partagés</h3>
                {project.driveFolderUrl && (
                  <a
                    href={project.driveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center"
                  >
                    <FolderIcon className="h-4 w-4 mr-2" />
                    Ouvrir dans Google Drive
                  </a>
                )}
              </div>
              
              {project.files.length === 0 ? (
                <div className="text-center py-8">
                  <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun fichier</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {project.driveFolderUrl 
                      ? 'Les fichiers seront affichés ici une fois partagés via Google Drive.'
                      : 'Aucun dossier Google Drive configuré pour ce projet.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.size && `${(file.size / 1024 / 1024).toFixed(1)} MB`} • 
                            {new Date(file.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.driveFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Voir
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Actions à effectuer</h3>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="btn-secondary flex items-center text-sm"
                >
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Contacter le responsable
                </button>
              </div>
              
              {project.actions && project.actions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Actions côté client */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Actions côté client
                    </h4>
                    <div className="space-y-3">
                      {project.actions
                        .filter(action => action.type === 'CLIENT')
                        .map((action) => (
                          <div key={action.id} className={`p-3 border border-gray-200 rounded-lg ${action.completed ? 'bg-gray-50' : ''}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {action.title}
                                </p>
                                {action.description && (
                                  <p className={`text-xs mt-1 ${action.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {action.description}
                                  </p>
                                )}
                                {action.dueDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Échéance: {new Date(action.dueDate).toLocaleDateString('fr-FR')}
                                  </p>
                                )}
                              </div>
                              {action.completed && (
                                <CheckCircleIcon className="h-4 w-4 text-green-600 ml-2" />
                              )}
                            </div>
                          </div>
                        ))}
                      {project.actions.filter(action => action.type === 'CLIENT').length === 0 && (
                        <p className="text-sm text-gray-500">Aucune action côté client</p>
                      )}
                    </div>
                  </div>

                  {/* Actions côté Lexia */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Actions côté Atlas
                    </h4>
                    <div className="space-y-3">
                      {project.actions
                        .filter(action => action.type === 'LEXIA')
                        .map((action) => (
                          <div key={action.id} className={`p-3 border border-gray-200 rounded-lg ${action.completed ? 'bg-gray-50' : ''}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {action.title}
                                </p>
                                {action.description && (
                                  <p className={`text-xs mt-1 ${action.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {action.description}
                                  </p>
                                )}
                                {action.dueDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Échéance: {new Date(action.dueDate).toLocaleDateString('fr-FR')}
                                  </p>
                                )}
                              </div>
                              {action.completed && (
                                <CheckCircleIcon className="h-4 w-4 text-green-600 ml-2" />
                              )}
                            </div>
                          </div>
                        ))}
                      {project.actions.filter(action => action.type === 'LEXIA').length === 0 && (
                        <p className="text-sm text-gray-500">Aucune action côté Atlas</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucune action définie pour ce projet.</p>
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => router.push(`/projects/${project.id}/edit`)}
                      className="btn-primary mt-4"
                    >
                      Ajouter des actions
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="card">
              <Comments projectId={project.id} />
            </div>
          )}
        </div>

        {/* Contact Form Modal */}
        <ContactForm
          projectId={project.id}
          projectName={project.name}
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
        />
      </div>
    </Layout>
  )
}
