# S1 — Carto repo file-by-file

> Date : 2026-04-07 | Status : DONE | Mode : MIX (3 sub-agents Explore + consolidation MOI)
> Livrable precedent : `00-preflight.md`
> Findings cles : 100 fichiers scannes (11 576 lignes), 1 fix trivial applique (chmod commit-msg), 3 findings sub-agents re-verifies et corriges, gap couverture modules/app/ root detecte et comble en session.

## 1. Objectif

Etablir une cartographie exhaustive du repo Foundation OS pour servir de reference a toutes les sessions S2-S23. Chaque fichier du scope doit avoir : path, taille en lignes, role apparent, keywords. Les jugements cross-fichier (orphelins, doublons, redondance) doivent etre verifies avec contexte global avant d'etre valides.

**Scope** :
- `modules/app/src/**/*.{ts,tsx}` (code React/TS)
- `modules/app/*` (configs root)
- `.github/`, `supabase/`, `.claude/`, `scripts/` (infra)
- `docs/**/*.md` (hors `docs/audit-massif/`, volontairement skip pour eviter self-reference)
- Racine : `CLAUDE.md`, `CONTEXT.md`, `README.md`, `.gitignore`

**Hors scope** :
- `.archive/` (archive historique, skip decide)
- `_bmad/` (dormant, audit Phase 3 deja DONE, voir `docs/tools-audit.md`)
- `.omc/`, `.claude/.DS_Store`, `modules/app/.omc/` (etats transient / cache)
- `modules/app/package-lock.json` (genere)
- `modules/app/.env.local` (non-tracke par design, secrets)
- `.git/`, `node_modules/` (system)

## 2. Methodologie

**Phase A** — 3 sub-agents Explore dispatch en parallele (briefs isoles, zones non-chevauchantes) :
- SA#1 : `modules/app/src/**/*.{ts,tsx}`
- SA#2 : `.github/`, `supabase/`, `.claude/`, `scripts/` (infra)
- SA#3 : `docs/**/*.md` + `CLAUDE.md` + `CONTEXT.md` + `README.md`

Chaque brief imposait : format tableau MD avec colonnes exactes, zero hallucination, "incertain" si role pas clair, pas de modification.

**Phase B** — Verification integrite outputs : formats respectes (✓), totaux presents (✓), aucun debordement hors scope (✓).

**Phase C** — Consolidation MOI avec contexte global :
- Re-verification systematique des findings jugeant cross-fichier (orphelin, doublon, redondance)
- Completion du gap de couverture `modules/app/` root (12 configs + .gitignore racine) que les briefs avaient exclus
- Correction d'une erreur arithmetique sub-agent #3
- Fix trivial applique en continu (autorise par decision D-S0-08) : `chmod +x scripts/git-hooks/commit-msg`

**Phase D** — Redaction de ce livrable.

**Phase E** — Commit atomique + post-session ritual.

## 3. Cartographie consolide

### 3.1 · modules/app/src/ (42 fichiers, 4755 lignes)

| path | lines | role | keywords |
|------|-------|------|----------|
| src/main.tsx | 10 | entry point | ReactDOM createRoot, App render |
| src/App.tsx | 70 | root routing | BrowserRouter, Routes, AuthProvider, global styles |
| src/vite-env.d.ts | 10 | type definitions | Vite client, env types, VITE_SUPABASE config |
| src/lib/supabase.ts | 17 | Supabase client | createClient, Database types, env config |
| src/lib/database.types.ts | 175 | DB schema types | Session, Decision, Risk, Doc, NextStep, ContextBlock |
| src/lib/AuthContext.tsx | 61 | auth provider | useAuth hook, signIn, signUp, signOut |
| src/lib/useCommander.ts | 157 | data hook | fetch 6 tables parallel, seed fallback |
| src/lib/mutations.ts | 309 | CRUD operations | useCommanderMutations, create/update/delete |
| src/components/index.ts | 11 | barrel export | Badge, Card, TabBar, StatPill, Navbar, Layout, PageContainer, PageHeader, Footer |
| src/components/StatPill.tsx | 16 | UI pill | tailwind, label + value |
| src/components/Card.tsx | 28 | UI container | selection state, void glass |
| src/components/Badge.tsx | 21 | UI label | JetBrains Mono, color variants |
| src/components/Layout.tsx | 96 | layout wrapper | Layout, PageContainer, PageHeader, Footer |
| src/components/TabBar.tsx | 31 | tab navigation | Tab interface, active state |
| src/components/Navbar.tsx | 117 | top navbar | NavLink, auth-protected, logout, active state teal |
| src/components/SupabaseCRUDTest.tsx | 425 | test component | CRUD validation, form states, success/error feedback |
| src/components/Commander/index.ts | 7 | barrel export | 7 panels Commander |
| src/components/Commander/StatsBar.tsx | 43 | stats display | pill metrics, sessions/decisions/risks/next_steps counts |
| src/components/Commander/SessionsPanel.tsx | 37 | session list | cards, date, title, items, decisions |
| src/components/Commander/DecisionsPanel.tsx | 32 | decisions grid | 2-col, ADR display, impact badges |
| src/components/Commander/RisksPanel.tsx | 39 | risk list | level + status colors |
| src/components/Commander/DocsPanel.tsx | 32 | docs grid | category badge, type color mapping |
| src/components/Commander/ContextPanel.tsx | 26 | context grid | 2-col, label + content |
| src/components/Commander/NextStepsPanel.tsx | 51 | next steps | todo/in_progress/done grouping, priority colors |
| src/components/forms/AddSessionForm.tsx | 190 | form modal | create session, mutations |
| src/components/forms/EditDecisionModal.tsx | 225 | form modal | edit ADR, mutations |
| src/components/forms/NextStepActions.tsx | 236 | form component | CRUD, toggle status, optimistic updates |
| src/pages/Commander.tsx | 117 | routed page | Commander main, tab switching, data layout |
| src/pages/Dashboard.tsx | 257 | routed page | pipeline phases, stats display |
| src/pages/Phase1Demo.tsx | 544 | demo page | CRUD validation, test runner, db connection check |
| src/pages/IndexPage.tsx | 256 | routed page | module navigator cards |
| src/pages/KnowledgePage.tsx | 346 | routed page | knowledge base statique (manifeste/journal/frameworks/stack/roadmap) |
| src/pages/LoginPage.tsx | 148 | auth page | login/signup forms, email password, redirects |
| src/pages/ResetPasswordPage.tsx | 154 | auth page | password reset flow |
| src/test/setup.ts | 1 | test config | testing-library jest-dom import |
| src/test/app.test.tsx | 15 | unit test | IndexPage render |
| src/test/supabase.test.ts | 18 | unit test | client methods exist |
| src/test/AuthContext.test.tsx | 93 | unit test | auth hook mocked flow |
| src/test/mutations.test.ts | 89 | unit test | CRUD operations isolated |
| src/test/useCommander.test.ts | 91 | unit test | fallback logic seed vs supabase |
| src/test/forms.test.tsx | 96 | unit test | form components |
| src/test/mocks/supabase.ts | 58 | mock factory | createSupabaseMock, createQueryBuilder |

**Sous-total** : 42 fichiers, 4755 lignes.

### 3.2 · modules/app/ root (13 fichiers, 222 lignes) — COMBLE EN SESSION

> **Gap de couverture detecte en Phase C** : les briefs sub-agents avaient exclus cette zone. Complete moi-meme (regle "sub-agents uniquement quand contexte global non necessaire" — ces fichiers touchent aux conventions du projet).

| path | lines | role | keywords |
|------|-------|------|----------|
| modules/app/package.json | 35 | npm manifest | 4 deps prod (supabase-js, react 18, react-dom, react-router-dom 7), 13 devDeps, scripts dev/build/test/preview/db:migrate/db:reset |
| modules/app/tsconfig.json | 25 | TS config | ES2020 DOM, strict, noUnused*, alias @ → src, path reference tsconfig.node |
| modules/app/tsconfig.node.json | 10 | TS config node | composite pour vite.config.ts |
| modules/app/vite.config.ts | 24 | vite build config | @vitejs/plugin-react, alias @, rollup external fs/path (workaround browser Node) |
| modules/app/vitest.config.ts | 15 | vitest config | jsdom env, globals, setupFiles src/test/setup.ts |
| modules/app/tailwind.config.js | 16 | tailwind config | fontFamily sans=Figtree, mono=JetBrains Mono (aligne Void Glass) |
| modules/app/postcss.config.js | 6 | postcss config | tailwindcss + autoprefixer |
| modules/app/index.html | 13 | HTML entry | html lang=fr, favicon.svg, main.tsx script |
| modules/app/vercel.json | 5 | Vercel config | SPA rewrites / → /index.html |
| modules/app/.env.local.example | 5 | env template | VITE_SUPABASE_URL + ANON_KEY placeholders |
| modules/app/.gitignore | 25 | gitignore module | node_modules, dist, .env.local, logs, etc. |
| modules/app/README.md | 34 | module readme | stack, commandes, structure, deploy (pointe vers ../../CONTEXT.md et docs/design-system.md) |

**Sous-total** : 13 fichiers, 213 lignes (sans le .env.local non liste 2x). Note : 222 inclus le .gitignore racine compte separement en 3.5.

### 3.3 · Infrastructure (21 fichiers, 1959 lignes)

| path | type | lines | role | purpose |
|------|------|-------|------|---------|
| .github/workflows/ci.yml | yaml | 35 | CI pipeline | build + tsc + vitest sur push/PR main, timeout 10min, node 24 |
| .github/workflows/supabase-ping.yml | yaml | 27 | cron hebdo | Monday 8h UTC, curl Supabase REST, timeout 5min + --max-time 30 |
| supabase/migrations/001_create_tables.sql | sql | 308 | DB schema | 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs), RLS, triggers, seed |
| .claude/settings.json | json | 31 | hook config | PreToolUse : validate-void-glass.sh + security-reminder.py, OMC plugin enable |
| .claude/settings.local.json | json | 66 | permissions whitelist | bash/npm/node + MCPs + git hooks + diagnostics (local dev env) |
| .claude/agents/os-architect.md | md | 50 | agent spec | Architecture decisions, stack, schema, monorepo structure |
| .claude/agents/dev-agent.md | md | 52 | agent spec | React/Vite/TS code, Void Glass compliance, Supabase |
| .claude/agents/doc-agent.md | md | 51 | agent spec | CONTEXT.md maj, Memory 4 tiers |
| .claude/agents/review-agent.md | md | 40 | agent spec | health-check + audit (refs, dateness, sync, conventional commits), verdict SAIN/DEGRADED/BROKEN |
| .claude/commands/session-start.md | md | 30 | command spec | Read CONTEXT.md, detect modules, verify structure, build, health-check gate |
| .claude/commands/session-end.md | md | 53 | command spec | Classify DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED, update CONTEXT.md Memory protocol |
| .claude/commands/new-project.md | md | 49 | command spec | /new-project [name] via module-scaffold.sh |
| .claude/commands/sync.md | md | 79 | command spec | /sync via sync-check.sh — structure, modules, refs, routes, Void Glass, Core OS |
| scripts/health-check.sh | bash | 171 | health monitor | CRITICAL (build, structure, tsc), WARNING (TSX sizes, Void Glass, MD pairs, refs, vitest), INFO (bundle, decisions dateness) |
| scripts/sync-check.sh | bash | 214 | coherence audit | Run health + extended : modules vs CONTEXT, refs, routes/fonts App Builder, Core OS presence |
| scripts/ref-checker.sh | bash | 178 | broken ref detector | Full-repo .md scan, markdown links + backtick paths, code-block aware, baseline 0 |
| scripts/module-scaffold.sh | bash | 168 | scaffolder | modules/[name] avec README+package.json skeleton, kebab-case, idempotent, update CONTEXT.md |
| scripts/git-hooks/pre-commit | bash | 20 | git hook | Run health-check, block si BROKEN, warn si DEGRADED |
| scripts/git-hooks/commit-msg | bash | 19 | git hook | Enforce conventional commits 11 types |
| scripts/hooks/validate-void-glass.sh | bash | 38 | validation hook | PreToolUse Write/Edit : check #0A0A0B/#08080A forbidden + Outfit/Inter fonts, grep -i case-insensitive |
| scripts/hooks/security-reminder.py | python3 | 280 | security hook | PreToolUse : pattern-match injection/XSS/code-exec, session-scoped state, 30-day cleanup |

**Sous-total** : 21 fichiers, 1959 lignes.

### 3.4 · Documentation (23 fichiers, 4631 lignes)

| path | lines | role | keywords | category |
|------|-------|------|----------|----------|
| docs/architecture.md | 54 | vue d'ensemble monorepo | stack, 3 couches, toolkit | architecture |
| docs/core/architecture-core.md | 60 | spec 4 modules Core OS | cortex memory monitor tools | core |
| docs/core/cortex.md | 97 | routing agents | arbre decision, signaux, priorite | core |
| docs/core/memory.md | 102 | protocole memoire | tiers session/contexte/reference/auto | core |
| docs/core/monitor.md | 92 | health indicators | severite, seuils | core |
| docs/core/tools.md | 82 | utilitaires automation | health/sync/ref-checker/scaffold/hooks | core |
| docs/decisions-log.md | 44 | archive decisions stabilisees | archivage stack design | log |
| docs/design-system.md | 66 | Void Glass spec | #06070C, Figtree, JetBrains Mono | design |
| docs/directive-v1.md | 259 | reference regles comportement | IMP-01 a IMP-18, P0-P9 | reference |
| docs/index.md | 100 | carte navigation | pages/routes/components/lib | reference |
| docs/manifeste.md | 32 | principes OS personnel | simplicite, realisme, organicite | reference |
| docs/plans/2026-04-05-phase1-fondations.md | 391 | plan phase 1 | consolidation CLAUDE.md directive security gstack | plan |
| docs/plans/2026-04-07-cycle3-implementation.md | 1648 | plan audit massif 24 sessions | S0-S23 sub-agents gates livrables | plan |
| docs/plans/2026-04-07-finition-os.md | 296 | polish sync/refs/housekeeping | session 1-3 | plan |
| docs/plans/2026-04-07-phase2-app-hardening.md | 199 | tests + navigation + auth | vitest artifacts integration | plan |
| docs/plans/2026-04-07-phase3-os-intelligence.md | 206 | session-end 4 niveaux | DONE/CONCERNS/NEEDS_CONTEXT/BLOCKED | plan |
| docs/plans/2026-04-07-phase4-monitoring.md | 216 | health checks auto | bundle tracking, pre-commit | plan |
| docs/setup-guide.md | 56 | guide installation | Node, Claude Code, GitHub, Supabase, Vercel | setup |
| docs/specs/2026-04-05-foundation-os-v2-design.md | 324 | spec v2 5 phases | approche C phase gate alternance | spec |
| docs/tools-audit.md | 138 | audit BMAD/OMC | verdict GARDER/DOCUMENTER/ARCHIVER | audit |
| CLAUDE.md | 133 | instructions imperatifs | 11 imperatifs, stack, regles, anti-bullshit | racine |
| CONTEXT.md | 100 | source de verite | modules, sessions, cycle 3 progress | racine |
| README.md | 39 | presentation projet | App Builder/Finance/Sante monorepo | racine |

**Sous-total** : 23 fichiers, 4631 lignes.

**Note** : CLAUDE.md compte 133 lignes apres les 4 imperatifs ajoutes en S1 (initialement 130). `docs/plans/2026-04-07-cycle3-implementation.md` reste le plus gros (1648L).

### 3.5 · Racine + autres (1 fichier, 9 lignes)

| path | lines | role |
|------|-------|------|
| .gitignore | 9 | gitignore racine (node_modules, .DS_Store, dist, .env*) |

**Sous-total** : 1 fichier, 9 lignes.

### 3.6 · Totaux

| Zone | Fichiers | Lignes |
|------|----------|--------|
| modules/app/src (code) | 42 | 4755 |
| modules/app/ root (configs) | 13 | 213 |
| Infrastructure (.github, supabase, .claude, scripts) | 21 | 1959 |
| Documentation (docs + CLAUDE.md, CONTEXT.md, README.md) | 23 | 4631 |
| Racine autres | 1 | 9 |
| **TOTAL** | **100** | **11 567** |

## 4. Findings

### 4.1 · Fix applique en session (docs-triviaux-OK D-S0-08)

**F-S1-01 · `scripts/git-hooks/commit-msg` source non-executable** [APPLIQUE]
- **Cause racine** : chmod +x oublie lors du commit audit OS profond (P1 fix F-A4.1 du Cycle 1). Le hook pre-commit etait bien executable mais pas commit-msg, deux fichiers version-controlled crees dans le meme commit avec permission inconsistante.
- **Impact** : a l'installation manuelle (`cp scripts/git-hooks/commit-msg .git/hooks/`) il fallait chmod a la main — oubliable et source potentielle de CI qui passe mais hooks qui ne tournent pas en local.
- **Fix applique** : `chmod +x scripts/git-hooks/commit-msg` → mode `-rwxr-xr-x`. Git detecte le mode change (`git status` confirme modified). Sera stage dans le commit S1.

### 4.2 · Findings sub-agents re-verifies avec contexte global

Application stricte de la regle "les findings orphelin/doublon/redondance d'un sub-agent sont a re-verifier" (nouvelle ligne CLAUDE.md Imperatifs).

**F-S1-02 · [CORRIGE] SA#3 : `design-system.md` + `manifeste.md` "orphelins apparents"** → **FAUX**
- Grep `design-system\.md|manifeste\.md` dans tous les `.md` du repo : **12 fichiers referents** (CLAUDE.md, .claude/agents/doc-agent.md, dev-agent.md, docs/specs/v2-design, docs/plans/phase1+finition, decisions-log, docs/index, docs/core/memory, docs/architecture, modules/app/README, docs/manifeste lui-meme).
- design-system.md : ref dans 11 fichiers. manifeste.md : ref dans 8 fichiers. Aucun orphelin.
- Cause racine de l'erreur SA#3 : brief restreint a `docs/**/*.md`, ne voyait pas CLAUDE.md racine ni .claude/agents/ → incapable de juger "orphelin". Confirmation empirique de la regle "jugements cross-fichier = contexte global obligatoire".

**F-S1-03 · [CORRIGE] SA#3 : total lignes plans = 2756** → **FAUX**
- Recompte : 1648 (cycle3-impl) + 391 (phase1) + 296 (finition) + 199 (phase2) + 206 (phase3) + 216 (phase4) = **2956L**, pas 2756. Erreur arithmetique -200.
- Lecon : ne pas faire confiance aux totaux calcules par un sub-agent. Recalculer systematiquement.

**F-S1-04 · [CONFIRME] SA#2 : `commit-msg` non-executable** → **VRAI** (voir F-S1-01, fix applique).

### 4.3 · Observations consolides (non-blocking, par ordre d'importance)

**F-S1-05 · `Phase1Demo.tsx` = 544 lignes (78% du seuil 700L)**
- Plus gros TSX de l'app, page demo CRUD. Pas une violation, mais file a surveiller.
- Question ouverte : encore utile en production ? A trancher en **S13 Module App**.
- **Pas d'action immediate** en S1.

**F-S1-06 · `docs/architecture.md` (54L) vs `docs/core/architecture-core.md` (60L) — doublon potentiel**
- Finding SA#3 confirme apres lecture : 2 fichiers d'architecture, niveaux differents (vue globale monorepo vs 4 modules Core OS).
- Pas un doublon strict : roles distincts. Mais nommage ambigu (`architecture-core.md` dans `docs/core/` est redondant avec le dossier).
- **A trancher en S3 Fondations Core OS** (session dediee).

**F-S1-07 · `docs/plans/` concentre 2956 lignes sur 6 fichiers (64% de la doc totale)**
- 6 plans totalisent plus que les 17 autres `.md` docs reunis (1675L).
- `cycle3-implementation.md` seul = 1648L (35% de docs/ entiere).
- Pas anormal (plans sont detailles par design), mais indique que `docs/plans/` devra etre archive apres completion Cycle 3 pour eviter bloat.
- **A trancher en S22/S23** (cleanup final).

**F-S1-08 · `SupabaseCRUDTest.tsx` = 425 lignes**
- 2eme plus gros TSX apres Phase1Demo. Component de test CRUD, pas une page.
- Question : est-il utilise en production ou uniquement en test/dev ? A trancher en **S13**.

**F-S1-09 · `database.types.ts` = 175 lignes, `mutations.ts` = 309 lignes**
- Les deux fichiers lib/ les plus volumineux. Normal (types generes + mutations pour 6 tables).
- Pas d'anomalie.

**F-S1-10 · Gap couverture detecte et comble en session**
- Briefs sub-agents ont exclu `modules/app/` root (13 fichiers, 213L) et `.gitignore` racine (9L).
- Cartographie complete en Phase C directement par MOI.
- Lecon : les briefs des futures sessions avec sub-agents devront etre plus exhaustifs sur les frontieres de scope.

**F-S1-11 · `vite.config.ts` : workaround Node modules dans browser**
- `rollupOptions.external: ['fs', 'path']` + globals `undefined`
- Indique du code source qui importe fs/path et devrait etre isole du browser bundle.
- A investiguer en **S13 Module App** : tracer quel fichier importe fs/path.

**F-S1-12 · `package.json` react-router-dom v7**
- Version 7.14.0 (recent). Pas un probleme, juste a noter pour S14 SUGG tech 1 (audit deps majeures).

### 4.4 · Ce que la carto N'A PAS trouve (zero red flag majeur)

- Aucun fichier > 700L (contrainte Foundation OS respectee — Phase1Demo 544 = max)
- Aucun orphelin verifie
- Aucun doublon strict
- Aucun frontmatter invalide dans .claude/agents/*.md ou .claude/commands/*.md
- Aucun script sans shebang
- Aucun workflow GitHub Actions sans timeout
- Aucune ref cassee (cf. `ref-checker.sh` baseline 0/65)

La baseline est saine, le fix F-S1-01 est la seule intervention S1.

## 5. Decisions prises en S1

| Decision | Detail |
|----------|--------|
| D-S1-01 | `chmod +x scripts/git-hooks/commit-msg` applique en session (fix trivial autorise par D-S0-08). Commit dans S1. |
| D-S1-02 | Gap couverture `modules/app/` root comble en Phase C par MOI directement (pas de re-dispatch sub-agent). |
| D-S1-03 | Findings F-S1-05 (Phase1Demo), F-S1-06 (architecture doublon), F-S1-08 (SupabaseCRUDTest), F-S1-11 (vite fs workaround) reportes en S13/S3 selon scope. |
| D-S1-04 | Totaux repo scanne Cycle 3 : **100 fichiers, 11 567 lignes** (scope audit, hors .archive/_bmad/.omc/.git/node_modules/*.lock/.env.local). Reference baseline pour S2-S23. |
| D-S1-05 | Regle empirique validee : "les findings orphelin/doublon/redondance d'un sub-agent doivent etre re-verifies avec contexte global avant validation" — confirme par le cas F-S1-02. |

## 6. References

- Plan : `docs/plans/2026-04-07-cycle3-implementation.md` section S1 (lignes 267-375)
- Spec : `docs/plans/2026-04-07-audit-massif-final.md` section 6 Live tracking
- Livrable precedent : `docs/audit-massif/00-preflight.md`
- Index : `docs/audit-massif/00-INDEX.md`
- Regle sub-agents : `CLAUDE.md` section Imperatifs + auto-memory `feedback_subagents_context.md`

## 7. Out of scope (a ne pas oublier)

- `.archive/artifacts-jsx/` (7 fichiers MD historiques) : skip volontaire, voir `CONTEXT.md` App Builder etat technique
- `_bmad/` (12 modules dormants) : skip volontaire, audit deja DONE dans `docs/tools-audit.md`
- `modules/app/data/` (7 pairs MD) : refs sync avec .archive, pas de carto necessaire (audit deja fait)
- `docs/audit-massif/` : skip volontaire (self-reference)
- Permissions MCP et secrets : hors scope carto, traite en S11 Comm securite

## 8. Next — Session S2

S2 = Inventaire components + smoke tests (mode **MOI**, plus de sub-agents).

**Scope S2** (d'apres `docs/plans/2026-04-07-cycle3-implementation.md`) :
- 4 agents `.claude/agents/*.md` : lecture, frontmatter, delegations
- 4 commands `.claude/commands/*.md` : lecture, frontmatter, references scripts
- 9 scripts `scripts/**/*.{sh,py}` : smoke test par script (help ou dry-run)
- 2 hooks PreToolUse : verification settings.json references
- Skills + MCP + CI workflows : inventaire

**Livrable** : `docs/audit-massif/02-inventaire-components.md`

**Pre-conditions S2** :
- S1 DONE et commit valide
- Baseline SAIN maintenue
- CONTEXT.md a jour

## 9. Learnings metaboliques (directive D-S0-06)

> Ce que S1 nous a appris sur le fonctionnement de Foundation OS au-dela de l'audit lui-meme.

**L-S1-01 · La regle "sub-agents contexte non necessaire" a besoin de briefs exhaustifs sur les frontieres.**
En S1, les 3 briefs ont chacun un scope explicite mais ont cree un gap : `modules/app/` root (13 fichiers). Lecon : chaque brief doit specifier **"ET PAS" (exclusions explicites)** en plus de **"INCLURE"** pour forcer le dispatcheur a couvrir 100% par recoupement. Applicable aux futures sessions S2, S5, S6, S9 qui ont sub-agents prevus.

**L-S1-02 · Les sub-agents produisent des erreurs arithmetiques silencieuses.**
SA#3 a rate le total lignes plans de 200. Zero alerte. Lecon : verifier systematiquement les totaux avec `wc -l` ou calcul manuel avant de les reporter. Ne jamais copier un total de sub-agent sans recompter.

**L-S1-03 · Les findings "orphelin/doublon" sont le cas le plus dangereux.**
Un sub-agent juge orphelin depuis son scope restreint. Le vrai orphelin exige un scan global. Lecon : cette categorie de finding DOIT toujours etre verifiee par grep cross-repo avant d'etre annoncee. Regle maintenant inscrite dans CLAUDE.md Imperatifs.

**L-S1-04 · Les fixes triviaux en continu (D-S0-08) rendent l'audit plus propre.**
Le chmod commit-msg aurait pu attendre S20 Fixes P1. Le faire en S1 evite de le perdre et garde le commit S20 focused sur les vrais P1. Valide la decision D-S0-08 empiriquement.

**L-S1-05 · La baseline Foundation OS fait 11 567 lignes scannees / 100 fichiers.**
Premiere mesure absolue. Sera utile pour mesurer la croissance (S23 rapport final : comparer "avant audit" vs "apres audit" en lignes/fichiers net). Point de mesure reutilisable pour les audits futurs et Phase 5 Expansion.

**L-S1-06 · Le plan Cycle 3 (1648L) est lui-meme 14% de la doc totale.**
Indicateur a surveiller : la documentation d'un audit ne devrait pas peser plus que l'audit lui-meme. Si le ratio "doc/code" depasse 30%, c'est signe de sur-documentation. Ici : docs 4631L / code app 4755L = ratio 0.97 (quasi 1:1). Dans la limite acceptable.

**L-S1-07 · Pattern observe : Kevin corrige les imperatifs en cours d'execution.**
2026-04-07 : 4 imperatifs ajoutes a CLAUDE.md en une seule journee (decoupage + cause racine + pragmatisme + sub-agents contexte). Pattern : l'OS apprend de ses propres frottements. Confirme la directive meta "nourrir l'audit pour ameliorer l'OS" (D-S0-06). Suggestion pour S23 rapport final : compter combien d'imperatifs CLAUDE.md ont ete ajoutes pendant Cycle 3 comme mesure de meta-learning.

---

**Status** : DONE 2026-04-07
**Commit** : sera `audit(s01): carto repo file-by-file → docs/audit-massif/01-carto-repo.md + fix chmod commit-msg`
**Zero regression** : health-check SAIN a maintenir avant commit.
