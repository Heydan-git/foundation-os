/**
 * Mock helper for @/lib/supabase used in unit tests.
 *
 * Usage:
 *   import { vi } from 'vitest'
 *   import { createSupabaseMock, createQueryBuilder } from './mocks/supabase'
 *
 *   const { mockSupabase } = vi.hoisted(() => ({
 *     mockSupabase: createSupabaseMock(),
 *   }))
 *   vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }))
 */
import { vi } from 'vitest'

export interface QueryResult<T = unknown> {
  data: T | null
  error: { message: string } | null
}

/**
 * createQueryBuilder — returns a thenable that fakes Supabase's PostgrestFilterBuilder.
 * All chain methods return the builder itself; `single()` and the implicit `then()` resolve
 * to the provided result so both `await chain.single()` and `await chain` work.
 */
export function createQueryBuilder<T = unknown>(result: QueryResult<T> = { data: null, error: null }) {
  const resolved = Promise.resolve(result)
  const builder: any = {}
  const passthroughMethods = ['select', 'insert', 'update', 'delete', 'eq', 'not', 'order', 'limit', 'match']
  for (const m of passthroughMethods) {
    builder[m] = vi.fn(() => builder)
  }
  builder.single = vi.fn(() => resolved)
  builder.then = (onFulfilled: any, onRejected: any) => resolved.then(onFulfilled, onRejected)
  return builder
}

/**
 * createSupabaseMock — returns a fake supabase client with mockable `from` and `auth`.
 * By default, every `from(...)` call returns an empty success result. Tests override per-call
 * with `mockSupabase.from.mockReturnValueOnce(createQueryBuilder({ data, error }))`.
 */
export function createSupabaseMock() {
  const from = vi.fn(() => createQueryBuilder({ data: [], error: null }))

  const auth = {
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    signInWithPassword: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    signUp: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
  }

  return { from, auth }
}

export type SupabaseMock = ReturnType<typeof createSupabaseMock>
