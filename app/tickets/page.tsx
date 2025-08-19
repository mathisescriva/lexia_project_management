'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth.tsx'
import Layout from '@/components/Layout'
import { PlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Ticket {
  id: string
  subject: string
  message: string
  status: string
  priority: string
  createdAt: string
  project?: { id: string; name: string }
  user: { id: string; name: string; email: string }
  responses: any[]
}

export default function TicketsPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'MEDIUM'
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Ticket créé avec succès!')
        setFormData({ subject: '', message: '', priority: 'MEDIUM' })
        setShowForm(false)
        fetchTickets()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la création')
      }
    } catch (error) {
      toast.error('Erreur lors de la création du ticket')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'RESOLVED':
        return 'bg-green-100 text-green-800'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Ouvert'
      case 'IN_PROGRESS':
        return 'En cours'
      case 'RESOLVED':
        return 'Résolu'
      case 'CLOSED':
        return 'Fermé'
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'Urgent'
      case 'HIGH':
        return 'Élevée'
      case 'MEDIUM':
        return 'Moyenne'
      case 'LOW':
        return 'Faible'
      default:
        return priority
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
              {user?.role === 'ADMIN' ? 'Support & Requêtes' : 'Mes Requêtes'}
            </h1>
            <p className="text-gray-600">
              {user?.role === 'ADMIN' 
                ? 'Gérez les demandes de tous les clients et suivez les réponses.'
                : 'Gérez vos demandes et suivez les réponses de l\'équipe Lexia.'
              }
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau ticket
          </button>
        </div>

        {/* New Ticket Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Créer un nouveau ticket
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="input-field"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorité
                </label>
                <select
                  className="input-field"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">Faible</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Élevée</option>
                  <option value="URGENT">Urgente</option>
                </select>
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
                  Créer le ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {user?.role === 'ADMIN' ? 'Tous les tickets' : 'Mes tickets'}
          </h2>
          
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun ticket</h3>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === 'ADMIN' 
                  ? 'Aucun ticket n\'a été créé pour le moment.' 
                  : 'Vous n\'avez pas encore créé de ticket.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {ticket.subject}
                        </h3>
                        {user?.role === 'ADMIN' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-sage-100 text-sage-800">
                            {ticket.user?.name || 'Utilisateur inconnu'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {ticket.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {ticket.project && (
                          <span className="flex items-center">
                            <span className="font-medium">Projet:</span>
                            <span className="ml-1">{ticket.project.name}</span>
                          </span>
                        )}
                        {user?.role === 'ADMIN' ? (
                          <span className="flex items-center">
                            <span className="font-medium">Client:</span>
                            <span className="ml-1">{ticket.user?.name || 'Utilisateur inconnu'}</span>
                            <span className="ml-1 text-gray-400">({ticket.user?.email || 'N/A'})</span>
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="font-medium">Créé par:</span>
                            <span className="ml-1">{ticket.user?.name || 'Vous'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityText(ticket.priority)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span>
                      {ticket.responses.length} réponse{ticket.responses.length > 1 ? 's' : ''}
                    </span>
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
