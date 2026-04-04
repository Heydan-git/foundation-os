import React, { useState } from 'react';

// === CONSTANTS ===

const META = {
  dataVersion: '1.0.0',
  lastSync: '2026-04-03',
  title: 'Foundation OS Knowledge'
};

const MANIFESTE = {
  visionLT: 'Créer une fondation pour aider le monde — une structure pérenne, financée par ses propres produits, dédiée à l\'impact positif. Le long terme finance le court terme. La crédibilité technique précède la mission.',
  visionCT: 'Un core + un OS + un workflow — construire le socle technique : un moteur (core), un système opérationnel (OS), et un pipeline de création (design → app). Le moteur qui rendra la fondation possible.',
  modeOperatoire: 'Coopération humain-IA, pas exploitation. Respect mutuel comme base de travail. Claude accompagne, Kévin décide.',
  principes: [
    { id: 'P1', label: 'Coopération', desc: 'humain-IA en mode collaboratif' },
    { id: 'P2', label: 'Traçabilité', desc: 'chaque action journalisée, chaque décision documentée' },
    { id: 'P3', label: 'Évolutivité', desc: 'rien n\'est gravé dans le marbre, tout peut être itéré' },
    { id: 'P4', label: 'Garde-fous', desc: 'doute → question avant action' }
  ]
};

const JOURNAL = [
  { num: 1,  conv: 'CONV-01', action: 'Déclaration d\'intention : coopération > exploitation' },
  { num: 2,  conv: 'CONV-01', action: 'Vision posée : LT = fondation mondiale, CT = core/OS/workflow' },
  { num: 3,  conv: 'CONV-01', action: 'Cadrage Phase 0 : traçabilité, historique, garde-fous, mémoire adaptative' },
  { num: 4,  conv: 'CONV-01', action: 'Frameworks identifiés : Claudify + BMAD analysés, stratégie hybride définie' },
  { num: 5,  conv: 'CONV-01', action: 'FONDATION_v0.md créé — racine de tout' },
  { num: 6,  conv: 'CONV-03', action: 'Technique Claude : instructions live reload, memories périodiques, contexte 200K tokens' },
  { num: 7,  conv: 'CONV-02', action: 'Skills mapping : 23 skills, 8 phases pipeline, 12 fichiers MD (pour KB Projects)' },
  { num: 8,  conv: 'CONV-02', action: 'Pipeline dashboard : ios-pipeline-dashboard.jsx + conversation-control.jsx' },
  { num: 9,  conv: 'CONV-06', action: 'Monitoring dashboard : fondation-monitor.jsx + FOS-MONITORING.md' },
  { num: 10, conv: 'CONV-04', action: 'DA Void Glass : DA-PIPELINE-EXTRACT.md + DA-VOID-GLASS-CANONICAL.md' },
  { num: 11, conv: 'CONV-09', action: 'Index projet : project-index-dashboard.jsx + DA-FOS-MANIFESTE.md + DA-BOILERPLATE.md' },
  { num: 12, conv: 'CONV-05', action: 'Idéation structure : 3 layers Core/OS → Méthode → Projets identifiés' },
  { num: 13, conv: 'CONV-08', action: 'Frameworks setup : FONDATION_FRAMEWORKS.md — 4 couches L1→L4, 7 étapes' },
  { num: 14, conv: 'CONV-07', action: 'Centre communication : centre-communication.jsx + graphe SVG dépendances' },
  { num: 15, conv: 'CONV-09', action: 'Fondation viewer : fondation_viewer.jsx — DA Pipeline, 5 onglets, CTA IA' },
  { num: 16, conv: 'CONV-10', action: 'Architecture Foundation OS : analyse exhaustive 10 artifacts → 6 artifacts fos-*' }
];

const FRAMEWORKS = [
  {
    id: 'BMAD',
    label: 'BMAD v6',
    tag: 'Process',
    tagColor: '#A78BFA',
    lines: [
      'Framework multi-agents agile',
      '8 agents : Analyst (Mary), PM (John), UX (Sally), Architect (Winston), SM (Bob), Dev (Amelia), QA (Quinn), Quick Flow (Barry)',
      '4 phases : Analysis → Planning → Solutioning → Implementation',
      '_bmad/ directory (underscore, pas dot — BREAKING CHANGE v6, LLMs ignorent les dot-folders)',
      'project-context.md = constitution du projet (chargée automatiquement)',
      'Agent sidecars = mémoire persistante par agent',
      '34+ workflows avec input/output contracts',
      '/bmad-help pour guidance à tout moment',
      'Commande stable : npx bmad-method install'
    ]
  },
  {
    id: 'CLAUDIFY',
    label: 'Claudify',
    tag: 'Exécution',
    tagColor: '#5EEAD4',
    lines: [
      'Ressource / blog sur les workflows Claude Code',
      'CLAUDE.md = fichier racine ≤100 lignes (Boris Cherny, créateur)',
      'Règle d\'or : quand Claude fait une erreur → l\'ajouter à CLAUDE.md',
      'Hooks settings.json : PreToolUse, PostToolUse, Stop, Notification',
      'Skills, Memory, Workflows, Commands',
      'Patterns : Research → Plan → Execute → Review → Ship'
    ]
  },
  {
    id: 'HYBRIDE',
    label: 'Hybride',
    tag: 'Recommandé',
    tagColor: '#22C55E',
    lines: [
      'BMAD pour le process : phases, agents, gouvernance agile, docs as code',
      'Claudify pour l\'exécution : CLAUDE.md, hooks, skills, slash commands',
      'Traçabilité : git + versioning artifacts + MD/JSX architecture',
      'Modularité : agents réutilisables cross-projets'
    ]
  }
];

const STACK = [
  {
    id: 'L1',
    label: 'L1 · Setup L1a + L1b',
    status: 'files_ready',
    statusColor: '#F59E0B',
    sublayers: [
      { id: 'L1a', label: 'Claude.ai Projects', desc: 'Contexte cross-device, Knowledge base always-on.' },
      { id: 'L1b', label: 'Cowork desktop', desc: 'Agent local qui lit/écrit les fichiers directement.' }
    ],
    items: [
      'FOS-PROJECT-INSTRUCTIONS.md', 'FOS-MANIFESTE.md', 'PIPELINE.md', 'BUDGET-SCENARIOS.md',
      'FOS-MONITORING.md', 'EVOLUTION-ROADMAP.md', 'SKILLS-MAP.md', 'TOOLS-STACK.md',
      'CHECKLIST-LAUNCH.md', 'FOS-JOURNAL.md', 'SYNC-CHAT.md', 'FOS-SETUP-GUIDE.md'
    ],
    action: 'Créer projet Claude.ai → coller FOS-PROJECT-INSTRUCTIONS.md → uploader ~20 MD'
  },
  {
    id: 'L2',
    label: 'L2 · Claude Code',
    status: 'not_configured',
    statusColor: '#EF4444',
    sublayers: [],
    items: ['CLAUDE.md (≤100L)', 'settings.json (hooks)', 'agents/', 'commands/', 'skills/'],
    action: 'Claude prépare les fichiers → déployer dans .claude/',
    note: 'Hooks : PreToolUse(Bash)→.env guard · PostToolUse(Write)→MD-first · Stop→session summary'
  },
  {
    id: 'L3',
    label: 'L3 · BMAD v6',
    status: 'not_installed',
    statusColor: '#EF4444',
    sublayers: [],
    items: ['Analyst', 'PM', 'UX', 'Architect', 'SM', 'Dev', 'QA', 'Quick Flow', '+ sidecars'],
    action: 'npx bmad-method install (terminal + Node.js requis)',
    note: 'Dossier : _bmad/ (underscore, PAS dot — breaking change v6)'
  },
  {
    id: 'L4',
    label: 'L4 · MCP Plugins',
    status: '8 connectés, 0 actifs',
    statusColor: '#F59E0B',
    sublayers: [],
    items: [
      'Notion (high) — wiki ADR + sessions + décisions',
      'Figma (high) — Design System Void Glass formalisé',
      'Asana OU Monday (medium) — tasks + sprints',
      'Slack (medium) — notifications',
      'ClickUp/Gmail/GCal (low) — usage optionnel'
    ],
    action: 'Choisir 1 seul outil task management (Asana OU Monday)'
  }
];

const ROADMAP = [
  { id: 'v0.1', label: 'v0.1', date: 'officiel · 02.04.26', status: 'done', color: '#22C55E',
    desc: 'Manifeste · Journal · Mémoire 4 couches · Garde-fous · Frameworks analysés' },
  { id: 'tools', label: 'Outillage', date: 'non versionné', status: 'done', color: '#22C55E',
    desc: '6→10 dashboards JSX · ~20+ fichiers MD · DA Void Glass · 3 layers identifiés' },
  { id: 'current', label: 'En cours', date: 'Foundation OS setup', status: 'active', color: '#5EEAD4',
    desc: 'L1a Claude.ai Projects · L1b Cowork Desktop · L2 Claude Code · L3 BMAD · L4 MCP' },
  { id: 'v0.2', label: 'v0.2', date: 'prochain bump officiel', status: 'pending', color: '#94A3B8',
    desc: 'Foundation OS opérationnel · Projects + Cowork déployés · BMAD actif · Premier projet dans l\'OS' },
  { id: 'v1.0', label: 'v1.0', date: 'premier produit', status: 'pending', color: '#94A3B8',
    desc: 'Pipeline complet exécuté · Produit livré · Métriques en place' },
  { id: 'v2.0', label: 'v2.0', date: 'fondation active', status: 'pending', color: '#94A3B8',
    desc: 'Revenus générés · Méthode reproductible · Impact mesuré' }
];

const TABS = [
  { id: 'manifeste', label: 'Manifeste' },
  { id: 'journal', label: 'Journal' },
  { id: 'frameworks', label: 'Frameworks' },
  { id: 'stack', label: 'Stack' },
  { id: 'roadmap', label: 'Roadmap' }
];

// === HELPERS ===

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

const ManifesteSection = () => (
  <div className="flex flex-col gap-4">
    <div style={{ animation: 'fadeIn 0.3s ease-out 0ms both' }}>
      <Card>
        <h3 className="text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">Vision long terme</h3>
        <p className="text-sm text-gray-200 leading-relaxed">{MANIFESTE.visionLT}</p>
      </Card>
    </div>
    <div style={{ animation: 'fadeIn 0.3s ease-out 40ms both' }}>
      <Card>
        <h3 className="text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">Vision court terme</h3>
        <p className="text-sm text-gray-200 leading-relaxed">{MANIFESTE.visionCT}</p>
      </Card>
    </div>
    <div style={{ animation: 'fadeIn 0.3s ease-out 80ms both' }}>
      <Card>
        <h3 className="text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">Mode opératoire</h3>
        <p className="text-sm text-gray-200 leading-relaxed">{MANIFESTE.modeOperatoire}</p>
      </Card>
    </div>
    <div style={{ animation: 'fadeIn 0.3s ease-out 120ms both' }}>
      <Card>
        <h3 className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">Principes fondateurs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MANIFESTE.principes.map((p) => (
            <div key={p.id} className="flex items-start gap-3">
              <span className="font-mono text-xs text-cyan-400 mt-0.5 shrink-0">{p.id}</span>
              <div>
                <span className="text-sm font-semibold text-white">{p.label}</span>
                <span className="text-sm text-gray-400"> — {p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const JournalSection = () => (
  <div className="flex flex-col gap-3">
    {JOURNAL.map((entry, i) => (
      <div key={entry.num} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-gray-500 w-5 shrink-0 pt-0.5">{entry.num}.</span>
            <span className="font-mono text-xs text-cyan-400 shrink-0 pt-0.5">{entry.conv}</span>
            <p className="text-sm text-gray-200">{entry.action}</p>
          </div>
        </Card>
      </div>
    ))}
  </div>
);

const FrameworksSection = () => (
  <div className="flex flex-col gap-4">
    {FRAMEWORKS.map((fw, i) => (
      <div key={fw.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-semibold text-white">{fw.label}</h3>
            <Badge label={fw.tag} color={fw.tagColor} />
          </div>
          <div className="flex flex-col gap-1.5">
            {fw.lines.map((line, j) => (
              <p key={j} className="font-mono text-xs text-gray-300 leading-relaxed">— {line}</p>
            ))}
          </div>
        </Card>
      </div>
    ))}
  </div>
);

const StackSection = () => (
  <div className="flex flex-col gap-4">
    {STACK.map((layer, i) => (
      <div key={layer.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">{layer.label}</h3>
            <Badge label={layer.status} color={layer.statusColor} />
          </div>
          {layer.sublayers.length > 0 && (
            <div className="flex gap-3 mb-3 flex-wrap">
              {layer.sublayers.map((sl) => (
                <div key={sl.id} className="flex-1 min-w-40 p-3 rounded-md"
                  style={{ backgroundColor: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <span className="font-mono text-xs text-cyan-400">{sl.id}</span>
                  <p className="text-xs font-medium text-white mt-0.5">{sl.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sl.desc}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {layer.items.map((item, j) => (
              <span key={j} className="font-mono text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: 'rgba(94,234,212,.08)', color: '#94A3B8' }}>
                {item}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            <span className="text-gray-500">Action · </span>{layer.action}
          </p>
          {layer.note && (
            <p className="text-xs text-gray-500 mt-1">{layer.note}</p>
          )}
        </Card>
      </div>
    ))}
  </div>
);

const RoadmapSection = () => (
  <div className="flex flex-col gap-3">
    {ROADMAP.map((item, i) => (
      <div key={item.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
              <div className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color, boxShadow: item.status === 'active' ? `0 0 8px ${item.color}80` : 'none' }} />
              {i < ROADMAP.length - 1 && (
                <div className="w-px flex-1 min-h-4" style={{ backgroundColor: 'rgba(255,255,255,.1)' }} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-semibold" style={{ color: item.color }}>{item.label}</span>
                <span className="text-xs text-gray-500">{item.date}</span>
                {item.status === 'active' && <Badge label="en cours" color="#5EEAD4" />}
                {item.status === 'done' && <Badge label="livré" color="#22C55E" />}
              </div>
              <p className="text-sm text-gray-300">{item.desc}</p>
            </div>
          </div>
        </Card>
      </div>
    ))}
  </div>
);

// === MAIN COMPONENT ===

export default function FOSKnowledge() {
  const [activeTab, setActiveTab] = useState('manifeste');

  const renderSection = () => {
    switch (activeTab) {
      case 'manifeste':  return <ManifesteSection />;
      case 'journal':    return <JournalSection />;
      case 'frameworks': return <FrameworksSection />;
      case 'stack':      return <StackSection />;
      case 'roadmap':    return <RoadmapSection />;
      default:           return null;
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#06070C' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Figtree' }}>
              Foundation OS Knowledge
            </h1>
            <p className="text-gray-400 text-sm">Manifeste · Journal · Frameworks · Stack · Roadmap</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-cyan-400">v{META.dataVersion}</span>
            <p className="text-xs text-gray-500 mt-0.5">LAST_SYNC {META.lastSync}</p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex gap-3 mt-5 flex-wrap">
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(94,234,212,.15)', color: '#5EEAD4' }}>
            {MANIFESTE.principes.length} Principes
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
            {JOURNAL.length} Actions journal
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(59,130,246,.15)', color: '#3B82F6' }}>
            {FRAMEWORKS.length} Frameworks
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(249,115,22,.15)', color: '#F97316' }}>
            {STACK.length} Layers stack
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,.07)', color: '#94A3B8' }}>
            {ROADMAP.length} Milestones
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
              <span>MD first · JSX second</span>
              <span>·</span>
              <span>Coopération humain-IA</span>
              <span>·</span>
              <span>Traçabilité totale</span>
            </div>
            <span className="font-mono">DATA_VERSION {META.dataVersion} · LAST_SYNC {META.lastSync}</span>
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
