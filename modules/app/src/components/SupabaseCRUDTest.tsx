import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, Decision } from '../lib/database.types'

export default function SupabaseCRUDTest() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // ── Session Form State ─────────────────────────────────────────────
  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    items: '',
    decisions: ''
  })

  // ── Decision Form State ─────────────────────────────────────────────
  const [newDecision, setNewDecision] = useState<{
    date: string
    title: string
    context: string
    impact: 'high' | 'medium' | 'low'
    status: 'active' | 'superseded' | 'deprecated'
  }>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    context: '',
    impact: 'medium',
    status: 'active'
  })

  // ── Load Data ─────────────────────────────────────────────────
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false })

      if (sessionsError) throw sessionsError
      setSessions(sessionsData || [])

      // Load decisions
      const { data: decisionsData, error: decisionsError } = await supabase
        .from('decisions')
        .select('*')
        .order('date', { ascending: false })

      if (decisionsError) throw decisionsError
      setDecisions(decisionsData || [])

      setSuccess('Données chargées depuis Supabase')
    } catch (err) {
      console.error('Erreur lors du chargement:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  // ── Create Session ─────────────────────────────────────────────────
  const createSession = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('sessions')
        .insert([{ ...newSession, phase: null, status: 'active' as const }])
        .select()

      if (error) throw error

      console.log('Session créée:', data)
      setSuccess(`Session "${newSession.title}" créée avec succès`)

      // Reset form
      setNewSession({
        date: new Date().toISOString().split('T')[0],
        title: '',
        items: '',
        decisions: ''
      })

      // Reload data
      await loadData()
    } catch (err) {
      console.error('Erreur création session:', err)
      setError(err instanceof Error ? err.message : 'Erreur création session')
    } finally {
      setLoading(false)
    }
  }

  // ── Create Decision ─────────────────────────────────────────────────
  const createDecision = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('decisions')
        .insert([newDecision])
        .select()

      if (error) throw error

      console.log('Décision créée:', data)
      setSuccess(`Décision "${newDecision.title}" créée avec succès`)

      // Reset form
      setNewDecision({
        date: new Date().toISOString().split('T')[0],
        title: '',
        context: '',
        impact: 'medium',
        status: 'active'
      })

      // Reload data
      await loadData()
    } catch (err) {
      console.error('Erreur création décision:', err)
      setError(err instanceof Error ? err.message : 'Erreur création décision')
    } finally {
      setLoading(false)
    }
  }

  // ── Delete Session ─────────────────────────────────────────────────
  const deleteSession = async (id: string, title: string) => {
    if (!confirm(`Supprimer la session "${title}" ?`)) return

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSuccess(`Session "${title}" supprimée`)
      await loadData()
    } catch (err) {
      console.error('Erreur suppression session:', err)
      setError(err instanceof Error ? err.message : 'Erreur suppression session')
    } finally {
      setLoading(false)
    }
  }

  // ── Delete Decision ─────────────────────────────────────────────────
  const deleteDecision = async (id: string, title: string) => {
    if (!confirm(`Supprimer la décision "${title}" ?`)) return

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('decisions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSuccess(`Décision "${title}" supprimée`)
      await loadData()
    } catch (err) {
      console.error('Erreur suppression décision:', err)
      setError(err instanceof Error ? err.message : 'Erreur suppression décision')
    } finally {
      setLoading(false)
    }
  }


  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-[#06070C] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#5EEAD4] mb-2">
            Foundation OS - Test CRUD Supabase
          </h1>
          <p className="text-white/70">
            Test des opérations réelles sur la base de données
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">❌ {error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400">✅ {success}</p>
          </div>
        )}

        {/* Control Bar */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex gap-4">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-[#5EEAD4] text-black rounded-lg font-medium hover:bg-[#5EEAD4]/80 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : '🔄 Recharger données'}
            </button>
            <div className="text-white/70">
              {sessions.length} sessions • {decisions.length} décisions
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sessions Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#5EEAD4]">Sessions</h2>

            {/* Create Session Form */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">➕ Nouvelle Session</h3>
              <form onSubmit={createSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={e => setNewSession({...newSession, date: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input
                    type="text"
                    value={newSession.title}
                    onChange={e => setNewSession({...newSession, title: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Titre de la session"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Items</label>
                  <textarea
                    value={newSession.items}
                    onChange={e => setNewSession({...newSession, items: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
                    rows={3}
                    placeholder="Points abordés..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[#5EEAD4] text-black rounded-lg font-medium hover:bg-[#5EEAD4]/80 disabled:opacity-50"
                >
                  {loading ? 'Création...' : '✨ Créer Session'}
                </button>
              </form>
            </div>

            {/* Sessions List */}
            <div className="space-y-3">
              {sessions.map(session => (
                <div key={session.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-[#5EEAD4]">{session.title}</h4>
                      <p className="text-sm text-white/70">{session.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteSession(session.id, session.title)}
                        className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {session.items && (
                    <p className="text-sm text-white/80">{session.items}</p>
                  )}
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 text-white/50">
                  Aucune session trouvée
                </div>
              )}
            </div>
          </div>

          {/* Decisions Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#5EEAD4]">Décisions</h2>

            {/* Create Decision Form */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">➕ Nouvelle Décision</h3>
              <form onSubmit={createDecision} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newDecision.date}
                    onChange={e => setNewDecision({...newDecision, date: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input
                    type="text"
                    value={newDecision.title}
                    onChange={e => setNewDecision({...newDecision, title: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Décision prise..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contexte</label>
                  <textarea
                    value={newDecision.context}
                    onChange={e => setNewDecision({...newDecision, context: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
                    rows={3}
                    placeholder="Contexte et justification..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Impact</label>
                  <select
                    value={newDecision.impact}
                    onChange={e => setNewDecision({...newDecision, impact: e.target.value as 'high' | 'medium' | 'low'})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyen</option>
                    <option value="high">Élevé</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[#5EEAD4] text-black rounded-lg font-medium hover:bg-[#5EEAD4]/80 disabled:opacity-50"
                >
                  {loading ? 'Création...' : '💡 Créer Décision'}
                </button>
              </form>
            </div>

            {/* Decisions List */}
            <div className="space-y-3">
              {decisions.map(decision => (
                <div key={decision.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-[#5EEAD4]">{decision.title}</h4>
                      <p className="text-sm text-white/70">{decision.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        decision.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                        decision.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {decision.impact}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        decision.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {decision.status}
                      </span>
                      <button
                        onClick={() => deleteDecision(decision.id, decision.title)}
                        className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {decision.context && (
                    <p className="text-sm text-white/80">{decision.context}</p>
                  )}
                </div>
              ))}
              {decisions.length === 0 && (
                <div className="text-center py-8 text-white/50">
                  Aucune décision trouvée
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}