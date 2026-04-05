import { describe, it, expect } from 'vitest'
import { supabase } from '@/lib/supabase'

describe('Supabase client', () => {
  it('exists and has expected methods', () => {
    expect(supabase).toBeDefined()
    expect(supabase.from).toBeDefined()
    expect(supabase.auth).toBeDefined()
  })

  it('can reference all 6 tables without error', () => {
    const tables = ['sessions', 'decisions', 'risks', 'next_steps', 'context_blocks', 'docs'] as const
    for (const table of tables) {
      const query = supabase.from(table).select('*')
      expect(query).toBeDefined()
    }
  })
})
