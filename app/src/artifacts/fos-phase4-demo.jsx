import { useState, useEffect } from 'react'
import { mcpOrchestrator } from '../lib/mcp-orchestrator'
import { workflowRoutingEngine } from '../lib/workflow-routing-engine'
import { securityFramework } from '../lib/security-framework'
import { memoryManager } from '../lib/memory-manager'

export default function Phase4OptimizationsDemo() {
  const [stats, setStats] = useState(null)
  const [demoResults, setDemoResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const securityContext = {
    userId: 'demo-user',
    userRole: 'admin',
    sessionId: 'demo-session',
    permissions: ['read', 'write', 'execute'],
    dataAccessLevels: ['public', 'sensitive'],
    timestamp: new Date().toISOString()
  }

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const routingStats = workflowRoutingEngine.getStats()
      const memoryStats = memoryManager.getMemoryStats()

      setStats({
        routing: routingStats,
        memory: memoryStats,
        tools: {
          total: mcpOrchestrator.getAllTools().length,
          categories: mcpOrchestrator.getCategories().length
        }
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const runDemo = async (demoType) => {
    setIsRunning(true)
    const results = []

    try {
      switch (demoType) {
        case 'parallel-execution':
          results.push({ step: 'Parallel Execution Demo', status: 'starting' })
          setDemoResults([...results])

          const request = {
            id: `demo-${Date.now()}`,
            description: 'Create project tasks and send team notifications',
            requirements: ['task-management', 'communication', 'documentation'],
            priority: 'high'
          }

          results.push({ step: 'Analyzing workflow request', status: 'processing' })
          setDemoResults([...results])

          const decision = await workflowRoutingEngine.analyzeAndRoute(request, securityContext)

          results.push({
            step: 'Route selected',
            status: 'success',
            data: `${decision.selectedRoute.name} (confidence: ${(decision.confidence * 100).toFixed(1)}%)`
          })
          setDemoResults([...results])

          results.push({ step: 'Executing workflow in parallel', status: 'processing' })
          setDemoResults([...results])

          const executionResults = await workflowRoutingEngine.executeRoute(
            decision.selectedRoute,
            request,
            securityContext
          )

          results.push({
            step: 'Parallel execution completed',
            status: 'success',
            data: `${executionResults.length} tools executed`
          })
          break

        case 'security-audit':
          results.push({ step: 'Security Framework Demo', status: 'starting' })
          setDemoResults([...results])

          const tool = mcpOrchestrator.getAllTools()[0]

          results.push({ step: 'Validating tool access', status: 'processing' })
          setDemoResults([...results])

          const accessCheck = await securityFramework.validateAccess(
            tool,
            securityContext,
            'execute',
            { demo: 'security test' }
          )

          results.push({
            step: 'Access validation',
            status: accessCheck.allowed ? 'success' : 'blocked',
            data: accessCheck.allowed ? 'Access granted' : `Blocked: ${accessCheck.reason}`
          })
          setDemoResults([...results])

          if (accessCheck.allowed) {
            await securityFramework.logAuditEvent(
              tool,
              securityContext,
              'demo-action',
              { demo: 'security test' },
              'success'
            )

            const auditLog = securityFramework.getAuditLog({ userId: securityContext.userId })

            results.push({
              step: 'Security audit logged',
              status: 'success',
              data: `${auditLog.length} audit events for user`
            })
          }
          break

        case 'memory-optimization':
          results.push({ step: 'Memory Management Demo', status: 'starting' })
          setDemoResults([...results])

          results.push({ step: 'Caching test data', status: 'processing' })
          setDemoResults([...results])

          // Cache some test data
          for (let i = 0; i < 10; i++) {
            await memoryManager.set(`demo-item-${i}`, {
              data: `Test data ${i}`,
              timestamp: Date.now(),
              size: Math.random() * 1000
            }, {
              category: 'demo',
              priority: i < 3 ? 'high' : 'low',
              ttl: 60000
            })
          }

          const initialStats = memoryManager.getMemoryStats()

          results.push({
            step: 'Cache populated',
            status: 'success',
            data: `${initialStats.entryCount} entries, ${initialStats.memoryUsagePercent.toFixed(1)}% memory used`
          })
          setDemoResults([...results])

          results.push({ step: 'Testing cache retrieval', status: 'processing' })
          setDemoResults([...results])

          const cachedItem = await memoryManager.get('demo-item-0')

          results.push({
            step: 'Cache hit test',
            status: cachedItem ? 'success' : 'miss',
            data: cachedItem ? 'Data retrieved from cache' : 'Cache miss'
          })
          setDemoResults([...results])

          results.push({ step: 'Running cache optimization', status: 'processing' })
          setDemoResults([...results])

          const optimization = await memoryManager.optimizeCache()

          results.push({
            step: 'Cache optimization completed',
            status: 'success',
            data: `${optimization.optimized} entries optimized, ${formatBytes(optimization.freedMemory)} freed`
          })
          break

        default:
          results.push({ step: 'Unknown demo type', status: 'error' })
      }

      setDemoResults([...results])
      await loadStats()

    } catch (error) {
      results.push({
        step: 'Demo failed',
        status: 'error',
        data: error.message
      })
      setDemoResults([...results])
    } finally {
      setIsRunning(false)
    }
  }

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Foundation OS Phase 4
          </h1>
          <p className="text-xl text-slate-300 mb-2">Smart Orchestration - Critical Optimizations</p>
          <p className="text-slate-400">Parallel Execution • Security Framework • Memory Management</p>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-teal-400 mb-4">🛠️ MCP Tools</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Tools:</span>
                  <span className="text-white font-mono">{stats.tools.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Categories:</span>
                  <span className="text-white font-mono">{stats.tools.categories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Route Templates:</span>
                  <span className="text-white font-mono">{stats.routing.routeTemplates}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">🧠 Memory Management</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Hit Rate:</span>
                  <span className="text-white font-mono">{(stats.memory.hitRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Memory Usage:</span>
                  <span className="text-white font-mono">{stats.memory.memoryUsagePercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Cache Entries:</span>
                  <span className="text-white font-mono">{stats.memory.entryCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-green-400 mb-4">🔒 Security Framework</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Audit Events:</span>
                  <span className="text-white font-mono">{stats.routing.security?.auditEvents || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Security Policies:</span>
                  <span className="text-white font-mono">{stats.routing.security?.securityPolicies || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Learning Data:</span>
                  <span className="text-white font-mono">{stats.routing.learningDataPoints}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => runDemo('parallel-execution')}
            disabled={isRunning}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-lg mb-1">⚡ Parallel Execution</div>
            <div className="text-sm opacity-90">Test dependency resolution & parallel tool execution</div>
          </button>

          <button
            onClick={() => runDemo('security-audit')}
            disabled={isRunning}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-lg mb-1">🔒 Security Framework</div>
            <div className="text-sm opacity-90">Test access validation & audit logging</div>
          </button>

          <button
            onClick={() => runDemo('memory-optimization')}
            disabled={isRunning}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-lg mb-1">🧠 Memory Management</div>
            <div className="text-sm opacity-90">Test LRU caching & optimization</div>
          </button>
        </div>

        {/* Demo Results */}
        {demoResults.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">📊 Demo Results</h3>
            <div className="space-y-3">
              {demoResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      result.status === 'success' ? 'bg-green-400' :
                      result.status === 'error' ? 'bg-red-400' :
                      result.status === 'blocked' ? 'bg-orange-400' :
                      result.status === 'processing' ? 'bg-blue-400 animate-pulse' :
                      'bg-slate-400'
                    }`}></div>
                    <span className="text-slate-200">{result.step}</span>
                  </div>
                  {result.data && (
                    <span className="text-slate-400 text-sm font-mono">{result.data}</span>
                  )}
                </div>
              ))}
            </div>

            {isRunning && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
                <span className="ml-2 text-slate-300">Running demo...</span>
              </div>
            )}
          </div>
        )}

        {/* Architecture Diagram */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">🏗️ Phase 4 Architecture Overview</h3>
          <div className="text-slate-300 space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-teal-400 mb-2">1. Parallel Execution Engine</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Dependency graph resolution</li>
                  <li>• Wave-based parallel execution</li>
                  <li>• Circular dependency detection</li>
                  <li>• Resource optimization</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-purple-400 mb-2">2. Security Framework</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Data classification system</li>
                  <li>• Granular permissions</li>
                  <li>• Comprehensive audit trail</li>
                  <li>• Risk assessment scoring</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">3. Memory Management</h4>
                <ul className="space-y-1 text-xs">
                  <li>• LRU cache with eviction</li>
                  <li>• Resource throttling</li>
                  <li>• Garbage collection</li>
                  <li>• Performance optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 text-center text-slate-400 text-sm">
          <p>Foundation OS Phase 4 "Smart Orchestration" • 250+ MCP Tools • Revolutionary Intelligence</p>
          <p className="mt-1">Parallel Execution • Security Framework • Memory Management • ML-Powered Routing</p>
        </div>
      </div>
    </div>
  )
}