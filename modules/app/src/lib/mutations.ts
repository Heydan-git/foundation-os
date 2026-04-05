/**
 * mutations.ts - CRUD operations for Foundation OS
 * Real Supabase implementation for sessions, decisions, risks, next steps, context
 */

import { supabase } from './supabase'

// ── Commander Mutations Hook ─────────────────────────────────────────

export const useCommanderMutations = () => {

  // ── Sessions CRUD ─────────────────────────────────────────────────

  const createSession = async (sessionData: any) => {
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
      console.log('Session created:', data.id)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating session:', error)
      return { success: false, error: error.message }
    }
  }

  const updateSession = async (sessionId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      console.log('Session updated:', sessionId)
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
      console.log('Session deleted:', sessionId)
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting session:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Decisions CRUD ─────────────────────────────────────────────────

  const createDecision = async (decisionData: any) => {
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
      console.log('Decision created:', data.id)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating decision:', error)
      return { success: false, error: error.message }
    }
  }

  const updateDecision = async (decisionId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('decisions')
        .update(updates)
        .eq('id', decisionId)
        .select()
        .single()

      if (error) throw error
      console.log('Decision updated:', decisionId)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error updating decision:', error)
      return { success: false, error: error.message }
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
      console.log('Step marked done:', stepId)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error marking step done:', error)
      return { success: false, error: error.message }
    }
  }

  const createNextStep = async (stepData: any) => {
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
      console.log('Next step created:', data.id)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating next step:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Risks CRUD ─────────────────────────────────────────────────────

  const addRisk = async (riskData: any) => {
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
      console.log('Risk added:', data.id)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error adding risk:', error)
      return { success: false, error: error.message }
    }
  }

  const updateRisk = async (riskId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('risks')
        .update(updates)
        .eq('id', riskId)
        .select()
        .single()

      if (error) throw error
      console.log('Risk updated:', riskId)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error updating risk:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Context CRUD ─────────────────────────────────────────────────

  const addContext = async (contextData: any) => {
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
      console.log('Context added:', data.id)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error adding context:', error)
      return { success: false, error: error.message }
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
      console.log(`Batch created ${data.length} steps for phase ${phase}`)
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
        supabase.from('context_blocks').select('*'),
      ])

      return {
        sessions: sessions.data || [],
        decisions: decisions.data || [],
        risks: risks.data || [],
        nextSteps: nextSteps.data || [],
        context: context.data || [],
      }
    } catch (error: any) {
      console.error('Error fetching all data:', error)
      return { sessions: [], decisions: [], risks: [], nextSteps: [], context: [] }
    }
  }

  const clearAllData = async () => {
    try {
      await Promise.all([
        supabase.from('sessions').delete().not('id', 'is', null),
        supabase.from('decisions').delete().not('id', 'is', null),
        supabase.from('risks').delete().not('id', 'is', null),
        supabase.from('next_steps').delete().not('id', 'is', null),
        supabase.from('context_blocks').delete().not('id', 'is', null),
      ])
      console.log('All data cleared')
      return { success: true }
    } catch (error: any) {
      console.error('Error clearing data:', error)
      return { success: false, error: error.message }
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
