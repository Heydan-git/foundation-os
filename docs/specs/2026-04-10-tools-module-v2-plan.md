# Tools Module v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer une toolbox complète avec catalogue JSON de ~100 outils, routing intelligent, script CLI d'enregistrement, et détection de patterns.

**Architecture:** Catalogue modulaire dans `docs/core/tools/` avec un JSON par catégorie, un index agrégateur, un routing étendu, et un script bash CLI. Intégration dans session-start, sync, et Cortex.

**Tech Stack:** JSON (registre), Bash (tool-register.sh), Node (rebuild index/README)

**Spec:** `docs/specs/2026-04-10-tools-module-v2-design.md`

---

### Task 1: Structure de fichiers et schéma de base

**Files:**
- Create: `docs/core/tools/index.json`
- Create: `docs/core/tools/routing.json`
- Create: `docs/core/tools/patterns.json`
- Create: `docs/core/tools/README.md`
- Create: `docs/core/tools/registry/` (dossier vide pour l'instant)

- [ ] **Step 1: Créer le dossier et les fichiers de base**

```bash
mkdir -p docs/core/tools/registry
```

- [ ] **Step 2: Créer index.json vide**

```json
{
  "version": "1.0",
  "updated": "2026-04-10",
  "total_tools": 0,
  "categories": {}
}
```

Écrire dans `docs/core/tools/index.json`.

- [ ] **Step 3: Créer routing.json vide**

```json
{
  "version": "1.0",
  "rules": [],
  "strategies": {
    "priority": "Utiliser le premier outil, passer au suivant si insuffisant",
    "combine": "Utiliser plusieurs outils en sequence",
    "best_match": "Choisir l'outil dont les triggers matchent le plus le contexte"
  },
  "fallback": "Si aucune regle ne matche → traiter directement sans outil"
}
```

Écrire dans `docs/core/tools/routing.json`.

- [ ] **Step 4: Créer patterns.json vide**

```json
{
  "version": "1.0",
  "patterns": []
}
```

Écrire dans `docs/core/tools/patterns.json`.

- [ ] **Step 5: Créer README.md placeholder**

```markdown
# Foundation OS — Toolbox

> Auto-généré depuis les fichiers registry/*.json. Ne pas éditer manuellement.

Catalogue en cours de construction.
```

Écrire dans `docs/core/tools/README.md`.

- [ ] **Step 6: Commit**

```bash
git add docs/core/tools/
git commit -m "feat(tools): scaffold tools v2 directory structure"
```

---

### Task 2: Registre — Scripts (6 outils)

**Files:**
- Create: `docs/core/tools/registry/scripts.json`
- Read: `scripts/health-check.sh`, `scripts/sync-check.sh`, `scripts/ref-checker.sh`, `scripts/module-scaffold.sh`, `scripts/session-lock.sh`, `scripts/git-hooks/pre-commit`

- [ ] **Step 1: Lire chaque script pour extraire description, usage, dépendances**

Lire les 6 fichiers dans `scripts/`. Pour chaque script, noter :
- Ce qu'il fait (première ligne de commentaire ou `--help`)
- Comment l'invoquer
- Ce qu'il produit comme output
- Quand l'utiliser vs ne pas l'utiliser

- [ ] **Step 2: Écrire scripts.json**

Format : tableau JSON avec un objet par script suivant le schéma spec section 3.

Exemple d'entrée complète pour health-check :

```json
{
  "id": "health-check",
  "name": "Health Check",
  "category": "script",
  "path": "scripts/health-check.sh",
  "description": "Execute les indicateurs Monitor et produit le rapport SAIN/DEGRADED/BROKEN",
  "usage": "bash scripts/health-check.sh",
  "triggers": ["health", "sante", "diagnostic", "etat", "check global"],
  "when_to_use": "Verifier l'etat global du projet avant commit, en session-start, ou quand quelque chose semble casse",
  "when_not_to_use": "Pour un check cible sur un seul module — utiliser directement npm run build",
  "depends_on": ["npm", "vitest", "tsc"],
  "outputs": "Rapport texte : SAIN / DEGRADED / BROKEN avec detail par check",
  "examples": [
    {
      "situation": "Avant un commit",
      "command": "bash scripts/health-check.sh",
      "result": "Verdict SAIN → commit autorise"
    },
    {
      "situation": "Apres une modification majeure",
      "command": "bash scripts/health-check.sh",
      "result": "Verdict DEGRADED → warnings a traiter"
    }
  ],
  "auto_routing": true,
  "priority": 1,
  "added": "2026-04-07",
  "updated": "2026-04-10"
}
```

Faire de même pour les 5 autres scripts : `sync-check`, `ref-checker`, `module-scaffold`, `session-lock`, `pre-commit`.

Écrire dans `docs/core/tools/registry/scripts.json`.

- [ ] **Step 3: Vérifier que le JSON est valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/scripts.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/scripts.json
git commit -m "feat(tools): register 6 scripts in toolbox"
```

---

### Task 3: Registre — Hooks (4 outils)

**Files:**
- Create: `docs/core/tools/registry/hooks.json`
- Read: `scripts/hooks/validate-void-glass.sh`, `scripts/hooks/security-reminder.py`, `scripts/git-hooks/pre-commit`, `scripts/git-hooks/commit-msg`

- [ ] **Step 1: Lire chaque hook pour extraire description, déclencheur, comportement**

Lire les 4 fichiers. Pour chaque hook, noter :
- Quand il se déclenche (PreToolUse, pre-commit, commit-msg)
- Ce qu'il bloque ou autorise
- Son output

- [ ] **Step 2: Écrire hooks.json**

Tableau JSON avec un objet par hook suivant le schéma spec section 3. Champs spécifiques :
- `triggers` : les événements qui déclenchent le hook
- `when_to_use` : contexte d'activation (automatique pour les hooks)
- `auto_routing` : `true` pour tous (les hooks sont automatiques par nature)

Écrire dans `docs/core/tools/registry/hooks.json`.

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/hooks.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/hooks.json
git commit -m "feat(tools): register 4 hooks in toolbox"
```

---

### Task 4: Registre — Commands (5 outils)

**Files:**
- Create: `docs/core/tools/registry/commands.json`
- Read: `.claude/commands/cockpit.md`, `.claude/commands/session-start.md`, `.claude/commands/session-end.md`, `.claude/commands/sync.md`, `.claude/commands/new-project.md`

- [ ] **Step 1: Lire chaque command pour extraire description, workflow, usage**

Lire les 5 fichiers. Pour chaque command, noter :
- Ce qu'elle fait (résumé du workflow)
- Quand l'utiliser
- Ce qu'elle produit

- [ ] **Step 2: Écrire commands.json**

Tableau JSON avec un objet par command. Champs spécifiques :
- `usage` : format `/nom-command`
- `triggers` : mots-clés naturels qui devraient déclencher cette command
- `when_to_use` / `when_not_to_use` : guide de routing

Écrire dans `docs/core/tools/registry/commands.json`.

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/commands.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/commands.json
git commit -m "feat(tools): register 5 commands in toolbox"
```

---

### Task 5: Registre — Agents (4 outils)

**Files:**
- Create: `docs/core/tools/registry/agents.json`
- Read: `.claude/agents/dev-agent.md`, `.claude/agents/os-architect.md`, `.claude/agents/review-agent.md`, `.claude/agents/doc-agent.md`

- [ ] **Step 1: Lire chaque agent pour extraire rôle, scope, protocole**

Lire les 4 fichiers + la table Cortex (`docs/core/cortex.md` section 1). Pour chaque agent, noter :
- Son rôle et scope
- Les signaux qui le déclenchent (table Cortex)
- Ses contraintes

- [ ] **Step 2: Écrire agents.json**

Tableau JSON avec un objet par agent. Champs spécifiques :
- `triggers` : signaux de la table Cortex
- `when_to_use` : scope de l'agent
- `when_not_to_use` : ce qui déborde sur un autre agent

Écrire dans `docs/core/tools/registry/agents.json`.

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/agents.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/agents.json
git commit -m "feat(tools): register 4 agents in toolbox"
```

---

### Task 6: Registre — Skills OMC (~40 outils)

**Files:**
- Create: `docs/core/tools/registry/skills-omc.json`
- Read: liste des skills OMC disponibles (exposées dans le system-reminder de session)

- [ ] **Step 1: Collecter la liste complète des skills OMC**

Source : les skills listées dans le system-reminder sous "oh-my-claudecode:*". Pour chaque skill, extraire :
- Nom et description courte (depuis la liste)
- Trigger keywords
- Quand l'utiliser vs pas

Liste des skills OMC à documenter :
`cancel`, `team`, `ultraqa`, `ai-slop-cleaner`, `deepinit`, `writer-memory`, `release`, `hud`, `project-session-manager`, `ask`, `skill`, `ralph`, `learner`, `remember`, `autopilot`, `omc-reference`, `plan`, `deep-interview`, `ralplan`, `setup`, `visual-verdict`, `omc-setup`, `debug`, `omc-doctor`, `trace`, `self-improve`, `external-context`, `verify`, `omc-teams`, `ultrawork`, `skillify`, `ccg`, `configure-notifications`, `sciomc`, `mcp-setup`, `deep-dive`

- [ ] **Step 2: Écrire skills-omc.json**

Tableau JSON avec un objet par skill. Format :

```json
{
  "id": "omc-autopilot",
  "name": "Autopilot",
  "category": "skill-omc",
  "path": "oh-my-claudecode:autopilot",
  "description": "Execution autonome complete : de l'idee au code fonctionnel",
  "usage": "/oh-my-claudecode:autopilot ou keyword 'autopilot'",
  "triggers": ["autopilot", "autonome", "fais tout", "de A a Z"],
  "when_to_use": "Tache claire avec scope defini, quand on veut une execution complete sans interruption",
  "when_not_to_use": "Tache ambigue necessitant des clarifications, ou quand le contexte global est critique",
  "depends_on": [],
  "outputs": "Code fonctionnel, tests, commit",
  "examples": [
    {
      "situation": "Ajouter une feature complete",
      "command": "/oh-my-claudecode:autopilot",
      "result": "Feature implementee, testee, committee"
    }
  ],
  "auto_routing": true,
  "priority": 3,
  "added": "2026-04-10",
  "updated": "2026-04-10"
}
```

Faire de même pour les ~36 autres skills OMC.

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/skills-omc.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/skills-omc.json
git commit -m "feat(tools): register ~40 OMC skills in toolbox"
```

---

### Task 7: Registre — Skills Superpowers (~15 outils)

**Files:**
- Create: `docs/core/tools/registry/skills-superpowers.json`
- Read: liste des skills Superpowers disponibles (exposées dans le system-reminder)

- [ ] **Step 1: Collecter la liste complète des skills Superpowers**

Skills Superpowers à documenter :
`brainstorming`, `test-driven-development`, `subagent-driven-development`, `using-git-worktrees`, `systematic-debugging`, `verification-before-completion`, `writing-plans`, `receiving-code-review`, `requesting-code-review`, `finishing-a-development-branch`, `writing-skills`, `executing-plans`, `dispatching-parallel-agents`, `using-superpowers`

- [ ] **Step 2: Écrire skills-superpowers.json**

Tableau JSON avec un objet par skill, même schéma que Task 6. `category` = `skill-superpowers`, `path` = `superpowers:<nom>`.

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/skills-superpowers.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/skills-superpowers.json
git commit -m "feat(tools): register ~15 Superpowers skills in toolbox"
```

---

### Task 8: Registre — Skills BMAD (12 outils)

**Files:**
- Create: `docs/core/tools/registry/skills-bmad.json`
- Read: `_bmad/_config/skill-manifest.csv`, `_bmad/core/*/SKILL.md`

- [ ] **Step 1: Lire le manifeste BMAD et chaque SKILL.md**

Lire `_bmad/_config/skill-manifest.csv` pour la liste. Puis lire chaque `_bmad/core/*/SKILL.md` pour extraire la description, le workflow, et les cas d'usage.

Skills BMAD à documenter :
`bmad-advanced-elicitation`, `bmad-brainstorming`, `bmad-distillator`, `bmad-editorial-review-prose`, `bmad-editorial-review-structure`, `bmad-help`, `bmad-index-docs`, `bmad-init`, `bmad-party-mode`, `bmad-review-adversarial-general`, `bmad-review-edge-case-hunter`, `bmad-shard-doc`

- [ ] **Step 2: Écrire skills-bmad.json**

Tableau JSON, `category` = `skill-bmad`, `path` = `_bmad/core/<nom>/SKILL.md`.

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/skills-bmad.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/skills-bmad.json
git commit -m "feat(tools): register 12 BMAD skills in toolbox"
```

---

### Task 9: Registre — MCP servers (~12 outils)

**Files:**
- Create: `docs/core/tools/registry/mcp.json`
- Read: MCP servers exposés dans le system-reminder de session

- [ ] **Step 1: Collecter la liste des MCP servers connectés**

MCP servers à documenter (depuis CONTEXT.md + system-reminders) :
`Asana`, `Notion`, `Figma`, `Monday.com`, `Gmail`, `Google Calendar`, `Slack`, `ClickUp`, `Chrome DevTools`, `Context7`, `Pencil`, `computer-use`, `Neon Browser`

Pour chaque MCP, noter :
- Quelles actions il permet
- Quand l'utiliser
- État d'authentification (connecté, auth requise)

- [ ] **Step 2: Écrire mcp.json**

Tableau JSON, `category` = `mcp`, `path` = namespace MCP (ex: `mcp__claude_ai_Asana`).

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/mcp.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/mcp.json
git commit -m "feat(tools): register ~12 MCP servers in toolbox"
```

---

### Task 10: Registre — CI/CD (2 outils)

**Files:**
- Create: `docs/core/tools/registry/ci.json`
- Read: `.github/workflows/` (si existe), `modules/app/vercel.json` (si existe)

- [ ] **Step 1: Documenter Vercel et GitHub Actions**

2 outils :
- **Vercel auto-deploy** : deploy sur git push vers main, root dir = modules/app
- **GitHub Actions supabase-ping** : cron hebdo, SELECT 1 pour éviter pause 7j

- [ ] **Step 2: Écrire ci.json**

```json
[
  {
    "id": "vercel-deploy",
    "name": "Vercel Auto-Deploy",
    "category": "ci",
    "path": "modules/app/vercel.json",
    "description": "Deploy automatique sur Vercel a chaque push sur main",
    "usage": "git push origin main",
    "triggers": ["deploy", "production", "mise en prod", "vercel"],
    "when_to_use": "Deployer une nouvelle version en production",
    "when_not_to_use": "Pour tester localement — utiliser npm run dev",
    "depends_on": ["vercel"],
    "outputs": "URL de production : foundation-os.vercel.app",
    "examples": [
      {
        "situation": "Deployer apres merge",
        "command": "git push origin main",
        "result": "Deploy automatique sur Vercel"
      }
    ],
    "auto_routing": false,
    "priority": 5,
    "added": "2026-04-05",
    "updated": "2026-04-10"
  },
  {
    "id": "supabase-ping",
    "name": "Supabase Ping",
    "category": "ci",
    "path": ".github/workflows/supabase-ping.yml",
    "description": "Cron hebdomadaire qui execute SELECT 1 sur Supabase pour eviter la pause 7j d'inactivite",
    "usage": "Automatique (GitHub Actions cron)",
    "triggers": ["supabase", "database", "ping", "cron"],
    "when_to_use": "Automatique — pas d'intervention manuelle",
    "when_not_to_use": "N/A — tourne tout seul",
    "depends_on": ["github-actions", "supabase"],
    "outputs": "SELECT 1 execute, Supabase reste actif",
    "examples": [
      {
        "situation": "Chaque semaine automatiquement",
        "command": "GitHub Actions cron",
        "result": "Supabase reste actif"
      }
    ],
    "auto_routing": false,
    "priority": 10,
    "added": "2026-04-07",
    "updated": "2026-04-10"
  }
]
```

Écrire dans `docs/core/tools/registry/ci.json`.

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/registry/ci.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/registry/ci.json
git commit -m "feat(tools): register 2 CI/CD tools in toolbox"
```

---

### Task 11: Routing étendu

**Files:**
- Modify: `docs/core/tools/routing.json`
- Read: tous les `registry/*.json` pour extraire les triggers

- [ ] **Step 1: Construire les règles de routing**

Lire chaque registre et grouper les outils par domaine fonctionnel. Créer des règles qui couvrent les cas d'usage courants :

Domaines à couvrir :
- **Debug** : systematic-debugging, omc:debugger, omc:tracer
- **Review** : review-agent, omc:code-reviewer, superpowers:verification-before-completion, superpowers:requesting-code-review
- **Plan** : superpowers:brainstorming, superpowers:writing-plans, omc:plan, omc:ralplan
- **Build/Health** : health-check, sync-check
- **Code** : dev-agent, omc:executor, superpowers:executing-plans
- **Architecture** : os-architect, omc:architect
- **Documentation** : doc-agent, omc:writer
- **Test** : superpowers:test-driven-development, omc:test-engineer, omc:ultraqa
- **Git** : omc:git-master, superpowers:finishing-a-development-branch
- **Exploration** : omc:explore, superpowers:dispatching-parallel-agents
- **Design UI** : omc:designer, superpowers:frontend-design
- **Sécurité** : omc:security-reviewer, security-reminder
- **MCP externe** : Asana, Notion, Figma, etc.
- **BMAD** : brainstorming, elicitation, review, distillator

- [ ] **Step 2: Écrire routing.json complet**

Remplir le tableau `rules` avec une règle par domaine, en suivant le format spec section 5. Chaque règle a : `signals`, `tools` (ordonnés par priorité), `strategy`, `note`.

- [ ] **Step 3: Vérifier JSON valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/routing.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/routing.json
git commit -m "feat(tools): build extended routing rules for ~14 domains"
```

---

### Task 12: Index et README auto-généré

**Files:**
- Modify: `docs/core/tools/index.json`
- Modify: `docs/core/tools/README.md`
- Read: tous les `registry/*.json`

- [ ] **Step 1: Calculer l'index depuis les registres**

Lire chaque `registry/*.json`, compter les entrées, produire l'index complet :

```json
{
  "version": "1.0",
  "updated": "2026-04-10",
  "total_tools": 100,
  "categories": {
    "scripts": { "file": "registry/scripts.json", "count": 6 },
    "hooks": { "file": "registry/hooks.json", "count": 4 },
    "commands": { "file": "registry/commands.json", "count": 5 },
    "agents": { "file": "registry/agents.json", "count": 4 },
    "skills-omc": { "file": "registry/skills-omc.json", "count": 37 },
    "skills-superpowers": { "file": "registry/skills-superpowers.json", "count": 14 },
    "skills-bmad": { "file": "registry/skills-bmad.json", "count": 12 },
    "mcp": { "file": "registry/mcp.json", "count": 13 },
    "ci": { "file": "registry/ci.json", "count": 2 }
  }
}
```

Les counts seront ajustés au nombre réel après population.

- [ ] **Step 2: Générer README.md**

Lire tous les registres et produire un README lisible avec :
- Tableau récapitulatif par catégorie (nom, count)
- Pour chaque catégorie : tableau avec id, name, description, usage
- Footer : "Auto-généré le YYYY-MM-DD depuis registry/*.json"

Format :

```markdown
# Foundation OS — Toolbox

> Auto-généré le 2026-04-10 depuis registry/*.json. Ne pas éditer manuellement.

## Résumé

| Catégorie | Nombre |
|-----------|--------|
| Scripts | 6 |
| Hooks | 4 |
| ... | ... |
| **Total** | **100** |

## Scripts

| Outil | Description | Usage |
|-------|-------------|-------|
| health-check | Execute les indicateurs Monitor... | `bash scripts/health-check.sh` |
| ... | ... | ... |

## Hooks

...
```

- [ ] **Step 3: Vérifier JSON index valide**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/core/tools/index.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docs/core/tools/index.json docs/core/tools/README.md
git commit -m "feat(tools): generate index and README from registry"
```

---

### Task 13: Script tool-register.sh

**Files:**
- Create: `scripts/tool-register.sh`

- [ ] **Step 1: Écrire le script**

```bash
#!/usr/bin/env bash
set -euo pipefail

# tool-register.sh — CLI pour gérer le catalogue Tools v2
# Usage:
#   bash scripts/tool-register.sh scan       # Detecter outils non-enregistres
#   bash scripts/tool-register.sh rebuild     # Regenerer index.json + README.md
#   bash scripts/tool-register.sh add --category <cat> --path <path>  # Ajouter un outil
#   bash scripts/tool-register.sh --help

TOOLS_DIR="$(git rev-parse --show-toplevel)/docs/core/tools"
REGISTRY_DIR="$TOOLS_DIR/registry"

show_help() {
  cat <<'EOF'
tool-register.sh — Gestion du catalogue Tools v2

Commands:
  scan      Detecter les outils non-enregistres (scripts, commands, agents)
  rebuild   Regenerer index.json et README.md depuis les registres
  add       Ajouter un squelette d'outil au registre
  --help    Afficher cette aide

Options pour 'add':
  --category <cat>   Categorie : scripts|hooks|commands|agents|skills-omc|skills-superpowers|skills-bmad|mcp|ci
  --path <path>      Chemin du fichier ou namespace de l'outil
  --id <id>          Identifiant unique (optionnel, derive du path si absent)

Exemples:
  bash scripts/tool-register.sh scan
  bash scripts/tool-register.sh rebuild
  bash scripts/tool-register.sh add --category scripts --path scripts/mon-outil.sh
EOF
}

cmd_scan() {
  local root
  root="$(git rev-parse --show-toplevel)"
  local missing=0

  echo "SCAN — Outils non-enregistres"
  echo ""

  # Scripts
  echo "[Scripts]"
  for f in "$root"/scripts/*.sh; do
    [ -f "$f" ] || continue
    local name
    name="$(basename "$f" .sh)"
    if ! node -e "
      const r=JSON.parse(require('fs').readFileSync('$REGISTRY_DIR/scripts.json','utf8'));
      process.exit(r.some(t=>t.id==='$name') ? 0 : 1)
    " 2>/dev/null; then
      echo "  ⚠ MANQUANT: $name ($f)"
      missing=$((missing + 1))
    fi
  done

  # Commands
  echo "[Commands]"
  for f in "$root"/.claude/commands/*.md; do
    [ -f "$f" ] || continue
    local name
    name="$(basename "$f" .md)"
    if ! node -e "
      const r=JSON.parse(require('fs').readFileSync('$REGISTRY_DIR/commands.json','utf8'));
      process.exit(r.some(t=>t.id==='$name') ? 0 : 1)
    " 2>/dev/null; then
      echo "  ⚠ MANQUANT: $name ($f)"
      missing=$((missing + 1))
    fi
  done

  # Agents
  echo "[Agents]"
  for f in "$root"/.claude/agents/*.md; do
    [ -f "$f" ] || continue
    local name
    name="$(basename "$f" .md)"
    if ! node -e "
      const r=JSON.parse(require('fs').readFileSync('$REGISTRY_DIR/agents.json','utf8'));
      process.exit(r.some(t=>t.id==='$name') ? 0 : 1)
    " 2>/dev/null; then
      echo "  ⚠ MANQUANT: $name ($f)"
      missing=$((missing + 1))
    fi
  done

  echo ""
  if [ "$missing" -eq 0 ]; then
    echo "✅ Tous les outils detectables sont enregistres"
  else
    echo "⚠ $missing outil(s) non-enregistre(s)"
    echo "   → Utiliser 'add' pour les ajouter ou demander a Claude de completer la doc"
  fi
}

cmd_rebuild() {
  echo "REBUILD — Regeneration index.json + README.md"

  # Rebuild index.json
  node -e "
    const fs = require('fs');
    const path = require('path');
    const dir = '$REGISTRY_DIR';
    const cats = {};
    let total = 0;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      const name = f.replace('.json','');
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const count = Array.isArray(data) ? data.length : 0;
      cats[name] = { file: 'registry/' + f, count };
      total += count;
    }
    const index = {
      version: '1.0',
      updated: new Date().toISOString().slice(0,10),
      total_tools: total,
      categories: cats
    };
    fs.writeFileSync('$TOOLS_DIR/index.json', JSON.stringify(index, null, 2) + '\n');
    console.log('✅ index.json — ' + total + ' outils dans ' + Object.keys(cats).length + ' categories');
  "

  # Rebuild README.md
  node -e "
    const fs = require('fs');
    const path = require('path');
    const dir = '$REGISTRY_DIR';
    const index = JSON.parse(fs.readFileSync('$TOOLS_DIR/index.json', 'utf8'));
    let md = '# Foundation OS — Toolbox\n\n';
    md += '> Auto-genere le ' + index.updated + ' depuis registry/*.json. Ne pas editer manuellement.\n\n';
    md += '## Resume\n\n| Categorie | Nombre |\n|-----------|--------|\n';
    let total = 0;
    for (const [cat, info] of Object.entries(index.categories)) {
      md += '| ' + cat + ' | ' + info.count + ' |\n';
      total += info.count;
    }
    md += '| **Total** | **' + total + '** |\n\n';
    for (const f of fs.readdirSync(dir).sort()) {
      if (!f.endsWith('.json')) continue;
      const name = f.replace('.json','');
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (!Array.isArray(data) || data.length === 0) continue;
      md += '## ' + name.charAt(0).toUpperCase() + name.slice(1) + '\n\n';
      md += '| Outil | Description | Usage |\n|-------|-------------|-------|\n';
      for (const t of data) {
        md += '| ' + t.name + ' | ' + (t.description||'').slice(0,60) + ' | \`' + (t.usage||'') + '\` |\n';
      }
      md += '\n';
    }
    fs.writeFileSync('$TOOLS_DIR/README.md', md);
    console.log('✅ README.md genere');
  "
}

cmd_add() {
  local category="" toolpath="" toolid=""
  while [[ \$# -gt 0 ]]; do
    case "\$1" in
      --category) category="\$2"; shift 2 ;;
      --path) toolpath="\$2"; shift 2 ;;
      --id) toolid="\$2"; shift 2 ;;
      *) echo "Option inconnue: \$1"; exit 1 ;;
    esac
  done

  if [ -z "\$category" ] || [ -z "\$toolpath" ]; then
    echo "Erreur: --category et --path sont requis"
    echo "Usage: bash scripts/tool-register.sh add --category scripts --path scripts/mon-outil.sh"
    exit 1
  fi

  if [ -z "\$toolid" ]; then
    toolid="\$(basename "\$toolpath" | sed 's/\.[^.]*$//')"
  fi

  local regfile="\$REGISTRY_DIR/\$category.json"

  # Creer le fichier registre s'il n'existe pas
  if [ ! -f "\$regfile" ]; then
    echo "[]" > "\$regfile"
  fi

  # Verifier si deja enregistre
  if node -e "
    const r=JSON.parse(require('fs').readFileSync('\$regfile','utf8'));
    process.exit(r.some(t=>t.id==='\$toolid') ? 0 : 1)
  " 2>/dev/null; then
    echo "⚠ '\$toolid' deja enregistre dans \$category"
    exit 0
  fi

  # Ajouter le squelette
  node -e "
    const fs = require('fs');
    const r = JSON.parse(fs.readFileSync('\$regfile','utf8'));
    r.push({
      id: '\$toolid',
      name: '\$toolid',
      category: '\$category',
      path: '\$toolpath',
      description: 'TODO — completer',
      usage: 'TODO — completer',
      triggers: [],
      when_to_use: 'TODO — completer',
      when_not_to_use: 'TODO — completer',
      depends_on: [],
      outputs: 'TODO — completer',
      examples: [],
      auto_routing: false,
      priority: 5,
      added: new Date().toISOString().slice(0,10),
      updated: new Date().toISOString().slice(0,10)
    });
    fs.writeFileSync('\$regfile', JSON.stringify(r, null, 2) + '\n');
  "

  echo "✅ Squelette ajoute pour '\$toolid' dans \$category"
  echo "   → Demander a Claude de completer la documentation"
}

# Main
case "\${1:-}" in
  scan) cmd_scan ;;
  rebuild) cmd_rebuild ;;
  add) shift; cmd_add "\$@" ;;
  --help|-h|"") show_help ;;
  *) echo "Commande inconnue: \$1"; show_help; exit 1 ;;
esac
```

Écrire dans `scripts/tool-register.sh`.

- [ ] **Step 2: Rendre exécutable et tester --help**

```bash
chmod +x scripts/tool-register.sh
bash scripts/tool-register.sh --help
```

Expected: affiche l'aide sans erreur.

- [ ] **Step 3: Tester scan**

```bash
bash scripts/tool-register.sh scan
```

Expected: liste des outils détectés, 0 manquants si les registres sont complets.

- [ ] **Step 4: Tester rebuild**

```bash
bash scripts/tool-register.sh rebuild
```

Expected: `index.json` et `README.md` régénérés avec les bons counts.

- [ ] **Step 5: Commit**

```bash
git add scripts/tool-register.sh
git commit -m "feat(tools): add tool-register.sh CLI for toolbox management"
```

---

### Task 14: Intégration OS

**Files:**
- Modify: `docs/core/tools.md` (ajouter référence au catalogue)
- Modify: `docs/core/cortex.md` (ajouter routing.json dans l'arbre de décision)
- Modify: `CLAUDE.md` (ajouter section Tools)
- Modify: `CONTEXT.md` (mettre à jour Modules + Decisions + Sessions)

- [ ] **Step 1: Mettre à jour docs/core/tools.md**

Ajouter après la section 1 existante :

```markdown
## 1b. Catalogue complet (Tools v2)

Inventaire exhaustif de tous les outils : `docs/core/tools/index.json`.
Registres par catégorie : `docs/core/tools/registry/*.json`.
Vue lisible : `docs/core/tools/README.md`.
Script CLI : `bash scripts/tool-register.sh --help`.

Le catalogue est la source de vérité pour le routing intelligent.
```

- [ ] **Step 2: Mettre à jour docs/core/cortex.md section 1**

Ajouter avant la table de routing agents :

```markdown
### Routing étendu (Tools v2)

Avant la table agents ci-dessous, vérifier `docs/core/tools/routing.json` pour un match plus granulaire. Si un outil/skill matche → l'utiliser directement. Sinon → fallback sur la table agents.
```

- [ ] **Step 3: Mettre à jour CLAUDE.md section Core OS — Tools**

Remplacer la ligne existante par :

```markdown
## Core OS — Tools

Spec base : `docs/core/tools.md`. Catalogue complet : `docs/core/tools/index.json`.
Routing etendu : `docs/core/tools/routing.json`. CLI : `bash scripts/tool-register.sh`.
En session-start, lire l'index pour le routing intelligent des outils.
Quand un outil evolue, mettre a jour sa doc via `tool-register.sh rebuild`.
```

- [ ] **Step 4: Mettre à jour CONTEXT.md**

- Table Modules : mettre à jour la ligne Core OS pour mentionner Tools v2
- Decisions : ajouter `D-TOOLS-01 Catalogue modulaire v2`
- Sessions récentes : ajouter résumé de la session

- [ ] **Step 5: Commit**

```bash
git add docs/core/tools.md docs/core/cortex.md CLAUDE.md CONTEXT.md
git commit -m "feat(tools): integrate Tools v2 into OS (cortex, CLAUDE.md, CONTEXT.md)"
```

---

### Task 15: Vérification finale

**Files:**
- Read: tous les fichiers créés/modifiés

- [ ] **Step 1: Valider tous les JSON**

```bash
for f in docs/core/tools/registry/*.json docs/core/tools/index.json docs/core/tools/routing.json docs/core/tools/patterns.json; do
  node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" && echo "✅ $f" || echo "❌ $f"
done
```

Expected: tous ✅.

- [ ] **Step 2: Exécuter tool-register.sh scan**

```bash
bash scripts/tool-register.sh scan
```

Expected: 0 outils manquants pour scripts/commands/agents.

- [ ] **Step 3: Exécuter tool-register.sh rebuild**

```bash
bash scripts/tool-register.sh rebuild
```

Expected: index.json et README.md à jour, counts corrects.

- [ ] **Step 4: Run health-check**

```bash
bash scripts/health-check.sh
```

Expected: SAIN.

- [ ] **Step 5: Run build**

```bash
npm run build -w modules/app
```

Expected: build OK (le module Tools est doc-only, ne casse pas le build).

- [ ] **Step 6: Vérifier refs**

```bash
bash scripts/ref-checker.sh
```

Expected: 0 refs cassées (les nouveaux fichiers sont correctement référencés).
