/**
 * mutations.ts - CRUD Hooks for Foundation OS Phase 5
 * Real Supabase implementation + Notion Sync Integration
 * Foundation OS ↔ Notion bidirectional sync with conflict resolution
 */

import { supabase } from './supabase'
import { notionSyncEngine } from './notion-sync-engine'

// Simple types for Foundation OS data structures
interface SessionData {
  id: string
  date: string
  title: string
  items: string
  decisions: string
  phase: string
  status: 'active' | 'closed'
}

// Types DecisionData, RiskData, NextStepData inlined where needed

// ── Commander Mutations Hook ─────────────────────────────────────────

export const useCommanderMutations = () => {

  // ── Sessions CRUD ─────────────────────────────────────────────────

  const createSession = async (sessionData: any) => {
    try {
      const newSession: SessionData = {
        id: sessionData.id || `CONV-${String(Date.now()).slice(-3)}`,
        date: sessionData.date || new Date().toISOString().split('T')[0],
        title: sessionData.title || 'Nouvelle session',
        items: sessionData.items || '',
        decisions: sessionData.decisions || '',
        phase: sessionData.phase || '01',
        status: sessionData.status || 'active'
      }

      // Real Supabase insert with any typing bypass
      const { data, error } = await (supabase as any)
        .from('sessions')
        .insert(newSession)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Real session created:', (data as any).id)

      // Trigger Notion sync for new session
      try {
        if (notionSyncEngine.getStatus().isRunning) {
          await notionSyncEngine.forceSyncAll()
          console.log('🔄 Notion sync triggered for new session')
        }
      } catch (error) {
        console.warn('⚠️ Notion sync failed for session:', error)
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating session:', error)
      return { success: false, error: error.message }
    }
  }

  const updateSession = async (sessionId: string, updates: any) => {
    try {
      const { data, error } = await (supabase as any)
        .from('sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Real session updated:', sessionId)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error updating session:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error

      console.log('✅ Real session deleted:', sessionId)
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting session:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Decisions CRUD ─────────────────────────────────────────────────

  const createDecision = async (decisionData: any) => {
    try {
      const newDecision = {
        id: decisionData.id || `ADR-${String(Date.now()).slice(-3)}`,
        date: decisionData.date || new Date().toISOString().split('T')[0],
        title: decisionData.title || 'Nouvelle décision',
        context: decisionData.context || '',
        impact: decisionData.impact || 'medium',
        status: decisionData.status || 'active'
      }

      const { data, error } = await (supabase as any)
        .from('decisions')
        .insert([newDecision])
        .select()
        .single()

      if (error) throw error

      console.log('✅ Real decision created:', (data as any).id)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating decision:', error)
      return { success: false, error: error.message }
    }
  }

  const updateDecision = async (decisionId: string, updates: any) => {
    try {
      const { data, error } = await (supabase as any)
        .from('decisions')
        .update(updates)
        .eq('id', decisionId)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Real decision updated:', decisionId)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error updating decision:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Next Steps CRUD ─────────────────────────────────────────────────

  const markStepDone = async (stepId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('next_steps')
        .update({ status: 'done' })
        .eq('id', stepId)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Real step marked done:', stepId)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error marking step done:', error)
      return { success: false, error: error.message }
    }
  }

  const createNextStep = async (stepData: any) => {
    try {
      const newStep = {
        id: stepData.id || `STEP-${String(Date.now()).slice(-3)}`,
        created_at: new Date().toISOString(),
        label: stepData.label || 'Nouvelle action',
        phase: stepData.phase || '01',
        priority: stepData.priority || 'medium',
        status: stepData.status || 'todo',
        sort_order: stepData.sort_order || 0
      }

      // Insert to Supabase (replacing former mock array)
      const { error } = await (supabase as any)
        .from('next_steps')
        .insert([newStep])

      if (error) throw error

      console.log('✅ Next step created:', newStep.id)
      return { success: true, data: newStep }
    } catch (error: any) {
      console.error('Error creating next step:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Risks CRUD ─────────────────────────────────────────────────────

  const addRisk = async (riskData: any) => {
    try {
      const newRisk = {
        id: riskData.id || `R-${String(Date.now()).slice(-3)}`,
        risk: riskData.risk || 'Nouveau risque',
        impact: riskData.impact || 'medium',
        proba: riskData.proba || 'medium',
        mitigation: riskData.mitigation || '',
        status: riskData.status || 'open'
      }

      const { data, error } = await (supabase as any)
        .from('risks')
        .insert([newRisk])
        .select()
        .single()

      if (error) throw error

      console.log('✅ Real risk added:', (data as any).id)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error adding risk:', error)
      return { success: false, error: error.message }
    }
  }

  const updateRisk = async (riskId: string, updates: any) => {
    try {
      const { data, error } = await (supabase as any)
        .from('risks')
        .update(updates)
        .eq('id', riskId)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Risk updated:', riskId)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error updating risk:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Context CRUD ─────────────────────────────────────────────────

  const addContext = async (contextData: any) => {
    try {
      const newContext = {
        id: contextData.id || `CTX-${String(Date.now()).slice(-3)}`,
        created_at: new Date().toISOString(),
        label: contextData.label || 'Nouveau contexte',
        content: contextData.content || '',
        sort_order: contextData.sort_order || 0
      }

      // Insert to Supabase (replacing former mock array)
      const { error } = await (supabase as any)
        .from('context_blocks')
        .insert([newContext])

      if (error) throw error

      console.log('✅ Context added:', newContext.id)
      return { success: true, data: newContext }
    } catch (error: any) {
      console.error('Error adding context:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Batch Operations ─────────────────────────────────────────────────

  const batchCreateNextSteps = async (phase: string, steps: string[]) => {
    try {
      const stepData = steps.map((label, index) => ({
        id: `STEP-${phase}-${index + 1}`,
        created_at: new Date().toISOString(),
        label,
        phase,
        priority: 'medium',
        status: 'todo',
        sort_order: index
      }))

      // Batch insert to Supabase
      const { data, error } = await (supabase as any)
        .from('next_steps')
        .insert(stepData)
        .select()

      if (error) throw error

      console.log(`✅ Real batch created ${(data as any[]).length} steps for phase ${phase}`)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error batch creating steps:', error)
      return { success: false, error: error.message }
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
        supabase.from('context_blocks').select('*')
      ])

      return {
        sessions: sessions.data || [],
        decisions: decisions.data || [],
        risks: risks.data || [],
        nextSteps: nextSteps.data || [],
        context: context.data || []
      }
    } catch (error: any) {
      console.error('Error fetching all data:', error)
      return { sessions: [], decisions: [], risks: [], nextSteps: [], context: [] }
    }
  }

  const clearAllData = async () => {
    try {
      await Promise.all([
        supabase.from('sessions').delete().neq('id', ''),
        supabase.from('decisions').delete().neq('id', ''),
        supabase.from('risks').delete().neq('id', ''),
        supabase.from('next_steps').delete().neq('id', ''),
        supabase.from('context_blocks').delete().neq('id', '')
      ])
      console.log('🗑️ All real data cleared')
      return { success: true }
    } catch (error: any) {
      console.error('Error clearing data:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Return all mutations ─────────────────────────────────────────────

  return {
    // Sessions
    createSession,
    updateSession,
    deleteSession,

    // Decisions
    createDecision,
    updateDecision,

    // Next Steps
    markStepDone,
    createNextStep,
    batchCreateNextSteps,

    // Risks
    addRisk,
    updateRisk,

    // Context
    addContext,

    // Debug helpers
    getAllData,
    clearAllData
  }
}

// ── Export individual mutation functions for direct use ─────────────

export const createSession = async (sessionData: any) => {
  const { createSession } = useCommanderMutations()
  return createSession(sessionData)
}

export const markStepDone = async (stepId: string) => {
  const { markStepDone } = useCommanderMutations()
  return markStepDone(stepId)
}

export const addRisk = async (riskData: any) => {
  const { addRisk } = useCommanderMutations()
  return addRisk(riskData)
}

export const updateDecision = async (decisionId: string, updates: any) => {
  const { updateDecision } = useCommanderMutations()
  return updateDecision(decisionId, updates)
}