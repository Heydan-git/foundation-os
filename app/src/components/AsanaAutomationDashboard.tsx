/**
 * AsanaAutomationDashboard.tsx — Foundation OS Phase 5 "Connected"
 * Asana Automation Engine Dashboard with Void Glass design
 * Real-time monitoring, controls, and workflow management
 */

import React, { useState } from 'react'
import useAsanaAutomation, { formatLatency, formatSuccessRate, getWorkflowStatusColor, getEventStatusColor } from '../hooks/useAsanaAutomation'

// ── Main Dashboard Component ─────────────────────────────────────────────────

const AsanaAutomationDashboard: React.FC = () => {
  const {
    status,
    isLoading,
    error,
    workflows,
    recentEvents,
    startAutomation,
    stopAutomation,
    triggerWorkflow,
    toggleWorkflow,
    runTestSuite,
    createTestData
  } = useAsanaAutomation()

  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflows' | 'events' | 'config'>('dashboard')
  const [testResults, setTestResults] = useState<any>(null)

  // ── Event Handlers ────────────────────────────────────────────────────────

  const handleRunTests = async () => {
    const results = await runTestSuite()
    setTestResults(results)
  }

  const handleTriggerWorkflow = async (workflowId: string) => {
    await triggerWorkflow(workflowId, `manual-trigger-${Date.now()}`)
  }

  const getStatusIndicator = (isRunning: boolean) => {
    return isRunning ? (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-fos-accent rounded-full animate-pulse"></div>
        <span className="text-fos-text text-sm">Running</span>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-fos-muted rounded-full"></div>
        <span className="text-fos-muted text-sm">Stopped</span>
      </div>
    )
  }

  // ── Dashboard Tab ─────────────────────────────────────────────────────────

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-fos-card-bg border border-fos-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-fos-muted text-sm">Engine Status</span>
            {status && getStatusIndicator(status.isRunning)}
          </div>
          <div className="text-2xl font-bold text-fos-text">
            {status?.isRunning ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="bg-fos-card-bg border border-fos-border rounded-xl p-4">
          <div className="text-fos-muted text-sm mb-2">Active Workflows</div>
          <div className="text-2xl font-bold text-fos-accent">
            {status?.activeWorkflows || 0}
          </div>
          <div className="text-xs text-fos-muted mt-1">
            {workflows.filter(w => w.enabled).length} enabled
          </div>
        </div>

        <div className="bg-fos-card-bg border border-fos-border rounded-xl p-4">
          <div className="text-fos-muted text-sm mb-2">Event Queue</div>
          <div className="text-2xl font-bold text-fos-text">
            {status?.eventQueueSize || 0}
          </div>
          <div className="text-xs text-fos-muted mt-1">pending tasks</div>
        </div>

        <div className="bg-fos-card-bg border border-fos-border rounded-xl p-4">
          <div className="text-fos-muted text-sm mb-2">Mappings</div>
          <div className="text-2xl font-bold text-fos-text">
            {status?.mappingCount || 0}
          </div>
          <div className="text-xs text-fos-muted mt-1">synchronized</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-fos-card-bg border border-fos-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-fos-text mb-4">Engine Controls</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={startAutomation}
            disabled={isLoading || status?.isRunning}
            className="px-4 py-2 bg-fos-accent text-fos-bg font-medium rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isLoading ? 'Starting...' : 'Start Engine'}
          </button>

          <button
            onClick={stopAutomation}
            disabled={isLoading || !status?.isRunning}
            className="px-4 py-2 bg-fos-muted/20 text-fos-text font-medium rounded-lg hover:bg-fos-muted/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-fos-border"
          >
            {isLoading ? 'Stopping...' : 'Stop Engine'}
          </button>

          <button
            onClick={createTestData}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600/20 text-blue-400 font-medium rounded-lg hover:bg-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-blue-600/20"
          >
            Create Test Data
          </button>

          <button
            onClick={handleRunTests}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600/20 text-purple-400 font-medium rounded-lg hover:bg-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-purple-600/20"
          >
            Run Test Suite
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="bg-fos-card-bg border border-fos-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-fos-text mb-4">Test Results</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{testResults.passed}</div>
              <div className="text-xs text-fos-muted">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{testResults.failed}</div>
              <div className="text-xs text-fos-muted">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-fos-accent">{testResults.total}</div>
              <div className="text-xs text-fos-muted">Total</div>
            </div>
          </div>
          <div className="space-y-2">
            {testResults.results.map((result: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-fos-bg/50 rounded-lg border border-fos-border"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${result.passed ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-fos-text text-sm">{result.name}</span>
                </div>
                <div className="text-xs text-fos-muted">
                  {result.duration}ms {result.error && `(${result.error})`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-fos-card-bg border border-fos-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-fos-text mb-4">Recent Activity</h3>
        {recentEvents.length > 0 ? (
          <div className="space-y-3">
            {recentEvents.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-fos-bg/50 rounded-lg border border-fos-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getEventStatusColor(event) }}
                  ></div>
                  <div>
                    <div className="text-fos-text text-sm">
                      {event.workflowId.replace('-', ' → ').replace(/([a-z])([A-Z])/g, '$1 $2')}
                    </div>
                    <div className="text-fos-muted text-xs">
                      {event.sourceEntity} {event.sourceEntityId}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-fos-muted text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                  {event.latency && (
                    <div className="text-fos-muted text-xs">
                      {formatLatency(event.latency)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-fos-muted">
            No recent activity
          </div>
        )}
      </div>
    </div>
  )

  // ── Workflows Tab ─────────────────────────────────────────────────────────

  const WorkflowsTab = () => (
    <div className="space-y-6">
      <div className="bg-fos-card-bg border border-fos-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-fos-text mb-4">Automation Workflows</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fos-border">
                <th className="text-left py-3 text-fos-muted text-sm">Workflow</th>
                <th className="text-left py-3 text-fos-muted text-sm">Status</th>
                <th className="text-left py-3 text-fos-muted text-sm">Success Rate</th>
                <th className="text-left py-3 text-fos-muted text-sm">Avg Latency</th>
                <th className="text-left py-3 text-fos-muted text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((workflow) => (
                <tr key={workflow.id} className="border-b border-fos-border/50">
                  <td className="py-4">
                    <div>
                      <div className="text-fos-text text-sm font-medium">{workflow.name}</div>
                      <div className="text-fos-muted text-xs">{workflow.trigger}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getWorkflowStatusColor(workflow) }}
                      ></div>
                      <span className="text-fos-text text-sm">
                        {workflow.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-fos-text text-sm">{formatSuccessRate(workflow.successRate)}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-fos-text text-sm">{formatLatency(workflow.avgLatency)}</div>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleWorkflow(workflow.id, !workflow.enabled)}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                          workflow.enabled
                            ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                            : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                        }`}
                      >
                        {workflow.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleTriggerWorkflow(workflow.id)}
                        disabled={!workflow.enabled}
                        className="px-3 py-1 text-xs rounded-md font-medium bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Test
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // ── Events Tab ────────────────────────────────────────────────────────────

  const EventsTab = () => (
    <div className="space-y-6">
      <div className="bg-fos-card-bg border border-fos-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-fos-text mb-4">Automation Events</h3>
        {recentEvents.length > 0 ? (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-fos-bg/50 rounded-lg border border-fos-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: getEventStatusColor(event) }}
                    ></div>
                    <div>
                      <div className="text-fos-text text-sm font-medium">
                        {event.workflowId.replace('-', ' → ').replace(/([a-z])([A-Z])/g, '$1 $2')}
                      </div>
                      <div className="text-fos-muted text-xs">
                        {event.sourceEntity} → {event.targetType}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-fos-muted text-xs">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                    <div className="text-fos-muted text-xs">
                      {event.status}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                  <div>
                    <span className="text-fos-muted">Source ID:</span>
                    <span className="text-fos-text ml-2">{event.sourceEntityId}</span>
                  </div>
                  {event.latency && (
                    <div>
                      <span className="text-fos-muted">Latency:</span>
                      <span className="text-fos-text ml-2">{formatLatency(event.latency)}</span>
                    </div>
                  )}
                </div>
                {event.error && (
                  <div className="mt-2 p-2 bg-red-600/10 border border-red-600/20 rounded text-xs text-red-400">
                    {event.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-fos-muted">
            No automation events yet
          </div>
        )}
      </div>
    </div>
  )

  // ── Config Tab ────────────────────────────────────────────────────────────

  const ConfigTab = () => (
    <div className="space-y-6">
      <div className="bg-fos-card-bg border border-fos-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-fos-text mb-4">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-fos-text mb-2">
              Workspace ID
            </label>
            <input
              type="text"
              defaultValue="foundation-os-workspace"
              className="w-full p-3 bg-fos-bg border border-fos-border rounded-lg text-fos-text focus:outline-none focus:ring-2 focus:ring-fos-accent/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fos-text mb-2">
              Sync Interval (ms)
            </label>
            <input
              type="number"
              defaultValue="15000"
              className="w-full p-3 bg-fos-bg border border-fos-border rounded-lg text-fos-text focus:outline-none focus:ring-2 focus:ring-fos-accent/50"
            />
          </div>
        </div>
        <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
          <div className="text-yellow-400 text-sm font-medium mb-1">Configuration Note</div>
          <div className="text-yellow-300 text-xs">
            Configuration changes will be applied in the next version. Currently in development mode.
          </div>
        </div>
      </div>
    </div>
  )

  // ── Main Render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-fos-bg p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fos-text">Asana Automation Engine</h1>
            <p className="text-fos-muted mt-2">
              Foundation OS Phase 5 "Connected" — Intelligent task management automation
            </p>
          </div>
          {status && (
            <div className="text-right">
              <div className="text-fos-muted text-sm">Last Activity</div>
              <div className="text-fos-text text-sm">
                {new Date(status.lastActivity).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-4">
            <div className="text-red-400 text-sm font-medium">Error</div>
            <div className="text-red-300 text-sm mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <nav className="flex space-x-1 bg-fos-card-bg border border-fos-border rounded-xl p-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'workflows', label: 'Workflows', icon: '🔄' },
            { id: 'events', label: 'Events', icon: '📋' },
            { id: 'config', label: 'Config', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-fos-accent text-fos-bg'
                  : 'text-fos-muted hover:text-fos-text hover:bg-fos-bg/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'workflows' && <WorkflowsTab />}
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'config' && <ConfigTab />}
      </div>
    </div>
  )
}

export default AsanaAutomationDashboard