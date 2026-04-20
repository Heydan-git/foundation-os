---
type: concept
title: "Claude Code Configuration Pattern"
complexity: advanced
domain: dev
created: 2026-04-19
updated: 2026-04-19
confidence: high
tags:
  - concept
  - claude-code
  - configuration
  - meta-os
  - hooks
  - permissions
  - agents
  - skills
status: mature
related:
  - "[[index-concepts]]"
  - "[[claude-code-config-guide-2026-04]]"
  - "[[Claude Code]]"
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[Neuroplasticite]]"
sources:
  - "[[claude-code-config-guide-2026-04]]"
---

# Claude Code Configuration Pattern

## Definition

Ensemble de **patterns de configuration** pour structurer une instance Claude Code comme un "membre de l'equipe" ayant lu la documentation. Transforme Claude d'un assistant qui fait des suppositions en un collaborateur aligne avec les conventions, permissions, et workflows du projet.

**Analogie fondatrice** : onboarding d'un nouveau developpeur. Sans `.claude/`, Claude travaille en devinant. Avec config, Claude suit les regles de l'equipe.

## Core Patterns (24 parties du guide)

### 1. Structure dual-niveau

| Niveau | Path | Role | Git |
|--------|------|------|-----|
| **Projet** | `<repo>/CLAUDE.md` + `<repo>/.claude/` | Team config | Committed |
| **User** | `~/.claude/` | Personal config | Never committed |

Claude lit les 2 a chaque session. Projet override user sur les sujets specifiques au projet.

### 2. CLAUDE.md taille

- **< 200L** : seuil dur (au-dela, adherence Claude chute)
- **Ideal 50L** : concis = plus d'adherence
- **Contenu canonique** : build/test/lint commands + architecture decisions + non-obvious gotchas + conventions
- **Anti-patterns** : pas de dupli linter config, pas de theorie, pas > 200L

### 3. le dossier .claude/rules modulaire + path-scoped

- 1 fichier markdown par sujet (code-style, testing, api, security, database)
- YAML frontmatter `paths: ["src/api/**/*.ts"]` pour load conditionnel
- Resolve le probleme CLAUDE.md 300L non-maintenu

### 4. Permissions tri-tier

| Tier | Comportement | Exemples |
|------|--------------|----------|
| **Allow list** | Execute sans demander | `npm run *`, `git status`, Read, Write, Edit |
| **Deny list** | Hard block (meme si Claude insiste) | `rm -rf *`, `curl *`, `git push --force`, `Read(./.env)` |
| **Middle ground** | Demande confirmation | Tout ce qui n'est ni allow ni deny |

**Philosophie** : generous allow pour safe commands + strict deny pour destructive + middle = filet de securite.

### 5. Hooks semantics (deterministe > suggestion)

- **CLAUDE.md** = suggestion, Claude suit 90% du temps
- **Hook** = garantie, script bash force 100% du temps

**Quand utiliser hook** : si "always" est non-negociable (security, format, test enforcement). Sinon CLAUDE.md suffit.

### 6. Hook events

| Event | Quand | Usage typique |
|-------|-------|---------------|
| **PreToolUse** | AVANT tool exec | Security gate (bloquer commandes) |
| **PostToolUse** | APRES tool success | Cleanup + standards (format auto) |
| **Stop** | Claude declare "done" | Quality gate final (tests) |
| **UserPromptSubmit** | User submit prompt | Validation/log |
| **Notification** | Claude needs attention | Desktop alerts |
| **SessionStart/End** | Setup/cleanup | Context injection + archive |
| **PreCompact** | Avant compaction | Save context snapshot |

### 7. Exit codes (**critique**)

| Exit | Semantic | Comportement |
|------|----------|--------------|
| **0** | Success | Continue |
| **1** | Non-blocking error | Log + continue ⚠️ **ne bloque PAS** |
| **2** | Block | Stop + message renvoye a Claude |

**Erreur #1 frequente** : utiliser exit 1 au lieu de 2 pour securite → **ne bloque rien**. Toujours exit 2 pour vrais blocks.

### 8. Stop hook anti-loop

```bash
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then exit 0; fi  # 2e tentative = allow stop
```

Sans ce check : boucle infinie (Claude stop → hook fail → retry → fail → ...).

### 9. Matcher (PreToolUse/PostToolUse)

- `"Write|Edit|MultiEdit"` → seulement modifications fichiers
- `"Bash"` → seulement commandes shell
- Pas de matcher → tous tools

### 10. 3 hooks canoniques a installer

| Hook | Event | But | Exit semantics |
|------|-------|-----|----------------|
| **Bash firewall** | PreToolUse Bash | Bloque `rm -rf`, `git push --force`, `curl \| bash` | 0 = allow / 2 = block |
| **Auto-format** | PostToolUse Write\|Edit\|MultiEdit | prettier/black auto sur fichier | 0 toujours |
| **Test enforcement** | Stop | npm test + tsc avant "done" | 0 = done / 2 = retry |

### 11. Skills vs Rules vs Agents

| Type | Role | Quand actif |
|------|------|-------------|
| **Rules** | Instructions passives (standards) | Load unconditionnel ou par path |
| **Skills** | Workflows actifs invokes | Claude reconnait task matching description |
| **Agents** | Subagents isoles (context separe) | Explicite (via description match) |

**Difference cle skills/agents** : skill execute dans conversation principale ; agent isole sa propre fenetre context + compresse resultats.

### 12. Agent tool restrictions (**critique**)

Chaque agent doit avoir un **set minimal** de tools :
- code-reviewer → Read, Grep, Glob (pas Write !)
- security-auditor → Read, Grep, Glob (pas Bash !)
- test-writer → Read, Write, Edit, Bash
- documentation-writer → Read, Write, Edit (pas Bash)

Moins un agent a de tools, moins il peut faire d'erreurs.

### 13. Agent model choice

- `haiku` : lecture seule / ciblee (code review)
- `sonnet` : standard (le plus courant)
- `opus` : raisonnement complexe / code critical

Pas besoin d'opus sur tout.

### 14. Auto-memory

- `~/.claude/projects/<project>/` persist notes entre sessions
- Commande `/memory` pour view/edit
- Corrige si Claude retient info incorrecte

### 15. Hooks NO hot-reload

- Modifier un hook pendant session → **pas pris en compte** avant session suivante
- Snapshot au session start
- Toujours restart Claude Code pour tester hook modif

### 16. `chmod +x` obligatoire

- Scripts hooks sans `chmod +x` → **silent fail**
- Pattern : `chmod +x .claude/hooks/*.sh` apres creation

## Setup progressif (8 steps)

| Step | Action | Effort | Value |
|------|--------|--------|-------|
| **1** | `/init` + `CLAUDE.md` concis (< 50L) | 15min | 80% valeur |
| **2** | `.claude/settings.json` allow/deny list | 15min | Critical security |
| **3** | Bash firewall hook (PreToolUse Bash) | 15min | Critical security |
| **4** | Auto-format hook (PostToolUse) | 30min | Quality |
| **5** | Test enforcement Stop hook | 30min | Quality |
| **6** | Decouper rules/ quand CLAUDE.md > 50L | 30-60min | Maintenance |
| **7** | `~/.claude/CLAUDE.md` global perso | 10min | Comfort |
| **8** | Skills + agents pour workflows recurrents | Variable | Scale |

Steps 1-3 (~45min) = 80% valeur. Steps 4-8 = raffinements.

## 10 erreurs courantes

1. CLAUDE.md > 400L → adherence baisse
2. Exit 1 au lieu de 2 pour securite → **ne bloque rien**
3. Pas de `stop_hook_active` → boucle infinie
4. Tout dans CLAUDE.md au lieu de rules/ → non-maintenable
5. Allow list trop restrictive → Claude demande permission pour tout
6. Hooks NO hot-reload → oublier de restart session
7. `chmod +x` oublie → silent fail
8. Dupliquer linter config dans CLAUDE.md → gaspillage context
9. Agents avec trop de tools → plus d'erreurs possibles
10. Ignorer auto-memory → retient parfois incorrect

## Application Foundation OS

**FOS = ~70-80% du pattern applique** :

### ✅ Conforme
- CLAUDE.md 199L (sous 200L)
- 5 hooks actifs (PreToolUse Write/Edit/MultiEdit + Read, SessionStart, SessionEnd, PreCompact)
- 4 agents definis (`.claude/agents/`)
- Allow list minimale (`git:*`, `npm:*`, `npx:*`, `node:*`)
- Pattern auto-memory (`~/.claude/projects/.../memory/`)
- Plugin OMC + claude-obsidian (skills + agents + commands)

### ⚠️ Gaps vs guide

| Gap | Severite | Status |
|-----|----------|--------|
| Deny list vide | 🔴 Critical | A auditer (security-reminder.py : vrai block ou reminder ?) |
| Bash firewall hook dedicate | 🔴 Critical | Meme que ci-dessus |
| Agents tool restrictions | 🟡 Medium | A auditer les 4 agents |
| Test enforcement Stop hook | 🟡 Medium | Redondant avec /session-end ? |
| Auto-format hook | 🟡 Low | Optionnel (ESLint + Prettier IDE suffisent) |
| `CLAUDE.local.md` | 🟡 Low | Optionnel (Kevin solo) |
| le dossier .claude/rules path-scoped | 🟡 Low | FOS utilise `docs/core/` (equivalent) |

### Pattern FOS deviations vs guide

- **`scripts/hooks/`** au lieu de **le dossier .claude/hooks** : coherent avec convention FOS scripts/. Pas changer.
- **`docs/core/`** au lieu de **le dossier .claude/rules** : 7 modules Core OS specifiques (cortex, communication, monitor, tools, planner, worktrees, knowledge). Coherence FOS > standard generique.
- **Plugin claude-obsidian** pour skills : delegation a un ecosysteme externe (v1.4.3). Valide.

## Connections

- [[Claude Code]] — tool central configure par ce pattern
- [[claude-code-config-guide-2026-04]] — source ref complete (24 parties)
- [[Foundation OS]] — application concrete du pattern
- [[Core OS]] — adaptation FOS (docs/core/ au lieu de rules/)
- [[Neuroplasticite]] — auto-memory lien direct
- [[MCP]] — protocole complementaire (integration)

## Sources

- [[claude-code-config-guide-2026-04]] — guide 24 parties paste Kevin 2026-04-19
- Docs Anthropic officielles (ref indirect)
