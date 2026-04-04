/**
 * NotionSyncPage.tsx — Foundation OS Phase 5 "Connected"
 * Demo interface for Notion bidirectional sync testing
 */

import React, { useState, useEffect } from 'react'
import { useNotionSync } from '../hooks/useNotionSync'
import NotionSyncDashboard from '../components/NotionSyncDashboard'
import { useCommanderMutations } from '../lib/mutations'

// ── Main Page Component ───────────────────────────────────────────────────

export const NotionSyncPage: React.FC = () => {
  const {
    status,
    isLoading,
    startSync,
    stopSync,
    forceSyncAll,
    setupNotionDatabases
  } = useNotionSync()

  const mutations = useCommanderMutations()
  const [demoData, setDemoData] = useState<any>({})
  const [testResults, setTestResults] = useState<any[]>([])

  // Load demo data on mount
  useEffect(() => {
    loadDemoData()
  }, [])

  const loadDemoData = async () => {
    try {
      const data = await mutations.getAllData()
      setDemoData(data)
    } catch (error) {
      console.error('Failed to load demo data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#06070C]">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5EEAD4] mb-3">
            🔄 Notion Sync Demo
          </h1>
          <p className="text-[rgba(255,255,255,0.42)] text-lg">
            Test bidirectional synchronization between Foundation OS and Notion
          </p>
        </div>

        {/* Demo Controls */}
        <DemoControls
          status={status}
          isLoading={isLoading}
          onStartSync={startSync}
          onStopSync={stopSync}
          onSetupDatabases={setupNotionDatabases}
          onRunTests={() => runSyncTests()}
        />

        {/* Live Data Preview */}
        <LiveDataPreview
          demoData={demoData}
          onRefresh={loadDemoData}
          onCreateTestData={() => createTestData()}
        />

        {/* Test Results */}
        <TestResults
          results={testResults}
          onClear={() => setTestResults([])}
        />

        {/* Main Sync Dashboard */}
        <div className="mt-8">
          <NotionSyncDashboard />
        </div>
      </div>
    </div>
  )

  // ── Demo Test Functions ─────────────────────────────────────────────────

  async function runSyncTests() {
    setTestResults([])
    const results: any[] = []

    try {
      // Test 1: Start sync engine
      results.push(await runTest(
        'Start Sync Engine',
        async () => {
          await startSync()
          return status.isRunning
        }
      ))

      // Test 2: Create test session
      results.push(await runTest(
        'Create Test Session',
        async () => {
          const result = await mutations.createSession({
            title: 'Notion Sync Test Session',
            date: new Date().toISOString().split('T')[0],
            items: 'Testing bidirectional sync',
            phase: '05'
          })
          return result.success
        }
      ))

      // Test 3: Force sync to Notion
      results.push(await runTest(
        'Force Sync to Notion',
        async () => {
          await forceSyncAll()
          return true
        }
      ))

      // Test 4: Create test decision
      results.push(await runTest(
        'Create Test Decision',
        async () => {
          const result = await mutations.createDecision({
            title: 'Test Notion Sync Decision',
            context: 'Testing conflict resolution and data transformation',
            impact: 'high'
          })
          return result.success
        }
      ))

      // Test 5: Performance test
      results.push(await runTest(
        'Performance Test (100 operations)',
        async () => {
          const startTime = Date.now()

          // Create multiple operations
          const promises = Array.from({ length: 20 }, (_, i) =>
            mutations.createNextStep({
              label: `Test Step ${i + 1}`,
              phase: '05',
              priority: 'medium'
            })
          )

          await Promise.all(promises)
          const duration = Date.now() - startTime

          return duration < 5000 // < 5s per Phase 5 requirements
        }
      ))

      setTestResults(results)
    } catch (error) {
      console.error('Test suite failed:', error)
    }
  }

  async function runTest(name: string, testFn: () => Promise<boolean>) {
    const startTime = Date.now()
    try {
      const success = await testFn()
      const duration = Date.now() - startTime
      return {
        name,
        success,
        duration,
        timestamp: new Date().toISOString()
      }
    } catch (error: any) {
      const duration = Date.now() - startTime
      return {
        name,
        success: false,
        error: error.message,
        duration,
        timestamp: new Date().toISOString()
      }
    }
  }

  async function createTestData() {
    try {
      // Create diverse test data for sync testing
      await Promise.all([
        mutations.createSession({
          title: 'Phase 5 Connected Demo',
          date: '2026-04-04',
          items: 'Notion sync, real-time updates, conflict resolution',
          decisions: 'Implement bidirectional sync with intelligent conflict resolution',
          phase: '05',
          status: 'active'
        }),

        mutations.createDecision({
          title: 'ADR-001: Notion Sync Architecture',
          context: 'Need bidirectional sync between Foundation OS and Notion for Phase 5',
          impact: 'high',
          status: 'active'
        }),

        mutations.addRisk({
          risk: 'Sync conflicts during concurrent editing',
          impact: 'medium',
          proba: 'medium',
          mitigation: 'Implement intelligent conflict resolution with ML algorithms',
          status: 'open'
        }),

        mutations.createNextStep({
          label: 'Implement webhook listeners for real-time sync',
          phase: '05',
          priority: 'high',
          status: 'todo'
        }),

        mutations.createNextStep({
          label: 'Set up Notion workspace and databases',
          phase: '05',
          priority: 'critical',
          status: 'in_progress'
        })
      ])

      await loadDemoData()
      console.log('✅ Test data created successfully')
    } catch (error) {
      console.error('❌ Failed to create test data:', error)
    }
  }
}

// ── Navigation Header Component ───────────────────────────────────────────

const NavigationHeader: React.FC = () => (
  <div className="bg-[rgba(255,255,255,0.025)] border-b border-[rgba(255,255,255,0.055)]">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-[#5EEAD4] hover:text-white transition-colors font-semibold"
          >
            ← Foundation OS
          </a>
          <span className="text-[rgba(255,255,255,0.42)]">|</span>
          <span className="text-white font-medium">Notion Sync Demo</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <a
            href="/commander"
            className="text-[rgba(255,255,255,0.42)] hover:text-white transition-colors"
          >
            Commander
          </a>
          <a
            href="/sync"
            className="text-[rgba(255,255,255,0.42)] hover:text-white transition-colors"
          >
            Sync Status
          </a>
          <a
            href="/graph"
            className="text-[rgba(255,255,255,0.42)] hover:text-white transition-colors"
          >
            Knowledge Graph
          </a>
        </div>
      </nav>
    </div>
  </div>
)

// ── Demo Controls Component ───────────────────────────────────────────────

interface DemoControlsProps {
  status: any
  isLoading: boolean
  onStartSync: () => void
  onStopSync: () => void
  onSetupDatabases: () => void
  onRunTests: () => void
}

const DemoControls: React.FC<DemoControlsProps> = ({
  status,
  isLoading,
  onStartSync,
  onStopSync,
  onSetupDatabases,
  onRunTests
}) => (
  <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6 mb-8">
    <h3 className="text-xl font-semibold text-white mb-4">Demo Controls</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DemoButton
        onClick={status.isRunning ? onStopSync : onStartSync}
        disabled={isLoading}
        variant={status.isRunning ? "danger" : "primary"}
        icon={status.isRunning ? "⏹️" : "▶️"}
      >
        {status.isRunning ? "Stop Sync" : "Start Sync"}
      </DemoButton>

      <DemoButton
        onClick={onSetupDatabases}
        disabled={isLoading}
        variant="accent"
        icon="🏗️"
      >
        Setup Notion DBs
      </DemoButton>

      <DemoButton
        onClick={onRunTests}
        disabled={isLoading || !status.isRunning}
        variant="secondary"
        icon="🧪"
      >
        Run Test Suite
      </DemoButton>

      <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.05)] rounded-lg">
        <div className={`w-3 h-3 rounded-full ${
          status.isRunning ? 'bg-[#5EEAD4]' : 'bg-gray-500'
        }`} />
        <span className="text-sm font-mono text-white">
          {status.isRunning ? 'Active' : 'Stopped'}
        </span>
      </div>
    </div>

    {status.isRunning && (
      <div className="mt-4 p-4 bg-[rgba(94,234,212,0.1)] rounded-lg">
        <div className="flex items-center gap-2 text-[#5EEAD4] text-sm">
          <span>🔄</span>
          <span>Sync active • Queue: {status.queueSize} • Mappings: {status.mappingCount}</span>
        </div>
      </div>
    )}
  </div>
)

// ── Demo Button Component ─────────────────────────────────────────────────

interface DemoButtonProps {
  onClick: () => void
  disabled?: boolean
  variant?: "primary" | "secondary" | "danger" | "accent"
  icon?: string
  children: React.ReactNode
}

const DemoButton: React.FC<DemoButtonProps> = ({
  onClick,
  disabled = false,
  variant = "primary",
  icon,
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
        flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors
        ${getVariantClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

// ── Live Data Preview Component ───────────────────────────────────────────

interface LiveDataPreviewProps {
  demoData: any
  onRefresh: () => void
  onCreateTestData: () => void
}

const LiveDataPreview: React.FC<LiveDataPreviewProps> = ({
  demoData,
  onRefresh,
  onCreateTestData
}) => (
  <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-white">Live Foundation OS Data</h3>
      <div className="flex gap-3">
        <DemoButton
          onClick={onCreateTestData}
          variant="accent"
          icon="🎲"
        >
          Create Test Data
        </DemoButton>
        <DemoButton
          onClick={onRefresh}
          variant="secondary"
          icon="🔄"
        >
          Refresh
        </DemoButton>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <DataCard
        title="Sessions"
        count={demoData.sessions?.length || 0}
        items={demoData.sessions?.slice(0, 3) || []}
        color="blue"
      />
      <DataCard
        title="Decisions"
        count={demoData.decisions?.length || 0}
        items={demoData.decisions?.slice(0, 3) || []}
        color="green"
      />
      <DataCard
        title="Risks"
        count={demoData.risks?.length || 0}
        items={demoData.risks?.slice(0, 3) || []}
        color="red"
      />
      <DataCard
        title="Next Steps"
        count={demoData.nextSteps?.length || 0}
        items={demoData.nextSteps?.slice(0, 3) || []}
        color="orange"
      />
      <DataCard
        title="Context"
        count={demoData.context?.length || 0}
        items={demoData.context?.slice(0, 3) || []}
        color="purple"
      />
    </div>
  </div>
)

// ── Data Card Component ───────────────────────────────────────────────────

interface DataCardProps {
  title: string
  count: number
  items: any[]
  color: "blue" | "green" | "red" | "orange" | "purple"
}

const DataCard: React.FC<DataCardProps> = ({ title, count, items, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue": return "border-blue-500/30 text-blue-400"
      case "green": return "border-[#5EEAD4]/30 text-[#5EEAD4]"
      case "red": return "border-red-500/30 text-red-400"
      case "orange": return "border-orange-500/30 text-orange-400"
      case "purple": return "border-purple-500/30 text-purple-400"
    }
  }

  return (
    <div className={`bg-[rgba(255,255,255,0.05)] border rounded-xl p-4 ${getColorClasses()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-[rgba(255,255,255,0.42)]">{title}</div>
        <div className="text-lg font-bold">{count}</div>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-xs text-[rgba(255,255,255,0.42)] italic">
            No items yet
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="text-xs truncate">
              {item.title || item.label || item.risk || item.fichier || 'Untitled'}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ── Test Results Component ────────────────────────────────────────────────

interface TestResultsProps {
  results: any[]
  onClear: () => void
}

const TestResults: React.FC<TestResultsProps> = ({ results, onClear }) => {
  if (results.length === 0) return null

  const successCount = results.filter(r => r.success).length
  const totalCount = results.length

  return (
    <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">
          Test Results ({successCount}/{totalCount} passed)
        </h3>
        <DemoButton onClick={onClear} variant="secondary" icon="🗑️">
          Clear
        </DemoButton>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <TestResultItem key={index} result={result} />
        ))}
      </div>
    </div>
  )
}

// ── Test Result Item Component ────────────────────────────────────────────

interface TestResultItemProps {
  result: any
}

const TestResultItem: React.FC<TestResultItemProps> = ({ result }) => (
  <div className={`
    flex items-center justify-between p-4 rounded-lg
    ${result.success
      ? 'bg-green-500/10 border border-green-500/30'
      : 'bg-red-500/10 border border-red-500/30'
    }
  `}>
    <div className="flex items-center gap-3">
      <span className="text-xl">
        {result.success ? '✅' : '❌'}
      </span>
      <div>
        <div className={`font-medium ${
          result.success ? 'text-green-400' : 'text-red-400'
        }`}>
          {result.name}
        </div>
        {result.error && (
          <div className="text-sm text-red-300 mt-1">
            {result.error}
          </div>
        )}
      </div>
    </div>

    <div className="text-sm text-[rgba(255,255,255,0.42)]">
      {result.duration}ms
    </div>
  </div>
)

export default NotionSyncPage