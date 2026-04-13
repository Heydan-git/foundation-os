import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { Link, Navigate } from 'react-router-dom'
import { Card, PageHeader } from '@/components'
import { PASSWORD_MIN } from '@/lib/constants'

export default function LoginPage() {
  const { user, signIn, signUp, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (mode === 'signup' && password.length < PASSWORD_MIN) {
      setError(`Mot de passe : ${PASSWORD_MIN} caracteres minimum`)
      return
    }

    setSubmitting(true)
    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)

    if (result.error) {
      setError(result.error)
    } else if (mode === 'signup') {
      setInfo('Compte cree. Verifie ton email pour activer la session.')
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
                border: '1px solid var(--color-border-default)',
                background: 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                fontSize: 13,
                fontFamily: "'Figtree',sans-serif",
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder={mode === 'signup' ? `Mot de passe (${PASSWORD_MIN}+ caracteres)` : 'Mot de passe'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={mode === 'signup' ? PASSWORD_MIN : 1}
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid var(--color-border-default)',
                background: 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                fontSize: 13,
                fontFamily: "'Figtree',sans-serif",
                outline: 'none',
              }}
            />

            {error && (
              <p style={{ fontSize: 11, color: 'var(--color-accent-danger)', padding: '6px 0' }}>{error}</p>
            )}
            {info && (
              <p style={{ fontSize: 11, color: 'var(--color-accent-brand-primary)', padding: '6px 0' }}>{info}</p>
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
                color: 'var(--color-accent-brand-primary)',
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
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setInfo(null) }}
              style={{
                padding: '6px 0',
                border: 'none',
                background: 'none',
                color: 'var(--color-text-faint)',
                fontSize: 11,
                fontFamily: "'Figtree',sans-serif",
                cursor: 'pointer',
              }}
            >
              {mode === 'login' ? 'Pas de compte ? Creer un compte' : 'Deja un compte ? Se connecter'}
            </button>

            {mode === 'login' && (
              <Link
                to="/reset-password"
                style={{
                  textAlign: 'center',
                  padding: '4px 0',
                  color: 'var(--color-text-faint)',
                  fontSize: 10,
                  fontFamily: "'Figtree',sans-serif",
                  textDecoration: 'none',
                }}
              >
                Mot de passe oublie ?
              </Link>
            )}
          </form>
        </Card>
      </div>
    </>
  )
}
