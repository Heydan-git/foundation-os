/**
 * ResetPasswordPage — two-mode flow:
 *   1. Anonymous user → request a reset link by email (supabase.auth.resetPasswordForEmail)
 *   2. Authenticated user (after clicking the email link, supabase auto-restores session)
 *      → set a new password (supabase.auth.updateUser)
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, PageHeader } from '@/components'
import { PASSWORD_MIN } from '@/lib/constants'
const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,.055)',
  background: 'rgba(255,255,255,.025)',
  color: '#FAFAFA',
  fontSize: 13,
  fontFamily: "'Figtree',sans-serif",
  outline: 'none',
}

const ctaStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 8,
  border: 'none',
  background: 'rgba(94,234,212,.12)',
  color: '#5EEAD4',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "'Figtree',sans-serif",
  cursor: 'pointer',
}

export default function ResetPasswordPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null

  // Mode 2 : authenticated → user came back from the email link, set new password
  const isUpdateMode = !!user

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setInfo(null); setSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) setError(error.message)
    else setInfo('Lien envoye. Verifie ta boite mail.')
    setSubmitting(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setInfo(null)
    if (password.length < PASSWORD_MIN) {
      setError(`Mot de passe : ${PASSWORD_MIN} caracteres minimum`)
      return
    }
    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }
    setInfo('Mot de passe mis a jour. Redirection...')
    setTimeout(() => navigate('/', { replace: true }), 1200)
  }

  return (
    <>
      <PageHeader
        title="Foundation OS"
        subtitle={isUpdateMode ? 'Nouveau mot de passe' : 'Reinitialiser le mot de passe'}
        version="v0.1"
        meta=""
      />
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '0 16px' }}>
        <Card>
          <form
            onSubmit={isUpdateMode ? handleUpdate : handleRequest}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {isUpdateMode ? (
              <input
                type="password"
                placeholder={`Nouveau mot de passe (${PASSWORD_MIN}+ caracteres)`}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={PASSWORD_MIN}
                style={inputStyle}
              />
            ) : (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            )}

            {error && (
              <p style={{ fontSize: 11, color: '#EF4444', padding: '6px 0' }}>{error}</p>
            )}
            {info && (
              <p style={{ fontSize: 11, color: '#5EEAD4', padding: '6px 0' }}>{info}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="cta"
              style={{ ...ctaStyle, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.6 : 1 }}
            >
              {submitting
                ? '...'
                : isUpdateMode
                  ? 'Mettre a jour'
                  : 'Envoyer le lien'}
            </button>

            <Link
              to="/login"
              style={{
                textAlign: 'center',
                padding: '4px 0',
                color: '#52525B',
                fontSize: 11,
                fontFamily: "'Figtree',sans-serif",
                textDecoration: 'none',
              }}
            >
              Retour a la connexion
            </Link>
          </form>
        </Card>
      </div>
    </>
  )
}
