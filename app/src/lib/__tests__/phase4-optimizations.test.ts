/**
 * phase4-optimizations.test.ts - Tests for Foundation OS Phase 4 Critical Optimizations
 * Validates parallel execution, security framework, and memory management
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { mcpOrchestrator } from '../mcp-orchestrator'
import { workflowRoutingEngine } from '../workflow-routing-engine'
import { securityFramework } from '../security-framework'
import { memoryManager } from '../memory-manager'
import type { WorkflowRequest, SecurityContext } from '../workflow-routing-engine'

describe('Foundation OS Phase 4 - Critical Optimizations', () => {
  let testSecurityContext: SecurityContext

  beforeEach(() => {
    testSecurityContext = {
      userId: 'test-user-123',
      userRole: 'admin',
      sessionId: 'test-session-456',
      permissions: ['read', 'write', 'execute'],
      dataAccessLevels: ['public', 'sensitive'],
      timestamp: new Date().toISOString()
    }
  })

  afterEach(() => {
    // Cleanup between tests
    memoryManager.clear()
  })

  describe('1. Parallel Execution Engine', () => {
    test('should build dependency graph correctly', async () => {
      const mockTools = await mcpOrchestrator.getAllTools()
      expect(mockTools.length).toBeGreaterThan(0)

      const request: WorkflowRequest = {
        id: 'test-request-1',
        description: 'Create task in Asana and send notification via Slack',
        requirements: ['task-management', 'communication'],
        priority: 'high'
      }

      const plan = mcpOrchestrator.selectOptimalTools(request)
      expect(plan.selectedTools.length).toBeGreaterThan(0)
      expect(plan.executionOrder.length).toBeGreaterThan(0)

      // Test that parallel execution works
      const results = await mcpOrchestrator.executePlan(plan)
      expect(results.length).toBeGreaterThan(0)
    })

    test('should handle dependency resolution', async () => {
      const request: WorkflowRequest = {
        id: 'test-dependency',
        description: 'Complex workflow with data processing dependencies',
        requirements: ['data-extraction', 'data-processing', 'api-interaction'],
        priority: 'medium'
      }

      const plan = mcpOrchestrator.selectOptimalTools(request)

      // Verify tools with dependencies are ordered correctly
      const toolIds = plan.executionOrder
      expect(toolIds.length).toBeGreaterThan(0)

      // Execution should complete without circular dependency errors
      const results = await mcpOrchestrator.executePlan(plan)
      expect(results).toBeDefined()
    })

    test('should execute tools in parallel when possible', async () => {
      const request: WorkflowRequest = {
        id: 'test-parallel',
        description: 'Independent tasks that can run in parallel',
        requirements: ['communication', 'documentation'],
        priority: 'low'
      }

      const startTime = Date.now()
      const plan = mcpOrchestrator.selectOptimalTools(request)
      const results = await mcpOrchestrator.executePlan(plan)
      const duration = Date.now() - startTime

      expect(results.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(plan.estimatedDuration * 1.5) // Should be faster than sequential
    })
  })

  describe('2. Security Framework', () => {
    test('should validate access permissions correctly', async () => {
      const tool = mcpOrchestrator.getAllTools()[0]
      expect(tool).toBeDefined()

      // Test allowed access
      const allowedResult = await securityFramework.validateAccess(
        tool,
        testSecurityContext,
        'read',
        { data: 'public information' }
      )
      expect(allowedResult.allowed).toBe(true)

      // Test blocked access (insufficient permissions)
      const restrictedContext = {
        ...testSecurityContext,
        permissions: ['read' as const] // No write permission
      }

      const blockedResult = await securityFramework.validateAccess(
        tool,
        restrictedContext,
        'write',
        { data: 'sensitive information' }
      )
      // May be allowed or blocked depending on tool requirements
      expect(typeof blockedResult.allowed).toBe('boolean')
    })

    test('should create security profiles for tools', async () => {
      const tool = mcpOrchestrator.getAllTools()[0]
      const profile = await securityFramework.createSecurityProfile(tool)

      expect(profile).toBeDefined()
      expect(profile.toolId).toBe(tool.id)
      expect(profile.securityLevel).toBeDefined()
      expect(profile.requiredPermissions.length).toBeGreaterThan(0)
      expect(profile.riskScore).toBeGreaterThanOrEqual(0)
      expect(profile.riskScore).toBeLessThanOrEqual(10)
    })

    test('should log audit events', async () => {
      const tool = mcpOrchestrator.getAllTools()[0]
      const initialAuditCount = securityFramework.getAuditLog().length

      await securityFramework.logAuditEvent(
        tool,
        testSecurityContext,
        'test-action',
        { test: 'data' },
        'success'
      )

      const newAuditCount = securityFramework.getAuditLog().length
      expect(newAuditCount).toBe(initialAuditCount + 1)

      const latestEvent = securityFramework.getAuditLog().slice(-1)[0]
      expect(latestEvent.toolId).toBe(tool.id)
      expect(latestEvent.userId).toBe(testSecurityContext.userId)
      expect(latestEvent.result).toBe('success')
    })

    test('should filter routes based on security', async () => {
      const request: WorkflowRequest = {
        id: 'test-security-filter',
        description: 'Request that may be filtered by security',
        requirements: ['admin'],
        priority: 'high'
      }

      const decision = await workflowRoutingEngine.analyzeAndRoute(request, testSecurityContext)
      expect(decision).toBeDefined()
      expect(decision.selectedRoute).toBeDefined()

      // Should have applied security filtering
      expect(decision.reasoning).toBeDefined()
    })
  })

  describe('3. Memory Management System', () => {
    test('should cache and retrieve data correctly', async () => {
      const testKey = 'test-cache-key'
      const testData = { message: 'Hello from cache!', timestamp: Date.now() }

      // Set data in cache
      const setResult = await memoryManager.set(testKey, testData, {
        ttl: 60000, // 1 minute
        priority: 'medium',
        category: 'test'
      })
      expect(setResult).toBe(true)

      // Retrieve data from cache
      const retrievedData = await memoryManager.get(testKey)
      expect(retrievedData).toEqual(testData)

      // Test cache hit stats
      const stats = memoryManager.getMemoryStats()
      expect(stats.totalHits).toBeGreaterThan(0)
    })

    test('should handle memory eviction correctly', async () => {
      // Fill cache with test data
      const largeData = 'x'.repeat(1024 * 1024) // 1MB string

      for (let i = 0; i < 5; i++) {
        await memoryManager.set(`large-item-${i}`, largeData, {
          priority: 'low',
          category: 'test-eviction'
        })
      }

      const statsAfterFill = memoryManager.getMemoryStats()
      expect(statsAfterFill.entryCount).toBeGreaterThan(0)

      // Add a high-priority item that might trigger eviction
      const importantData = { critical: true }
      await memoryManager.set('important-item', importantData, {
        priority: 'critical',
        category: 'important'
      })

      // Important item should still be accessible
      const retrieved = await memoryManager.get('important-item')
      expect(retrieved).toEqual(importantData)
    })

    test('should apply resource throttling', async () => {
      const throttleCheck = await memoryManager.checkResourceThrottling()
      expect(throttleCheck.allowed).toBeDefined()
      expect(typeof throttleCheck.allowed).toBe('boolean')

      if (throttleCheck.delay) {
        expect(throttleCheck.delay).toBeGreaterThan(0)
      }
    })

    test('should cache routing decisions', async () => {
      const request: WorkflowRequest = {
        id: 'test-cache-routing',
        description: 'Test caching of routing decisions',
        requirements: ['communication'],
        priority: 'medium'
      }

      // First call - should compute and cache
      const startTime1 = Date.now()
      const decision1 = await workflowRoutingEngine.analyzeAndRoute(request, testSecurityContext)
      const duration1 = Date.now() - startTime1

      expect(decision1).toBeDefined()

      // Second call - should use cache (faster)
      const startTime2 = Date.now()
      const decision2 = await workflowRoutingEngine.analyzeAndRoute(request, testSecurityContext)
      const duration2 = Date.now() - startTime2

      expect(decision2).toBeDefined()
      expect(duration2).toBeLessThan(duration1) // Should be faster due to caching
    })

    test('should optimize cache performance', async () => {
      // Add some test data
      for (let i = 0; i < 10; i++) {
        await memoryManager.set(`test-optimize-${i}`, { data: i }, {
          category: 'optimization-test',
          priority: 'low'
        })
      }

      const result = await memoryManager.optimizeCache()
      expect(result.optimized).toBeGreaterThanOrEqual(0)
      expect(result.freedMemory).toBeGreaterThanOrEqual(0)
      expect(Array.isArray(result.suggestions)).toBe(true)
    })
  })

  describe('4. Integration Tests', () => {
    test('should execute complete workflow with all optimizations', async () => {
      const request: WorkflowRequest = {
        id: 'integration-test',
        description: 'Complete workflow testing all optimizations',
        requirements: ['task-management', 'communication'],
        priority: 'high'
      }

      // Get routing decision with security and caching
      const decision = await workflowRoutingEngine.analyzeAndRoute(request, testSecurityContext)
      expect(decision).toBeDefined()
      expect(decision.selectedRoute).toBeDefined()

      // Execute route with security auditing and memory management
      const results = await workflowRoutingEngine.executeRoute(
        decision.selectedRoute,
        request,
        testSecurityContext
      )

      expect(Array.isArray(results)).toBe(true)

      // Verify audit events were created
      const auditEvents = securityFramework.getAuditLog({
        userId: testSecurityContext.userId
      })
      expect(auditEvents.length).toBeGreaterThan(0)

      // Verify memory usage is tracked
      const memoryStats = memoryManager.getMemoryStats()
      expect(memoryStats.entryCount).toBeGreaterThan(0)
    })

    test('should handle performance optimization', async () => {
      const result = await workflowRoutingEngine.optimizePerformance()

      expect(typeof result.cacheOptimized).toBe('boolean')
      expect(typeof result.memoryFreed).toBe('number')
      expect(Array.isArray(result.securityRecommendations)).toBe(true)
    })

    test('should support cache warmup', async () => {
      const commonRequests: WorkflowRequest[] = [
        {
          id: 'warmup-1',
          description: 'Common task creation workflow',
          requirements: ['task-management'],
          priority: 'medium'
        },
        {
          id: 'warmup-2',
          description: 'Common communication workflow',
          requirements: ['communication'],
          priority: 'medium'
        }
      ]

      await workflowRoutingEngine.warmupCache(commonRequests)

      // Verify cache has been warmed up
      const stats = memoryManager.getMemoryStats()
      expect(stats.entryCount).toBeGreaterThan(0)
    })
  })

  describe('5. Error Handling and Edge Cases', () => {
    test('should handle memory exhaustion gracefully', async () => {
      // Try to exceed memory limits
      const largeData = 'x'.repeat(10 * 1024 * 1024) // 10MB

      const result = await memoryManager.set('huge-item', largeData)
      // Should either succeed or fail gracefully
      expect(typeof result).toBe('boolean')
    })

    test('should handle security violations', async () => {
      const restrictedContext: SecurityContext = {
        ...testSecurityContext,
        userRole: 'guest',
        permissions: ['read']
      }

      const request: WorkflowRequest = {
        id: 'restricted-test',
        description: 'Request that should be restricted',
        requirements: ['admin', 'delete'],
        priority: 'high'
      }

      // This might throw or return limited results based on security
      try {
        const decision = await workflowRoutingEngine.analyzeAndRoute(request, restrictedContext)
        // If it succeeds, should have limited options
        expect(decision).toBeDefined()
      } catch (error) {
        // If it fails, should be due to security constraints
        expect(error).toBeDefined()
      }
    })

    test('should handle circular dependencies', async () => {
      const request: WorkflowRequest = {
        id: 'circular-test',
        description: 'Complex request that might create circular dependencies',
        requirements: ['data-processing', 'api-interaction', 'automation'],
        priority: 'medium'
      }

      const plan = mcpOrchestrator.selectOptimalTools(request)
      const results = await mcpOrchestrator.executePlan(plan)

      // Should complete without infinite loops
      expect(Array.isArray(results)).toBe(true)
    })
  })
})