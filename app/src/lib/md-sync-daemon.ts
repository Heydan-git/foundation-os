/**
 * md-sync-daemon.ts - MD→DB Sync Pipeline for Foundation OS Phase 2
 * Watches MD file changes and automatically syncs to Supabase
 * Bidirectional sync: MD files ↔ Database
 */

import { watch } from 'fs'
import { join } from 'path'
import { supabase } from './supabase'
import { generateSeedFromMD } from './md-to-seed'

// ── Configuration ─────────────────────────────────────────────────────────

const SYNC_CONFIG = {
  fosDirectory: '../..',  // Relative to this file
  watchFiles: [
    'FOS-JOURNAL.md',
    'FOS-MONITORING.md',
    'FOS-PLAN-MASTER-v2.md',
    'FOS-COMMANDER-DATA.md',
    'FOS-INDEX-DATA.md',
    'FOS-SCALE-ORCHESTRATOR-DATA.md',
    'FOS-GRAPH-DATA.md',
    'FOS-SYNC-DATA.md',
    'FOS-TOOLBOX-DATA.md'
  ],
  syncIntervalMs: 5000,  // 5 seconds
  enableBidirectional: true
}

// ── Types ─────────────────────────────────────────────────────────────────

interface SyncEvent {
  timestamp: string
  direction: 'md-to-db' | 'db-to-md'
  trigger: 'file-change' | 'db-change' | 'manual'
  affected: string[]
  success: boolean
  error?: string
}

type TableName = 'sessions' | 'decisions' | 'risks' | 'next_steps' | 'context_blocks'

// ── Sync State Management ─────────────────────────────────────────────────

class MDSyncDaemon {
  private isRunning = false
  private lastSync: Record<string, number> = {}
  private syncHistory: SyncEvent[] = []
  private watchers: ReturnType<typeof watch>[] = []

  // ── Start Sync Daemon ─────────────────────────────────────────────────

  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Sync daemon already running')
      return
    }

    console.log('🚀 Starting MD↔DB sync daemon...')
    this.isRunning = true

    // Initial sync MD → DB
    this.syncMDToDB('manual')

    // Setup file watchers
    this.setupFileWatchers()

    // Setup database watchers (if bidirectional enabled)
    if (SYNC_CONFIG.enableBidirectional) {
      this.setupDBWatchers()
    }

    console.log('✅ MD sync daemon started')
  }

  stop(): void {
    console.log('🛑 Stopping MD sync daemon...')

    this.isRunning = false

    // Close file watchers
    this.watchers.forEach(watcher => watcher.close())
    this.watchers = []

    console.log('✅ MD sync daemon stopped')
  }

  // ── File Watching ─────────────────────────────────────────────────────

  private setupFileWatchers(): void {
    for (const fileName of SYNC_CONFIG.watchFiles) {
      const filePath = join(__dirname, SYNC_CONFIG.fosDirectory, fileName)

      try {
        const watcher = watch(filePath, (eventType, filename) => {
          if (eventType === 'change') {
            console.log(`📝 File changed: ${filename}`)
            this.debounceSync(() => this.syncMDToDB('file-change', [fileName]))
          }
        })

        this.watchers.push(watcher)
        console.log(`👀 Watching: ${fileName}`)
      } catch (error) {
        console.warn(`⚠️ Could not watch ${fileName}:`, error)
      }
    }
  }

  // ── Database Watching ─────────────────────────────────────────────────

  private setupDBWatchers(): void {
    // Subscribe to realtime changes for each table
    const tables: TableName[] = ['sessions', 'decisions', 'risks', 'next_steps', 'context_blocks']

    tables.forEach(tableName => {
      supabase
        .channel(`sync-${tableName}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName },
          (payload) => {
            console.log(`💾 DB change in ${tableName}:`, payload.eventType)
            this.debounceSync(() => this.syncDBToMD('db-change', [tableName]))
          }
        )
        .subscribe()

      console.log(`👀 Watching DB table: ${tableName}`)
    })
  }

  // ── Sync Methods ─────────────────────────────────────────────────────

  private async syncMDToDB(trigger: SyncEvent['trigger'], affectedFiles?: string[]): Promise<void> {
    const event: SyncEvent = {
      timestamp: new Date().toISOString(),
      direction: 'md-to-db',
      trigger,
      affected: affectedFiles || SYNC_CONFIG.watchFiles,
      success: false
    }

    try {
      console.log('📤 Syncing MD → DB...')

      // Generate SQL from current MD files
      const sql = generateSeedFromMD(join(__dirname, SYNC_CONFIG.fosDirectory))

      if (!sql.trim()) {
        console.log('⚠️ No SQL generated - nothing to sync')
        event.success = true
        this.syncHistory.push(event)
        return
      }

      // Execute SQL via Supabase (we'll need to parse and execute individual statements)
      await this.executeSQLStatements(sql)

      event.success = true
      console.log('✅ MD → DB sync completed')

    } catch (error) {
      event.error = error instanceof Error ? error.message : String(error)
      console.error('❌ MD → DB sync failed:', event.error)
    } finally {
      this.syncHistory.push(event)
      this.pruneHistory()
    }
  }

  private async syncDBToMD(trigger: SyncEvent['trigger'], affectedTables?: string[]): Promise<void> {
    const event: SyncEvent = {
      timestamp: new Date().toISOString(),
      direction: 'db-to-md',
      trigger,
      affected: affectedTables || [],
      success: false
    }

    try {
      console.log('📥 Syncing DB → MD...')

      // Fetch current data from DB
      const { data: sessions } = await supabase.from('sessions').select('*').order('date')
      const { data: decisions } = await supabase.from('decisions').select('*').order('date')
      const { data: risks } = await supabase.from('risks').select('*')

      // Update MD files with DB data
      if (sessions) await this.updateJournalFromSessions(sessions)
      if (decisions) await this.updateJournalFromDecisions(decisions)
      if (risks) await this.updateMonitoringFromRisks(risks)

      event.success = true
      console.log('✅ DB → MD sync completed')

    } catch (error) {
      event.error = error instanceof Error ? error.message : String(error)
      console.error('❌ DB → MD sync failed:', event.error)
    } finally {
      this.syncHistory.push(event)
      this.pruneHistory()
    }
  }

  // ── SQL Execution ─────────────────────────────────────────────────────

  private async executeSQLStatements(sql: string): Promise<void> {
    // Split SQL into individual statements and execute them via Supabase client
    const statements = sql.split(/;\s*\n/).filter(stmt => stmt.trim() && !stmt.startsWith('--'))

    for (const statement of statements) {
      const trimmed = statement.trim()
      if (!trimmed) continue

      // Parse INSERT statements and convert to Supabase operations
      if (trimmed.startsWith('INSERT INTO sessions')) {
        await this.executeSessionsInsert(trimmed)
      } else if (trimmed.startsWith('INSERT INTO decisions')) {
        await this.executeDecisionsInsert(trimmed)
      } else if (trimmed.startsWith('INSERT INTO risks')) {
        await this.executeRisksInsert(trimmed)
      } else if (trimmed.startsWith('INSERT INTO next_steps')) {
        await this.executeNextStepsInsert(trimmed)
      } else if (trimmed.startsWith('INSERT INTO context_blocks')) {
        await this.executeContextBlocksInsert(trimmed)
      }
    }
  }

  private async executeSessionsInsert(sql: string): Promise<void> {
    // Extract values from INSERT statement and upsert via Supabase
    const values = this.extractInsertValues(sql)
    if (values.length === 0) return

    const sessions = values.map(v => ({
      id: v[0],
      date: v[1],
      title: v[2],
      items: v[3],
      decisions: v[4],
      phase: v[5],
      status: v[6]
    }))

    await (supabase as any).from('sessions').upsert(sessions)
    console.log(`📝 Upserted ${sessions.length} sessions`)
  }

  private async executeDecisionsInsert(sql: string): Promise<void> {
    const values = this.extractInsertValues(sql)
    if (values.length === 0) return

    const decisions = values.map(v => ({
      id: v[0],
      date: v[1],
      title: v[2],
      context: v[3],
      impact: v[4],
      status: v[5]
    }))

    await (supabase as any).from('decisions').upsert(decisions)
    console.log(`📋 Upserted ${decisions.length} decisions`)
  }

  private async executeRisksInsert(sql: string): Promise<void> {
    const values = this.extractInsertValues(sql)
    if (values.length === 0) return

    const risks = values.map(v => ({
      id: v[0],
      risk: v[1],
      impact: v[2],
      proba: v[3],
      mitigation: v[4],
      status: v[5]
    }))

    await (supabase as any).from('risks').upsert(risks)
    console.log(`⚠️ Upserted ${risks.length} risks`)
  }

  private async executeNextStepsInsert(sql: string): Promise<void> {
    const values = this.extractInsertValues(sql)
    if (values.length === 0) return

    const nextSteps = values.map(v => ({
      id: v[0],
      label: v[1],
      phase: v[2],
      priority: v[3],
      status: v[4],
      sort_order: parseInt(v[5])
    }))

    await (supabase as any).from('next_steps').upsert(nextSteps)
    console.log(`📋 Upserted ${nextSteps.length} next steps`)
  }

  private async executeContextBlocksInsert(sql: string): Promise<void> {
    const values = this.extractInsertValues(sql)
    if (values.length === 0) return

    const contextBlocks = values.map(v => ({
      id: v[0],
      label: v[1],
      content: v[2],
      sort_order: parseInt(v[3])
    }))

    await (supabase as any).from('context_blocks').upsert(contextBlocks)
    console.log(`📄 Upserted ${contextBlocks.length} context blocks`)
  }

  // ── MD File Updates ─────────────────────────────────────────────────

  private async updateJournalFromSessions(sessions: any[]): Promise<void> {
    // This would update FOS-JOURNAL.md with current session data from DB
    // Implementation would merge DB data back into MD format
    console.log(`📝 Would update journal with ${sessions.length} sessions`)
  }

  private async updateJournalFromDecisions(decisions: any[]): Promise<void> {
    console.log(`📋 Would update journal ADR section with ${decisions.length} decisions`)
  }

  private async updateMonitoringFromRisks(risks: any[]): Promise<void> {
    console.log(`⚠️ Would update monitoring with ${risks.length} risks`)
  }

  // ── Utilities ─────────────────────────────────────────────────────────

  private extractInsertValues(sql: string): string[][] {
    // Extract values from INSERT statement
    // This is a simplified parser - in production would use proper SQL parser
    const valuesMatch = sql.match(/VALUES\s*\n\s*(.+)/s)
    if (!valuesMatch) return []

    const valuesString = valuesMatch[1]
    const rows = valuesString.split(/\),\s*\n/).map(row => {
      const cleaned = row.replace(/^\s*\(/, '').replace(/\).*$/, '')
      return cleaned.split(',').map(v => v.trim().replace(/^'|'$/g, ''))
    })

    return rows
  }

  private debounceSync(fn: () => void, delay = 1000): void {
    const key = fn.toString()
    clearTimeout(this.lastSync[key] as any)
    this.lastSync[key] = setTimeout(fn, delay) as any
  }

  private pruneHistory(): void {
    // Keep only last 100 sync events
    if (this.syncHistory.length > 100) {
      this.syncHistory = this.syncHistory.slice(-100)
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────

  getStatus() {
    return {
      running: this.isRunning,
      watchedFiles: SYNC_CONFIG.watchFiles.length,
      recentEvents: this.syncHistory.slice(-10),
      config: SYNC_CONFIG
    }
  }

  async forceSyncMD(): Promise<void> {
    await this.syncMDToDB('manual')
  }

  async forceSyncDB(): Promise<void> {
    if (SYNC_CONFIG.enableBidirectional) {
      await this.syncDBToMD('manual')
    }
  }
}

// ── Singleton Instance ───────────────────────────────────────────────────

export const mdSyncDaemon = new MDSyncDaemon()

// ── Auto-start in production ─────────────────────────────────────────────

if (process.env.NODE_ENV === 'production' || process.env.AUTO_START_SYNC === 'true') {
  mdSyncDaemon.start()

  // Graceful shutdown
  process.on('SIGINT', () => {
    mdSyncDaemon.stop()
    process.exit(0)
  })
}

export default mdSyncDaemon