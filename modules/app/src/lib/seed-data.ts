/**
 * seed-data.ts - Static fallback data for Commander
 * Used when Supabase tables are empty or unavailable.
 */
import type { Session, Decision, Risk, Doc, ContextBlock, NextStep } from './database.types'

export const SEED_SESSIONS: Session[] = [
  { id: 'CONV-001', created_at: '2026-04-02T10:00:00Z', date: '2026-04-02', title: 'Fondation — Vision & Principes', items: 'Mode coopération défini · Vision LT fondation mondiale · Analyse Claudify + BMAD · FONDATION_v0.md créé', decisions: 'Coopération > exploitation · Traçabilité totale · Claudify + BMAD = fondations', phase: null, status: 'active' },
  { id: 'CONV-002', created_at: '2026-04-02T14:00:00Z', date: '2026-04-02', title: 'Skills iOS Pipeline Grade A', items: '18+ skills cartographiés · Pipeline 8 phases × 3 budgets · ios-pipeline-dashboard.jsx · 12 fichiers MD', decisions: '8 phases validation→growth · Stack iOS : Swift 6 + SwiftUI + TCA', phase: null, status: 'active' },
  { id: 'CONV-003', created_at: '2026-04-03T09:00:00Z', date: '2026-04-03', title: 'Architecture Foundation OS', items: 'Analyse exhaustive 10 artifacts · Architecture 6 artifacts cibles · Design System Void Glass formalisé', decisions: '6 artifacts fos-* · BMAD v6 _bmad/ (underscore) · DS Void Glass = spec Figma', phase: null, status: 'active' },
  { id: 'CONV-004', created_at: '2026-04-03T15:00:00Z', date: '2026-04-03', title: 'Stack, Coûts, Audit complet Foundation OS', items: 'Décision Vercel + Supabase (ADR-008) · Estimation coûts par phase · Audit 5 catégories · FOUNDATION-OS-SKILL créé · 10 fichiers MD', decisions: 'Option D Hybrid (ADR-007) · Vercel + Supabase (ADR-008) · FOUNDATION-OS-SKILL (ADR-010)', phase: null, status: 'active' },
  { id: 'CONV-005', created_at: '2026-04-04T08:00:00Z', date: '2026-04-04', title: 'App Foundation OS — Commander Page', items: 'Page Commander fonctionnelle · Supabase connecté · Routing /commander · Déployé Vercel', decisions: 'react-router-dom · Supabase tables créées · Void Glass strict', phase: null, status: 'active' },
]

export const SEED_DECISIONS: Decision[] = [
  { id: 'ADR-001', created_at: '2026-04-02T10:00:00Z', date: '2026-04-02', title: 'Coopération > exploitation',            context: 'Philosophie Foundation OS',                              impact: 'high',   status: 'active' },
  { id: 'ADR-002', created_at: '2026-04-02T10:05:00Z', date: '2026-04-02', title: 'Traçabilité totale',                    context: 'Journal + MD + monitoring systématique',                 impact: 'high',   status: 'active' },
  { id: 'ADR-003', created_at: '2026-04-02T10:10:00Z', date: '2026-04-02', title: 'Plan évolutif',                         context: 'Itérations courtes, pas de rigidité',                    impact: 'medium', status: 'active' },
  { id: 'ADR-004', created_at: '2026-04-02T10:15:00Z', date: '2026-04-02', title: 'Claudify + BMAD = fondations workflow', context: 'Déploiement sur Claude.ai Projects après préparation',   impact: 'high',   status: 'active' },
  { id: 'ADR-005', created_at: '2026-04-03T09:00:00Z', date: '2026-04-03', title: 'Architecture MD/JSX',                   context: 'MD = source de vérité, JSX = contrôleur',                impact: 'high',   status: 'active' },
  { id: 'ADR-006', created_at: '2026-04-03T09:05:00Z', date: '2026-04-03', title: '6 artifacts fos-*',                     context: 'Architecture cible après analyse exhaustive',            impact: 'high',   status: 'active' },
  { id: 'ADR-007', created_at: '2026-04-03T09:10:00Z', date: '2026-04-03', title: 'Option D Hybrid',                       context: 'Pipeline app iOS — Hybrid artifacts + app',             impact: 'high',   status: 'active' },
  { id: 'ADR-008', created_at: '2026-04-03T09:15:00Z', date: '2026-04-03', title: 'Vercel + Supabase',                     context: 'Stack L5 définitive — free tier suffisant usage perso',  impact: 'high',   status: 'active' },
  { id: 'ADR-009', created_at: '2026-04-03T09:20:00Z', date: '2026-04-03', title: '22 étapes setup orchestrées',           context: 'Plan déploiement Foundation OS complet',                 impact: 'high',   status: 'active' },
  { id: 'ADR-010', created_at: '2026-04-03T09:25:00Z', date: '2026-04-03', title: 'FOUNDATION-OS-SKILL = mémoire',         context: 'Skill pour maintien cohérence long terme',               impact: 'high',   status: 'active' },
  { id: 'ADR-011', created_at: '2026-04-03T09:30:00Z', date: '2026-04-03', title: 'OMC team syntax canonical (v4.1.7+)',   context: 'team "tâche" — swarm/ultrapilot supprimés',              impact: 'medium', status: 'active' },
  { id: 'ADR-012', created_at: '2026-04-03T09:35:00Z', date: '2026-04-03', title: 'L1 = deux couches',                     context: 'Architecture L1 clarifiée',                              impact: 'high',   status: 'active' },
]

export const SEED_RISKS: Risk[] = [
  { id: 'R-01', created_at: '2026-04-03T00:00:00Z', risk: 'Artifacts trop lourds → rendu partiel',  impact: 'medium', proba: 'high',   mitigation: 'Consolidation 10→6 artifacts',   status: 'open' },
  { id: 'R-02', created_at: '2026-04-03T00:00:00Z', risk: 'Drift MD/JSX (syncs oubliées)',           impact: 'medium', proba: 'medium', mitigation: 'Pattern MD-first strict',         status: 'open' },
  { id: 'R-03', created_at: '2026-04-03T00:00:00Z', risk: 'BMAD v6 changements API',                 impact: 'low',    proba: 'low',    mitigation: 'Vérifier docs avant install',     status: 'open' },
  { id: 'R-04', created_at: '2026-04-03T00:00:00Z', risk: 'Surengineering workflow avant produit',   impact: 'medium', proba: 'medium', mitigation: 'Phase 00 priorité absolue',       status: 'open' },
]

export const SEED_DOCS: Doc[] = [
  { id: '1',  created_at: '2026-04-03T00:00:00Z', title: 'fos-commander.jsx',          content: 'livré 364L',           category: 'artifact', tags: ['FOS-COMMANDER-DATA.md'],          sort_order: 1 },
  { id: '2',  created_at: '2026-04-03T00:00:00Z', title: 'fos-knowledge.jsx',          content: 'livré 448L',           category: 'artifact', tags: ['FOS-KNOWLEDGE-DATA.md'],          sort_order: 2 },
  { id: '3',  created_at: '2026-04-03T00:00:00Z', title: 'fos-index.jsx',              content: 'livré 364L',           category: 'artifact', tags: ['FOS-INDEX-DATA.md'],              sort_order: 3 },
  { id: '4',  created_at: '2026-04-03T00:00:00Z', title: 'fos-scale-orchestrator.jsx', content: 'livré 558L',           category: 'artifact', tags: ['FOS-SCALE-ORCHESTRATOR-DATA.md'], sort_order: 4 },
  { id: '5',  created_at: '2026-04-03T00:00:00Z', title: 'fos-graph.jsx',              content: 'livré 309L',           category: 'artifact', tags: ['FOS-GRAPH-DATA.md'],              sort_order: 5 },
  { id: '6',  created_at: '2026-04-03T00:00:00Z', title: 'fos-sync.jsx',               content: 'livré 390L',           category: 'artifact', tags: ['FOS-SYNC-DATA.md'],               sort_order: 6 },
  { id: '7',  created_at: '2026-04-03T00:00:00Z', title: 'fos-toolbox.jsx',            content: 'livré 534L',           category: 'artifact', tags: ['FOS-TOOLBOX-DATA.md'],            sort_order: 7 },
  { id: '8',  created_at: '2026-04-03T00:00:00Z', title: 'CLAUDE.md',                  content: 'actif',                category: 'notice',   tags: null,                               sort_order: 8 },
  { id: '9',  created_at: '2026-04-03T00:00:00Z', title: 'docs/design-system.md',      content: 'Void Glass tokens',    category: 'design',   tags: null,                               sort_order: 9 },
  { id: '10', created_at: '2026-04-03T00:00:00Z', title: 'docs/architecture.md',       content: 'Decisions techniques', category: 'doc',      tags: null,                               sort_order: 10 },
  { id: '11', created_at: '2026-04-03T00:00:00Z', title: 'docs/setup-guide.md',        content: 'Guide setup',          category: 'guide',    tags: null,                               sort_order: 11 },
]

export const SEED_CONTEXT_BLOCKS: ContextBlock[] = [
  { id: 'C-01', created_at: '2026-04-03T00:00:00Z', sort_order: 1, label: 'Persistance mémoire (4 niveaux)', content: 'M4 : Claude Memories + MD persistants → survit entre toutes les sessions\nM3a: Claude.ai Projects KB (~20 MD) → cross-device (L1a du stack)\nM3b: Cowork folder local → local uniquement (L1b du stack)\nM2 : Contexte conversation → perdu à la fin de la session\nM1 : Message + fichiers uploadés → immédiat uniquement' },
  { id: 'C-02', created_at: '2026-04-03T00:00:00Z', sort_order: 2, label: 'DA Void Glass — tokens obligatoires', content: 'Fond : var(--fos-color-bg-canvas)\nAccent : var(--fos-color-accent-brand)\nFonts : Figtree (UI) + JetBrains Mono (code/labels)\nCards : var(--fos-color-bg-surface) border var(--fos-color-border-default)\nOrbes : blur(80px), opacity 0.09–0.12, animation drift' },
  { id: 'C-03', created_at: '2026-04-03T00:00:00Z', sort_order: 3, label: 'Frameworks workflow retenus', content: 'Claudify : CLAUDE.md ≤100L, hooks, skills, memory, slash commands\nBMAD v6 : _bmad/ (underscore!), project-context.md, 8 agents + sidecars, 34 workflows\nShinpr : recipe-implement, recipe-design, recipe-diagnose, recipe-build' },
  { id: 'C-04', created_at: '2026-04-03T00:00:00Z', sort_order: 4, label: 'Règles coopération', content: '1. Innover → proposer avant d\'exécuter\n2. Exhaustif · Honnête · Objectif · Méthodique\n3. Plan + MD à chaque tâche\n4. Alignement vérifié avant toute action\n5. Zéro nuisance — absolu\n6. MD en premier, JSX en second' },
]

export const SEED_NEXT_STEPS: NextStep[] = [
  { id: 'NS-01', created_at: '2026-04-03T00:00:00Z', label: 'Créer tables Supabase (SQL dans README)', phase: 'P6-e20', priority: 'critical', status: 'todo', sort_order: 1 },
  { id: 'NS-02', created_at: '2026-04-03T00:00:00Z', label: 'Déployer sur Vercel (foundation-os.vercel.app)', phase: 'P6-e20', priority: 'critical', status: 'todo', sort_order: 2 },
  { id: 'NS-03', created_at: '2026-04-03T00:00:00Z', label: 'Configurer .env.local avec clés Supabase', phase: 'P6-e20', priority: 'high', status: 'todo', sort_order: 3 },
  { id: 'NS-04', created_at: '2026-04-03T00:00:00Z', label: 'Créer page Knowledge (/knowledge)', phase: 'P6-e21', priority: 'high', status: 'todo', sort_order: 4 },
  { id: 'NS-05', created_at: '2026-04-03T00:00:00Z', label: 'Créer fos-graph.jsx', phase: 'P6-e21', priority: 'medium', status: 'todo', sort_order: 5 },
]
