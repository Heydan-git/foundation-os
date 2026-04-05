#!/usr/bin/env node
/**
 * Test du schéma Supabase pour diagnostiquer les colonnes disponibles
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Read environment variables from .env.local
function loadEnv() {
  try {
    const envFile = readFileSync('.env.local', 'utf8')
    const env = {}
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        env[key.trim()] = value.trim()
      }
    })
    return env
  } catch (error) {
    console.error('❌ Impossible de lire .env.local')
    return {}
  }
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSchema() {
  try {
    console.log('🔍 Diagnostic du schéma Supabase')
    console.log('═'.repeat(50))

    // Test 1: Vérifier structure sessions
    console.log('\n📋 Test structure table sessions...')
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .limit(1)

      if (sessionsError) {
        console.error('❌ Erreur sessions:', sessionsError.message)
      } else {
        console.log('✅ Table sessions accessible')
        if (sessions.length > 0) {
          console.log('📊 Colonnes détectées:', Object.keys(sessions[0]).join(', '))
        } else {
          console.log('📊 Table vide, tentative d\'insertion simple...')

          // Essai avec colonnes minimales
          const { data: testResult, error: testError } = await supabase
            .from('sessions')
            .insert([{
              date: new Date().toISOString().split('T')[0],
              title: 'Test Schema',
              status: 'active'
            }])
            .select()

          if (testError) {
            console.error('❌ Erreur insertion test:', testError.message)
            console.error('   Détails:', testError.details)
          } else {
            console.log('✅ Insertion réussie:', Object.keys(testResult[0]).join(', '))

            // Nettoyer
            await supabase.from('sessions').delete().eq('id', testResult[0].id)
          }
        }
      }
    } catch (error) {
      console.error('❌ Erreur générale sessions:', error.message)
    }

    // Test 2: Vérifier structure decisions
    console.log('\n💡 Test structure table decisions...')
    try {
      const { data: decisions, error: decisionsError } = await supabase
        .from('decisions')
        .select('*')
        .limit(1)

      if (decisionsError) {
        console.error('❌ Erreur decisions:', decisionsError.message)
      } else {
        console.log('✅ Table decisions accessible')
        if (decisions.length > 0) {
          console.log('📊 Colonnes détectées:', Object.keys(decisions[0]).join(', '))
        } else {
          console.log('📊 Table vide, tentative d\'insertion simple...')

          const { data: testResult, error: testError } = await supabase
            .from('decisions')
            .insert([{
              date: new Date().toISOString().split('T')[0],
              title: 'Test Schema Decision',
              impact: 'medium',
              status: 'active'
            }])
            .select()

          if (testError) {
            console.error('❌ Erreur insertion test:', testError.message)
            console.error('   Détails:', testError.details)
          } else {
            console.log('✅ Insertion réussie:', Object.keys(testResult[0]).join(', '))

            // Nettoyer
            await supabase.from('decisions').delete().eq('id', testResult[0].id)
          }
        }
      }
    } catch (error) {
      console.error('❌ Erreur générale decisions:', error.message)
    }

    // Test 3: Lister toutes les tables disponibles
    console.log('\n📚 Test autres tables...')
    const tables = ['risks', 'docs', 'context_blocks', 'next_steps']

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`✅ Table '${table}': accessible`)
        }
      } catch (error) {
        console.log(`❌ Table '${table}': erreur générale`)
      }
    }

  } catch (error) {
    console.error('💥 Erreur fatale diagnostic:', error.message)
  }
}

testSchema()