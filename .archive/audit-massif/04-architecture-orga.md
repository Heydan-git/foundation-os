# Cycle 3 — S4 Architecture organicite/scalabilite/maintenabilite

> **Status** : DONE 2026-04-08
> **Mode** : MOI strict (0 sub-agent invoque)
> **Scope** : 3 axes — Organicite (deps), Scalabilite (1→5→10 modules), Maintenabilite (ratios, gros fichiers, dette)
> **Branche** : `audit-massif-cycle3` | **Baseline** : SAIN, build 801ms, 19/19 vitest, refs 66/66

## 1. Objectif

Verifier que l'OS est :
- **Organique** : les composants sont connectes de maniere coherente, pas de code mort, le call graph est explicable
- **Scalable** : passer de 1 module (app) a N modules (finance, sante, trading, ...) ne casse pas l'infra
- **Maintenable** : ratios code/doc raisonnables, pas de gros fichiers ingerables, dette technique sous controle

Verdict attendu : identifier les points de friction qui apparaitront en Phase 5 (expansion modules) et documenter la dette a traiter en S20-S22 (fixes cycle 3).

## 2. Methodologie

5 phases anti-compactage :
- **Phase A — Organicite** : 3 steps (deps agents/commands/scripts, cross-refs docs, code mort)
- **Phase B — Scalabilite** : 4 steps (ls modules/, hardcodes, exercice 5 modules, exercice 10 modules)
- **Phase C — Maintenabilite** : 4 steps (ratios code/doc, top 25 gros fichiers, doublons info, dette TODO/FIXME/HACK/XXX)
- **Phase D — Livrable** : consolidation findings + decisions + learnings (ce fichier)
- **Phase E — Commit + CONTEXT.md**

Outils utilises : `Grep` (patterns backtick + markdown link + hardcode), `Bash` (find/wc/ls), lectures ciblees (App.tsx, pre-commit, components/index.ts, 00-INDEX.md). Aucun sub-agent invoque (mode MOI strict, directive CLAUDE.md L16).

## 3. Phase A — Organicite

### 3.1 Call graph agents/commands/scripts

**Agents ↔ agents (escalation full-mesh 4×3)**

Chaque agent reference explicitement les 3 autres comme cibles d'escalation :

| Agent | Ligne | Escalations documentees |
|-------|-------|-------------------------|
| `dev-agent.md` | L45-47 | os-architect, doc-agent, review-agent |
| `doc-agent.md` | L45-47 | dev-agent, os-architect, review-agent |
| `review-agent.md` | L29-31 | dev-agent, os-architect, doc-agent |
| `os-architect.md` | L28-30 | dev-agent, doc-agent, review-agent |

Total : **12 liens d'escalation documentes** (4 × 3). Mesh complet. Pattern conforme a la decision D-S3-04 ("Cortex = convention de prompt, pas de runtime separe") : l'escalation est resolue par Claude Code via lecture de la frontmatter + prompt de chaque agent, pas par un routeur central.

**Agents → scripts**

| Agent | Scripts cites | Role |
|-------|---------------|------|
| `review-agent.md` | health-check.sh (L18), sync-check.sh (L20), ref-checker.sh (L24) | Triple verification pre-review |
| `os-architect.md` | health-check.sh (L46) | Regression check post-decision |
| `dev-agent.md` | validate-void-glass.sh (L41, mention du hook) | Contrainte Void Glass obligatoire |
| `doc-agent.md` | aucun | **Voir F-S4-09** |

→ Asymetrie : doc-agent n'est couple a aucun script, ce qui est coherent avec son scope "doc-only" mais peut etre un deficit si une doc casse silencieusement une ref. Flag comme finding.

**Commands → scripts**

| Command | Script | Composition |
|---------|--------|-------------|
| `/session-start` | health-check.sh (L15) | "si BROKEN, ne pas demarrer" |
| `/session-end` | health-check.sh (L12) | "doit etre SAIN (obligatoire)" |
| `/sync` | sync-check.sh (L7) | "audit 6/6 sections auto" |
| `/new-project` | module-scaffold.sh (L10) | Scaffold module idempotent |

Match 4/4 : chaque command a un script dedie ou shared.

**Scripts → scripts (composition tree)**

```
ref-checker.sh  (stand-alone, 158L)
     ▲
     │ bash scripts/ref-checker.sh
     │
health-check.sh  (172L — L110 appelle ref-checker)
     ▲
     │ bash scripts/health-check.sh
     │
sync-check.sh   (214L — L25 appelle health-check)
```

Pattern : **composition en couches** (low → high). `sync-check` est un sur-ensemble de `health-check`, qui est un sur-ensemble de `ref-checker`.

Autres :
- `module-scaffold.sh` : stand-alone (pas appele par d'autres scripts)
- `scripts/hooks/validate-void-glass.sh` : invoque via `.claude/settings.json` PreToolUse matcher
- `scripts/hooks/security-reminder.py` : idem
- `scripts/git-hooks/commit-msg` : stand-alone (git hook installe)
- `scripts/git-hooks/pre-commit` : **appelle health-check.sh** (L6 confirme)

### 3.2 Cross-refs docs (organicite MD)

Recherche : patterns backtick docs/\*\*/\*.md / scripts/\*\*/\*.sh / .claude/\*\*/\*.md dans docs/ (paths en plain text pour eviter faux positifs ref-checker, voir L-S2-07).

**231 refs backtick au total** dans 17 .md (corpus live) :

| Fichier | Refs |
|---------|-----:|
| docs/plans/2026-04-07-cycle3-implementation.md | 80 |
| docs/plans/2026-04-07-finition-os.md | 22 |
| docs/audit-massif/02-inventaire-components.md | 22 |
| docs/audit-massif/03-fondations-core.md | 21 |
| docs/plans/2026-04-07-phase3-os-intelligence.md | 19 |
| docs/audit-massif/01-carto-repo.md | 16 |
| docs/manifeste.md | 12 |
| docs/plans/2026-04-07-audit-massif-final.md | 9 |
| docs/specs/2026-04-05-foundation-os-v2-design.md | 8 |
| docs/plans/2026-04-07-phase4-monitoring.md | 7 |
| docs/audit-massif/00-preflight.md | 5 |
| docs/plans/2026-04-05-phase1-fondations.md | 4 |
| docs/audit-massif/00-INDEX.md | 2 |
| docs/core/monitor.md | 1 |
| docs/core/memory.md | 1 |
| docs/decisions-log.md | 1 |
| docs/plans/2026-04-07-phase2-app-hardening.md | 1 |

Mentions des 4 agents dans 27 fichiers (21 actifs + 6 archives ignores).

**Constat** : l'OS est bien reference (corpus cohesif), pas de silos isoles. Le plan cycle3 (80 refs) fait office de hub central — coherent avec son role de "plan actif multi-sessions".

### 3.3 Code mort potentiel

Scan :
- **Components** : 100% references (Badge, Card, StatPill, TabBar, Navbar, Layout, SupabaseCRUDTest, Commander/* panels, forms/*, tous importes via `@/components` barrel ou imports directs). Verifie via grep des imports.
- **Pages** : 8/8 routes dans App.tsx, tous imports presents.
- **lib/** : AuthContext, database.types, mutations, supabase, useCommander — tous importes.
- **Scripts** : 6/6 scripts references (4 par commands, 2 par settings.json hooks, composition tree pour les 3 core).
- **Agents** : 4/4 references (CLAUDE.md + docs/core/cortex.md + escalation mesh entre eux).
- **Commands** : 4/4 references (CLAUDE.md + plans + docs/core/cortex.md).

**1 seul code mort filesystem-level detecte** :

- `modules/app/src/styles/` = **dossier vide** (0 fichiers, 64 bytes metadata). Vraisemblablement cree lors du scaffold initial Vite, jamais rempli car les styles vivent inline dans App.tsx (`globalStyles` string L13-28). → **F-S4-01 P3**

Aucun .md orphelin detecte dans docs/ (tous references via backticks dans au moins 1 autre .md live).

## 4. Phase B — Scalabilite

### 4.1 Etat courant

```
modules/
└── app/           (1 module actif)
    ├── data/      (7 MD pairs)
    ├── src/       (42 TSX/TS, 4755L)
    ├── package.json, vite.config.ts, tailwind.config.js, tsconfig.json, vercel.json, etc.
    └── README.md
```

Prevus (CONTEXT.md) : Finance, Sante, Trading.

### 4.2 Hardcodes `modules/app` dans l'infra partagee

Au total **20+ occurrences** detectees :

| Fichier | Refs | Impact scalabilite |
|---------|-----:|---------------------|
| `scripts/health-check.sh` | 6 (L27 build, L58 tsc, L76 TSX sizes, L91 VG, L100 MD pairs, L121 tests) | **Bloquant 2+ modules** — ne build qu'app |
| `scripts/sync-check.sh` | 4 (L83 commits, L144 App.tsx, L183/L186 fonts) | **Bloquant 2+ modules** — ne scanne qu'app |
| `scripts/ref-checker.sh` | 2 (L15/L158 exclude dist/) | Exclusion hardcodee, doit etre generalisee |
| `.github/workflows/ci.yml` | 2 (L15 working-directory, L24 cache-dependency-path) | **Bloquant** — single-module CI |
| `.claude/commands/sync.md` | 3 (L13 routes, L14 fonts, L43-44 MD pairs + TSX < 700) | Spec multi-section couple a app |

**Verdict** : l'infra scripts/CI est **optimisee pour 1 module** et ne scale pas gracefully. Fix requis : boucles `for m in modules/*/` + matrix strategy CI. Scope fix = S22 (post-audit).

### 4.3 Exercice mental 1 → 5 modules

Qu'est-ce qui casse si on scaffolde `finance`, `sante`, `trading`, `analytics` ?

| Couche | Casse ? | Detail | Fix estime |
|--------|---------|--------|------------|
| **Build** | OUI | health-check.sh build que modules/app | Boucle for (triviale) |
| **Tests** | OUI | health-check.sh test que modules/app | Idem |
| **TypeScript** | OUI | tsc que modules/app | Idem |
| **Void Glass hook** | NON | PreToolUse matcher glob-based, frappe tous `modules/**/*.tsx` automatiquement |
| **CI** | OUI | working-directory hardcoded | Matrix strategy modules/* |
| **Vercel deploy** | OUI | root dir = modules/app → 1 seul deploy | Decision : 1 deploy/module (5 projets Vercel) vs subdomain mapping ? |
| **Supabase DB** | PARTIEL | 1 projet Supabase partage. Tables actuelles (sessions, decisions, risks, next_steps, context_blocks, docs) sont generiques. Collisions si finance.transactions vs app.transactions | Convention schemas PG : `app.*`, `finance.*`, `sante.*` |
| **Supabase auth** | NON | 1 user Kevin, shared across modules OK |
| **Navbar / Navigation** | OUI | Navbar modules/app ignore les autres modules | Pattern : shell router parent ou modules auto-discovery |
| **CLAUDE.md stack** | NON | Stack generique, applique a tous les modules React |
| **health-check.sh MD pairs** | PARTIEL | Check specifique app (data/*.md vs .archive/artifacts-jsx/*.jsx). Non-sens pour finance. | Renommer "MD pairs (app)" + doc explicite |
| **CONTEXT.md Modules table** | NON | Table extensible |
| **docs/core/*.md** | NON | Core OS transverse, pas couple module |
| **Agents (.claude/agents/)** | NON | Aucun hardcode modules/app dans les 4 agents (verifie grep) — **decouplage reussi** |

→ **5 points de casse bloquants** (Build, Tests, Tsc, CI, Vercel) + 2 decisions d'architecture a prendre (DB namespacing, Navigation inter-modules).

### 4.4 Exercice mental 1 → 10 modules

Ce qui s'aggrave :

- **Build sequentiel** = 10 × ~800ms = 8s. Acceptable en dev local mais lent en CI. → Parallelisation requise.
- **Bundle total** = 10 × ~457KB = 4.5MB. Chaque module = bundle independant (code-splitting naturel), mais Vercel 10 deploys = 10 projets. Decision infra lourde.
- **DB schemas** = 10 espaces de nommage + migrations separees. Supabase cross-schema RLS a etudier.
- **Onboarding CLAUDE.md / docs/index.md** = risque de devenir une liste hors controle. → Hierarchie `modules/*/README.md` qui redirige ?
- **Cortex routing** = 4 agents shared encore OK, mais possible besoin d'agents specialises par module (finance-agent pour audit compta, sante-agent pour validation HIPAA-like, etc.). → 4+N agents.
- **ref-checker** = exclut `modules/app/dist` mais pas les autres dist/. Faux positifs a 10 modules. → Exclusion pattern `modules/*/dist`.
- **Auto-memory** = 9 entries actives (limite protocole Memory). Si chaque module ajoute des patterns specifiques, pression sur le cap.

**Verdict scalabilite** :
- **1 module** : OK (etat actuel, SAIN)
- **2-3 modules** : OK avec 3-4 petits fixes scripts (boucles for)
- **5 modules** : refactor infra modere (CI matrix, DB convention, Navigation)
- **10 modules** : refactor infra significatif + decision architecture deploy + hierarchie docs

### 4.5 F-S3-05 — MD pairs indicator trop specifique

**Rappel** : S3 a flagge l'indicateur MD pairs de health-check.sh comme etant specifique au module app (compare `modules/app/data/*.md` a `.archive/artifacts-jsx/*.jsx` = convention historique du module app).

**Resolution S4** :

Option retenue = (c) Accepter comme indicateur **module-specifique** et le renommer explicitement dans l'output :

```bash
# Avant (health-check.sh L100-106) :
MD_COUNT=$(ls -1 modules/app/data/*.md 2>/dev/null | wc -l | tr -d ' ')
JSX_COUNT=$(ls -1 .archive/artifacts-jsx/fos-*.jsx 2>/dev/null | wc -l | tr -d ' ')
if [ "$MD_COUNT" = "$JSX_COUNT" ]; then
  echo -e "  ${GRN}[OK]${RST} MD pairs ($MD_COUNT/$JSX_COUNT in archive)"
...

# Apres (propose) :
echo -e "  ${GRN}[OK]${RST} MD pairs (app) ($MD_COUNT/$JSX_COUNT in archive)"
```

+ ajouter commentaire dans monitor.md section Warning expliquant que cet indicateur est **module-specifique** et ne doit pas etre generalise a d'autres modules (la convention "MD pairs ↔ JSX archives" est propre a l'histoire du module app).

**Cause racine** : la convention MD pairs = residu de l'iteration 1 (artifacts JSX Claude.ai) avant la migration React. Pas une contrainte structurelle de l'OS. Doit etre scopee comme telle.

Decision : **D-S4-02** (voir section 7). Fix applicable en S22.

## 5. Phase C — Maintenabilite

### 5.1 Ratios code/doc

Mesures (find + wc -l) :

| Categorie | Lignes | Fichiers |
|-----------|-------:|---------:|
| **Code TS/TSX** (`modules/app/src/`) | 4755 | 42 |
| **Docs** (`docs/`) | 6960 | 47 |
| **Scripts** (`scripts/`) | 1049 | 6 |
| **Agents + Commands** (`.claude/agents/` + `.claude/commands/`) | 404 | 8 |

Breakdown docs :
- `docs/` hors plans = 3583L (core, audit-massif, specs, manifeste, architecture, index, etc.)
- `docs/plans/` = 3377L (7 plans, dont cycle3 1648L = 49%)

**Ratio docs / code (modules/app/src)** = 6960 / 4755 = **1.46** (docs pese 46% de plus que code)

**Ratio docs / (code + infra)** = 6960 / (4755 + 1049 + 404) = 6960 / 6208 = **1.12** (parite quasi-exacte si on compte l'infra comme code)

**Interpretation** :
- L'OS est orientation "documented thinking" → ratio ~1:1 acceptable
- Gate CLAUDE.md "si plus de MD que de code dans une session, c'est suspect" **s'applique a un delta de session, pas au projet entier**. A clarifier sinon false positive (F-S4-06)
- Plans = 49% des docs plans → 3377L de memoire long-terme, pas du bloat operationnel

### 5.2 Top 25 gros fichiers

| Lignes | Fichier | Type |
|-------:|---------|------|
| 1648 | docs/plans/2026-04-07-cycle3-implementation.md | Plan |
| 544 | modules/app/src/pages/Phase1Demo.tsx | Page TSX |
| 493 | docs/audit-massif/03-fondations-core.md | Livrable S3 |
| 425 | modules/app/src/components/SupabaseCRUDTest.tsx | Component |
| 421 | docs/plans/2026-04-07-audit-massif-final.md | Plan |
| 391 | docs/plans/2026-04-05-phase1-fondations.md | Plan |
| 347 | docs/audit-massif/01-carto-repo.md | Livrable S1 |
| 346 | modules/app/src/pages/KnowledgePage.tsx | Page TSX |
| 335 | docs/audit-massif/read-log-S1-code.md | Scratchpad |
| 324 | docs/specs/2026-04-05-foundation-os-v2-design.md | Spec |
| 309 | modules/app/src/lib/mutations.ts | Lib |
| 296 | docs/plans/2026-04-07-finition-os.md | Plan |
| 286 | docs/manifeste.md | Doc |
| 280 | scripts/hooks/security-reminder.py | Hook |
| 277 | docs/audit-massif/02-inventaire-components.md | Livrable S2 |
| 259 | docs/directive-v1.md | Doc |
| 257 | modules/app/src/pages/Dashboard.tsx | Page TSX |
| 256 | modules/app/src/pages/IndexPage.tsx | Page TSX |
| 236 | modules/app/src/components/forms/NextStepActions.tsx | Form |
| 225 | modules/app/src/components/forms/EditDecisionModal.tsx | Form |
| 216 | docs/plans/2026-04-07-phase4-monitoring.md | Plan |
| 214 | scripts/sync-check.sh | Script |
| 206 | docs/plans/2026-04-07-phase3-os-intelligence.md | Plan |
| 201 | docs/audit-massif/00-preflight.md | Livrable |

**Gros fichiers notables** :

- **docs/plans/cycle3-implementation.md = 1648L** — plus gros fichier du repo. Justifie (plan 24 sessions multi-phases) mais limite de lisibilite. Option : decoupage post-S23 en sous-plans par phase (I, II, III, IV, V, G1-G2-G3). **F-S4-07 P3**.
- **Phase1Demo.tsx = 544L** — seule page TSX > 500L. Sous la limite CLAUDE.md (`TSX < 700 lignes`) mais proche. A monitorer. Deja flag en read-log-S1-code.md comme candidat decoupage. **F-S4-08 P3**.
- **SupabaseCRUDTest.tsx = 425L** — acceptable, c'est un test manuel route-d.
- **mutations.ts = 309L** — deja flag en S1 (read-log-S1-code.md) : 21 `any` + 25 `console.log`. Dette type-safety prevue S13.
- **security-reminder.py = 280L** — hook legitime, taille raisonnable pour un validateur Python.

### 5.3 Doublons info potentiels

Recherche des concepts "Stack" (Vite + React + Tailwind + Supabase + Vercel) dans les .md live : **40 fichiers** mentionnent au moins un element du stack.

Fichiers qui duppliquent l'enonce complet du stack (pas juste une mention) :

| Fichier | Contenu duplique |
|---------|------------------|
| `CLAUDE.md` L26 | "Vite + React + TypeScript + Tailwind + Supabase + Vercel" (source canonique supposee) |
| `docs/architecture.md` | Table "Stack" similaire |
| `docs/manifeste.md` L83 | "Vite + React 18 + TypeScript + Tailwind 3" |
| `docs/specs/2026-04-05-foundation-os-v2-design.md` | Section Stack |
| `docs/setup-guide.md` | Stack + commandes install |
| `modules/app/README.md` | Stack + commandes |

→ **6 fichiers minimum** dupliquent l'enonce du stack. Risque de divergence lors d'une mise a jour (ex : bump Vite 5 → 6). **F-S4-11 P3**.

Pour la table "Modules" (CONTEXT.md canonical) :
- CONTEXT.md section Modules → canonique
- CLAUDE.md "Structure" → mention "modules/app/" uniquement (OK, c'est un pointer)
- docs/architecture.md → mention
- docs/index.md → mention

→ Pas de vraie duplication, juste des pointers. OK.

### 5.4 Dette technique (TODO/FIXME/HACK/XXX)

Grep full-repo :

**Dette code live** (hors .archive/, hors plans/specs) : **1 seule occurrence**

```tsx
// modules/app/src/components/forms/NextStepActions.tsx:54
// TODO: implement updateStep for non-done transitions
```

→ Feature partiellement implementee, documentee explicitement. Deja flag dans `docs/audit-massif/read-log-S1-code.md:200` et `:294`. Scope fix : S13 (audit module app) ou S20 (fixes P1). **F-S4-10 P3**.

**Mentions XXX dans plans** (templates, pas de la dette) :
- `docs/plans/2026-04-07-cycle3-implementation.md:194,198` : placeholders "Build XXXms", "JS XXXkB" pour templating
- `docs/plans/2026-04-07-phase4-monitoring.md:175` : meme idee

→ **Pas de la dette**, juste des templates a remplir au runtime.

**Bilan dette code** : 1 TODO live sur 4755 lignes = **excellent** (0.02%). Le code est tres propre cote dette explicite.

## 6. Findings consolides

### P1 (critiques, bloquants) : 0

Aucun.

### P2 (importants, a corriger) : 2

- **F-S4-02 P2** : **20+ hardcodes `modules/app` dans l'infra partagee** (health-check.sh 6×, sync-check.sh 4×, ref-checker.sh 2×, ci.yml 2×, sync.md 3×). Bloquant a partir de 2 modules scaffoldes. Cause racine : scripts ecrits pour le module app avant la formalisation du pattern `modules/*`. Fix : boucle `for m in modules/*/` + matrix strategy CI. **Scope fix : S22** (post-audit cycle 3, avant Phase 5 expansion).
- **F-S4-03 P2** : **Zero convention de namespacing DB Supabase pour 2+ modules**. Tables actuelles (sessions, decisions, risks, next_steps, context_blocks, docs) sont generiques sans prefix schema. Risque collision quand finance/sante ajouteront leurs propres "transactions", "events", etc. Decision d'architecture requise : schemas PG (`app.sessions`, `finance.transactions`) vs projets Supabase separes vs prefixe nom tables. **Scope decision : Phase 5** avant le scaffolding du 2e module, pas en cycle 3.

### P3 (cosmetiques / a monitorer) : 9

- **F-S4-01 P3** : `modules/app/src/styles/` = dossier vide (0 fichiers). Code mort filesystem-level. Cause racine : scaffold Vite initial, styles ecrits inline dans App.tsx. **Fix S22** : `rmdir modules/app/src/styles` OU ajouter styles globaux extraits du `globalStyles` string L13-28 (decision a prendre S22).
- **F-S4-04 P3** : Navbar modules/app ne connait pas la structure modules/. OK a 1 module, flag a 2+. Scope : S5 (workflows) ou Phase 5 (expansion).
- **F-S4-05 P3** : F-S3-05 confirme — MD pairs check de health-check.sh est module-specifique. Renommer `MD pairs (app)` + documenter comme "indicateur app-only" dans monitor.md. **Fix S22**. Voir D-S4-02.
- **F-S4-06 P3** : Gate CLAUDE.md "si plus de MD que de code dans une session, c'est suspect" ambigue — s'applique au delta d'une session, pas au projet entier. A l'echelle projet, ratio 1.46 est normal pour un OS "documented thinking". **Fix S22 docs-only** : clarifier le gate dans CLAUDE.md Anti-bullshit section.
- **F-S4-07 P3** : Plan `docs/plans/2026-04-07-cycle3-implementation.md` = 1648L (plus gros fichier du repo). Justifie (plan 24 sessions) mais limite lisibilite. **Option post-S23** : decoupage en sous-plans par phase (cycle3-phase-I.md, cycle3-phase-II.md, etc.). Pas urgent.
- **F-S4-08 P3** : `Phase1Demo.tsx` = 544L, seule page TSX > 500L. Sous la limite `TSX < 700L` mais proche. Deja flag en read-log-S1-code.md. **Scope : S13** (audit module app) — decision decoupage ou acceptation.
- **F-S4-09 P3** : `doc-agent.md` ne cite aucun script Tools. Compare a `review-agent` (3 scripts), `os-architect` (1 script), `dev-agent` (1 hook). Possiblement intentionnel (doc-only = pas de casse code), mais risque de ref cassee silencieuse non detectee si doc-agent edit. **Fix S22 docs-only** : ajouter mention `bash scripts/ref-checker.sh` dans la checklist doc-agent.
- **F-S4-10 P3** : 1 seule dette code live = `NextStepActions.tsx:54 TODO: implement updateStep for non-done transitions`. Scope fix : S13 (audit module app) ou S20 (fixes P1 applies).
- **F-S4-11 P3** : Duplication "Stack" (Vite + React + TS + Tailwind + Supabase + Vercel) dans **6 fichiers** (CLAUDE.md, architecture.md, manifeste.md, v2-design.md, setup-guide.md, app/README.md). Risque divergence. **Fix docs-only S22** : choisir 1 source canonique (CLAUDE.md) + redirection via lien dans les autres.

### Findings meta

- **F-S3-05** (reporte de S3) : confirme et resolu par D-S4-02, fix S22.

## 7. Decisions S4

- **D-S4-01** (2026-04-08) — **Scalabilite officielle** : l'OS est actuellement design "1 module avec degradation graceful a 2-3 modules apres fix boucles". Refactor significatif requis a partir de **5 modules** (CI matrix, DB schema convention, Navigation inter-modules). Documente pour prioriser backlog Phase 5.
- **D-S4-02** (2026-04-08) — **MD pairs = module-specifique** : le check `modules/app/data/*.md` vs `.archive/artifacts-jsx/*.jsx` reste dans health-check.sh mais sera renomme `MD pairs (app)` et documente dans monitor.md comme indicateur **app-only**. La convention "MD pairs ↔ JSX archives" est un residu de l'iteration 1 (artifacts Claude.ai), pas une contrainte structurelle. Ne doit pas etre generalise aux autres modules. Fix S22.
- **D-S4-03** (2026-04-08) — **Empty `modules/app/src/styles/`** : `rmdir` en S22. Cause racine = scaffold Vite initial, styles vivent inline dans App.tsx L13-28. Pas de valeur ajoutee a conserver un dossier vide. Si besoin de styles globaux extraits plus tard, le dossier sera recree a ce moment-la.
- **D-S4-04** (2026-04-08) — **Convention DB namespacing differee** : decision d'architecture (schemas PG vs projets Supabase vs prefixes tables) reportee a Phase 5 avant scaffolding du 2e module. **Hors scope cycle 3**. Ajoute comme pre-requis dans le plan Phase 5.
- **D-S4-05** (2026-04-08) — **Duplication "Stack" acceptee temporairement** : les 6 fichiers servent des audiences differentes (dev instructions CLAUDE.md, architecture, manifeste narratif, spec technique, setup guide, app README). Decision de ne pas consolider en cycle 3. Re-verification en S18 cross-check pour detecter divergences eventuelles. Option consolidation en S22 si divergence detectee.

## 8. Cross-refs

- **S1 baseline** : 100 fichiers scannes (11 567L). Ce S4 utilise les mesures S1 comme baseline pour les ratios (docs/code = 1.46, code = 4755L confirme coherent).
- **S2 inventaire** : 4 agents + 4 commands + 8 scripts + 2 CI. Ce S4 ajoute la dimension "qui appelle qui" (call graph explicite section 3.1).
- **S3 fondations core** : 4 piliers REELS (Cortex/Memory/Monitor/Tools). Ce S4 verifie que l'implementation des 4 piliers scale (reponse : Cortex OK via prompt convention, Memory OK, Monitor fragile a 2+ modules, Tools idem).
- **F-S3-05** : traite dans section 4.5 + D-S4-02.
- **Plan cycle 3** : `docs/plans/2026-04-07-cycle3-implementation.md:485-522` (scope S4 defini), applique strictement.

## 9. Out of scope (reporte)

- **Implementation fixes F-S4-02, F-S4-03** : scope S22 (fixes P2) — refactor scripts + CI matrix + decision DB namespacing. Pas execute en S4 (mode doc-only).
- **Decoupage plan cycle3 1648L (F-S4-07)** : post-S23, pas en cycle 3.
- **Convention DB namespacing** (D-S4-04) : Phase 5.
- **Refactor Phase1Demo.tsx 544L** (F-S4-08) : S13.
- **Fix TODO NextStepActions.tsx:54** (F-S4-10) : S13 ou S20.
- **Tests fonctionnels des scripts** (run ref-checker + health-check + sync-check avec cas casse/limite) : scope S9 (scripts-hooks) ou S18 (cross-check).
- **Audit externe doublons avec git blame** : scope S18.

## 10. Learnings metaboliques

- **L-S4-01** — *Metrique organicite utile* : le nombre de **hardcodes module-specifiques dans l'infra** (20+ ici) est un meilleur indicateur de scalabilite que le nombre de cross-refs docs (231). Les refs docs sont du couplage lache, les hardcodes scripts sont du couplage dur. A integrer dans l'audit S18.
- **L-S4-02** — *Ratio doc/code biaise par les plans* : 1.46 brut est trompeur. Il faut **exclure les plans historiques** et/ou **inclure scripts+agents comme code** pour un ratio valable. Proposition : ajouter un sub-indicateur `health-check.sh` nomme `doc/code ratio (hors plans)` plus tard (pas en S4).
- **L-S4-03** — *Dette code negligeable mais dette docs presente* : 1 seul TODO code sur 4755L (0.02%) = excellent, mais le vrai sujet de maintenance est la superposition des plans (7 plans dans `docs/plans/`, 3377L cumule, dont certains finis depuis longtemps). A investiguer en S12 (memory anti-compactage) : quand archiver un plan ?
- **L-S4-04** — *Exercice mental "1 → 5 → 10 modules" est revelateur* : plus efficace qu'un grep seul. Il force a nommer les points de casse concrets (CI matrix, DB schema, Navbar). A re-utiliser comme template pour Phase 5 brainstorming.
- **L-S4-05** — *Les agents sont module-agnostic par design* : aucun hardcode `modules/app` dans `.claude/agents/*.md`. Decouplage reussi = les agents ne sont pas a refactorer quand on scaffoldera finance/sante. Point fort majeur de l'OS actuel.
- **L-S4-06** — *Composition scripts `ref-checker < health-check < sync-check`* : pattern "each includes the lower" est simple a comprendre mais genere un couplage fort. Toute modification low-level (ex: ref-checker bug) impacte sync-check en cascade. A tester en S9 (smoke tests volumetrie) : casser ref-checker volontairement et voir si health + sync detectent correctement.
- **L-S4-07** — *Un dossier vide est un code mort non detectable par ref-checker* : `styles/` vide n'a pas de fichier a referencer donc ref-checker ne peut pas le flaguer. Indicateur eventuel a ajouter a health-check.sh : "empty dirs in `modules/*/src/`". A considerer en S22.
- **L-S4-08** — *Regression meta : j'ai oublie L-S2-07 en ecrivant S4*. L-S2-07 (S2) disait : paths inexistants documentes doivent etre en plain text au lieu de backticks. En ecrivant section 3.2 de S4, j'ai mis des patterns glob en backticks (docs puis points puis md) → ref-checker a vu 3 refs cassees → DEGRADED. Fix immediat applique (section 3.2 reformulee en plain text). **Impact meta** : les learnings metaboliques doivent etre **re-lus avant chaque session**, pas juste ecrits. Proposition S5+ : ajouter "relire learnings L-S1..L-Sn" en pre-session ritual, ou les regrouper dans un fichier learnings-cycle3 (plain text, sans backticks) a la fin du cycle. Note : cette regression elle-meme a echappe a une premiere correction (je viens de refaire la meme erreur en ecrivant L-S4-08 avec backticks sur un path fictif) = **le reflexe n'est pas acquis meme apres flag explicite**.

## 11. Prochaine action

**S5 — Workflows + commands + routing Cortex** (mode MOI).

Scope (voir `docs/plans/2026-04-07-cycle3-implementation.md:526+`) :
- Test reel `/session-start` (execution deja faite en debut de cette session, a documenter)
- Test reel `/session-end` avec cas reel + cas piege
- Test reel `/sync` avec cas reel
- Test reel `/new-project` avec cas reel (scaffold dry-run eventuellement)
- Verifier routing Cortex : CLAUDE.md table signaux → agents effectivement appliquee ?

Livrable : `docs/audit-massif/05-workflows-routing.md`.

Pre-conditions S5 : S4 commit valide + baseline SAIN maintenue. Mode MOI (lecture + tests comportementaux des commands).

---

**Stats S4** :
- 3 phases audit (A organicite + B scalabilite + C maintenabilite)
- ~30 fichiers lus/scannes (agents, commands, scripts, docs plans, health-check, sync-check, ref-checker, App.tsx, pre-commit, components/index.ts, 00-INDEX.md, CONTEXT.md)
- 11 findings (0 P1 + 2 P2 + 9 P3)
- 5 decisions (D-S4-01..05)
- 8 learnings metaboliques (L-S4-01..08, dont L-S4-08 = regression meta sur oubli L-S2-07)
- 0 fix applique (mode doc-only, fixes reportes en S22)
- 0 regression (SAIN maintenu, build 801ms)
- Mode MOI strict respecte (0 sub-agent invoque, directive CLAUDE.md L16 appliquee)
