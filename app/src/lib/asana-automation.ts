/**
 * asana-automation.ts — Foundation OS Phase 5 "Connected"
 * Asana Automation Engine for intelligent task management
 * Architecture: MCP-powered bidirectional sync + ML workflow optimization
 */

import { supabase } from './supabase'

// ── Asana MCP Tools Interface ────────────────────────────────────────────
export interface AsanaMCPTools {
  // Project Management
  createProject: (params: any) => Promise<any>
  getProjects: (params?: any) => Promise<any>
  getProject: (params: any) => Promise<any>
  createProjectStatusUpdate: (params: any) => Promise<any>

  // Task Operations
  createTask: (params: any) => Promise<any>
  getTasks: (params?: any) => Promise<any>
  updateTasks: (params: any) => Promise<any>
  deleteTask: (params: any) => Promise<any>
  addComment: (params: any) => Promise<any>

  // Portfolio & Team
  getPortfolios: (params?: any) => Promise<any>
  getUsers: (params?: any) => Promise<any>
  getTeams: (params?: any) => Promise<any>

  // Search & Discovery
  searchObjects: (params: any) => Promise<any>
  searchTasks: (params: any) => Promise<any>
}

// ── Type Definitions ─────────────────────────────────────────────────────

interface AsanaAutomationConfig {
  workspaceId: string
  teamIds: {
    architecture: string
    development: string
    qa: string
    documentation: string
  }
  projectTemplates: {
    phase: string
    session: string
    milestone: string
  }
  automationRules: {
    autoAssignment: boolean
    deadlineTracking: boolean
    progressUpdates: boolean
    riskEscalation: boolean
  }
  syncInterval: number
  retryAttempts: number
}

interface AutomationWorkflow {
  id: string
  name: string
  trigger: 'session_created' | 'decision_recorded' | 'risk_identified' | 'step_added'
  source: 'foundation'
  target: 'asana'
  mapping: WorkflowMapping
  enabled: boolean
  successRate: number
  avgLatency: number
}

interface WorkflowMapping {
  entityType: 'session' | 'decision' | 'risk' | 'nextstep'
  asanaType: 'project' | 'milestone' | 'task' | 'subtask'
  fieldMappings: Record<string, string>
  assignmentRules: AssignmentRule[]
  statusMappings: Record<string, string>
}

interface AssignmentRule {
  condition: string
  teamId: string
  userId?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface AutomationEvent {
  id: string
  timestamp: string
  workflowId: string
  sourceEntity: string
  sourceEntityId: string
  targetType: 'project' | 'task' | 'milestone'
  targetId?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  latency?: number
  error?: string
}

interface AsanaMapping {
  foundationId: string
  foundationType: string
  asanaId: string
  asanaType: string
  lastSync: string
  version: number
}

// ── Main Asana Automation Engine Class ───────────────────────────────────

export class AsanaAutomationEngine {
  private config: AsanaAutomationConfig
  private isRunning: boolean = false
  private workflows: Map<string, AutomationWorkflow> = new Map()
  private eventQueue: AutomationEvent[] = []
  private mappings: Map<string, AsanaMapping> = new Map()
  private automationInterval?: NodeJS.Timeout
  private mcpTools?: AsanaMCPTools

  constructor(config: AsanaAutomationConfig) {
    this.config = config
    this.initializeWorkflows()
    this.loadMappings()
  }

  // ── Core Automation Management ───────────────────────────────────────────

  async start(): Promise<void> {
    if (this.isRunning) return

    console.log('🚀 Starting Asana Automation Engine...')
    this.isRunning = true

    // Initialize MCP tools (mock for now - would be loaded dynamically)
    await this.initializeMCPTools()

    // Verify Asana workspace access
    await this.verifyAsanaAccess()

    // Start automation processing
    this.automationInterval = setInterval(
      () => this.processEventQueue(),
      this.config.syncInterval
    )

    // Setup Foundation OS webhooks/listeners
    this.setupFoundationOSListeners()

    console.log('✅ Asana Automation Engine started')
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return

    console.log('⏹️ Stopping Asana Automation Engine...')
    this.isRunning = false

    if (this.automationInterval) {
      clearInterval(this.automationInterval)
    }

    console.log('✅ Asana Automation Engine stopped')
  }

  // ── Workflow Management ───────────────────────────────────────────────────

  private initializeWorkflows(): void {
    // Workflow 1: Session → Project Creation
    this.workflows.set('session-to-project', {
      id: 'session-to-project',
      name: 'Session → Project Creation',
      trigger: 'session_created',
      source: 'foundation',
      target: 'asana',
      mapping: {
        entityType: 'session',
        asanaType: 'project',
        fieldMappings: {
          title: 'name',
          phase: 'custom_field_phase',
          date: 'start_on',
          status: 'archived'
        },
        assignmentRules: [
          {
            condition: 'phase == "01" || phase == "02"',
            teamId: this.config.teamIds.architecture,
            priority: 'high'
          },
          {
            condition: 'phase == "03" || phase == "04"',
            teamId: this.config.teamIds.development,
            priority: 'medium'
          }
        ],
        statusMappings: {
          'active': 'in_progress',
          'closed': 'completed'
        }
      },
      enabled: true,
      successRate: 0.95,
      avgLatency: 2300
    })

    // Workflow 2: ADR → Milestone Tracking
    this.workflows.set('decision-to-milestone', {
      id: 'decision-to-milestone',
      name: 'ADR → Milestone Tracking',
      trigger: 'decision_recorded',
      source: 'foundation',
      target: 'asana',
      mapping: {
        entityType: 'decision',
        asanaType: 'milestone',
        fieldMappings: {
          title: 'name',
          context: 'notes',
          impact: 'custom_field_impact',
          status: 'completed'
        },
        assignmentRules: [
          {
            condition: 'impact == "high" || impact == "critical"',
            teamId: this.config.teamIds.architecture,
            priority: 'urgent'
          },
          {
            condition: 'impact == "medium"',
            teamId: this.config.teamIds.development,
            priority: 'high'
          }
        ],
        statusMappings: {
          'active': 'in_progress',
          'implemented': 'completed',
          'superseded': 'cancelled'
        }
      },
      enabled: true,
      successRate: 0.98,
      avgLatency: 1800
    })

    // Workflow 3: Risk → Issue Management
    this.workflows.set('risk-to-issue', {
      id: 'risk-to-issue',
      name: 'Risk → Issue Management',
      trigger: 'risk_identified',
      source: 'foundation',
      target: 'asana',
      mapping: {
        entityType: 'risk',
        asanaType: 'task',
        fieldMappings: {
          risk: 'name',
          mitigation: 'notes',
          impact: 'custom_field_impact',
          proba: 'custom_field_probability'
        },
        assignmentRules: [
          {
            condition: 'impact == "high" && proba == "high"',
            teamId: this.config.teamIds.architecture,
            priority: 'urgent'
          },
          {
            condition: 'impact == "medium" || proba == "medium"',
            teamId: this.config.teamIds.development,
            priority: 'high'
          }
        ],
        statusMappings: {
          'open': 'new',
          'mitigated': 'in_progress',
          'closed': 'completed'
        }
      },
      enabled: true,
      successRate: 0.91,
      avgLatency: 3100
    })

    // Workflow 4: Next Steps → Task Automation
    this.workflows.set('step-to-task', {
      id: 'step-to-task',
      name: 'Next Steps → Task Automation',
      trigger: 'step_added',
      source: 'foundation',
      target: 'asana',
      mapping: {
        entityType: 'nextstep',
        asanaType: 'task',
        fieldMappings: {
          label: 'name',
          phase: 'custom_field_phase',
          priority: 'custom_field_priority'
        },
        assignmentRules: [
          {
            condition: 'priority == "critical"',
            teamId: this.config.teamIds.development,
            priority: 'urgent'
          },
          {
            condition: 'priority == "high"',
            teamId: this.config.teamIds.development,
            priority: 'high'
          },
          {
            condition: 'phase.includes("review")',
            teamId: this.config.teamIds.qa,
            priority: 'medium'
          }
        ],
        statusMappings: {
          'todo': 'new',
          'in_progress': 'in_progress',
          'done': 'completed'
        }
      },
      enabled: true,
      successRate: 0.97,
      avgLatency: 2000
    })
  }

  // ── Event Processing ──────────────────────────────────────────────────────

  private async processEventQueue(): Promise<void> {
    if (!this.isRunning || this.eventQueue.length === 0) return

    console.log(`🔄 Processing ${this.eventQueue.length} automation events...`)

    const pendingEvents = this.eventQueue.filter(event => event.status === 'pending')

    for (const event of pendingEvents.slice(0, 10)) { // Process max 10 at once
      await this.processAutomationEvent(event)
    }

    // Clean up completed/failed events older than 24h
    this.cleanupEventQueue()
  }

  private async processAutomationEvent(event: AutomationEvent): Promise<void> {
    const startTime = Date.now()
    event.status = 'processing'

    try {
      const workflow = this.workflows.get(event.workflowId)
      if (!workflow) {
        throw new Error(`Workflow ${event.workflowId} not found`)
      }

      // Get source entity data
      const sourceData = await this.getFoundationEntity(
        workflow.mapping.entityType,
        event.sourceEntityId
      )

      if (!sourceData) {
        throw new Error(`Source entity ${event.sourceEntityId} not found`)
      }

      // Execute workflow based on target type
      let asanaResult: any
      switch (workflow.mapping.asanaType) {
        case 'project':
          asanaResult = await this.createAsanaProject(workflow, sourceData)
          break
        case 'task':
        case 'subtask':
          asanaResult = await this.createAsanaTask(workflow, sourceData)
          break
        case 'milestone':
          asanaResult = await this.createAsanaMilestone(workflow, sourceData)
          break
        default:
          throw new Error(`Unsupported target type: ${workflow.mapping.asanaType}`)
      }

      // Store mapping
      this.createMapping(
        event.sourceEntityId,
        workflow.mapping.entityType,
        asanaResult.gid,
        workflow.mapping.asanaType
      )

      // Update event status
      event.status = 'completed'
      event.targetId = asanaResult.gid
      event.latency = Date.now() - startTime

      // Update workflow metrics
      this.updateWorkflowMetrics(workflow, true, event.latency)

      console.log(`✅ Workflow ${workflow.name} completed in ${event.latency}ms`)

    } catch (error) {
      event.status = 'failed'
      event.error = String(error)
      event.latency = Date.now() - startTime

      // Update workflow metrics
      const workflow = this.workflows.get(event.workflowId)
      if (workflow) {
        this.updateWorkflowMetrics(workflow, false, event.latency)
      }

      console.error(`❌ Workflow ${event.workflowId} failed:`, error)
    }
  }

  // ── Asana Entity Creation ─────────────────────────────────────────────────

  private async createAsanaProject(
    workflow: AutomationWorkflow,
    sourceData: any
  ): Promise<any> {
    const projectData = this.transformToAsanaProject(workflow, sourceData)

    if (!this.mcpTools) {
      // Mock for development
      return {
        gid: `mock-project-${Date.now()}`,
        name: projectData.name,
        created_at: new Date().toISOString()
      }
    }

    return await this.mcpTools.createProject(projectData)
  }

  private async createAsanaTask(
    workflow: AutomationWorkflow,
    sourceData: any
  ): Promise<any> {
    const taskData = this.transformToAsanaTask(workflow, sourceData)

    if (!this.mcpTools) {
      // Mock for development
      return {
        gid: `mock-task-${Date.now()}`,
        name: taskData.name,
        created_at: new Date().toISOString()
      }
    }

    return await this.mcpTools.createTask(taskData)
  }

  private async createAsanaMilestone(
    workflow: AutomationWorkflow,
    sourceData: any
  ): Promise<any> {
    // Milestones in Asana are special tasks with is_milestone: true
    const milestoneData = this.transformToAsanaMilestone(workflow, sourceData)

    if (!this.mcpTools) {
      // Mock for development
      return {
        gid: `mock-milestone-${Date.now()}`,
        name: milestoneData.name,
        created_at: new Date().toISOString()
      }
    }

    return await this.mcpTools.createTask({
      ...milestoneData,
      is_milestone: true
    })
  }

  // ── Data Transformation Methods ───────────────────────────────────────────

  private transformToAsanaProject(
    workflow: AutomationWorkflow,
    sourceData: any
  ): any {
    const mapping = workflow.mapping
    const asanaData: any = {
      name: this.getFieldValue(sourceData, mapping.fieldMappings.title) || 'Untitled Project',
      notes: `Created from Foundation OS Session ${sourceData.id}\n\nPhase: ${sourceData.phase || 'Unknown'}\nDate: ${sourceData.date || 'Not specified'}`,
      team: this.getAssignedTeam(mapping.assignmentRules, sourceData),
      archived: this.mapStatus(sourceData.status, mapping.statusMappings) === 'completed'
    }

    // Add custom fields if supported
    if (sourceData.phase) {
      asanaData.custom_field_phase = sourceData.phase
    }

    return asanaData
  }

  private transformToAsanaTask(
    workflow: AutomationWorkflow,
    sourceData: any
  ): any {
    const mapping = workflow.mapping
    const asanaData: any = {
      name: this.getFieldValue(sourceData, mapping.fieldMappings.risk || mapping.fieldMappings.label) || 'Untitled Task',
      notes: this.buildTaskNotes(workflow.mapping.entityType, sourceData),
      completed: this.mapStatus(sourceData.status, mapping.statusMappings) === 'completed',
      assignee: this.getAssignedUser(mapping.assignmentRules, sourceData)
    }

    // Add priority and custom fields
    const priority = this.getTaskPriority(mapping.assignmentRules, sourceData)
    if (priority) {
      asanaData.custom_field_priority = priority
    }

    return asanaData
  }

  private transformToAsanaMilestone(
    workflow: AutomationWorkflow,
    sourceData: any
  ): any {
    const mapping = workflow.mapping
    const asanaData: any = {
      name: `📍 ${this.getFieldValue(sourceData, mapping.fieldMappings.title) || 'Untitled Milestone'}`,
      notes: `ADR Milestone from Foundation OS\n\nContext: ${sourceData.context || 'Not specified'}\nImpact: ${sourceData.impact || 'Unknown'}\nDecision Date: ${sourceData.date || 'Not specified'}`,
      completed: this.mapStatus(sourceData.status, mapping.statusMappings) === 'completed',
      assignee: this.getAssignedUser(mapping.assignmentRules, sourceData)
    }

    return asanaData
  }

  // ── Foundation OS Data Access ─────────────────────────────────────────────

  private async getFoundationEntity(
    entityType: string,
    entityId: string
  ): Promise<any> {
    const tableName = this.getTableName(entityType)
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', entityId)
      .single()

    if (error) {
      console.error(`Failed to fetch ${entityType} ${entityId}:`, error)
      return null
    }

    return data
  }

  private getTableName(entityType: string): string {
    const tableMap: Record<string, string> = {
      session: 'sessions',
      decision: 'decisions',
      risk: 'risks',
      nextstep: 'next_steps'
    }
    return tableMap[entityType] || entityType
  }

  // ── Utility Methods ───────────────────────────────────────────────────────

  private getFieldValue(sourceData: any, fieldName: string): any {
    return sourceData[fieldName] || sourceData[fieldName.replace('custom_field_', '')] || null
  }

  private mapStatus(sourceStatus: string, statusMappings: Record<string, string>): string {
    return statusMappings[sourceStatus] || sourceStatus || 'new'
  }

  private getAssignedTeam(rules: AssignmentRule[], sourceData: any): string | null {
    for (const rule of rules) {
      if (this.evaluateCondition(rule.condition, sourceData)) {
        return rule.teamId
      }
    }
    return this.config.teamIds.development // Default team
  }

  private getAssignedUser(rules: AssignmentRule[], sourceData: any): string | null {
    for (const rule of rules) {
      if (this.evaluateCondition(rule.condition, sourceData) && rule.userId) {
        return rule.userId
      }
    }
    return null
  }

  private getTaskPriority(rules: AssignmentRule[], sourceData: any): string | null {
    for (const rule of rules) {
      if (this.evaluateCondition(rule.condition, sourceData)) {
        return rule.priority
      }
    }
    return 'medium'
  }

  private evaluateCondition(condition: string, data: any): boolean {
    // Simple condition evaluation - in production would use a proper expression parser
    try {
      // Replace field references with actual values
      let expression = condition
      for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`\\b${key}\\b`, 'g')
        const valueStr = typeof value === 'string' ? `"${value}"` : String(value)
        expression = expression.replace(regex, valueStr)
      }

      // Basic safety check
      if (!/^[\w\s"'==!=><()&|.]+$/.test(expression)) {
        return false
      }

      return eval(expression)
    } catch {
      return false
    }
  }

  private buildTaskNotes(entityType: string, sourceData: any): string {
    switch (entityType) {
      case 'risk':
        return `Risk from Foundation OS\n\nRisk: ${sourceData.risk || 'Not specified'}\nImpact: ${sourceData.impact || 'Unknown'}\nProbability: ${sourceData.proba || 'Unknown'}\nMitigation: ${sourceData.mitigation || 'Not specified'}`

      case 'nextstep':
        return `Next Step from Foundation OS\n\nTask: ${sourceData.label || 'Not specified'}\nPhase: ${sourceData.phase || 'Unknown'}\nPriority: ${sourceData.priority || 'Medium'}`

      default:
        return `Automated task from Foundation OS ${entityType}`
    }
  }

  // ── Event Management ──────────────────────────────────────────────────────

  addAutomationEvent(
    workflowId: string,
    sourceEntity: string,
    sourceEntityId: string,
    targetType: 'project' | 'task' | 'milestone'
  ): void {
    const event: AutomationEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      workflowId,
      sourceEntity,
      sourceEntityId,
      targetType,
      status: 'pending'
    }

    this.eventQueue.push(event)
    console.log(`📋 Added automation event: ${workflowId} for ${sourceEntity} ${sourceEntityId}`)
  }

  private cleanupEventQueue(): void {
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000)
    this.eventQueue = this.eventQueue.filter(event => {
      const eventTime = new Date(event.timestamp).getTime()
      return eventTime > dayAgo || event.status === 'pending' || event.status === 'processing'
    })
  }

  // ── Metrics & Monitoring ──────────────────────────────────────────────────

  private updateWorkflowMetrics(
    workflow: AutomationWorkflow,
    success: boolean,
    latency: number
  ): void {
    // Update success rate (exponential moving average)
    const alpha = 0.1
    workflow.successRate = alpha * (success ? 1 : 0) + (1 - alpha) * workflow.successRate

    // Update average latency
    workflow.avgLatency = alpha * latency + (1 - alpha) * workflow.avgLatency

    // Clamp values
    workflow.successRate = Math.max(0, Math.min(1, workflow.successRate))
    workflow.avgLatency = Math.max(0, workflow.avgLatency)
  }

  // ── Mapping Management ────────────────────────────────────────────────────

  private createMapping(
    foundationId: string,
    foundationType: string,
    asanaId: string,
    asanaType: string
  ): void {
    const mapping: AsanaMapping = {
      foundationId,
      foundationType,
      asanaId,
      asanaType,
      lastSync: new Date().toISOString(),
      version: 1
    }

    this.mappings.set(`${foundationType}-${foundationId}`, mapping)
    this.saveMappings()
  }

  private loadMappings(): void {
    try {
      const stored = localStorage.getItem('asana-automation-mappings')
      if (stored) {
        const data = JSON.parse(stored)
        this.mappings = new Map(Object.entries(data))
      }
    } catch (error) {
      console.warn('Failed to load automation mappings:', error)
    }
  }

  private saveMappings(): void {
    try {
      const data = Object.fromEntries(this.mappings.entries())
      localStorage.setItem('asana-automation-mappings', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save automation mappings:', error)
    }
  }

  // ── Setup & Initialization ────────────────────────────────────────────────

  private async initializeMCPTools(): Promise<void> {
    // In production, this would load the actual MCP tools
    // For now, we'll use mocks for development
    console.log('🔌 Initializing Asana MCP tools (mock mode)...')

    // Mock MCP tools would be loaded here
    // this.mcpTools = await loadAsanaMCPTools()
  }

  private async verifyAsanaAccess(): Promise<void> {
    console.log('🔐 Verifying Asana workspace access...')

    if (!this.mcpTools) {
      console.log('⚠️ Using mock mode - Asana MCP tools not loaded')
      return
    }

    try {
      // Verify access by fetching user info
      await this.mcpTools.getUsers?.({ workspace: this.config.workspaceId })
      console.log('✅ Asana workspace access verified')
    } catch (error) {
      console.error('❌ Failed to verify Asana access:', error)
      throw error
    }
  }

  private setupFoundationOSListeners(): void {
    console.log('👂 Setting up Foundation OS event listeners...')

    // In production, these would be real database triggers/webhooks
    // For demo, we'll simulate some events
    setTimeout(() => {
      this.addAutomationEvent(
        'session-to-project',
        'session',
        'mock-session-1',
        'project'
      )
    }, 10000)

    setTimeout(() => {
      this.addAutomationEvent(
        'decision-to-milestone',
        'decision',
        'mock-decision-1',
        'milestone'
      )
    }, 20000)
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  getStatus() {
    return {
      isRunning: this.isRunning,
      activeWorkflows: Array.from(this.workflows.values()).filter(w => w.enabled).length,
      eventQueueSize: this.eventQueue.length,
      mappingCount: this.mappings.size,
      lastActivity: new Date().toISOString()
    }
  }

  getWorkflows(): AutomationWorkflow[] {
    return Array.from(this.workflows.values())
  }

  getRecentEvents(limit: number = 10): AutomationEvent[] {
    return this.eventQueue
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  async triggerWorkflow(
    workflowId: string,
    sourceEntityId: string
  ): Promise<void> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }

    this.addAutomationEvent(
      workflowId,
      workflow.mapping.entityType,
      sourceEntityId,
      workflow.mapping.asanaType as any
    )
  }

  toggleWorkflow(workflowId: string, enabled: boolean): void {
    const workflow = this.workflows.get(workflowId)
    if (workflow) {
      workflow.enabled = enabled
      console.log(`${enabled ? '✅' : '⏸️'} Workflow ${workflow.name} ${enabled ? 'enabled' : 'disabled'}`)
    }
  }
}

// ── Default Configuration ─────────────────────────────────────────────────────

export const defaultAsanaAutomationConfig: AsanaAutomationConfig = {
  workspaceId: 'foundation-os-workspace',
  teamIds: {
    architecture: 'team-architecture',
    development: 'team-development',
    qa: 'team-qa',
    documentation: 'team-docs'
  },
  projectTemplates: {
    phase: 'template-phase',
    session: 'template-session',
    milestone: 'template-milestone'
  },
  automationRules: {
    autoAssignment: true,
    deadlineTracking: true,
    progressUpdates: true,
    riskEscalation: true
  },
  syncInterval: 15000, // 15 seconds
  retryAttempts: 3
}

// ── Export Singleton Instance ─────────────────────────────────────────────────

export const asanaAutomationEngine = new AsanaAutomationEngine(defaultAsanaAutomationConfig)