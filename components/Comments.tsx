'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { PaperAirplaneIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import Avatar from './Avatar'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    role: string
    avatar?: string
  }
}

interface CommentsProps {
  projectId: string
}

export default function Comments({ projectId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchComments()
  }, [projectId])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/comments?projectId=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          content: newComment
        })
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment('')
        toast.success('Commentaire ajouté')
      } else {
        toast.error('Erreur lors de l\'ajout du commentaire')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Erreur lors de l\'ajout du commentaire')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ChatBubbleLeftIcon className="h-5 w-5 text-sage-600" />
        <h3 className="text-lg font-semibold text-sage-800">
          Commentaires ({comments.length})
        </h3>
      </div>
      
      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <Avatar user={user || undefined} size="sm" />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              rows={3}
              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none text-sage-800 placeholder-sage-500"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-sage-600 text-white text-sm font-medium rounded-lg hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Ajout...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Commenter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Liste des commentaires */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-600"></div>
          <span className="ml-2 text-sage-600">Chargement...</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <Avatar user={comment.user} size="sm" />
              </div>
              <div className="flex-1">
                <div className="bg-sage-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-sage-800">
                      {comment.user.name}
                      {comment.user.role === 'ADMIN' && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          Admin
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-sage-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sage-700 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-sage-300" />
          <h3 className="mt-2 text-sm font-medium text-sage-900">Aucun commentaire</h3>
          <p className="mt-1 text-sm text-sage-500">
            Soyez le premier à commenter ce projet.
          </p>
        </div>
      )}
    </div>
  )
}
