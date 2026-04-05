import React, { useState } from 'react';

// === CONSTANTS ===

const META = {
  name: 'Foundation OS', version: 'v0.1', phase: '00 — Fondation',
  budget: 'indie', started: '2026-04-02',
  objectiveCT: 'OS de travail IA-driven · Coopération Claude/Kévin',
  objectiveLT: 'Fondation pour aider le monde'
};

const PIPELINE_PHASES = [
  { num: '00', label: 'Fondation OS', color: '#A78BFA', status: 'active' },
  { num: '01', label: 'Design', color: '#5EEAD4', status: 'pending' },
  { num: '02', label: 'Architecture', color: '#F97316', status: 'pending' },
  { num: '03', label: 'Développement', color: '#3B82F6', status: 'pending' },
  { num: '04', label: 'Qualité', color: '#EAB308', status: 'pending' },
  { num: '05', label: 'Launch', color: '#22C55E', status: 'pending' },
  { num: '06', label: 'Monétisation', color: '#EC4899', status: 'pending' },
  { num: '07', label: 'Growth', color: '#94A3B8', status: 'pending' }
];

const SESSIONS = [
  { id: 'CONV-001', date: '2026-04-02', title: 'Fondation — Vision & Principes',
    items: 'Mode coopération défini · Vision LT fondation mondiale · Analyse Claudify + BMAD · FONDATION_v0.md créé',
    decisions: 'Coopération > exploitation · Traçabilité totale · Claudify + BMAD = fondations' },
  { id: 'CONV-002', date: '2026-04-02', title: 'Skills iOS Pipeline Grade A',
    items: '18+ skills cartographiés · Pipeline 8 phases × 3 budgets · ios-pipeline-dashboard.jsx · 12 fichiers MD',
    decisions: '8 phases validation→growth · Stack iOS : Swift 6 + SwiftUI + TCA' },
  { id: 'CONV-003', date: '2026-04-03', title: 'Architecture Foundation OS',
    items: 'Analyse exhaustive 10 artifacts · Architecture 6 artifacts cibles · Design System Void Glass formalisé',
    decisions: '6 artifacts fos-* · BMAD v6 _bmad/ (underscore) · DS Void Glass = spec Figma' },
  { id: 'CONV-004', date: '2026-04-03', title: 'Stack, Coûts, Audit complet Foundation OS',
    items: 'Décision Vercel + Supabase (ADR-008) · Estimation coûts par phase · Audit 5 catégories · FOUNDATION-OS-SKILL créé · 10 fichiers MD · Scale-orchestrator v3.3.0',
    decisions: 'Option D Hybrid (ADR-007) · Vercel + Supabase (ADR-008) · FOUNDATION-OS-SKILL (ADR-010)' }
];

const DECISIONS = [
  { id: 'ADR-001', date: '2026-04-02', title: 'Coopération > exploitation', context: 'Philosophie Foundation OS', impact: 'high', status: 'active' },
  { id: 'ADR-002', date: '2026-04-02', title: 'Traçabilité totale', context: 'Journal + MD + monitoring systématique', impact: 'high', status: 'active' },
  { id: 'ADR-003', date: '2026-04-02', title: 'Plan évolutif', context: 'Itérations courtes, pas de rigidité', impact: 'medium', status: 'active' },
  { id: 'ADR-004', date: '2026-04-02', title: 'Claudify + BMAD = fondations workflow', context: 'Déploiement sur Claude.ai Projects après préparation', impact: 'high', status: 'active' },
  { id: 'ADR-005', date: '2026-04-03', title: 'Architecture MD/JSX', context: 'MD = source de vérité, JSX = contrôleur', impact: 'high', status: 'active' },
  { id: 'ADR-006', date: '2026-04-03', title: '6 artifacts fos-*', context: 'Architecture cible après analyse exhaustive', impact: 'high', status: 'active' },
  { id: 'ADR-007', date: '2026-04-03', title: 'Option D Hybrid', context: 'Pipeline app iOS — Hybrid artifacts + app', impact: 'high', status: 'active' },
  { id: 'ADR-008', date: '2026-04-03', title: 'Vercel + Supabase (pas Railway)', context: 'Stack L5 définitive — free tier suffisant usage perso', impact: 'high', status: 'active' },
  { id: 'ADR-009', date: '2026-04-03', title: '22 étapes setup orchestrées', context: 'Plan déploiement Foundation OS complet', impact: 'high', status: 'active' },
  { id: 'ADR-010', date: '2026-04-03', title: 'FOUNDATION-OS-SKILL = mémoire orchestration', context: 'Skill pour maintien cohérence long terme', impact: 'high', status: 'active' },
  { id: 'ADR-011', date: '2026-04-03', title: 'OMC team syntax canonical (v4.1.7+)', context: 'team "tâche" — swarm/ultrapilot supprimés', impact: 'medium', status: 'active' },
  { id: 'ADR-012', date: '2026-04-03', title: 'L1 = deux couches (Claude.ai Projects + Cowork)', context: 'Architecture L1 clarifiée', impact: 'high', status: 'active' }
];

const CONTEXTS = [
  { id: 'C-01', title: 'Persistance mémoire (4 niveaux)',
    lines: ['M4 : Claude Memories + MD persistants → survit entre toutes les sessions', 'M3a: Claude.ai Projects KB (~20 MD) → cross-device (L1a du stack)', 'M3b: Cowork folder local → local uniquement (L1b du stack)', 'M2 : Contexte conversation → perdu à la fin de la session', 'M1 : Message + fichiers uploadés → immédiat uniquement'] },
  { id: 'C-02', title: 'DA Void Glass — tokens obligatoires',
    lines: ['Fond : #06070C', 'Accent : #5EEAD4', 'Fonts : Figtree (UI) + JetBrains Mono (code/labels)', 'Cards : rgba(255,255,255,.025) border rgba(255,255,255,.055)', 'Orbes : blur(80px), opacity 0.09–0.12, animation drift', 'Fade-in : staggered, delays 40ms par élément'] },
  { id: 'C-03', title: 'Frameworks workflow retenus',
    lines: ['Claudify : CLAUDE.md ≤100L, hooks, skills, memory, slash commands', 'BMAD v6 : _bmad/ (underscore!), project-context.md, 8 agents + sidecars, 34 workflows', 'Shinpr : recipe-implement, recipe-design, recipe-diagnose, recipe-build'] },
  { id: 'C-04', title: 'Règles coopération',
    lines: ['1. Innover → proposer avant d\'exécuter', '2. Exhaustif · Honnête · Objectif · Méthodique', '3. Plan + MD à chaque tâche', '4. Alignement vérifié avant toute action', '5. Zéro nuisance — absolu', '6. MD en premier, JSX en second'] }
];

const RISKS = [
  { id: 'R-01', risk: 'Artifacts trop lourds → rendu partiel', impact: 'medium', proba: 'high', mitigation: 'Consolidation 10→6 artifacts', status: 'open' },
  { id: 'R-02', risk: 'Drift MD/JSX (syncs oubliées)', impact: 'medium', proba: 'medium', mitigation: 'Pattern MD-first strict', status: 'open' },
  { id: 'R-03', risk: 'BMAD v6 changements API', impact: 'low', proba: 'low', mitigation: 'Vérifier docs avant install', status: 'open' },
  { id: 'R-04', risk: 'Surengineering workflow avant produit', impact: 'medium', proba: 'medium', mitigation: 'Phase 00 priorité absolue', status: 'open' }
];

const DOCUMENTS = [
  { file: 'fos-commander.jsx', type: 'artifact', status: 'livré 571L', kb: true },
  { file: 'fos-knowledge.jsx', type: 'artifact', status: 'livré 330L', kb: true },
  { file: 'fos-graph.jsx', type: 'artifact', status: 'P6-e21', kb: false },
  { file: 'fos-sync.jsx', type: 'artifact', status: 'P6-e22', kb: false },
  { file: 'fos-index.jsx', type: 'artifact', status: 'livré 300L', kb: true },
  { file: 'fos-pipeline.jsx', type: 'artifact', status: 'P6', kb: false },
  { file: 'fos-scale-orchestrator.jsx', type: 'artifact', status: 'livré 435L', kb: true },
  { file: 'FOS-SETUP-GUIDE.md', type: 'plan', status: 'créé', kb: false },
  { file: 'FOS-SCALE-ORCHESTRATOR-DATA.md', type: 'plan', status: 'v3.3.0', kb: false },
  { file: 'FOS-ARCHITECTURE-ANALYSIS.md', type: 'doc', status: 'complet', kb: false },
  { file: 'FOS-META-PLAN.md', type: 'doc', status: 'complet', kb: false },
  { file: 'project-context.md', type: 'doc', status: 'créé', kb: false },
  { file: 'FOS-TECH-ARCHITECTURE.md', type: 'doc', status: 'créé', kb: false },
  { file: 'CLAUDE.md', type: 'notice', status: 'créé', kb: false },
  { file: 'CONTEXT.md', type: 'contexte', status: 'actif', kb: false },
  { file: 'docs/design-system.md', type: 'design', status: 'actif', kb: false }
];

const TABS = [
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'decisions', label: 'Décisions' },
  { id: 'contextes', label: 'Contextes' },
  { id: 'risques', label: 'Risques' },
  { id: 'documents', label: 'Documents' }
];

// === HELPERS ===

const impactColor = (v) => ({ high: '#EF4444', medium: '#F59E0B', low: '#22C55E' }[v] || '#94A3B8');
const probaColor = (v) => ({ high: '#EF4444', medium: '#F59E0B', low: '#22C55E' }[v] || '#94A3B8');

const Badge = ({ label, color }) => (
  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
    style={{ backgroundColor: color + '25', color }}>
    {label}
  </span>
);

const Card = ({ children, style }) => (
  <div className="p-4 rounded-lg border"
    style={{ backgroundColor: 'rgba(255,255,255,.025)', borderColor: 'rgba(255,255,255,.055)', ...style }}>
    {children}
  </div>
);

// === SECTIONS ===

const PipelineSection = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {PIPELINE_PHASES.map((p, i) => (
      <div key={p.num} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs" style={{ color: p.color }}>P{p.num}</span>
            <Badge label={p.status} color={p.status === 'active' ? '#5EEAD4' : '#94A3B8'} />
          </div>
          <p className="text-sm text-white font-medium">{p.label}</p>
          <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: p.color + (p.status === 'active' ? 'CC' : '30') }} />
        </Card>
      </div>
    ))}
  </div>
);

const SessionsSection = () => (
  <div className="flex flex-col gap-4">
    {SESSIONS.map((s, i) => (
      <div key={s.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-mono text-xs text-cyan-400 mr-2">{s.id}</span>
              <span className="text-xs text-gray-400">{s.date}</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
          <p className="text-xs text-gray-300 mb-1"><span className="text-gray-500">Items ·</span> {s.items}</p>
          <p className="text-xs text-gray-300"><span className="text-gray-500">Décisions ·</span> {s.decisions}</p>
        </Card>
      </div>
    ))}
  </div>
);

const DecisionsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {DECISIONS.map((d, i) => (
      <div key={d.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-cyan-400">{d.id}</span>
            <div className="flex gap-1">
              <Badge label={d.impact} color={impactColor(d.impact)} />
              <Badge label={d.status} color="#5EEAD4" />
            </div>
          </div>
          <p className="text-sm font-medium text-white mb-1">{d.title}</p>
          <p className="text-xs text-gray-400">{d.context}</p>
          <p className="text-xs text-gray-500 mt-1">{d.date}</p>
        </Card>
      </div>
    ))}
  </div>
);

const ContextesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {CONTEXTS.map((c, i) => (
      <div key={c.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-cyan-400">{c.id}</span>
            <h3 className="text-sm font-semibold text-white">{c.title}</h3>
          </div>
          <div className="flex flex-col gap-1">
            {c.lines.map((line, j) => (
              <p key={j} className="font-mono text-xs text-gray-300">{line}</p>
            ))}
          </div>
        </Card>
      </div>
    ))}
  </div>
);

const RisquesSection = () => (
  <div className="flex flex-col gap-3">
    {RISKS.map((r, i) => (
      <div key={r.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-cyan-400">{r.id}</span>
                <Badge label={`impact ${r.impact}`} color={impactColor(r.impact)} />
                <Badge label={`proba ${r.proba}`} color={probaColor(r.proba)} />
              </div>
              <p className="text-sm text-white mb-1">{r.risk}</p>
              <p className="text-xs text-gray-400">Mitigation · {r.mitigation}</p>
            </div>
            <Badge label={r.status} color="#94A3B8" />
          </div>
        </Card>
      </div>
    ))}
  </div>
);

const DocumentsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {DOCUMENTS.map((d, i) => (
      <div key={d.file} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{d.type === 'artifact' ? '⚙️' : d.type === 'doc' ? '📄' : d.type === 'plan' ? '📋' : '🗂️'}</span>
              <span className="font-mono text-xs text-white">{d.file}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge label={d.type} color="#A78BFA" />
              {d.kb && <Badge label="KB" color="#5EEAD4" />}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-6">{d.status}</p>
        </Card>
      </div>
    ))}
  </div>
);

// === MAIN COMPONENT ===

export default function FOSCommander() {
  const [activeTab, setActiveTab] = useState('pipeline');

  const renderSection = () => {
    switch (activeTab) {
      case 'pipeline': return <PipelineSection />;
      case 'sessions': return <SessionsSection />;
      case 'decisions': return <DecisionsSection />;
      case 'contextes': return <ContextesSection />;
      case 'risques': return <RisquesSection />;
      case 'documents': return <DocumentsSection />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#06070C' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Figtree' }}>
              FOS Commander
            </h1>
            <p className="text-gray-400 text-sm">{META.objectiveCT}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-cyan-400">{META.version}</span>
            <p className="text-xs text-gray-500 mt-0.5">{META.phase}</p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex gap-3 mt-5 flex-wrap">
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
            {PIPELINE_PHASES.length} Phases
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(94,234,212,.15)', color: '#5EEAD4' }}>
            {SESSIONS.length} Sessions
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(59,130,246,.15)', color: '#3B82F6' }}>
            {DECISIONS.length} ADR
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(239,68,68,.15)', color: '#EF4444' }}>
            {RISKS.length} Risques
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,.07)', color: '#94A3B8' }}>
            {DOCUMENTS.length} Documents
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap border-b border-white/10 pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? 'rgba(94,234,212,.15)' : 'transparent',
                color: activeTab === tab.id ? '#5EEAD4' : '#94A3B8',
                borderBottom: activeTab === tab.id ? '2px solid #5EEAD4' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="mb-8">{renderSection()}</div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-6 pb-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex gap-4">
              <span>Zéro nuisance</span>
              <span>·</span>
              <span>MD first · JSX second</span>
              <span>·</span>
              <span>Traçabilité totale</span>
            </div>
            <span className="font-mono">DATA_VERSION 1.2.0 · LAST_SYNC 2026-04-03</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { font-family: 'Figtree', sans-serif; }
        code, pre { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      <link rel="preload"
        href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap"
        as="style"
        onLoad={(e) => { e.target.onload = null; e.target.rel = 'stylesheet'; }} />
      <noscript>
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </noscript>
      <link rel="preload"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
        as="style"
        onLoad={(e) => { e.target.onload = null; e.target.rel = 'stylesheet'; }} />
      <noscript>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </noscript>
    </div>
  );
}
