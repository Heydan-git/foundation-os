#!/usr/bin/env node
/**
 * Test automatisé du CRUD Supabase
 * Vérifie que les vraies opérations DB fonctionnent
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes dans .env.local')
  process.exit(1)
}

console.log('🧪 Test CRUD Supabase Foundation OS')
console.log('═'.repeat(50))

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCRUD() {
  let testSessionId = null
  let testDecisionId = null

  try {
    // ── TEST 1: CREATE Session ─────────────────────────────────
    console.log('\n1. 📝 Test CREATE Session...')

    const sessionData = {
      date: new Date().toISOString().split('T')[0],
      title: `Test Session ${Date.now()}`,
      items: 'Test CRUD operations • Verify real DB connection',
      phase: 'Phase 0',
      status: 'active'
    }

    const { data: sessionResult, error: sessionError } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()

    if (sessionError) throw sessionError

    testSessionId = sessionResult[0].id
    console.log('✅ Session créée:', sessionResult[0].title)
    console.log('   ID:', testSessionId)

    // ── TEST 2: CREATE Decision ─────────────────────────────────
    console.log('\n2. 💡 Test CREATE Decision...')

    const decisionData = {
      date: new Date().toISOString().split('T')[0],
      title: `Test Decision ${Date.now()}`,
      context: 'Automated test to verify CRUD operations work correctly',
      impact: 'medium',
      status: 'active'
    }

    const { data: decisionResult, error: decisionError } = await supabase
      .from('decisions')
      .insert([decisionData])
      .select()

    if (decisionError) throw decisionError

    testDecisionId = decisionResult[0].id
    console.log('✅ Décision créée:', decisionResult[0].title)
    console.log('   ID:', testDecisionId)

    // ── TEST 3: READ Operations ─────────────────────────────────
    console.log('\n3. 📖 Test READ Operations...')

    const { data: sessions, error: readSessionsError } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (readSessionsError) throw readSessionsError

    console.log(`✅ ${sessions.length} sessions récupérées`)

    const { data: decisions, error: readDecisionsError } = await supabase
      .from('decisions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (readDecisionsError) throw readDecisionsError

    console.log(`✅ ${decisions.length} décisions récupérées`)

    // ── TEST 4: UPDATE Session ─────────────────────────────────
    console.log('\n4. 🔄 Test UPDATE Session...')

    const { error: updateError } = await supabase
      .from('sessions')
      .update({ status: 'closed' })
      .eq('id', testSessionId)

    if (updateError) throw updateError

    console.log('✅ Session status updated to "closed"')

    // ── TEST 5: Verify UPDATE ─────────────────────────────────
    const { data: updatedSession, error: verifyError } = await supabase
      .from('sessions')
      .select('status')
      .eq('id', testSessionId)
      .single()

    if (verifyError) throw verifyError

    if (updatedSession.status === 'closed') {
      console.log('✅ UPDATE vérifié: statut = closed')
    } else {
      throw new Error(`UPDATE échec: statut = ${updatedSession.status}`)
    }

    // ── TEST 6: DELETE Operations ─────────────────────────────────
    console.log('\n5. 🗑️  Test DELETE Operations...')

    const { error: deleteSessionError } = await supabase
      .from('sessions')
      .delete()
      .eq('id', testSessionId)

    if (deleteSessionError) throw deleteSessionError

    console.log('✅ Session test supprimée')

    const { error: deleteDecisionError } = await supabase
      .from('decisions')
      .delete()
      .eq('id', testDecisionId)

    if (deleteDecisionError) throw deleteDecisionError

    console.log('✅ Décision test supprimée')

    // ── TEST 7: Verify DELETE ─────────────────────────────────
    const { data: deletedSession, error: verifyDeleteError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', testSessionId)

    if (verifyDeleteError) throw verifyDeleteError

    if (deletedSession.length === 0) {
      console.log('✅ DELETE vérifié: session introuvable')
    } else {
      throw new Error('DELETE échec: session encore présente')
    }

    // ── RÉSULTATS FINAUX ─────────────────────────────────
    console.log('\n' + '═'.repeat(50))
    console.log('🎉 TOUS LES TESTS CRUD PASSENT!')
    console.log('✅ CREATE: Sessions & Décisions')
    console.log('✅ READ: Lecture avec tri')
    console.log('✅ UPDATE: Modification statut')
    console.log('✅ DELETE: Suppression définitive')
    console.log('\n📊 Base de données Supabase opérationnelle')
    console.log(`🌐 URL Frontend: http://localhost:5176/crud-test`)

  } catch (error) {
    console.error('\n❌ ERREUR CRUD:', error.message)

    // Cleanup en cas d'erreur
    if (testSessionId) {
      await supabase.from('sessions').delete().eq('id', testSessionId)
    }
    if (testDecisionId) {
      await supabase.from('decisions').delete().eq('id', testDecisionId)
    }

    process.exit(1)
  }
}

// Exécuter les tests
testCRUD()