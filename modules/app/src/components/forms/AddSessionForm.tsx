/**
 * AddSessionForm.tsx - Modal création nouvelle session
 * Premier composant write-capable pour Foundation OS
 */
import React, { useState } from 'react'
import { useCommanderMutations } from '../../lib/mutations'

interface AddSessionFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AddSessionForm: React.FC<AddSessionFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    items: '',
    decisions: '',
    phase: '01'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { createSession } = useCommanderMutations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await createSession({
        ...formData,
        date: new Date().toISOString().split('T')[0]
      })

      if (result.success) {
        console.log('✅ Session créée avec succès:', result.data?.id)

        // Reset form
        setFormData({
          title: '',
          items: '',
          decisions: '',
          phase: '01'
        })

        onSuccess()
        onClose()
      } else {
        setError(result.error || 'Erreur lors de la création')
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#06070C] border border-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-[#5EEAD4] font-['Figtree']">
            Nouvelle Session
          </h2>
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
            <label className="block text-sm font-medium text-gray-300 mb-1 font-['Figtree']">
              Titre de la session *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Phase 1 Write Capability Implementation"
              className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-[#5EEAD4] focus:outline-none font-['JetBrains_Mono']"
            />
          </div>

          {/* Phase */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-['Figtree']">
              Phase
            </label>
            <select
              name="phase"
              value={formData.phase}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white focus:border-[#5EEAD4] focus:outline-none font-['JetBrains_Mono']"
            >
              <option value="00">Phase 0 - Foundation</option>
              <option value="01">Phase 1 - Write Capability</option>
              <option value="02">Phase 2 - Unified Source</option>
              <option value="03">Phase 3 - Self-Modifying</option>
              <option value="04">Phase 4 - Smart Orchestration</option>
              <option value="05">Phase 5 - Connected</option>
            </select>
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-['Figtree']">
              Items de la session
            </label>
            <textarea
              name="items"
              value={formData.items}
              onChange={handleChange}
              rows={3}
              placeholder="Décrivez les éléments traités dans cette session..."
              className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-[#5EEAD4] focus:outline-none font-['JetBrains_Mono'] resize-none"
            />
          </div>

          {/* Decisions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-['Figtree']">
              Décisions prises
            </label>
            <textarea
              name="decisions"
              value={formData.decisions}
              onChange={handleChange}
              rows={3}
              placeholder="Décrivez les décisions importantes prises..."
              className="w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-[#5EEAD4] focus:outline-none font-['JetBrains_Mono'] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50 font-['Figtree']"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="px-6 py-2 bg-[#5EEAD4] text-[#06070C] rounded font-medium hover:bg-[#4FD1C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Figtree']"
            >
              {isLoading ? 'Création...' : 'Créer Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSessionForm