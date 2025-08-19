'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatbotProps {
  projectId: string
  projectName: string
}

export default function Chatbot({ projectId, projectName }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Bonjour ! Je suis l'assistant virtuel pour le projet "${projectName}". Comment puis-je vous aider ?`,
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simuler une réponse du chatbot
      setTimeout(() => {
        const botResponse = generateBotResponse(inputValue, projectName)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
    }
  }

  const generateBotResponse = (userInput: string, projectName: string): string => {
    const input = userInput.toLowerCase()
    
    // Réponses automatiques basées sur les mots-clés
    if (input.includes('progression') || input.includes('avancement')) {
      return `Pour suivre l'avancement du projet "${projectName}", vous pouvez consulter l'onglet "Timeline" qui affiche toutes les étapes et leur statut. La barre de progression vous donne également une vue d'ensemble.`
    }
    
    if (input.includes('fichier') || input.includes('document')) {
      return `Les fichiers du projet "${projectName}" sont disponibles dans l'onglet "Fichiers partagés". Vous pouvez y accéder directement ou via le lien Google Drive si configuré.`
    }
    
    if (input.includes('ticket') || input.includes('support') || input.includes('aide')) {
      return `Pour obtenir de l'aide ou signaler un problème, vous pouvez créer un ticket dans l'onglet "Support" ou utiliser le bouton "Créer un ticket" dans la vue d'ensemble du projet.`
    }
    
    if (input.includes('contact') || input.includes('équipe')) {
      return `L'équipe Lexia est disponible pour vous accompagner. Vous pouvez nous contacter via les tickets de support ou directement par email. Nous répondons généralement sous 24h.`
    }
    
    if (input.includes('date') || input.includes('délai')) {
      return `Les dates et délais du projet "${projectName}" sont affichés dans la vue d'ensemble. Si vous avez des questions spécifiques sur le planning, n'hésitez pas à créer un ticket.`
    }
    
    if (input.includes('merci') || input.includes('thanks')) {
      return `De rien ! N'hésitez pas si vous avez d'autres questions sur le projet "${projectName}".`
    }
    
    // Réponse par défaut
    return `Je comprends votre question sur le projet "${projectName}". Pour une réponse plus précise, je vous recommande de consulter les onglets du projet ou de créer un ticket de support pour une assistance personnalisée.`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-lexia-600 text-white p-4 rounded-full shadow-lg hover:bg-lexia-700 transition-colors z-50"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-lexia-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Assistant Lexia</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <p className="text-sm opacity-90">Projet: {projectName}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-lexia-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 input-field"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-lexia-600 text-white p-2 rounded-lg hover:bg-lexia-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
