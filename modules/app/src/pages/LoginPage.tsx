import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { Navigate } from 'react-router-dom'
import { Card, PageHeader } from '@/components'

export default function LoginPage() {
  const { user, signIn, signUp, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)

    if (result.error) {
      setError(result.error)
    }
    setSubmitting(false)
  }

  return (
    <>
      <PageHeader title="Foundation OS" subtitle="Connexion" version="v0.1" meta="" />
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '0 16px' }}>
        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,.055)',
                background: 'rgba(255,255,255,.025)',
                color: '#FAFAFA',
                fontSize: 13,
                fontFamily: "'Figtree',sans-serif",
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,.055)',
                background: 'rgba(255,255,255,.025)',
                color: '#FAFAFA',
                fontSize: 13,
                fontFamily: "'Figtree',sans-serif",
                outline: 'none',
              }}
            />

            {error && (
              <p style={{ fontSize: 11, color: '#EF4444', padding: '6px 0' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="cta"
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(94,234,212,.12)',
                color: '#5EEAD4',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Figtree',sans-serif",
                cursor: submitting ? 'wait' : 'pointer',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? '...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>

            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
              style={{
                padding: '6px 0',
                border: 'none',
                background: 'none',
                color: '#52525B',
                fontSize: 11,
                fontFamily: "'Figtree',sans-serif",
                cursor: 'pointer',
              }}
            >
              {mode === 'login' ? 'Pas de compte ? Créer un compte' : 'Déjà un compte ? Se connecter'}
            </button>
          </form>
        </Card>
      </div>
    </>
  )
}
