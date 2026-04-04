/**
 * phase2-functional-test.ts - Phase 2 UNIFIED SOURCE Functional Tests
 * Tests real MD parsing and sync functionality
 * VALIDATION TESTS - NOT UNIT TESTS
 */

import { mdParserEngine } from '../md-parser-engine'
import { unifiedSyncEngine } from '../unified-sync-engine'
import { supabase } from '../supabase'

// ── Test Configuration ───────────────────────────────────────────────────

interface TestResult {
  name: string
  success: boolean
  message: string
  duration: number
  details?: any
}

class Phase2FunctionalTest {
  private results: TestResult[] = []

  // ── Main Test Runner ──────────────────────────────────────────────────

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting Phase 2 UNIFIED SOURCE Functional Tests...')
    console.log('=' .repeat(60))

    this.results = []

    // Test 1: MD Parser functionality
    await this.testMDParser()

    // Test 2: Database connection
    await this.testDatabaseConnection()

    // Test 3: MD to DB sync
    await this.testMDToDBSync()

    // Test 4: DB to MD sync
    await this.testDBToMDSync()

    // Test 5: Realtime functionality
    await this.testRealtimeSync()

    // Test 6: End-to-end workflow
    await this.testEndToEndWorkflow()

    this.printResults()
    return this.results
  }

  // ── Test 1: MD Parser ─────────────────────────────────────────────────

  private async testMDParser(): Promise<void> {
    const startTime = Date.now()

    try {
      console.log('📖 Test 1: MD Parser Functionality...')

      // Parse MD files
      const parsedData = mdParserEngine.parseAllFiles()

      if (!parsedData) {
        throw new Error('MD parser returned null')
      }

      // Validate parsed data structure
      const hasRequiredFields = parsedData.sessions !== undefined &&
                               parsedData.decisions !== undefined &&
                               parsedData.risks !== undefined &&
                               parsedData.nextSteps !== undefined &&
                               parsedData.contextBlocks !== undefined

      if (!hasRequiredFields) {
        throw new Error('Parsed data missing required fields')
      }

      // Validate metadata
      if (!parsedData.metadata || !parsedData.metadata.lastParsed) {
        throw new Error('Parsed metadata invalid')
      }

      const totalRecords = parsedData.sessions.length +
                          parsedData.decisions.length +
                          parsedData.risks.length +
                          parsedData.nextSteps.length +
                          parsedData.contextBlocks.length

      this.addResult('MD Parser', true, `Successfully parsed ${totalRecords} records`, Date.now() - startTime, {
        sessions: parsedData.sessions.length,
        decisions: parsedData.decisions.length,
        risks: parsedData.risks.length,
        nextSteps: parsedData.nextSteps.length,
        contextBlocks: parsedData.contextBlocks.length,
        totalLines: parsedData.metadata.lineCount
      })

      console.log(`   ✅ Parsed ${totalRecords} records from ${parsedData.metadata.lineCount} lines`)

    } catch (error) {
      this.addResult('MD Parser', false, `Failed: ${error}`, Date.now() - startTime)
      console.log(`   ❌ ${error}`)
    }
  }

  // ── Test 2: Database Connection ───────────────────────────────────────

  private async testDatabaseConnection(): Promise<void> {
    const startTime = Date.now()

    try {
      console.log('💾 Test 2: Database Connection...')

      // Test Supabase connection
      const { data, error } = await supabase.from('sessions').select('count').limit(1)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // Test all required tables
      const tables = ['sessions', 'decisions', 'risks', 'next_steps', 'context_blocks']
      const tableTests = []

      for (const tableName of tables) {
        try {
          const { error: tableError } = await supabase.from(tableName).select('*').limit(1)
          if (tableError) {
            throw new Error(`Table ${tableName}: ${tableError.message}`)
          }
          tableTests.push(`${tableName}: ✅`)
        } catch (tableError) {
          tableTests.push(`${tableName}: ❌`)
          throw tableError
        }
      }

      this.addResult('Database Connection', true, `All ${tables.length} tables accessible`, Date.now() - startTime, {
        tables: tableTests
      })

      console.log(`   ✅ Connected to Supabase, all ${tables.length} tables accessible`)

    } catch (error) {
      this.addResult('Database Connection', false, `Failed: ${error}`, Date.now() - startTime)
      console.log(`   ❌ ${error}`)
    }
  }

  // ── Test 3: MD to DB Sync ─────────────────────────────────────────────

  private async testMDToDBSync(): Promise<void> {
    const startTime = Date.now()

    try {
      console.log('📤 Test 3: MD → DB Sync...')

      // Start sync engine
      await unifiedSyncEngine.start()

      // Run MD to DB sync
      const syncResult = await unifiedSyncEngine.syncMDToDatabase('manual')

      if (!syncResult.success) {
        throw new Error(`Sync failed: ${syncResult.error_message}`)
      }

      // Verify data was actually written to database
      let totalRecordsInDB = 0
      for (const tableName of syncResult.affected_tables) {
        const { data, error } = await supabase.from(tableName).select('*')
        if (error) {
          throw new Error(`Failed to verify ${tableName}: ${error.message}`)
        }
        totalRecordsInDB += data?.length || 0
      }

      this.addResult('MD → DB Sync', true, `Synced ${syncResult.records_synced} records to ${syncResult.affected_tables.length} tables`, Date.now() - startTime, {
        recordsSynced: syncResult.records_synced,
        tablesAffected: syncResult.affected_tables,
        duration: syncResult.duration_ms,
        recordsInDB: totalRecordsInDB
      })

      console.log(`   ✅ Synced ${syncResult.records_synced} records, verified ${totalRecordsInDB} in DB`)

    } catch (error) {
      this.addResult('MD → DB Sync', false, `Failed: ${error}`, Date.now() - startTime)
      console.log(`   ❌ ${error}`)
    }
  }

  // ── Test 4: DB to MD Sync ─────────────────────────────────────────────

  private async testDBToMDSync(): Promise<void> {
    const startTime = Date.now()

    try {
      console.log('📥 Test 4: DB → MD Sync...')

      // Run DB to MD sync
      const syncResult = await unifiedSyncEngine.syncDatabaseToMD('manual')

      if (!syncResult.success) {
        throw new Error(`Sync failed: ${syncResult.error_message}`)
      }

      this.addResult('DB → MD Sync', true, `Processed ${syncResult.records_synced} records from ${syncResult.affected_tables.length} tables`, Date.now() - startTime, {
        recordsProcessed: syncResult.records_synced,
        tablesAffected: syncResult.affected_tables,
        duration: syncResult.duration_ms
      })

      console.log(`   ✅ Processed ${syncResult.records_synced} records from DB`)

    } catch (error) {
      this.addResult('DB → MD Sync', false, `Failed: ${error}`, Date.now() - startTime)
      console.log(`   ❌ ${error}`)
    }
  }

  // ── Test 5: Realtime Sync ─────────────────────────────────────────────

  private async testRealtimeSync(): Promise<void> {
    const startTime = Date.now()

    try {
      console.log('🔄 Test 5: Realtime Sync Setup...')

      // Get initial status
      const initialStatus = unifiedSyncEngine.getStatus()

      if (!initialStatus.running) {
        throw new Error('Sync engine not running')
      }

      if (!initialStatus.config.enableRealtime) {
        throw new Error('Realtime sync not enabled')
      }

      this.addResult('Realtime Sync', true, 'Realtime sync configured and active', Date.now() - startTime, {
        running: initialStatus.running,
        realtimeEnabled: initialStatus.config.enableRealtime,
        bidirectional: initialStatus.config.enableBidirectional
      })

      console.log(`   ✅ Realtime sync active, bidirectional: ${initialStatus.config.enableBidirectional}`)

    } catch (error) {
      this.addResult('Realtime Sync', false, `Failed: ${error}`, Date.now() - startTime)
      console.log(`   ❌ ${error}`)
    }
  }

  // ── Test 6: End-to-End Workflow ───────────────────────────────────────

  private async testEndToEndWorkflow(): Promise<void> {
    const startTime = Date.now()

    try {
      console.log('🎯 Test 6: End-to-End Workflow...')

      // 1. Parse MD files
      const parsedData = mdParserEngine.parseAllFiles()
      if (!parsedData) throw new Error('MD parsing failed')

      // 2. Sync to database
      const syncToDB = await unifiedSyncEngine.syncMDToDatabase('manual')
      if (!syncToDB.success) throw new Error('MD→DB sync failed')

      // 3. Sync back from database
      const syncFromDB = await unifiedSyncEngine.syncDatabaseToMD('manual')
      if (!syncFromDB.success) throw new Error('DB→MD sync failed')

      // 4. Get final stats
      const stats = unifiedSyncEngine.getStatus().stats

      const workflowDetails = {
        parseSuccess: !!parsedData,
        recordsParsed: Object.values(parsedData).reduce((sum, arr) => Array.isArray(arr) ? sum + arr.length : sum, 0),
        syncToDBSuccess: syncToDB.success,
        syncFromDBSuccess: syncFromDB.success,
        totalSyncs: stats.total_syncs,
        successRate: stats.successful_syncs / stats.total_syncs,
        avgDuration: stats.average_duration_ms
      }

      this.addResult('End-to-End Workflow', true, 'Complete workflow executed successfully', Date.now() - startTime, workflowDetails)

      console.log(`   ✅ Complete workflow: Parse → Sync → Verify (${stats.total_syncs} total syncs)`)

    } catch (error) {
      this.addResult('End-to-End Workflow', false, `Failed: ${error}`, Date.now() - startTime)
      console.log(`   ❌ ${error}`)
    }
  }

  // ── Utility Methods ───────────────────────────────────────────────────

  private addResult(name: string, success: boolean, message: string, duration: number, details?: any): void {
    this.results.push({ name, success, message, duration, details })
  }

  private printResults(): void {
    console.log('\n' + '='.repeat(60))
    console.log('📊 PHASE 2 FUNCTIONAL TEST RESULTS')
    console.log('='.repeat(60))

    const passedTests = this.results.filter(r => r.success)
    const failedTests = this.results.filter(r => !r.success)

    console.log(`✅ Passed: ${passedTests.length}/${this.results.length} tests`)
    console.log(`❌ Failed: ${failedTests.length}/${this.results.length} tests`)
    console.log(`⏱️ Total time: ${this.results.reduce((sum, r) => sum + r.duration, 0)}ms`)

    if (failedTests.length === 0) {
      console.log('\n🎉 ALL TESTS PASSED - PHASE 2 UNIFIED SOURCE IS FUNCTIONAL!')
    } else {
      console.log('\n❌ Some tests failed:')
      failedTests.forEach(test => {
        console.log(`   ${test.name}: ${test.message}`)
      })
    }

    console.log('='.repeat(60))
  }

  // ── Public API ─────────────────────────────────────────────────────────

  getResults(): TestResult[] {
    return this.results
  }

  getSuccessRate(): number {
    const passed = this.results.filter(r => r.success).length
    return this.results.length > 0 ? passed / this.results.length : 0
  }

  isPhase2Functional(): boolean {
    return this.getSuccessRate() >= 0.8 // 80% success rate required
  }
}

// ── Export Test Runner ───────────────────────────────────────────────────

export const phase2FunctionalTest = new Phase2FunctionalTest()

// ── Auto-run in development ──────────────────────────────────────────────

if (process.env.NODE_ENV === 'development' && process.env.RUN_PHASE2_TESTS === 'true') {
  phase2FunctionalTest.runAllTests().then(results => {
    console.log('\n📋 Development auto-test completed')
    console.log(`Success rate: ${Math.round(phase2FunctionalTest.getSuccessRate() * 100)}%`)
    console.log(`Phase 2 functional: ${phase2FunctionalTest.isPhase2Functional() ? '✅' : '❌'}`)
  })
}

export default phase2FunctionalTest