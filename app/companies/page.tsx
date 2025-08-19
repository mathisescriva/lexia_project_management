'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth.tsx'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { 
  PlusIcon, 
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Company {
  id: string
  name: string
  logo?: string
  description?: string
  createdAt: string
  _count: {
    users: number
    projects: number
  }
}

export default function CompaniesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: ''
  })

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchCompanies()
  }, [user, router])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCompany ? `/api/companies/${editingCompany.id}` : '/api/companies'
      const method = editingCompany ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingCompany ? 'Entreprise modifiée avec succès!' : 'Entreprise créée avec succès!')
        setFormData({ name: '', description: '', logo: '' })
        setShowForm(false)
        setEditingCompany(null)
        fetchCompanies()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la création')
      }
    } catch (error) {
      toast.error('Erreur lors de la création de l\'entreprise')
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      description: company.description || '',
      logo: company.logo || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (companyId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ? Les utilisateurs et projets associés seront désassociés.')) {
      return
    }

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message || 'Entreprise supprimée avec succès!')
        fetchCompanies()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Erreur lors de la suppression')
    }
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Entreprises
            </h1>
            <p className="text-gray-600">
              Gérez les entreprises et leurs logos.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCompany(null)
              setFormData({ name: '', description: '', logo: '' })
              setShowForm(true)
            }}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvelle entreprise
          </button>
        </div>

        {/* Company Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingCompany ? 'Modifier l\'entreprise' : 'Créer une nouvelle entreprise'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
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
                  URL du logo
                </label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/logo.png"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                />
                {formData.logo && (
                  <div className="mt-2">
                    <img 
                      src={formData.logo} 
                      alt="Logo preview" 
                      className="h-12 w-auto object-contain border border-gray-200 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCompany(null)
                    setFormData({ name: '', description: '', logo: '' })
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingCompany ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Companies List */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Liste des entreprises
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  {company.logo ? (
                    <img 
                      src={company.logo} 
                      alt={`Logo ${company.name}`}
                      className="h-10 w-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{company.name}</h3>
                    {company.description && (
                      <p className="text-sm text-gray-600">{company.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {company._count.users} utilisateur{company._count.users > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                    {company._count.projects} projet{company._count.projects > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(company)}
                    className="text-lexia-600 hover:text-lexia-900 p-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {companies.length === 0 && (
            <div className="text-center py-8">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entreprise</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer une nouvelle entreprise.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
