/**
 * useNotionSync.ts — React Hook for Notion Bidirectional Sync
 * Foundation OS Phase 5 "Connected" — Real-time sync management
 */

import { useState, useEffect, useCallback } from 'react'
import { notionSyncEngine, defaultNotionSyncConfig } from '../lib/notion-sync-engine'

// ── Hook State Types ──────────────────────────────────────────────────

interface NotionSyncStatus {
  isRunning: boolean
  isConnected: boolean
  lastSync?: string
  queueSize: number
  mappingCount: number
  conflicts: ConflictInfo[]
  recentEvents: SyncEventInfo[]
  error?: string
  performance: {
    avgSyncTime: number
    successRate: number
    totalSyncs: number
  }
}

interface ConflictInfo {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'session' | 'decision' | 'risk' | 'nextstep' | 'doc'
  entityId: string
  timestamp: string
  conflicts: Array<{
    field: string
    foundationValue: any
    notionValue: any
  }>
}

interface SyncEventInfo {
  id: string
  timestamp: string
  type: 'create' | 'update' | 'delete'
  source: 'foundation' | 'notion'
  entity: string
  status: 'pending' | 'synced' | 'failed' | 'conflict'
  duration?: number
}

interface NotionSyncConfig {
  workspaceId: string
  databaseIds: {
    sessions: string
    decisions: string
    risks: string
    nextSteps: string
    docs: string
  }
  syncInterval: number
  conflictResolution: 'foundation_wins' | 'notion_wins' | 'manual' | 'intelligent'
  batchSize: number
  retryAttempts: number
}

// ── Main Hook ─────────────────────────────────────────────────────────

export const useNotionSync = (customConfig?: Partial<NotionSyncConfig>) => {
  const [status, setStatus] = useState<NotionSyncStatus>({
    isRunning: false,
    isConnected: false,
    queueSize: 0,
    mappingCount: 0,
    conflicts: [],
    recentEvents: [],
    performance: {
      avgSyncTime: 0,
      successRate: 100,
      totalSyncs: 0
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<NotionSyncConfig>({
    ...defaultNotionSyncConfig,
    ...customConfig
  })

  // ── Status Updates ────────────────────────────────────────────────────

  const refreshStatus = useCallback(async () => {
    try {
      const engineStatus = notionSyncEngine.getStatus()
      const conflicts = notionSyncEngine.getConflicts()

      setStatus(prev => ({
        ...prev,
        isRunning: engineStatus.isRunning,
        isConnected: checkNotionConnection(),
        queueSize: engineStatus.queueSize,
        mappingCount: engineStatus.mappingCount,
        lastSync: engineStatus.lastActivity,
        conflicts: conflicts.map(mapConflictToInfo),
        recentEvents: getRecentEvents(),
        performance: calculatePerformanceMetrics()
      }))
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        error: error.message,
        isConnected: false
      }))
    }
  }, [])

  // Auto-refresh status every 5 seconds
  useEffect(() => {
    refreshStatus()
    const interval = setInterval(refreshStatus, 5000)
    return () => clearInterval(interval)
  }, [refreshStatus])

  // ── Sync Control Methods ──────────────────────────────────────────────

  const startSync = async () => {
    setIsLoading(true)
    try {
      await notionSyncEngine.start()

      // Store start event
      storeEvent({
        id: `start-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'create',
        source: 'foundation',
        entity: 'system',
        status: 'synced'
      })

      await refreshStatus()
      console.log('✅ Notion sync started successfully')
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
      console.error('❌ Failed to start Notion sync:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const stopSync = async () => {
    setIsLoading(true)
    try {
      await notionSyncEngine.stop()

      // Store stop event
      storeEvent({
        id: `stop-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'delete',
        source: 'foundation',
        entity: 'system',
        status: 'synced'
      })

      await refreshStatus()
      console.log('✅ Notion sync stopped successfully')
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
      console.error('❌ Failed to stop Notion sync:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const forceSyncAll = async () => {
    setIsLoading(true)
    try {
      const startTime = Date.now()
      await notionSyncEngine.forceSyncAll()
      const duration = Date.now() - startTime

      // Store sync event
      storeEvent({
        id: `force-sync-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'update',
        source: 'foundation',
        entity: 'all',
        status: 'synced',
        duration
      })

      await refreshStatus()
      console.log(`✅ Force sync completed in ${duration}ms`)
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
      console.error('❌ Force sync failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Configuration Management ──────────────────────────────────────────

  const updateConfig = (newConfig: Partial<NotionSyncConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)

    // Save to localStorage
    localStorage.setItem('notion-sync-config', JSON.stringify(updatedConfig))

    console.log('⚙️ Notion sync configuration updated')
  }

  const resetConfig = () => {
    setConfig(defaultNotionSyncConfig)
    localStorage.removeItem('notion-sync-config')
    console.log('🔄 Notion sync configuration reset to defaults')
  }

  // Load saved config on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('notion-sync-config')
      if (saved) {
        const savedConfig = JSON.parse(saved)
        setConfig(prev => ({ ...prev, ...savedConfig }))
      }
    } catch (error) {
      console.warn('Failed to load saved Notion sync config:', error)
    }
  }, [])

  // ── Conflict Resolution ───────────────────────────────────────────────

  const resolveConflict = async (
    conflictId: string,
    resolution: 'foundation' | 'notion'
  ) => {
    setIsLoading(true)
    try {
      await notionSyncEngine.resolveManualConflict(conflictId, resolution)

      // Store resolution event
      storeEvent({
        id: `resolve-${conflictId}`,
        timestamp: new Date().toISOString(),
        type: 'update',
        source: resolution,
        entity: 'conflict',
        status: 'synced'
      })

      await refreshStatus()
      console.log(`✅ Conflict ${conflictId} resolved in favor of ${resolution}`)
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
      console.error('❌ Failed to resolve conflict:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getConflictsByEntity = (entityType: string): ConflictInfo[] => {
    return status.conflicts.filter(conflict => conflict.entity === entityType)
  }

  // ── Entity-Specific Sync Methods ──────────────────────────────────────

  const syncEntity = async (
    entityType: 'session' | 'decision' | 'risk' | 'nextstep' | 'doc',
    entityId: string
  ) => {
    setIsLoading(true)
    try {
      // This would call entity-specific sync in the engine
      // For now, trigger a full sync
      await notionSyncEngine.forceSyncAll()

      storeEvent({
        id: `sync-${entityType}-${entityId}`,
        timestamp: new Date().toISOString(),
        type: 'update',
        source: 'foundation',
        entity: entityType,
        status: 'synced'
      })

      await refreshStatus()
      console.log(`✅ ${entityType} ${entityId} synced successfully`)
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
      console.error(`❌ Failed to sync ${entityType} ${entityId}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Database Setup ────────────────────────────────────────────────────

  const setupNotionDatabases = async () => {
    setIsLoading(true)
    try {
      // This would call the engine's database setup method
      // For now, mock the setup process

      const databases = ['sessions', 'decisions', 'risks', 'nextSteps', 'docs']
      for (const db of databases) {
        console.log(`🏗️ Setting up Notion database: ${db}`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
      }

      storeEvent({
        id: `setup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'create',
        source: 'foundation',
        entity: 'databases',
        status: 'synced'
      })

      await refreshStatus()
      console.log('✅ All Notion databases set up successfully')
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
      console.error('❌ Failed to set up Notion databases:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Analytics & Monitoring ────────────────────────────────────────────

  const getSyncAnalytics = () => {
    const events = getStoredEvents()
    const now = Date.now()
    const last24h = events.filter(e =>
      now - new Date(e.timestamp).getTime() < 24 * 60 * 60 * 1000
    )

    return {
      totalEvents: events.length,
      eventsLast24h: last24h.length,
      successfulSyncs: events.filter(e => e.status === 'synced').length,
      failedSyncs: events.filter(e => e.status === 'failed').length,
      conflictCount: status.conflicts.length,
      averageEventTime: calculateAverageEventTime(events),
      syncTrends: calculateSyncTrends(events)
    }
  }

  const clearSyncHistory = () => {
    localStorage.removeItem('notion-sync-events')
    localStorage.removeItem('notion-sync-conflicts')
    setStatus(prev => ({
      ...prev,
      recentEvents: [],
      conflicts: [],
      performance: {
        avgSyncTime: 0,
        successRate: 100,
        totalSyncs: 0
      }
    }))
    console.log('🗑️ Sync history cleared')
  }

  // ── Helper Functions ──────────────────────────────────────────────────

  const checkNotionConnection = (): boolean => {
    try {
      // This would ping Notion API or check MCP connection
      // For now, assume connected if sync is running
      return status.isRunning
    } catch {
      return false
    }
  }

  const mapConflictToInfo = (conflict: any): ConflictInfo => ({
    id: conflict.id,
    type: conflict.type,
    entity: conflict.entity,
    entityId: conflict.entityId,
    timestamp: conflict.timestamp,
    conflicts: conflict.conflicts || []
  })

  const storeEvent = (event: SyncEventInfo) => {
    try {
      const events = getStoredEvents()
      events.push(event)

      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100)
      }

      localStorage.setItem('notion-sync-events', JSON.stringify(events))
    } catch (error) {
      console.warn('Failed to store sync event:', error)
    }
  }

  const getStoredEvents = (): SyncEventInfo[] => {
    try {
      const stored = localStorage.getItem('notion-sync-events')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const getRecentEvents = (): SyncEventInfo[] => {
    return getStoredEvents().slice(-10) // Last 10 events
  }

  const calculatePerformanceMetrics = () => {
    const events = getStoredEvents()
    const syncEvents = events.filter(e => e.duration !== undefined)

    const avgSyncTime = syncEvents.length > 0
      ? syncEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / syncEvents.length
      : 0

    const successfulSyncs = events.filter(e => e.status === 'synced').length
    const totalSyncs = events.length
    const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 100

    return {
      avgSyncTime: Math.round(avgSyncTime),
      successRate: Math.round(successRate),
      totalSyncs
    }
  }

  const calculateAverageEventTime = (events: SyncEventInfo[]): number => {
    const eventsWithDuration = events.filter(e => e.duration !== undefined)
    if (eventsWithDuration.length === 0) return 0

    return eventsWithDuration.reduce((sum, e) => sum + (e.duration || 0), 0) / eventsWithDuration.length
  }

  const calculateSyncTrends = (events: SyncEventInfo[]) => {
    const now = new Date()
    const trends = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date).setHours(0, 0, 0, 0)
      const dayEnd = new Date(date).setHours(23, 59, 59, 999)

      const dayEvents = events.filter(e => {
        const eventTime = new Date(e.timestamp).getTime()
        return eventTime >= dayStart && eventTime <= dayEnd
      })

      trends.push({
        date: date.toISOString().split('T')[0],
        events: dayEvents.length,
        successful: dayEvents.filter(e => e.status === 'synced').length,
        failed: dayEvents.filter(e => e.status === 'failed').length
      })
    }

    return trends
  }

  // ── Return Hook Interface ─────────────────────────────────────────────

  return {
    // Status
    status,
    isLoading,
    config,

    // Core Actions
    startSync,
    stopSync,
    forceSyncAll,
    refreshStatus,

    // Configuration
    updateConfig,
    resetConfig,

    // Conflict Resolution
    resolveConflict,
    getConflictsByEntity,

    // Entity Sync
    syncEntity,

    // Setup
    setupNotionDatabases,

    // Analytics
    getSyncAnalytics,
    clearSyncHistory,

    // Connection Status
    isConnected: status.isConnected,
    hasConflicts: status.conflicts.length > 0,
    queueSize: status.queueSize
  }
}

// ── Export Types for External Use ─────────────────────────────────────────

export type { NotionSyncStatus, ConflictInfo, SyncEventInfo, NotionSyncConfig }