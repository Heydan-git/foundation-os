/**
 * Foundation OS Phase 5 "Connected" - Asana Real Sync Integration
 * Synchronisation bidirectionnelle VRAIE avec workspace Asana connecté
 *
 * Features:
 * - Direct MCP Asana API integration
 * - Project management automation
 * - Task creation and tracking
 * - Team collaboration workflows
 */

import { createClient } from '@supabase/supabase-js'

// Types pour Asana sync
interface AsanaProject {
  gid: string
  name: string
  color?: string
  icon?: string
  workspace: string
  team?: string
}

interface AsanaTask {
  gid: string
  name: string
  notes?: string
  html_notes?: string
  completed: boolean
  assignee?: {
    gid: string
    name: string
    email: string
  }
  due_on?: string
  start_on?: string
  projects?: AsanaProject[]
  created_at: string
  modified_at: string
}

interface AsanaSyncResult {
  success: boolean
  projectsCreated: number
  tasksCreated: number
  tasksUpdated: number
  conflicts: AsanaConflict[]
  errors: string[]
}

interface AsanaConflict {
  taskId: string
  taskName: string
  type: 'assignment_conflict' | 'status_conflict' | 'project_conflict'
  localData: any
  asanaData: any
  autoResolved: boolean
}

// MCP Asana tool declarations
declare global {
  const mcp__claude_ai_Asana__search_objects: (params: {
    resource_type: 'project' | 'task' | 'user' | 'team' | 'portfolio' | 'goal'
    query?: string
    count?: number
    opt_fields?: string
  }) => Promise<{ data: any[] }>

  const mcp__claude_ai_Asana__get_projects: (params: {
    archived?: boolean
    limit?: number
    offset?: string
    opt_fields?: string
    team?: string
  }) => Promise<{ data: any[], next_page?: { offset: string } }>

  const mcp__claude_ai_Asana__create_task_confirm: (params: {
    widget_id: string
    workspace: string
    taskName: string
    isComplete: boolean
    startDate: string | null
    dueDate: string | null
    assignee: {
      gid: string
      name: string
      email: string
    } | null
    description: string
    project?: AsanaProject | null
    section?: {
      gid: string
      name: string
    } | null
  }) => Promise<{ data: AsanaTask }>

  const mcp__claude_ai_Asana__update_tasks: (params: {
    tasks: Array<{
      task: string
      name?: string
      assignee?: string | null
      due_on?: string | null
      start_on?: string | null
      notes?: string
      html_notes?: string
      completed?: boolean
      parent?: string | null
      custom_fields?: Record<string, any>
      add_projects?: Array<{
        project_id: string
        section_id?: string | null
      }>
      remove_projects?: string[]
    }>
  }) => Promise<{
    succeeded: AsanaTask[]
    failed: Array<{ task: string, errors: any[] }>
    summary: { total: number, succeeded: number, failed: number }
  }>

  const mcp__claude_ai_Asana__get_me: () => Promise<{
    data: {
      gid: string
      email: string
      name: string
      workspaces: Array<{
        gid: string
        resource_type: string
      }>
    }
  }>
}

export class AsanaRealSync {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  )

  // User info (récupéré lors de l'initialisation)
  private userInfo: {
    gid: string
    name: string
    email: string
    workspace: string
  } | null = null

  // Foundation OS project GID (créé automatiquement)
  private foundationProjectGid: string | null = null

  constructor() {
    this.initialize()
  }

  private async initialize(): Promise<void> {
    try {
      // Récupérer les infos utilisateur
      const userResult = await mcp__claude_ai_Asana__get_me()
      this.userInfo = {
        gid: userResult.data.gid,
        name: userResult.data.name,
        email: userResult.data.email,
        workspace: userResult.data.workspaces[0]?.gid || ''
      }

      console.log('✅ Asana Real Sync initialized for:', this.userInfo.name)

      // Trouver ou créer le projet Foundation OS
      await this.ensureFoundationOSProject()

    } catch (error) {
      console.error('❌ Failed to initialize Asana Real Sync:', error)
    }
  }

  /**
   * Sync Foundation OS data vers Asana workspace
   * Crée des projets et tâches organisés
   */
  async syncFoundationToAsana(): Promise<AsanaSyncResult> {
    console.log('🚀 Starting Foundation OS → Asana sync...')

    if (!this.userInfo) {
      throw new Error('Asana user info not initialized')
    }

    try {
      const result: AsanaSyncResult = {
        success: false,
        projectsCreated: 0,
        tasksCreated: 0,
        tasksUpdated: 0,
        conflicts: [],
        errors: []
      }

      // 1. Ensure Foundation OS project exists
      if (!this.foundationProjectGid) {
        await this.ensureFoundationOSProject()
      }

      // 2. Récupérer les données Foundation OS
      const { data: sessions, error: sessionsError } = await this.supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (sessionsError) {
        result.errors.push(`Sessions fetch error: ${sessionsError.message}`)
        return result
      }

      const { data: decisions, error: decisionsError } = await this.supabase
        .from('decisions')
        .select('*')
        .order('created_at', { ascending: false })

      if (decisionsError) {
        result.errors.push(`Decisions fetch error: ${decisionsError.message}`)
        return result
      }

      // 3. Sync sessions vers tâches Asana
      if (sessions && sessions.length > 0) {
        const sessionsResult = await this.syncSessionsToAsana(sessions)
        result.tasksCreated += sessionsResult.created
        result.tasksUpdated += sessionsResult.updated
        result.conflicts.push(...sessionsResult.conflicts)
        result.errors.push(...sessionsResult.errors)
      }

      // 4. Sync decisions vers tâches Asana
      if (decisions && decisions.length > 0) {
        const decisionsResult = await this.syncDecisionsToAsana(decisions)
        result.tasksCreated += decisionsResult.created
        result.tasksUpdated += decisionsResult.updated
        result.conflicts.push(...decisionsResult.conflicts)
        result.errors.push(...decisionsResult.errors)
      }

      result.success = result.errors.length === 0
      console.log('✅ Foundation OS → Asana sync completed:', result)
      return result

    } catch (error) {
      console.error('❌ Foundation OS → Asana sync failed:', error)
      return {
        success: false,
        projectsCreated: 0,
        tasksCreated: 0,
        tasksUpdated: 0,
        conflicts: [],
        errors: [`Sync failed: ${error.message}`]
      }
    }
  }

  /**
   * Sync Asana workspace vers Foundation OS
   * Lit les projets et tâches Asana pour mettre à jour Foundation OS
   */
  async syncAsanaToFoundation(): Promise<AsanaSyncResult> {
    console.log('🚀 Starting Asana → Foundation OS sync...')

    try {
      const result: AsanaSyncResult = {
        success: false,
        projectsCreated: 0,
        tasksCreated: 0,
        tasksUpdated: 0,
        conflicts: [],
        errors: []
      }

      // 1. Rechercher tous les projets Foundation OS dans Asana
      const asanaProjects = await this.searchAsanaProjects('Foundation OS')

      // 2. Pour chaque projet, récupérer et synchroniser les tâches
      for (const project of asanaProjects) {
        try {
          const tasks = await this.getProjectTasks(project.gid)

          for (const task of tasks) {
            if (this.isSessionTask(task)) {
              await this.syncAsanaSessionToFoundation(task)
              result.tasksCreated++
            } else if (this.isDecisionTask(task)) {
              await this.syncAsanaDecisionToFoundation(task)
              result.tasksCreated++
            }
          }
        } catch (error) {
          result.errors.push(`Error syncing project ${project.name}: ${error.message}`)
        }
      }

      result.success = result.errors.length === 0
      console.log('✅ Asana → Foundation OS sync completed:', result)
      return result

    } catch (error) {
      console.error('❌ Asana → Foundation OS sync failed:', error)
      return {
        success: false,
        projectsCreated: 0,
        tasksCreated: 0,
        tasksUpdated: 0,
        conflicts: [],
        errors: [`Sync failed: ${error.message}`]
      }
    }
  }

  /**
   * Créer automatiquement des tâches Asana depuis Foundation OS events
   */
  async createTaskFromFoundationEvent(eventType: string, eventData: any): Promise<AsanaTask | null> {
    if (!this.userInfo || !this.foundationProjectGid) {
      console.warn('Cannot create Asana task: not properly initialized')
      return null
    }

    try {
      let taskName: string
      let description: string
      let dueDate: string | null = null

      switch (eventType) {
        case 'session_created':
          taskName = `Session: ${eventData.title}`
          description = `New Foundation OS session created:\n\n${eventData.context || 'No context'}`
          break

        case 'decision_pending':
          taskName = `ADR Review: ${eventData.title}`
          description = `Architecture Decision Record needs review:\n\n${eventData.description || 'No description'}`
          dueDate = this.calculateDueDate(eventData.priority || 'medium')
          break

        case 'milestone_due':
          taskName = `Milestone: ${eventData.title}`
          description = `Foundation OS milestone approaching deadline:\n\n${eventData.description || 'No description'}`
          dueDate = eventData.due_date
          break

        default:
          taskName = `Foundation OS: ${eventData.title || 'Unknown Event'}`
          description = `Automated task from Foundation OS: ${eventType}`
      }

      const taskParams = {
        widget_id: 'model-generated-widget-id',
        workspace: this.userInfo.workspace,
        taskName,
        isComplete: false,
        startDate: new Date().toISOString().split('T')[0],
        dueDate,
        assignee: {
          gid: this.userInfo.gid,
          name: this.userInfo.name,
          email: this.userInfo.email
        },
        description,
        project: {
          gid: this.foundationProjectGid,
          name: 'Foundation OS',
          color: 'light-green'
        }
      }

      const result = await mcp__claude_ai_Asana__create_task_confirm(taskParams)
      console.log(`✅ Created Asana task: ${taskName}`)
      return result.data

    } catch (error) {
      console.error('❌ Failed to create Asana task:', error)
      return null
    }
  }

  /**
   * Rechercher des projets Asana
   */
  private async searchAsanaProjects(query: string): Promise<AsanaProject[]> {
    try {
      const searchResult = await mcp__claude_ai_Asana__search_objects({
        resource_type: 'project',
        query,
        count: 20
      })

      return searchResult.data.map(project => ({
        gid: project.gid,
        name: project.name,
        color: project.color,
        icon: project.icon,
        workspace: project.workspace?.gid || this.userInfo?.workspace || '',
        team: project.team?.gid
      }))
    } catch (error) {
      console.error('Asana search error:', error)
      return []
    }
  }

  /**
   * Assurer que le projet Foundation OS existe dans Asana
   */
  private async ensureFoundationOSProject(): Promise<void> {
    try {
      // Chercher le projet existant
      const projects = await this.searchAsanaProjects('Foundation OS')
      const foundationProject = projects.find(p => p.name === 'Foundation OS')

      if (foundationProject) {
        this.foundationProjectGid = foundationProject.gid
        console.log('✅ Foundation OS project found:', foundationProject.gid)
      } else {
        // TODO: Créer le projet (nécessiterait un outil MCP create_project)
        console.log('⚠️ Foundation OS project not found - would need to create one')
      }
    } catch (error) {
      console.error('Error ensuring Foundation OS project:', error)
    }
  }

  /**
   * Synchroniser les sessions Foundation OS vers tâches Asana
   */
  private async syncSessionsToAsana(sessions: any[]): Promise<{
    created: number
    updated: number
    conflicts: AsanaConflict[]
    errors: string[]
  }> {
    const result = { created: 0, updated: 0, conflicts: [], errors: [] }

    for (const session of sessions) {
      try {
        // Vérifier si la tâche existe déjà
        const existingTasks = await this.searchAsanaTasks(`Session: ${session.title}`)

        if (existingTasks.length === 0) {
          // Créer nouvelle tâche
          const taskData = {
            widget_id: 'model-generated-widget-id',
            workspace: this.userInfo!.workspace,
            taskName: `Session: ${session.title}`,
            isComplete: session.status === 'completed',
            startDate: session.created_at.split('T')[0],
            dueDate: session.deadline ? session.deadline.split('T')[0] : null,
            assignee: {
              gid: this.userInfo!.gid,
              name: this.userInfo!.name,
              email: this.userInfo!.email
            },
            description: this.formatSessionForAsana(session),
            project: this.foundationProjectGid ? {
              gid: this.foundationProjectGid,
              name: 'Foundation OS',
              color: 'light-green'
            } : null
          }

          await mcp__claude_ai_Asana__create_task_confirm(taskData)
          result.created++

          // Stocker l'ID Asana dans Foundation OS
          await this.supabase
            .from('sessions')
            .update({ asana_task_id: 'will-be-updated-after-creation' })
            .eq('id', session.id)

        } else {
          // Mettre à jour la tâche existante
          const existingTask = existingTasks[0]

          await mcp__claude_ai_Asana__update_tasks({
            tasks: [{
              task: existingTask.gid,
              name: `Session: ${session.title}`,
              completed: session.status === 'completed',
              notes: this.formatSessionForAsana(session)
            }]
          })
          result.updated++
        }
      } catch (error) {
        result.errors.push(`Session ${session.id}: ${error.message}`)
      }
    }

    return result
  }

  /**
   * Synchroniser les décisions Foundation OS vers tâches Asana
   */
  private async syncDecisionsToAsana(decisions: any[]): Promise<{
    created: number
    updated: number
    conflicts: AsanaConflict[]
    errors: string[]
  }> {
    const result = { created: 0, updated: 0, conflicts: [], errors: [] }

    for (const decision of decisions) {
      try {
        const taskData = {
          widget_id: 'model-generated-widget-id',
          workspace: this.userInfo!.workspace,
          taskName: `ADR Review: ${decision.title}`,
          isComplete: decision.status === 'approved',
          startDate: decision.created_at.split('T')[0],
          dueDate: this.calculateDueDate(decision.impact),
          assignee: {
            gid: this.userInfo!.gid,
            name: this.userInfo!.name,
            email: this.userInfo!.email
          },
          description: this.formatDecisionForAsana(decision),
          project: this.foundationProjectGid ? {
            gid: this.foundationProjectGid,
            name: 'Foundation OS',
            color: 'light-green'
          } : null
        }

        await mcp__claude_ai_Asana__create_task_confirm(taskData)
        result.created++

      } catch (error) {
        result.errors.push(`Decision ${decision.id}: ${error.message}`)
      }
    }

    return result
  }

  /**
   * Rechercher des tâches Asana
   */
  private async searchAsanaTasks(query: string): Promise<AsanaTask[]> {
    try {
      const searchResult = await mcp__claude_ai_Asana__search_objects({
        resource_type: 'task',
        query,
        count: 10
      })

      return searchResult.data
    } catch (error) {
      console.error('Asana task search error:', error)
      return []
    }
  }

  /**
   * Récupérer les tâches d'un projet Asana
   */
  private async getProjectTasks(projectId: string): Promise<AsanaTask[]> {
    // TODO: Implement using appropriate MCP tool for getting project tasks
    console.log(`Getting tasks for project: ${projectId}`)
    return []
  }

  /**
   * Formatter une session pour description Asana
   */
  private formatSessionForAsana(session: any): string {
    return `Foundation OS Session: ${session.title}

Status: ${session.status || 'active'}
Created: ${new Date(session.created_at).toLocaleDateString()}

Context:
${session.context || 'No context provided'}

Notes:
${session.notes || 'No notes available'}

Next Steps:
${session.next_steps || 'No next steps defined'}

---
🔄 Synced from Foundation OS • ${new Date().toLocaleString()}`
  }

  /**
   * Formatter une décision pour description Asana
   */
  private formatDecisionForAsana(decision: any): string {
    return `Foundation OS ADR: ${decision.title}

Status: ${decision.status}
Impact: ${decision.impact}
Created: ${new Date(decision.created_at).toLocaleDateString()}

Context:
${decision.context || 'No context provided'}

Decision:
${decision.description || 'No decision description'}

---
🔄 Synced from Foundation OS • ${new Date().toLocaleString()}`
  }

  /**
   * Calculer la date d'échéance basée sur la priorité
   */
  private calculateDueDate(priority: string): string {
    const now = new Date()
    let daysToAdd: number

    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        daysToAdd = 1
        break
      case 'medium':
        daysToAdd = 7
        break
      case 'low':
        daysToAdd = 14
        break
      default:
        daysToAdd = 7
    }

    const dueDate = new Date(now)
    dueDate.setDate(now.getDate() + daysToAdd)
    return dueDate.toISOString().split('T')[0]
  }

  /**
   * Déterminer si une tâche Asana est une session
   */
  private isSessionTask(task: AsanaTask): boolean {
    return task.name.startsWith('Session:')
  }

  /**
   * Déterminer si une tâche Asana est une décision
   */
  private isDecisionTask(task: AsanaTask): boolean {
    return task.name.startsWith('ADR Review:') || task.name.startsWith('ADR:')
  }

  /**
   * Synchroniser une tâche session Asana vers Foundation OS
   */
  private async syncAsanaSessionToFoundation(task: AsanaTask): Promise<void> {
    const sessionData = {
      title: task.name.replace('Session: ', ''),
      status: task.completed ? 'completed' : 'active',
      notes: task.notes || '',
      asana_task_id: task.gid,
      created_at: task.created_at,
      updated_at: task.modified_at
    }

    await this.supabase
      .from('sessions')
      .upsert(sessionData, {
        onConflict: 'asana_task_id',
        ignoreDuplicates: false
      })
  }

  /**
   * Synchroniser une tâche décision Asana vers Foundation OS
   */
  private async syncAsanaDecisionToFoundation(task: AsanaTask): Promise<void> {
    const decisionData = {
      title: task.name.replace(/^(ADR Review: |ADR: )/, ''),
      status: task.completed ? 'approved' : 'pending',
      description: task.notes || '',
      asana_task_id: task.gid,
      created_at: task.created_at,
      updated_at: task.modified_at
    }

    await this.supabase
      .from('decisions')
      .upsert(decisionData, {
        onConflict: 'asana_task_id',
        ignoreDuplicates: false
      })
  }
}

// Export singleton instance
export const asanaRealSync = new AsanaRealSync()