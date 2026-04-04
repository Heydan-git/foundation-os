/**
 * NotionSyncDashboard.tsx — Real-time Notion Sync Monitoring
 * Foundation OS Phase 5 "Connected" — Sync status + controls + analytics
 */

import React, { useState } from 'react'
import { useNotionSync } from '../hooks/useNotionSync'

// ── Main Dashboard Component ──────────────────────────────────────────────

export const NotionSyncDashboard: React.FC = () => {
  const {
    status,
    isLoading,
    config,
    startSync,
    stopSync,
    forceSyncAll,
    resolveConflict,
    setupNotionDatabases,
    updateConfig,
    getSyncAnalytics,
    clearSyncHistory
  } = useNotionSync()

  const [showConfig, setShowConfig] = useState(false)
  const [showConflicts, setShowConflicts] = useState(false)
  const analytics = getSyncAnalytics()

  return (
    <div className="min-h-screen bg-[#06070C] text-[rgba(255,255,255,0.88)] font-['Figtree']">
      {/* Header */}
      <div className="p-6 border-b border-[rgba(255,255,255,0.055)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#5EEAD4]">
              Notion Sync Dashboard
            </h1>
            <p className="text-[rgba(255,255,255,0.42)] mt-1">
              Foundation OS ↔ Notion bidirectional synchronization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SyncStatusIndicator
              isRunning={status.isRunning}
              isConnected={status.isConnected}
              hasErrors={!!status.error}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Control Panel */}
        <ControlPanel
          status={status}
          isLoading={isLoading}
          onStart={startSync}
          onStop={stopSync}
          onForceSync={forceSyncAll}
          onSetupDatabases={setupNotionDatabases}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Queue Size"
            value={status.queueSize}
            subtitle="pending operations"
            color="blue"
          />
          <StatCard
            title="Mappings"
            value={status.mappingCount}
            subtitle="synchronized entities"
            color="green"
          />
          <StatCard
            title="Conflicts"
            value={status.conflicts.length}
            subtitle="requiring resolution"
            color={status.conflicts.length > 0 ? "red" : "gray"}
          />
          <StatCard
            title="Success Rate"
            value={`${Math.round((analytics.successfulSyncs / Math.max(analytics.totalEvents, 1)) * 100)}%`}
            subtitle="sync operations"
            color={((analytics.successfulSyncs / Math.max(analytics.totalEvents, 1)) * 100) > 90 ? "green" : "orange"}
          />
        </div>

        {/* Performance Metrics */}
        <PerformancePanel analytics={analytics} />

        {/* Recent Activity */}
        <RecentActivityPanel events={status.recentEvents} />

        {/* Conflicts Panel */}
        {status.conflicts.length > 0 && (
          <ConflictsPanel
            conflicts={status.conflicts}
            isVisible={showConflicts}
            onToggle={() => setShowConflicts(!showConflicts)}
            onResolve={resolveConflict}
          />
        )}

        {/* Configuration Panel */}
        <ConfigurationPanel
          config={config}
          isVisible={showConfig}
          onToggle={() => setShowConfig(!showConfig)}
          onUpdate={updateConfig}
        />

        {/* Error Display */}
        {status.error && (
          <ErrorPanel
            error={status.error}
            onDismiss={() => window.location.reload()}
          />
        )}

        {/* Debug Actions */}
        <DebugPanel
          onClearHistory={clearSyncHistory}
          analytics={analytics}
        />
      </div>
    </div>
  )
}

// ── Status Indicator Component ────────────────────────────────────────────

interface SyncStatusIndicatorProps {
  isRunning: boolean
  isConnected: boolean
  hasErrors: boolean
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  isRunning,
  isConnected,
  hasErrors
}) => {
  const getStatusColor = () => {
    if (hasErrors) return 'bg-red-500'
    if (isRunning && isConnected) return 'bg-[#5EEAD4]'
    if (isRunning) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getStatusText = () => {
    if (hasErrors) return 'Error'
    if (isRunning && isConnected) return 'Active'
    if (isRunning) return 'Starting'
    return 'Stopped'
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
      <span className="text-sm font-mono">{getStatusText()}</span>
    </div>
  )
}

// ── Control Panel Component ───────────────────────────────────────────────

interface ControlPanelProps {
  status: any
  isLoading: boolean
  onStart: () => void
  onStop: () => void
  onForceSync: () => void
  onSetupDatabases: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  status,
  isLoading,
  onStart,
  onStop,
  onForceSync,
  onSetupDatabases
}) => (
  <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-4">Sync Controls</h3>
    <div className="flex flex-wrap gap-3">
      <SyncButton
        onClick={status.isRunning ? onStop : onStart}
        disabled={isLoading}
        variant={status.isRunning ? "danger" : "primary"}
      >
        {status.isRunning ? "Stop Sync" : "Start Sync"}
      </SyncButton>

      <SyncButton
        onClick={onForceSync}
        disabled={isLoading || !status.isRunning}
        variant="secondary"
      >
        Force Sync
      </SyncButton>

      <SyncButton
        onClick={onSetupDatabases}
        disabled={isLoading}
        variant="accent"
      >
        Setup Databases
      </SyncButton>
    </div>

    {status.lastSync && (
      <div className="mt-4 text-sm text-[rgba(255,255,255,0.42)]">
        Last sync: {new Date(status.lastSync).toLocaleString()}
      </div>
    )}
  </div>
)

// ── Sync Button Component ─────────────────────────────────────────────────

interface SyncButtonProps {
  onClick: () => void
  disabled?: boolean
  variant?: "primary" | "secondary" | "danger" | "accent"
  children: React.ReactNode
}

const SyncButton: React.FC<SyncButtonProps> = ({
  onClick,
  disabled = false,
  variant = "primary",
  children
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-[#5EEAD4] text-[#06070C] hover:bg-[rgba(94,234,212,0.8)]"
      case "secondary":
        return "bg-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.15)]"
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700"
      case "accent":
        return "bg-purple-600 text-white hover:bg-purple-700"
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${getVariantClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  )
}

// ── Stat Card Component ───────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: number | string
  subtitle: string
  color: "blue" | "green" | "red" | "orange" | "gray"
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue": return "border-blue-500/30 text-blue-400"
      case "green": return "border-[#5EEAD4]/30 text-[#5EEAD4]"
      case "red": return "border-red-500/30 text-red-400"
      case "orange": return "border-orange-500/30 text-orange-400"
      case "gray": return "border-gray-500/30 text-gray-400"
    }
  }

  return (
    <div className={`
      bg-[rgba(255,255,255,0.025)] border rounded-xl p-4
      ${getColorClasses()}
    `}>
      <div className="text-sm text-[rgba(255,255,255,0.42)] mb-1">{title}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-[rgba(255,255,255,0.42)]">{subtitle}</div>
    </div>
  )
}

// ── Performance Panel Component ───────────────────────────────────────────

interface PerformancePanelProps {
  analytics: any
}

const PerformancePanel: React.FC<PerformancePanelProps> = ({ analytics }) => (
  <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <div className="text-sm text-[rgba(255,255,255,0.42)] mb-2">Average Sync Time</div>
        <div className="text-xl font-bold text-[#5EEAD4]">
          {analytics.averageEventTime ? `${Math.round(analytics.averageEventTime)}ms` : 'N/A'}
        </div>
      </div>

      <div>
        <div className="text-sm text-[rgba(255,255,255,0.42)] mb-2">Total Events (24h)</div>
        <div className="text-xl font-bold text-blue-400">
          {analytics.eventsLast24h}
        </div>
      </div>

      <div>
        <div className="text-sm text-[rgba(255,255,255,0.42)] mb-2">Failed Operations</div>
        <div className="text-xl font-bold text-red-400">
          {analytics.failedSyncs}
        </div>
      </div>
    </div>

    {/* Sync Trends Chart (Simplified) */}
    <div className="mt-6">
      <div className="text-sm text-[rgba(255,255,255,0.42)] mb-3">7-Day Sync Activity</div>
      <div className="flex items-end justify-between h-20 bg-[rgba(255,255,255,0.05)] rounded-lg p-3">
        {analytics.syncTrends?.map((trend: any, index: number) => (
          <div
            key={index}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-4 bg-[#5EEAD4] rounded-sm"
              style={{
                height: `${Math.max((trend.successful / Math.max(...analytics.syncTrends.map((t: any) => t.successful), 1)) * 40, 2)}px`
              }}
            />
            <div className="text-xs text-[rgba(255,255,255,0.42)]">
              {trend.date.slice(-2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ── Recent Activity Panel Component ───────────────────────────────────────

interface RecentActivityPanelProps {
  events: any[]
}

const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({ events }) => (
  <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

    <div className="space-y-3 max-h-64 overflow-y-auto">
      {events.length === 0 ? (
        <div className="text-[rgba(255,255,255,0.42)] text-center py-4">
          No recent activity
        </div>
      ) : (
        events.map((event, index) => (
          <ActivityItem key={index} event={event} />
        ))
      )}
    </div>
  </div>
)

// ── Activity Item Component ───────────────────────────────────────────────

interface ActivityItemProps {
  event: any
}

const ActivityItem: React.FC<ActivityItemProps> = ({ event }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-[#5EEAD4]'
      case 'failed': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      case 'conflict': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'create': return '➕'
      case 'update': return '📝'
      case 'delete': return '🗑️'
      default: return '🔄'
    }
  }

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-[rgba(255,255,255,0.05)] rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-lg">{getTypeIcon(event.type)}</span>
        <div>
          <div className="text-sm font-medium">
            {event.entity} {event.type}
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.42)]">
            {new Date(event.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className={`text-sm font-mono ${getStatusColor(event.status)}`}>
        {event.status}
        {event.duration && (
          <span className="text-[rgba(255,255,255,0.42)] ml-2">
            {event.duration}ms
          </span>
        )}
      </div>
    </div>
  )
}

// ── Conflicts Panel Component ─────────────────────────────────────────────

interface ConflictsPanelProps {
  conflicts: any[]
  isVisible: boolean
  onToggle: () => void
  onResolve: (conflictId: string, resolution: 'foundation' | 'notion') => void
}

const ConflictsPanel: React.FC<ConflictsPanelProps> = ({
  conflicts,
  isVisible,
  onToggle,
  onResolve
}) => (
  <div className="bg-[rgba(255,255,255,0.025)] border border-red-500/30 rounded-xl p-6">
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="text-lg font-semibold text-red-400">
        Sync Conflicts ({conflicts.length})
      </h3>
      <span className="text-red-400">
        {isVisible ? '▼' : '▶'}
      </span>
    </div>

    {isVisible && (
      <div className="mt-4 space-y-4">
        {conflicts.map(conflict => (
          <ConflictItem
            key={conflict.id}
            conflict={conflict}
            onResolve={onResolve}
          />
        ))}
      </div>
    )}
  </div>
)

// ── Conflict Item Component ───────────────────────────────────────────────

interface ConflictItemProps {
  conflict: any
  onResolve: (conflictId: string, resolution: 'foundation' | 'notion') => void
}

const ConflictItem: React.FC<ConflictItemProps> = ({ conflict, onResolve }) => (
  <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="font-medium text-red-400">
          {conflict.entity} · {conflict.entityId}
        </div>
        <div className="text-sm text-[rgba(255,255,255,0.42)]">
          {new Date(conflict.timestamp).toLocaleString()}
        </div>
      </div>

      <div className="flex gap-2">
        <SyncButton
          variant="accent"
          onClick={() => onResolve(conflict.id, 'foundation')}
        >
          Foundation Wins
        </SyncButton>
        <SyncButton
          variant="secondary"
          onClick={() => onResolve(conflict.id, 'notion')}
        >
          Notion Wins
        </SyncButton>
      </div>
    </div>

    <div className="space-y-2">
      {conflict.conflicts.map((fieldConflict: any, index: number) => (
        <div key={index} className="text-sm">
          <div className="text-[rgba(255,255,255,0.42)] mb-1">
            Field: {fieldConflict.field}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#5EEAD4]">Foundation OS</div>
              <div className="bg-[rgba(94,234,212,0.1)] p-2 rounded">
                {JSON.stringify(fieldConflict.foundationValue)}
              </div>
            </div>
            <div>
              <div className="text-xs text-blue-400">Notion</div>
              <div className="bg-[rgba(59,130,246,0.1)] p-2 rounded">
                {JSON.stringify(fieldConflict.notionValue)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// ── Configuration Panel Component ─────────────────────────────────────────

interface ConfigurationPanelProps {
  config: any
  isVisible: boolean
  onToggle: () => void
  onUpdate: (config: any) => void
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  isVisible,
  onToggle,
  onUpdate
}) => {
  const [localConfig, setLocalConfig] = useState(config)

  return (
    <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold">Configuration</h3>
        <span className="text-[rgba(255,255,255,0.42)]">
          {isVisible ? '▼' : '▶'}
        </span>
      </div>

      {isVisible && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sync Interval (ms)</label>
            <input
              type="number"
              value={localConfig.syncInterval}
              onChange={(e) => setLocalConfig({...localConfig, syncInterval: Number(e.target.value)})}
              className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Conflict Resolution</label>
            <select
              value={localConfig.conflictResolution}
              onChange={(e) => setLocalConfig({...localConfig, conflictResolution: e.target.value})}
              className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg px-3 py-2"
            >
              <option value="intelligent">Intelligent</option>
              <option value="foundation_wins">Foundation Wins</option>
              <option value="notion_wins">Notion Wins</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <SyncButton
            onClick={() => onUpdate(localConfig)}
            variant="primary"
          >
            Update Configuration
          </SyncButton>
        </div>
      )}
    </div>
  )
}

// ── Error Panel Component ─────────────────────────────────────────────────

interface ErrorPanelProps {
  error: string
  onDismiss: () => void
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ error, onDismiss }) => (
  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-red-400 text-xl">❌</span>
        <div>
          <div className="font-medium text-red-400">Sync Error</div>
          <div className="text-sm text-[rgba(255,255,255,0.42)] mt-1">
            {error}
          </div>
        </div>
      </div>

      <SyncButton variant="danger" onClick={onDismiss}>
        Dismiss
      </SyncButton>
    </div>
  </div>
)

// ── Debug Panel Component ─────────────────────────────────────────────────

interface DebugPanelProps {
  onClearHistory: () => void
  analytics: any
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onClearHistory, analytics }) => (
  <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-4">Debug & Maintenance</h3>

    <div className="flex flex-wrap gap-3">
      <SyncButton
        variant="danger"
        onClick={onClearHistory}
      >
        Clear Sync History
      </SyncButton>

      <div className="text-sm text-[rgba(255,255,255,0.42)] self-center">
        Total events: {analytics.totalEvents}
      </div>
    </div>
  </div>
)

export default NotionSyncDashboard