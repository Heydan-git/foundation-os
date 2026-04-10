/**
 * knowledge-data.ts - Static data for KnowledgePage
 * Frozen project documentation, not from Supabase.
 */

interface Principle { id: string; label: string; desc: string }
interface JournalEntry { num: number; conv: string; action: string }
interface Framework { id: string; label: string; tag: string; tagColor: string; lines: string[] }
interface StackSublayer { id: string; label: string; desc: string }
export interface StackLayer {
  id: string
  label: string
  status: string
  statusColor: string
  sublayers: StackSublayer[]
  items: string[]
  action: string
  note?: string
}
export interface RoadmapItem { id: string; label: string; date: string; status: 'done' | 'active' | 'pending'; color: string; desc: string }

export const MANIFESTE = {
  visionLT: "Creer une fondation pour aider le monde — une structure perenne, financee par ses propres produits, dediee a l'impact positif. Le long terme finance le court terme. La credibilite technique precede la mission.",
  visionCT: "Un core + un OS + un workflow — construire le socle technique : un moteur (core), un systeme operationnel (OS), et un pipeline de creation (design → app). Le moteur qui rendra la fondation possible.",
  modeOperatoire: "Cooperation humain-IA, pas exploitation. Respect mutuel comme base de travail. Claude accompagne, Kevin decide.",
  principes: [
    { id: 'P1', label: 'Cooperation', desc: 'humain-IA en mode collaboratif' },
    { id: 'P2', label: 'Tracabilite', desc: 'chaque action journalisee, chaque decision documentee' },
    { id: 'P3', label: 'Evolutivite', desc: "rien n'est grave dans le marbre, tout peut etre itere" },
    { id: 'P4', label: 'Garde-fous', desc: 'doute → question avant action' },
  ] as Principle[],
}

export const JOURNAL: JournalEntry[] = [
  { num: 1,  conv: 'CONV-01', action: "Declaration d'intention : cooperation > exploitation" },
  { num: 2,  conv: 'CONV-01', action: 'Vision posee : LT = fondation mondiale, CT = core/OS/workflow' },
  { num: 3,  conv: 'CONV-01', action: 'Cadrage Phase 0 : tracabilite, historique, garde-fous, memoire adaptative' },
  { num: 4,  conv: 'CONV-01', action: 'Frameworks identifies : Claudify + BMAD analyses, strategie hybride definie' },
  { num: 5,  conv: 'CONV-01', action: 'FONDATION_v0.md cree — racine de tout' },
  { num: 6,  conv: 'CONV-03', action: 'Technique Claude : instructions live reload, memories periodiques, contexte 200K tokens' },
  { num: 7,  conv: 'CONV-02', action: 'Skills mapping : 23 skills, 8 phases pipeline, 12 fichiers MD (pour KB Projects)' },
  { num: 8,  conv: 'CONV-02', action: 'Pipeline dashboard : ios-pipeline-dashboard.jsx + conversation-control.jsx' },
  { num: 9,  conv: 'CONV-06', action: 'Monitoring dashboard : fondation-monitor.jsx + FOS-MONITORING.md' },
  { num: 10, conv: 'CONV-04', action: 'DA Void Glass : DA-PIPELINE-EXTRACT.md + DA-VOID-GLASS-CANONICAL.md' },
  { num: 11, conv: 'CONV-09', action: 'Index projet : project-index-dashboard.jsx + DA-FOS-MANIFESTE.md + DA-BOILERPLATE.md' },
  { num: 12, conv: 'CONV-05', action: 'Ideation structure : 3 layers Core/OS → Methode → Projets identifies' },
  { num: 13, conv: 'CONV-08', action: 'Frameworks setup : FONDATION_FRAMEWORKS.md — 4 couches L1→L4, 7 etapes' },
  { num: 14, conv: 'CONV-07', action: 'Centre communication : centre-communication.jsx + graphe SVG dependances' },
  { num: 15, conv: 'CONV-09', action: 'Fondation viewer : fondation_viewer.jsx — DA Pipeline, 5 onglets, CTA IA' },
  { num: 16, conv: 'CONV-10', action: 'Architecture Foundation OS : analyse exhaustive 10 artifacts → 6 artifacts fos-*' },
]

export const FRAMEWORKS: Framework[] = [
  {
    id: 'BMAD', label: 'BMAD v6', tag: 'Process', tagColor: '#A78BFA',
    lines: [
      'Framework multi-agents agile',
      '8 agents : Analyst (Mary), PM (John), UX (Sally), Architect (Winston), SM (Bob), Dev (Amelia), QA (Quinn), Quick Flow (Barry)',
      '4 phases : Analysis → Planning → Solutioning → Implementation',
      '_bmad/ directory (underscore, pas dot — BREAKING CHANGE v6, LLMs ignorent les dot-folders)',
      'project-context.md = constitution du projet (chargee automatiquement)',
      'Agent sidecars = memoire persistante par agent',
      '34+ workflows avec input/output contracts',
      '/bmad-help pour guidance a tout moment',
      'Commande stable : npx bmad-method install',
    ],
  },
  {
    id: 'CLAUDIFY', label: 'Claudify', tag: 'Execution', tagColor: '#5EEAD4',
    lines: [
      'Ressource / blog sur les workflows Claude Code',
      'CLAUDE.md = fichier racine ≤100 lignes (Boris Cherny, createur)',
      "Regle d'or : quand Claude fait une erreur → l'ajouter a CLAUDE.md",
      'Hooks settings.json : PreToolUse, PostToolUse, Stop, Notification',
      'Skills, Memory, Workflows, Commands',
      'Patterns : Research → Plan → Execute → Review → Ship',
    ],
  },
  {
    id: 'HYBRIDE', label: 'Hybride', tag: 'Recommande', tagColor: '#22C55E',
    lines: [
      'BMAD pour le process : phases, agents, gouvernance agile, docs as code',
      "Claudify pour l'execution : CLAUDE.md, hooks, skills, slash commands",
      'Tracabilite : git + versioning artifacts + MD/JSX architecture',
      'Modularite : agents reutilisables cross-projets',
    ],
  },
]

export const STACK: StackLayer[] = [
  {
    id: 'L1', label: 'L1 · Setup L1a + L1b', status: 'files_ready', statusColor: '#F59E0B',
    sublayers: [
      { id: 'L1a', label: 'Claude.ai Projects', desc: 'Contexte cross-device, Knowledge base always-on.' },
      { id: 'L1b', label: 'Cowork desktop', desc: 'Agent local qui lit/ecrit les fichiers directement.' },
    ],
    items: ['FOS-PROJECT-INSTRUCTIONS.md', 'FOS-MANIFESTE.md', 'PIPELINE.md', 'BUDGET-SCENARIOS.md', 'FOS-MONITORING.md', 'EVOLUTION-ROADMAP.md', 'SKILLS-MAP.md', 'TOOLS-STACK.md', 'CHECKLIST-LAUNCH.md', 'FOS-JOURNAL.md', 'SYNC-CHAT.md', 'FOS-SETUP-GUIDE.md'],
    action: 'Creer projet Claude.ai → coller FOS-PROJECT-INSTRUCTIONS.md → uploader ~20 MD',
  },
  {
    id: 'L2', label: 'L2 · Claude Code', status: 'configured', statusColor: '#22C55E',
    sublayers: [],
    items: ['CLAUDE.md (compact)', 'settings.json (hooks)', 'agents/', 'commands/', 'skills/'],
    action: 'Deploye dans .claude/ avec hooks Void Glass + security',
    note: 'Hooks : PreToolUse(Write/Edit) → validate-void-glass.sh + security-reminder.py',
  },
  {
    id: 'L3', label: 'L3 · BMAD v6', status: 'installed', statusColor: '#5EEAD4',
    sublayers: [],
    items: ['Analyst', 'PM', 'UX', 'Architect', 'SM', 'Dev', 'QA', 'Quick Flow', '+ sidecars'],
    action: 'Installe via npx bmad-method install — a auditer Phase 3',
    note: 'Dossier : _bmad/ (underscore, breaking change v6)',
  },
  {
    id: 'L4', label: 'L4 · MCP Plugins', status: 'connected', statusColor: '#5EEAD4',
    sublayers: [],
    items: ['Notion', 'Figma', 'Asana', 'Monday', 'ClickUp', 'Computer Use', 'Context7'],
    action: '7 MCPs connectes, voir CONTEXT.md section MCP',
  },
]

export const ROADMAP: RoadmapItem[] = [
  { id: 'v0.1', label: 'v0.1', date: '02.04.26', status: 'done', color: '#22C55E', desc: 'Manifeste · Journal · Memoire 4 couches · Garde-fous · Frameworks analyses' },
  { id: 'phase1', label: 'Phase 1', date: '05.04.26', status: 'done', color: '#22C55E', desc: 'Fondations : CLAUDE.md v2, security-guidance, gstack, index navigation' },
  { id: 'phase2', label: 'Phase 2', date: '07.04.26', status: 'active', color: '#5EEAD4', desc: 'App Hardening : 16 tests, Navbar, Auth complete, integration artifacts' },
  { id: 'phase3', label: 'Phase 3', date: 'a venir', status: 'pending', color: '#94A3B8', desc: 'OS Intelligence : session-end 4 niveaux, audit BMAD/OMC, doc index' },
  { id: 'phase4', label: 'Phase 4', date: 'a venir', status: 'pending', color: '#94A3B8', desc: 'Monitoring : pre-commit health-check, bundle size tracking' },
  { id: 'phase5', label: 'Phase 5', date: 'a venir', status: 'pending', color: '#94A3B8', desc: 'Expansion : premier nouveau module (Finance, Sante ou Trading)' },
]
