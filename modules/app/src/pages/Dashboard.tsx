import { useState } from 'react'
import { Badge, Card, TabBar, PageHeader, Footer } from '@/components'

// ── Data ────────────────────────────────────────────────────────────

const META = {
  name: 'Foundation OS',
  version: 'v0.1',
  phase: '00 — Fondation',
  objectiveCT: 'OS de travail IA-driven · Coopération Claude/Kévin',
  dataVersion: '1.2.0',
  lastSync: '2026-04-03',
}

const PIPELINE_PHASES = [
  { num: '00', label: 'Fondation OS',    color: '#A78BFA', status: 'active'  },
  { num: '01', label: 'Design',          color: '#5EEAD4', status: 'pending' },
  { num: '02', label: 'Architecture',    color: '#F97316', status: 'pending' },
  { num: '03', label: 'Développement',   color: '#3B82F6', status: 'pending' },
  { num: '04', label: 'Qualité',         color: '#EAB308', status: 'pending' },
  { num: '05', label: 'Launch',          color: '#22C55E', status: 'pending' },
  { num: '06', label: 'Monétisation',    color: '#EC4899', status: 'pending' },
  { num: '07', label: 'Growth',          color: '#94A3B8', status: 'pending' },
]

const SESSIONS = [
  {
    id: 'CONV-001', date: '2026-04-02',
    title: 'Fondation — Vision & Principes',
    items: 'Mode coopération défini · Vision LT fondation mondiale · Analyse Claudify + BMAD · FONDATION_v0.md créé',
    decisions: 'Coopération > exploitation · Traçabilité totale · Claudify + BMAD = fondations',
  },
  {
    id: 'CONV-002', date: '2026-04-02',
    title: 'Skills iOS Pipeline Grade A',
    items: '18+ skills cartographiés · Pipeline 8 phases × 3 budgets · ios-pipeline-dashboard.jsx · 12 fichiers MD',
    decisions: '8 phases validation→growth · Stack iOS : Swift 6 + SwiftUI + TCA',
  },
  {
    id: 'CONV-003', date: '2026-04-03',
    title: 'Architecture Foundation OS',
    items: 'Analyse exhaustive 10 artifacts · Architecture 6 artifacts cibles · Design System Void Glass formalisé',
    decisions: '6 artifacts fos-* · BMAD v6 _bmad/ (underscore) · DS Void Glass = spec Figma',
  },
  {
    id: 'CONV-004', date: '2026-04-03',
    title: 'Stack, Coûts, Audit complet Foundation OS',
    items: 'Décision Vercel + Supabase (ADR-008) · Estimation coûts par phase · Audit 5 catégories · FOUNDATION-OS-SKILL créé · 10 fichiers MD · Scale-orchestrator v3.3.0',
    decisions: 'Option D Hybrid (ADR-007) · Vercel + Supabase (ADR-008) · FOUNDATION-OS-SKILL (ADR-010)',
  },
]

const DECISIONS = [
  { id: 'ADR-001', date: '2026-04-02', title: 'Coopération > exploitation',            context: 'Philosophie Foundation OS',                              impact: 'high',   status: 'active' },
  { id: 'ADR-002', date: '2026-04-02', title: 'Traçabilité totale',                    context: 'Journal + MD + monitoring systématique',                 impact: 'high',   status: 'active' },
  { id: 'ADR-003', date: '2026-04-02', title: 'Plan évolutif',                         context: 'Itérations courtes, pas de rigidité',                    impact: 'medium', status: 'active' },
  { id: 'ADR-004', date: '2026-04-02', title: 'Claudify + BMAD = fondations workflow', context: 'Déploiement sur Claude.ai Projects après préparation',   impact: 'high',   status: 'active' },
  { id: 'ADR-005', date: '2026-04-03', title: 'Architecture MD/JSX',                   context: 'MD = source de vérité, JSX = contrôleur',                impact: 'high',   status: 'active' },
  { id: 'ADR-006', date: '2026-04-03', title: '6 artifacts fos-*',                     context: 'Architecture cible après analyse exhaustive',            impact: 'high',   status: 'active' },
  { id: 'ADR-007', date: '2026-04-03', title: 'Option D Hybrid',                       context: 'Pipeline app iOS — Hybrid artifacts + app',             impact: 'high',   status: 'active' },
  { id: 'ADR-008', date: '2026-04-03', title: 'Vercel + Supabase',                     context: 'Stack L5 définitive — free tier suffisant usage perso',  impact: 'high',   status: 'active' },
  { id: 'ADR-009', date: '2026-04-03', title: '22 étapes setup orchestrées',           context: 'Plan déploiement Foundation OS complet',                 impact: 'high',   status: 'active' },
  { id: 'ADR-010', date: '2026-04-03', title: 'FOUNDATION-OS-SKILL = mémoire',         context: 'Skill pour maintien cohérence long terme',               impact: 'high',   status: 'active' },
  { id: 'ADR-011', date: '2026-04-03', title: 'OMC team syntax canonical (v4.1.7+)',   context: 'team "tâche" — swarm/ultrapilot supprimés',              impact: 'medium', status: 'active' },
  { id: 'ADR-012', date: '2026-04-03', title: 'L1 = deux couches',                     context: 'Architecture L1 clarifiée',                              impact: 'high',   status: 'active' },
]

const RISKS = [
  { id: 'R-01', risk: 'Artifacts trop lourds → rendu partiel',  impact: 'medium', proba: 'high',   mitigation: 'Consolidation 10→6 artifacts',   status: 'open' },
  { id: 'R-02', risk: 'Drift MD/JSX (syncs oubliées)',           impact: 'medium', proba: 'medium', mitigation: 'Pattern MD-first strict',         status: 'open' },
  { id: 'R-03', risk: 'BMAD v6 changements API',                 impact: 'low',    proba: 'low',    mitigation: 'Vérifier docs avant install',     status: 'open' },
  { id: 'R-04', risk: 'Surengineering workflow avant produit',   impact: 'medium', proba: 'medium', mitigation: 'Phase 00 priorité absolue',       status: 'open' },
]

const CONTEXTES = [
  { id: 'C-01', label: 'Persistance mémoire (4 niveaux)', content: 'M4 : Claude Memories + MD persistants → survit entre toutes les sessions\nM3a: Claude.ai Projects KB (~20 MD) → cross-device (L1a du stack)\nM3b: Cowork folder local → local uniquement (L1b du stack)\nM2 : Contexte conversation → perdu à la fin de la session\nM1 : Message + fichiers uploadés → immédiat uniquement\nNote: M = Memory tier (≠ L = Stack layer)' },
  { id: 'C-02', label: 'DA Void Glass — tokens obligatoires', content: 'Fond : #06070C\nAccent : #5EEAD4\nFonts : Figtree (UI) + JetBrains Mono (code/labels)\nCards : rgba(255,255,255,.025) border rgba(255,255,255,.055)\nOrbes : blur(80px), opacity 0.09–0.12, animation drift\nFade-in : staggered, delays 40ms par élément' },
  { id: 'C-03', label: 'Frameworks workflow retenus', content: 'Claudify : CLAUDE.md ≤100L, hooks, skills, memory, slash commands\nBMAD v6 : _bmad/ (underscore!), project-context.md, 8 agents + sidecars, 34 workflows\nShinpr : recipe-implement, recipe-design, recipe-diagnose, recipe-build' },
  { id: 'C-04', label: 'Règles coopération', content: '1. Innover → proposer avant d\'exécuter\n2. Exhaustif · Honnête · Objectif · Méthodique\n3. Plan + MD à chaque tâche\n4. Alignement vérifié avant toute action\n5. Zéro nuisance — absolu\n6. MD en premier, JSX en second' },
]

const DOCUMENTS = [
  { fichier: 'fos-commander.jsx',          type: 'artifact',  statut: 'livré 364L',  kb: 'FOS-COMMANDER-DATA.md' },
  { fichier: 'fos-knowledge.jsx',          type: 'artifact',  statut: 'livré 448L',  kb: 'FOS-KNOWLEDGE-DATA.md' },
  { fichier: 'fos-graph.jsx',              type: 'artifact',  statut: 'livré 309L',  kb: 'FOS-GRAPH-DATA.md' },
  { fichier: 'fos-sync.jsx',               type: 'artifact',  statut: 'livré 390L',  kb: 'FOS-SYNC-DATA.md' },
  { fichier: 'fos-index.jsx',              type: 'artifact',  statut: 'livré 410L',  kb: 'FOS-INDEX-DATA.md' },
  { fichier: 'fos-toolbox.jsx',            type: 'artifact',  statut: 'livré 534L',  kb: 'FOS-TOOLBOX-DATA.md' },
  { fichier: 'fos-scale-orchestrator.jsx', type: 'artifact',  statut: 'livré 558L',  kb: 'FOS-SCALE-ORCHESTRATOR-DATA.md' },
  { fichier: 'CLAUDE.md',                  type: 'notice',    statut: 'actif',       kb: 'Claude Code' },
  { fichier: 'CONTEXT.md',                 type: 'contexte',  statut: 'actif',       kb: 'Source de verite' },
  { fichier: 'docs/design-system.md',      type: 'design',    statut: 'actif',       kb: 'Void Glass tokens' },
  { fichier: 'docs/architecture.md',       type: 'archi',     statut: 'actif',       kb: 'Decisions techniques' },
  { fichier: 'docs/setup-guide.md',        type: 'guide',     statut: 'actif',       kb: 'Guide setup' },
  { fichier: 'docs/manifeste.md',          type: 'doc',       statut: 'actif',       kb: 'Principes FOS' },
]

const TABS = [
  { id: 'pipeline',  label: 'Pipeline'  },
  { id: 'sessions',  label: 'Sessions'  },
  { id: 'decisions', label: 'Décisions' },
  { id: 'risques',   label: 'Risques'   },
  { id: 'contextes', label: 'Contextes' },
  { id: 'documents', label: 'Documents' },
]

// ── Helpers ─────────────────────────────────────────────────────────

const impactColor = (v: string) =>
  ({ high: '#EF4444', medium: '#F97316', low: '#22C55E' }[v] ?? '#94A3B8')

// ── Sections ────────────────────────────────────────────────────────

function PipelineSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 8 }}>
      {PIPELINE_PHASES.map((p, i) => (
        <div key={p.num} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: p.color, letterSpacing: '.08em' }}>P{p.num}</span>
              <div className="flex items-center" style={{ gap: 4 }}>
                {p.status === 'active' && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5EEAD4', display: 'inline-block', animation: 'pulse 3s infinite' }} />
                )}
                <Badge label={p.status} color={p.status === 'active' ? '#5EEAD4' : '#94A3B8'} />
              </div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#FAFAFA' }}>{p.label}</p>
            <div
              style={{ marginTop: 8, height: 4, borderRadius: 2, backgroundColor: p.color + (p.status === 'active' ? 'CC' : '30') }}
            />
          </Card>
        </div>
      ))}
    </div>
  )
}

function SessionsSection() {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {SESSIONS.map((s, i) => (
        <div key={s.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{s.id}</span>
                <span style={{ fontSize: 10, color: '#52525B' }}>{s.date}</span>
              </div>
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: '#FAFAFA', marginBottom: 6 }}>{s.title}</h3>
            <p style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>
              <span style={{ color: '#3F3F46' }}>Items · </span>{s.items}
            </p>
            <p style={{ fontSize: 10, color: '#71717A' }}>
              <span style={{ color: '#3F3F46' }}>Décisions · </span>{s.decisions}
            </p>
          </Card>
        </div>
      ))}
    </div>
  )
}

function DecisionsSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
      {DECISIONS.map((d, i) => (
        <div key={d.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{d.id}</span>
              <div className="flex" style={{ gap: 4 }}>
                <Badge label={d.impact} color={impactColor(d.impact)} />
                <Badge label={d.status} color="#5EEAD4" />
              </div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#FAFAFA', marginBottom: 4 }}>{d.title}</p>
            <p style={{ fontSize: 10, color: '#52525B' }}>{d.context}</p>
            <p style={{ fontSize: 9, color: '#3F3F46', marginTop: 4 }}>{d.date}</p>
          </Card>
        </div>
      ))}
    </div>
  )
}

function RisquesSection() {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {RISKS.map((r, i) => (
        <div key={r.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{r.id}</span>
                  <Badge label={`impact ${r.impact}`} color={impactColor(r.impact)} />
                  <Badge label={`proba ${r.proba}`}   color={impactColor(r.proba)} />
                </div>
                <p style={{ fontSize: 12, color: '#FAFAFA', marginBottom: 4 }}>{r.risk}</p>
                <p style={{ fontSize: 10, color: '#52525B' }}>Mitigation · {r.mitigation}</p>
              </div>
              <Badge label={r.status} color="#94A3B8" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

function ContextesSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
      {CONTEXTES.map((c, i) => (
        <div key={c.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{c.id}</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#FAFAFA', marginBottom: 8 }}>{c.label}</p>
            {c.content.split('\n').map((line, j) => (
              <p key={j} style={{ fontSize: 10, color: '#71717A', marginBottom: 2 }}>{line}</p>
            ))}
          </Card>
        </div>
      ))}
    </div>
  )
}

function DocumentsSection() {
  const typeColor = (t: string) => ({ artifact: '#5EEAD4', plan: '#A78BFA', doc: '#3B82F6', notice: '#F97316', skill: '#EAB308', monitoring: '#EF4444', historique: '#94A3B8', design: '#EC4899', contexte: '#22C55E', guide: '#22C55E', archi: '#A78BFA' }[t] ?? '#94A3B8')
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {DOCUMENTS.map((d, i) => (
        <div key={d.fichier} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 8 }}>
                <Badge label={d.type} color={typeColor(d.type)} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#FAFAFA' }}>{d.fichier}</span>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ fontSize: 10, color: '#52525B' }}>{d.statut}</span>
                <span style={{ fontSize: 10, color: '#3F3F46' }}>{d.kb}</span>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pipeline')

  const renderSection = () => {
    switch (activeTab) {
      case 'pipeline':  return <PipelineSection />
      case 'sessions':  return <SessionsSection />
      case 'decisions': return <DecisionsSection />
      case 'risques':   return <RisquesSection />
      case 'contextes': return <ContextesSection />
      case 'documents': return <DocumentsSection />
      default:          return null
    }
  }

  return (
    <>
      <PageHeader
        title="FOS Commander"
        subtitle={META.objectiveCT}
        version={META.version}
        meta={META.phase}
      >
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
          {PIPELINE_PHASES.length} Phases
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(94,234,212,.15)', color: '#5EEAD4' }}>
          {SESSIONS.length} Sessions
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(59,130,246,.15)', color: '#3B82F6' }}>
          {DECISIONS.length} ADR
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(239,68,68,.15)', color: '#EF4444' }}>
          {RISKS.length} Risques
        </div>
      </PageHeader>

      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="mb-8">{renderSection()}</div>

      <Footer
        principles={['Zéro nuisance', 'MD first · JSX second', 'Traçabilité totale']}
        dataVersion={META.dataVersion}
        lastSync={META.lastSync}
      />
    </>
  )
}
