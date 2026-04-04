/**
 * notion-sync.test.ts — Tests for Notion Bidirectional Sync Engine
 * Foundation OS Phase 5 "Connected" — Comprehensive test suite
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NotionSyncEngine, defaultNotionSyncConfig } from '../notion-sync-engine'

// ── Mock Dependencies ──────────────────────────────────────────────────

vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'test-id', created_at: new Date().toISOString() },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: 'test-id' },
              error: null
            }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null
        }))
      }))
    }))
  }
}))

// Mock localStorage for browser environment
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// ── Test Configuration ──────────────────────────────────────────────────

const testConfig = {
  ...defaultNotionSyncConfig,
  workspaceId: 'test-workspace',
  databaseIds: {
    sessions: 'db-sessions-123',
    decisions: 'db-decisions-456',
    risks: 'db-risks-789',
    nextSteps: 'db-nextsteps-012',
    docs: 'db-docs-345'
  },
  syncInterval: 1000, // 1 second for tests
  conflictResolution: 'intelligent' as const
}

// ── Test Suite ──────────────────────────────────────────────────────────

describe('NotionSyncEngine', () => {
  let syncEngine: NotionSyncEngine

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    syncEngine = new NotionSyncEngine(testConfig)
  })

  afterEach(async () => {
    if (syncEngine.getStatus().isRunning) {
      await syncEngine.stop()
    }
  })

  // ── Core Engine Tests ───────────────────────────────────────────────

  describe('Engine Lifecycle', () => {
    it('should initialize with stopped state', () => {
      const status = syncEngine.getStatus()
      expect(status.isRunning).toBe(false)
      expect(status.queueSize).toBe(0)
      expect(status.mappingCount).toBe(0)
    })

    it('should start successfully', async () => {
      await syncEngine.start()
      const status = syncEngine.getStatus()
      expect(status.isRunning).toBe(true)
    })

    it('should stop successfully', async () => {
      await syncEngine.start()
      await syncEngine.stop()
      const status = syncEngine.getStatus()
      expect(status.isRunning).toBe(false)
    })

    it('should not start twice', async () => {
      await syncEngine.start()
      await syncEngine.start() // Second call should be ignored
      const status = syncEngine.getStatus()
      expect(status.isRunning).toBe(true)
    })
  })

  // ── Data Transformation Tests ────────────────────────────────────────

  describe('Data Transformation', () => {
    it('should transform Foundation session to Notion format', () => {
      const foundationSession = {
        id: 'CONV-123',
        title: 'Test Session',
        date: '2026-04-04',
        phase: '01',
        status: 'active',
        items: 'Test items',
        decisions: 'Test decisions'
      }

      // Access private method via type assertion
      const transformed = (syncEngine as any).transformFoundationToNotion('sessions', foundationSession)

      expect(transformed).toEqual({
        title: 'Test Session',
        date: '2026-04-04',
        phase: '01',
        status: 'Active',
        items: 'Test items',
        decisions: 'Test decisions',
        foundation_id: 'CONV-123'
      })
    })

    it('should transform Foundation decision to Notion format', () => {
      const foundationDecision = {
        id: 'ADR-456',
        title: 'Test Decision',
        date: '2026-04-04',
        context: 'Test context',
        impact: 'high',
        status: 'active'
      }

      const transformed = (syncEngine as any).transformFoundationToNotion('decisions', foundationDecision)

      expect(transformed).toEqual({
        title: 'Test Decision',
        date: '2026-04-04',
        context: 'Test context',
        impact: 'High',
        status: 'Active',
        foundation_id: 'ADR-456'
      })
    })

    it('should transform Notion data to Foundation format', () => {
      const notionPage = {
        properties: {
          Title: {
            type: 'title',
            title: [{ plain_text: 'Test Session' }]
          },
          Date: {
            type: 'date',
            date: { start: '2026-04-04' }
          },
          Phase: {
            type: 'select',
            select: { name: '01' }
          },
          Status: {
            type: 'select',
            select: { name: 'Active' }
          }
        }
      }

      const transformed = (syncEngine as any).transformNotionToFoundation('sessions', notionPage)

      expect(transformed).toEqual({
        title: 'Test Session',
        date: '2026-04-04',
        phase: '01',
        status: 'active',
        items: '',
        decisions: ''
      })
    })
  })

  // ── Conflict Resolution Tests ─────────────────────────────────────────

  describe('Conflict Resolution', () => {
    it('should resolve conflicts using intelligent algorithm', async () => {
      const conflictEvent = {
        id: 'conflict-123',
        timestamp: new Date().toISOString(),
        type: 'update' as const,
        source: 'notion' as const,
        entity: 'session' as const,
        entityId: 'CONV-123',
        status: 'conflict' as const,
        conflicts: [
          {
            field: 'title',
            foundationValue: 'Foundation Title',
            notionValue: 'Notion Title',
            lastModified: {
              foundation: '2026-04-04T10:00:00Z',
              notion: '2026-04-04T11:00:00Z' // More recent
            }
          }
        ]
      }

      const resolution = await (syncEngine as any).intelligentConflictResolution(conflictEvent)
      expect(resolution).toBe('notion') // Notion wins because it's more recent
    })

    it('should resolve conflicts based on data completeness', async () => {
      const conflictEvent = {
        id: 'conflict-456',
        timestamp: new Date().toISOString(),
        type: 'update' as const,
        source: 'foundation' as const,
        entity: 'decision' as const,
        entityId: 'ADR-456',
        status: 'conflict' as const,
        conflicts: [
          {
            field: 'context',
            foundationValue: 'Very detailed context with lots of information',
            notionValue: 'Short context',
            lastModified: {
              foundation: '2026-04-04T10:00:00Z',
              notion: '2026-04-04T10:00:00Z' // Same time
            }
          }
        ]
      }

      const resolution = await (syncEngine as any).intelligentConflictResolution(conflictEvent)
      expect(resolution).toBe('foundation') // Foundation wins because more detailed
    })

    it('should handle manual conflict resolution', async () => {
      await syncEngine.start()

      // Add a conflict to the queue
      ;(syncEngine as any).syncQueue.push({
        id: 'manual-conflict',
        timestamp: new Date().toISOString(),
        type: 'update',
        source: 'notion',
        entity: 'session',
        entityId: 'CONV-789',
        status: 'conflict'
      })

      await syncEngine.resolveManualConflict('manual-conflict', 'foundation')

      // Check that conflict was resolved
      const conflicts = syncEngine.getConflicts()
      expect(conflicts.find(c => c.id === 'manual-conflict')).toBeUndefined()
    })
  })

  // ── Mapping Management Tests ──────────────────────────────────────────

  describe('Mapping Management', () => {
    it('should create and store entity mappings', () => {
      const entity = { id: 'CONV-123', title: 'Test Session' }
      ;(syncEngine as any).createMapping('sessions-CONV-123', 'notion-page-123', entity)

      const mappings = (syncEngine as any).mappings
      expect(mappings.has('sessions-CONV-123')).toBe(true)

      const mapping = mappings.get('sessions-CONV-123')
      expect(mapping.foundationId).toBe('sessions-CONV-123')
      expect(mapping.notionPageId).toBe('notion-page-123')
      expect(mapping.version).toBe(1)
    })

    it('should detect changes using checksums', () => {
      const entity1 = { id: 'CONV-123', title: 'Original Title' }
      const entity2 = { id: 'CONV-123', title: 'Modified Title' }

      ;(syncEngine as any).createMapping('sessions-CONV-123', 'notion-page-123', entity1)

      const mapping = (syncEngine as any).mappings.get('sessions-CONV-123')
      const hasChanges = (syncEngine as any).hasChanges(entity2, mapping)

      expect(hasChanges).toBe(true)
    })

    it('should load mappings from localStorage', () => {
      const mockMappings = {
        'sessions-CONV-123': {
          foundationId: 'sessions-CONV-123',
          notionPageId: 'notion-page-123',
          lastSync: '2026-04-04T10:00:00Z',
          version: 1,
          checksum: 'abc123'
        }
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockMappings))

      const newEngine = new NotionSyncEngine(testConfig)
      const mappings = (newEngine as any).mappings

      expect(mappings.size).toBe(1)
      expect(mappings.has('sessions-CONV-123')).toBe(true)
    })
  })

  // ── Performance Tests ─────────────────────────────────────────────────

  describe('Performance', () => {
    it('should complete sync cycle within timeout', async () => {
      await syncEngine.start()

      const startTime = Date.now()
      await syncEngine.forceSyncAll()
      const duration = Date.now() - startTime

      // Should complete within 5 seconds
      expect(duration).toBeLessThan(5000)
    })

    it('should handle large data sets efficiently', async () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `CONV-${i}`,
        title: `Session ${i}`,
        date: '2026-04-04',
        status: 'active'
      }))

      // Mock Supabase to return large dataset
      vi.mocked((syncEngine as any).getFoundationData).mockResolvedValue({
        sessions: largeDataset,
        decisions: [],
        risks: [],
        nextSteps: [],
        docs: []
      })

      await syncEngine.start()

      const startTime = Date.now()
      await syncEngine.forceSyncAll()
      const duration = Date.now() - startTime

      // Should handle 100 items in reasonable time
      expect(duration).toBeLessThan(10000)
    })
  })

  // ── Error Handling Tests ──────────────────────────────────────────────

  describe('Error Handling', () => {
    it('should handle Supabase connection errors gracefully', async () => {
      // Mock Supabase error
      vi.mocked((syncEngine as any).getFoundationData).mockRejectedValue(
        new Error('Connection failed')
      )

      await syncEngine.start()

      // Should not throw, but handle error internally
      await expect(syncEngine.forceSyncAll()).resolves.not.toThrow()
    })

    it('should handle Notion API errors gracefully', async () => {
      // Mock Notion API error
      vi.mocked((syncEngine as any).createNotionPage).mockRejectedValue(
        new Error('Notion API rate limit')
      )

      await syncEngine.start()

      // Should not throw, but handle error internally
      await expect(syncEngine.forceSyncAll()).resolves.not.toThrow()
    })

    it('should handle invalid data transformation gracefully', () => {
      const invalidData = null

      const transformed = (syncEngine as any).transformFoundationToNotion('sessions', invalidData)

      // Should return default values for missing fields
      expect(transformed.title).toBe('Untitled Session')
      expect(transformed.foundation_id).toBe(null)
    })
  })

  // ── Integration Tests ─────────────────────────────────────────────────

  describe('Integration', () => {
    it('should sync new session from Foundation to Notion', async () => {
      const mockCreatePage = vi.fn().mockResolvedValue('notion-page-123')
      ;(syncEngine as any).createNotionPage = mockCreatePage

      await syncEngine.start()

      // Mock Foundation data with new session
      vi.mocked((syncEngine as any).getFoundationData).mockResolvedValue({
        sessions: [{
          id: 'CONV-123',
          title: 'New Session',
          date: '2026-04-04',
          status: 'active'
        }],
        decisions: [],
        risks: [],
        nextSteps: [],
        docs: []
      })

      await syncEngine.forceSyncAll()

      expect(mockCreatePage).toHaveBeenCalledWith(
        testConfig.databaseIds.sessions,
        expect.objectContaining({
          title: 'New Session',
          foundation_id: 'CONV-123'
        })
      )
    })

    it('should update existing session mapping when changes detected', async () => {
      // Create initial mapping
      const entity = { id: 'CONV-123', title: 'Original Title' }
      ;(syncEngine as any).createMapping('sessions-CONV-123', 'notion-page-123', entity)

      const mockUpdatePage = vi.fn().mockResolvedValue(undefined)
      ;(syncEngine as any).updateNotionPage = mockUpdatePage

      await syncEngine.start()

      // Mock updated Foundation data
      vi.mocked((syncEngine as any).getFoundationData).mockResolvedValue({
        sessions: [{
          id: 'CONV-123',
          title: 'Updated Title', // Changed title
          date: '2026-04-04',
          status: 'active'
        }],
        decisions: [],
        risks: [],
        nextSteps: [],
        docs: []
      })

      await syncEngine.forceSyncAll()

      expect(mockUpdatePage).toHaveBeenCalledWith(
        'notion-page-123',
        expect.objectContaining({
          title: 'Updated Title'
        })
      )
    })
  })

  // ── Utility Functions Tests ───────────────────────────────────────────

  describe('Utility Functions', () => {
    it('should capitalize first letter correctly', () => {
      const capitalize = (syncEngine as any).capitalizeFirst
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('World')
      expect(capitalize('')).toBe('')
      expect(capitalize('a')).toBe('A')
    })

    it('should extract Notion properties correctly', () => {
      const getProperty = (syncEngine as any).getNotionProperty

      const props = {
        Title: {
          type: 'title',
          title: [{ plain_text: 'Test Title' }]
        },
        Status: {
          type: 'select',
          select: { name: 'Active' }
        },
        Date: {
          type: 'date',
          date: { start: '2026-04-04' }
        }
      }

      expect(getProperty(props, 'title')).toBe('Test Title')
      expect(getProperty(props, 'status')).toBe('Active')
      expect(getProperty(props, 'date')).toBe('2026-04-04')
      expect(getProperty(props, 'nonexistent')).toBeNull()
    })

    it('should map Notion step status correctly', () => {
      const mapStatus = (syncEngine as any).mapNotionStepStatus

      expect(mapStatus('To Do')).toBe('todo')
      expect(mapStatus('In Progress')).toBe('in_progress')
      expect(mapStatus('Done')).toBe('done')
      expect(mapStatus('Unknown')).toBe('todo')
    })

    it('should calculate checksums consistently', () => {
      const calculateChecksum = (syncEngine as any).calculateChecksum

      const data1 = { id: '123', title: 'Test' }
      const data2 = { id: '123', title: 'Test' }
      const data3 = { id: '123', title: 'Different' }

      expect(calculateChecksum(data1)).toBe(calculateChecksum(data2))
      expect(calculateChecksum(data1)).not.toBe(calculateChecksum(data3))
    })
  })
})

// ── Performance Benchmarks ────────────────────────────────────────────────

describe('Performance Benchmarks', () => {
  it('should meet Phase 5 performance targets', async () => {
    const config = {
      ...testConfig,
      batchSize: 50
    }
    const syncEngine = new NotionSyncEngine(config)

    // Test sync latency < 5s (Phase 5 requirement)
    await syncEngine.start()

    const startTime = Date.now()
    await syncEngine.forceSyncAll()
    const syncLatency = Date.now() - startTime

    expect(syncLatency).toBeLessThan(5000) // < 5s requirement

    await syncEngine.stop()
  })

  it('should handle conflict resolution efficiently', async () => {
    const syncEngine = new NotionSyncEngine(testConfig)

    // Create multiple conflicts
    const conflicts = Array.from({ length: 10 }, (_, i) => ({
      id: `conflict-${i}`,
      timestamp: new Date().toISOString(),
      type: 'update' as const,
      source: 'notion' as const,
      entity: 'session' as const,
      entityId: `CONV-${i}`,
      status: 'conflict' as const,
      conflicts: [{
        field: 'title',
        foundationValue: `Foundation ${i}`,
        notionValue: `Notion ${i}`,
        lastModified: {
          foundation: '2026-04-04T10:00:00Z',
          notion: '2026-04-04T11:00:00Z'
        }
      }]
    }))

    // Add conflicts to queue
    ;(syncEngine as any).syncQueue = conflicts

    const startTime = Date.now()
    await (syncEngine as any).resolveConflicts()
    const resolutionTime = Date.now() - startTime

    // Should resolve 10 conflicts quickly
    expect(resolutionTime).toBeLessThan(1000) // < 1s for 10 conflicts
  })
})

// ── Security Tests ────────────────────────────────────────────────────────

describe('Security', () => {
  it('should validate data before transformation', () => {
    const syncEngine = new NotionSyncEngine(testConfig)

    // Test with potentially malicious data
    const maliciousData = {
      id: '<script>alert("xss")</script>',
      title: 'DROP TABLE sessions;',
      __proto__: { malicious: true }
    }

    const transformed = (syncEngine as any).transformFoundationToNotion('sessions', maliciousData)

    // Should not execute scripts or SQL injection
    expect(transformed.title).toBe('DROP TABLE sessions;')
    expect(transformed.foundation_id).toBe('<script>alert("xss")</script>')
    expect((transformed as any).malicious).toBeUndefined()
  })

  it('should sanitize localStorage data', () => {
    const syncEngine = new NotionSyncEngine(testConfig)

    // Mock malicious localStorage data
    localStorageMock.getItem.mockReturnValue('{"__proto__": {"malicious": true}}')

    // Should not throw and should handle gracefully
    expect(() => (syncEngine as any).loadMappings()).not.toThrow()
  })
})