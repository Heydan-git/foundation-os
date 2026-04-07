# Phase 1 — Fondations : Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolider les fondations de Foundation OS — CLAUDE.md compact, dead weight nettoye, 2 outils de securite/qualite installes, directive sauvegardee comme reference.

**Architecture:** Le CLAUDE.md actuel (115 lignes, ~750 mots) est restructure pour integrer les imperatifs cles de la directive Kevin sans depasser 1500 mots. Les fichiers morts sont supprimes. Deux outils (security-guidance, gstack) sont installes dans des paths standards sans modifier l'architecture existante.

**Tech Stack:** Bash, Git, Claude Code settings.json, Python 3 (security hook)

---

### Task 1: Sauvegarder la directive originale

**Files:**
- Create: `docs/directive-v1.md`

- [ ] **Step 1: Ecrire la directive complete dans docs/**

Sauvegarder la directive de Kevin (12 sections, IMP-01 a IMP-18, P0-P9) telle quelle dans `docs/directive-v1.md` comme document de reference permanent. Contenu = la directive fournie par Kevin le 2026-04-05, non modifiee.

- [ ] **Step 2: Verifier le fichier**

Run: `wc -l docs/directive-v1.md && head -5 docs/directive-v1.md`
Expected: fichier existant, commence par "# Foundation OS — Directive Claude Code"

- [ ] **Step 3: Commit**

```bash
git add docs/directive-v1.md
git commit -m "docs: sauvegarder directive originale Kevin v1"
```

---

### Task 2: Reecrire CLAUDE.md v2

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Lire le CLAUDE.md actuel et compter les mots**

Run: `wc -w CLAUDE.md`
Expected: ~750 mots actuellement

- [ ] **Step 2: Reecrire CLAUDE.md v2**

Le nouveau CLAUDE.md doit :
- Garder : section "A chaque session" (5 regles), Stack, Regles (Void Glass, commits, JSX), Garde-fous, Anti-bullshit gates, Core OS (Routing, Memory, Monitor, Tools), Structure, Build, Agents, Commands
- Ajouter une section "Imperatifs" compacte (8 regles, pas 18) :

```markdown
## Imperatifs (non-negociable)
- Ne jamais mentir, inventer, ou fabriquer (donnees, URLs, citations)
- Si je ne sais pas ou ne suis pas sur → le dire
- Ne jamais pretendre avoir fini sans verification reelle (build + test)
- Ne pas completer une tache Asana sans OK explicite de Kevin
- 100% ou rien — verifier le repertoire courant avant toute operation fichier
- Plan avant execution, validation Kevin avant changement non-trivial
- MD first : modifier NOM-DATA.md avant NOM.jsx, livrer les deux ensemble
- Avant compactage : sauvegarder l'etat courant. Apres compactage : reverifier
```

- Supprimer : la mention "health-check, supabase-ping, ref-checker (a construire sur demande)" dans Core OS Tools — remplacer par la liste a jour :

```markdown
Existants : validate-void-glass.sh (hook), commit-msg (git hook), health-check.sh (Monitor), supabase-ping (GitHub Actions cron), Vercel auto-deploy.
Backlog : ref-checker (a construire sur demande).
```

- [ ] **Step 3: Compter les mots du nouveau CLAUDE.md**

Run: `wc -w CLAUDE.md`
Expected: < 1500 mots (critere de succes)

- [ ] **Step 4: Verifier que le build passe toujours**

Run: `cd modules/app && npm run build`
Expected: build OK (le CLAUDE.md ne casse pas le build, mais on verifie par discipline)

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude): CLAUDE.md v2 — imperatifs integres, compact"
```

---

### Task 3: Supprimer safeguards.json

**Files:**
- Delete: .claude/safeguards.json _(supprime — fichier inexistant aujourd'hui)_

- [ ] **Step 1: Verifier que safeguards.json n'est reference nulle part**

Run: `grep -r "safeguards" --include="*.json" --include="*.md" --include="*.ts" --include="*.sh" . | grep -v ".git/" | grep -v "node_modules/" | grep -v "safeguards.json"`
Expected: aucune reference (ou seulement dans CONTEXT.md qu'on mettra a jour)

- [ ] **Step 2: Supprimer le fichier**

```bash
git rm .claude/safeguards.json
```

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: supprimer safeguards.json — config sans implementation"
```

---

### Task 4: Trimmer settings.local.json

**Files:**
- Modify: `.claude/settings.local.json`

- [ ] **Step 1: Lire le fichier actuel**

Run: `wc -l .claude/settings.local.json`
Expected: ~144 lignes (massivement trop)

- [ ] **Step 2: Reecrire avec seulement les permissions utiles**

Garder :
- MCP Asana (get_me, get_projects, get_my_tasks, search_objects, create_task_preview, create_task_confirm)
- MCP Notion (notion-search, notion-fetch, notion-create-pages, notion-get-users)
- MCP Figma (whoami, get_design_context, get_screenshot, get_metadata)
- OMC tools (lsp_diagnostics, ast_grep_search, state_list_active, state_get_status, state_read, state_write, notepad_stats)
- WebSearch, WebFetch(domain:github.com), WebFetch(domain:docs.anthropic.com)
- Bash utilitaires courants (wc, chmod, du, mkdir, bash, grep, ls, cat, python3, curl, gh run)

Supprimer :
- Toutes les permissions neon-browser (mcp__neon-browser__*)
- Les Bash one-shot ultra-specifiques (bash check-md-pair.sh ..., les scripts safeguards, etc.)
- Les permissions chrome-devtools specifiques (hover, emulate, close_page)
- Les permissions tmux
- Les Bash avec paths absolus vers des fichiers qui n'existent plus

Le fichier doit passer de ~144 lignes a ~40 lignes.

- [ ] **Step 3: Verifier que le JSON est valide**

Run: `python3 -c "import json; json.load(open('.claude/settings.local.json'))"`
Expected: pas d'erreur

- [ ] **Step 4: Commit**

```bash
git add .claude/settings.local.json
git commit -m "chore: trimmer settings.local.json — garder permissions utiles uniquement"
```

---

### Task 5: Installer security-guidance (Anthropic)

**Files:**
- Modify: `.claude/settings.json` (ajouter hook)
- Create: `scripts/hooks/security-reminder.py`

- [ ] **Step 1: Telecharger le hook Python depuis le repo Anthropic**

```bash
curl -sL https://raw.githubusercontent.com/anthropics/claude-code/main/plugins/security-guidance/hooks/security_reminder_hook.py -o scripts/hooks/security-reminder.py
```

- [ ] **Step 2: Verifier que le script existe et est lisible**

Run: `head -20 scripts/hooks/security-reminder.py`
Expected: script Python avec patterns de detection XSS/injection

- [ ] **Step 3: Ajouter le hook dans settings.json**

Modifier `.claude/settings.json` pour ajouter un second hook PreToolUse :

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "/Users/kevinnoel/foundation-os/scripts/hooks/validate-void-glass.sh \"${file_path:-}\""
          },
          {
            "type": "command",
            "command": "python3 /Users/kevinnoel/foundation-os/scripts/hooks/security-reminder.py \"${tool_name:-}\" \"${file_path:-}\""
          }
        ]
      }
    ]
  }
}
```

Note : verifier la signature exacte du script (arguments attendus) apres telechargement. Adapter la commande si necessaire.

- [ ] **Step 4: Tester le hook**

Creer un fichier test temporaire avec `dangerouslySetInnerHTML` et verifier que le hook le detecte :

Run: `echo '<div dangerouslySetInnerHTML={{__html: userInput}} />' > /tmp/test-xss.tsx && python3 scripts/hooks/security-reminder.py Write /tmp/test-xss.tsx; echo "Exit code: $?"`
Expected: warning affiche, exit code 2 (ou 0 avec warning selon implementation)

- [ ] **Step 5: Nettoyer et commit**

```bash
rm -f /tmp/test-xss.tsx
git add scripts/hooks/security-reminder.py .claude/settings.json
git commit -m "feat(security): installer security-guidance hook — detection XSS/injection"
```

---

### Task 6: Installer gstack

**Files:**
- Create: `~/.claude/skills/gstack/` (hors repo, dans home)

- [ ] **Step 1: Cloner gstack dans le repertoire skills**

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
```

- [ ] **Step 2: Verifier l'installation**

Run: `ls ~/.claude/skills/gstack/SKILL.md ~/.claude/skills/gstack/skills/ 2>&1`
Expected: SKILL.md existe, dossier skills/ contient les sous-skills

- [ ] **Step 3: Verifier que /qa et /cso sont disponibles**

Run: `ls ~/.claude/skills/gstack/skills/ | grep -E "qa|cso|security"`
Expected: au moins qa et cso/security visibles

- [ ] **Step 4: Pas de commit** (installe dans ~/.claude, pas dans le repo)

Documenter dans CONTEXT.md lors de la session-end.

---

### Task 7: Creer docs/index.md

**Files:**
- Create: `docs/index.md`

- [ ] **Step 1: Ecrire le sommaire de navigation**

```markdown
# Foundation OS — Index

> Carte de navigation du projet. Mis a jour a chaque session-end.
> Derniere mise a jour : 2026-04-05

## Code (modules/app/src/)

| Dossier | Contenu |
|---------|---------|
| pages/ | 6 routes : IndexPage, Dashboard, Commander, LoginPage, Phase1Demo, SupabaseCRUDTest |
| components/ | UI : Layout, Card, Badge, StatPill, TabBar |
| components/Commander/ | Panels : Stats, Sessions, Decisions, Risks, Context, NextSteps, Docs |
| components/forms/ | AddSessionForm, EditDecisionModal, NextStepActions |
| lib/ | supabase.ts, database.types.ts, mutations.ts, AuthContext.tsx, useCommander.ts |
| artifacts/ | 7 JSX interactifs (fos-commander, graph, index, knowledge, scale-orchestrator, sync, toolbox) |
| test/ | app.test.tsx, supabase.test.ts, setup.ts |

## Data (modules/app/data/)

7 fichiers MD — pairs des artifacts : commander, graph, index, knowledge, scale-orchestrator, sync, toolbox

## Config

| Fichier | Role |
|---------|------|
| .claude/settings.json | Permissions + hooks (Void Glass, security) |
| .claude/agents/ | 4 agents (os-architect, dev-agent, doc-agent, review-agent) |
| .claude/commands/ | 4 commands (session-start, session-end, new-project, sync) |

## Specs & Docs

| Fichier | Contenu |
|---------|---------|
| docs/core/cortex.md | Routing + agents protocol |
| docs/core/memory.md | 4 tiers de memoire |
| docs/core/monitor.md | Health indicators + verdicts |
| docs/core/tools.md | Automation + scripts |
| docs/design-system.md | Void Glass tokens |
| docs/architecture.md | Architecture globale |
| docs/directive-v1.md | Directive Claude Code originale |
| docs/specs/2026-04-05-foundation-os-v2-design.md | Design spec v2 |

## Scripts

| Script | Role |
|--------|------|
| scripts/health-check.sh | Monitor health (SAIN/DEGRADED/BROKEN) |
| scripts/hooks/validate-void-glass.sh | PreToolUse — bloque couleurs/fonts interdites |
| scripts/hooks/security-reminder.py | PreToolUse — detecte XSS/injection |

## Database

supabase/migrations/001_create_tables.sql — 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs)

## Outils externes

| Outil | Path | Status |
|-------|------|--------|
| OMC | plugin oh-my-claudecode | Actif |
| Superpowers | plugin superpowers v5.0.7 | Actif |
| gstack | ~/.claude/skills/gstack/ | Actif |
| BMAD v6 | _bmad/ | A auditer (Phase 3) |
```

- [ ] **Step 2: Verifier que le fichier est coherent avec le filesystem**

Run: `ls modules/app/src/pages/*.tsx | wc -l && ls modules/app/src/artifacts/*.jsx | wc -l && ls modules/app/data/*.md | wc -l`
Expected: 5+ pages, 7 artifacts, 7 data MD files

- [ ] **Step 3: Commit**

```bash
git add docs/index.md
git commit -m "docs: creer index de navigation du projet"
```

---

### Task 8: Verification finale Phase 1

**Files:**
- Aucune modification

- [ ] **Step 1: Run health-check.sh**

Run: `bash scripts/health-check.sh`
Expected: SAIN (exit code 0)

- [ ] **Step 2: Verifier criteres de succes**

```bash
# CLAUDE.md < 1500 mots
wc -w CLAUDE.md

# safeguards.json supprime
test ! -f .claude/safeguards.json && echo "OK: supprime" || echo "FAIL: existe encore"

# security hook existe
test -f scripts/hooks/security-reminder.py && echo "OK: installe" || echo "FAIL: manquant"

# gstack installe
test -f ~/.claude/skills/gstack/SKILL.md && echo "OK: installe" || echo "FAIL: manquant"

# directive sauvegardee
test -f docs/directive-v1.md && echo "OK: sauvegardee" || echo "FAIL: manquante"

# index existe
test -f docs/index.md && echo "OK: cree" || echo "FAIL: manquant"
```

Expected: tous OK

- [ ] **Step 3: Push tous les commits**

```bash
git push
```

- [ ] **Step 4: Verifier que le CI passe**

Run: `gh run list --limit 1`
Expected: status = completed, conclusion = success

---

## Recapitulatif des commits

| # | Message | Fichiers |
|---|---------|----------|
| 1 | `docs: sauvegarder directive originale Kevin v1` | docs/directive-v1.md |
| 2 | `docs(claude): CLAUDE.md v2 — imperatifs integres, compact` | CLAUDE.md |
| 3 | `chore: supprimer safeguards.json — config sans implementation` | .claude/safeguards.json (supprime) |
| 4 | `chore: trimmer settings.local.json — garder permissions utiles uniquement` | .claude/settings.local.json |
| 5 | `feat(security): installer security-guidance hook — detection XSS/injection` | scripts/hooks/security-reminder.py, .claude/settings.json |
| 6 | `docs: creer index de navigation du projet` | docs/index.md |

Total : 6 commits, ~6 fichiers touches, 1 supprime.
Duree estimee : 1 session.
