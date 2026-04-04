/**
 * useSelfModifying.ts - React Hook for Self-Modifying System Control
 * Phase 3 Self-Modifying - User interface for auto-evolution system
 */

import { useState, useEffect } from 'react'
import { selfModifyingGenerator } from '../lib/self-modifying-generator'
import { autoEvolutionTriggers } from '../lib/auto-evolution-triggers'
import { mdComponentFactory } from '../lib/md-component-factory'

interface SelfModifyingStatus {
  isAnalyzing: boolean
  isGenerating: boolean
  isEvolutionActive: boolean
  lastAnalysis?: string
  systemNeeds: number
  generatedComponents: number
  evolutionTriggers: number
  errors: string[]
}

export const useSelfModifying = () => {
  const [status, setStatus] = useState<SelfModifyingStatus>({
    isAnalyzing: false,
    isGenerating: false,
    isEvolutionActive: false,
    systemNeeds: 0,
    generatedComponents: 0,
    evolutionTriggers: 0,
    errors: []
  })

  const [isLoading, setIsLoading] = useState(false)

  // Get current status
  const refreshStatus = () => {
    try {
      const genStats = selfModifyingGenerator.getStats()
      const triggerStats = autoEvolutionTriggers.getStatus()
      const factoryStats = mdComponentFactory.getStats()

      setStatus({
        isAnalyzing: false,
        isGenerating: false,
        isEvolutionActive: triggerStats.monitoring,
        lastAnalysis: genStats.lastAnalysis,
        systemNeeds: 0, // Would get from analysis
        generatedComponents: factoryStats.totalGenerated,
        evolutionTriggers: triggerStats.triggerCount,
        errors: []
      })
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        errors: [...prev.errors, error.message]
      }))
    }
  }

  // Auto-refresh status
  useEffect(() => {
    refreshStatus()
    const interval = setInterval(refreshStatus, 10000) // 10 seconds
    return () => clearInterval(interval)
  }, [])

  // Analyze system needs
  const analyzeSystemNeeds = async () => {
    setIsLoading(true)
    setStatus(prev => ({ ...prev, isAnalyzing: true, errors: [] }))

    try {
      const needs = await selfModifyingGenerator.analyzeSystemNeeds()
      setStatus(prev => ({
        ...prev,
        systemNeeds: needs.length,
        lastAnalysis: new Date().toISOString()
      }))

      return needs
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        errors: [...prev.errors, `Analysis failed: ${error.message}`]
      }))
      throw error
    } finally {
      setIsLoading(false)
      setStatus(prev => ({ ...prev, isAnalyzing: false }))
    }
  }

  // Trigger self-modification
  const triggerSelfModification = async () => {
    setIsLoading(true)
    setStatus(prev => ({ ...prev, isGenerating: true, errors: [] }))

    try {
      const plan = await selfModifyingGenerator.selfModify()
      setStatus(prev => ({
        ...prev,
        generatedComponents: prev.generatedComponents + plan.generatedFiles.length
      }))

      return plan
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        errors: [...prev.errors, `Self-modification failed: ${error.message}`]
      }))
      throw error
    } finally {
      setIsLoading(false)
      setStatus(prev => ({ ...prev, isGenerating: false }))
    }
  }

  // Start/stop auto-evolution
  const toggleAutoEvolution = async () => {
    setIsLoading(true)
    try {
      if (status.isEvolutionActive) {
        autoEvolutionTriggers.stopMonitoring()
      } else {
        autoEvolutionTriggers.startMonitoring()
      }
      refreshStatus()
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        errors: [...prev.errors, `Toggle failed: ${error.message}`]
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Force evolution trigger
  const forceEvolution = async (triggerId?: string) => {
    setIsLoading(true)
    try {
      const results = await autoEvolutionTriggers.forceEvolution(triggerId)
      refreshStatus()
      return results
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        errors: [...prev.errors, `Force evolution failed: ${error.message}`]
      }))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Generate component from markdown
  const generateComponentFromMarkdown = async (markdown: string, componentName?: string) => {
    setIsLoading(true)
    try {
      const spec = mdComponentFactory.parseComponentFromMarkdown(markdown, componentName)
      if (!spec) throw new Error('Could not parse component specification')

      const result = await mdComponentFactory.generateComponent(spec)
      refreshStatus()
      return result
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        errors: [...prev.errors, `Component generation failed: ${error.message}`]
      }))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Clear errors
  const clearErrors = () => {
    setStatus(prev => ({ ...prev, errors: [] }))
  }

  return {
    status,
    isLoading,
    analyzeSystemNeeds,
    triggerSelfModification,
    toggleAutoEvolution,
    forceEvolution,
    generateComponentFromMarkdown,
    clearErrors,
    refreshStatus
  }
}

export default useSelfModifying