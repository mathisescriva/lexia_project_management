'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth.tsx'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { 
  PlusIcon, 
  UserIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  role: string
  companyId?: string
  company?: {
    id: string
    name: string
    logo?: string
  }
  createdAt: string
}

interface Company {
  id: string
  name: string
  logo?: string
}

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT',
    companyId: ''
  })

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchUsers()
    fetchCompanies()
  }, [user, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
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
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingUser ? 'Utilisateur modifié avec succès!' : 'Utilisateur créé avec succès!')
        setFormData({ name: '', email: '', password: '', role: 'CLIENT', companyId: '' })
        setShowForm(false)
        setEditingUser(null)
        fetchUsers()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la création')
      }
    } catch (error) {
      toast.error('Erreur lors de la création de l\'utilisateur')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      companyId: user.companyId || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Utilisateur supprimé avec succès!')
        fetchUsers()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
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
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600">
              Gérez les comptes clients et administrateurs.
            </p>
          </div>
                      <button
              onClick={() => {
                setEditingUser(null)
                setFormData({ name: '', email: '', password: '', role: 'CLIENT', companyId: '' })
                setShowForm(true)
              }}
              className="btn-primary flex items-center"
            >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvel utilisateur
          </button>
        </div>

        {/* User Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
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
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe {editingUser && '(laisser vide pour ne pas changer)'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    className="input-field"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    className="input-field"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="CLIENT">Client</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
              </div>

              {formData.role === 'CLIENT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entreprise
                  </label>
                  <select
                    className="input-field"
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  >
                    <option value="">Sélectionner une entreprise</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingUser(null)
                    setFormData({ name: '', email: '', password: '', role: 'CLIENT', companyId: '' })
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Liste des utilisateurs
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Rôle
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Entreprise
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Date de création
                     </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-lexia-600 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {userItem.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userItem.email}
                          </div>
                        </div>
                      </div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         userItem.role === 'ADMIN' 
                           ? 'bg-red-100 text-red-800' 
                           : 'bg-blue-100 text-blue-800'
                       }`}>
                         {userItem.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {userItem.company ? (
                         <div className="flex items-center">
                           {userItem.company.logo && (
                             <img 
                               src={userItem.company.logo} 
                               alt={userItem.company.name}
                               className="h-6 w-6 object-contain mr-2"
                               onError={(e) => {
                                 e.currentTarget.style.display = 'none'
                               }}
                             />
                           )}
                           {userItem.company.name}
                         </div>
                       ) : (
                         <span className="text-gray-400">-</span>
                       )}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {new Date(userItem.createdAt).toLocaleDateString('fr-FR')}
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(userItem)}
                          className="text-lexia-600 hover:text-lexia-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {userItem.id !== user?.id && (
                          <button
                            onClick={() => handleDelete(userItem.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
