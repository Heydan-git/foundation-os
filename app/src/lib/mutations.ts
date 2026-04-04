/**
 * mutations.ts - CRUD Hooks for Foundation OS Phase 1
 * Mock implementation until Supabase tables are created
 * Provides write capability to transform read-only museum into working OS
 */

// ── Mock Data Store (temporary until real Supabase tables) ─────────────

let mockSessions: any[] = []
let mockDecisions: any[] = []
let mockRisks: any[] = []
let mockNextSteps: any[] = []
let mockContext: any[] = []

// ── Commander Mutations Hook ─────────────────────────────────────────

export const useCommanderMutations = () => {

  // ── Sessions CRUD ─────────────────────────────────────────────────

  const createSession = async (sessionData: any) => {
    try {
      const newSession = {
        id: sessionData.id || `CONV-${String(Date.now()).slice(-3)}`,
        created_at: new Date().toISOString(),
        date: sessionData.date || new Date().toISOString().split('T')[0],
        title: sessionData.title || 'Nouvelle session',
        items: sessionData.items || '',
        decisions: sessionData.decisions || '',
        phase: sessionData.phase || '01',
        status: sessionData.status || 'active'
      }

      // Store in mock array (until real Supabase)
      mockSessions.push(newSession)

      console.log('✅ Mock session created:', newSession.id)
      return { success: true, data: newSession }
    } catch (error: any) {
      console.error('Error creating session:', error)
      return { success: false, error: error.message }
    }
  }

  const updateSession = async (sessionId: string, updates: any) => {
    try {
      const sessionIndex = mockSessions.findIndex(s => s.id === sessionId)
      if (sessionIndex === -1) {
        throw new Error(`Session ${sessionId} not found`)
      }

      mockSessions[sessionIndex] = { ...mockSessions[sessionIndex], ...updates }

      console.log('✅ Mock session updated:', sessionId)
      return { success: true, data: mockSessions[sessionIndex] }
    } catch (error: any) {
      console.error('Error updating session:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const sessionIndex = mockSessions.findIndex(s => s.id === sessionId)
      if (sessionIndex === -1) {
        throw new Error(`Session ${sessionId} not found`)
      }

      mockSessions.splice(sessionIndex, 1)

      console.log('✅ Mock session deleted:', sessionId)
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
        created_at: new Date().toISOString(),
        date: decisionData.date || new Date().toISOString().split('T')[0],
        title: decisionData.title || 'Nouvelle décision',
        context: decisionData.context || '',
        impact: decisionData.impact || 'medium',
        status: decisionData.status || 'active'
      }

      mockDecisions.push(newDecision)

      console.log('✅ Mock decision created:', newDecision.id)
      return { success: true, data: newDecision }
    } catch (error: any) {
      console.error('Error creating decision:', error)
      return { success: false, error: error.message }
    }
  }

  const updateDecision = async (decisionId: string, updates: any) => {
    try {
      const decisionIndex = mockDecisions.findIndex(d => d.id === decisionId)
      if (decisionIndex === -1) {
        throw new Error(`Decision ${decisionId} not found`)
      }

      mockDecisions[decisionIndex] = { ...mockDecisions[decisionIndex], ...updates }

      console.log('✅ Mock decision updated:', decisionId)
      return { success: true, data: mockDecisions[decisionIndex] }
    } catch (error: any) {
      console.error('Error updating decision:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Next Steps CRUD ─────────────────────────────────────────────────

  const markStepDone = async (stepId: string) => {
    try {
      const stepIndex = mockNextSteps.findIndex(s => s.id === stepId)
      if (stepIndex === -1) {
        throw new Error(`Step ${stepId} not found`)
      }

      mockNextSteps[stepIndex] = {
        ...mockNextSteps[stepIndex],
        status: 'done',
        completed_at: new Date().toISOString()
      }

      console.log('✅ Mock step marked done:', stepId)
      return { success: true, data: mockNextSteps[stepIndex] }
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

      mockNextSteps.push(newStep)

      console.log('✅ Mock next step created:', newStep.id)
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
        created_at: new Date().toISOString(),
        risk: riskData.risk || 'Nouveau risque',
        impact: riskData.impact || 'medium',
        proba: riskData.proba || 'medium',
        mitigation: riskData.mitigation || '',
        status: riskData.status || 'open'
      }

      mockRisks.push(newRisk)

      console.log('✅ Mock risk added:', newRisk.id)
      return { success: true, data: newRisk }
    } catch (error: any) {
      console.error('Error adding risk:', error)
      return { success: false, error: error.message }
    }
  }

  const updateRisk = async (riskId: string, updates: any) => {
    try {
      const riskIndex = mockRisks.findIndex(r => r.id === riskId)
      if (riskIndex === -1) {
        throw new Error(`Risk ${riskId} not found`)
      }

      mockRisks[riskIndex] = { ...mockRisks[riskIndex], ...updates }

      console.log('✅ Mock risk updated:', riskId)
      return { success: true, data: mockRisks[riskIndex] }
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

      mockContext.push(newContext)

      console.log('✅ Mock context added:', newContext.id)
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

      mockNextSteps.push(...stepData)

      console.log(`✅ Mock batch created ${stepData.length} steps for phase ${phase}`)
      return { success: true, data: stepData }
    } catch (error: any) {
      console.error('Error batch creating steps:', error)
      return { success: false, error: error.message }
    }
  }

  // ── Mock Data Getters (for debugging) ─────────────────────────────────

  const getMockData = () => ({
    sessions: mockSessions,
    decisions: mockDecisions,
    risks: mockRisks,
    nextSteps: mockNextSteps,
    context: mockContext
  })

  const clearMockData = () => {
    mockSessions = []
    mockDecisions = []
    mockRisks = []
    mockNextSteps = []
    mockContext = []
    console.log('🗑️ Mock data cleared')
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
    getMockData,
    clearMockData
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