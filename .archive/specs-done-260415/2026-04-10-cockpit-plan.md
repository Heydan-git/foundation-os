# Cockpit — Plan d'implementation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creer le skill /cockpit (point d'entree unique TDAH-friendly) et harmoniser le systeme Foundation OS (supprimer les repetitions, archiver les doublons).

**Architecture:** Un fichier command `.claude/commands/cockpit.md` orchestre scan → brief → routing → execution → cloture. En parallele, CLAUDE.md est compresse (~40L en moins), les agents sont simplifies, et 2 docs doublons sont archivees. Zero changement de comportement.

**Tech Stack:** Markdown commands/agents, bash scripts existants (health-check.sh, sync-check.sh, ref-checker.sh)

---

## Task 1: Creer le skill /cockpit

**Files:**
- Create: `.claude/commands/cockpit.md`

- [ ] **Step 1: Creer le fichier cockpit.md**

```markdown
# /cockpit — Point d'entree unique Foundation OS

Super-pilote TDAH-friendly. Un seul appel, zero friction.
Coexiste avec /session-start, /session-end, /sync, /new-project (qui restent intactes).

Spec design : `docs/specs/2026-04-10-cockpit-design.md`

## Phase 1 — SCAN (parallele)

Lancer en parallele :

1. **CONTEXT.md** : lire ENTIER (< 150 lignes garanti)
2. **Git** : `git status --short` + `git log -1 --format="%cr · %h · %s"` + `git branch --show-current`
3. **Build modules** : pour chaque `modules/*/package.json` → `npm run build -w modules/[nom]`
4. **Health-check** : `bash scripts/health-check.sh`

Si CONTEXT.md absent → abort avec erreur explicite.
Si health-check BROKEN ou build failure → signaler les erreurs critiques, ne pas produire le brief (fixer d'abord).

## Phase 2 — BRIEF v11

Generer le brief TDAH-friendly au format v11 (cadres box-drawing, colonnes alignees, espacement genereux).
Template et regles de rendu : voir `/session-start` (source de verite du format v11).

**Difference avec /session-start** : la section INPUT ne pose pas de questions projet. Elle affiche uniquement :

```
╔═ INPUT ══════════════════════════════════╗
║                                          ║
║   On fait quoi ?                         ║
║                                          ║
╚══════════════════════════════════════════╝
```

Attendre la reponse de Kevin en langage libre. Pas de menu, pas de choix multiples.

## Phase 3 — ROUTE

Analyser la reponse de Kevin et router vers le bon agent.

Table de routing (source : `docs/core/cortex.md` section 1) :

| Signaux | Agent | Modele |
|---------|-------|--------|
| code, composant, page, fix, CSS, React, Supabase, build, Tailwind | dev-agent | sonnet |
| documente, note, trace, journalise, CONTEXT, met a jour | doc-agent | sonnet |
| architecture, ADR, stack, schema, structurer, option A vs B | os-architect | opus |
| verifie, audit, check, revue, regression, deployer | review-agent | sonnet |

### Regles de routing

1. **Match explicite** sur mots-cles → deleguer a l'agent correspondant
2. **Multi-domaine** (ex: code + archi) → sequentiel (agent 1 puis agent 2)
3. **Trivial** (< 1 fichier, 1 domaine) → traiter directement, pas d'agent
4. **Ambiguite** → poser 1 question a Kevin (pas plus)
5. **Annonce** : toujours dire "Je route vers [agent] pour [raison]" — Kevin peut overrider

## Phase 4 — EXECUTE

L'agent ou le cockpit directement execute le travail. Kevin valide.

## Phase 5 — CLOTURE

Apres que Kevin valide le travail :

1. **Commit** : proposer un commit conventionnel (`type(scope): description`)
2. **CONTEXT.md** : proposer les updates necessaires (sessions, decisions, metriques)
3. **Health final** : `bash scripts/health-check.sh`
4. Si DEGRADED ou BROKEN → signaler, ne pas pretendre que c'est fini
5. Kevin peut refuser le commit ou les updates. Rien n'est force.
```

- [ ] **Step 2: Verifier que la commande est reconnue**

Run: `ls .claude/commands/cockpit.md`
Expected: le fichier existe

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/cockpit.md
git commit -m "feat(core): add /cockpit command — single entry point TDAH-friendly"
```

---

## Task 2: Compresser CLAUDE.md (supprimer les resumes doublons)

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Remplacer la section "Core OS — Routing" (lignes ~95-100)**

Avant :
```markdown
## Core OS — Routing

Cortex route les taches vers l'agent adapte. Table signaux → agents : `docs/core/cortex.md` section 1 (source unique).

Agents : os-architect, dev-agent, doc-agent, review-agent.
Priorite : match explicite → deleguer. Ambiguite → demander. Aucun match → traiter directement.
Multi-agent → sequentiel (ex: dev puis review). Trivial (< 1 fichier) → direct.
```

Apres :
```markdown
## Core OS — Routing

Spec complete : `docs/core/cortex.md`. Table signaux → agents section 1. Point d'entree simplifie : `/cockpit`.
```

- [ ] **Step 2: Remplacer la section "Core OS — Communication" (lignes ~100-108)**

Avant :
```markdown
## Core OS — Communication

Journalisation, indexation, lecture, briefing. Spec complete : docs/core/communication.md

| Tier | Support | Quand mettre a jour |
|------|---------|---------------------|
| Session | Conversation | Automatique (volatile) |
| Contexte | CONTEXT.md | Chaque /session-end |
| Reference | docs/ | Quand un fondamental change |
| Auto-memory | Claude natif | Automatique |

Regle d'or : une info ne vit que dans UN tier. Pas de duplication.
Decisions dans CONTEXT.md : toujours avec date (YYYY-MM-DD).
```

Apres :
```markdown
## Core OS — Communication

Spec complete : `docs/core/communication.md`. 4 tiers (Session/Contexte/Reference/Auto-memory). Regle d'or : une info ne vit que dans UN tier.
```

- [ ] **Step 3: Remplacer la section "Core OS — Monitor" (lignes ~110-115)**

Avant :
```markdown
## Core OS — Monitor

Health indicators par severite. Spec complete + seuils : `docs/core/monitor.md` (source unique).

Execution : `bash scripts/health-check.sh` (appele par pre-commit et /session-end).
Verdicts : SAIN (0 critical, 0 warning) / DEGRADED (0 critical, 1+ warning) / BROKEN (1+ critical).
```

Apres :
```markdown
## Core OS — Monitor

Spec complete + seuils : `docs/core/monitor.md`. Execution : `bash scripts/health-check.sh`.
```

- [ ] **Step 4: Remplacer la section "Core OS — Tools" (lignes ~117-122)**

Avant :
```markdown
## Core OS — Tools

Utilitaires et automation. Spec complete : docs/core/tools.md

Existants : validate-void-glass.sh (hook), security-reminder.py (hook), commit-msg (git hook), health-check.sh (Monitor), sync-check.sh (/sync), ref-checker.sh (refs cassees), module-scaffold.sh (new-project), session-lock.sh (Cowork), supabase-ping (GitHub Actions cron), Vercel auto-deploy.
Convention : scripts/ en bash/node, kebab-case, idempotent, exit codes standards.
```

Apres :
```markdown
## Core OS — Tools

Spec complete : `docs/core/tools.md`. Convention : scripts/ en bash/node, kebab-case, idempotent.
```

- [ ] **Step 5: Ajouter /cockpit dans la section Commands**

Dans la section "Commands (.claude/commands/)", ajouter :
```markdown
- /cockpit    : point d'entree unique — scan + brief + routing + cloture (TDAH-friendly)
```

- [ ] **Step 6: Verifier que CLAUDE.md est coherent**

Relire le fichier. Verifier qu'aucune reference n'est cassee.

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md
git commit -m "refactor(core): compress CLAUDE.md — pointeurs vers specs au lieu de resumes"
```

---

## Task 3: Simplifier les 4 agents

**Files:**
- Modify: `.claude/agents/dev-agent.md`
- Modify: `.claude/agents/doc-agent.md`
- Modify: `.claude/agents/os-architect.md`
- Modify: `.claude/agents/review-agent.md`

Principe : retirer les regles deja dans CLAUDE.md (Void Glass, commits, racine, build). Garder seulement le frontmatter + role + scope + hors-scope + sortie.

- [ ] **Step 1: Simplifier dev-agent.md**

Remplacer le contenu (apres le frontmatter `---`) par :

```markdown
# Foundation OS — Agent Dev

Herite des regles globales CLAUDE.md (Void Glass, commits, garde-fous).

## Contexte obligatoire

1. Lire CONTEXT.md → modules actifs, etat technique
2. Lire docs/design-system.md → tokens Void Glass

## Structure App Builder

```
modules/app/src/
  components/    Composants reutilisables
  pages/         Pages routes
  lib/           AuthContext, supabase, mutations, hooks, types
```

## Hors scope (deleguer)

- Decisions d'architecture → os-architect
- Mise a jour CONTEXT.md → doc-agent
- Audit pre-deploy → review-agent

## Sortie

Format court. Lister : fichiers crees/modifies, build status.
Conventional commits : feat(app): / fix(app): / refactor(app):
```

- [ ] **Step 2: Simplifier doc-agent.md**

Remplacer le contenu (apres le frontmatter `---`) par :

```markdown
# Foundation OS — Agent Documentation

Herite des regles globales CLAUDE.md (garde-fous, pas de duplication).

## Contexte obligatoire

1. Lire CONTEXT.md → etat actuel complet

## Fichiers a maintenir

| Fichier | Quand mettre a jour |
|---|---|
| CONTEXT.md | Fin de session, changement status module, nouvelle decision |
| docs/*.md | Decision technique majeure, changement Core OS ou tokens |
| docs/decisions-log.md | Quand CONTEXT.md depasse 15 decisions actives |

Protocole Communication (4 tiers) : `docs/core/communication.md`.

## Hors scope (deleguer)

- Code React/UI → dev-agent
- Decisions d'architecture → os-architect
- Audit/validation → review-agent

## Sortie

Format court. Lister : fichiers mis a jour, sections modifiees.
```

- [ ] **Step 3: Simplifier os-architect.md**

Remplacer le contenu (apres le frontmatter `---`) par :

```markdown
# Foundation OS — Architecte

Herite des regles globales CLAUDE.md (garde-fous, commits).

## Contexte obligatoire

1. Lire CONTEXT.md → etat actuel, modules, decisions
2. Lire docs/architecture.md → decisions techniques existantes

## Scope

- Decisions de stack et structure
- Schema DB (Supabase, migrations)
- Architecture monorepo et Core OS

## Pattern de decision

```
Probleme  : [a resoudre]
Options   : A — [option] / B — [option]
Recommande: [X] — Pourquoi : [justification]
Impact    : [fichiers touches]
```

Proposer avant d'executer — alignement Kevin requis.
Non-regression : `bash scripts/health-check.sh` doit rester SAIN.

## Hors scope (deleguer)

- Code React/UI → dev-agent
- Documentation post-decision → doc-agent
- Audit/validation → review-agent

## Sortie

Format court. Lister : decision prise, fichiers impactes, prochaine etape.
```

- [ ] **Step 4: Simplifier review-agent.md**

Remplacer le contenu (apres le frontmatter `---`) par :

```markdown
# Foundation OS — Agent Revue

Herite des regles globales CLAUDE.md (garde-fous, commits).

## Contexte obligatoire

1. Lire CONTEXT.md → etat attendu
2. Comparer avec le filesystem reel

## Methode

1. `bash scripts/health-check.sh` — SAIN/DEGRADED/BROKEN (source verite seuils : `docs/core/monitor.md`)
2. `bash scripts/sync-check.sh` — coherence CONTEXT.md vs filesystem
3. Checks manuels si doute : decisions datees, specs vs agents, git state

## Hors scope (deleguer)

- Ecriture de code → dev-agent
- Decisions d'architecture → os-architect
- Mise a jour docs → doc-agent

## Rapport

```
OK      : [ce qui est sain]
Warning : [ce qui merite attention]
Erreur  : [a corriger avant livraison]
Verdict : LIVRABLE / A CORRIGER
```
```

- [ ] **Step 5: Commit**

```bash
git add .claude/agents/dev-agent.md .claude/agents/doc-agent.md .claude/agents/os-architect.md .claude/agents/review-agent.md
git commit -m "refactor(core): simplify agents — inherit CLAUDE.md rules instead of copying"
```

---

## Task 4: Ajouter section Cockpit dans cortex.md

**Files:**
- Modify: `docs/core/cortex.md`

- [ ] **Step 1: Ajouter la section apres la section 5 (Limites de Cortex)**

Ajouter a la fin du fichier :

```markdown

## 6. Cockpit — Point d'entree simplifie

Le skill `/cockpit` est un super-pilote optionnel au-dessus de Cortex.

Il automatise le workflow complet : scan → brief v11 → routing → execution → cloture.
Kevin n'a plus a choisir entre /session-start, agents, ou /session-end.

**Coexistence** : les commandes /session-start, /session-end, /sync, /new-project restent intactes et utilisables independamment.

**Routing** : le cockpit utilise la table de routing section 1 (memes signaux, memes agents). La seule difference : le routing est automatique au lieu de manuel.

**Spec complete** : `docs/specs/2026-04-10-cockpit-design.md`
```

- [ ] **Step 2: Commit**

```bash
git add docs/core/cortex.md
git commit -m "docs(core): add Cockpit section to cortex.md"
```

---

## Task 5: Archiver les fichiers doublons

**Files:**
- Move: `.archive/directive-v1.md` → `.archive/directive-v1.md`
- Move: `.archive/tools-audit.md` → `.archive/tools-audit.md`

- [ ] **Step 1: Deplacer directive-v1.md**

```bash
mv .archive/directive-v1.md .archive/directive-v1.md
```

- [ ] **Step 2: Deplacer tools-audit.md**

```bash
mv .archive/tools-audit.md .archive/tools-audit.md
```

- [ ] **Step 3: Verifier qu'aucune reference active ne pointe vers ces fichiers**

```bash
bash scripts/ref-checker.sh
```

Expected: 0 ref cassee (ces fichiers ne sont references que dans CLAUDE.md section Reference, qu'on met a jour step 4)

- [ ] **Step 4: Mettre a jour CLAUDE.md section Reference**

Remplacer :
```markdown
## Reference
- Directive complete : .archive/directive-v1.md
```

Par :
```markdown
## Reference
- Directive complete : `.archive/directive-v1.md` (archive, CLAUDE.md = source active)
```

- [ ] **Step 5: Commit**

```bash
git add .archive/directive-v1.md .archive/directive-v1.md .archive/tools-audit.md .archive/tools-audit.md CLAUDE.md
git commit -m "refactor(docs): archive directive-v1 and tools-audit — CLAUDE.md is source of truth"
```

---

## Task 6: Verification finale (non-regression)

**Files:**
- Verify: all modified files

- [ ] **Step 1: Health-check**

```bash
bash scripts/health-check.sh
```

Expected: SAIN (0 critical, 0 warning)

- [ ] **Step 2: Ref-checker**

```bash
bash scripts/ref-checker.sh
```

Expected: 0 reference cassee

- [ ] **Step 3: Sync-check**

```bash
bash scripts/sync-check.sh
```

Expected: SAIN

- [ ] **Step 4: Build**

```bash
npm run build -w modules/app
```

Expected: build OK

- [ ] **Step 5: Tests**

```bash
npm test -w modules/app
```

Expected: 19/19 passing

- [ ] **Step 6: Verifier que /cockpit est listee**

```bash
ls .claude/commands/cockpit.md
```

Expected: fichier present

- [ ] **Step 7: Compter les lignes CLAUDE.md**

```bash
wc -l CLAUDE.md
```

Expected: ~90 lignes (avant: ~130)

---

## Task 7: Mettre a jour CONTEXT.md

**Files:**
- Modify: `CONTEXT.md`

- [ ] **Step 1: Ajouter la session en tete de "Sessions recentes"**

```markdown
| 2026-04-10 | **[DONE] Cockpit + harmonisation systeme** |
|            | Scope : /cockpit, CLAUDE.md, agents x4, cortex.md, archives |
|            | Skill /cockpit : point d'entree unique TDAH (scan+brief+route+cloture) |
|            | Harmonisation : CLAUDE.md -40L, agents simplifies, 2 docs archivees |
|            | Decisions : D-COCKPIT-01 point d'entree unique |
```

- [ ] **Step 2: Ajouter la decision**

Dans la section Decisions :
```markdown
| D-COCKPIT-01 Point d'entree unique | 2026-04-10 | /cockpit = super-pilote optionnel. Coexiste avec session-start/end/sync/new-project. Routing auto via Cortex. |
```

- [ ] **Step 3: Mettre a jour la section Idees & Parking**

Retirer l'idee "Brief v11 test reel" (fait cette session — le cockpit l'integre).

- [ ] **Step 4: Commit**

```bash
git add CONTEXT.md
git commit -m "docs(context): session cockpit + harmonisation — D-COCKPIT-01"
```
