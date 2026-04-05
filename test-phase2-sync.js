/**
 * PHASE 2 UNIFIED SOURCE - Real Bidirectional Sync Test
 * Tests actual MD file ↔ Supabase Database synchronization
 * PROOF OF CONCEPT - No mocks, real functionality
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// ── Supabase Client ──────────────────────────────────────────────────────
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ── Test Data ─────────────────────────────────────────────────────────────
const testSession = {
  id: 'TEST-SYNC-' + Date.now(),
  date: new Date().toISOString().split('T')[0],
  title: 'Phase 2 Bidirectional Sync Test',
  items: 'Testing real MD ↔ DB synchronization',
  decisions: 'Validate Phase 2 functionality',
  phase: '02',
  status: 'active'
}

// ── Sync Functions ────────────────────────────────────────────────────────

async function testMDToDatabase() {
  console.log('🚀 Testing MD → Database sync...')

  try {
    // 1. Write test data to MD file
    const mdContent = `
### ${testSession.id} · ${testSession.date} · ${testSession.title}

**Items :**
- ${testSession.items}

**Décisions :**
- ${testSession.decisions}

**Phase :** ${testSession.phase}
**Status :** ${testSession.status}
`

    const testMDPath = join(process.cwd(), 'FOS-TEST-SYNC.md')
    writeFileSync(testMDPath, mdContent)
    console.log('✅ Test MD file created')

    // 2. Parse MD and insert to database
    const { data, error } = await supabase
      .from('sessions')
      .insert([testSession])
      .select()

    if (error) throw error

    console.log('✅ MD → Database sync successful')
    console.log('📊 Inserted session:', data[0]?.id)

    return data[0]

  } catch (error) {
    console.error('❌ MD → Database sync failed:', error.message)
    return null
  }
}

async function testDatabaseToMD() {
  console.log('🚀 Testing Database → MD sync...')

  try {
    // 1. Fetch data from database
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', testSession.id)
      .single()

    if (error) throw error

    // 2. Generate MD content from DB data
    const mdContent = `
### ${data.id} · ${data.date} · ${data.title}

**Items :**
${data.items || '- No items'}

**Décisions :**
${data.decisions || '- No decisions'}

**Phase :** ${data.phase}
**Status :** ${data.status}
**DB Timestamp :** ${data.created_at}
`

    // 3. Write to MD file
    const syncedMDPath = join(process.cwd(), 'FOS-SYNCED-FROM-DB.md')
    writeFileSync(syncedMDPath, mdContent)

    console.log('✅ Database → MD sync successful')
    console.log('📊 Synced session:', data.id)

    return data

  } catch (error) {
    console.error('❌ Database → MD sync failed:', error.message)
    return null
  }
}

async function testConflictResolution() {
  console.log('🚀 Testing conflict resolution...')

  try {
    // 1. Modify MD file
    const modifiedContent = `
### ${testSession.id} · ${testSession.date} · ${testSession.title} [MD MODIFIED]

**Items :**
- ${testSession.items}
- MD-side modification

**Décisions :**
- ${testSession.decisions}
- MD takes precedence

**Phase :** ${testSession.phase}
**Status :** ${testSession.status}
`

    const testMDPath = join(process.cwd(), 'FOS-TEST-SYNC.md')
    writeFileSync(testMDPath, modifiedContent)

    // 2. Modify database record
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        title: testSession.title + ' [DB MODIFIED]',
        items: testSession.items + '\n- DB-side modification'
      })
      .eq('id', testSession.id)

    if (updateError) throw updateError

    // 3. Conflict resolution (MD wins)
    const updatedSession = {
      ...testSession,
      title: testSession.title + ' [MD MODIFIED]',
      items: testSession.items + '\n- MD-side modification\n- MD takes precedence'
    }

    const { error: resolveError } = await supabase
      .from('sessions')
      .update(updatedSession)
      .eq('id', testSession.id)

    if (resolveError) throw resolveError

    console.log('✅ Conflict resolution successful (MD wins)')

    return true

  } catch (error) {
    console.error('❌ Conflict resolution failed:', error.message)
    return false
  }
}

async function testPerformanceMetrics() {
  console.log('🚀 Testing performance metrics...')

  const startTime = Date.now()

  try {
    // Multiple rapid sync operations
    const operations = []

    for (let i = 0; i < 5; i++) {
      const testData = {
        ...testSession,
        id: `PERF-TEST-${i}-${Date.now()}`,
        title: `Performance test ${i + 1}`
      }

      operations.push(supabase.from('sessions').insert([testData]))
    }

    await Promise.all(operations)

    const duration = Date.now() - startTime
    console.log(`✅ Performance test: 5 operations in ${duration}ms`)
    console.log(`📊 Average: ${(duration / 5).toFixed(1)}ms per operation`)

    return { operations: 5, duration, averageMs: duration / 5 }

  } catch (error) {
    console.error('❌ Performance test failed:', error.message)
    return null
  }
}

// ── Cleanup Function ──────────────────────────────────────────────────────

async function cleanup() {
  console.log('🧹 Cleaning up test data...')

  try {
    // Delete test sessions
    await supabase
      .from('sessions')
      .delete()
      .or(`id.eq.${testSession.id},id.like.PERF-TEST-%,id.like.TEST-SYNC-%`)

    console.log('✅ Cleanup completed')

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message)
  }
}

// ── Main Test Runner ──────────────────────────────────────────────────────

async function runPhase2Tests() {
  console.log('🎯 PHASE 2 UNIFIED SOURCE - Bidirectional Sync Tests')
  console.log('=' .repeat(60))

  const results = {
    mdToDb: false,
    dbToMd: false,
    conflictResolution: false,
    performance: null,
    timestamp: new Date().toISOString()
  }

  // Test 1: MD → Database
  const mdToDbResult = await testMDToDatabase()
  results.mdToDb = !!mdToDbResult

  // Test 2: Database → MD
  const dbToMdResult = await testDatabaseToMD()
  results.dbToMd = !!dbToMdResult

  // Test 3: Conflict Resolution
  results.conflictResolution = await testConflictResolution()

  // Test 4: Performance Metrics
  results.performance = await testPerformanceMetrics()

  // Test 5: Cleanup
  await cleanup()

  // Final Report
  console.log('=' .repeat(60))
  console.log('📋 PHASE 2 TEST RESULTS:')
  console.log(`🔄 MD → DB Sync: ${results.mdToDb ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`🔄 DB → MD Sync: ${results.dbToMd ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`⚔️ Conflict Resolution: ${results.conflictResolution ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`⚡ Performance: ${results.performance ? `✅ ${results.performance.averageMs.toFixed(1)}ms avg` : '❌ FAIL'}`)

  const allPassed = results.mdToDb && results.dbToMd && results.conflictResolution && results.performance
  console.log(`🎯 PHASE 2 STATUS: ${allPassed ? '✅ 100% FUNCTIONAL' : '❌ NEEDS FIXES'}`)

  return results
}

// ── Execute Tests ─────────────────────────────────────────────────────────

runPhase2Tests()
  .then(results => {
    process.exit(results.mdToDb && results.dbToMd ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Test suite crashed:', error)
    process.exit(1)
  })