# 09-scripts-hooks — Audit Scripts + hooks (9) deep + tests reels

> **Status** : S9a DONE (2026-04-09) — Phase A lecture + audit statique. S9b pending (tests reels).
> **Mode** : MOI (9e session consecutive mode strict)
> **Plan** : docs/plans/2026-04-07-cycle3-implementation.md section "Session S9 — Scripts + hooks (9) deep + tests"
> **Livrable precedent** : docs/audit-massif/08-commands.md (S8, DONE 2026-04-09)

---

## 1. Objectif

Audit deep des 9 scripts Foundation OS :

- `scripts/health-check.sh` (171L) — Monitor central
- `scripts/sync-check.sh` (214L) — auto-audit 6/6 sections
- `scripts/ref-checker.sh` (178L) — broken refs detector full-repo
- `scripts/module-scaffold.sh` (168L) — scaffold module polyglot bash+Python
- `scripts/session-lock.sh` (145L) — cowork anti-collision
- `scripts/hooks/validate-void-glass.sh` (38L) — pre-tool hook Void Glass
- `scripts/hooks/security-reminder.py` (280L) — pre-tool hook security
- `scripts/git-hooks/pre-commit` (20L) — git hook pre-commit
- `scripts/git-hooks/commit-msg` (19L) — git hook commit message format

**Total** : 1233 lignes sur 9 scripts (vs 223L sur 4 commands en S8 = +453%).

Verifier sur 4 angles (bug evident, idempotent, exit codes, output format) + tests reels d'invocation + livrable findings/decisions/learnings conforme pattern S1-S8.

## 2. Methodologie

Decoupage anti-compactage en **2 phases** (pattern S8a/S8b valide cycle3) :

| Phase | Scope | Commit |
|-------|-------|--------|
| **S9a** | Lecture line-by-line 9 scripts + audit 4 angles (statique) + draft findings | `docs(audit): s09a lecture + audit 9 scripts -- draft findings` (ce commit) |
| **S9b** | Tests reels invocation (non-destructifs : --help, no-args, status, dry patterns) + lecture des scripts destructifs sans execution + findings consolides + decisions + learnings + commit final | `docs(audit): s09 scripts + hooks (9) deep + tests reels` (a venir) |

**Scope tests reels S9b** (Q3 session-start recommandation C retenue) :
- **Non-destructifs** : `health-check.sh` (full run), `sync-check.sh` (full run), `ref-checker.sh` (full run + --help), `session-lock.sh status`, `commit-msg` (dry test strings).
- **Destructifs = lecture + --help only** : `module-scaffold.sh --help` (pas de vraie creation de module), `validate-void-glass.sh` (test sur fichier temp fake).
- **Security-reminder.py** : test via simulation stdin JSON avec dry input (pas de vraie tool invocation).
- **Pre-commit** : lecture source + verification delegation a health-check.sh (pas de commit factice).

**Sources consultees S9a** :
- 9 fichiers scripts scannes line-by-line
- `docs/core/monitor.md` (spec source health-check)
- `docs/core/tools.md` (spec source ref-checker + commit-msg + module-scaffold)
- `.claude/commands/sync.md` (spec source sync-check)
- `CONTEXT.md` Decisions actives D-S8-12 (commit-msg a re-verifier) + F-MON-01 (health-check parse bug)
- `docs/audit-massif/08-commands.md` section 4 (cross-ref F-S8-13 double verdict + F-S8-15 polyglot)

## 3. Inventaire Phase A (S9a)

### 3.1 Les 9 scripts scannes

| Script | Lignes | Type | Exit codes | Idempotent |
|--------|--------|------|------------|------------|
| health-check.sh | 171 | bash | 0/1/2 (SAIN/BROKEN/DEGRADED) | Oui (read-only) |
| sync-check.sh | 214 | bash | 0/1/2 (SAIN/BROKEN/DEGRADED) | Oui (read-only) |
| ref-checker.sh | 178 | bash | 0/1 | Oui (read-only) |
| module-scaffold.sh | 168 | bash+Python polyglot | 0/1 | Oui (refus si existe) |
| session-lock.sh | 145 | bash | 0/1/2/3 | Partiel (acquire OK, force non) |
| hooks/validate-void-glass.sh | 38 | bash | 0/1 | Oui (read-only) |
| hooks/security-reminder.py | 280 | Python3 | 0/2 (PreToolUse) | Oui (session state) |
| git-hooks/pre-commit | 20 | bash | 0/1 | Oui (delegue health-check) |
| git-hooks/commit-msg | 19 | bash | 0/1 | Oui (regex check) |

**Total scanne** : 1233 lignes. Langages : 8 bash (1101L) + 1 Python (280L) + 1 polyglot (46L Python embed dans module-scaffold.sh).

### 3.2 Specs sources consultees (cross-check)

- `docs/core/monitor.md` — source de health-check.sh (seuils + thresholds)
- `docs/core/tools.md` — source de ref-checker, module-scaffold, commit-msg
- `.claude/commands/sync.md` — source de sync-check.sh
- `CONTEXT.md` Decisions actives — D-MON-01..05 Monitor, D-S8-12 commit-msg
- `docs/audit-massif/08-commands.md` — F-S8-13 double verdict sync, F-S8-15 polyglot scaffold, D-S8-12 commit-msg

## 4. Audit 4 angles par script

### 4.1 health-check.sh (171L)

**Angle 1 — Bugs evidents** :
- **F-S9-01 P1 cause racine F-MON-01 confirmee** : L140 `grep "\.js "` matche trop largement. Dans `BUILD_OUT`, la premiere ligne `[OK] Design tokens built -> tokens/build/ (tokens.css + tokens.js + tokens.json)` (prebuild workspace chain D-DS-20) contient `tokens.js + tokens.json` donc matche `\.js ` AVANT la ligne vrai bundle `dist/assets/index-XXX.js 457.15 kB`. Puis `awk '{print $2}'` sur cette ligne extrait `Design` (2e token apres `[OK]`) au lieu de `457.15`. **Meme cause L141 CSS** (F-S9-02).
- **Fix propose** : changer `grep "\.js "` → `grep "^dist/.*\.js "` et `grep "\.css "` → `grep "^dist/.*\.css "` pour cibler UNIQUEMENT les lignes vite (qui commencent par `dist/`).

**Angle 2 — Idempotent** : Oui, read-only.

**Angle 3 — Exit codes** : 0=SAIN, 1=BROKEN, 2=DEGRADED documentes header L4. Coherent L162-170.

**Angle 4 — Output** : OK 3 sections CRITICAL/WARNING/INFO + verdict final. Couleurs ANSI.

### 4.2 sync-check.sh (214L)

**Angle 1 — Bugs evidents** :
- **F-S9-03 P2 confirme F-S8-13** : L27 `echo "$HEALTH_OUT"` affiche le verdict health-check embed, puis L205-214 affiche le verdict sync-check final = **double verdict dans la sortie**. Fix = (a) supprimer le dernier verdict si pas de section EXTENDED avec warning/critical, ou (b) extraire seulement les sections de health-check sans le verdict ligne finale. Recommande (b) : `grep -v "Verdict :"` sur HEALTH_OUT avant echo.
- **Dependance transitive F-S9-01** : sync-check.sh appelle health-check.sh (L25), donc herite du bug parse bundle. Non bloquant sync-check mais visible dans sortie.
- **F-S9-04 P3** : L145 `grep -E "^- \*\*Routes\*\*"` fragile si convention CONTEXT.md change (ex: `**Routes** :` sans `- ` devant). Non critique, check tombe en WARN graceful.

**Angle 2 — Idempotent** : Oui, read-only. mktemp + rm -f clean L181+L199.

**Angle 3 — Exit codes** : 0=SAIN, 1=BROKEN, 2=DEGRADED documentes L4. Coherent.

**Angle 4 — Output** : 7 sections mais double verdict = bruit.

### 4.3 ref-checker.sh (178L)

**Angle 1 — Bugs evidents** :
- Structure propre : pur bash parameter expansion, pas de subprocess per-line, gestion fenced code blocks + inline code.
- **F-S9-05 P3** : L120-122 double check `[ ! -e "$target" ] && [ ! -e "./$target" ]` — redondant car L121 strip `./` donc target n'est jamais absolu. Simplifiable a `[ ! -e "$target" ]`. Non bloquant.
- `find` L151-159 exclut correctement node_modules, dist, .git, .omc, _bmad.

**Angle 2 — Idempotent** : Oui.

**Angle 3 — Exit codes** : 0=clean, 1=broken refs + `--help` exit 0. Conforme.

**Angle 4 — Output** : Liste `file:line → [md|bt] ref` bien formatee.

### 4.4 module-scaffold.sh (168L)

**Angle 1 — Bugs evidents** :
- **F-S9-06 P2 confirme F-S8-15** : L111-156 = 46 lignes Python heredoc embed dans bash pour update CONTEXT.md. Anti-pattern polyglot de maintenabilite : (a) cache du code Python que grep ne trouve pas facilement, (b) IDE highlight bash casse le Python embed, (c) tests unitaires impossibles sans extraire le script. **Alternatives** : (1) extraire dans `scripts/lib/update-context-md-modules.py` + invocation externe (recommande), (2) pur bash avec `sed` (fragile pour parsing table MD), (3) laisser tel quel avec commentaire d'explication. **Fix recommande = option 1** (extraction scripts/lib/).
- **F-S9-07 P3** : L68-69 `NAME_CAP` derivation `awk '{print toupper(substr($0,1,1)) substr($0,2)}' | tr '-' ' '` capitalise SEULEMENT le premier caractere. `my-cool-module` devient `My cool module` au lieu de `My Cool Module`. Intentionnel ou bug ? A clarifier.
- **F-S9-08 P3** : Non-atomicite partielle CONTEXT.md. L160-163 rollback FS si Python rc != 0, mais PAS de rollback CONTEXT.md si Python ecrit partialement (peu probable car Python fait read full / write full atomique, mais theoriquement possible si kill -9 mid-write).

**Angle 2 — Idempotent** : Oui, refus si `modules/$NAME` existe (L63-66). Re-run apres delete FS = update ligne existante (pas duplication) via Python pattern L137-146.

**Angle 3 — Exit codes** : 0=OK, 1=erreur. Documentes L5.

**Angle 4 — Output** : Bon, messages `[OK]` par etape + final `Module X scaffold dans Y`.

### 4.5 session-lock.sh (145L)

**Angle 1 — Bugs evidents** :
- Structure solide : subcommands acquire/release/status/force, gestion TTL expiration, portable BSD/GNU date L63-64.
- **F-S9-09 P3** : L28 `usage()` utilise `sed -n '2,14p' "${BASH_SOURCE[0]}"` pour extraire le header comme help. Fragile si le header change de ligne ou d'ordre. Alternative heredoc inline standard. Non bloquant car le header est stable.
- **F-S9-10 P3** : Script existe et fonctionnel mais **non branche** a `/session-start` ni `/session-end` (rappel CONTEXT.md module Cowork "non-branche — Action 2 Cowork Sprint 1"). Pas un bug du script, finding de coverage gap integration. Couvert par D-S7-01 parking Cowork Sprint 1.

**Angle 2 — Idempotent** : acquire=oui (refresh si meme head), release=oui (no-op si pas de lock), status=read-only, force=override par design.

**Angle 3 — Exit codes** : 0=OK, 1=blocked, 2=usage, 3=expired recovered. Documentes L11-16.

**Angle 4 — Output** : Messages clairs `OK/BLOCKED/EXPIRED/HELD`.

### 4.6 hooks/validate-void-glass.sh (38L)

**Angle 1 — Bugs evidents** :
- **F-S9-11 P2 coverage gap** : L13 `TARGET_FILE=$(git diff --cached --name-only | head -1)` — check SEULEMENT le premier fichier staged. Si 5 fichiers sont commit ensemble et le 3e viole Void Glass, le hook passe silencieusement. Fix = loop sur tous les fichiers.
- **F-S9-12 P2 coverage gap** : L16 regex `\.(jsx|tsx|css|scss)$` exclut `.ts` pur. Un fichier `.ts` avec `#0A0A0B` passe. Fix = ajouter `|ts`.
- **F-S9-13 P2 coverage gap** : L25 regex fonts check Outfit/Inter mais PAS `system-ui` seul. sync-check.sh L185-187 fait ce check complet, hook l'omet. Asymetrie hook (partial) vs auditeur (full). Fix = ajouter check symetrique avec filter Figtree.
- **F-S9-14 P3** : Exit codes non documentes en header. Implicit 0=OK ou pas d'extension match, 1=violation. Ajouter commentaire explicite.

**Angle 2 — Idempotent** : Oui.

**Angle 3 — Exit codes** : 0/1 implicit, pas documente.

**Angle 4 — Output** : Emojis dans les messages. Messages clairs.

### 4.7 hooks/security-reminder.py (280L)

**Angle 1 — Bugs evidents** :
- Structure Python claire : SECURITY_PATTERNS list, session-scoped state, cleanup periodique.
- **F-S9-15 P3** : L183-197 `check_patterns` retourne le **1er match trouve** seulement. Si un fichier contient plusieurs patterns distincts (ex: pattern 4 et pattern 7 de la liste SECURITY_PATTERNS), seul le 1er dans l'ordre de la liste est rapporte. Sous-optimal mais non bloquant (re-run montrerait le 2e apres fix du 1er).
- **F-S9-16 P3** : L14 `DEBUG_LOG_FILE = "/tmp/security-warnings-log.txt"` hardcoded, pas de rotation ou cleanup (cleanup L134-156 concerne state files `~/.claude/security_warnings_state_*.json`, pas ce debug log). Grossit indefiniment. Non critique car `/tmp` est ephemere.
- **F-S9-18 P3 meta-finding** : le hook declenche un faux positif sur la redaction meme de ce rapport. Quand on decrit le nom d'un pattern de securite dans une phrase, le hook bloque l'ecriture du fichier. Auto-reference : l'audit d'un hook ne peut pas mentionner les patterns qu'il detecte. Mitigation actuelle = reformuler par numero de pattern. **Limitation structurelle** du mecanisme substring-matching sans whitelist contextuelle (markdown doc vs code source).

**Angle 2 — Idempotent** : Oui (warning shown once per session via state file).

**Angle 3 — Exit codes** : 0=allow, 2=block. Conforme PreToolUse hook spec Claude Code.

**Angle 4 — Output** : Messages pedagogiques avec exemples safe/unsafe par pattern.

### 4.8 git-hooks/pre-commit (20L)

**Angle 1 — Bugs evidents** :
- Simple : delegue a health-check.sh, block si BROKEN, warn si DEGRADED.
- Depend de F-S9-01 (health-check parse bundle) — affecte output visuel mais pas le verdict final.

**Angle 2 — Idempotent** : Oui.

**Angle 3 — Exit codes** : 0/1. Conforme git hook.

**Angle 4 — Output** : Messages clairs `COMMIT BLOQUE` / `WARNING DEGRADED`.

### 4.9 git-hooks/commit-msg (19L)

**Angle 1 — Bugs evidents** :
- Regex L10-12 `^($TYPES)(\(.+\))?:\ .+` avec TYPES = 11 standard conventional commits.
- **F-S9-17 D-S8-12 retract partiel** : D-S8-12 bonus decouverte en S8 affirmait "hook refuse le type `audit`". **Re-verification S9a** :
  - `docs(audit): s09 ...` → type=`docs` match TYPES, scope=`(audit)` match `\(.+\)`, desc OK → **accepte** ✓
  - `audit(s09): ...` → type=`audit` PAS dans TYPES → **refuse** ✗
  - Commits S1-S8 cycle3 utilisent TOUS `docs(audit): sXX ...` → passent le hook sans probleme ✓
  - **Verdict** : le hook est OK tel quel. La consequence "plan S8-S23 section commit messages obsolete" doit etre reformulee : **le plan est faux** en proposant `audit(s09): ...` au lieu de `docs(audit): s09 ...`. Fix = corriger le plan (S21 housekeeping), pas le hook.
- **D-S8-12 statut revise** : PARTIELLEMENT RETRACTE. Hook = correct. Plan = a corriger.

**Angle 2 — Idempotent** : Oui.

**Angle 3 — Exit codes** : 0=valid, 1=invalid. Documentes implicit.

**Angle 4 — Output** : Message d'erreur pedagogique avec format attendu.

## 5. Findings draft S9a

**18 findings** : 1 P1 + 6 P2 + 11 P3.

### Critiques (P1)

- **F-S9-01** `scripts/health-check.sh:140` — **Cause racine F-MON-01** : `grep "\.js "` matche la ligne `[OK] Design tokens built ... (tokens.js + tokens.json)` du prebuild workspace chain (D-DS-20) AVANT la ligne vrai bundle `dist/assets/*.js`. Resultat : `awk '{print $2}'` extrait "Design" au lieu du nombre. Fix = `grep "^dist/.*\.js "` cibler les lignes vite uniquement. **Severite P1** car cause un [WARN] cosmetique visible a chaque run health-check (contamine tous les briefs session-start/end et pre-commit hook).

### Importantes (P2)

- **F-S9-02** `scripts/health-check.sh:141` — Meme cause F-S9-01 pour CSS_SIZE. Fix symetrique `grep "^dist/.*\.css "`. Severite P2 (derivee cosmetique).
- **F-S9-03** `scripts/sync-check.sh:27+L205` — **Confirme F-S8-13** : double verdict affiche (health-check embed + sync-check final). Fix = filter `grep -v "Verdict :"` sur HEALTH_OUT avant echo, ou supprimer le dernier verdict.
- **F-S9-06** `scripts/module-scaffold.sh:111-156` — **Confirme F-S8-15** : polyglot bash+Python 46L Python embed. Anti-pattern maintenabilite. Fix recommande = extraction `scripts/lib/update-context-md-modules.py`.
- **F-S9-11** `scripts/hooks/validate-void-glass.sh:13` — Coverage gap : `head -1` ne check que le PREMIER fichier staged. Fix = loop sur tous.
- **F-S9-12** `scripts/hooks/validate-void-glass.sh:16` — Coverage gap : regex `\.(jsx|tsx|css|scss)$` exclut `.ts` pur. Fix = ajouter `|ts`.
- **F-S9-13** `scripts/hooks/validate-void-glass.sh:25` — Coverage gap : pas de check `system-ui` sans Figtree (asymetrie avec sync-check.sh L185-187). Fix = ajouter check symetrique.

### Cosmetiques / dette (P3)

- **F-S9-04** `scripts/sync-check.sh:145` — Regex Routes `^- \*\*Routes\*\*` fragile si convention CONTEXT.md change. Graceful WARN.
- **F-S9-05** `scripts/ref-checker.sh:120-122` — Double check `[ ! -e "$target" ] && [ ! -e "./$target" ]` redondant (target strip `./` L121). Simplifiable.
- **F-S9-07** `scripts/module-scaffold.sh:68-69` — NAME_CAP capitalise seulement le 1er caractere. `my-cool-module` devient `My cool module`. Clarifier intention.
- **F-S9-08** `scripts/module-scaffold.sh:160-163` — Non-atomicite theorique CONTEXT.md. Mitige par Python read/write atomique, rollback FS OK. Non critique.
- **F-S9-09** `scripts/session-lock.sh:28` — `usage()` via `sed -n '2,14p'` fragile si header change. Alternative heredoc inline.
- **F-S9-10** `scripts/session-lock.sh` — Non branche `/session-start` `/session-end`. Coverage gap integration (couvert D-S7-01 parking Cowork Sprint 1).
- **F-S9-14** `scripts/hooks/validate-void-glass.sh` — Exit codes non documentes en header. Ajouter commentaire.
- **F-S9-15** `scripts/hooks/security-reminder.py:183-197` — `check_patterns` retourne 1er match. Multi-violations partielles. Non bloquant.
- **F-S9-16** `scripts/hooks/security-reminder.py:14` — `DEBUG_LOG_FILE` hardcoded `/tmp/`, pas de rotation. Non critique (/tmp ephemere).
- **F-S9-17** **retract partiel D-S8-12** : hook commit-msg est CORRECT tel quel. Le plan S8-S23 est faux en proposant `audit(s09): ...`. Fix = corriger le plan (S21), pas le hook.
- **F-S9-18** `scripts/hooks/security-reminder.py` meta-finding : le hook declenche un faux positif sur l'ecriture de ce rapport d'audit (mentionner un nom de pattern bloque le Write). Auto-reference structurelle. Mitigation = reformulation par numero. Dette = whitelist contextuelle (markdown doc vs code source) ou allowlist par fichier cible.

## 6. Cross-refs S1-S9 (draft)

- **F-S9-01** cause racine de **F-MON-01** (identified S8 monitor-dashboard-plan session-end 2026-04-09). Confirme que F-MON-01 n'etait pas un bug cosmetique isole mais un bug de parsing structural.
- **F-S9-03** confirme **F-S8-13** (double verdict sync-check.sh decouvert S8b tests reels). Escalade de P3 (S8) a P2 (S9) car confirme par audit code statique.
- **F-S9-06** confirme **F-S8-15** (polyglot bash+Python module-scaffold.sh decouvert S8b lecture source). Escalade de flag a finding formal P2.
- **F-S9-11/12/13** nouveaux : coverage gaps validate-void-glass.sh vs sync-check.sh. Asymetrie hook pre-commit (rapide, partiel) vs audit full (complet). Pattern recurrent "hook vite != audit complet".
- **F-S9-17** retract partiel **D-S8-12**. Meta-finding : les "decouvertes bonus" S8 peuvent etre sur-interpretees par manque de verification croisee. Cf L-S8-04 (tests reels amplifient +25%) — mais aussi +25% de faux positifs ?
- **F-S9-18** meta-finding nouveau auto-reference du hook security sur la doc d'audit du hook lui-meme. Cf M-S8-01 (pattern spec MD vs code source) — cette fois c'est "tooling vs doc" au lieu de "spec vs code".
- **D-S7-01** (audit lineaire, fixes S23+) maintenu strict : F-S9-01 meme P1 est flag only, pas fix. Exception F-MON-01 refusee (recommandation session-start Q4 A strict).

## 7. Decisions (pending S9b)

A finaliser en S9b apres tests reels. Template draft :
- D-S9-01..XX : batch cleanup scripts (P2 + P3) a programmer S21 housekeeping.
- D-S9-XX retract partiel D-S8-12.

## 8. Learnings (pending S9b)

A finaliser en S9b apres tests reels.

## 9. Out-of-scope S9

- **Scripts externes** : `modules/app/scripts/*` (si existants), `modules/design-system/scripts/*` (Style Dictionary build-tokens.mjs + check-contrast.mjs) — non dans scope car specifiques aux modules, pas aux scripts Core OS.
- **GitHub Actions workflows** : `.github/workflows/*.yml` (supabase-ping, design-system si existe) — hors scope scripts, couverts S11 comm + securite probablement.
- **OMC hooks** : `.claude/hooks/*` (si existants) — hors scope Foundation OS core, relevent du plugin OMC.
- **Tests unitaires des scripts** : aucun test automatise pour les 9 scripts. Pas scope audit mais candidat dette post-cycle3.

## 10. Next session

**S9b** : tests reels invocation + findings consolides + decisions + learnings + commit final.
- Tests non-destructifs : health-check full run, sync-check full run, ref-checker full run + --help, session-lock status, commit-msg dry tests.
- Tests destructifs = --help only + lecture source : module-scaffold.sh --help, validate-void-glass.sh sur fichier temp.
- Simulation stdin JSON pour security-reminder.py avec dry pattern match.
- Consolider 18 findings draft → findings finaux (possible +/-).
- Formaliser D-S9-01..XX decisions batch S21.
- L-S9-01..XX learnings.
- Commit final : `docs(audit): s09 scripts + hooks (9) deep + tests reels`.
