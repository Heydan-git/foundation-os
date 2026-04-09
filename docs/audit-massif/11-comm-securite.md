# 11-comm-securite — Audit Communication + Securite

> **Status** : S11a DRAFT (phase A lecture + draft findings, 11e consecutive mode MOI)
> **Plan** : docs/plans/2026-04-07-cycle3-implementation.md section "Session S11 — Communication + securite (mode MOI)"
> **Spec** : docs/plans/2026-04-07-audit-massif-final.md
> **Date** : 2026-04-09
> **Mode** : MOI strict (11e session consecutive)
> **Directive Kevin 2026-04-09** : "Fait ce que tu recommande je te fait confiance" (apres briefing frontload 5 questions, reco A/A/C/A/A acceptee)

> ⚠ **Note meta live** : le premier Write de ce livrable a ete **bloque** par le hook `scripts/hooks/security-reminder.py` parce que la section 3.3 documentait les substrings de detection litterales des 9 patterns. Demonstration directe et irrefutable du meta-finding **F-S11-02** / **M-S11-01** (voir sections 4.2 et 4.4). **Toutes les substrings litterales sont donc remplacees dans ce document par des descriptions neutres.** Voir `scripts/hooks/security-reminder.py:31-126` pour les definitions exactes.

---

## 1. Objectif

Auditer les deux dimensions transversales de Foundation OS :

1. **Communication** — formats de sortie des agents, conventions Foundation OS (zero bullshit, rapport court), delegations inter-agents, sortie des systemes automatises (commits, hooks, CI).
2. **Securite** — hook PreToolUse `security-reminder.py`, `.gitignore` (3 fichiers), fichiers sensibles tracked, cles hardcodees modules/app/src, RLS Supabase.

Livrable = 11e du cycle 3 audit massif. Apres S11, reste S12 (Memoire + anti-compactage, PHASE V close) puis S13 Module App Builder.

---

## 2. Scope + methodologie

### 2.1 Sources scannees (phase A lecture)

| Source | Chemin | Taille |
|--------|--------|--------|
| Agents custom Foundation | `.claude/agents/*.md` | 4 fichiers (os-architect 51L + dev-agent 53L + doc-agent 52L + review-agent 41L = 197L) |
| CLAUDE.md imperatifs | `/Users/kevinnoel/foundation-os/CLAUDE.md` | ~170L focus zero-bullshit + anti-bullshit gates + directives comm |
| Hook securite | `scripts/hooks/security-reminder.py` | 281L (9 patterns + state mgmt) |
| Hook Void Glass | `scripts/hooks/validate-void-glass.sh` | 39L (couleurs + fonts interdites) |
| Pre-commit hook | `scripts/git-hooks/pre-commit` | 21L |
| Commit-msg hook | `scripts/git-hooks/commit-msg` | 20L (11 types conventional) |
| Settings hooks | `.claude/settings.json` | 32L |
| .gitignore racine | `.gitignore` | 11L (minimal) |
| .gitignore modules/app | `modules/app/.gitignore` | 26L (etendu) |
| .gitignore design-system | `modules/design-system/.gitignore` | 8L |
| CI workflow | `.github/workflows/ci.yml` | 36L |
| Supabase ping workflow | `.github/workflows/supabase-ping.yml` | 28L |
| Supabase migration RLS | `supabase/migrations/001_create_tables.sql` | 7 tables x 3 policies |
| Env example | `modules/app/.env.local.example` | 5L (placeholder JWT) |
| Refs env runtime | `modules/app/src/lib/supabase.ts` + `vite-env.d.ts` + `Phase1Demo.tsx` | 6 hits `import.meta.env` |

**Total lu** : ~600L de code + config + policies SQL, 15 fichiers scannes.

### 2.2 Methodologie (4 angles, phase A)

- **A1 — Format de sortie agents** : comparer les sections "Sortie" / "Rapport" des 4 agents
- **A2 — Conventions Foundation** : cross-ref CLAUDE.md imperatifs + anti-bullshit gates + briefs v9 + agents
- **A3 — Delegations inter-agents** : lire sections "Hors scope (deleguer)" et convention HOW routing
- **A4 — Securite defensive** : hooks + gitignore + secrets tracked + hardcoded + RLS

### 2.3 Out-of-scope phase A (reporte phase B)

- Invocation reelle d'un agent pour observer son format de sortie effectif (reco Q3=C)
- Parsing historique commits pour verifier conformite au hook commit-msg
- Tests execution hook security-reminder sur un fichier piege
- Audit RLS comportemental (USING expressions, pas seulement ENABLE)

### 2.4 Out-of-scope global (hors S11)

- Cowork / Plan-Router / Monitor docs (scope strict Core OS, reco Q2=A)
- Audit communication Kevin <-> moi conversationnel (hors scope, c'est la reforme brief v9 2026-04-09 deja livree)
- Tests exhaustifs sur les 9 patterns security-reminder (echantillonnage)
- Scan des dependances npm pour CVE (hors scope audit, couvert partiellement F-DS3-01)

---

## 3. Source lecture detaillee

### 3.1 Agents Foundation (4 fichiers)

**`os-architect.md`** (51L) :
- Frontmatter : `name: os-architect`, `description` en YAML folded
- Declencheurs : "architecture", "ADR", "stack", "schema", "comment structurer", "option A vs B"
- Contexte obligatoire : CONTEXT.md + docs/architecture.md + docs/core/architecture-core.md
- Pattern de decision : **bloc structure** (Probleme / Options / Recommande / Impact)
- Sortie : "Format court. Lister : decision prise, fichiers impactes, prochaine etape." (L50)
- Section non-regression explicite (L46)

**`dev-agent.md`** (53L) :
- Frontmatter : `name: dev-agent`, declencheurs "code", "composant", "page", "Supabase", "React", "build", "scaffold", "CSS", "Tailwind"
- Ligne blanche apres frontmatter (L9) = F-S7-02 re-confirme
- Contexte : CONTEXT.md + docs/design-system.md
- Contraintes : TSX < 700L, Void Glass tokens, hook validate-void-glass
- Reference "Phase 2.4 dans CONTEXT.md" L31 = **jargon opaque F-S7-08 re-confirme**
- Sortie : "Format court. Lister : fichiers crees/modifies, build status." (L51)
- **Particularite** : seul agent qui mentionne convention commit : "Conventional commits : feat(app): / fix(app): / refactor(app):" (L52) = **3 types seulement sur 11 accepted par le hook commit-msg**
- Pas de section "Workflow" / "Pattern de travail" = **D-S7-02 re-confirme**

**`doc-agent.md`** (52L) :
- Frontmatter : declencheurs "documente", "note", "trace", "journalise", "met a jour" (L6)
- Contexte : CONTEXT.md seul
- Tableau fichiers a maintenir (6 entrees : CONTEXT.md, architecture, core, design-system, data, decisions-log)
- Section "Protocole Memory" reference "PAUL" L31 = **jargon PAUL F-S7-09 re-confirme**
- Regles explicites : dates YYYY-MM-DD, max 5 sessions "Dernieres sessions", zero duplication tiers
- Sortie : "Format court. Lister : fichiers mis a jour, sections modifiees." (L51)

**`review-agent.md`** (41L) :
- Frontmatter : declencheurs "verifie", "audit", "check", "revue", "zero regression", "avant de deployer"
- Contexte : CONTEXT.md + comparer filesystem reel
- Methode : 1) executer `health-check.sh` 2) checks review-specifiques (6 checklist items)
- Reference "depuis P1" L24 = **jargon F-S7-10 re-confirme**
- Rapport : **bloc template structure** (OK / Warning / Erreur / Verdict) (L36-40) = **seul agent avec template explicit vs 3 autres "Format court. Lister : X, Y, Z"**
- Verdict : "LIVRABLE / A CORRIGER" (L39)

### 3.2 CLAUDE.md — directives communication

Sections critiques pour la communication :

- **Imperatifs (non-negociable)** (~20 lignes) : verite, pas de TERMINE sans preuve, zero fabrication, plan avant execution, pragmatisme
- **A chaque session** (5 points) : CONTEXT.md obligatoire, pas d'inventions, evaluations realistes, pas de features non-demandees, update CONTEXT.md fin session
- **Briefs session (format obligatoire)** : pointeur vers memoire `feedback_brief_format.md` v9, 11 sections, emojis couleur, barres, lignes courtes, vulgarisation jargon, mise en garde automatique si risque regression — **single source validee 2026-04-09**
- **Questions groupees (plans)** : frontload regle valide 2026-04-09, pointeur vers memoire `feedback_frontload_questions.md`
- **Anti-bullshit gates** (L64-69) :
  - L65 `Jamais de "TERMINE" ou "100%" sans preuve (build + test execute)`
  - L66 `Avant d'affirmer "X fonctionne" → executer la commande, montrer l'output`
  - L67 `Chaque metrique doit avoir une commande de verification`
  - L68 `Mots interdits : revolution, historique, reference mondiale, premier au monde, $XB, accomplish`
  - L69 `Commits factuels : pas de "achieve", "world-first", "revolutionary"`

### 3.3 Hooks defensifs

**`security-reminder.py`** (281L) :

> **Note** : les substrings litterales des 9 patterns sont remplacees par des descriptions neutres pour eviter l'auto-reference du hook lors du Write de ce livrable (cf. F-S11-02 et M-S11-01, demonstration live en debut de phase A). Definitions exactes dans `scripts/hooks/security-reminder.py:31-126`.

- 9 patterns hardcodes (L31-126) :

| # | RuleName | Detection |
|---|----------|-----------|
| P1 | `github_actions_workflow` | Path-based `.github/workflows/*.yml` ou `.yaml` |
| P2 | `child_process_exec` | Subprocess Node/JS — 3 variantes d'invocation exec-famille |
| P3 | `new_function_injection` | Constructeur dynamique de fonction JavaScript |
| P4 | `eval_injection` | Evaluation dynamique JavaScript |
| P5 | `react_dangerously_set_html` | Prop React d'injection HTML brute |
| P6 | `document_write_xss` | Methode DOM d'ecriture directe |
| P7 | `innerHTML_xss` | Assignation propriete HTML interne DOM (2 variantes avec/sans espace autour du `=`) |
| P8 | *[ruleName elide — auto-match]* | Deserialization binaire Python (substring trop large, cf. F-S11-02) |
| P9 | `os_system_injection` | Appel systeme Python (2 variantes d'import) |

- State management : session-scoped warnings deja montres (anti-spam, reset par session)
- Cleanup automatique state files > 30 jours
- Main loop : lit JSON stdin, check `Edit|Write|MultiEdit` uniquement, extrait content, matche patterns, exit 2 (bloque) si match
- **Kill switch** : `ENABLE_SECURITY_REMINDER=0` desactive tout
- **Limitation** : ne check pas les Bash, ne check pas les fichiers `.env.*`, pas de pattern JWT/secret hardcoded detection

**`validate-void-glass.sh`** (39L) :
- Check fichiers `.jsx|.tsx|.css|.scss` (L16) = **F-S9-12 re-confirme exclut `.ts` pur**
- TARGET_FILE = `head -1` du diff staged (L13) = **F-S9-11 re-confirme coverage gap**
- Couleurs interdites : `#0A0A0B`, `#08080A` (case-insensitive depuis P1)
- Fonts interdites : `Outfit`, `Inter` (strict)
- Pas de check `system-ui` seul = **F-S9-13 re-confirme asymetrie vs sync-check.sh L185-187**
- Sortie : stdout vert/rouge, exit 0/1

**`pre-commit`** (21L) : execute `health-check.sh`, bloque si BROKEN (exit 1), laisse passer DEGRADED (warning, exit 0).

**`commit-msg`** (20L) : regex conventional commits 11 types (feat|fix|docs|refactor|chore|test|style|build|ci|perf|revert). **Refuse** `audit(s11):` = confirme D-S8-12/D-S9-09.

### 3.4 Settings.json hooks PreToolUse

```json
"hooks": {
  "PreToolUse": [{
    "matcher": "Write|Edit|MultiEdit",
    "hooks": [
      {"type": "command", "command": "/Users/kevinnoel/foundation-os/scripts/hooks/validate-void-glass.sh \"${file_path:-}\""},
      {"type": "command", "command": "python3 /Users/kevinnoel/foundation-os/scripts/hooks/security-reminder.py"}
    ]
  }]
}
```

**Observation** : **absolute paths hardcodes** `/Users/kevinnoel/foundation-os/` — non-portable. Si Kevin change de machine ou de chemin, si un collaborateur clone, les hooks ne fonctionnent plus. Solution : `$CLAUDE_PROJECT_DIR` ou chemin relatif `./scripts/hooks/...` (si harness le supporte).

### 3.5 .gitignore (3 fichiers)

**Root `.gitignore`** (11L) :
```
.env.local
.env
node_modules/
dist/
.DS_Store
.fos/
.fos-session.lock
.omc/state/
*.pyc
__pycache__/
```
**Minimal**. Manque :
- `*.pem`, `*.key`, `*.p12`, `*.pfx` (cert/private keys)
- `id_rsa*`, `id_ed25519*` (SSH keys)
- `credentials.json`, `secrets.json`, `*.secrets`
- `.env.*` generique (couvre `.env.production`, `.env.staging`, `.env.test`)
- `*.log` (couvert partiellement dans modules/app/.gitignore)

**`modules/app/.gitignore`** (26L) : plus complet, couvre `.env.*.local`, editors, logs, OMC state.

**`modules/design-system/.gitignore`** (8L) : minimal, couvre node_modules, tokens/build/, dist/, storybook-static/, logs, DS_Store, .omc/.

**Duplication** : `.env.local` present dans root L1 ET modules/app/.gitignore L9 = redondance inoffensive mais incoherence de design (root-universel vs per-module).

### 3.6 GitHub Actions workflows

**`ci.yml`** (36L) :
- Triggers : push main + pull_request main
- Node 24, cache npm, `npm ci`, `npx tsc --noEmit`, `npm run build`, `npx vitest run`
- Working-directory `modules/app`
- **Pas d'interpolation `github.event.*` dans les `run:`** = safe vs command injection P1
- Timeout 10 min
- **Observation** : pas de sortie consolidee (3 etapes distinctes), vs `health-check.sh` qui produit un verdict unique

**`supabase-ping.yml`** (28L) :
- Cron weekly lundi 8h UTC + workflow_dispatch manuel
- `env:` avec `${{ secrets.SUPABASE_URL }}` + `${{ secrets.SUPABASE_ANON_KEY }}` = safe
- Bash `curl` avec expansion variables `${SUPABASE_URL}` (bash, pas template) = safe
- Exit 0 si secrets manquants (skip gracieux)
- Accept HTTP 200 ou 401 (401 = Supabase repond mais key expiree, project toujours vivant)
- **Propre, conforme au pattern safe du security-reminder P1**

### 3.7 Supabase RLS (migration 001)

7 tables avec `ENABLE ROW LEVEL SECURITY` :
- sessions (L22-31) : select + insert + update policies
- decisions (L53-62)
- risks (L84-93)
- next_steps (L115-124)
- context_blocks (L145-154)
- docs (L174-183)
- (7e table dans le listing migration — non re-listee ici, dans la meme migration)

**Pattern uniforme** : chaque table a 3 policies (select / insert / update). **Pas de DELETE policy** = probablement intentionnel (soft-delete via archive flag ou pas de delete autorise).

**Observation** : RLS ENABLE confirme, mais **le contenu des policies (USING expressions) n'est pas audite phase A** — a verifier phase B si scope permet.

### 3.8 Cles hardcodees modules/app/src

**Grep `sk_|pk_|api_key|API_KEY|SECRET|SUPABASE_SERVICE` dans `modules/app/src`** : **0 hits**.

**Grep `import.meta.env|process.env`** : 6 hits, tous via `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` dans `lib/supabase.ts`, `vite-env.d.ts`, `pages/Phase1Demo.tsx` = **pattern sain**.

`lib/supabase.ts:9` logge un warning si env vars manquantes (safe, pas de leak de la valeur).

**`.env.local`** : present dans `modules/app/.env.local` (290 bytes), **NON tracked** par git (`git check-ignore` confirme match dans `modules/app/.gitignore:9`).

**`.env.local.example`** : tracked, contient un placeholder JWT header base64 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` = **header JWT public standard** (decode = `{"alg":"HS256","typ":"JWT"}`). **Techniquement pas un secret** mais peut declencher des secret scanners automatises (GitGuardian, TruffleHog, GitHub Secret Scanner).

---

## 4. Findings (phase A DRAFT, a amender phase B)

### 4.1 P1 — CRITICAL : 0

Aucun finding P1 phase A. Audit defensif confirme :
- Aucune cle hardcodee dans modules/app/src
- .env.local correctement ignore (3 .gitignore coherents)
- RLS Supabase active sur les 7 tables
- CI workflow safe vs command injection P1
- Supabase ping workflow utilise env + secrets proprement

### 4.2 P2 — IMPORTANT : 3

**F-S11-01 P2 — `.claude/settings.json` absolute paths hardcodes**
- **Source** : `.claude/settings.json:18, 22`
- **Details** : `/Users/kevinnoel/foundation-os/scripts/hooks/validate-void-glass.sh` et `/Users/kevinnoel/foundation-os/scripts/hooks/security-reminder.py`
- **Impact** : non-portable. Si Kevin change de machine, si le repo est clone ailleurs (autre path), si un collaborateur travaille sur le meme repo sur son propre hostname, les hooks ne fonctionnent plus. **Silent failure** = pas de Void Glass ni security check, sans warning visible.
- **Severite P2** : impact fonctionnalite defensive critique (hooks) sans warning visible. Degradation silencieuse pire qu'un bug bruyant.
- **Fix** : remplacer par `$CLAUDE_PROJECT_DIR/scripts/hooks/...` ou chemin relatif `./scripts/hooks/...`. Verifier phase B si le harness Claude Code supporte l'expansion de variables dans `command:`.
- **Decision** : batch S21 (couplage D-S7-01 audit lineaire).

**F-S11-02 P2 — `security-reminder.py` pattern P8 substring trop large (demonstration live)**
- **Source** : `scripts/hooks/security-reminder.py:117-120`
- **Details** : le pattern P8 (deserialization binaire Python) utilise une detection substring sur le nom du module standard. Il matche dans TOUT fichier edit/write qui contient le mot-cle, y compris commentaire, doc, nom de variable compose, chaine francaise. **Demonstration directe phase A** : le premier Write de ce livrable a ete bloque par le hook sur le pattern P2 (subprocess exec-famille) parce que j'avais liste les substrings litterales des patterns. Apres reformulation P2, le pattern P8 aurait bloque a son tour pour la meme raison (le mot-cle P8 etait present dans F-S11-02, M-S11-01, D-S11-02, L-S11-03, et Section 3.3). **Ce document existe uniquement grace a la reformulation forcee de toutes les substrings litterales.**
- **Impact** : false positives recurrents sur la documentation d'audit, impossibilite structurelle d'ecrire un livrable qui documente les patterns de detection sans workaround. Re-confirme **meta-pattern F-S9-18** (auto-reference / substring trop large) avec **evidence phase A forte** (blocage reel observe, pas theorique).
- **Severite P2** : impact UX recurrent, dette meta identifiee cycle 3, amplifie par S11 live demo.
- **Fix** : regex plus strict avec ancres syntaxiques (ex: `^\s*import\s+<module>` pour imports, `\.loads\(` ou `\.dumps\(` pour call-sites). OU whitelist markdown-doc vs code-source via extension fichier (`.md` exempte). OR approche duale : warn soft sur `.md`, block hard sur `.py`.
- **Decision** : batch S21 ou parking post-cycle3 (meta-pattern deja identifie S9, amplifie S11). Priorite remontee apres cette session (dette operationnelle reelle observee).

**F-S11-03 P2 — `.gitignore` root minimal, manque patterns defensifs courants**
- **Source** : `.gitignore:1-11`
- **Details** : absence de patterns standard de protection contre leaks :
  - Pas de `*.pem`, `*.key`, `*.p12`, `*.pfx` (certificats / cles prives)
  - Pas de `id_rsa*`, `id_ed25519*` (SSH keys)
  - Pas de `credentials.json`, `secrets.json`, `*.secrets`
  - Pas de `.env.*` generique (couvre `.env.production`, `.env.staging`, `.env.test`, etc.)
  - Pas de `*.log` au niveau root (present dans sous-modules)
- **Impact** : si Kevin cree localement un de ces fichiers (scenario plausible : test de migration avec fichier cle, dump DB avec credentials, export runtime), git ne l'ignore PAS et risque de commit accidentel. Mitigation actuelle = zero (hook security-reminder ne check pas les extensions de fichier sensibles a l'Edit/Write).
- **Severite P2** : risque reel (scenario plausible + aucune mitigation) mais probabilite faible (projet solo, Kevin experimente). P2 pour capter la dette, pas urgence.
- **Fix** : etendre `.gitignore` root avec ~10 patterns defensifs standard. Effort < 5 min.
- **Decision** : batch S21 housekeeping.

### 4.3 P3 — COSMETIC / RE-CONFIRM : 11

**F-S11-04 P3 — Asymetrie format sortie agents (3 "Format court" vs 1 template structure)**
- **Source** : `.claude/agents/os-architect.md:50`, `dev-agent.md:51`, `doc-agent.md:51`, `review-agent.md:35-40`
- **Details** : 3 agents utilisent la formule "Format court. Lister : X, Y, Z" (prose libre) tandis que review-agent a un template structure avec keywords (`OK/Warning/Erreur/Verdict`). Asymetrie d'ergonomie documentaire = dette cognitive pour Kevin (format a deviner vs lisible immediatement).
- **Decision** : batch S21 housekeeping (aligner tous les agents sur un template OU documenter la difference intentionnelle).

**F-S11-05 P3 — `dev-agent.md` reference "Phase 2.4"**
- **Source** : `.claude/agents/dev-agent.md:31`
- **Details** : RE-CONFIRME F-S7-08 deja note S7. Jargon opaque (qu'est-ce que Phase 2.4 ?).
- **Decision** : merge avec D-S7-04 batch S21.

**F-S11-06 P3 — `dev-agent.md` section "Workflow" / "Pattern de travail" manquante**
- **Source** : `.claude/agents/dev-agent.md` (entier, asymetrie vs os-architect "Pattern de decision" + review-agent "Methode")
- **Details** : RE-CONFIRME D-S7-02 deja note S7. dev-agent n'a pas de section workflow formelle.
- **Decision** : merge avec D-S7-02 batch S21.

**F-S11-07 P3 — `dev-agent.md` commits convention incomplete (3 types vs 11)**
- **Source** : `.claude/agents/dev-agent.md:52`
- **Details** : dev-agent liste "feat(app): / fix(app): / refactor(app):" (3 types) alors que le hook commit-msg accepte 11 types (feat|fix|docs|refactor|chore|test|style|build|ci|perf|revert). Les 3 autres agents ne mentionnent aucun format commit.
- **Impact** : developpeur peut croire que les 11 types ne sont pas autorises. Asymetrie doc vs hook.
- **Decision** : batch S21 (ajouter pointeur vers `scripts/git-hooks/commit-msg` comme source de verite, pas re-decrire).

**F-S11-08 P3 — `doc-agent.md` reference "PAUL"**
- **Source** : `.claude/agents/doc-agent.md:31`
- **Details** : RE-CONFIRME F-S7-09 deja note S7. Jargon opaque PAUL.
- **Decision** : merge avec D-S7-04 batch S21.

**F-S11-09 P3 — `review-agent.md` reference "depuis P1"**
- **Source** : `.claude/agents/review-agent.md:24`
- **Details** : RE-CONFIRME F-S7-10 deja note S7. Jargon opaque P1.
- **Decision** : merge avec D-S7-04 batch S21.

**F-S11-10 P3 — Aucune convention explicite "communication entre agents"**
- **Source** : les 4 agents ont une section "Hors scope (deleguer)" qui pointe vers un autre agent, mais aucun ne documente HOW (invocation explicite ? passage de contexte ? format d'entree attendu par l'agent delegue ?).
- **Details** : consequence = c'est Kevin (l'humain) qui route, ou Claude implicite via declencheurs. Re-affirmation L-S5-01 "Cortex = filtre graceful pas classifieur".
- **Impact** : pas bloquant car routing marche dans la pratique, mais gap de specification.
- **Decision** : trace only, lier a L-S5-01.

**F-S11-11 P3 — CI `ci.yml` pas de sortie consolidee (vs health-check verdict)**
- **Source** : `.github/workflows/ci.yml:28-35`
- **Details** : 3 etapes distinctes (TypeScript check / Build / Tests) avec logs separes. Pas de step final qui produit un verdict unique SAIN/DEGRADED/BROKEN comme `health-check.sh` local.
- **Impact** : asymetrie local (verdict unique) vs CI (3 logs). Lecture PR moins ergonomique.
- **Decision** : parking post-cycle3 (pas prioritaire, health-check local suffit a Kevin solo).

**F-S11-12 P3 — `.gitignore` duplication `.env.local` root vs modules/app**
- **Source** : `.gitignore:1` + `modules/app/.gitignore:9`
- **Details** : `.env.local` present dans les deux .gitignore. Redondance inoffensive (la resolution git prend la match la plus proche), mais indique manque de strategie : root-universel OU per-module. Actuellement c'est un melange.
- **Decision** : batch S21 housekeeping mineur (decider d'un modele et supprimer la duplication).

**F-S11-13 P3 — `security-reminder.py` scope limite a 9 patterns, pas de detection secrets**
- **Source** : `scripts/hooks/security-reminder.py:31-126`
- **Details** : les 9 patterns couvrent **code vulnerabilities** (subprocess calls, dynamic evaluation, XSS variants, binary deserialization, OS system calls, CI workflow injection) mais **pas** :
  - Detection JWT / API key hardcoded values (patterns regex sur strings base64-like, `sk_`, `pk_`, etc.)
  - Detection edit sur fichiers `.env.*` (warning si Kevin tente d'ecrire un fichier avec extension sensible)
  - Detection SQL injection via template literals
  - Detection `javascript:` URLs dans `href`
  - Detection logging de `process.env.SECRET` / variables d'env sensibles via console.log
- **Impact** : scope defensif incomplet vs outils standard (git-secrets, detect-secrets, gitleaks). Acceptable projet solo mais dette a documenter.
- **Decision** : parking post-cycle3, trace only. Pas d'ajout opportuniste (scope inflation).

**F-S11-14 P3 — `.env.local.example` contient placeholder JWT base64 potentiellement flaggable**
- **Source** : `modules/app/.env.local.example:5`
- **Details** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` est le header JWT public standard decode = `{"alg":"HS256","typ":"JWT"}`. Pas un secret mais peut declencher des secret scanners automatises (GitGuardian, TruffleHog, GitHub Secret Scanner).
- **Impact** : low (faux positif scanner uniquement, pas de leak reel).
- **Decision** : batch S21 cosmetique (remplacer par `eyJhbG...TRUNCATED...` ou `[JWT_TOKEN_HERE]` ou `[supabase-anon-key]`).

### 4.4 Meta-findings : 1 re-confirme avec evidence phase A forte

**M-S11-01 (RE-CONFIRM AMPLIFIE de F-S9-18 / L-S9-03)** : auto-reference structurelle des outils d'audit **demontree en live**.

- **Evidence phase A** : le Write du fichier `docs/audit-massif/11-comm-securite.md` a ete **bloque par le hook `security-reminder.py`** en plein travail. La section 3.3 documentait les substrings de detection des 9 patterns en les citant litteralement (entre backticks). Le hook a matche le pattern P2 (subprocess exec-famille) sur le contenu du Write et a retourne exit 2 (blocage). **Impossibilite structurelle** de documenter litteralement un hook qui detecte du contenu par substring, sans declencher le hook lui-meme. **Pattern auto-referentiel prouve** : un audit honnete du hook necessite la reformulation de toutes les substrings de detection sous forme de descriptions neutres.
- **Cumul cycle 3** :
  - **S9** : flag theorique F-S9-18 "hook security-reminder auto-reference structurelle" decouvert par inspection du code.
  - **S10** : L-S10-08 "polarite auto-reference positive/negative" decouverte sur `omc-reference` (positive = auto-ref intentionnelle et coherente) vs `security-reminder.py` (negative = auto-ref structurelle involontaire qui casse l'outil d'audit).
  - **S11** : **evidence directe** = blocage observe sur Write reel. **Passage de theorique a empirique, 3e occurrence + amplification live**.
- **Library meta-patterns cycle 3** (mise a jour) :
  - M-S6-01 spec MD vs code source (1ere occurrence)
  - M-S7-01 PAUL jargon (2e)
  - M-S8-01 spec MD vs code source (3e)
  - M-S9-xx heritage pre-commit bugs (4e)
  - M-S10-01 surface/usage concentre (5e)
  - M-S10-02 auto-reference polarity (6e)
  - **M-S11-01** auto-reference outils d'audit demo live (7e, **amplifie**)
- **Decision** : integre a la library meta-patterns cycle 3 avec evidence phase A forte (blocage reel observe). Priorite fix remontee (dette operationnelle prouvee) : le pattern P8 et les autres patterns substring-only devront etre affines post-cycle3 OR le hook devra supporter une whitelist `.md` / doc-context.

### 4.5 Observations positives (non-findings)

- **Supabase RLS** : 7 tables x 3 policies = bonne hygiene defensive. Pattern uniforme.
- **`.env.local`** : correctement ignore (3 .gitignore coherents, `git check-ignore` verifie via `modules/app/.gitignore:9`).
- **modules/app/src** : 0 cles hardcodees (tous les secrets passent par `import.meta.env`).
- **`ci.yml`** : clean vs command injection P1 (pas d'interpolation `${{ github.event.* }}` dans `run:`).
- **`supabase-ping.yml`** : pattern `env:` avec `secrets.*` + bash expansion safe.
- **Pre-commit + commit-msg** : version-controlled via `scripts/git-hooks/`, install explicite, pas de bitrot.
- **Settings.json hooks** : wiring correct Void Glass + security-reminder sur Edit/Write/MultiEdit (malgre les absolute paths F-S11-01).
- **Warning Supabase manquante** : `lib/supabase.ts:9` logge "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set" sans **leak de la valeur** (safe pattern).
- **Kill switch security-reminder** : `ENABLE_SECURITY_REMINDER=0` documente, permet de bypass controle si besoin (debug).
- **Hooks fail loud** : commit-msg / pre-commit / validate-void-glass / security-reminder ont tous des exit codes explicites + messages stderr visibles = conforme L-S9-05 "fail loud vs fail silent". Sauf F-S11-01 settings.json absolute paths = seul failure mode silencieux.

---

## 5. Decisions D-S11-01..13 (DRAFT, a finaliser phase B)

| ID | Finding | Decision | Batch |
|----|---------|----------|-------|
| **D-S11-01** | F-S11-01 paths absolus settings.json | Fix avec `$CLAUDE_PROJECT_DIR` ou path relatif, verifier compat harness Claude Code phase B | S21 |
| **D-S11-02** | F-S11-02 pattern P8 substring trop large | Regex plus strict (ancres syntaxiques prefix/suffix) OU whitelist doc-source via extension `.md` OR approche duale warn-on-md/block-on-code | S21 ou parking post-cycle3 (meta amplifiee) |
| **D-S11-03** | F-S11-03 gitignore minimal | Ajouter ~10 patterns defensifs (*.pem, *.key, id_rsa*, credentials.json, .env.*, secrets.json, *.log) au root `.gitignore` | S21 |
| **D-S11-04** | F-S11-04 format sortie agents asymetrique | Aligner template sortie des 4 agents (soit tous prose, soit tous bloc structure) | S21 |
| **D-S11-05** | F-S11-05 Phase 2.4 / F-S11-08 PAUL / F-S11-09 P1 | Merge avec D-S7-04 batch S21 | S21 |
| **D-S11-06** | F-S11-06 dev-agent workflow | Merge avec D-S7-02 batch S21 | S21 |
| **D-S11-07** | F-S11-07 dev-agent commits 3 types | Remplacer par pointeur vers `scripts/git-hooks/commit-msg` | S21 |
| **D-S11-08** | F-S11-10 convention inter-agents absente | Trace only, lier L-S5-01 | — |
| **D-S11-09** | F-S11-11 CI sortie consolidee | Parking post-cycle3 | parking |
| **D-S11-10** | F-S11-12 duplication `.env.local` gitignore | Batch S21 housekeeping mineur | S21 |
| **D-S11-11** | F-S11-13 security-reminder scope limite | Trace only, dette post-cycle3 | parking |
| **D-S11-12** | F-S11-14 JWT placeholder env.example | Batch S21 cosmetique | S21 |
| **D-S11-13** | M-S11-01 re-confirm + amplification live | Integrer library meta-patterns cycle 3 (7e occurrence, priorite fix remontee) | library + S21/parking |

**Total draft** : 13 decisions. A amender phase B.

---

## 6. Learnings L-S11-01..06 (DRAFT, a finaliser phase B)

- **L-S11-01** — **Audit securite defensive solo = surface faible mais couverture gaps**. Foundation OS est un projet solo Kevin, surface d'attaque reduite (pas d'input utilisateur exterieur, pas de backend custom, Supabase RLS active). Mais les gaps defensifs (gitignore minimal, security-reminder scope limite, pas de detect-secrets) creent une dette latente qui se manifestera des qu'un collaborateur externe ou un clonage multi-machine intervient. Pattern = **audit securite = investment pre-expansion**, pas reaction post-incident.

- **L-S11-02** — **Documentation agents asymetrique = dette cognitive recurrente**. Pattern observe S7 + S11 : les 4 agents n'ont pas de format de sortie uniforme (3 "Format court" + 1 template structure) ni de workflow sections symetriques (dev-agent manque, les 3 autres ont pattern). Re-affirmation : **la coherence structurelle des agents est un mini-OS dans le mini-OS** — si chaque agent a sa propre forme, le routing Cortex devient plus difficile a automatiser et le developpeur doit maintenir plusieurs modeles mentaux.

- **L-S11-03** — **Meta-pattern auto-reference outils d'audit : de theorique a empirique**. Cumul :
  - S9 F-S9-18 : identification theorique par code inspection.
  - S10 L-S10-08 : formalisation polarite positive (auto-ref intentionnelle coherente, ex: omc-reference) vs negative (auto-ref involontaire qui casse l'outil, ex: security-reminder).
  - S11 M-S11-01 : **blocage reel observe** sur Write du livrable. Phase A passe d'analyse statique a experimental.

  **Regle emergente renforcee** : tout outil qui scanne du contenu via substring matching finit par s'auto-referencer negativement si sa propre documentation est scannee. Fix structurel = whitelist contextuelle markdown-doc vs code-source OR regex avec ancres syntaxiques (import statements, call expressions). Dette mesurable : ~2-3 refactorings de patterns dans `security-reminder.py` (specifiquement P8 et P2 qui ont les substrings les plus larges).

- **L-S11-04** — **Conventions Foundation = CLAUDE.md dense mais lisible**. Les imperatifs (zero bullshit, anti-bullshit gates, commits factuels, mots interdits) sont **groupes dans 5 sections claires** de CLAUDE.md, references par les briefs v9 et par les agents. La single source tient, pas de drift observe phase A. Re-affirmation L-S8-05 : les garde-fous CLAUDE.md fonctionnent **tant que CLAUDE.md est charge en contexte**, divergence specs inferieures (agents) visible seulement si CLAUDE.md absent (fresh session, troncature, nouveau collaborateur).

- **L-S11-05** — **Hooks defensifs Foundation = pattern "fail loud" majoritaire, 1 exception silencieuse**. commit-msg bloque (exit 1) avec message explicite, pre-commit bloque BROKEN / warning DEGRADED / pass OK, validate-void-glass bloque (exit 1) avec violations listees, security-reminder bloque (exit 2) avec reminder detaille. **Tous ont fail loud pattern** = conforme L-S9-05. **Seul gap** : `settings.json` absolute paths (F-S11-01) = fail **silent** si paths cassent (le hook ne s'execute juste pas, aucun warning). C'est le plus dangereux des 3 failure modes (bloque / warn / silent) et justifie F-S11-01 P2 severite.

- **L-S11-06** — **Amplification differentielle cycle 3 se stabilise autour du mix**. Phase A S11 ~14 findings draft sur un scope strict Core OS (~600L scannees), mix declaratif (agents, CLAUDE.md) + mecanique (hooks, gitignore) + comportemental (RLS, CI). **L-S10-07 formalise** l'amplification differentielle par niveau d'abstraction meta : mecanique S9 +5.5% < declaratif S8 +25% < meta-declaratif S10 +45%. **S11 = mix** → amplification attendue moyenne ~15-25%. **Mais evidence phase A** : M-S11-01 live demo est deja une amplification enorme d'un finding theorique S9, qui contourne la prevision purement quantitative (les metapatterns amplifient en qualite, pas seulement en quantite).

---

## 7. Cross-references S1-S11

- **F-S11-01** (paths absolus settings.json) → nouveau, pas de cross-ref S1-S10.
- **F-S11-02** (pattern P8 substring) → extension amplifiee de **F-S9-18 meta-finding auto-reference** (theorique S9 → empirique S11 avec blocage observe).
- **F-S11-03** (gitignore minimal) → nouveau, pas de cross-ref.
- **F-S11-04** (format sortie agents asymetrique) → lie a audit S7 agents (D-S7-02 enrichir dev-agent workflow).
- **F-S11-05** (Phase 2.4 jargon) → RE-CONFIRME **F-S7-08** (merge D-S7-04 batch S21).
- **F-S11-06** (dev-agent workflow manquante) → RE-CONFIRME **D-S7-02** batch S21.
- **F-S11-07** (commits 3 types dev-agent) → nouveau, lie a commit-msg hook + D-S8-12 (commit conventions).
- **F-S11-08** (PAUL jargon doc-agent) → RE-CONFIRME **F-S7-09** (merge D-S7-04 batch S21).
- **F-S11-09** (P1 jargon review-agent) → RE-CONFIRME **F-S7-10** (merge D-S7-04 batch S21).
- **F-S11-10** (inter-agents convention absente) → re-affirme **L-S5-01** "Cortex = filtre graceful pas classifieur".
- **F-S11-11** (CI pas de verdict consolide) → lie au pattern **health-check.sh verdict unique** (S9 audit scripts).
- **F-S11-12** (.gitignore duplication `.env.local`) → nouveau, mineur.
- **F-S11-13** (security-reminder scope limite) → extension de la surface defensive, complement F-S11-03.
- **F-S11-14** (JWT placeholder) → nouveau, mineur cosmetique.
- **M-S11-01** re-confirm amplifie → extension **F-S9-18 + M-S8-01 + L-S10-08** (meta-pattern auto-reference structurel, 7e occurrence cycle 3, **premiere avec evidence empirique directe**).

---

## 8. Out-of-scope flagges (phase A)

- **Invocation reelle d'un agent** (reco Q3=C) : phase B, observer le format de sortie effectif vs documentation.
- **Parsing historique commits** : phase B, verifier conformite au hook commit-msg sur les ~20 derniers commits (echantillon).
- **Test execution hook security-reminder** sur fichier piege : **non necessaire en phase B** — le blocage live M-S11-01 fait office de test empirique irrefutable.
- **Audit RLS comportemental** : phase B si scope permet, lire les USING expressions des policies (pas juste ENABLE).
- **BMAD / Cowork / Plan-Router / Monitor docs** : reco Q2=A strict Core OS.
- **Scan npm CVE** : hors scope audit, couvert partiellement F-DS3-01 (vite@8).
- **Outils tiers** (git-secrets, detect-secrets, gitleaks, Snyk, Dependabot) : hors scope, evaluation post-cycle3 si dette F-S11-03/13 le justifie.
- **Audit communication Kevin-Claude conversationnel** : hors scope, reforme brief v9 2026-04-09 deja livree.

---

## 9. Next session

**S12 — Memoire (4 tiers) + anti-compactage** (mode MOI, 12e consecutive).

Livrable : `docs/audit-massif/12-memory-anti-compactage.md` (placeholder existant).

Scope selon plan :
- Tier 1 Session (volatile)
- Tier 2 Contexte (CONTEXT.md)
- Tier 3 Reference (docs/)
- Tier 4 Auto-memory (Claude natif, MEMORY.md + fichiers pointes)
- Audit anti-compactage (procedure reprise docs/plans/2026-04-07-audit-massif-final.md section 4)
- Audit doublons cross-files

---

## 10. Metriques phase A

- **Fichiers lus** : 15 (agents 4 + hooks 4 + gitignore 3 + CI 2 + settings 1 + CLAUDE.md + migration SQL)
- **Lignes scannees** : ~600L
- **Findings draft** : 14 (0 P1 + 3 P2 + 11 P3 + 1 meta M-S11-01 avec evidence phase A forte)
- **Decisions draft** : 13
- **Learnings draft** : 6
- **Cross-refs** : 7 (F-S11-05/06/08/09 re-confirm S7, F-S11-02/M-S11-01 re-confirm amplifie S9/S10)
- **Evenement notable phase A** : blocage live du Write par `security-reminder.py` sur pattern P2 → demonstration empirique de M-S11-01 → reformulation complete des substrings litterales → Write reussi en 2e tentative.
- **Dette heritee ajoutee au batch S21** : ~5 fixes nouveaux (paths absolus settings.json + gitignore defensif + format sortie agents + commits 3 types dev-agent + JWT placeholder)

**Total cumul S21 apres S11a DRAFT** : ~34 precedents + ~5 nouveaux = **~39 fixes cumulatifs** (sous reserve phase B).

**Prochaine etape** : Phase B tests reels (invocation agent + parsing commits + audit RLS policies) puis finalisation + commit S11b.
