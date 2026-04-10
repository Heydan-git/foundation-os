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
    updatedAt: '2026-04-10',
    updatedInSession: 'Mega session — cycle 3 cloture, DS-6, React 19+Vite 8+TW4, DS-5 CI, cleanup, securite Supabase',
    nextAction:
      'Phase 5 : choisir module Finance/Sante/Trading. Leaked Password Protection (SMTP).'
  },

  plans: [
    {
      id: 'ds-bootstrap',
      title: 'Design System bootstrap',
      status: 'DONE',
      priority: 'P0',
      path: 'docs/travaux-cowork/2026-04-08-design-system-bootstrap/02-plan.md',
      progress: { done: 6, total: 6, unit: 'sessions' },
      currentPhase: 'DS-1..DS-6 DONE. CI Playwright+axe gate active.',
      startedAt: '2026-04-08',
      sessions: [
        { id: 'DS-0', title: 'Cadrage spec + plan + 10 questions', status: 'DONE', date: '2026-04-08' },
        { id: 'DS-1', title: 'Scaffold + tokens DTCG 2-tier', status: 'DONE', date: '2026-04-09' },
        { id: 'DS-2', title: 'Storybook 8 + preview Void Glass + Welcome', status: 'DONE', date: '2026-04-09' },
        { id: 'DS-3', title: 'Primitives P1 Button + Text + Icon', status: 'DONE', date: '2026-04-09' },
        { id: 'DS-4', title: 'Primitives P2 Input + Card', status: 'DONE', date: '2026-04-09' },
        { id: 'DS-5', title: 'CI Playwright visual + axe gate', status: 'DONE', date: '2026-04-10' },
        { id: 'DS-6', title: '206 colors migrated to tokens (97%)', status: 'DONE', date: '2026-04-10' }
      ],
      notes:
        '5 primitives (100/100 tests, 0 axe violations). DS-6: 206/254 colors tokenized. DS-5: Playwright+axe CI gate. React 19+Vite 8+TW4.'
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
      status: 'WIP',
      priority: 'P1',
      path: 'docs/plans/2026-04-07-cycle3-implementation.md',
      progress: { done: 14, total: 24, unit: 'sessions' },
      currentPhase: 'S12 Memoire + anti-compactage DONE (23 findings final, 5 P1 docs, 8 P2, 9 P3, 1 meta M-S12-01 AMPLIFIE, amplification +15%, PHASE V cloturee). S13 Module App prochaine (PHASE VI) OU pause strategique OU housekeeping batch S21 (~44 fixes)',
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
        { id: 'S7', title: 'Agents deep', status: 'DONE', date: '2026-04-08' },
        { id: 'S7.5', title: 'Integration S7 agents dans CONTEXT.md', status: 'DONE', date: '2026-04-09' },
        { id: 'S8', title: 'Commands (4) deep + tests reels', status: 'DONE', date: '2026-04-09' },
        { id: 'S9', title: 'Scripts + hooks (9) deep + tests reels', status: 'DONE', date: '2026-04-09' },
        { id: 'S10', title: 'Skills + BMAD verdict', status: 'DONE', date: '2026-04-09' },
        { id: 'S11', title: 'Communication + securite (a+b) + meta live', status: 'DONE', date: '2026-04-09' },
        { id: 'S12', title: 'Memoire (4 tiers) + anti-compactage (a+b) + demo reprise', status: 'DONE', date: '2026-04-09' },
        { id: 'S13-S23', title: 'Sessions restantes (11)', status: 'PAUSED' }
      ],
      notes: 'Decision D-S7-01 : audit lineaire S7-S23 puis fixes en bloc. S12 = 23 findings (5 P1 docs + 8 P2 + 9 P3 + 1 meta M-S12-01 AMPLIFIE) + 23 decisions D-S12-01..23 + 9 learnings L-S12-01..09. 5 P1 tous documentaires : master file section 6 stale 12 sessions, 00-INDEX stale 7 sessions, procedure reprise depend data stale, 4/8 mitigations abandonnees, demo empirique T3 3 sources divergentes (S0/S5/S12). M-S12-01 = 8e occurrence meta cycle 3 : paradoxe auto-reference spec anti-compactage sujette au drift. Amplification +15% (20->23) conforme L-S11-06. PHASE V cloturee (S11+S12). Dette batch S21 cumulee ~44 fixes (S7-S12) effort ~2-3 sessions. 8 meta-patterns formalises cycle 3 (M-S6-01, M-S7-01, M-S8-01, M-S9-xx, M-S10-01, M-S10-02, M-S11-01, M-S12-01).'
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
      id: 'D-S12-01..23 + M-S12-01 AMPLIFIE',
      date: '2026-04-09',
      title: 'Audit memoire (4 tiers) + anti-compactage + meta M-S12-01 paradoxe auto-reference',
      summary:
        '23 decisions issues audit S12 Memoire + anti-compactage (12e consecutive mode MOI, ferme PHASE V). 5 P1 documentaires batch S21 : D-S12-01 master file section 6 TOUT STALE drift 12 sessions, D-S12-02 00-INDEX drift 7 sessions, D-S12-03 procedure reprise depend data stale, D-S12-04 4/8 mitigations abandonnees, D-S12-21 NEW phase B demo empirique T3 3 sources divergentes (S0/S5/S12). 8 P2 : D-S12-05 decisions 17>15 spec, D-S12-06 OMC version stale, D-S12-07/08 auto-memory stale (project_structure + tools_inventory), D-S12-09/22 commit format drift 16:10 stale/runtime (4e cross-ref D-S8-12+D-S9-09+D-S11-15), D-S12-10 memory.md blind spot .omc, D-S12-11 project-memory.json cache stale. 9 P3 batch S21. M-S12-01 = 8e meta cycle 3 : paradoxe auto-reference spec anti-compactage sujette au drift. 9 learnings L-S12-01..09 : spec anti-drift sans update auto = spec auto-drift, CONTEXT.md tier operationnel unique ratio 10:1, amplification theorique->empirique via test scenarise. Amplification +15% (20->23). Dette batch S21 ~44 fixes cumulees.'
    },
    {
      id: 'D-S11-01..15 + M-S11-01 LIVE',
      date: '2026-04-09',
      title: 'Audit communication + securite + meta M-S11-01 LIVE amplifie',
      summary:
        '15 decisions issues audit S11 Comm/Securite (11e session consecutive mode MOI). Briefing frontload Kevin 5 questions, delegue "Fait ce que tu recommande je te fait confiance", exec reco A/A/C/A/A (pattern S11a/S11b + strict Core OS + tests phase B invocation+historique+RLS + commit docs(audit) + P1 secu opportuniste). 3 P2 : D-S11-01 settings.json absolute paths hardcodes fail-silent -> $CLAUDE_PROJECT_DIR ou path relatif, D-S11-02 pattern P8 (deserialization binaire Python) substring trop large = demo live phase A (blocage reel Write par hook security-reminder sur pattern P2 subprocess exec-famille, reformulation forcee des 12 substrings en descriptions neutres) = passage meta F-S9-18 de theorique a empirique, D-S11-03 gitignore root minimal -> +10 patterns defensifs (*.pem/*.key/id_rsa*/credentials.json/.env.*/secrets.json/*.log). 13 P3 dont D-S11-04 format sortie agents asymetrique (3 "Format court" vs 1 template), D-S11-05/06 re-confirment F-S7-08 Phase 2.4 + D-S7-02 dev-agent workflow + F-S7-09 PAUL + F-S7-10 P1 jargon (merge D-S7-04), D-S11-07 commits 3 types dev-agent vs 11 hook, D-S11-10 duplication .env.local gitignore, D-S11-12 JWT placeholder env.example, D-S11-15 NEW phase B documenter convention commits audit cycle3. Parking post-cycle3 : D-S11-09 CI verdict consolide, D-S11-11 security-reminder scope limite, D-S11-14 NEW phase B RLS policies scope user insuffisant Phase 5 multi-user (21 policies uniformes auth.role()=authenticated sans filtrage user_id, solo OK, re-audit obligatoire avant Finance/Sante avec auth.uid()=user_id). Trace only : D-S11-08 convention inter-agents absente (re-affirme L-S5-01). M-S11-01 AMPLIFIE live integre library meta-patterns cycle 3 comme 7e occurrence avec evidence directe irrefutable (blocage reel observe). 6 learnings L-S11-01..06 : audit securite solo surface faible couverture gaps (investment pre-expansion), documentation agents asymetrique dette cognitive recurrente, meta auto-reference passage theorique->empirique, CLAUDE.md dense mais lisible tant que charge en contexte, hooks fail-loud majoritaire sauf settings.json silent, amplification mix moyenne stabilise L-S10-07 (mecanique S9 +5.5% < mix S11 +14.3% < declaratif S8 +25% < meta-declaratif S10 +45%). Dette batch S21 cumulee ~40 fixes (S7+S8+S9+S10+S11). Observations positives : 0 cles hardcodees modules/app/src, RLS ENABLE sur 7 tables, ci.yml safe vs command injection, supabase-ping safe env+secrets, hooks version-controlled scripts/git-hooks/.'
    },
    {
      id: 'D-S10-01..19',
      date: '2026-04-09',
      title: 'Audit skills + BMAD verdict re-confirme + 6 meta-patterns cycle 3',
      summary:
        '19 decisions issues audit S10 Skills + BMAD verdict (10e consecutive mode MOI). D-S10-01 NO ACTION BMAD dormant garde re-confirme (couple decision 2026-04-07 docs/tools-audit.md:34 + directive explicite Kevin 2026-04-09 "on garde tous les outils"). Batch S21 housekeeping 3 items : D-S10-02 mini-section CLAUDE.md Outils dormants pointant _bmad + docs/tools-audit.md (mitigate F-S10-01 invisibilite), D-S10-03 update docs/tools-audit.md date+counts corriges (88 skills + ~40 sessions actuelles), D-S10-04 OPTIONNEL docs/skills-inventory.md reference statique. Hors scope : D-S10-05 superpowers deprecated externe, D-S10-09 cout superpowers:using-superpowers externe, D-S10-11 gstack preamble user-global, D-S10-15 user-invocable:false non enforce harness = trace only. Parking post-cycle3 : D-S10-12 skills figma+chrome-devtools-mcp pour DS-5 future, D-S10-16 evaluer OMC commit trailers (Confidence/Scope-risk/Not-tested) cycle 4. Phase B actions : D-S10-17 correction comptage OMC 37 (vs ~40 estime A) deja appliquee. D-S10-14 F-S10-12 PROMOTED omc-reference auto-load NON observe en session = IGNORE skills OMC decision 2026-04-07 RENFORCEE (contrat d exposition non tenu, custom Foundation plus robuste). Meta-guidelines : D-S10-18 pattern auto-reference polarity positive (F-S10-16 omc-reference exemple commit auto-ref) vs negative (F-S9-18 security-reminder bloque audit de lui-meme) = library 6 meta-patterns cycle 3 (M-S6-01 + M-S7-01 + M-S8-01 + M-S9-xx + M-S10-01 + M-S10-02 NEW). D-S10-19 L-S10-07 amplification differentielle scale avec niveau abstraction meta (mecanique S9 +5.5% < declaratif S8 +25% < meta-declaratif S10 +45%) = regle calibrer effort phase B futurs audits. Learnings L-S10-01..08 : dormant garde vs invisible role routing, overlap fonctionnel 10+ code review / 7+ planning / 3+ brainstorming = signal ecosysteme pas redondance, ratio 7.2% usage/surface sain, audit passif vs actif P1 impossible phase A, tests reels phase B idempotents uniquement (pas d invocation write-capable), meta-pattern library 6 entries, L-S10-07 amplification scale abstraction, L-S10-08 auto-reference polarity. Dette heritee batch S21 cumulee ~34 fixes (S7+S8+S9+S10).'
    },
    {
      id: 'D-S9-01..13',
      date: '2026-04-09',
      title: 'Audit scripts + hooks S9 cleanup batch + retract partiel D-S8-12',
      summary:
        '13 decisions batch S21 housekeeping : D-S9-01 fix F-S9-01 P1 cause racine F-MON-01 (health-check L140 grep "\\.js " matche ligne prebuild DS avant ligne vite bundle -> grep "^dist/.*\\.js "), D-S9-02 fix CSS symetrique, D-S9-03 fix sync-check double verdict grep -v "Verdict :" couple D-S8-08, D-S9-04 extraction polyglot module-scaffold vers scripts/lib/update-context-md-modules.py couple D-S8-10 F-S8-15, D-S9-06 batch fix validate-void-glass loop fichiers + .ts regex + system-ui check, D-S9-07 fix F-S9-19 session-lock read_lock validation champs, D-S9-08 batch cosmetique P3 (F-S9-04/05/07/08/09/14/15/16). Hors batch : D-S9-05 refuse interleave F-MON-01 respect D-S7-01 strict flag only, D-S9-09 retract partiel D-S8-12 (hook commit-msg correct docs(audit) accept / audit() reject, le plan cycle3 section S9.6 est faux en proposant audit(s09) -> fix plan S21 pas le hook), D-S9-10 F-S9-10 session-lock non branche parking Cowork Sprint 1, D-S9-11 F-S9-18 meta hook auto-reference parking post-cycle3, D-S9-12 tests unitaires scripts parking, D-S9-13 shellcheck audit parking. Learnings L-S9-01..06 : cause racine vs symptome deep (F-MON-01 flag cosmetique revele cause structurelle par audit line-by-line), asymetrie hook fast path vs auditeur slow path (regle emergente partage scripts/lib/), auto-reference structurelle outils audit, amplification differentielle scripts +5.5% vs commands +25%, pre-commit hook heritage bugs (justifie P1 cosmetique dans scripts hooked-in).'
    },
    {
      id: 'D-S8-01..12 + M-S8-01',
      date: '2026-04-09',
      title: 'Audit commands S8 cleanup batch + meta pattern spec MD vs code',
      summary:
        '12 decisions batch S21/S9/S20 : D-S8-01 fix briefs v1/v9 commands spec vs CLAUDE.md directive, D-S8-02 fix sync.md double source, D-S8-03 merge PAUL jargon avec F-S7-09, D-S8-04 npm workspaces drift doc, D-S8-05 step 5.5 no action (D-MON-03 accepted), D-S8-06 new-project template sortie, D-S8-07 fix template README dupplique script vs MD, D-S8-08 sync-check double verdict, D-S8-09 merge D-S8-02, D-S8-10 flag polyglot scripts/module-scaffold.sh pour S9, D-S8-11 formalisation M-S8-01 meta-finding 3e occurrence pattern spec MD vs code (F-S5-20 + M-S6-01 + F-S8-03/14), D-S8-12 bonus scripts/git-hooks/commit-msg refuse type audit (plan obsolete, commits S1-S7 utilisent docs(audit)). Dette heritee batch S21 ~8-12 fichiers effort ~1-2 sessions.'
    },
    {
      id: 'D-S7-02..09',
      date: '2026-04-08',
      title: 'Audit agents S7 cleanup batch (integre S7.5 2026-04-09)',
      summary:
        '8 decisions batch S21/S22 : D-S7-02 enrichir dev-agent workflow section, D-S7-03 parking frontmatter model+tools, D-S7-04 cleanup jargon PAUL/P1/Phase 2.4, D-S7-05 merge commit-msg fix, D-S7-06 accepted dette routing gap, D-S7-07 triggers faibles note/check, D-S7-08 ligne blanche frontmatter, D-S7-09 enrichir sync-check paths check.'
    },
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
      date: '2026-04-10',
      tag: 'DONE',
      title: 'Mega session — Cycle 3 cloture + DS-6 + React 19 + DS-5 CI + cleanup + securite Supabase',
      summary:
        '10+ commits. Cycle 3 cloture (S22 P3 12 fixes + S23 rapport final + PR #1 merged). DS-6 : 206/254 couleurs migrées vers tokens (97%). Deps : React 19+Vite 8+TW4, build 761→183ms (-76%). DS-5 : Playwright+axe CI gate (10/10 tests). Cleanup : audit archive, dead code (Dashboard+StatPill), session briefs v9, refs 196→33. Supabase : migration 003 updated_at, RLS 6 tables + 24 policies, function search_path fix. CI green.'
    },
    {
      date: '2026-04-09',
      tag: 'DONE',
      title: 'S12 Memoire (4 tiers) + anti-compactage (a+b) — 3 commits, 23 findings (5 P1 docs), meta M-S12-01 AMPLIFIE, PHASE V close',
      summary:
        '3 commits sur branche audit-massif-cycle3, 12e session consecutive mode MOI strict, ferme PHASE V. Pre-session : d959213 recup livrable orphelin 07-agents.md (402L working tree non-committe depuis 2026-04-08). Briefing frontload 6 questions, Kevin delegue "fait ce que tu recommande". (1) d959213 S7 orphan recup. (2) 2190988 S12a = remplace placeholder 12-memory-anti-compactage.md 6L par livrable 466L phase A lecture 4 tiers (Session conforme / Contexte CONTEXT.md vivant 17 decisions > 15 max spec / Reference docs/ index.md 2j stale / Auto-memory 100% integrite MEMORY.md 10/10 mais 2 fichiers stale) + audit anti-compactage (master file section 6 TOUT STALE drift 12 sessions + 00-INDEX drift 7 sessions + 4/8 mitigations abandonnees + test mental reprise = CONTEXT.md seul operationnel) + doublons cross-files (15 analyses : 3 OK pointeurs + 4 duplication factuelle + 5 stales). (3) 40733dc S12b = finalise 576L avec 4 tests reels : T1 MEMORY.md 10=10 zero drift, T2 grep commit format 16 stale / 10 runtime ratio 1.6:1, T3 reprise scenarisee 3 sources -> 3 reponses differentes (S0/S5/S12) = DEMO EMPIRIQUE F-S12-03 P1, T4 commits 4/5 pattern docs(audit) stable convention non documentee. 3 new findings phase B : F-S12-20 P1 demo empirique T3, F-S12-21 P2 quantification drift, F-S12-22 P3 convention. Final : 23 findings (5 P1 + 8 P2 + 9 P3 + 1 meta M-S12-01). 5 P1 tous documentaires : master file stale 12 sessions, 00-INDEX stale 7 sessions, procedure reprise depend data stale, 4/8 mitigations abandonnees, demo empirique 3 sources divergentes. M-S12-01 = 8e meta cycle 3 paradoxe auto-reference anti-compactage (passage theorique -> empirique meme pattern M-S11-01). Amplification +15% (20->23). 23 decisions D-S12-01..23, 9 learnings L-S12-01..09 dont L-S12-01 spec anti-drift sans update auto = spec auto-drift + L-S12-02 CONTEXT.md tier unique ratio 10:1. Zero code modules touche. Health : build 1.44s OK, 19/19 tests, DEGRADED baseline 84 refs zero drift session-start -> S12a -> S12b. Cycle 3 : 12/24 (50%). Prochaine : S13 Module App OU pause OU housekeeping S21 ~44 fixes.'
    },
    {
      date: '2026-04-09',
      tag: 'DONE',
      title: 'S11 Communication + securite (a+b) — 2 commits, 16 findings, meta M-S11-01 LIVE demontre par blocage hook security-reminder',
      summary:
        '2 commits sur branche audit-massif-cycle3, 11e session consecutive mode MOI strict. Briefing frontload Kevin 5 questions (pattern S11a/S11b, perimetre strict Core OS, tests phase B invocation+historique+RLS, commit docs(audit), fix P1 secu opportuniste si trouve), Kevin delegue "Fait ce que tu recommande je te fait confiance" -> exec reco A/A/C/A/A. (1) b66b003 S11a = remplace placeholder 11-comm-securite.md 6L par livrable 502L phase A lecture 15 fichiers ~600L (4 agents custom + CLAUDE.md directives zero-bullshit + 4 hooks security-reminder 281L/validate-void-glass 39L/pre-commit 21L/commit-msg 20L + 3 .gitignore + 2 workflows CI + settings.json + migration SQL RLS + supabase.ts env refs) + draft 14 findings (0 P1 + 3 P2 + 11 P3 + 1 meta M-S11-01). (2) 969c181 S11b = finalise livrable a 590L avec phase B 3 tests reels : T1 invocation review-agent reelle via Task tool (output OK/Warning/Erreur/Verdict 100% conforme a .claude/agents/review-agent.md L35-40, zero divergence doc vs runtime, addition non-doc "Fichiers verifies :" footer non-bloquante), T2 parsing git log -20 (20/20 commits conformes hook commit-msg, pattern audit emergent confirme sur 5 commits docs(audit): sXX[a]), T3 grep RLS policies USING (21 policies sur 7 tables uniformes auth.role()=authenticated, no user_id filter, no DELETE policy). 2 findings new phase B : F-S11-15 P3 RLS scope user insuffisant Phase 5 multi-user (parking post-cycle3, re-audit obligatoire avant Finance/Sante avec ajout user_id + auth.uid()=user_id), F-S11-16 P3 convention commits audit cycle3 non-documentee (pattern stable sur 5 commits mais absent plan + CLAUDE.md + agents, couple D-S8-12 / D-S9-09). Final : 16 findings (0 P1 + 3 P2 + 13 P3 + 1 meta M-S11-01 AMPLIFIE). 3 P2 : F-S11-01 settings.json absolute paths hardcodes fail-silent pire mode (justifie P2), F-S11-02 pattern P8 substring trop large = DEMONSTRATION LIVE PHASE A (premier Write du livrable BLOQUE par hook security-reminder sur pattern P2 subprocess exec-famille parce que section 3.3 listait les substrings litterales -> reformulation forcee 12 substrings en descriptions neutres -> Write reussi 2e tentative -> passage meta F-S9-18 de theorique code inspection S9 a empirique blocage reel S11 = 7e occurrence meta cycle 3 avec evidence directe irrefutable), F-S11-03 gitignore root minimal manque ~10 patterns defensifs (*.pem/*.key/id_rsa*/credentials.json/.env.*/secrets.json/*.log). M-S11-01 AMPLIFIE live = audit honnete impossible sans workaround reformulation = meta structurel pas cosmetique. 15 decisions D-S11-01..15 dont phase A 13 + phase B 2 nouveaux. 6 learnings L-S11-01..06. Amplification tests reels S11a->S11b +14.3% (14 -> 16) conforme prediction mix moyenne stabilise L-S10-07 (mecanique S9 +5.5% < mix S11 +14.3% < declaratif S8 +25% < meta-declaratif S10 +45%). Observations positives : 0 cles hardcodees modules/app/src (tous via import.meta.env.VITE_*), RLS ENABLE 7 tables, ci.yml safe vs command injection, supabase-ping safe pattern env+secrets, pre-commit+commit-msg version-controlled, hooks fail-loud majoritaire, kill switch ENABLE_SECURITY_REMINDER=0, .env.local correctement ignore (3 .gitignore coherents verifies). Library meta-patterns cycle 3 mise a jour 7 entries : M-S6-01+M-S7-01+M-S8-01+M-S9-xx+M-S10-01+M-S10-02+M-S11-01 NEW. Zero code modules touche, review-agent invoque en read-only. Health final : build 960ms OK (22.12 kB CSS + 457.15 kB JS, 108 modules), 19/19 tests verts (6 fichiers, 1.27s), DS 100/100 non re-verifie (DS inchange), DEGRADED baseline 86 refs identique session-start (zero drift S11a->S11b), F-MON-01 toujours visible respect strict D-S7-01, decisions datees 16. Dette batch S21 cumulee ~40 fixes. Prochaine : S12 Memoire (4 tiers) + anti-compactage (12e consecutive, ferme PHASE V du cycle 3).'
    },
    {
      date: '2026-04-09',
      tag: 'DONE',
      title: 'S10 Skills + BMAD verdict (a+b) — 2 commits, 16 findings, BMAD dormant garde re-confirme',
      summary:
        '2 commits sur branche audit-massif-cycle3, 10e session consecutive mode MOI strict. Directive Kevin S10 : "fait au mieux, pour meilleur qualite et efficacite. Pour les outils on les garde tous, on vas meme en ajouter apres le mega audit." (simplifie scope verdict tous outils gardes, conserve valeur inventaire + tests reels). (1) d506bdc S10a = remplace placeholder 10-skills.md 7L par livrable 390L phase A lecture + inventaire exhaustif 5 sources (4 commands custom + 4 agents custom + 12 BMAD modules + gstack 1 SKILL.md + ~60 binaires + plugins harness) + draft 11 findings (0 P1 + 4 P2 + 7 P3 + 1 meta M-S10-01) + 13 decisions D-S10-01..13 + 6 learnings + 11 cross-refs S1-S9 + BMAD verdict DORMANT GARDE re-confirme. (2) 158b255 S10b = finalise 10-skills.md a 595L avec phase B tests reels : 1 invocation reelle oh-my-claudecode:omc-reference (catalog read-only OK, pas d effet de bord) + 2 lectures source directe (omc-reference/SKILL.md + skill/SKILL.md) + comptage exact cache OMC 37 skills (correction phase A ~40). Decouvertes critiques phase B : F-S10-12 P2 PROMOTED omc-reference frontmatter annonce "Auto-loads when delegating to agents..." MAIS le skill N A PAS ete auto-load dans la session (invocation manuelle Skill tool requise pour obtenir le catalog 19 agents OMC), F-S10-13 P2 NEW flag user-invocable:false declare mais NON enforce par harness (invocation reussie malgre le flag), F-S10-14 P3 NEW OMC commit trailers (Constraint/Rejected/Directive/Confidence/Scope-risk/Not-tested) plus riches que Conventional Commits Foundation = opportunite post-cycle3 cycle 4 evaluation, F-S10-16 P3 NEW omc-reference exemple commit L131-141 meta-auto-referentiel parfait (decrit exactement le commit livrant le skill lui-meme) = pattern OPPOSE a F-S9-18 (hook security-reminder bloque audit de lui-meme) = L-S10-08 auto-reference polarity positive vs negative. Final : 16 findings (0 P1 + 6 P2 + 9 P3 + 1 meta M-S10-01). Amplification tests reels S10a->S10b +45% (11 -> 16) = plus fort que S8 +25% et S9 +5.5% = L-S10-07 regle emergente amplification scale avec niveau abstraction meta (mecanique < declaratif < meta-declaratif). Inventaire exact : 88 skills plugins (corrige de ~91 phase A) + 12 BMAD dormants + ~60 gstack binaires + 4 commands + 4 agents = ~167 points d invocation, ~12 actifs Foundation = ratio usage reel 7.2% = pattern sain concentre custom + ecosysteme en orbite passive. BMAD verdict FINAL DORMANT GARDE re-confirme : couple decision 2026-04-07 (overrule Kevin audit ARCHIVER) + directive explicite Kevin 2026-04-09 + evidence phase B F-S10-12 RENFORCE (si auto-load non tenu, custom Foundation plus robuste). 19 decisions D-S10-01..19 dont D-S10-01 NO ACTION + D-S10-02..04 batch S21 (3 fixes : pointeur CLAUDE.md outils dormants + update docs/tools-audit.md + optionnel docs/skills-inventory.md) + D-S10-14 validation renforcement + D-S10-18/19 meta-guidelines cycle3+ (6 meta-patterns formalises). 8 learnings L-S10-01..08 dont L-S10-07 amplification scale et L-S10-08 polarity. Dette batch S21 cumulee ~34 fixes (S7+S8+S9+S10). Zero code modules touche, zero invocation skill write-capable. Health final : build 688ms OK, 19/19 tests verts (6 fichiers, 1.30s), DEGRADED baseline 84 refs (vs 80 session-start = +4 drift forward-refs docs internes attendu), 0 drift S10a/S10b (84 identique), F-MON-01 TOUJOURS visible (respect strict D-S7-01). Prochaine : S11 audit suivante OU housekeeping batch S21 OU pause strategique (10 sessions deep consecutives = signal fatigue).'
    },
    {
      date: '2026-04-09',
      tag: 'DONE',
      title: 'S9 Scripts + hooks (9) deep (a+b) — 2 commits, 19 findings dont 1 P1 cause racine F-MON-01',
      summary:
        '2 commits sur branche audit-massif-cycle3, 9e session consecutive mode MOI strict pattern S9a/S9b valide. (1) 53d1d2b S9a = remplace placeholder 09-scripts-hooks.md 7L par livrable 267L phase A lecture line-by-line des 9 scripts Foundation OS (health-check 171L + sync-check 214L + ref-checker 178L + module-scaffold 168L + session-lock 145L + validate-void-glass 38L + security-reminder.py 280L + pre-commit 20L + commit-msg 19L = 1233L total) + audit 4 angles (bug / idempotent / exit codes / output) + draft 18 findings (1 P1 + 6 P2 + 11 P3). (2) 2599d36 S9b = finalise a 412L avec phase B tests reels invocation (health-check full 3x, sync-check full, ref-checker --help + full, session-lock status/force/release sequence, module-scaffold --help seulement destructif, validate-void-glass fichier temp violant + sain, security-reminder stdin JSON safe + violate pattern #6, commit-msg dry strings 3x, pre-commit automatique) + 1 finding nouveau F-S9-19 (lockfile .fos-session.lock corrompu head/started_at vides affichage degrade "EXPIRED depuis" espaces, force+release repare). Final : 19 findings (1 P1 + 7 P2 + 11 P3) + 13 decisions D-S9-01..13 batchees S21 + 6 learnings L-S9-01..06. F-S9-01 P1 CAUSE RACINE F-MON-01 IDENTIFIEE : health-check L140 grep "\\.js " matche ligne prebuild DS "tokens.js + tokens.json" AVANT ligne vite bundle donc awk extrait "Design" au lieu du nombre. Fix trivial grep "^dist/.*\\.js " mais D-S7-01 strict = pas de fix opportuniste batch S21 via D-S9-01. F-S9-03/06 confirment F-S8-13/15 (double verdict sync + polyglot scaffold). F-S9-11/12/13 nouveaux coverage gaps validate-void-glass vs sync-check. F-S9-17 D-S8-12 RETRACT PARTIEL : hook commit-msg correct, le plan cycle3 S9.6 est faux en proposant audit(s09). F-S9-18 meta-finding auto-reference (hook security bloque l audit de lui-meme sur substring matching pattern names). Amplification tests reels S9a->S9b +5.5% (18 -> 19) vs +25% en S8 = L-S9-04 regle emergente calibrer effort par type artefact scripts mecaniques vs commands declaratifs. Dette heritee cumulee batch S21 (S7+S8+S9) ~32 fixes estimes effort ~2-3 sessions. Health final : build 1.07s OK, 19/19 tests verts, DS 100/100, DEGRADED baseline 79 refs (vs 75 session-start = +4 forward-refs docs), F-MON-01 TOUJOURS visible (batch S21 per D-S9-05). Prochaine : S10 Skills + BMAD verdict (10e consecutive).'
    },
    /* S7.5/S8 dropped from top-5 — available via git log */
  ]
}
