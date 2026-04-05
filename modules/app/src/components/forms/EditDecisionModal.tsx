/**
 * EditDecisionModal.tsx - Modal édition décision inline ADR
 * Permet modification des décisions existantes
 */
import React, { useState, useEffect } from 'react'
import { useCommanderMutations } from '../../lib/mutations'

interface EditDecisionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  decision: {
    id: string
    title: string
    context: string | null
    impact: 'high' | 'medium' | 'low'
    status: 'active' | 'superseded' | 'deprecated'
  } | null
}

export const EditDecisionModal: React.FC<EditDecisionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  decision
}) => {
  const [formData, setFormData] = useState({
    title: '',
    context: '',
    impact: 'medium' as 'high' | 'medium' | 'low',
    status: 'active' as 'active' | 'superseded' | 'deprecated'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { updateDecision } = useCommanderMutations()

  // Populate form when decision changes
  useEffect(() => {
    if (decision) {
      setFormData({
        title: decision.title || '',
        context: decision.context || '',
        impact: decision.impact || 'medium',
        status: decision.status || 'active'
      })
    }
  }, [decision])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!decision) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await updateDecision(decision.id, formData)

      if (result.success) {
        console.log('✅ Décision mise à jour:', decision.id)
        onSuccess()
        onClose()
      } else {
        setError(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inattendue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-700'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      case 'low': return 'text-green-400 bg-green-900/20 border-green-700'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#5EEAD4] bg-emerald-900/20 border-emerald-700'
      case 'superseded': return 'text-blue-400 bg-blue-900/20 border-blue-700'
      case 'deprecated': return 'text-red-400 bg-red-900/20 border-red-700'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700'
    }
  }

  if (!isOpen || !decision) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#06070C] border border-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium text-[#5EEAD4] font-sans">
              Modifier Décision
            </h2>
            <p className="text-sm text-gray-400 font-mono">
              {decision.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-sans">
              Titre de la décision *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Architecture 5-niveaux anti-compactage"
              className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-[#5EEAD4] focus:outline-none font-mono"
            />
          </div>

          {/* Impact & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Impact */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 font-sans">
                Impact
              </label>
              <select
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:border-[#5EEAD4] focus:outline-none font-mono ${getImpactColor(formData.impact)}`}
              >
                <option value="low" className="bg-[#06070C]">Low</option>
                <option value="medium" className="bg-[#06070C]">Medium</option>
                <option value="high" className="bg-[#06070C]">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 font-sans">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:border-[#5EEAD4] focus:outline-none font-mono ${getStatusColor(formData.status)}`}
              >
                <option value="active" className="bg-[#06070C]">Active</option>
                <option value="superseded" className="bg-[#06070C]">Superseded</option>
                <option value="deprecated" className="bg-[#06070C]">Deprecated</option>
              </select>
            </div>
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-sans">
              Contexte & Justification
            </label>
            <textarea
              name="context"
              value={formData.context}
              onChange={handleChange}
              rows={4}
              placeholder="Expliquez le contexte, les raisons et l'impact de cette décision..."
              className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-[#5EEAD4] focus:outline-none font-mono resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50 font-sans"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="px-6 py-2 bg-[#5EEAD4] text-[#06070C] rounded font-medium hover:bg-[#4FD1C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDecisionModal