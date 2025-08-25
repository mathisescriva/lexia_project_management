'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  XMarkIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline'

interface ContactFormProps {
  projectId?: string
  projectName?: string
  isOpen: boolean
  onClose: () => void
}

export default function ContactForm({ projectId, projectName, isOpen, onClose }: ContactFormProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          projectId
        })
      })

      if (response.ok) {
        toast.success('Votre message a été envoyé avec succès')
        setSubject('')
        setMessage('')
        onClose()
      } else {
        toast.error('Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      console.error('Contact error:', error)
      toast.error('Erreur lors de l\'envoi du message')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200">
          <div className="flex items-center space-x-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-sage-600" />
            <h3 className="text-lg font-semibold text-sage-800">
              Contacter votre responsable projet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-sage-400 hover:text-sage-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {projectName && (
            <div className="bg-sage-50 p-3 rounded-lg">
              <p className="text-sm text-sage-600">
                <span className="font-medium">Projet concerné :</span> {projectName}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-sage-700 mb-1">
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet de votre demande..."
              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sage-800 placeholder-sage-500"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-sage-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre demande en détail..."
              rows={5}
              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none text-sage-800 placeholder-sage-500"
              required
            />
          </div>

          <div className="bg-sage-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <EnvelopeIcon className="h-4 w-4 text-sage-500 mt-0.5" />
              <div className="text-xs text-sage-600">
                <p className="font-medium mb-1">Votre message sera envoyé à votre responsable projet.</p>
                <p>Vous recevrez une réponse dans les plus brefs délais.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sage-700 bg-sage-100 rounded-lg hover:bg-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !message.trim()}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

