/**
 * mutations.ts - CRUD operations for Foundation OS
 * Real Supabase implementation for sessions, decisions, risks, next steps, context
 */

import { supabase } from './supabase'
import type { Database } from './database.types'

type SessionInsert = Database['public']['Tables']['sessions']['Insert']
type SessionUpdate = Database['public']['Tables']['sessions']['Update']
type DecisionInsert = Database['public']['Tables']['decisions']['Insert']
type DecisionUpdate = Database['public']['Tables']['decisions']['Update']
type RiskInsert = Database['public']['Tables']['risks']['Insert']
type RiskUpdate = Database['public']['Tables']['risks']['Update']
type NextStepInsert = Database['public']['Tables']['next_steps']['Insert']
type ContextBlockInsert = Database['public']['Tables']['context_blocks']['Insert']

// ── Commander Mutations Hook ─────────────────────────────────────────

export const useCommanderMutations = () => {

  // ── Sessions CRUD ─────────────────────────────────────────────────

  const createSession = async (sessionData: Partial<SessionInsert>) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          date: sessionData.date || new Date().toISOString().split('T')[0],
          title: sessionData.title || 'Nouvelle session',
          items: sessionData.items || null,
          decisions: sessionData.decisions || null,
          phase: sessionData.phase || '01',
          status: sessionData.status || 'active',
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error creating session:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  const updateSession = async (sessionId: string, updates: SessionUpdate) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error updating session:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error
      return { success: true }
    } catch (error: unknown) {
      console.error('Error deleting session:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  // ── Decisions CRUD ─────────────────────────────────────────────────

  const createDecision = async (decisionData: Partial<DecisionInsert>) => {
    try {
      const { data, error } = await supabase
        .from('decisions')
        .insert({
          date: decisionData.date || new Date().toISOString().split('T')[0],
          title: decisionData.title || 'Nouvelle decision',
          context: decisionData.context || null,
          impact: decisionData.impact || 'medium',
          status: decisionData.status || 'active',
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error creating decision:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  const updateDecision = async (decisionId: string, updates: DecisionUpdate) => {
    try {
      const { data, error } = await supabase
        .from('decisions')
        .update(updates)
        .eq('id', decisionId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error updating decision:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  // ── Next Steps CRUD ─────────────────────────────────────────────────

  const markStepDone = async (stepId: string) => {
    try {
      const { data, error } = await supabase
        .from('next_steps')
        .update({ status: 'done' })
        .eq('id', stepId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error marking step done:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  const createNextStep = async (stepData: Partial<NextStepInsert>) => {
    try {
      const { data, error } = await supabase
        .from('next_steps')
        .insert({
          label: stepData.label || 'Nouvelle action',
          phase: stepData.phase || '01',
          priority: stepData.priority || 'medium',
          status: stepData.status || 'todo',
          sort_order: stepData.sort_order || 0,
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error creating next step:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  // ── Risks CRUD ─────────────────────────────────────────────────────

  const addRisk = async (riskData: Partial<RiskInsert>) => {
    try {
      const { data, error } = await supabase
        .from('risks')
        .insert({
          risk: riskData.risk || 'Nouveau risque',
          impact: riskData.impact || 'medium',
          proba: riskData.proba || 'medium',
          mitigation: riskData.mitigation || null,
          status: riskData.status || 'open',
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error adding risk:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  const updateRisk = async (riskId: string, updates: RiskUpdate) => {
    try {
      const { data, error } = await supabase
        .from('risks')
        .update(updates)
        .eq('id', riskId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error updating risk:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  // ── Context CRUD ─────────────────────────────────────────────────

  const addContext = async (contextData: Partial<ContextBlockInsert>) => {
    try {
      const { data, error } = await supabase
        .from('context_blocks')
        .insert({
          label: contextData.label || 'Nouveau contexte',
          content: contextData.content || '',
          sort_order: contextData.sort_order || 0,
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error adding context:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  // ── Batch Operations ─────────────────────────────────────────────────

  const batchCreateNextSteps = async (phase: string, steps: string[]) => {
    try {
      const stepData = steps.map((label, index) => ({
        label,
        phase,
        priority: 'medium' as const,
        status: 'todo' as const,
        sort_order: index,
      }))

      const { data, error } = await supabase
        .from('next_steps')
        .insert(stepData)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error: unknown) {
      console.error('Error batch creating steps:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  // ── Real Data Getters (for debugging) ─────────────────────────────────

  const getAllData = async () => {
    try {
      const [sessions, decisions, risks, nextSteps, context] = await Promise.all([
        supabase.from('sessions').select('*'),
        supabase.from('decisions').select('*'),
        supabase.from('risks').select('*'),
        supabase.from('next_steps').select('*'),
        supabase.from('context_blocks').select('*'),
      ])

      return {
        sessions: sessions.data || [],
        decisions: decisions.data || [],
        risks: risks.data || [],
        nextSteps: nextSteps.data || [],
        context: context.data || [],
      }
    } catch (error: unknown) {
      console.error('Error fetching all data:', error)
      return { sessions: [], decisions: [], risks: [], nextSteps: [], context: [] }
    }
  }

  const clearAllData = async () => {
    if (!import.meta.env.DEV) {
      console.error('clearAllData is only available in development mode')
      return { success: false, error: 'clearAllData is only available in development mode' }
    }
    try {
      await Promise.all([
        supabase.from('sessions').delete().not('id', 'is', null),
        supabase.from('decisions').delete().not('id', 'is', null),
        supabase.from('risks').delete().not('id', 'is', null),
        supabase.from('next_steps').delete().not('id', 'is', null),
        supabase.from('context_blocks').delete().not('id', 'is', null),
      ])
      return { success: true }
    } catch (error: unknown) {
      console.error('Error clearing data:', error)
      return { success: false, error: error instanceof Error ? error.message : (error as { message?: string })?.message ?? String(error) }
    }
  }

  // ── Return all mutations ─────────────────────────────────────────────

  return {
    createSession,
    updateSession,
    deleteSession,
    createDecision,
    updateDecision,
    markStepDone,
    createNextStep,
    batchCreateNextSteps,
    addRisk,
    updateRisk,
    addContext,
    getAllData,
    clearAllData,
  }
}
