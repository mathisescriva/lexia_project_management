'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, FolderIcon } from '@heroicons/react/24/outline'

interface SearchResult {
  projects?: Array<{
    id: string
    name: string
    client: { name: string }
    admin: { name: string }
  }>
  actions?: Array<{
    id: string
    title: string
    project: { name: string }
  }>
  tickets?: Array<{
    id: string
    subject: string
    project: { name: string }
  }>
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult>({})
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          if (response.ok) {
            const data = await response.json()
            setResults(data.results)
            setIsOpen(true)
          }
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults({})
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleResultClick = (type: string, id: string) => {
    setIsOpen(false)
    setQuery('')
    setIsFocused(false)
    
    switch (type) {
      case 'project':
        router.push(`/projects/${id}`)
        break
      case 'ticket':
        router.push(`/tickets/${id}`)
        break
      default:
        break
    }
  }

  const totalResults = (results.projects?.length || 0) + 
                      (results.actions?.length || 0) + 
                      (results.tickets?.length || 0)

  const getIconForType = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderIcon className="h-4 w-4 text-sage-500" />
      case 'ticket':
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-sage-500" />
      case 'action':
        return <DocumentTextIcon className="h-4 w-4 text-sage-500" />
      default:
        return <DocumentTextIcon className="h-4 w-4 text-sage-500" />
    }
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r from-sage-50 to-sage-100 rounded-xl transition-all duration-300 ${
          isFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
        }`} />
        <div className="relative">
          <MagnifyingGlassIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
            isFocused ? 'text-sage-600' : 'text-sage-400'
          }`} />
          <input
            type="text"
            placeholder="Rechercher des projets, tickets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !isOpen && setIsFocused(false)}
            className={`w-full pl-12 pr-12 py-3 bg-white/80 backdrop-blur-sm border border-sage-200/50 rounded-xl text-sage-800 placeholder-sage-500 focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg ${
              isFocused ? 'bg-white border-sage-400' : ''
            }`}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setIsOpen(false)
                setIsFocused(false)
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors duration-200 p-1 rounded-full hover:bg-sage-100"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md border border-sage-200/50 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="p-1">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-sage-300 border-t-sage-600"></div>
                  <span className="text-sage-600 font-medium">Recherche en cours...</span>
                </div>
              </div>
            ) : totalResults > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {results.projects && results.projects.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-2 bg-sage-50/50 border-b border-sage-100">
                      <h3 className="text-xs font-semibold text-sage-700 uppercase tracking-wide">Projets</h3>
                    </div>
                    {results.projects.map((project, index) => (
                      <div
                        key={project.id}
                        onClick={() => handleResultClick('project', project.id)}
                        className="px-3 py-3 hover:bg-sage-50/80 cursor-pointer transition-all duration-200 border-b border-sage-100/50 last:border-b-0 group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIconForType('project')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sage-800 group-hover:text-sage-900 transition-colors duration-200">
                              {project.name}
                            </div>
                            <div className="text-sm text-sage-500 mt-0.5">
                              Client: {project.client.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.actions && results.actions.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-2 bg-sage-50/50 border-b border-sage-100">
                      <h3 className="text-xs font-semibold text-sage-700 uppercase tracking-wide">Actions</h3>
                    </div>
                    {results.actions.map((action, index) => (
                      <div
                        key={action.id}
                        className="px-3 py-3 hover:bg-sage-50/80 cursor-pointer transition-all duration-200 border-b border-sage-100/50 last:border-b-0 group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIconForType('action')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sage-800 group-hover:text-sage-900 transition-colors duration-200">
                              {action.title}
                            </div>
                            <div className="text-sm text-sage-500 mt-0.5">
                              Projet: {action.project.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.tickets && results.tickets.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-2 bg-sage-50/50 border-b border-sage-100">
                      <h3 className="text-xs font-semibold text-sage-700 uppercase tracking-wide">Tickets</h3>
                    </div>
                    {results.tickets.map((ticket, index) => (
                      <div
                        key={ticket.id}
                        onClick={() => handleResultClick('ticket', ticket.id)}
                        className="px-3 py-3 hover:bg-sage-50/80 cursor-pointer transition-all duration-200 border-b border-sage-100/50 last:border-b-0 group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIconForType('ticket')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sage-800 group-hover:text-sage-900 transition-colors duration-200">
                              {ticket.subject}
                            </div>
                            <div className="text-sm text-sage-500 mt-0.5">
                              Projet: {ticket.project?.name || 'Général'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="p-6 text-center">
                <div className="text-sage-500">
                  <DocumentTextIcon className="h-8 w-8 mx-auto mb-2 text-sage-300" />
                  <p className="font-medium">Aucun résultat trouvé</p>
                  <p className="text-sm mt-1">Essayez avec d'autres mots-clés</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
