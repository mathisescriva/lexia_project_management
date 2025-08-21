'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { 
  PlusIcon, 
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  steps: any[]
  client?: { id: string; name: string; email: string }
  _count: { tickets: number }
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companyId: '',
    startDate: '',
    endDate: '',
    steps: [
      { 
        title: 'Analyse des besoins', 
        description: 'Réunion avec le client pour définir les fonctionnalités',
        startDate: '',
        endDate: ''
      },
      { 
        title: 'Design et maquettes', 
        description: 'Création des maquettes et de l\'expérience utilisateur',
        startDate: '',
        endDate: ''
      },
      { 
        title: 'Développement', 
        description: 'Implémentation des fonctionnalités',
        startDate: '',
        endDate: ''
      },
      { 
        title: 'Tests et validation', 
        description: 'Tests complets et validation client',
        startDate: '',
        endDate: ''
      },
      { 
        title: 'Déploiement', 
        description: 'Mise en production et formation',
        startDate: '',
        endDate: ''
      }
    ],
    actions: [
      {
        title: 'Fournir les spécifications',
        description: 'Le client doit fournir les spécifications détaillées',
        type: 'CLIENT',
        dueDate: ''
      },
      {
        title: 'Valider les maquettes',
        description: 'Le client doit valider les maquettes proposées',
        type: 'CLIENT',
        dueDate: ''
      },
      {
        title: 'Préparer l\'environnement',
        description: 'Lexia prépare l\'environnement de développement',
        type: 'LEXIA',
        dueDate: ''
      }
    ]
  })

  useEffect(() => {
    fetchProjects()
    if (user?.role === 'ADMIN') {
      fetchCompanies()
    }
  }, [user])

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

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Projet créé avec succès!')
        setFormData({
          name: '',
          description: '',
          companyId: '',
          startDate: '',
          endDate: '',
          steps: [
            { title: 'Analyse des besoins', description: 'Réunion avec le client pour définir les fonctionnalités', startDate: '', endDate: '' },
            { title: 'Design et maquettes', description: 'Création des maquettes et de l\'expérience utilisateur', startDate: '', endDate: '' },
            { title: 'Développement', description: 'Implémentation des fonctionnalités', startDate: '', endDate: '' },
            { title: 'Tests et validation', description: 'Tests complets et validation client', startDate: '', endDate: '' },
            { title: 'Déploiement', description: 'Mise en production et formation', startDate: '', endDate: '' }
          ],
          actions: []
        })
        setShowForm(false)
        fetchProjects()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la création')
      }
    } catch (error) {
      toast.error('Erreur lors de la création du projet')
    }
  }

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { title: '', description: '', startDate: '', endDate: '' }]
    }))
  }

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }))
  }

  const updateStep = (index: number, field: 'title' | 'description' | 'startDate' | 'endDate', value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }))
  }

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { title: '', description: '', type: 'CLIENT', dueDate: '' }]
    }))
  }

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }))
  }

  const updateAction = (index: number, field: 'title' | 'description' | 'type' | 'dueDate', value: string) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }))
  }

  const handleDeleteProject = async (projectId: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Projet supprimé avec succès')
        fetchProjects()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression du projet')
    } finally {
      setIsDeleting(false)
      setDeleteProjectId(null)
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Projets
            </h1>
            <p className="text-gray-600">
              {user?.role === 'ADMIN' 
                ? 'Gérez tous les projets de vos clients.' 
                : 'Consultez vos projets en cours.'
              }
            </p>
          </div>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouveau projet
            </button>
          )}
        </div>

        {/* New Project Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Créer un nouveau projet
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du projet
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entreprise
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                >
                  <option value="">Sélectionner une entreprise</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name} ({company._count.users} utilisateurs, {company._count.projects} projets)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>

              {/* Étapes du projet */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Étapes du projet
                  </label>
                  <button
                    type="button"
                    onClick={addStep}
                    className="text-sm text-lexia-600 hover:text-lexia-700"
                  >
                    + Ajouter une étape
                  </button>
                </div>
                <div className="relative">
                  {/* Ligne de connexion verticale */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-4">
                    {formData.steps.map((step, index) => (
                      <div key={index} className="relative flex items-start">
                        {/* Indicateur de progression */}
                        <div className="flex-shrink-0 mr-4 relative">
                          <div className="relative w-12 h-12 rounded-full flex items-center justify-center border-2 bg-white border-gray-300 shadow-md">
                            <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                          </div>
                          {/* Ligne de connexion qui s'étend jusqu'à la prochaine étape */}
                          {index < formData.steps.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 bg-gray-200" style={{ height: '200px' }}></div>
                          )}
                        </div>
                        
                        {/* Contenu de l'étape */}
                        <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">Étape {index + 1}</h4>
                            {formData.steps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStep(index)}
                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Titre de l'étape</label>
                              <input
                                type="text"
                                placeholder="Titre de l'étape"
                                className="input-field"
                                value={step.title}
                                onChange={(e) => updateStep(index, 'title', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                placeholder="Description de l'étape"
                                rows={3}
                                className="input-field"
                                value={step.description}
                                onChange={(e) => updateStep(index, 'description', e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date de début</label>
                                <input
                                  type="date"
                                  className="input-field"
                                  value={step.startDate}
                                  onChange={(e) => updateStep(index, 'startDate', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date de fin</label>
                                <input
                                  type="date"
                                  className="input-field"
                                  value={step.endDate}
                                  onChange={(e) => updateStep(index, 'endDate', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions du projet */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Actions à effectuer
                  </label>
                  <button
                    type="button"
                    onClick={addAction}
                    className="text-sm text-lexia-600 hover:text-lexia-700"
                  >
                    + Ajouter une action
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.actions.map((action, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Action {index + 1}</span>
                        {formData.actions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAction(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Titre de l'action"
                          className="input-field"
                          value={action.title}
                          onChange={(e) => updateAction(index, 'title', e.target.value)}
                        />
                        <textarea
                          placeholder="Description de l'action"
                          rows={2}
                          className="input-field"
                          value={action.description}
                          onChange={(e) => updateAction(index, 'description', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="input-field"
                            value={action.type}
                            onChange={(e) => updateAction(index, 'type', e.target.value)}
                          >
                            <option value="CLIENT">Côté client</option>
                            <option value="LEXIA">Côté Lexia</option>
                          </select>
                          <input
                            type="date"
                            placeholder="Date limite"
                            className="input-field"
                            value={action.dueDate}
                            onChange={(e) => updateAction(index, 'dueDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer le projet
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {user?.role === 'ADMIN' ? 'Tous les projets' : 'Mes projets'}
          </h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun projet</h3>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === 'ADMIN' 
                  ? 'Commencez par créer un nouveau projet.' 
                  : 'Aucun projet ne vous a été assigné pour le moment.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer relative"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description}
                        </p>
                      )}
                      {project.client && (
                        <p className="text-xs text-gray-500 mt-2">
                          Client: {project.client.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteProjectId(project.id)
                          }}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                          title="Supprimer le projet"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progression</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{project.steps.length} étapes</span>
                    <span>{project._count.tickets} tickets</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteProjectId && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Supprimer le projet
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer ce projet ? 
                    Cette action est irréversible et supprimera toutes les données associées 
                    (étapes, actions, commentaires, fichiers).
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setDeleteProjectId(null)}
                      className="flex-1 btn-secondary"
                      disabled={isDeleting}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleDeleteProject(deleteProjectId)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Suppression...
                        </>
                      ) : (
                        'Supprimer définitivement'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
