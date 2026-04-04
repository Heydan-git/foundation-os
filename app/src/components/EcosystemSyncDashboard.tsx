/**
 * Foundation OS Phase 5 "Connected" - Ecosystem Sync Dashboard
 * Dashboard temps réel pour monitoring de la synchronisation tri-directionnelle
 *
 * Features:
 * - Real-time sync status monitoring
 * - Cross-platform metrics visualization
 * - Conflict detection and resolution tracking
 * - Manual sync trigger controls
 */

import React, { useState, useEffect } from 'react'
import { ecosystemSync, SyncMetrics, NotificationEvent, SyncResult } from '../lib/sync/ecosystem-sync-engine'

interface SyncStatus {
  platform: 'notion' | 'asana' | 'figma'
  status: 'syncing' | 'synced' | 'error' | 'idle'
  lastSync: Date | null
  itemCount: number
}

export default function EcosystemSyncDashboard() {
  const [metrics, setMetrics] = useState<SyncMetrics>(ecosystemSync.getRealtimeMetrics())
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([
    { platform: 'notion', status: 'idle', lastSync: null, itemCount: 0 },
    { platform: 'asana', status: 'idle', lastSync: null, itemCount: 0 },
    { platform: 'figma', status: 'idle', lastSync: null, itemCount: 0 }
  ])
  const [recentEvents, setRecentEvents] = useState<NotificationEvent[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Subscribe to sync events
    const handleSyncEvent = (event: NotificationEvent) => {
      setRecentEvents(prev => [event, ...prev.slice(0, 9)]) // Keep last 10 events

      // Update sync statuses based on events
      if (event.type === 'sync_complete') {
        setSyncStatuses(prev => prev.map(status =>
          status.platform === event.platform
            ? { ...status, status: 'synced', lastSync: event.timestamp, itemCount: event.data?.syncedItems || 0 }
            : status
        ))
      }

      if (event.type === 'error') {
        setSyncStatuses(prev => prev.map(status =>
          status.platform === event.platform
            ? { ...status, status: 'error', lastSync: event.timestamp }
            : status
        ))
      }

      // Update metrics
      setMetrics(ecosystemSync.getRealtimeMetrics())
    }

    ecosystemSync.onEvent(handleSyncEvent)

    // Update metrics every 5 seconds
    const metricsInterval = setInterval(() => {
      setMetrics(ecosystemSync.getRealtimeMetrics())
    }, 5000)

    return () => {
      clearInterval(metricsInterval)
    }
  }, [])

  const handleStartMonitoring = () => {
    ecosystemSync.startRealtimeMonitoring()
    setIsMonitoring(true)
  }

  const handleFullSync = async () => {
    setIsSyncing(true)

    // Update all platforms to syncing status
    setSyncStatuses(prev => prev.map(status => ({ ...status, status: 'syncing' })))

    try {
      await ecosystemSync.performFullSync()
    } catch (error) {
      console.error('Full sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handlePlatformSync = async (platform: 'notion' | 'asana' | 'figma') => {
    setSyncStatuses(prev => prev.map(status =>
      status.platform === platform
        ? { ...status, status: 'syncing' }
        : status
    ))

    try {
      let result: SyncResult

      switch (platform) {
        case 'notion':
          result = await ecosystemSync.syncFoundationToNotion()
          await ecosystemSync.syncNotionToFoundation()
          break
        case 'asana':
          result = await ecosystemSync.syncFoundationToAsana()
          await ecosystemSync.syncAsanaToFoundation()
          break
        case 'figma':
          result = await ecosystemSync.syncFoundationToFigma()
          await ecosystemSync.syncFigmaToFoundation()
          break
      }

      setSyncStatuses(prev => prev.map(status =>
        status.platform === platform
          ? {
              ...status,
              status: result!.success ? 'synced' : 'error',
              lastSync: new Date(),
              itemCount: result!.syncedItems
            }
          : status
      ))
    } catch (error) {
      setSyncStatuses(prev => prev.map(status =>
        status.platform === platform
          ? { ...status, status: 'error', lastSync: new Date() }
          : status
      ))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'syncing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'synced': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'error': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'notion': return '📝'
      case 'asana': return '📋'
      case 'figma': return '🎨'
      default: return '🔗'
    }
  }

  const formatTimestamp = (date: Date | null) => {
    if (!date) return 'Never'
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / 60000),
      'minute'
    )
  }

  return (
    <div className="min-h-screen bg-[#06070C] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#5EEAD4] mb-2">
          🔄 Ecosystem Sync Dashboard
        </h1>
        <p className="text-gray-400">
          Real-time monitoring for Notion ↔ Asana ↔ Figma ↔ Foundation OS synchronization
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sync Controls */}
        <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            ⚡ Sync Controls
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Real-time Monitoring</span>
              <button
                onClick={handleStartMonitoring}
                disabled={isMonitoring}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isMonitoring
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-[#5EEAD4] text-[#06070C] hover:bg-[#5EEAD4]/90'
                }`}
              >
                {isMonitoring ? '✅ Active' : 'Start Monitoring'}
              </button>
            </div>

            <button
              onClick={handleFullSync}
              disabled={isSyncing}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                isSyncing
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-[#5EEAD4] text-[#06070C] hover:bg-[#5EEAD4]/90'
              }`}
            >
              {isSyncing ? '🔄 Syncing All Platforms...' : '🚀 Full Ecosystem Sync'}
            </button>
          </div>
        </div>

        {/* Sync Metrics */}
        <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            📊 Performance Metrics
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5EEAD4]">{metrics.totalSyncs}</div>
              <div className="text-sm text-gray-400">Total Syncs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5EEAD4]">{metrics.successRate}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5EEAD4]">{metrics.averageLatency}ms</div>
              <div className="text-sm text-gray-400">Avg Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5EEAD4]">{metrics.conflictsResolved}</div>
              <div className="text-sm text-gray-400">Conflicts Resolved</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Last sync: {formatTimestamp(metrics.lastSyncAt)}
          </div>
        </div>
      </div>

      {/* Platform Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {syncStatuses.map((syncStatus) => (
          <div
            key={syncStatus.platform}
            className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPlatformIcon(syncStatus.platform)}</span>
                <h3 className="text-lg font-semibold capitalize">
                  {syncStatus.platform}
                </h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(syncStatus.status)}`}>
                {syncStatus.status}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Last Sync</span>
                <span>{formatTimestamp(syncStatus.lastSync)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Items Synced</span>
                <span>{syncStatus.itemCount}</span>
              </div>
            </div>

            <button
              onClick={() => handlePlatformSync(syncStatus.platform)}
              disabled={syncStatus.status === 'syncing'}
              className={`w-full mt-4 py-2 rounded-lg font-medium transition-all ${
                syncStatus.status === 'syncing'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-[#5EEAD4]/10 text-[#5EEAD4] border border-[#5EEAD4]/30 hover:bg-[#5EEAD4]/20'
              }`}
            >
              {syncStatus.status === 'syncing' ? '🔄 Syncing...' : `🔄 Sync ${syncStatus.platform}`}
            </button>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          📋 Recent Sync Events
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recentEvents.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No sync events yet. Start monitoring to see live events.
            </div>
          ) : (
            recentEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border ${
                  event.type === 'error'
                    ? 'bg-red-500/10 border-red-500/30'
                    : event.type === 'sync_complete'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {getPlatformIcon(event.platform)} {event.platform}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.type === 'error' ? 'bg-red-500/20 text-red-300' :
                        event.type === 'sync_complete' ? 'bg-green-500/20 text-green-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {event.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{event.message}</p>
                    {event.data && (
                      <pre className="text-xs text-gray-400 mt-2 bg-[rgba(255,255,255,0.05)] p-2 rounded">
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 ml-4">
                    {event.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Connection Status Indicator */}
      <div className="fixed bottom-6 right-6">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
          isMonitoring
            ? 'bg-green-500/20 text-green-300 border-green-500/30'
            : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium">
            {isMonitoring ? 'Live Monitoring' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  )
}