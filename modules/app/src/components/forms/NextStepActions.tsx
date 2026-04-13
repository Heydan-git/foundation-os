/**
 * NextStepActions.tsx - Actions rapides pour Next Steps
 * Toggle todo → in_progress → done avec optimistic updates
 */
import React, { useState } from 'react'
import { useCommanderMutations } from '../../lib/mutations'

interface NextStep {
  id: string
  label: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  phase: string | null
}

interface NextStepActionsProps {
  steps: NextStep[]
  onStepUpdate: (stepId: string, newStatus: NextStep['status']) => void
  onAddStep: () => void
}

export const NextStepActions: React.FC<NextStepActionsProps> = ({
  steps,
  onStepUpdate,
  onAddStep
}) => {
  const [loadingSteps, setLoadingSteps] = useState<Set<string>>(new Set())
  const [newStepLabel, setNewStepLabel] = useState('')
  const [isAddingStep, setIsAddingStep] = useState(false)

  const { markStepDone, createNextStep } = useCommanderMutations()

  const handleStatusToggle = async (step: NextStep) => {
    if (loadingSteps.has(step.id)) return

    const nextStatus = getNextStatus(step.status)

    // Optimistic update
    onStepUpdate(step.id, nextStatus)
    setLoadingSteps(prev => new Set([...prev, step.id]))

    try {
      if (nextStatus === 'done') {
        const result = await markStepDone(step.id)

        if (!result.success) {
          // Revert optimistic update
          onStepUpdate(step.id, step.status)
          console.error('Erreur mise à jour step:', result.error)
        } else {
        }
      } else {
        // TODO: implement updateStep for non-done transitions
      }
    } catch (error) {
      // Revert optimistic update
      onStepUpdate(step.id, step.status)
      console.error('Erreur toggle step:', error)
    } finally {
      setLoadingSteps(prev => {
        const newSet = new Set(prev)
        newSet.delete(step.id)
        return newSet
      })
    }
  }

  const handleAddStep = async () => {
    if (!newStepLabel.trim()) return

    setIsAddingStep(true)
    try {
      const result = await createNextStep({
        label: newStepLabel.trim(),
        phase: '01',
        priority: 'medium',
        status: 'todo'
      })

      if (result.success) {
        setNewStepLabel('')
        onAddStep() // Trigger refresh
      } else {
        console.error('Erreur création step:', result.error)
      }
    } catch (error) {
      console.error('Erreur création step:', error)
    } finally {
      setIsAddingStep(false)
    }
  }

  const getNextStatus = (currentStatus: NextStep['status']): NextStep['status'] => {
    switch (currentStatus) {
      case 'todo': return 'in_progress'
      case 'in_progress': return 'done'
      case 'done': return 'todo' // Reset cycle
      default: return 'todo'
    }
  }

  const getStatusIcon = (status: NextStep['status']) => {
    switch (status) {
      case 'todo':
        return <div className="w-4 h-4 border-2 border-gray-500 rounded" />
      case 'in_progress':
        return <div className="w-4 h-4 border-2 border-yellow-400 rounded bg-yellow-400/20" />
      case 'done':
        return (
          <div className="w-4 h-4 bg-[var(--color-accent-brand-primary)] rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-[var(--color-bg-canvas)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )
    }
  }

  const getStatusColor = (status: NextStep['status']) => {
    switch (status) {
      case 'todo': return 'text-gray-400'
      case 'in_progress': return 'text-yellow-400'
      case 'done': return 'text-[var(--color-accent-brand-primary)] line-through opacity-70'
    }
  }

  const getPriorityColor = (priority: NextStep['priority']) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500'
      case 'high': return 'border-l-orange-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[var(--color-accent-brand-primary)] font-sans">
          Next Steps
        </h3>
        <span className="text-sm text-gray-400 font-mono">
          {steps.filter(s => s.status === 'done').length}/{steps.length} complétés
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`
              flex items-center gap-3 p-3 bg-black/20 border-l-4 rounded-r
              ${getPriorityColor(step.priority)}
              ${loadingSteps.has(step.id) ? 'opacity-50' : ''}
              hover:bg-black/30 transition-colors
            `}
          >
            {/* Status Icon */}
            <button
              onClick={() => handleStatusToggle(step)}
              disabled={loadingSteps.has(step.id)}
              className="flex-shrink-0 hover:scale-110 transition-transform disabled:cursor-not-allowed"
            >
              {getStatusIcon(step.status)}
            </button>

            {/* Label */}
            <div className="flex-1">
              <span className={`${getStatusColor(step.status)} font-mono text-sm`}>
                {step.label}
              </span>
            </div>

            {/* Priority & Phase */}
            <div className="flex items-center gap-2 text-xs">
              {step.phase && (
                <span className="px-2 py-1 bg-gray-800 rounded text-gray-300 font-mono">
                  P{step.phase}
                </span>
              )}
              <span className={`
                px-2 py-1 rounded font-mono
                ${step.priority === 'critical' ? 'bg-red-900/50 text-red-400' : ''}
                ${step.priority === 'high' ? 'bg-orange-900/50 text-orange-400' : ''}
                ${step.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-400' : ''}
                ${step.priority === 'low' ? 'bg-green-900/50 text-green-400' : ''}
              `}>
                {step.priority}
              </span>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {steps.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-sans">Aucune action en cours</p>
          </div>
        )}
      </div>

      {/* Add New Step */}
      <div className="flex gap-2 pt-2 border-t border-gray-800">
        <input
          type="text"
          value={newStepLabel}
          onChange={(e) => setNewStepLabel(e.target.value)}
          placeholder="Ajouter une nouvelle action..."
          className="flex-1 px-3 py-2 bg-black/30 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-[var(--color-accent-brand-primary)] focus:outline-none font-mono text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddStep()
            }
          }}
        />
        <button
          onClick={handleAddStep}
          disabled={!newStepLabel.trim() || isAddingStep}
          className="px-4 py-2 bg-[var(--color-accent-brand-primary)] text-[var(--color-bg-canvas)] rounded font-medium hover:bg-[#4FD1C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans text-sm"
        >
          {isAddingStep ? '...' : '+'}
        </button>
      </div>
    </div>
  )
}

export default NextStepActions