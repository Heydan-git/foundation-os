/**
 * useCommander.test.ts — tests the data hook fallback logic.
 * The hook fetches 6 tables in parallel and falls back to SEED data when:
 *   1. any query returns an error
 *   2. all queries return empty arrays
 * Otherwise it sets `source === 'supabase'`.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createSupabaseMock, createQueryBuilder } from './mocks/supabase'

const { mockSupabase } = vi.hoisted(() => ({
  mockSupabase: {
    from: (() => {}) as any,
    auth: {} as any,
  },
}))

vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }))

beforeEach(() => {
  const fresh = createSupabaseMock()
  mockSupabase.from = fresh.from
  mockSupabase.auth = fresh.auth
})

/** Queue 6 builders in the order useCommander calls them: sessions, decisions, risks, docs, context_blocks, next_steps */
function queueSixBuilders(results: Array<{ data: unknown; error: unknown }>) {
  for (const r of results) {
    mockSupabase.from.mockReturnValueOnce(createQueryBuilder(r as any))
  }
}

describe('useCommander', () => {
  it('falls back to SEED when all queries return empty arrays', async () => {
    queueSixBuilders([
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
    ])

    const { useCommander } = await import('@/lib/useCommander')
    const { result } = renderHook(() => useCommander())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe('seed')
    expect(result.current.sessions.length).toBeGreaterThan(0) // SEED_SESSIONS injected
    expect(result.current.decisions.length).toBeGreaterThan(0)
  })

  it('uses supabase data when queries return rows', async () => {
    const fakeSessions = [{ id: 'CONV-X', title: 'X', date: '2026-04-07', items: null, decisions: null, phase: null, status: 'active', created_at: '' }]
    const fakeDecisions = [{ id: 'ADR-X', title: 'X', date: '2026-04-07', context: null, impact: 'high', status: 'active', created_at: '' }]
    queueSixBuilders([
      { data: fakeSessions, error: null },
      { data: fakeDecisions, error: null },
      { data: [], error: null }, // risks
      { data: [], error: null }, // docs
      { data: [], error: null }, // context_blocks
      { data: [], error: null }, // next_steps
    ])

    const { useCommander } = await import('@/lib/useCommander')
    const { result } = renderHook(() => useCommander())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe('supabase')
    expect(result.current.sessions).toEqual(fakeSessions)
    expect(result.current.decisions).toEqual(fakeDecisions)
  })

  it('falls back to SEED when at least one query returns an error', async () => {
    queueSixBuilders([
      { data: null, error: { message: 'table missing' } },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
    ])

    const { useCommander } = await import('@/lib/useCommander')
    const { result } = renderHook(() => useCommander())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe('seed')
  })
})
