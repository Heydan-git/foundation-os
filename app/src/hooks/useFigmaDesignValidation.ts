/**
 * 🎨 REACT HOOK: useFigmaDesignValidation
 * Foundation OS Phase 5 "Connected" - Figma Design Validation Hook
 * Interface React pour la validation des design tokens en temps réel
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import FigmaDesignValidator, {
  DesignSystemHealth,
  ValidationResult,
  ComponentMapping
} from '../lib/figma-design-validator'

export interface FigmaValidationState {
  // Status
  isRunning: boolean
  isLoading: boolean
  error: string | null

  // Validation data
  designSystemHealth: DesignSystemHealth | null
  validationResults: ValidationResult[]
  componentMappings: ComponentMapping[]

  // Configuration
  figmaFileKey: string
  autoSyncEnabled: boolean
  lastSyncTime: string | null

  // Performance metrics
  syncLatency: number
  successRate: number
  totalSyncs: number
}

export interface FigmaValidationConfig {
  figmaFileKey?: string
  autoSyncInterval?: number // en millisecondes
  enableRealTimeSync?: boolean
  autoFixEnabled?: boolean
}

export interface FigmaValidationActions {
  // Lifecycle
  startValidation: (config?: FigmaValidationConfig) => Promise<boolean>
  stopValidation: () => Promise<void>

  // Validation
  validateAllTokens: () => Promise<DesignSystemHealth | null>
  validateSpecificToken: (tokenName: string) => Promise<ValidationResult | null>

  // Component sync
  syncComponents: () => Promise<ComponentMapping[]>
  syncSpecificComponent: (componentName: string) => Promise<ComponentMapping | null>

  // Auto-fix
  autoFixAllTokens: () => Promise<string[]>
  autoFixSpecificToken: (tokenName: string) => Promise<boolean>

  // Configuration
  updateConfig: (config: Partial<FigmaValidationConfig>) => void
  setFigmaFileKey: (fileKey: string) => void
  toggleAutoSync: () => void

  // Manual actions
  forceSyncAll: () => Promise<void>
  generateComplianceReport: () => string
  exportValidationData: () => void
}

/**
 * 🎣 Hook principal pour la validation Figma Design
 */
export function useFigmaDesignValidation(initialConfig?: FigmaValidationConfig) {
  // État principal
  const [state, setState] = useState<FigmaValidationState>({
    isRunning: false,
    isLoading: false,
    error: null,
    designSystemHealth: null,
    validationResults: [],
    componentMappings: [],
    figmaFileKey: initialConfig?.figmaFileKey || '',
    autoSyncEnabled: initialConfig?.enableRealTimeSync ?? true,
    lastSyncTime: null,
    syncLatency: 0,
    successRate: 100,
    totalSyncs: 0
  })

  // Configuration interne
  const [config, setConfig] = useState<FigmaValidationConfig>({
    autoSyncInterval: 30000, // 30 secondes
    enableRealTimeSync: true,
    autoFixEnabled: false,
    ...initialConfig
  })

  // Références pour les timers et l'instance du validator
  const validatorRef = useRef<FigmaDesignValidator | null>(null)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const performanceRef = useRef({
    syncStartTime: 0,
    successfulSyncs: 0,
    totalAttempts: 0
  })

  /**
   * 🚀 Initialiser le validator
   */
  useEffect(() => {
    if (!validatorRef.current) {
      validatorRef.current = new FigmaDesignValidator()
    }

    return () => {
      // Cleanup au démontage
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [])

  /**
   * ⚡ Démarrer la validation
   */
  const startValidation = useCallback(async (newConfig?: FigmaValidationConfig): Promise<boolean> => {
    if (!validatorRef.current) return false

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      if (newConfig) {
        setConfig(prev => ({ ...prev, ...newConfig }))
      }

      const started = await validatorRef.current.startValidation()

      if (started) {
        setState(prev => ({
          ...prev,
          isRunning: true,
          isLoading: false,
          lastSyncTime: new Date().toISOString()
        }))

        // Démarrer la validation initiale
        await performInitialValidation()

        // Démarrer le sync automatique si activé
        if (config.enableRealTimeSync && config.autoSyncInterval) {
          startAutoSync()
        }

        console.log('✅ Figma Design Validation started')
        return true
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to start validation engine'
        }))
        return false
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
      console.error('❌ Failed to start Figma validation:', error)
      return false
    }
  }, [config])

  /**
   * ⛔ Arrêter la validation
   */
  const stopValidation = useCallback(async (): Promise<void> => {
    if (!validatorRef.current) return

    try {
      await validatorRef.current.stopValidation()

      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
        syncIntervalRef.current = null
      }

      setState(prev => ({
        ...prev,
        isRunning: false,
        lastSyncTime: new Date().toISOString()
      }))

      console.log('⛔ Figma Design Validation stopped')
    } catch (error) {
      console.error('❌ Error stopping validation:', error)
    }
  }, [])

  /**
   * 🔍 Validation initiale complète
   */
  const performInitialValidation = useCallback(async (): Promise<void> => {
    if (!validatorRef.current || !state.figmaFileKey) return

    try {
      performanceRef.current.syncStartTime = Date.now()

      // Valider tous les tokens
      const health = await validatorRef.current.validateAllTokens(state.figmaFileKey)

      // Sync des composants
      const mappings = await validatorRef.current.syncComponents(state.figmaFileKey)

      const syncDuration = Date.now() - performanceRef.current.syncStartTime
      performanceRef.current.successfulSyncs++
      performanceRef.current.totalAttempts++

      setState(prev => ({
        ...prev,
        designSystemHealth: health,
        validationResults: health.validationResults,
        componentMappings: mappings,
        syncLatency: syncDuration,
        successRate: (performanceRef.current.successfulSyncs / performanceRef.current.totalAttempts) * 100,
        totalSyncs: performanceRef.current.totalAttempts,
        lastSyncTime: new Date().toISOString(),
        error: null
      }))

    } catch (error) {
      performanceRef.current.totalAttempts++
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Validation failed',
        successRate: (performanceRef.current.successfulSyncs / performanceRef.current.totalAttempts) * 100
      }))
      console.error('❌ Initial validation failed:', error)
    }
  }, [state.figmaFileKey])

  /**
   * 🔄 Démarrer le sync automatique
   */
  const startAutoSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current)
    }

    syncIntervalRef.current = setInterval(async () => {
      if (state.isRunning && state.autoSyncEnabled) {
        await performInitialValidation()
      }
    }, config.autoSyncInterval)
  }, [state.isRunning, state.autoSyncEnabled, config.autoSyncInterval, performInitialValidation])

  /**
   * 🔍 Valider tous les tokens
   */
  const validateAllTokens = useCallback(async (): Promise<DesignSystemHealth | null> => {
    if (!validatorRef.current || !state.figmaFileKey) return null

    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const health = await validatorRef.current.validateAllTokens(state.figmaFileKey)

      setState(prev => ({
        ...prev,
        designSystemHealth: health,
        validationResults: health.validationResults,
        isLoading: false,
        lastSyncTime: new Date().toISOString()
      }))

      return health
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Token validation failed'
      }))
      return null
    }
  }, [state.figmaFileKey])

  /**
   * 🔄 Sync des composants
   */
  const syncComponents = useCallback(async (): Promise<ComponentMapping[]> => {
    if (!validatorRef.current || !state.figmaFileKey) return []

    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const mappings = await validatorRef.current.syncComponents(state.figmaFileKey)

      setState(prev => ({
        ...prev,
        componentMappings: mappings,
        isLoading: false,
        lastSyncTime: new Date().toISOString()
      }))

      return mappings
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Component sync failed'
      }))
      return []
    }
  }, [state.figmaFileKey])

  /**
   * 🛠️ Auto-fix tous les tokens
   */
  const autoFixAllTokens = useCallback(async (): Promise<string[]> => {
    if (!validatorRef.current) return []

    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const fixedTokens = await validatorRef.current.autoFixTokens()

      // Re-valider après les corrections
      if (fixedTokens.length > 0) {
        await validateAllTokens()
      }

      setState(prev => ({ ...prev, isLoading: false }))

      console.log(`✅ Auto-fixed ${fixedTokens.length} tokens:`, fixedTokens)
      return fixedTokens
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Auto-fix failed'
      }))
      return []
    }
  }, [validateAllTokens])

  /**
   * ⚙️ Mettre à jour la configuration
   */
  const updateConfig = useCallback((newConfig: Partial<FigmaValidationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))

    // Redémarrer l'auto-sync si l'interval a changé
    if (newConfig.autoSyncInterval && state.isRunning && state.autoSyncEnabled) {
      startAutoSync()
    }
  }, [state.isRunning, state.autoSyncEnabled, startAutoSync])

  /**
   * 🔧 Actions utilitaires
   */
  const setFigmaFileKey = useCallback((fileKey: string) => {
    setState(prev => ({ ...prev, figmaFileKey: fileKey }))
  }, [])

  const toggleAutoSync = useCallback(() => {
    setState(prev => ({ ...prev, autoSyncEnabled: !prev.autoSyncEnabled }))
  }, [])

  const forceSyncAll = useCallback(async () => {
    await performInitialValidation()
  }, [performInitialValidation])

  const generateComplianceReport = useCallback((): string => {
    if (!state.designSystemHealth) return ''

    // Import dynamique pour éviter les dépendances circulaires
    return `# Figma Design System Health Report\n\nScore: ${state.designSystemHealth.overallScore}%\nLast Sync: ${state.lastSyncTime}\nCompliant Tokens: ${state.designSystemHealth.compliantTokens}/${state.designSystemHealth.totalTokens}`
  }, [state.designSystemHealth, state.lastSyncTime])

  const exportValidationData = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      designSystemHealth: state.designSystemHealth,
      validationResults: state.validationResults,
      componentMappings: state.componentMappings,
      config
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `figma-validation-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [state.designSystemHealth, state.validationResults, state.componentMappings, config])

  // Actions exposées
  const actions: FigmaValidationActions = {
    startValidation,
    stopValidation,
    validateAllTokens,
    validateSpecificToken: async () => null, // TODO: Implémenter
    syncComponents,
    syncSpecificComponent: async () => null, // TODO: Implémenter
    autoFixAllTokens,
    autoFixSpecificToken: async () => false, // TODO: Implémenter
    updateConfig,
    setFigmaFileKey,
    toggleAutoSync,
    forceSyncAll,
    generateComplianceReport,
    exportValidationData
  }

  return {
    state,
    actions,
    config
  }
}

/**
 * 🎨 Hook simplifié pour l'état de santé du design system
 */
export function useFigmaDesignHealth() {
  const { state } = useFigmaDesignValidation()

  return {
    isHealthy: (state.designSystemHealth?.overallScore ?? 0) >= 95,
    score: state.designSystemHealth?.overallScore ?? 0,
    issues: state.validationResults.filter(r => !r.isCompliant),
    autoFixableIssues: state.validationResults.filter(r => r.autoFixAvailable && !r.isCompliant),
    lastCheck: state.lastSyncTime
  }
}

export default useFigmaDesignValidation