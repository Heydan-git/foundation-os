/**
 * AuthContext.test.tsx — tests the auth wrapper around supabase.auth.
 * Mocks supabase.auth so signIn / signUp / signOut paths can be exercised
 * without hitting the real backend.
 */
import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { createSupabaseMock } from './mocks/supabase'

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

async function renderAuth() {
  const { AuthProvider, useAuth } = await import('@/lib/AuthContext')
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(AuthProvider, null, children)
  const utils = renderHook(() => useAuth(), { wrapper })
  await waitFor(() => expect(utils.result.current.loading).toBe(false))
  return utils
}

describe('AuthContext', () => {
  it('signIn returns { error: null } on success and calls supabase with the credentials', async () => {
    mockSupabase.auth.signInWithPassword = vi.fn(() => Promise.resolve({ data: {}, error: null }))

    const { result } = await renderAuth()
    let response: any
    await act(async () => {
      response = await result.current.signIn('me@example.com', 'pwd12345')
    })

    expect(response).toEqual({ error: null })
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'me@example.com',
      password: 'pwd12345',
    })
  })

  it('signIn surfaces the error message when supabase rejects', async () => {
    mockSupabase.auth.signInWithPassword = vi.fn(() =>
      Promise.resolve({ data: {}, error: { message: 'invalid credentials' } }),
    )

    const { result } = await renderAuth()
    let response: any
    await act(async () => {
      response = await result.current.signIn('bad@example.com', 'wrong')
    })

    expect(response).toEqual({ error: 'invalid credentials' })
  })

  it('signUp returns { error: null } and forwards credentials', async () => {
    mockSupabase.auth.signUp = vi.fn(() => Promise.resolve({ data: {}, error: null }))

    const { result } = await renderAuth()
    let response: any
    await act(async () => {
      response = await result.current.signUp('new@example.com', 'pwd12345')
    })

    expect(response).toEqual({ error: null })
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'pwd12345',
    })
  })

  it('signOut calls supabase.auth.signOut', async () => {
    const signOutSpy = vi.fn(() => Promise.resolve({ error: null }))
    mockSupabase.auth.signOut = signOutSpy

    const { result } = await renderAuth()
    await act(async () => {
      await result.current.signOut()
    })

    expect(signOutSpy).toHaveBeenCalledTimes(1)
  })
})
