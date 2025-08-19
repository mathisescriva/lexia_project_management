'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import Logo from '@/components/Logo'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  EnvelopeIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState({ email: false, password: false })
  const router = useRouter()
  const { login } = useAuth()

  // Animation d'entrée
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Connexion réussie!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-beige-50 via-white to-orange-50">
      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-sage-200 to-sage-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-beige-200 to-beige-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grille de points décorative */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-md w-full space-y-8 transition-all duration-1000 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          
          {/* Header avec logo et titre */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Logo size="xl" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-sage-700">
                Bienvenue
              </h2>
              <p className="text-sage-600 max-w-sm mx-auto">
                Accédez à votre espace de travail et gérez vos projets en toute simplicité
              </p>
            </div>
          </div>

          {/* Formulaire de connexion */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Champ email */}
              <div className="space-y-2">
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r rounded-2xl transition-all duration-300 ${
                    isFocused.email 
                      ? 'from-orange-500 to-orange-600 opacity-20' 
                      : 'from-sage-200 to-beige-200 opacity-0'
                  }`}></div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className={`h-5 w-5 transition-colors duration-300 ${
                        isFocused.email ? 'text-orange-600' : 'text-sage-400'
                      }`} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-sage-200 rounded-2xl text-sage-800 placeholder-sage-500 focus:outline-none focus:border-orange-500 focus:bg-white/80 transition-all duration-300"
                      placeholder="Votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused({ ...isFocused, email: true })}
                      onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    />
                  </div>
                </div>
              </div>

              {/* Champ mot de passe */}
              <div className="space-y-2">
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r rounded-2xl transition-all duration-300 ${
                    isFocused.password 
                      ? 'from-orange-500 to-orange-600 opacity-20' 
                      : 'from-sage-200 to-beige-200 opacity-0'
                  }`}></div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center pointer-events-none">
                      <LockClosedIcon className={`h-5 w-5 transition-colors duration-300 ${
                        isFocused.password ? 'text-orange-600' : 'text-sage-400'
                      }`} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="w-full pl-12 pr-12 py-4 bg-white/50 border-2 border-sage-200 rounded-2xl text-sage-800 placeholder-sage-500 focus:outline-none focus:border-orange-500 focus:bg-white/80 transition-all duration-300"
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocused({ ...isFocused, password: true })}
                      onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    />
                    <button
                      type="button"
                      className="absolute right-4 flex items-center text-sage-400 hover:text-sage-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Connexion en cours...</span>
                      </>
                    ) : (
                      <>
                        <UserIcon className="h-5 w-5" />
                        <span>Se connecter</span>
                        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* Informations de sécurité */}
            <div className="flex items-center justify-center space-x-2 text-sm text-sage-500">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>Connexion sécurisée et chiffrée</span>
            </div>
          </div>

          {/* Footer avec informations supplémentaires */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-sage-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Système sécurisé</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Support 24/7</span>
              </div>
            </div>
            
            <p className="text-xs text-sage-400">
              © 2024 Atlas. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
