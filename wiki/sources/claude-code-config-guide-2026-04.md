---
type: source
title: "Guide configuration Claude Code (24 parties)"
source_type: article
author: "Community guide (auteur non identifie, paste Kevin)"
date_published: 2026-04-19
url: ""
confidence: high
fos_compat: high
effort_estime: S-M
decision: partially-applied
key_claims:
  - "CLAUDE.md < 200L (ideal 50L) : au-dela, adherence Claude chute"
  - "2 dossiers .claude : projet (git-committed) + user (~/.claude/, personnel)"
  - ".claude/rules/ modulaire avec YAML frontmatter paths pour path-scoped"
  - "CLAUDE.local.md gitignored pour overrides personnels"
  - "Hooks : PreToolUse / PostToolUse / Stop / SessionStart / SessionEnd / PreCompact / UserPromptSubmit / Notification"
  - "Exit codes cles : 0 continue / 1 non-bloquant / 2 bloque et renvoie Claude"
  - "Exit code 2 OBLIGATOIRE pour bash firewall (pas exit 1)"
  - "Stop hook : check stop_hook_active pour eviter boucle infinie"
  - "settings.json : allow list generous + deny list strict + middle ground ask"
  - "Skills (.claude/skills/) = workflows actifs invokes, rules = instructions passives loaded"
  - "Agents (.claude/agents/) = subagents isoles, context separe, resultats compresses"
  - "Auto-memory dans ~/.claude/projects/ persiste entre sessions (commande /memory)"
  - "Tool restrictions critiques : code-reviewer = Read/Grep/Glob seul (pas Write)"
  - "Hooks = snapshot au session start (pas hot-reload)"
  - "chmod +x obligatoire sur scripts hooks sinon silent fail"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - article
  - guide
  - claude-code
  - configuration
  - hooks
  - meta-os
status: mature
related:
  - "[[index-sources]]"
  - "[[Foundation OS]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
sources: []
---

# Guide configuration Claude Code (24 parties)

## Summary

Guide long (~5000 mots, 24 parties) sur la **configuration optimale** de Claude Code CLI. Paste par Kevin (auteur original non identifie — style tutoriel techniquement solide). Couvre : (1) role du dossier `.claude/` comme onboarding pour Claude, (2) 2 niveaux projet/user, (3) `CLAUDE.md` prioritaire sous 200L (ideal 50L), (4) `CLAUDE.local.md` gitignored, (5) le dossier .claude/rules modulaire path-scoped, (6) `settings.json` permissions + hooks, (7) systeme hooks complet (PreToolUse / PostToolUse / Stop / SessionStart/End / PreCompact), (8) skills vs agents distinction, (9) auto-memory, (10) setup step-by-step + 10 erreurs courantes.

**Pertinence pour Foundation OS** : **tres haute**. FOS a deja implemente ~70-80% de ces recommandations (CLAUDE.md 199L, 5 hooks, 4 agents, skills via plugin). Le guide valide le pattern FOS et identifie 4-5 gaps mineurs a combler.

## Key Claims

### Structure fichiers
- `.claude/` = onboarding document pour Claude (comme new developer)
- 2 dossiers `.claude/` : **projet** (git-committed, team config) + **user** (`~/.claude/`, personal config)
- `CLAUDE.md` a la racine (pas dans `.claude/`) = system prompt authoritative
- Sub-dirs peuvent avoir leur CLAUDE.md (combine hierarchical)

### Longueur
- `CLAUDE.md` < 200L, ideal 50L — adherence Claude chute si plus long
- Les instructions too-long finissent ignorees

### CLAUDE.md contenu canonique
- **Build/Test/Lint commands** exactes (pas liens README)
- **Architecture decisions** non-evidentes dans le code
- **Non-obvious gotchas** (pieges equipe)
- **Conventions** au-dela du linter

### Anti-patterns CLAUDE.md
- Ne pas dupliquer linter/formatter config (Claude lit .eslintrc directement)
- Pas de paragraphes theorie/philosophie
- Pas > 200L

### CLAUDE.local.md
- Gitignored, preferences personnelles
- Optional, mais utile si user corrige systematiquement meme reglage

### .claude/rules/
- Modulaire : 1 fichier markdown par sujet (code-style, testing, api, security, database)
- Path-scoped via YAML frontmatter : `paths: ["src/api/**/*.ts"]`
- Rules sans paths = chargees unconditionnellement
- Resoud le probleme CLAUDE.md 300L non-maintenu

### settings.json
- Allow list = sans confirmation (generous pour commandes safe)
- Deny list = hard block (strict pour destructive)
- Middle ground = Claude demande (filet de securite)
- `$schema` en tete = autocomplete VS Code

### Permissions : exemples types
- Allow : `npm run *`, `git status`, `Read`, `Write`, `Edit`, `Glob`, `Grep`
- Deny : `rm -rf *`, `curl *`, `wget *`, `git push *`, `git checkout main`, `Read(./.env)`

### Hooks systeme deterministe
- CLAUDE.md = suggestion (90% adherence)
- Hook = garantie (100% adherence)
- Pour "always" → hook. Pour "mostly" → CLAUDE.md.

### Events hooks
- **PreToolUse** : AVANT tool (securite gate)
- **PostToolUse** : APRES tool success (nettoyage + standards)
- **Stop** : quand Claude declare "done" (quality gate final)
- **UserPromptSubmit** : quand user submit prompt (validation/log)
- **Notification** : alerts desktop
- **SessionStart/SessionEnd** : setup/cleanup
- **PreCompact** : avant compaction (save context)

### Exit codes hooks
- **0** = success, continue
- **1** = non-blocking error (logged mais continue)
- **2** = block, stop everything, message renvoye a Claude
- **Erreur la plus frequente** : utiliser exit 1 au lieu de 2 pour securite = ne bloque pas

### Stop hook anti-loop
- Check `stop_hook_active` pour eviter boucle infinie (2e tentative = allow stop)

### Matcher
- PreToolUse/PostToolUse : champ `matcher` restreint tools (`Write|Edit|MultiEdit`, `Bash`)
- Sans matcher = tous les tools triggers

### Payload JSON stdin
- Hooks recoivent JSON sur stdin (tool name, arguments, context)
- Script lit + decide + exit code

### 3 hooks canoniques a installer
1. **Bash firewall** (PreToolUse Bash) : bloque `rm -rf`, `git push --force`, `curl | bash`, etc.
2. **Auto-format** (PostToolUse Write|Edit|MultiEdit) : prettier/black auto sur fichiers
3. **Test enforcement** (Stop) : npm test + tsc --noEmit, block si fail

### Skills vs Rules vs Agents
- **Rules** = instructions passives (standards, chargees via paths)
- **Skills** = workflows actifs invokes (Claude reconnait task matching description)
- **Agents** = subagents isoles (context separe, compresses resultats)

### Skills structure
- `.claude/skills/<name>/SKILL.md` avec YAML frontmatter (name, description, allowed-tools)
- Peut embarquer fichiers support (templates, guides)
- Skills personnels : `~/.claude/skills/`

### Agents structure
- `.claude/agents/<name>.md` avec YAML frontmatter (name, description, model, tools)
- Tool restrictions critiques : code-reviewer = Read/Grep/Glob seul
- Model choice : haiku (read-only/ciblée), sonnet (standard), opus (complexe)

### ~/.claude/ global
- CLAUDE.md global (preferences cross-project)
- settings.json global (hooks cross-project, ex: notification)
- skills/ + agents/ personnels (tous projets)
- projects/ (auto-memory + session history, auto-managed)

### Auto-memory
- ~/.claude/projects/<project>/ stocke notes entre sessions
- Commande `/memory` pour voir/modifier
- Hook `memory-last-used-hook.sh` FOS existe deja

### Setup progressif
- Step 1-3 (15min, 80% valeur) : CLAUDE.md + settings.json + bash firewall
- Step 4-8 (raffinements) : auto-format, test enforcement, rules, global config, skills/agents

### 10 erreurs courantes (extraites)
1. CLAUDE.md > 400L = adherence baisse
2. Exit 1 au lieu de 2 pour securite = ne bloque pas
3. Pas de `stop_hook_active` = boucle infinie
4. Tout dans CLAUDE.md au lieu de rules/
5. Allow list trop restrictive (demande permission pour tout)
6. Hooks NO hot-reload (session restart necessaire)
7. `chmod +x` oublie sur scripts = silent fail
8. Dupliquer linter/formatter config dans CLAUDE.md
9. Agents avec trop de tools (moins = moins d'erreurs)
10. Ignorer auto-memory (`/memory` regulier)

## Entities Mentioned

- **[[Claude Code]]** — CLI Anthropic (produit central du guide)
- **[[MCP]]** (Model Context Protocol) — mentionne indirectement via hooks plugin
- `prettier`, `black` — formatters cites
- `eslint` — linter cite
- `npm`, `jest`, `tsc` — tools Node cites
- `osascript`, `notify-send` — alert tools desktop
- `jq` — JSON parser CLI (hooks)

## Concepts Introduced

- **[[Claude Code Configuration Pattern]]** — hub agregateur des 24 patterns du guide
- **Path-scoped rules** — YAML frontmatter `paths:` pour load conditionnel
- **Hook exit codes semantics** — 0/1/2 avec implications claires
- **Bash firewall pattern** — PreToolUse Bash hook bloquant commandes destructives
- **Auto-format hook pattern** — PostToolUse Write|Edit|MultiEdit lancant formatter
- **Test enforcement Stop hook** — validation finale avant "done"
- **Tool restriction per agent** — subagents minimal permissions
- **Skills vs Rules vs Agents** — distinction fondamentale usage

## Foundation OS Analysis

### Compat OS

**High**. FOS utilise deja Claude Code comme runtime principal. Le guide valide majoritairement le pattern FOS existant et identifie gaps actionnables. **Zero incompatibilite structurelle**.

### Effort integration (par gap)

**S-M** (par gap specifique, voir ci-dessous).

### Ce qui existe deja dans FOS (audit)

#### ✅ Implemente
- **`CLAUDE.md` 199L** (sous garde-fou 200L recommande par guide)
- **`.claude/settings.json`** avec 5 hook events configures : PreToolUse (Write|Edit|MultiEdit + Read) + SessionEnd + SessionStart + PreCompact
- **`.claude/settings.local.json`** existe (overrides personnels presents)
- **5 hooks actifs** : validate-void-glass.sh + security-reminder.py + memory-last-used-hook.sh + session-start-wiki.sh + pre-compaction-snapshot.sh + auto-archive-plans.sh
- **4 agents** : dev-agent, doc-agent, os-architect, review-agent (`.claude/agents/`)
- **7 commands** : cockpit, new-project, plan-os, session-end, session-start, sync, wt (`.claude/commands/`)
- **Auto-memory** : ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/ (25+ feedback files)
- **Plugin claude-obsidian** : skills (10) + commands (4) + agents (2)
- **Plugin OMC** : oh-my-claudecode ecosysteme
- **Allow list minimale** : `git:*`, `npm:*`, `npx:*`, `node:*`

#### ⚠️ Gaps identifies (par severite)

| Gap | Severite | Effort | Impact |
|-----|----------|--------|--------|
| **Deny list vide** (`deny: []`) | 🔴 High (security) | S (~30min) | Bash firewall absent = aucun block rm -rf, git push --force, etc. |
| **Pas de CLAUDE.local.md** | 🟡 Low | S (<5min) | Perd le pattern overrides personnels (mais Kevin n'a pas besoin si solo) |
| **Pas de auto-format hook** PostToolUse | 🟡 Medium | S (~30min) | Formatage manuel (mais ESLint + Prettier peuvent tourner en on-save IDE) |
| **Pas de test enforcement Stop hook** | 🟡 Medium | S-M (~1h) | Claude peut declarer "done" sans tests (mitige par /session-end qui lance health-check) |
| **Pas de le dossier .claude/rules path-scoped** | 🟡 Low | M (refactor docs/core/ en rules/) | FOS utilise `docs/core/` (meme idee, structure differente). Path-scoping absent = opportunite |
| **Bash firewall hook dedicate** | 🟡 Medium | S (~30min) | security-reminder.py existe mais a verifier si vrai block (exit 2) ou just reminder (exit 0/1) |

#### ⚠️ Validation a faire
- **security-reminder.py** : est-ce un **vrai firewall** (exit 2 bloque) ou **just reminder** (exit 0 passe) ? Verifier le script. Si reminder seulement → gap security critical.
- **Agents tools restrictions** : verifier que chaque agent a un champ `tools:` minimal (code-reviewer = Read/Grep/Glob seul).
- **Hook rendements** : les 6 hooks actuels ont-ils le bon exit code semantics ?

### Limites Claude declarees

- **Source texte paste** (pas URL) : pas de fetch verification possible. Confidence moyenne sur provenance (auteur anonyme).
- **Training** : je connais Claude Code configuration en general (docs Anthropic publiques) mais pas les details tres recents 2025-2026.
- **N'ai pas lu** le contenu de `validate-void-glass.sh`, `security-reminder.py`, autres scripts → verdict gap security "bash firewall" est **preliminaire**, a confirmer via audit script.

### Risques / pieges

1. **Deny list vide = risque absolu**. Meme si FOS a `security-reminder.py`, il faut verifier que c'est un **block reel (exit 2)**, pas un reminder (exit 0). Si reminder seul, Claude peut techniquement executer `rm -rf` sans obstruction.
2. **Pattern le dossier .claude/hooks vs `scripts/hooks/` FOS** : FOS a choisi `scripts/hooks/` (coherent avec scripts/). Deviation du guide mais justifiee. Pas changer.
3. **Path-scoped rules** : FOS preferera peut-etre garder `docs/core/` (7 modules specifiques FOS) que decouper en le dossier .claude/rules genericos. Adoption partielle si ajout.
4. **Auto-format** : avec Tailwind 4 + Vite + ESLint integre, le besoin est marginal. Kevin formate probablement via IDE on-save.
5. **Test enforcement** : FOS `/session-end` lance health-check. Stop hook serait redondant si Kevin utilise toujours `/session-end`. Si Kevin declare "done" sans `/session-end`, alors gap.

### Verdict

**Partially applied** (70-80% du guide applique). 6 gaps identifies :

| # | Gap | Priorite | Action recommandee |
|---|-----|----------|-------------------|
| 1 | Deny list vide | 🔴 **Critique** | Audit `security-reminder.py` + ajouter deny list stricte si script just-reminder |
| 2 | Bash firewall hook | 🔴 **Critique** | Creer hook PreToolUse Bash avec exit 2 si deny matchs |
| 3 | Agents tool restrictions | 🟡 Medium | Audit 4 agents + ajouter `tools:` frontmatter si absent |
| 4 | Test enforcement Stop hook | 🟡 Medium | Optionnel si Kevin utilise /session-end systematiquement |
| 5 | Auto-format hook | 🟡 Low | Optionnel si IDE format on-save configure |
| 6 | CLAUDE.local.md | 🟡 Low | Creer fichier vide + gitignore + documenter pattern |

**Recommandation globale** : **appliquer gaps 1+2** immediatement (security critique) + **optionnels** 3-6 selon besoin.

### Questions ouvertes

- `security-reminder.py` : est-ce un vrai firewall (exit 2) ou reminder seul ? **A auditer immediatement**.
- Les 4 agents FOS ont-ils des `tools:` frontmatter restrictives ? A auditer.
- `.claude/loop.md` : c'est quoi ? (visible mais non standard)
- Pattern `scripts/hooks/` vs le dossier .claude/hooks : FOS deviation OK ou a aligner au standard guide ?
- Test enforcement Stop hook : redondant avec /session-end ou complementaire ?
- Ajouter section "Claude Code config best practices" dans `docs/core/` ?

## Raw Source

- Paste texte par Kevin, 2026-04-19
- Source web originale : non identifiee (pas d'URL)
- Structure : 24 parties numerotees

## Notes

Le guide est un **excellent audit externe** du pattern FOS. Validation empirique que les choix FOS (5 hooks, 4 agents, CLAUDE.md 199L, plugins OMC + claude-obsidian) sont **conformes aux best practices** communaute Claude Code. Les gaps identifies sont **tous mineurs** sauf la **deny list vide** qui merite une action immediate.

**A considerer pour action** : plan d'execution "Durcissement config Claude Code" en 2-3 phases :
- **Phase 1 (critique)** : deny list + bash firewall (30min-1h)
- **Phase 2 (medium)** : agents tools audit + test enforcement hook (1-2h)
- **Phase 3 (optional)** : CLAUDE.local.md + auto-format hook + rules/ path-scoped (1-2h)

**Pattern a retenir** : meme si FOS a sa propre structure (`scripts/hooks/` + `docs/core/` au lieu de le dossier .claude/hooks + le dossier .claude/rules), les **idees sous-jacentes sont les memes**. Le guide valide l'approche modulaire + deterministe + permissions granulaires.

**Referrable comme source** pour tout audit futur de la config Claude Code FOS.
