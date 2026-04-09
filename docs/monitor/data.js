/**
 * Foundation OS — Monitor Dashboard data source of truth.
 *
 * Hand-editable. Mise a jour a chaque /session-end via etape 6.5.
 * Schema version 0.1.0 — voir docs/specs/2026-04-08-monitor-dashboard-design.md § 4.
 *
 * Regles d'edition (D-MON-03) :
 *  - Append-only sur les tableaux (ajouts a la fin)
 *  - IDs stables : jamais renommer un id existant
 *  - meta.updatedAt + meta.updatedInSession MUST etre bump a chaque edit
 *  - recentSessions : max 5 entrees, prepend + pop la plus ancienne
 */
window.MONITOR_DATA = {
  meta: {
    version: '0.1.0',
    updatedAt: '2026-04-09',
    updatedInSession: 'Reforme communication — format brief v9 + regle questions groupees + CLAUDE.md',
    nextAction:
      'Cycle 3 — S7.5 integration S7 agents dans CONTEXT.md + reprise S8 Commands deep (D-S7-01 audit lineaire). OU housekeeping groupe : F-MON-01 + F-DS3-01 vite@8 + DS-5 CI + DS-6 complet.'
  },

  plans: [
    {
      id: 'ds-bootstrap',
      title: 'Design System bootstrap',
      status: 'WIP',
      priority: 'P0',
      path: 'docs/travaux-cowork/2026-04-08-design-system-bootstrap/02-plan.md',
      progress: { done: 5, total: 6, unit: 'sessions' },
      currentPhase: 'DS-6 partial livre (tokens.css consumption) — DS-5 CI reporte housekeeping',
      startedAt: '2026-04-08',
      sessions: [
        { id: 'DS-0', title: 'Cadrage spec + plan + 10 questions', status: 'DONE', date: '2026-04-08' },
        { id: 'DS-1', title: 'Scaffold + tokens DTCG 2-tier', status: 'DONE', date: '2026-04-09' },
        { id: 'DS-2', title: 'Storybook 8 + preview Void Glass + Welcome', status: 'DONE', date: '2026-04-09' },
        { id: 'DS-3', title: 'Primitives P1 Button + Text + Icon', status: 'DONE', date: '2026-04-09' },
        { id: 'DS-4', title: 'Primitives P2 Input + Card', status: 'DONE', date: '2026-04-09' },
        { id: 'DS-5', title: 'CI Playwright visual + axe gate', status: 'PENDING' },
        { id: 'DS-6', title: 'DTCG export + app consume (partial)', status: 'WIP', date: '2026-04-09' }
      ],
      notes:
        '5 primitives exportees (100/100 tests, 0 axe violations). modules/app importe tokens.css via prebuild chain. Reste DS-5 CI + DS-6 export-dtcg.'
    },
    {
      id: 'monitor-dashboard',
      title: 'Monitor Dashboard v1',
      status: 'DONE',
      priority: 'P1',
      path: 'docs/plans/2026-04-08-monitor-dashboard-plan.md',
      progress: { done: 3, total: 3, unit: 'sessions' },
      currentPhase: 'v1 complete — index + style + data + render + README livres, /session-end step 5.5 integre',
      startedAt: '2026-04-08',
      sessions: [
        { id: 'D1', title: 'Spec + plan + pause cycle3', status: 'DONE', date: '2026-04-08' },
        { id: 'D2', title: 'Skeleton HTML/CSS/JS + data.js init', status: 'DONE', date: '2026-04-09' },
        { id: 'D3', title: 'README + /session-end step 5.5 + close', status: 'DONE', date: '2026-04-09' }
      ],
      notes:
        'v1 Kevin : meta-OS tool standalone HTML, zero build, consomme modules/design-system/tokens/build/tokens.css via chemin relatif. D-MON-01..05. Pattern D1/D2/D3 anti-compactage valide.'
    },
    {
      id: 'cycle3-audit',
      title: 'Cycle 3 — Audit massif',
      status: 'PAUSED',
      priority: 'P2',
      path: 'docs/plans/2026-04-07-cycle3-implementation.md',
      progress: { done: 8, total: 24, unit: 'sessions' },
      currentPhase: 'S7 DONE non-integre CONTEXT.md, S8-S23 en pause priorite DS + dashboard',
      startedAt: '2026-04-07',
      sessions: [
        { id: 'S0', title: 'Pre-flight', status: 'DONE', date: '2026-04-07' },
        { id: 'S1', title: 'Carto repo', status: 'DONE', date: '2026-04-07' },
        { id: 'S2', title: 'Inventaire components', status: 'DONE', date: '2026-04-07' },
        { id: 'S3', title: 'Fondations Core OS', status: 'DONE', date: '2026-04-08' },
        { id: 'S4', title: 'Architecture orga', status: 'DONE', date: '2026-04-08' },
        { id: 'S5', title: 'Workflows + routing', status: 'DONE', date: '2026-04-08' },
        { id: 'S6', title: 'Orchestration + automation', status: 'DONE', date: '2026-04-08' },
        { id: 'S6.5', title: 'Integration Cowork parallel', status: 'DONE', date: '2026-04-08' },
        { id: 'S7', title: 'Agents deep (non-integre CONTEXT.md)', status: 'DONE', date: '2026-04-08' },
        { id: 'S7.5', title: 'Integration S7 agents dans CONTEXT.md', status: 'PENDING' },
        { id: 'S8', title: 'Commands (4) deep', status: 'PAUSED' },
        { id: 'S9-S23', title: 'Sessions restantes (15)', status: 'PAUSED' }
      ],
      notes: 'Decision D-S7-01 : audit lineaire S7-S23 puis fixes en bloc. Pause pour DS + dashboard.'
    },
    {
      id: 'phase1-fondations',
      title: 'Phase 1 — Fondations',
      status: 'DONE',
      priority: 'P3',
      path: 'docs/plans/2026-04-05-phase1-fondations.md',
      progress: { done: 1, total: 1, unit: 'session' },
      currentPhase: 'CLAUDE.md v2 + security + gstack + index nav',
      startedAt: '2026-04-05',
      sessions: [{ id: 'P1', title: 'Fondations', status: 'DONE', date: '2026-04-05' }],
      notes: ''
    },
    {
      id: 'phase2-hardening',
      title: 'Phase 2 — App Hardening',
      status: 'DONE',
      priority: 'P3',
      path: 'CONTEXT.md (archive)',
      progress: { done: 3, total: 3, unit: 'sous-phases' },
      currentPhase: '16 tests + Navbar + Auth + KnowledgePage + artifacts archives',
      startedAt: '2026-04-07',
      sessions: [
        { id: 'P2.1', title: 'Tests (16 new, 19 total)', status: 'DONE', date: '2026-04-07' },
        { id: 'P2.2', title: 'Navbar + LoginPage', status: 'DONE', date: '2026-04-07' },
        { id: 'P2.3', title: 'KnowledgePage + artifacts', status: 'DONE', date: '2026-04-07' }
      ],
      notes: 'App production-ready, deployed Vercel.'
    },
    {
      id: 'finition-os',
      title: 'Finition OS',
      status: 'DONE',
      priority: 'P3',
      path: 'docs/plans/2026-04-07-finition-os.md',
      progress: { done: 3, total: 3, unit: 'sessions' },
      currentPhase: 'sync-check + ref-checker + decisions-log',
      startedAt: '2026-04-07',
      sessions: [
        { id: 'F1', title: 'sync-check 6/6', status: 'DONE', date: '2026-04-07' },
        { id: 'F2', title: 'ref-checker.sh', status: 'DONE', date: '2026-04-07' },
        { id: 'F3', title: 'polish + decisions-log', status: 'DONE', date: '2026-04-07' }
      ],
      notes: ''
    }
  ],

  modules: [
    {
      id: 'app',
      name: 'App Builder',
      status: 'DONE',
      detail:
        '8 routes, Navbar 4 items, Vitest 19/19, build 893ms, JS 457kB / CSS 22kB (tokens.css inlined DS-6).'
    },
    {
      id: 'design-system',
      name: 'Design System',
      status: 'WIP',
      detail:
        '5 primitives exportees (Button/Text/Icon/Input/Card), tokens DTCG 2-tier, Storybook 8, 100/100 tests, 0 axe violations.'
    },
    {
      id: 'core-os',
      name: 'Core OS (Cortex/Memory/Monitor/Tools)',
      status: 'DONE',
      detail: '4/4 piliers actifs. Specs docs/core/.'
    },
    {
      id: 'cowork',
      name: 'Cowork Co-work',
      status: 'WIP',
      detail: 'Actif mais non-branche a /session-start /session-end. Session-lock.sh livre.'
    },
    {
      id: 'plan-router',
      name: 'Plan-Router',
      status: 'PARKING',
      detail: 'PROPOSITION 5 profils, 6 questions ouvertes Q1-Q6 bloquent.'
    },
    {
      id: 'finance',
      name: 'Finance',
      status: 'PENDING',
      detail: 'Prevu Phase 5, pas encore cree.'
    },
    {
      id: 'sante',
      name: 'Sante',
      status: 'PENDING',
      detail: 'Prevu Phase 5, pas encore cree.'
    }
  ],

  initiatives: [
    {
      id: 'ds-bootstrap-init',
      title: 'Design System bootstrap (DS-1..DS-6)',
      status: 'WIP',
      path: 'docs/travaux-cowork/2026-04-08-design-system-bootstrap/',
      blockedBy: null,
      detail: 'DS-1..DS-4 DONE, DS-6 partial, reste DS-5 CI + export-dtcg.mjs'
    },
    {
      id: 'monitor-dashboard-init',
      title: 'Monitor Dashboard v1',
      status: 'WIP',
      path: 'docs/specs/2026-04-08-monitor-dashboard-design.md',
      blockedBy: null,
      detail: 'D2 en cours, D3 integration /session-end step 6.5 + README'
    },
    {
      id: 'cowork-sprint1',
      title: 'Cowork Sprint 1 (skill orchestrator v3 + anti-collision branchage)',
      status: 'PARKING',
      path: 'docs/travaux-cowork/2026-04-08-collaboration-ia/02-plan-action.md',
      blockedBy: 'D-S7-01 (post-audit cycle3)',
      detail: 'Skill orchestrator v3 + brancher session-lock.sh + fix validate-void-glass.sh'
    },
    {
      id: 'plan-router-init',
      title: 'Plan-Router PROPOSITION',
      status: 'PARKING',
      path: 'docs/travaux-cowork/2026-04-08-plan-router/',
      blockedBy: '6 questions ouvertes Q1-Q6 + D-S7-01',
      detail: '5 profils SCAN/CODE/ARCHITECT/AUDIT/DOC pour annoter phases de plan'
    }
  ],

  decisions: [
    {
      id: 'D-DS-20',
      date: '2026-04-09',
      title: 'Prebuild workspace chain pour tokens.css',
      summary:
        'modules/app prebuild/predev/pretest invoquent build --workspace=design-system. Garantit tokens/build/ present sans committer (reste gitignored).'
    },
    {
      id: 'D-DS-21',
      date: '2026-04-09',
      title: 'Workspace dep version "*"',
      summary:
        '@foundation-os/design-system: "*" dans modules/app/dependencies. npm workspaces auto-link via symlink, simplifie vs file: ou pinned.'
    },
    {
      id: 'D-DS-12..19',
      date: '2026-04-09',
      title: 'Primitives API Button/Text/Icon/Input/Card',
      summary:
        'Button (4 variants × 3 sizes × 6 states), Text (7 variants + as prop), Icon (lucide tree-shake 21 curees), Input (7 types + label/helper/error/success), Card (3 variants + slots + interactive keyboard). Token accent.danger ajoute.'
    },
    {
      id: 'D-DS-01..11',
      date: '2026-04-08/09',
      title: 'Design System bootstrap (cadre + stack + tokens + workspace)',
      summary:
        'Pause Dashboard, nouveau module modules/design-system/ workspace, Storybook 8+Playwright+axe zero SaaS, scope complet. Q-DS-01..10 A/A/A/B/A. Tokens 2-tier primitives + semantic via aliases DTCG.'
    },
    {
      id: 'D-S7-01',
      date: '2026-04-08',
      title: 'Foundation OS = outil produit',
      summary:
        'Audit lineaire S7-S23 puis fixes en bloc apres cloture (pas d interleave). Cowork Sprint 1 + Plan-Router en parking jusqu a fin audit. Phase 5 Finance/Sante objectif final.'
    },
    {
      id: 'D-MON-01..05',
      date: '2026-04-08',
      title: 'Dashboard monitor v1',
      summary:
        'Standalone HTML docs/monitor/ pas React, scope large plans+modules+initiatives+decisions+sessions, update manuel v1, extraction tokens.css partagee (vehicule pour enrichir DS), decoupage 3 sessions D1/D2/D3.'
    }
  ],

  recentSessions: [
    {
      date: '2026-04-09',
      tag: 'DONE',
      title: 'Reforme communication — format brief v9 + questions groupees + CLAUDE.md',
      summary:
        'Session meta-workflow zero code modules. 2 axes : (1) frontload questions en debut de plan (toutes les questions d un coup puis execution sans interruption sauf imprevus), (2) briefs pedagogiques hierarchises 2 niveaux (clair par defaut + technique sur demande). 9 iterations du format brief negociees avec Kevin avant validation finale v9 = 11 sections (Etat global, Mission/Focus/Derniere session, Modules/Acces rapides/Git, Alertes/Rappels/Questions en attente, Dernier commit, Termine, En cours, En pause, Reflexions/Parking, Decisions cles/Echeance, Prochaine action/Input) + regles rendu (emojis couleur 🟢🟡🔴🔵⚪⚫🔮, barres ████░░░░ 12 max, separateurs 32 chars, lignes courtes, vulgarisation glose 3-4 mots). 3 fichiers memoire crees : feedback_frontload_questions + feedback_communication_pedagogique + feedback_brief_format. CLAUDE.md +10L nouvelle section Briefs session (format obligatoire). Zero regression health (DEGRADED baseline 75 refs), build modules/app 757ms, 19/19 tests verts. Piste A/B toujours pending (Kevin a reporte le choix pour finir la reforme com).'
    },
    {
      date: '2026-04-09',
      tag: 'DONE',
      title: 'D3 — Monitor dashboard close (README + session-end step 5.5)',
      summary:
        'README.md cree (schema + how-to-open + update rules), step 5.5 insere dans /session-end, data.js refresh real D3 update, CONTEXT.md monitor DONE. Pattern D1/D2/D3 anti-compactage valide.'
    },
    {
      date: '2026-04-09',
      tag: 'DONE_WITH_CONCERNS',
      title: 'Socle DS acheve (DS-2/3/4/6 partial) + Monitor D2 livre',
      summary:
        '7 commits : reorg travaux-cowork, F-DS1-01 alpha fix, DS-2 Storybook, DS-3 primitives P1, DS-4 primitives P2, DS-6 partial (app consume tokens.css), D2 dashboard skeleton (ecb222b). 100/100 tests DS + 19/19 app, 0 axe violations.'
    },
    {
      date: '2026-04-09',
      tag: 'DONE_WITH_CONCERNS',
      title: 'DS-1 scaffold modules/design-system + tokens DTCG 2-tier',
      summary:
        'Commit 3b5c96c. Refactor mid-session vers vrai 2-tier (66 primitives + 69 semantic). WCAG AA 8/8 verts. Bloc decouvert : package.json racine manquant, amendement CLAUDE.md L36.'
    },
    {
      date: '2026-04-08',
      tag: 'IN_PROGRESS',
      title: 'DS-0 Bootstrap cadrage (spec + plan + 10 questions)',
      summary:
        'Brainstorm DS Chromatic-like zero SaaS, 4 decisions D-DS-01..04 validees, web search best practices Storybook 8 + DTCG + monorepo, 3 livrables docs/travaux-cowork/2026-04-08-design-system-bootstrap/.'
    }
  ]
}
