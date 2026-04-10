/**
 * useCommander — fetches all Commander data from Supabase
 * Falls back to static seed data when tables are empty or not yet created.
 */
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Session, Decision, Risk, Doc, ContextBlock, NextStep } from './database.types'
import {
  SEED_SESSIONS, SEED_DECISIONS, SEED_RISKS,
  SEED_DOCS, SEED_CONTEXT_BLOCKS, SEED_NEXT_STEPS,
} from './seed-data'

// ── Hook ─────────────────────────────────────────────────────────────

interface CommanderData {
  sessions: Session[]
  decisions: Decision[]
  risks: Risk[]
  docs: Doc[]
  contextBlocks: ContextBlock[]
  nextSteps: NextStep[]
  loading: boolean
  error: string | null
  source: 'supabase' | 'seed'
}

export function useCommander(): CommanderData {
  const [sessions,      setSessions]      = useState<Session[]>([])
  const [decisions,     setDecisions]     = useState<Decision[]>([])
  const [risks,         setRisks]         = useState<Risk[]>([])
  const [docs,          setDocs]          = useState<Doc[]>([])
  const [contextBlocks, setContextBlocks] = useState<ContextBlock[]>([])
  const [nextSteps,     setNextSteps]     = useState<NextStep[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [source,        setSource]        = useState<'supabase' | 'seed'>('seed')

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        const [s, d, r, dc, cb, ns] = await Promise.all([
          supabase.from('sessions').select('*').order('date', { ascending: false }),
          supabase.from('decisions').select('*').order('id'),
          supabase.from('risks').select('*').order('id'),
          supabase.from('docs').select('*').order('sort_order'),
          supabase.from('context_blocks').select('*').order('sort_order'),
          supabase.from('next_steps').select('*').order('sort_order'),
        ])

        if (cancelled) return

        const anyError = [s, d, r, dc, cb, ns].some(q => q.error)
        if (anyError) {
          useSeed()
          return
        }

        const hasSomeData =
          (s.data?.length ?? 0) +
          (d.data?.length ?? 0) +
          (r.data?.length ?? 0) > 0

        if (!hasSomeData) {
          useSeed()
          return
        }

        setSessions(s.data ?? SEED_SESSIONS)
        setDecisions(d.data ?? SEED_DECISIONS)
        setRisks(r.data ?? SEED_RISKS)
        setDocs(dc.data ?? SEED_DOCS)
        setContextBlocks(cb.data ?? SEED_CONTEXT_BLOCKS)
        setNextSteps(ns.data ?? SEED_NEXT_STEPS)
        setSource('supabase')
      } catch {
        if (!cancelled) useSeed()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    function useSeed() {
      setSessions(SEED_SESSIONS)
      setDecisions(SEED_DECISIONS)
      setRisks(SEED_RISKS)
      setDocs(SEED_DOCS)
      setContextBlocks(SEED_CONTEXT_BLOCKS)
      setNextSteps(SEED_NEXT_STEPS)
      setSource('seed')
      setError(null)
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { sessions, decisions, risks, docs, contextBlocks, nextSteps, loading, error, source }
}
