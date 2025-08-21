'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ProjectStep {
  id?: string
  title: string
  description: string
  startDate?: string
  endDate?: string
  completed: boolean
  order: number
}

interface User {
  id: string
  name: string
  email: string
  company?: {
    id: string
    name: string
    logo?: string
  }
}

interface Company {
  id: string
  name: string
  logo?: string
}

interface Project {
  id: string
  name: string
  description?: string
  status: string
  progress: number
  startDate?: string
  endDate?: string
  driveFolderUrl?: string
  client: User
  company?: Company
  steps: ProjectStep[]
}

export default function EditProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [clients, setClients] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'IN_PROGRESS',
    startDate: '',
    endDate: '',
    clientId: '',
    companyId: '',
    driveFolderUrl: ''
  })

  const [steps, setSteps] = useState<ProjectStep[]>([])
  const [actions, setActions] = useState<any[]>([])
  const [editingStep, setEditingStep] = useState<number | null>(null)
  const [editingAction, setEditingAction] = useState<number | null>(null)
  const [newStep, setNewStep] = useState({ title: '', description: '', startDate: '', endDate: '' })
  const [newAction, setNewAction] = useState({ title: '', description: '', type: 'CLIENT', dueDate: '' })

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchProject()
    fetchClients()
    fetchCompanies()
  }, [user, router, projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        setFormData({
          name: data.name,
          description: data.description || '',
          status: data.status,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          clientId: data.client.id,
          companyId: data.company?.id || '',
          driveFolderUrl: data.driveFolderUrl || ''
        })
        setSteps(data.steps.map((step: any, index: number) => ({
          id: step.id,
          title: step.title,
          description: step.description,
          completed: step.completed,
          startDate: step.startDate ? step.startDate.split('T')[0] : '',
          endDate: step.endDate ? step.endDate.split('T')[0] : '',
          order: index
        })))
        setActions(data.actions?.map((action: any, index: number) => ({
          id: action.id,
          title: action.title,
          description: action.description,
          type: action.type,
          completed: action.completed,
          dueDate: action.dueDate ? action.dueDate.split('T')[0] : '',
          order: index
        })) || [])
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/users?role=CLIENT')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
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
    setSaving(true)

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          steps,
          actions
        }),
      })

      if (response.ok) {
        toast.success('Projet modifié avec succès!')
        router.push(`/projects/${projectId}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la modification')
      }
    } catch (error) {
      toast.error('Erreur lors de la modification du projet')
    } finally {
      setSaving(false)
    }
  }

  const addStep = () => {
    if (!newStep.title.trim()) return
    
    const step: ProjectStep = {
      title: newStep.title,
      description: newStep.description,
      completed: false,
      order: steps.length
    }
    
    setSteps([...steps, step])
            setNewStep({ title: '', description: '', startDate: '', endDate: '' })
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i })))
  }

  const updateStep = (index: number, field: keyof ProjectStep, value: any) => {
    const updatedSteps = [...steps]
    updatedSteps[index] = { ...updatedSteps[index], [field]: value }
    setSteps(updatedSteps)
  }

  const toggleStepCompletion = (index: number) => {
    updateStep(index, 'completed', !steps[index].completed)
  }

  const startEditingStep = (index: number) => {
    setEditingStep(index)
  }

  const saveStepEdit = (index: number) => {
    setEditingStep(null)
  }

  const cancelStepEdit = () => {
    setEditingStep(null)
  }

  const addAction = () => {
    if (!newAction.title.trim()) {
      toast.error('Le titre de l\'action est requis')
      return
    }
    
    const action = {
      id: `temp-${Date.now()}`, // ID temporaire pour les nouvelles actions
      title: newAction.title.trim(),
      description: newAction.description.trim(),
      type: newAction.type,
      dueDate: newAction.dueDate,
      completed: false,
      order: actions.length
    }
    
    setActions([...actions, action])
    setNewAction({ title: '', description: '', type: 'CLIENT', dueDate: '' })
    toast.success('Action ajoutée avec succès')
  }

  const removeAction = (index: number) => {
    const updatedActions = actions.filter((_, i) => i !== index).map((action, i) => ({ ...action, order: i }))
    setActions(updatedActions)
    toast.success('Action supprimée avec succès')
  }

  const updateAction = (index: number, field: string, value: any) => {
    if (index < 0 || index >= actions.length) {
      console.error('Index invalide pour updateAction:', index)
      return
    }
    
    const updatedActions = [...actions]
    updatedActions[index] = { ...updatedActions[index], [field]: value }
    setActions(updatedActions)
  }

  const toggleActionCompletion = (index: number) => {
    updateAction(index, 'completed', !actions[index].completed)
  }

  const startEditingAction = (index: number) => {
    setEditingAction(index)
  }

  const saveActionEdit = (index: number) => {
    setEditingAction(null)
  }

  const cancelActionEdit = () => {
    setEditingAction(null)
  }

  if (user?.role !== 'ADMIN') {
    return null
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
          <p className="text-gray-500">Projet non trouvé</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="btn-secondary flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Retour
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Modifier le projet
              </h1>
              <p className="text-gray-600">
                Modifiez les informations et la timeline du projet
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Information */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations du projet
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Statut
                </label>
                <select
                  className="input-field"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="NOT_STARTED">Non commencé</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="COMPLETED">Terminé</option>
                  <option value="ON_HOLD">En pause</option>
                  <option value="CANCELLED">Annulé</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                      {client.company && ` - ${client.company.name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entreprise
                </label>
                <select
                  className="input-field"
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                >
                  <option value="">Aucune entreprise</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
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

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Google Drive
              </label>
              <input
                type="url"
                className="input-field"
                placeholder="https://drive.google.com/..."
                value={formData.driveFolderUrl}
                onChange={(e) => setFormData({ ...formData, driveFolderUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Project Steps */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Timeline du projet
              </h2>
              <button
                type="button"
                onClick={addStep}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Ajouter une étape
              </button>
            </div>

            {/* New Step Form */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Titre de l'étape"
                  className="input-field"
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description de l'étape"
                  className="input-field"
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="date"
                  placeholder="Date de début"
                  className="input-field"
                  value={newStep.startDate}
                  onChange={(e) => setNewStep({ ...newStep, startDate: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="Date de fin"
                  className="input-field"
                  value={newStep.endDate}
                  onChange={(e) => setNewStep({ ...newStep, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Steps List */}
            <div className="relative">
              {/* Ligne de connexion verticale */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Indicateur de progression */}
                    <div className="flex-shrink-0 mr-4 relative">
                      <button
                        type="button"
                        onClick={() => toggleStepCompletion(index)}
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                          step.completed 
                            ? 'bg-green-500 border-green-500 shadow-lg hover:shadow-xl' 
                            : 'bg-white border-gray-300 shadow-md hover:shadow-lg hover:border-gray-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckIcon className="h-6 w-6 text-white" />
                        ) : (
                          <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                        )}
                      </button>
                                              {/* Ligne de connexion qui s'étend jusqu'à la prochaine étape */}
                        {index < steps.length - 1 && (
                          <div className={`absolute left-6 top-12 w-0.5 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`} style={{ height: '200px' }}></div>
                        )}
                    </div>
                    
                    {/* Contenu de l'étape */}
                    <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          {editingStep === index ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                className="input-field font-semibold"
                                value={step.title}
                                onChange={(e) => updateStep(index, 'title', e.target.value)}
                              />
                              <textarea
                                className="input-field"
                                value={step.description}
                                onChange={(e) => updateStep(index, 'description', e.target.value)}
                                rows={3}
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Date de début</label>
                                  <input
                                    type="date"
                                    className="input-field"
                                    value={step.startDate || ''}
                                    onChange={(e) => updateStep(index, 'startDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Date de fin</label>
                                  <input
                                    type="date"
                                    className="input-field"
                                    value={step.endDate || ''}
                                    onChange={(e) => updateStep(index, 'endDate', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => saveStepEdit(index)}
                                  className="btn-primary text-sm"
                                >
                                  Sauvegarder
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelStepEdit}
                                  className="btn-secondary text-sm"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className={`text-lg font-semibold mb-2 ${
                                step.completed ? 'text-green-700 line-through' : 'text-gray-900'
                              }`}>
                                {step.title}
                              </h3>
                              {step.description && (
                                <p className={`text-sm mb-3 ${
                                  step.completed ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {step.description}
                                </p>
                              )}
                              
                              {/* Dates avec icônes */}
                              {(step.startDate || step.endDate) && (
                                <div className="flex items-center space-x-6 mb-3">
                                  {step.startDate && (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                      <span className="text-sm font-medium text-blue-600">
                                        Début: {new Date(step.startDate).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                                  )}
                                  {step.endDate && (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                      <span className="text-sm font-medium text-red-600">
                                        Fin: {new Date(step.endDate).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Barre de progression */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                  <span>Progression</span>
                                  <span>{step.completed ? '100%' : '0%'}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div 
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                    style={{ width: step.completed ? '100%' : '0%' }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Boutons d'action */}
                        {editingStep !== index && (
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              type="button"
                              onClick={() => startEditingStep(index)}
                              className="p-2 text-lexia-600 hover:text-lexia-900 hover:bg-lexia-50 rounded-full transition-colors"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeStep(index)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {steps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune étape définie. Ajoutez des étapes pour créer la timeline du projet.
              </div>
            )}
          </div>

          {/* Project Actions */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Actions à effectuer
              </h2>
              <button
                type="button"
                onClick={addAction}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Ajouter une action
              </button>
            </div>

            {/* New Action Form */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Titre de l'action"
                  className="input-field"
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                />
                <select
                  className="input-field"
                  value={newAction.type}
                  onChange={(e) => setNewAction({ ...newAction, type: e.target.value })}
                >
                  <option value="CLIENT">Côté client</option>
                  <option value="LEXIA">Côté Lexia</option>
                </select>
              </div>
              <div className="mt-2">
                <textarea
                  placeholder="Description de l'action"
                  rows={2}
                  className="input-field"
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                />
              </div>
              <div className="mt-2">
                <input
                  type="date"
                  placeholder="Date limite"
                  className="input-field"
                  value={newAction.dueDate}
                  onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                />
              </div>
            </div>

            {/* Actions List */}
            <div className="space-y-3">
              {actions.map((action, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleActionCompletion(index)}
                        className={`p-1 rounded ${
                          action.completed 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      
                      <div className="flex-1">
                        {editingAction === index ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              className="input-field"
                              value={action.title}
                              onChange={(e) => updateAction(index, 'title', e.target.value)}
                            />
                            <textarea
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
                                className="input-field"
                                value={action.dueDate}
                                onChange={(e) => updateAction(index, 'dueDate', e.target.value)}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => saveActionEdit(index)}
                                className="btn-primary text-sm"
                              >
                                Sauvegarder
                              </button>
                              <button
                                type="button"
                                onClick={cancelActionEdit}
                                className="btn-secondary text-sm"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className={`font-medium ${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {action.title}
                            </h3>
                            {action.description && (
                              <p className={`text-sm ${action.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                {action.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                action.type === 'LEXIA' 
                                  ? 'bg-lexia-100 text-lexia-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {action.type === 'LEXIA' ? 'Lexia' : 'Client'}
                              </span>
                              {action.dueDate && (
                                <span className="text-xs text-gray-500">
                                  Échéance: {new Date(action.dueDate).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => startEditingAction(index)}
                        className="text-lexia-600 hover:text-lexia-900 p-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {actions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune action définie. Ajoutez des actions pour organiser les tâches du projet.
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push(`/projects/${projectId}`)}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
