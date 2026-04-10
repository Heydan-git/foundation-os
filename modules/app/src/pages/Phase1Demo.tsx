/**
 * Phase1Demo.tsx - Complete CRUD validation for Phase 1
 * Demonstrates real Supabase operations with validation
 */
import React, { useState, useEffect } from 'react'
import { useCommanderMutations } from '../lib/mutations'
import { supabase } from '../lib/supabase'

interface TestResult {
  operation: string
  status: 'success' | 'error' | 'pending'
  message: string
  data?: any
}

const Phase1Demo: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')

  const mutations = useCommanderMutations()

  // Test database connection
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const { error } = await supabase.from('sessions').select('count', { count: 'exact', head: true })
      if (error) throw error
      setDbConnectionStatus('connected')
    } catch (error) {
      console.error('DB Connection error:', error)
      setDbConnectionStatus('error')
    }
  }

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, { ...result, timestamp: Date.now() }])
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    // 1. CREATE Operations
    await testCreateSession()
    await testCreateDecision()
    await testCreateNextStep()
    await testCreateRisk()

    // 2. READ Operations
    await testReadData()

    // 3. UPDATE Operations
    await testUpdateDecision()
    await testMarkStepDone()

    // 4. DELETE Operations
    await testDeleteSession()

    setIsRunning(false)
  }

  const testCreateSession = async () => {
    addTestResult({ operation: 'CREATE Session', status: 'pending', message: 'Creating test session...' })

    try {
      const result = await mutations.createSession({
        title: 'TEST - Phase 1 Validation',
        items: 'CRUD operations testing',
        decisions: 'Validate 100% write capability',
        phase: '01'
      })

      if (result.success) {
        addTestResult({
          operation: 'CREATE Session',
          status: 'success',
          message: `Session created with ID: ${result.data?.id}`,
          data: result.data
        })
      } else {
        addTestResult({
          operation: 'CREATE Session',
          status: 'error',
          message: result.error || 'Unknown error'
        })
      }
    } catch (error: any) {
      addTestResult({
        operation: 'CREATE Session',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const testCreateDecision = async () => {
    addTestResult({ operation: 'CREATE Decision', status: 'pending', message: 'Creating test decision...' })

    try {
      const result = await mutations.createDecision({
        title: 'TEST - CRUD Validation Complete',
        context: 'Phase 1 write capability at 100%',
        impact: 'high',
        status: 'active'
      })

      if (result.success) {
        addTestResult({
          operation: 'CREATE Decision',
          status: 'success',
          message: `Decision created with ID: ${result.data?.id}`,
          data: result.data
        })
      } else {
        addTestResult({
          operation: 'CREATE Decision',
          status: 'error',
          message: result.error || 'Unknown error'
        })
      }
    } catch (error: any) {
      addTestResult({
        operation: 'CREATE Decision',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const testCreateNextStep = async () => {
    addTestResult({ operation: 'CREATE Next Step', status: 'pending', message: 'Creating test step...' })

    try {
      const result = await mutations.createNextStep({
        label: 'TEST - Validate Phase 1 CRUD',
        phase: '01',
        priority: 'critical',
        status: 'todo'
      })

      if (result.success) {
        addTestResult({
          operation: 'CREATE Next Step',
          status: 'success',
          message: `Next step created with ID: ${result.data?.id}`,
          data: result.data
        })
      } else {
        addTestResult({
          operation: 'CREATE Next Step',
          status: 'error',
          message: result.error || 'Unknown error'
        })
      }
    } catch (error: any) {
      addTestResult({
        operation: 'CREATE Next Step',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const testCreateRisk = async () => {
    addTestResult({ operation: 'CREATE Risk', status: 'pending', message: 'Creating test risk...' })

    try {
      const result = await mutations.addRisk({
        risk: 'TEST - CRUD operations failing',
        impact: 'high',
        proba: 'low',
        mitigation: 'Comprehensive validation testing',
        status: 'open'
      })

      if (result.success) {
        addTestResult({
          operation: 'CREATE Risk',
          status: 'success',
          message: `Risk created with ID: ${result.data?.id}`,
          data: result.data
        })
      } else {
        addTestResult({
          operation: 'CREATE Risk',
          status: 'error',
          message: result.error || 'Unknown error'
        })
      }
    } catch (error: any) {
      addTestResult({
        operation: 'CREATE Risk',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const testReadData = async () => {
    addTestResult({ operation: 'READ All Data', status: 'pending', message: 'Fetching all data...' })

    try {
      const result = await mutations.getAllData()

      const counts = {
        sessions: result.sessions.length,
        decisions: result.decisions.length,
        risks: result.risks.length,
        nextSteps: result.nextSteps.length,
        context: result.context.length
      }

      addTestResult({
        operation: 'READ All Data',
        status: 'success',
        message: `Data fetched - Sessions: ${counts.sessions}, Decisions: ${counts.decisions}, Risks: ${counts.risks}, Steps: ${counts.nextSteps}, Context: ${counts.context}`,
        data: counts
      })
    } catch (error: any) {
      addTestResult({
        operation: 'READ All Data',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const testUpdateDecision = async () => {
    addTestResult({ operation: 'UPDATE Decision', status: 'pending', message: 'Finding and updating decision...' })

    try {
      // First get a decision to update
      const { data: decisions } = await supabase.from('decisions').select('*').limit(1)

      if (!decisions || decisions.length === 0) {
        addTestResult({
          operation: 'UPDATE Decision',
          status: 'error',
          message: 'No decisions found to update'
        })
        return
      }

      const decision = decisions[0] as any
      const result = await mutations.updateDecision(decision.id, {
        title: decision.title + ' (UPDATED)',
        impact: 'medium'
      })

      if (result.success) {
        addTestResult({
          operation: 'UPDATE Decision',
          status: 'success',
          message: `Decision ${decision.id} updated successfully`,
          data: result.data
        })
      } else {
        addTestResult({
          operation: 'UPDATE Decision',
          status: 'error',
          message: result.error || 'Unknown error'
        })
      }
    } catch (error: any) {
      addTestResult({
        operation: 'UPDATE Decision',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const testMarkStepDone = async () => {
    addTestResult({ operation: 'UPDATE Step Status', status: 'pending', message: 'Finding and marking step done...' })

    try {
      // First get a step to update
      const { data: steps } = await supabase.from('next_steps').select('*').eq('status', 'todo').limit(1)

      if (!steps || steps.length === 0) {
        addTestResult({
          operation: 'UPDATE Step Status',
          status: 'error',
          message: 'No todo steps found to mark done'
        })
        return
      }

      const step = steps[0] as any
      const result = await mutations.markStepDone(step.id)

      if (result.success) {
        addTestResult({
          operation: 'UPDATE Step Status',
          status: 'success',
          message: `Step ${step.id} marked as done`,
          data: result.data
        })
      } else {
        addTestResult({
          operation: 'UPDATE Step Status',
          status: 'error',
          message: result.error || 'Unknown error'
        })
      }
    } catch (error: any) {
      addTestResult({
        operation: 'UPDATE Step Status',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const testDeleteSession = async () => {
    addTestResult({ operation: 'DELETE Session', status: 'pending', message: 'Finding and deleting test session...' })

    try {
      // Find test session created earlier
      const { data: sessions } = await supabase.from('sessions').select('*').ilike('title', '%TEST%').limit(1)

      if (!sessions || sessions.length === 0) {
        addTestResult({
          operation: 'DELETE Session',
          status: 'error',
          message: 'No test session found to delete'
        })
        return
      }

      const session = sessions[0] as any
      const result = await mutations.deleteSession(session.id)

      if (result.success) {
        addTestResult({
          operation: 'DELETE Session',
          status: 'success',
          message: `Session ${session.id} deleted successfully`
        })
      } else {
        addTestResult({
          operation: 'DELETE Session',
          status: 'error',
          message: result.error || 'Unknown error'
        })
      }
    } catch (error: any) {
      addTestResult({
        operation: 'DELETE Session',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const clearTestData = async () => {
    if (!confirm('Clear ALL test data? This will delete everything in the database.')) {
      return
    }

    try {
      const result = await mutations.clearAllData()
      if (result.success) {
        addTestResult({
          operation: 'CLEAR All Data',
          status: 'success',
          message: 'All test data cleared successfully'
        })
      }
    } catch (error: any) {
      addTestResult({
        operation: 'CLEAR All Data',
        status: 'error',
        message: error.message || 'Exception thrown'
      })
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <div className="w-4 h-4 bg-green-500 rounded-full"></div>
      case 'error':
        return <div className="w-4 h-4 bg-red-500 rounded-full"></div>
      case 'pending':
        return <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
    }
  }

  const getConnectionStatusColor = () => {
    switch (dbConnectionStatus) {
      case 'connected': return 'text-green-400'
      case 'error': return 'text-red-400'
      case 'checking': return 'text-yellow-400'
    }
  }

  const calculateSuccessRate = () => {
    const completed = testResults.filter(r => r.status !== 'pending')
    const successful = completed.filter(r => r.status === 'success')
    return completed.length > 0 ? (successful.length / completed.length * 100).toFixed(0) : 0
  }

  return (
    <div className="min-h-screen bg-[var(--fos-color-bg-canvas)] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--fos-color-accent-brand)] mb-2 font-['Figtree']">
            Phase 1 CRUD Validation
          </h1>
          <p className="text-gray-400 font-['JetBrains_Mono']">
            Complete validation of Foundation OS write capabilities
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-6 p-4 bg-black/20 border border-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-['Figtree'] font-medium">Database Connection:</span>
              <span className={`font-['JetBrains_Mono'] ${getConnectionStatusColor()}`}>
                {dbConnectionStatus === 'checking' && 'Checking...'}
                {dbConnectionStatus === 'connected' && '✅ Connected'}
                {dbConnectionStatus === 'error' && '❌ Error'}
              </span>
            </div>
            <button
              onClick={checkConnection}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm font-['JetBrains_Mono'] transition-colors"
            >
              Recheck
            </button>
          </div>
        </div>

        {/* Test Controls */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunning || dbConnectionStatus !== 'connected'}
            className="px-6 py-3 bg-[var(--fos-color-accent-brand)] text-[var(--fos-color-bg-canvas)] rounded-lg font-medium hover:bg-[#4FD1C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Figtree']"
          >
            {isRunning ? 'Running Tests...' : 'Run All CRUD Tests'}
          </button>

          <button
            onClick={clearTestData}
            disabled={isRunning}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 font-['Figtree']"
          >
            Clear Test Data
          </button>
        </div>

        {/* Success Rate */}
        {testResults.length > 0 && (
          <div className="mb-6 p-4 bg-black/20 border border-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--fos-color-accent-brand)] font-['JetBrains_Mono']">
                {calculateSuccessRate()}% Success Rate
              </div>
              <div className="text-sm text-gray-400 font-['Figtree']">
                {testResults.filter(r => r.status === 'success').length} / {testResults.filter(r => r.status !== 'pending').length} operations completed successfully
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-[var(--fos-color-accent-brand)] mb-4 font-['Figtree']">
            Test Results
          </h2>

          {testResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-['Figtree']">No tests run yet. Click "Run All CRUD Tests" to start validation.</p>
            </div>
          )}

          {testResults.map((result, index) => (
            <div
              key={index}
              className="p-4 bg-black/20 border border-gray-800 rounded-lg"
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white font-['Figtree']">
                      {result.operation}
                    </h3>
                    <span className={`
                      text-xs px-2 py-1 rounded font-['JetBrains_Mono']
                      ${result.status === 'success' ? 'bg-green-900/50 text-green-400' : ''}
                      ${result.status === 'error' ? 'bg-red-900/50 text-red-400' : ''}
                      ${result.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' : ''}
                    `}>
                      {result.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm font-['JetBrains_Mono']">
                    {result.message}
                  </p>
                  {result.data && (
                    <pre className="mt-2 p-2 bg-black/50 rounded text-xs text-gray-400 font-['JetBrains_Mono'] overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Environment Info */}
        <div className="mt-8 p-4 bg-black/20 border border-gray-800 rounded-lg">
          <h3 className="font-medium text-[var(--fos-color-accent-brand)] mb-2 font-['Figtree']">Environment</h3>
          <div className="grid grid-cols-2 gap-4 text-sm font-['JetBrains_Mono']">
            <div>
              <span className="text-gray-400">Supabase URL:</span>
              <span className="text-white ml-2">{import.meta.env.VITE_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}</span>
            </div>
            <div>
              <span className="text-gray-400">Anon Key:</span>
              <span className="text-white ml-2">{import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Phase1Demo