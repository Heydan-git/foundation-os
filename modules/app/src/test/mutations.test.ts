/**
 * mutations.test.ts — unit tests for useCommanderMutations
 * Mocks @/lib/supabase to isolate the CRUD logic from the real database.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createSupabaseMock, createQueryBuilder } from './mocks/supabase'

const { mockSupabase } = vi.hoisted(() => ({
  mockSupabase: {
    from: (() => {}) as any,
    auth: {} as any,
  },
}))

vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }))

// Re-bind the hoisted ref to a fresh mock before each test (cant assign in hoisted block).
beforeEach(() => {
  const fresh = createSupabaseMock()
  mockSupabase.from = fresh.from
  mockSupabase.auth = fresh.auth
})

describe('useCommanderMutations', () => {
  it('createSession returns success with data on insert OK', async () => {
    const fakeRow = { id: 'CONV-99', title: 'Test', date: '2026-04-07' }
    mockSupabase.from.mockReturnValueOnce(createQueryBuilder({ data: fakeRow, error: null }))

    const { useCommanderMutations } = await import('@/lib/mutations')
    const { createSession } = useCommanderMutations()
    const result = await createSession({ title: 'Test' })

    expect(result.success).toBe(true)
    expect(result.data).toEqual(fakeRow)
    expect(mockSupabase.from).toHaveBeenCalledWith('sessions')
  })

  it('createSession returns failure when supabase reports an error', async () => {
    mockSupabase.from.mockReturnValueOnce(
      createQueryBuilder({ data: null, error: { message: 'duplicate key' } }),
    )

    const { useCommanderMutations } = await import('@/lib/mutations')
    const { createSession } = useCommanderMutations()
    const result = await createSession({ title: 'Test' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('duplicate key')
  })

  it('updateSession passes the id via .eq and returns success', async () => {
    const fakeRow = { id: 'CONV-01', title: 'Renamed' }
    const builder = createQueryBuilder({ data: fakeRow, error: null })
    mockSupabase.from.mockReturnValueOnce(builder)

    const { useCommanderMutations } = await import('@/lib/mutations')
    const { updateSession } = useCommanderMutations()
    const result = await updateSession('CONV-01', { title: 'Renamed' })

    expect(result.success).toBe(true)
    expect(result.data).toEqual(fakeRow)
    expect(builder.update).toHaveBeenCalledWith({ title: 'Renamed' })
    expect(builder.eq).toHaveBeenCalledWith('id', 'CONV-01')
  })

  it('deleteSession returns success when no error', async () => {
    mockSupabase.from.mockReturnValueOnce(createQueryBuilder({ data: null, error: null }))

    const { useCommanderMutations } = await import('@/lib/mutations')
    const { deleteSession } = useCommanderMutations()
    const result = await deleteSession('CONV-42')

    expect(result.success).toBe(true)
    expect(mockSupabase.from).toHaveBeenCalledWith('sessions')
  })

  it('markStepDone returns failure on supabase error', async () => {
    mockSupabase.from.mockReturnValueOnce(
      createQueryBuilder({ data: null, error: { message: 'row not found' } }),
    )

    const { useCommanderMutations } = await import('@/lib/mutations')
    const { markStepDone } = useCommanderMutations()
    const result = await markStepDone('NS-99')

    expect(result.success).toBe(false)
    expect(result.error).toBe('row not found')
  })
})
