import React, { useState } from 'react';

// === CONSTANTS ===

const META = {
  title: 'Foundation OS Scale Orchestrator',
  version: 'v3.5.0',
  dataVersion: '3.5.0',
  lastSync: '2026-04-03',
  storageKey: 'fondation-scale-v3',
  pipeline: 'Option D (Hybrid)'
};

const DECISIONS = [
  { label: 'Pipeline', value: 'Option D — Hybrid', date: '2026-04-03' },
  { label: 'Task manager', value: 'Asana', date: '2026-04-03' },
  { label: 'Architecture artifacts', value: '6 fos-*', date: '2026-04-03' },
  { label: 'Multi-agent', value: 'oh-my-claudecode', date: '2026-04-03' }
];

const PHASES = [
  {
    id: 'P0', label: 'Claude fait maintenant', sub: 'pas de terminal requis',
    steps: [
      {
        id: 'e01', label: 'Créer wiki Notion Foundation OS', who: 'Claude (MCP)', tag: 'L4',
        how: 'Dire à Claude dans ce chat : "Crée le wiki Notion Foundation OS"\nClaude utilise MCP Notion pour créer page root + sous-pages ADR, Sessions, Décisions, Garde-fous, Stack, Architecture, Roadmap. Migration des 6 ADR.',
        validation: 'pages visibles dans Notion workspace.',
        unlocks: 'documentation vivante cross-device, ADR permanents.'
      },
      {
        id: 'e02', label: 'Créer projet Asana + 22 tâches', who: 'Claude (MCP)', tag: 'L4',
        how: 'Dire à Claude : "Crée le projet Asana Foundation OS Setup"\nClaude utilise MCP Asana pour créer projet + 22 tâches (e01→e22) + priorités + sections par phase.',
        validation: 'projet visible dans Asana, tâches assignées.',
        unlocks: 'suivi de l\'avancement hors chat.'
      },
      {
        id: 'e03', label: 'Générer tous les fichiers Claude Code', who: 'Claude', tag: 'L2',
        how: 'Tous les fichiers ont été créés (CONV-10). À déployer lors de e10.\nFichiers racine produits :\n  CLAUDE.md ✅ · project-context.md ✅ · FOS-TECH-ARCHITECTURE.md ✅ · FOS-ERROR-LOG.md ✅\n  FOS-MONITORING.md ✅ · FOS-JOURNAL.md ✅ · FOS-SETUP-GUIDE.md ✅ · FOS-MANIFESTE.md ✅\n  FOS-PROJECT-INSTRUCTIONS.md ✅ · FOS-SKILL-ORCHESTRATOR.md ✅ · SKILL.md ✅\nFichiers .claude/ (contenu à créer lors de e10) :\n  .claude/settings.json · agents/ (4 agents) · commands/ (4 commands)',
        validation: 'fichiers cohérents avec architecture Foundation OS.',
        unlocks: 'Claude Code prêt dès que tu déploies.'
      }
    ]
  },
  {
    id: 'P1', label: 'L1 Setup', sub: 'Claude.ai Projects + Cowork desktop · Kévin · ~1h',
    steps: [
      {
        id: 'e04', label: 'Créer projet Claude.ai "Foundation OS" (L1a)', who: 'Kévin', tag: 'L1a',
        how: '1. Aller sur claude.ai\n2. Sidebar gauche → "New Project"\n3. Nom : Foundation OS · Description : OS de travail IA-driven · Coopération Claude/Kévin\n4. Créer le projet',
        validation: 'projet visible dans la sidebar.',
        unlocks: 'contexte permanent entre sessions, Knowledge base.'
      },
      {
        id: 'e04b', label: 'Configurer Cowork desktop sur foundation-os/ (L1b)', who: 'Kévin', tag: 'L1b',
        how: '1. Ouvrir Claude Desktop App → onglet "Cowork"\n2. Cliquer "Work in a folder" → sélectionner ton dossier de travail (là où sont les FOS-*.md)\n3. SKILL.md est déjà dans ton dossier → Cowork le lit automatiquement\n4. Test : "liste les fichiers FOS-* dans ce dossier et dis-moi l\'état du projet"',
        validation: 'Cowork affiche les fichiers et répond avec le contexte Foundation OS.',
        unlocks: 'agent local qui peut lire/écrire tes MDs directement · tâches autonomes · MCP depuis desktop.'
      },
      {
        id: 'e05', label: 'Configurer Project Instructions (L1a)', who: 'Kévin', tag: 'L1a',
        how: '1. Dans le projet Foundation OS → icône Settings\n2. Section "Instructions" ou "Project Instructions"\n3. Coller le contenu de FOS-PROJECT-INSTRUCTIONS.md\n4. Sauvegarder',
        validation: 'ouvrir une conv dans le projet → Claude répond avec le bon contexte sans re-brief.',
        unlocks: 'Claude connaît Foundation OS à chaque message.'
      },
      {
        id: 'e06', label: 'Uploader ~20 MD en Knowledge base (L1a)', who: 'Kévin', tag: 'L1a',
        how: 'Dans le projet → "Knowledge" → uploader dans cet ordre de priorité :\nP1 Orchestration : FOS-SETUP-GUIDE.md · FOS-SCALE-ORCHESTRATOR-DATA.md · FOS-MONITORING.md · FOS-JOURNAL.md\nP2 Architecture : FOS-ARCHITECTURE-ANALYSIS.md · FOS-META-PLAN.md · project-context.md · FOS-TECH-ARCHITECTURE.md\nP3 Données : FOS-COMMANDER-DATA.md · FOS-KNOWLEDGE-DATA.md\nP4 Références : FOS-SKILL-ORCHESTRATOR.md · FOS-MANIFESTE.md · FOS-ERROR-LOG.md\nP5 Suppléments : DA-FONDATION.md · DA-BOILERPLATE.md · FONDATION_FRAMEWORKS.md · PIPELINE.md · SKILLS-MAP.md',
        validation: 'demander "résume FOS-ARCHITECTURE-ANALYSIS.md" → Claude répond sans upload.',
        unlocks: 'mémoire long terme complète.'
      },
      {
        id: 'e07', label: 'Valider L1a + L1b opérationnels', who: 'Kévin+Claude', tag: 'L1',
        how: '1. Ouvrir une NOUVELLE conversation dans le projet\n2. Demander : "quel est l\'état de Foundation OS ?"\n3. Claude doit répondre avec contexte complet (phases, stack, artifacts)\n4. Si incomplet → vérifier que les instructions + knowledge sont bien configurés',
        validation: 'réponse contextualisée sans avoir tout collé manuellement.',
        unlocks: 'L1 opérationnel.'
      }
    ]
  },
  {
    id: 'P2', label: 'Claude Code L2', sub: 'Kévin terminal · ~1h30',
    steps: [
      {
        id: 'e08', label: 'Installer Node.js + Claude Code CLI', who: 'Kévin', tag: 'L2',
        how: 'node --version (doit être ≥ 18 · si absent : brew install node)\nnpm install -g @anthropic-ai/claude-code\nclaude --version\nclaude login (ouvre browser, connecter compte Anthropic)',
        validation: 'claude --version affiche la version.',
        unlocks: 'base Claude Code installée.'
      },
      {
        id: 'e09', label: 'Init repo GitHub foundation-os', who: 'Kévin', tag: 'L2',
        how: 'mkdir foundation-os && cd foundation-os\ngit init\necho "# Foundation OS" > README.md\ngit add . && git commit -m "init: Foundation OS"\nbrew install gh (si absent)\ngh repo create foundation-os --private --source=. --push',
        validation: 'repo visible sur github.com.',
        unlocks: 'base git pour l\'OS.'
      },
      {
        id: 'e10', label: 'Déployer fichiers .claude/ (générés en e03)', who: 'Kévin', tag: 'L2',
        how: 'mkdir -p .claude/agents .claude/commands\n(Copier les fichiers générés en e03 dans .claude/)\nCréer dans foundation-os/ : CLAUDE.md · project-context.md · FOS-TECH-ARCHITECTURE.md · FOS-ERROR-LOG.md\ngit add . && git commit -m "chore: add Claude Code config"',
        validation: 'ls .claude/ → agents/ commands/ settings.json visibles.',
        unlocks: 'Claude Code contextualise Foundation OS.'
      },
      {
        id: 'e11', label: 'Installer oh-my-claudecode', who: 'Kévin', tag: 'L2',
        how: 'cd foundation-os && claude .\nDans Claude Code :\n/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode\n/plugin install oh-my-claudecode\n/oh-my-claudecode:omc-setup',
        validation: 'taper "autopilot: list files" → oh-my-claudecode répond.',
        unlocks: '32 agents · multi-agent parallèle · 3-5× vitesse.'
      },
      {
        id: 'e12', label: 'Valider Claude Code end-to-end', who: 'Kévin', tag: 'L2',
        how: 'Dans claude . :\n/session-start → vérifier que le workflow s\'exécute\n@doc-agent : bonjour → persona doc actif\n/bmad-help → si BMAD installé : workflows disponibles',
        validation: 'session cohérente du début à la fin.',
        unlocks: 'L2 opérationnel.'
      }
    ]
  },
  {
    id: 'P3', label: 'BMAD L3', sub: 'Kévin terminal · ~20min',
    steps: [
      {
        id: 'e13', label: 'Installer BMAD v6', who: 'Kévin', tag: 'L3',
        how: 'cd foundation-os\nnpx bmad-method install\n→ IDE : Claude Code\n→ Agents : Analyst + Architect + Dev + QA (minimum)\n→ Full install\nATTENTION : dossier = _bmad/ (underscore, PAS .bmad/)\nls _bmad/agents/ → vérifier les agents',
        validation: 'agents visibles dans _bmad/agents/.',
        unlocks: '8 agents spécialisés · PRD → Architecture → Stories → Dev.'
      },
      {
        id: 'e14', label: 'Valider BMAD avec project-context.md', who: 'Kévin+Claude', tag: 'L3',
        how: 'Dans claude . :\n@analyst : "Présente Foundation OS en te basant sur project-context.md"\nL\'agent doit répondre avec contexte Foundation OS complet\n/bmad-help → guidance disponible',
        validation: 'l\'agent Analyst connaît le projet sans re-brief.',
        unlocks: 'L3 opérationnel.'
      }
    ]
  },
  {
    id: 'P4', label: 'MCP L4 validation', sub: 'Kévin · ~15min',
    steps: [
      {
        id: 'e15', label: 'Valider Notion + Asana (créés en P0)', who: 'Kévin', tag: 'L4',
        how: 'Ouvrir Notion → vérifier que les pages Foundation OS sont bien là\nOuvrir Asana → vérifier que les 22 tâches sont présentes\nDans claude.ai : demander "liste mes tâches Asana non faites" → Claude doit répondre via MCP',
        validation: 'Claude peut lire/écrire dans Notion et Asana depuis le chat.',
        unlocks: 'L4 opérationnel.'
      },
      {
        id: 'e16', label: 'Valider workflow MCP complet', who: 'Kévin+Claude', tag: 'L4',
        how: 'Test complet : ajouter une session dans Notion via Claude\nTest complet : marquer une tâche Asana via Claude',
        validation: 'les modifications sont visibles dans les outils.',
        unlocks: 'documentation et tâches sans quitter le chat.'
      }
    ]
  },
  {
    id: 'P5', label: 'Foundation OS App — Option D', sub: 'Claude Code + Kévin · ~2h · Vite + React + TypeScript + Tailwind + Supabase + Vercel',
    steps: [
      {
        id: 'e17', label: 'Scaffold Foundation OS App', who: 'Claude Code', tag: 'APP',
        how: 'Dans claude . :\nautopilot: scaffold une app React + Vite + TypeScript + Tailwind dans foundation-os/app/\nStructure cible : src/components (Void Glass) · src/pages · src/lib (supabase.ts) · src/styles',
        validation: 'npm run dev → app tourne en local sur localhost:5173.',
        unlocks: 'base de la vraie Foundation OS App.'
      },
      {
        id: 'e18', label: 'Setup Supabase (DB + auth + API)', who: 'Kévin', tag: 'APP',
        how: '1. Aller sur supabase.com → New Project\n2. Nom : foundation-os · Region : West EU (Paris)\n3. Copier SUPABASE_URL + SUPABASE_ANON_KEY\n4. Créer foundation-os/app/.env.local :\n   VITE_SUPABASE_URL=https://xxxx.supabase.co\n   VITE_SUPABASE_ANON_KEY=xxxx\n5. Dans claude . : "crée le schéma DB Foundation OS avec Supabase"\n   Tables : sessions · decisions · risks · docs · contextBlocks · nextSteps',
        validation: 'npm run dev → connexion Supabase active. Tables dans le dashboard Supabase.',
        unlocks: 'DB réelle cross-device. Auth incluse pour plus tard. SDK JavaScript direct.'
      },
      {
        id: 'e19', label: 'Deploy Vercel (URL permanente)', who: 'Kévin', tag: 'APP',
        how: '1. Aller sur vercel.com → New Project → importer foundation-os depuis GitHub\n2. Framework preset : Vite\n3. Ajouter variables d\'environnement : VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY\n4. Deploy → URL générée (ex: foundation-os.vercel.app)\n5. Bookmark l\'URL Vercel',
        validation: 'URL accessible depuis mobile/autre PC. git push = deploy automatique.',
        unlocks: 'URL permanente · cross-device · plus de limite d\'artifacts.'
      },
      {
        id: 'e20', label: 'Build page Commander (base)', who: 'Claude Code + OMC', tag: 'APP',
        how: 'Dans claude . :\nteam "construire la page Commander avec Void Glass, connectée à Supabase via supabase-js"\noh-my-claudecode lance 3 agents en parallèle (ui, db, test)\ngit push → deploy Vercel automatique',
        validation: 'page Commander fonctionnelle sur l\'URL Vercel.',
        unlocks: 'premier module de la vraie Foundation OS App.'
      }
    ]
  },
  {
    id: 'P6', label: 'Consolidation artifacts', sub: 'Claude · ~3 sessions',
    steps: [
      {
        id: 'e21', label: 'fos-graph.jsx + FOS-GRAPH-DATA.md', who: 'Claude', tag: 'ARTIFACT',
        how: 'Dire à Claude dans ce chat : "Produis fos-graph.jsx"\nClaude construit l\'artifact (graphe SVG interactif + audit) + son MD pair\nUpload dans le projet Claude.ai',
        validation: 'artifact sous 700L · graphe SVG fonctionnel · MD pair cohérent.',
        unlocks: ''
      },
      {
        id: 'e22', label: 'fos-sync.jsx + FOS-SYNC-DATA.md', who: 'Claude', tag: 'ARTIFACT',
        how: 'Dire à Claude dans ce chat : "Produis fos-sync.jsx"\nClaude construit l\'artifact (Cowork tracker + DA + overlaps) + son MD pair',
        validation: 'artifact sous 700L · DA compliance et overlaps visibles.',
        unlocks: ''
      }
    ]
  }
];

const STACK = [
  { layer: 'L0', name: 'Void Glass DS', desc: 'tokens · composants · Figma spec', status: 'done' },
  { layer: 'L1a', name: 'Claude.ai Projects', desc: 'KB ~20 MD · FOS-PROJECT-INSTRUCTIONS.md · web/mobile cross-device', status: 'pending', phase: 'P1' },
  { layer: 'L1b', name: 'Cowork desktop', desc: 'agent local · SKILL.md auto-chargé · MCP · tâches planifiées', status: 'pending', phase: 'P1' },
  { layer: 'L2', name: 'Claude Code', desc: 'CLAUDE.md ≤100L · hooks · agents · oh-my-claudecode (team) · project-context.md · FOS-TECH-ARCHITECTURE.md · FOS-ERROR-LOG.md', status: 'pending', phase: 'P2' },
  { layer: 'L3', name: 'BMAD v6', desc: '_bmad/ (UNDERSCORE!) · 8 agents · project-context.md', status: 'pending', phase: 'P3' },
  { layer: 'L4', name: 'MCP', desc: 'Notion ✅ · Asana ✅ · Figma', status: 'partial' },
  { layer: 'L5', name: 'Foundation OS App', desc: 'Vite + React + TypeScript + Tailwind + Supabase + Vercel', status: 'pending', phase: 'P5' },
  { layer: 'L6', name: 'GitHub', desc: 'foundation-os repo (privé) · conventional commits · CI/CD', status: 'pending', phase: 'P2' }
];

const ARTIFACTS = [
  { file: 'fos-commander.jsx', lines: '571L', mdPair: 'FOS-COMMANDER-DATA.md', status: 'done' },
  { file: 'fos-knowledge.jsx', lines: '330L', mdPair: 'FOS-KNOWLEDGE-DATA.md', status: 'done' },
  { file: 'fos-scale-orchestrator.jsx', lines: '440L', mdPair: 'FOS-SCALE-ORCHESTRATOR-DATA.md', status: 'done' },
  { file: 'fos-graph.jsx', lines: '', mdPair: 'FOS-GRAPH-DATA.md (à créer)', status: 'pending', phase: 'P6-e21' },
  { file: 'fos-sync.jsx', lines: '', mdPair: 'FOS-SYNC-DATA.md (à créer)', status: 'pending', phase: 'P6-e22' },
  { file: 'fos-index.jsx', lines: '', mdPair: 'FOS-INDEX-DATA.md (à créer)', status: 'pending', phase: 'P6' },
  { file: 'fos-pipeline.jsx', lines: '', mdPair: 'FOS-PIPELINE-DATA.md (à créer)', status: 'pending', phase: 'P6' }
];

const CHANGELOG = [
  { version: 'v3.5.0', date: '2026-04-03', note: 'Stack L0-L6 notation unifiée · fos-scale-orchestrator.jsx ✅ dans ARTIFACTS · SKILL.md ajouté · e04b instructions clarifiées' },
  { version: 'v3.4.0', date: '2026-04-03', note: 'L1 split L1a+L1b · Cowork distinct de Projects · e04b ajouté · ADR-012' },
  { version: 'v3.3.0', date: '2026-04-03', note: 'OMC : team (pas team 3:executor) · ultrapilot supprimé · archives supprimées · alignment protocol' },
  { version: 'v3.2.0', date: '2026-04-03', note: 'Audit complet · 10 fichiers MD créés · e03 et e06 mis à jour · ordre upload Cowork' },
  { version: 'v3.1.0', date: '2026-04-03', note: 'Stack L5 : Vercel + Supabase (décision finale)' },
  { version: 'v3.0.0', date: '2026-04-03', note: 'Option D · oh-my-claudecode · P0 Claude maintenant · Foundation OS App · 22 steps' },
  { version: 'v2.0.0', date: '2026-04-03', note: 'Guide étapes v2' },
  { version: 'v1.0.0', date: '2026-04-03', note: 'Création initiale' }
];

const TABS = [
  { id: 'decisions', label: 'Décisions' },
  { id: 'steps', label: 'Steps' },
  { id: 'stack', label: 'Stack' },
  { id: 'artifacts', label: 'Artifacts' },
  { id: 'changelog', label: 'Changelog' }
];

// === HELPERS ===

const tagColor = (tag) => {
  const map = { L0: '#A78BFA', L1: '#5EEAD4', L1a: '#5EEAD4', L1b: '#2DD4BF', L2: '#3B82F6', L3: '#F97316', L4: '#EAB308', L5: '#22C55E', L6: '#94A3B8', APP: '#EC4899', ARTIFACT: '#8B5CF6' };
  return map[tag] || '#94A3B8';
};

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

const StatusDot = ({ status }) => {
  const color = status === 'done' ? '#22C55E' : status === 'partial' ? '#EAB308' : '#94A3B8';
  return <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />;
};

// === SECTIONS ===

const DecisionsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {DECISIONS.map((d, i) => (
      <div key={d.label} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">{d.date}</span>
            <Badge label="validé" color="#5EEAD4" />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{d.label}</p>
          <p className="text-sm font-semibold text-white font-mono">{d.value}</p>
        </Card>
      </div>
    ))}
  </div>
);

const StepsSection = () => {
  const [openPhase, setOpenPhase] = useState('P0');
  const [openStep, setOpenStep] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      {PHASES.map((phase, pi) => (
        <div key={phase.id} style={{ animation: `fadeIn 0.3s ease-out ${pi * 40}ms both` }}>
          <button
            onClick={() => setOpenPhase(openPhase === phase.id ? null : phase.id)}
            className="w-full text-left"
          >
            <Card style={{ cursor: 'pointer' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold" style={{ color: '#5EEAD4' }}>{phase.id}</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{phase.label}</span>
                    <span className="text-xs text-gray-400 ml-2">· {phase.sub}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={`${phase.steps.length} steps`} color="#A78BFA" />
                  <span className="text-gray-500 text-xs">{openPhase === phase.id ? '▲' : '▼'}</span>
                </div>
              </div>
            </Card>
          </button>

          {openPhase === phase.id && (
            <div className="ml-4 mt-2 flex flex-col gap-2">
              {phase.steps.map((step, si) => (
                <div key={step.id} style={{ animation: `fadeIn 0.2s ease-out ${si * 30}ms both` }}>
                  <button
                    onClick={() => setOpenStep(openStep === step.id ? null : step.id)}
                    className="w-full text-left"
                  >
                    <Card style={{ cursor: 'pointer' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-mono text-xs text-cyan-400 shrink-0">{step.id}</span>
                          <span className="text-sm text-white truncate">{step.label}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-2 shrink-0">
                          <Badge label={step.tag} color={tagColor(step.tag)} />
                          <Badge label={step.who} color="#94A3B8" />
                          <span className="text-gray-500 text-xs ml-1">{openStep === step.id ? '▲' : '▼'}</span>
                        </div>
                      </div>
                    </Card>
                  </button>

                  {openStep === step.id && (
                    <div className="ml-4 mt-1" style={{ animation: 'fadeIn 0.2s ease-out both' }}>
                      <Card>
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Comment faire</p>
                            <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{step.how}</pre>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Validation</p>
                            <p className="text-xs text-gray-300">{step.validation}</p>
                          </div>
                          {step.unlocks && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Débloque</p>
                              <p className="text-xs" style={{ color: '#5EEAD4' }}>{step.unlocks}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const StackSection = () => (
  <div className="flex flex-col gap-3">
    {STACK.map((s, i) => (
      <div key={s.layer} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className="font-mono text-xs font-bold shrink-0 mt-0.5"
                style={{ color: tagColor(s.layer) }}>{s.layer}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusDot status={s.status} />
                  <span className="text-sm font-semibold text-white">{s.name}</span>
                </div>
                <p className="text-xs text-gray-400 font-mono">{s.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {s.status === 'done' && <Badge label="✅ opérationnel" color="#22C55E" />}
              {s.status === 'partial' && <Badge label="✅/⏳ partiel" color="#EAB308" />}
              {s.status === 'pending' && s.phase && <Badge label={s.phase} color="#94A3B8" />}
            </div>
          </div>
        </Card>
      </div>
    ))}
  </div>
);

const ArtifactsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {ARTIFACTS.map((a, i) => (
      <div key={a.file} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <StatusDot status={a.status} />
              <span className="font-mono text-xs text-white">{a.file}</span>
            </div>
            {a.status === 'done'
              ? <Badge label={`✅ livré ${a.lines}`} color="#22C55E" />
              : <Badge label={a.phase || 'pending'} color="#94A3B8" />}
          </div>
          <p className="text-xs text-gray-500 ml-4">{a.mdPair}</p>
        </Card>
      </div>
    ))}
  </div>
);

const ChangelogSection = () => (
  <div className="flex flex-col gap-3">
    {CHANGELOG.map((c, i) => (
      <div key={c.version} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
        <Card>
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <span className="font-mono text-xs font-bold" style={{ color: '#5EEAD4' }}>{c.version}</span>
              <p className="text-xs text-gray-500 mt-0.5">{c.date}</p>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{c.note}</p>
          </div>
        </Card>
      </div>
    ))}
  </div>
);

// === MAIN COMPONENT ===

export default function FOSScaleOrchestrator() {
  const [activeTab, setActiveTab] = useState('decisions');

  const totalSteps = PHASES.reduce((acc, p) => acc + p.steps.length, 0);
  const doneArtifacts = ARTIFACTS.filter(a => a.status === 'done').length;
  const doneStack = STACK.filter(s => s.status === 'done').length;

  const renderSection = () => {
    switch (activeTab) {
      case 'decisions': return <DecisionsSection />;
      case 'steps':     return <StepsSection />;
      case 'stack':     return <StackSection />;
      case 'artifacts': return <ArtifactsSection />;
      case 'changelog': return <ChangelogSection />;
      default:          return null;
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#06070C' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Figtree' }}>
              Foundation OS Scale Orchestrator
            </h1>
            <p className="text-gray-400 text-sm">Pipeline {META.pipeline} · 22 étapes guidées · Stack L0-L6</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-cyan-400">{META.version}</span>
            <p className="text-xs text-gray-500 mt-0.5">LAST_SYNC {META.lastSync}</p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex gap-3 mt-5 flex-wrap">
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(94,234,212,.15)', color: '#5EEAD4' }}>
            {totalSteps} Steps
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
            {PHASES.length} Phases
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(59,130,246,.15)', color: '#3B82F6' }}>
            {STACK.length} Layers
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(34,197,94,.15)', color: '#22C55E' }}>
            {doneArtifacts}/{ARTIFACTS.length} Artifacts
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,.07)', color: '#94A3B8' }}>
            {doneStack} Stack opérationnel
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
