/**
 * useCommander — fetches all Commander data from Supabase
 * Falls back to static seed data when tables are empty or not yet created.
 */
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Session, Decision, Risk, Doc, ContextBlock, NextStep } from './database.types'

// ── Static seed data (used as fallback when DB is empty) ─────────────

const SEED_SESSIONS: Session[] = [
  { id: 'CONV-001', created_at: '', date: '2026-04-02', title: 'Fondation — Vision & Principes', items: 'Mode coopération défini · Vision LT fondation mondiale · Analyse Claudify + BMAD · FONDATION_v0.md créé', decisions: 'Coopération > exploitation · Traçabilité totale · Claudify + BMAD = fondations', phase: '00', status: 'closed' },
  { id: 'CONV-002', created_at: '', date: '2026-04-02', title: 'Skills iOS Pipeline Grade A', items: '18+ skills cartographiés · Pipeline 8 phases × 3 budgets · ios-pipeline-dashboard.jsx · 12 fichiers MD', decisions: '8 phases validation→growth · Stack iOS : Swift 6 + SwiftUI + TCA', phase: '00', status: 'closed' },
  { id: 'CONV-003', created_at: '', date: '2026-04-03', title: 'Architecture Foundation OS', items: 'Analyse exhaustive 10 artifacts · Architecture 6 artifacts cibles · Design System Void Glass formalisé', decisions: '6 artifacts fos-* · BMAD v6 _bmad/ (underscore) · DS Void Glass = spec Figma', phase: '00', status: 'closed' },
  { id: 'CONV-004', created_at: '', date: '2026-04-03', title: 'Stack, Coûts, Audit complet Foundation OS', items: 'Décision Vercel + Supabase (ADR-008) · Estimation coûts par phase · Audit 5 catégories · FOUNDATION-OS-SKILL créé · 10 fichiers MD', decisions: 'Option D Hybrid (ADR-007) · Vercel + Supabase (ADR-008) · FOUNDATION-OS-SKILL (ADR-010)', phase: '00', status: 'closed' },
  { id: 'CONV-005', created_at: '', date: '2026-04-04', title: 'App Foundation OS — Commander Page', items: 'Page Commander fonctionnelle · Supabase connecté · Routing /commander · Déployé Vercel', decisions: 'react-router-dom · Supabase tables créées · Void Glass strict', phase: '00', status: 'active' },
]

const SEED_DECISIONS: Decision[] = [
  { id: 'ADR-001', created_at: '', date: '2026-04-02', title: 'Coopération > exploitation',            context: 'Philosophie Foundation OS',                              impact: 'high',   status: 'active' },
  { id: 'ADR-002', created_at: '', date: '2026-04-02', title: 'Traçabilité totale',                    context: 'Journal + MD + monitoring systématique',                 impact: 'high',   status: 'active' },
  { id: 'ADR-003', created_at: '', date: '2026-04-02', title: 'Plan évolutif',                         context: 'Itérations courtes, pas de rigidité',                    impact: 'medium', status: 'active' },
  { id: 'ADR-004', created_at: '', date: '2026-04-02', title: 'Claudify + BMAD = fondations workflow', context: 'Déploiement sur Claude.ai Projects après préparation',   impact: 'high',   status: 'active' },
  { id: 'ADR-005', created_at: '', date: '2026-04-03', title: 'Architecture MD/JSX',                   context: 'MD = source de vérité, JSX = contrôleur',                impact: 'high',   status: 'active' },
  { id: 'ADR-006', created_at: '', date: '2026-04-03', title: '6 artifacts fos-*',                     context: 'Architecture cible après analyse exhaustive',            impact: 'high',   status: 'active' },
  { id: 'ADR-007', created_at: '', date: '2026-04-03', title: 'Option D Hybrid',                       context: 'Pipeline app iOS — Hybrid artifacts + app',             impact: 'high',   status: 'active' },
  { id: 'ADR-008', created_at: '', date: '2026-04-03', title: 'Vercel + Supabase',                     context: 'Stack L5 définitive — free tier suffisant usage perso',  impact: 'high',   status: 'active' },
  { id: 'ADR-009', created_at: '', date: '2026-04-03', title: '22 étapes setup orchestrées',           context: 'Plan déploiement Foundation OS complet',                 impact: 'high',   status: 'active' },
  { id: 'ADR-010', created_at: '', date: '2026-04-03', title: 'FOUNDATION-OS-SKILL = mémoire',         context: 'Skill pour maintien cohérence long terme',               impact: 'high',   status: 'active' },
  { id: 'ADR-011', created_at: '', date: '2026-04-03', title: 'OMC team syntax canonical (v4.1.7+)',   context: 'team "tâche" — swarm/ultrapilot supprimés',              impact: 'medium', status: 'active' },
  { id: 'ADR-012', created_at: '', date: '2026-04-03', title: 'L1 = deux couches',                     context: 'Architecture L1 clarifiée',                              impact: 'high',   status: 'active' },
]

const SEED_RISKS: Risk[] = [
  { id: 'R-01', created_at: '', risk: 'Artifacts trop lourds → rendu partiel',  impact: 'medium', proba: 'high',   mitigation: 'Consolidation 10→6 artifacts',   status: 'open' },
  { id: 'R-02', created_at: '', risk: 'Drift MD/JSX (syncs oubliées)',           impact: 'medium', proba: 'medium', mitigation: 'Pattern MD-first strict',         status: 'open' },
  { id: 'R-03', created_at: '', risk: 'BMAD v6 changements API',                 impact: 'low',    proba: 'low',    mitigation: 'Vérifier docs avant install',     status: 'open' },
  { id: 'R-04', created_at: '', risk: 'Surengineering workflow avant produit',   impact: 'medium', proba: 'medium', mitigation: 'Phase 00 priorité absolue',       status: 'open' },
]

const SEED_DOCS: Doc[] = [
  { id: '1', created_at: '', fichier: 'fos-commander.jsx',          type: 'artifact',   statut: '✅ livré 364L',  kb: '✅ FOS-COMMANDER-DATA.md' },
  { id: '2', created_at: '', fichier: 'fos-knowledge.jsx',          type: 'artifact',   statut: '✅ livré 448L',  kb: '✅ FOS-KNOWLEDGE-DATA.md' },
  { id: '3', created_at: '', fichier: 'fos-index.jsx',              type: 'artifact',   statut: '✅ livré 300L',  kb: '✅ FOS-INDEX-DATA.md' },
  { id: '4', created_at: '', fichier: 'fos-scale-orchestrator.jsx', type: 'artifact',   statut: '✅ livré 558L',  kb: '✅ FOS-SCALE-ORCHESTRATOR-DATA.md' },
  { id: '5', created_at: '', fichier: 'fos-graph.jsx',              type: 'artifact',   statut: '⏳ P6-e21',      kb: '⏳ FOS-GRAPH-DATA.md' },
  { id: '6', created_at: '', fichier: 'fos-sync.jsx',               type: 'artifact',   statut: '⏳ P6-e22',      kb: '⏳ FOS-SYNC-DATA.md' },
  { id: '7', created_at: '', fichier: 'FOS-SETUP-GUIDE.md',         type: 'plan',       statut: '✅ créé',        kb: '⏳ Projects KB' },
  { id: '8', created_at: '', fichier: 'CLAUDE.md',                  type: 'notice',     statut: '✅ créé',        kb: '→ Claude Code' },
  { id: '9', created_at: '', fichier: 'FOS-MONITORING.md',          type: 'monitoring', statut: '✅ créé',        kb: '⏳ Projects KB' },
  { id: '10', created_at: '', fichier: 'FOS-ERROR-LOG.md',          type: 'monitoring', statut: '✅ créé',        kb: '⏳ Projects KB' },
  { id: '11', created_at: '', fichier: 'FOS-JOURNAL.md',            type: 'historique', statut: '✅ créé',        kb: '⏳ Projects KB' },
]

const SEED_CONTEXT_BLOCKS: ContextBlock[] = [
  { id: 'C-01', created_at: '', sort_order: 1, label: 'Persistance mémoire (4 niveaux)', content: 'M4 : Claude Memories + MD persistants → survit entre toutes les sessions\nM3a: Claude.ai Projects KB (~20 MD) → cross-device (L1a du stack)\nM3b: Cowork folder local → local uniquement (L1b du stack)\nM2 : Contexte conversation → perdu à la fin de la session\nM1 : Message + fichiers uploadés → immédiat uniquement' },
  { id: 'C-02', created_at: '', sort_order: 2, label: 'DA Void Glass — tokens obligatoires', content: 'Fond : #06070C\nAccent : #5EEAD4\nFonts : Figtree (UI) + JetBrains Mono (code/labels)\nCards : rgba(255,255,255,.025) border rgba(255,255,255,.055)\nOrbes : blur(80px), opacity 0.09–0.12, animation drift' },
  { id: 'C-03', created_at: '', sort_order: 3, label: 'Frameworks workflow retenus', content: 'Claudify : CLAUDE.md ≤100L, hooks, skills, memory, slash commands\nBMAD v6 : _bmad/ (underscore!), project-context.md, 8 agents + sidecars, 34 workflows\nShinpr : recipe-implement, recipe-design, recipe-diagnose, recipe-build' },
  { id: 'C-04', created_at: '', sort_order: 4, label: 'Règles coopération', content: '1. Innover → proposer avant d\'exécuter\n2. Exhaustif · Honnête · Objectif · Méthodique\n3. Plan + MD à chaque tâche\n4. Alignement vérifié avant toute action\n5. Zéro nuisance — absolu\n6. MD en premier, JSX en second' },
]

const SEED_NEXT_STEPS: NextStep[] = [
  { id: 'NS-01', created_at: '', label: 'Créer tables Supabase (SQL dans README)', phase: 'P6-e20', priority: 'critical', status: 'todo', sort_order: 1 },
  { id: 'NS-02', created_at: '', label: 'Déployer sur Vercel (foundation-os.vercel.app)', phase: 'P6-e20', priority: 'critical', status: 'todo', sort_order: 2 },
  { id: 'NS-03', created_at: '', label: 'Configurer .env.local avec clés Supabase', phase: 'P6-e20', priority: 'high', status: 'todo', sort_order: 3 },
  { id: 'NS-04', created_at: '', label: 'Créer page Knowledge (/knowledge)', phase: 'P6-e21', priority: 'high', status: 'todo', sort_order: 4 },
  { id: 'NS-05', created_at: '', label: 'Créer fos-graph.jsx', phase: 'P6-e21', priority: 'medium', status: 'todo', sort_order: 5 },
]

// ── Hook ─────────────────────────────────────────────────────────────

interface CommanderData {
  sessions: Session[]
  decisions: Decision[]
  risks: Risk[]
  docs: Doc[]
  contextBlocks: ContextBlock[]
  nextSteps: NextStep[]
  loading: boolean
  error: string | null
  source: 'supabase' | 'seed'
}

export function useCommander(): CommanderData {
  const [sessions,      setSessions]      = useState<Session[]>([])
  const [decisions,     setDecisions]     = useState<Decision[]>([])
  const [risks,         setRisks]         = useState<Risk[]>([])
  const [docs,          setDocs]          = useState<Doc[]>([])
  const [contextBlocks, setContextBlocks] = useState<ContextBlock[]>([])
  const [nextSteps,     setNextSteps]     = useState<NextStep[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [source,        setSource]        = useState<'supabase' | 'seed'>('seed')

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        const [s, d, r, dc, cb, ns] = await Promise.all([
          supabase.from('sessions').select('*').order('date', { ascending: false }),
          supabase.from('decisions').select('*').order('id'),
          supabase.from('risks').select('*').order('id'),
          supabase.from('docs').select('*').order('id'),
          supabase.from('context_blocks').select('*').order('sort_order'),
          supabase.from('next_steps').select('*').order('sort_order'),
        ])

        if (cancelled) return

        // If any query errored (table not yet created) fall back to seed
        const anyError = [s, d, r, dc, cb, ns].some(q => q.error)
        if (anyError) {
          useSeed()
          return
        }

        const hasSomeData =
          (s.data?.length ?? 0) +
          (d.data?.length ?? 0) +
          (r.data?.length ?? 0) > 0

        if (!hasSomeData) {
          useSeed()
          return
        }

        setSessions(s.data ?? SEED_SESSIONS)
        setDecisions(d.data ?? SEED_DECISIONS)
        setRisks(r.data ?? SEED_RISKS)
        setDocs(dc.data ?? SEED_DOCS)
        setContextBlocks(cb.data ?? SEED_CONTEXT_BLOCKS)
        setNextSteps(ns.data ?? SEED_NEXT_STEPS)
        setSource('supabase')
      } catch {
        if (!cancelled) useSeed()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    function useSeed() {
      setSessions(SEED_SESSIONS)
      setDecisions(SEED_DECISIONS)
      setRisks(SEED_RISKS)
      setDocs(SEED_DOCS)
      setContextBlocks(SEED_CONTEXT_BLOCKS)
      setNextSteps(SEED_NEXT_STEPS)
      setSource('seed')
      setError(null)
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { sessions, decisions, risks, docs, contextBlocks, nextSteps, loading, error, source }
}
