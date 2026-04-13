import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { PASSWORD_MIN } from '@/lib/constants'
import { Command } from 'lucide-react'
import { motion } from 'motion/react'

export default function ResetPasswordPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null

  const isUpdateMode = !!user

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) setError(error.message)
    else setInfo('Lien envoye. Verifie ta boite mail.')
    setSubmitting(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
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
    <div className="min-h-screen bg-ds-surface-0 text-ds-fg/80 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="fixed top-[-25%] left-[-15%] w-[60%] h-[60%] bg-ds-purple/10 blur-[150px] rounded-ds-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-25%] right-[-15%] w-[60%] h-[60%] bg-ds-blue/10 blur-[150px] rounded-ds-full pointer-events-none mix-blend-screen z-0" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm mx-4 relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md border border-white/10 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(59,130,246,0.2)]">
            <Command size={16} strokeWidth={1.5} className="text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>
          <span className="font-medium text-lg tracking-wide text-white/90">Foundation OS</span>
        </div>

        {/* Card */}
        <div className="rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] p-6 relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-[-30%] right-[-20%] w-[50%] h-[50%] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none mix-blend-screen" />

          <div className="relative z-10">
            <h2 className="text-sm font-medium text-white/90 mb-1">
              {isUpdateMode ? 'Nouveau mot de passe' : 'Reinitialiser le mot de passe'}
            </h2>
            <p className="text-[11px] text-white/40 mb-6">
              {isUpdateMode
                ? 'Choisis un nouveau mot de passe pour ton compte.'
                : 'Entre ton email pour recevoir un lien de reinitialisation.'}
            </p>

            <form
              onSubmit={isUpdateMode ? handleUpdate : handleRequest}
              className="flex flex-col gap-3"
            >
              {isUpdateMode ? (
                <input
                  type="password"
                  placeholder={`Nouveau mot de passe (${PASSWORD_MIN}+ caracteres)`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={PASSWORD_MIN}
                  className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/[0.15] rounded-md px-3 py-2.5 text-xs text-white/90 placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all"
                />
              ) : (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/[0.15] rounded-md px-3 py-2.5 text-xs text-white/90 placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all"
                />
              )}

              {error && <p className="text-[11px] text-rose-400 py-1">{error}</p>}
              {info && <p className="text-[11px] text-emerald-400 py-1">{info}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-md bg-white text-black hover:bg-white/90 text-xs font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait"
              >
                {submitting
                  ? '...'
                  : isUpdateMode
                    ? 'Mettre a jour'
                    : 'Envoyer le lien'}
              </button>

              <Link
                to="/login"
                className="text-[11px] text-white/40 hover:text-white/70 transition-colors text-center py-1"
              >
                Retour a la connexion
              </Link>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
