/**
 * useAsanaAutomation.ts — Foundation OS Phase 5 "Connected"
 * React Hook for Asana Automation Engine integration
 * Provides real-time status, controls, and workflow management
 */

import { useState, useEffect, useCallback } from 'react'
import { asanaAutomationEngine, defaultAsanaAutomationConfig } from '../lib/asana-automation'

// ── Type Definitions ─────────────────────────────────────────────────────

interface AsanaAutomationStatus {
  isRunning: boolean
  activeWorkflows: number
  eventQueueSize: number
  mappingCount: number
  lastActivity: string
}

interface AutomationWorkflow {
  id: string
  name: string
  trigger: string
  enabled: boolean
  successRate: number
  avgLatency: number
}

interface AutomationEvent {
  id: string
  timestamp: string
  workflowId: string
  sourceEntity: string
  sourceEntityId: string
  targetType: string
  status: string
  latency?: number
  error?: string
}

interface UseAsanaAutomationReturn {
  // Status
  status: AsanaAutomationStatus | null
  isLoading: boolean
  error: string | null

  // Workflows
  workflows: AutomationWorkflow[]
  recentEvents: AutomationEvent[]

  // Controls
  startAutomation: () => Promise<void>
  stopAutomation: () => Promise<void>
  triggerWorkflow: (workflowId: string, sourceEntityId: string) => Promise<void>
  toggleWorkflow: (workflowId: string, enabled: boolean) => void

  // Testing
  runTestSuite: () => Promise<TestResults>
  createTestData: () => Promise<void>

  // Configuration
  updateConfig: (config: Partial<typeof defaultAsanaAutomationConfig>) => void
}

interface TestResults {
  passed: number
  failed: number
  total: number
  results: Array<{
    name: string
    passed: boolean
    duration: number
    error?: string
  }>
}

// ── Main Hook Implementation ─────────────────────────────────────────────────

export function useAsanaAutomation(): UseAsanaAutomationReturn {
  // ── State Management ──────────────────────────────────────────────────────

  const [status, setStatus] = useState<AsanaAutomationStatus | null>(null)
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [recentEvents, setRecentEvents] = useState<AutomationEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Status Monitoring ─────────────────────────────────────────────────────

  const updateStatus = useCallback(() => {
    try {
      const engineStatus = asanaAutomationEngine.getStatus()
      setStatus(engineStatus)

      const engineWorkflows = asanaAutomationEngine.getWorkflows()
      setWorkflows(engineWorkflows)

      const engineEvents = asanaAutomationEngine.getRecentEvents(20)
      setRecentEvents(engineEvents)

      setError(null)
    } catch (err) {
      setError(`Failed to get automation status: ${err}`)
    }
  }, [])

  useEffect(() => {
    // Initial status update
    updateStatus()

    // Set up periodic updates
    const interval = setInterval(updateStatus, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [updateStatus])

  // ── Control Methods ───────────────────────────────────────────────────────

  const startAutomation = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await asanaAutomationEngine.start()
      updateStatus()
    } catch (err) {
      setError(`Failed to start automation: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }, [updateStatus])

  const stopAutomation = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await asanaAutomationEngine.stop()
      updateStatus()
    } catch (err) {
      setError(`Failed to stop automation: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }, [updateStatus])

  const triggerWorkflow = useCallback(async (workflowId: string, sourceEntityId: string) => {
    setError(null)

    try {
      await asanaAutomationEngine.triggerWorkflow(workflowId, sourceEntityId)
      updateStatus()
    } catch (err) {
      setError(`Failed to trigger workflow: ${err}`)
    }
  }, [updateStatus])

  const toggleWorkflow = useCallback((workflowId: string, enabled: boolean) => {
    try {
      asanaAutomationEngine.toggleWorkflow(workflowId, enabled)
      updateStatus()
    } catch (err) {
      setError(`Failed to toggle workflow: ${err}`)
    }
  }, [updateStatus])

  // ── Testing Methods ───────────────────────────────────────────────────────

  const runTestSuite = useCallback(async (): Promise<TestResults> => {
    setIsLoading(true)
    setError(null)

    const testResults: TestResults = {
      passed: 0,
      failed: 0,
      total: 0,
      results: []
    }

    const tests = [
      {
        name: 'Engine Start/Stop',
        test: async () => {
          await asanaAutomationEngine.start()
          await asanaAutomationEngine.stop()
        }
      },
      {
        name: 'Status Monitoring',
        test: async () => {
          const status = asanaAutomationEngine.getStatus()
          if (!status || typeof status.isRunning !== 'boolean') {
            throw new Error('Invalid status format')
          }
        }
      },
      {
        name: 'Workflow Management',
        test: async () => {
          const workflows = asanaAutomationEngine.getWorkflows()
          if (!Array.isArray(workflows) || workflows.length === 0) {
            throw new Error('No workflows found')
          }
        }
      },
      {
        name: 'Event Queue',
        test: async () => {
          const events = asanaAutomationEngine.getRecentEvents(5)
          if (!Array.isArray(events)) {
            throw new Error('Invalid events format')
          }
        }
      },
      {
        name: 'Workflow Trigger',
        test: async () => {
          // Test with mock data
          await asanaAutomationEngine.triggerWorkflow('session-to-project', 'test-session-1')
        }
      }
    ]

    for (const test of tests) {
      const startTime = Date.now()
      testResults.total++

      try {
        await test.test()
        testResults.passed++
        testResults.results.push({
          name: test.name,
          passed: true,
          duration: Date.now() - startTime
        })
      } catch (error) {
        testResults.failed++
        testResults.results.push({
          name: test.name,
          passed: false,
          duration: Date.now() - startTime,
          error: String(error)
        })
      }
    }

    setIsLoading(false)
    updateStatus()

    return testResults
  }, [updateStatus])

  const createTestData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create test session
      const testSession = {
        id: `test-session-${Date.now()}`,
        title: 'Test Automation Session',
        phase: '03',
        date: new Date().toISOString().split('T')[0],
        status: 'active',
        items: 'Testing Asana automation workflows',
        decisions: 'Implement automation engine'
      }

      // Create test decision
      const testDecision = {
        id: `test-decision-${Date.now()}`,
        title: 'Test ADR Decision',
        context: 'Testing automation ADR creation',
        impact: 'high',
        status: 'active',
        date: new Date().toISOString().split('T')[0]
      }

      // Create test risk
      const testRisk = {
        id: `test-risk-${Date.now()}`,
        risk: 'Test Risk Management',
        impact: 'medium',
        proba: 'low',
        mitigation: 'Automated monitoring and alerts',
        status: 'open'
      }

      // Create test next step
      const testNextStep = {
        id: `test-step-${Date.now()}`,
        label: 'Test Task Creation',
        phase: '04',
        priority: 'high',
        status: 'todo',
        sort_order: 1
      }

      // Trigger automation workflows for each test entity
      if (status?.isRunning) {
        await triggerWorkflow('session-to-project', testSession.id)
        await triggerWorkflow('decision-to-milestone', testDecision.id)
        await triggerWorkflow('risk-to-issue', testRisk.id)
        await triggerWorkflow('step-to-task', testNextStep.id)
      }

      console.log('✅ Test data created and automation triggered')
    } catch (err) {
      setError(`Failed to create test data: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }, [status?.isRunning, triggerWorkflow])

  // ── Configuration Management ──────────────────────────────────────────────

  const updateConfig = useCallback((newConfig: Partial<typeof defaultAsanaAutomationConfig>) => {
    try {
      // In a full implementation, this would update the engine configuration
      // For now, we'll just log the update
      console.log('🔧 Configuration update requested:', newConfig)

      // Update configuration would be applied here
      // asanaAutomationEngine.updateConfig(newConfig)

      updateStatus()
    } catch (err) {
      setError(`Failed to update configuration: ${err}`)
    }
  }, [updateStatus])

  // ── Return Hook Interface ─────────────────────────────────────────────────

  return {
    // Status
    status,
    isLoading,
    error,

    // Data
    workflows,
    recentEvents,

    // Controls
    startAutomation,
    stopAutomation,
    triggerWorkflow,
    toggleWorkflow,

    // Testing
    runTestSuite,
    createTestData,

    // Configuration
    updateConfig
  }
}

// ── Utility Functions ─────────────────────────────────────────────────────────

export function formatLatency(latency: number): string {
  if (latency < 1000) {
    return `${Math.round(latency)}ms`
  } else if (latency < 10000) {
    return `${(latency / 1000).toFixed(1)}s`
  } else {
    return `${Math.round(latency / 1000)}s`
  }
}

export function formatSuccessRate(rate: number): string {
  return `${Math.round(rate * 100)}%`
}

export function getWorkflowStatusColor(workflow: AutomationWorkflow): string {
  if (!workflow.enabled) return '#6B7280' // Gray
  if (workflow.successRate >= 0.95) return '#10B981' // Green
  if (workflow.successRate >= 0.85) return '#F59E0B' // Orange
  return '#EF4444' // Red
}

export function getEventStatusColor(event: AutomationEvent): string {
  switch (event.status) {
    case 'completed': return '#10B981' // Green
    case 'processing': return '#3B82F6' // Blue
    case 'failed': return '#EF4444' // Red
    default: return '#6B7280' // Gray
  }
}

// ── Export Hook ───────────────────────────────────────────────────────────────

export default useAsanaAutomation