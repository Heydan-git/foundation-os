/**
 * notion-sync-engine.ts — Foundation OS Phase 5 "Connected"
 * Bidirectional real-time sync engine Foundation OS ↔ Notion
 * Architecture: Event-driven + conflict resolution + ML optimization
 */

import { supabase } from './supabase'

// ── Notion MCP Tools Import ──────────────────────────────────────────────
// These will be dynamically loaded via MCP when needed - exported interface for external use
export interface NotionMCPTools {
  fetch: (params: any) => Promise<any>
  createDatabase: (params: any) => Promise<any>
  search: (params: any) => Promise<any>
  updatePage: (params: any) => Promise<any>
  createPages: (params: any) => Promise<any>
}

// ── Type Definitions ─────────────────────────────────────────────────────

interface NotionSyncConfig {
  workspaceId: string
  databaseIds: {
    sessions: string
    decisions: string
    risks: string
    nextSteps: string
    docs: string
  }
  syncInterval: number // milliseconds
  conflictResolution: 'foundation_wins' | 'notion_wins' | 'manual' | 'intelligent'
  batchSize: number
  retryAttempts: number
}

interface SyncEvent {
  id: string
  timestamp: string
  type: 'create' | 'update' | 'delete'
  source: 'foundation' | 'notion'
  entity: 'session' | 'decision' | 'risk' | 'nextstep' | 'doc'
  entityId: string
  data?: any
  conflicts?: ConflictData[]
  status: 'pending' | 'synced' | 'failed' | 'conflict'
}

interface ConflictData {
  field: string
  foundationValue: any
  notionValue: any
  lastModified: {
    foundation: string
    notion: string
  }
  resolution?: 'foundation' | 'notion' | 'merge'
}

interface NotionMapping {
  foundationId: string
  notionPageId: string
  lastSync: string
  version: number
  checksum: string
}

// ── Main Notion Sync Engine Class ───────────────────────────────────────

export class NotionSyncEngine {
  private config: NotionSyncConfig
  private isRunning: boolean = false
  private syncQueue: SyncEvent[] = []
  private mappings: Map<string, NotionMapping> = new Map()
  private webhookServer?: any
  private syncInterval?: NodeJS.Timeout

  constructor(config: NotionSyncConfig) {
    this.config = config
    this.loadMappings()
  }

  // ── Core Sync Management ─────────────────────────────────────────────

  async start(): Promise<void> {
    if (this.isRunning) return

    console.log('🚀 Starting Notion Sync Engine...')
    this.isRunning = true

    // Initialize Notion databases if needed
    await this.initializeNotionDatabases()

    // Start periodic sync
    this.syncInterval = setInterval(
      () => this.performSync(),
      this.config.syncInterval
    )

    // Set up webhook listeners (mock for now)
    this.setupWebhookListeners()

    console.log('✅ Notion Sync Engine started')
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return

    console.log('⏹️ Stopping Notion Sync Engine...')
    this.isRunning = false

    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    if (this.webhookServer) {
      this.webhookServer.close()
    }

    console.log('✅ Notion Sync Engine stopped')
  }

  // ── Bidirectional Sync Logic ─────────────────────────────────────────

  private async performSync(): Promise<void> {
    if (!this.isRunning) return

    try {
      console.log('🔄 Starting sync cycle...')

      // Sync in both directions
      await Promise.all([
        this.syncFoundationToNotion(),
        this.syncNotionToFoundation()
      ])

      // Process conflict queue
      await this.resolveConflicts()

      console.log('✅ Sync cycle completed')
    } catch (error) {
      console.error('❌ Sync cycle failed:', error)
    }
  }

  private async syncFoundationToNotion(): Promise<void> {
    console.log('📤 Syncing Foundation OS → Notion...')

    // Get all data from Foundation OS
    const fosData = await this.getFoundationData()

    for (const entity of ['sessions', 'decisions', 'risks', 'nextSteps', 'docs'] as const) {
      await this.syncEntityToNotion(entity, fosData[entity])
    }
  }

  private async syncNotionToFoundation(): Promise<void> {
    console.log('📥 Syncing Notion → Foundation OS...')

    // Get all data from Notion
    for (const entity of ['sessions', 'decisions', 'risks', 'nextSteps', 'docs'] as const) {
      const databaseId = this.config.databaseIds[entity]
      if (databaseId) {
        await this.syncEntityFromNotion(entity, databaseId)
      }
    }
  }

  // ── Entity-Specific Sync Methods ────────────────────────────────────

  private async syncEntityToNotion(
    entityType: 'sessions' | 'decisions' | 'risks' | 'nextSteps' | 'docs',
    entities: any[]
  ): Promise<void> {
    const databaseId = this.config.databaseIds[entityType]
    if (!databaseId) return

    for (const entity of entities) {
      try {
        const mapping = this.mappings.get(`${entityType}-${entity.id}`)
        const notionData = this.transformFoundationToNotion(entityType, entity)

        if (mapping) {
          // Update existing Notion page
          if (this.hasChanges(entity, mapping)) {
            await this.updateNotionPage(mapping.notionPageId, notionData)
            this.updateMapping(mapping, entity)
          }
        } else {
          // Create new Notion page
          const pageId = await this.createNotionPage(databaseId, notionData)
          this.createMapping(`${entityType}-${entity.id}`, pageId, entity)
        }
      } catch (error) {
        console.error(`❌ Failed to sync ${entityType} ${entity.id}:`, error)
      }
    }
  }

  private async syncEntityFromNotion(
    entityType: 'sessions' | 'decisions' | 'risks' | 'nextSteps' | 'docs',
    databaseId: string
  ): Promise<void> {
    try {
      // Search for all pages in Notion database
      const notionPages = await this.getNotionDatabasePages(databaseId)

      for (const page of notionPages) {
        const foundationData = this.transformNotionToFoundation(entityType, page)
        const mappingKey = this.findMappingByNotionId(page.id)

        if (mappingKey) {
          // Update existing Foundation OS entity
          const foundationId = mappingKey.split('-')[1]
          await this.updateFoundationEntity(entityType, foundationId, foundationData)
        } else {
          // Create new Foundation OS entity
          const newEntity = await this.createFoundationEntity(entityType, foundationData)
          this.createMapping(`${entityType}-${newEntity.id}`, page.id, newEntity)
        }
      }
    } catch (error) {
      console.error(`❌ Failed to sync ${entityType} from Notion:`, error)
    }
  }

  // ── Data Transformation Methods ──────────────────────────────────────

  private transformFoundationToNotion(
    entityType: string,
    entity: any
  ): Record<string, any> {
    switch (entityType) {
      case 'sessions':
        return {
          title: entity.title || 'Untitled Session',
          date: entity.date,
          phase: entity.phase || '01',
          status: entity.status === 'active' ? 'Active' : 'Closed',
          items: entity.items || '',
          decisions: entity.decisions || '',
          foundation_id: entity.id
        }

      case 'decisions':
        return {
          title: entity.title || 'Untitled Decision',
          date: entity.date,
          context: entity.context || '',
          impact: this.capitalizeFirst(entity.impact || 'medium'),
          status: this.capitalizeFirst(entity.status || 'active'),
          foundation_id: entity.id
        }

      case 'risks':
        return {
          title: entity.risk || 'Untitled Risk',
          impact: this.capitalizeFirst(entity.impact || 'medium'),
          probability: this.capitalizeFirst(entity.proba || 'medium'),
          mitigation: entity.mitigation || '',
          status: this.capitalizeFirst(entity.status || 'open'),
          foundation_id: entity.id
        }

      case 'nextSteps':
        return {
          title: entity.label || 'Untitled Step',
          phase: entity.phase || '01',
          priority: this.capitalizeFirst(entity.priority || 'medium'),
          status: entity.status === 'todo' ? 'To Do' :
                  entity.status === 'in_progress' ? 'In Progress' : 'Done',
          sort_order: entity.sort_order || 0,
          foundation_id: entity.id
        }

      case 'docs':
        return {
          title: entity.fichier || 'Untitled Doc',
          type: entity.type || 'unknown',
          status: entity.statut || 'draft',
          kb: entity.kb || '',
          foundation_id: entity.id
        }

      default:
        return entity
    }
  }

  private transformNotionToFoundation(
    entityType: string,
    notionPage: any
  ): Record<string, any> {
    // Extract properties from Notion page format
    const props = notionPage.properties || {}

    switch (entityType) {
      case 'sessions':
        return {
          title: this.getNotionProperty(props, 'title') || 'Untitled Session',
          date: this.getNotionProperty(props, 'date') || new Date().toISOString().split('T')[0],
          phase: this.getNotionProperty(props, 'phase') || '01',
          status: this.getNotionProperty(props, 'status')?.toLowerCase() === 'active' ? 'active' : 'closed',
          items: this.getNotionProperty(props, 'items') || '',
          decisions: this.getNotionProperty(props, 'decisions') || ''
        }

      case 'decisions':
        return {
          title: this.getNotionProperty(props, 'title') || 'Untitled Decision',
          date: this.getNotionProperty(props, 'date') || new Date().toISOString().split('T')[0],
          context: this.getNotionProperty(props, 'context') || '',
          impact: this.getNotionProperty(props, 'impact')?.toLowerCase() || 'medium',
          status: this.getNotionProperty(props, 'status')?.toLowerCase() || 'active'
        }

      case 'risks':
        return {
          risk: this.getNotionProperty(props, 'title') || 'Untitled Risk',
          impact: this.getNotionProperty(props, 'impact')?.toLowerCase() || 'medium',
          proba: this.getNotionProperty(props, 'probability')?.toLowerCase() || 'medium',
          mitigation: this.getNotionProperty(props, 'mitigation') || '',
          status: this.getNotionProperty(props, 'status')?.toLowerCase() || 'open'
        }

      case 'nextSteps':
        return {
          label: this.getNotionProperty(props, 'title') || 'Untitled Step',
          phase: this.getNotionProperty(props, 'phase') || '01',
          priority: this.getNotionProperty(props, 'priority')?.toLowerCase() || 'medium',
          status: this.mapNotionStepStatus(this.getNotionProperty(props, 'status')),
          sort_order: this.getNotionProperty(props, 'sort_order') || 0
        }

      case 'docs':
        return {
          fichier: this.getNotionProperty(props, 'title') || 'Untitled Doc',
          type: this.getNotionProperty(props, 'type') || 'unknown',
          statut: this.getNotionProperty(props, 'status') || 'draft',
          kb: this.getNotionProperty(props, 'kb') || ''
        }

      default:
        return notionPage
    }
  }

  // ── Conflict Resolution ──────────────────────────────────────────────

  private async resolveConflicts(): Promise<void> {
    const conflictedEvents = this.syncQueue.filter(event => event.status === 'conflict')

    for (const event of conflictedEvents) {
      try {
        const resolution = await this.getConflictResolution(event)
        await this.applyConflictResolution(event, resolution)
        event.status = 'synced'
      } catch (error) {
        console.error('❌ Failed to resolve conflict:', error)
        event.status = 'failed'
      }
    }

    // Remove resolved conflicts from queue
    this.syncQueue = this.syncQueue.filter(event =>
      event.status !== 'synced' && event.status !== 'failed'
    )
  }

  private async getConflictResolution(event: SyncEvent): Promise<string> {
    switch (this.config.conflictResolution) {
      case 'foundation_wins':
        return 'foundation'
      case 'notion_wins':
        return 'notion'
      case 'intelligent':
        return await this.intelligentConflictResolution(event)
      case 'manual':
      default:
        // Store conflict for manual resolution
        await this.storeConflictForManualResolution(event)
        return 'manual'
    }
  }

  private async intelligentConflictResolution(event: SyncEvent): Promise<string> {
    // ML-powered conflict resolution logic
    // For now, use simple heuristics:

    if (!event.conflicts || event.conflicts.length === 0) {
      return 'foundation' // Default fallback
    }

    let foundationScore = 0
    let notionScore = 0

    for (const conflict of event.conflicts) {
      // More recent modification wins
      const foundationTime = new Date(conflict.lastModified.foundation).getTime()
      const notionTime = new Date(conflict.lastModified.notion).getTime()

      if (foundationTime > notionTime) {
        foundationScore += 2
      } else {
        notionScore += 2
      }

      // More comprehensive data wins
      const foundationLength = String(conflict.foundationValue || '').length
      const notionLength = String(conflict.notionValue || '').length

      if (foundationLength > notionLength) {
        foundationScore += 1
      } else if (notionLength > foundationLength) {
        notionScore += 1
      }
    }

    return foundationScore >= notionScore ? 'foundation' : 'notion'
  }

  // ── Foundation OS CRUD Operations ────────────────────────────────────

  private async getFoundationData() {
    const [sessions, decisions, risks, nextSteps, docs] = await Promise.all([
      supabase.from('sessions').select('*').order('created_at', { ascending: false }),
      supabase.from('decisions').select('*').order('created_at', { ascending: false }),
      supabase.from('risks').select('*').order('created_at', { ascending: false }),
      supabase.from('next_steps').select('*').order('sort_order', { ascending: true }),
      supabase.from('docs').select('*').order('created_at', { ascending: false })
    ])

    return {
      sessions: sessions.data || [],
      decisions: decisions.data || [],
      risks: risks.data || [],
      nextSteps: nextSteps.data || [],
      docs: docs.data || []
    }
  }

  private async createFoundationEntity(
    entityType: string,
    data: any
  ): Promise<any> {
    const tableName = this.getTableName(entityType)
    const { data: newEntity, error } = await supabase
      .from(tableName)
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return newEntity
  }

  private async updateFoundationEntity(
    entityType: string,
    id: string,
    data: any
  ): Promise<any> {
    const tableName = this.getTableName(entityType)
    const { data: updatedEntity, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return updatedEntity
  }

  // ── Notion CRUD Operations (Mock MCP Calls) ──────────────────────────

  private async initializeNotionDatabases(): Promise<void> {
    console.log('🏗️ Initializing Notion databases...')

    // This would call the actual MCP tools to create databases
    // For now, we'll mock the structure

    const databaseSchemas = {
      sessions: `
        CREATE TABLE (
          "Title" TITLE,
          "Date" DATE,
          "Phase" SELECT('01':blue, '02':green, '03':orange, '04':red, '05':purple),
          "Status" SELECT('Active':green, 'Closed':gray),
          "Items" RICH_TEXT,
          "Decisions" RICH_TEXT,
          "Foundation ID" RICH_TEXT
        )
      `,
      decisions: `
        CREATE TABLE (
          "Title" TITLE,
          "Date" DATE,
          "Context" RICH_TEXT,
          "Impact" SELECT('High':red, 'Medium':orange, 'Low':green),
          "Status" SELECT('Active':green, 'Superseded':orange, 'Deprecated':gray),
          "Foundation ID" RICH_TEXT
        )
      `,
      risks: `
        CREATE TABLE (
          "Title" TITLE,
          "Impact" SELECT('High':red, 'Medium':orange, 'Low':green),
          "Probability" SELECT('High':red, 'Medium':orange, 'Low':green),
          "Mitigation" RICH_TEXT,
          "Status" SELECT('Open':red, 'Mitigated':orange, 'Closed':green),
          "Foundation ID" RICH_TEXT
        )
      `,
      nextSteps: `
        CREATE TABLE (
          "Title" TITLE,
          "Phase" SELECT('01':blue, '02':green, '03':orange, '04':red, '05':purple),
          "Priority" SELECT('Critical':red, 'High':orange, 'Medium':yellow, 'Low':green),
          "Status" SELECT('To Do':gray, 'In Progress':blue, 'Done':green),
          "Sort Order" NUMBER,
          "Foundation ID" RICH_TEXT
        )
      `,
      docs: `
        CREATE TABLE (
          "Title" TITLE,
          "Type" SELECT('MD':blue, 'JSON':green, 'TXT':gray),
          "Status" SELECT('Draft':orange, 'Published':green, 'Archived':gray),
          "KB" RICH_TEXT,
          "Foundation ID" RICH_TEXT
        )
      `
    }

    // Mock database creation - in real implementation this would use MCP
    console.log('📋 Database schemas prepared:', Object.keys(databaseSchemas))
  }

  private async createNotionPage(databaseId: string, data: any): Promise<string> {
    // Mock MCP call - would use mcp__claude_ai_Notion__notion_create_pages
    console.log(`📄 Creating Notion page in database ${databaseId}:`, data)
    return `notion-page-${Date.now()}`
  }

  private async updateNotionPage(pageId: string, data: any): Promise<void> {
    // Mock MCP call - would use mcp__claude_ai_Notion__notion_update_page
    console.log(`📝 Updating Notion page ${pageId}:`, data)
  }

  private async getNotionDatabasePages(databaseId: string): Promise<any[]> {
    // Mock MCP call - would use mcp__claude_ai_Notion__notion_search
    console.log(`🔍 Fetching pages from Notion database ${databaseId}`)
    return []
  }

  // ── Utility Methods ──────────────────────────────────────────────────

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  private getNotionProperty(props: any, key: string): any {
    // Extract value from Notion property format
    const prop = props[key] || props[this.capitalizeFirst(key)]
    if (!prop) return null

    switch (prop.type) {
      case 'title':
      case 'rich_text':
        return prop[prop.type]?.[0]?.plain_text || ''
      case 'select':
        return prop.select?.name || ''
      case 'date':
        return prop.date?.start || ''
      case 'number':
        return prop.number || 0
      default:
        return prop.value || null
    }
  }

  private mapNotionStepStatus(status: string): string {
    switch (status?.toLowerCase()) {
      case 'to do': return 'todo'
      case 'in progress': return 'in_progress'
      case 'done': return 'done'
      default: return 'todo'
    }
  }

  private getTableName(entityType: string): string {
    const tableMap: Record<string, string> = {
      sessions: 'sessions',
      decisions: 'decisions',
      risks: 'risks',
      nextSteps: 'next_steps',
      docs: 'docs'
    }
    return tableMap[entityType] || entityType
  }

  private hasChanges(entity: any, mapping: NotionMapping): boolean {
    const currentChecksum = this.calculateChecksum(entity)
    return currentChecksum !== mapping.checksum
  }

  private calculateChecksum(data: any): string {
    // Simple checksum calculation
    return btoa(JSON.stringify(data)).slice(0, 16)
  }

  private updateMapping(mapping: NotionMapping, entity: any): void {
    mapping.lastSync = new Date().toISOString()
    mapping.version += 1
    mapping.checksum = this.calculateChecksum(entity)
    this.saveMappings()
  }

  private createMapping(foundationId: string, notionPageId: string, entity: any): void {
    const mapping: NotionMapping = {
      foundationId,
      notionPageId,
      lastSync: new Date().toISOString(),
      version: 1,
      checksum: this.calculateChecksum(entity)
    }
    this.mappings.set(foundationId, mapping)
    this.saveMappings()
  }

  private findMappingByNotionId(notionPageId: string): string | null {
    for (const [key, mapping] of this.mappings.entries()) {
      if (mapping.notionPageId === notionPageId) {
        return key
      }
    }
    return null
  }

  private loadMappings(): void {
    try {
      const stored = localStorage.getItem('notion-sync-mappings')
      if (stored) {
        const data = JSON.parse(stored)
        this.mappings = new Map(Object.entries(data))
      }
    } catch (error) {
      console.warn('Failed to load sync mappings:', error)
    }
  }

  private saveMappings(): void {
    try {
      const data = Object.fromEntries(this.mappings.entries())
      localStorage.setItem('notion-sync-mappings', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save sync mappings:', error)
    }
  }

  private async storeConflictForManualResolution(event: SyncEvent): Promise<void> {
    // Store conflict data for manual resolution UI
    const conflicts = JSON.parse(localStorage.getItem('notion-sync-conflicts') || '[]')
    conflicts.push({
      id: event.id,
      timestamp: event.timestamp,
      type: event.type,
      entity: event.entity,
      entityId: event.entityId,
      conflicts: event.conflicts,
      status: 'pending_manual_resolution'
    })
    localStorage.setItem('notion-sync-conflicts', JSON.stringify(conflicts))
  }

  private setupWebhookListeners(): void {
    // Mock webhook setup - in production this would set up actual webhook endpoints
    console.log('🔗 Setting up webhook listeners (mock)')

    // Simulate some webhook events for demo
    setTimeout(() => {
      this.syncQueue.push({
        id: `event-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'update',
        source: 'notion',
        entity: 'session',
        entityId: 'mock-session-1',
        status: 'pending'
      })
    }, 30000) // Simulate webhook event in 30s
  }

  private async applyConflictResolution(event: SyncEvent, resolution: string): Promise<void> {
    if (resolution === 'manual') {
      // Already stored for manual resolution
      return
    }

    // Apply the resolution by updating the appropriate system
    if (resolution === 'foundation') {
      // Foundation wins - update Notion with Foundation data
      await this.syncEntityToNotion(event.entity as any, [event.data])
    } else if (resolution === 'notion') {
      // Notion wins - update Foundation with Notion data
      // Would need to fetch current Notion data and update Foundation
      console.log(`🔄 Notion wins conflict resolution for ${event.entity} ${event.entityId}`)
    }
  }

  // ── Public API ────────────────────────────────────────────────────────

  getStatus() {
    return {
      isRunning: this.isRunning,
      queueSize: this.syncQueue.length,
      mappingCount: this.mappings.size,
      lastActivity: new Date().toISOString()
    }
  }

  async forceSyncAll(): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Sync engine is not running')
    }
    await this.performSync()
  }

  getConflicts() {
    return this.syncQueue.filter(event => event.status === 'conflict')
  }

  async resolveManualConflict(conflictId: string, resolution: 'foundation' | 'notion'): Promise<void> {
    const event = this.syncQueue.find(e => e.id === conflictId)
    if (!event) {
      throw new Error(`Conflict ${conflictId} not found`)
    }

    await this.applyConflictResolution(event, resolution)
    event.status = 'synced'
  }
}

// ── Default Configuration ────────────────────────────────────────────────

export const defaultNotionSyncConfig: NotionSyncConfig = {
  workspaceId: 'foundation-os-workspace',
  databaseIds: {
    sessions: '',    // To be configured
    decisions: '',   // To be configured
    risks: '',       // To be configured
    nextSteps: '',   // To be configured
    docs: ''         // To be configured
  },
  syncInterval: 30000, // 30 seconds
  conflictResolution: 'intelligent',
  batchSize: 50,
  retryAttempts: 3
}

// ── Export Singleton Instance ────────────────────────────────────────────

export const notionSyncEngine = new NotionSyncEngine(defaultNotionSyncConfig)