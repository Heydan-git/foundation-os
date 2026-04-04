/**
 * useSync.ts - React Hook for MD↔DB Sync Management
 * Provides sync controls and status for Foundation OS Phase 2
 */

import { useState, useEffect } from 'react'
import { mdSyncDaemon } from '../lib/md-sync-daemon'

interface SyncStatus {
  running: boolean
  lastSync?: string
  recentEvents: any[]
  error?: string
  pendingChanges: number
}

export const useSync = () => {
  const [status, setStatus] = useState<SyncStatus>({
    running: false,
    recentEvents: [],
    pendingChanges: 0
  })

  const [isLoading, setIsLoading] = useState(false)

  // Get current status
  const refreshStatus = () => {
    try {
      const daemonStatus = mdSyncDaemon.getStatus()
      setStatus({
        running: daemonStatus.running,
        lastSync: daemonStatus.recentEvents[0]?.timestamp,
        recentEvents: daemonStatus.recentEvents,
        pendingChanges: 0 // Would count actual pending changes
      })
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        error: error.message
      }))
    }
  }

  // Auto-refresh status
  useEffect(() => {
    refreshStatus()
    const interval = setInterval(refreshStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  // Start sync daemon
  const startSync = async () => {
    setIsLoading(true)
    try {
      mdSyncDaemon.start()
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for startup
      refreshStatus()
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
    } finally {
      setIsLoading(false)
    }
  }

  // Stop sync daemon
  const stopSync = async () => {
    setIsLoading(true)
    try {
      mdSyncDaemon.stop()
      refreshStatus()
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
    } finally {
      setIsLoading(false)
    }
  }

  // Force sync MD → DB
  const syncMDToDB = async () => {
    setIsLoading(true)
    try {
      await mdSyncDaemon.forceSyncMD()
      refreshStatus()
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
    } finally {
      setIsLoading(false)
    }
  }

  // Force sync DB → MD
  const syncDBToMD = async () => {
    setIsLoading(true)
    try {
      await mdSyncDaemon.forceSyncDB()
      refreshStatus()
    } catch (error: any) {
      setStatus(prev => ({ ...prev, error: error.message }))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    status,
    isLoading,
    startSync,
    stopSync,
    syncMDToDB,
    syncDBToMD,
    refreshStatus
  }
}