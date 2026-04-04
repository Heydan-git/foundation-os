/**
 * LoginForm.tsx - Formulaire connexion/inscription Supabase
 * Interface auth pour Foundation OS
 */
import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, signUp, signInWithOAuth, isAuthenticated } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = mode === 'signin'
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password)

      if (error) {
        setError(error.message)
      } else {
        if (mode === 'signup') {
          setError('Vérifiez votre email pour confirmer votre compte')
        } else {
          onSuccess?.()
        }
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signInWithOAuth(provider)
      if (error) {
        setError(error.message)
      }
    } catch (err: any) {
      setError(err.message || `Erreur ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (isAuthenticated) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[#5EEAD4] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#06070C]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-[#5EEAD4] mb-2 font-['Figtree']">
          Connexion réussie
        </h2>
        <p className="text-gray-400 font-['JetBrains_Mono'] text-sm">
          Foundation OS est maintenant accessible
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#5EEAD4] mb-2 font-['Figtree']">
          Foundation OS
        </h1>
        <p className="text-gray-400 font-['JetBrains_Mono'] text-sm">
          {mode === 'signin' ? 'Connectez-vous' : 'Créer un compte'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleOAuth('google')}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 rounded font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 font-['Figtree']"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <button
          onClick={() => handleOAuth('github')}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 font-['Figtree']"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continuer avec GitHub
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#06070C] text-gray-400 font-['JetBrains_Mono']">ou</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 font-['Figtree']">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="votre.email@exemple.com"
            className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-[#5EEAD4] focus:outline-none font-['JetBrains_Mono']"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 font-['Figtree']">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-[#5EEAD4] focus:outline-none font-['JetBrains_Mono']"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.email || !formData.password}
          className="w-full py-3 bg-[#5EEAD4] text-[#06070C] rounded font-medium hover:bg-[#4FD1C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Figtree']"
        >
          {isLoading ? 'Connexion...' : mode === 'signin' ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      {/* Mode Toggle */}
      <div className="text-center mt-6">
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          disabled={isLoading}
          className="text-[#5EEAD4] hover:text-[#4FD1C7] transition-colors disabled:opacity-50 font-['Figtree'] text-sm"
        >
          {mode === 'signin'
            ? "Pas de compte ? S'inscrire"
            : 'Déjà un compte ? Se connecter'
          }
        </button>
      </div>
    </div>
  )
}

export default LoginForm