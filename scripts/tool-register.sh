#!/usr/bin/env bash
set -euo pipefail

# tool-register.sh — CLI pour gerer le catalogue Tools v2
# Usage:
#   bash scripts/tool-register.sh scan       # Detecter outils non-enregistres
#   bash scripts/tool-register.sh rebuild     # Regenerer index.json + README.md
#   bash scripts/tool-register.sh add --category <cat> --path <path>  # Ajouter un outil
#   bash scripts/tool-register.sh --help

REPO_ROOT="$(git rev-parse --show-toplevel)"
TOOLS_DIR="$REPO_ROOT/docs/core/tools"
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
  echo ""
  echo "SCAN — Outils non-enregistres"
  echo ""

  local missing=0

  # Scripts
  echo "[Scripts]"
  for f in "$REPO_ROOT"/scripts/*.sh; do
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
  for f in "$REPO_ROOT"/.claude/commands/*.md; do
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
  for f in "$REPO_ROOT"/.claude/agents/*.md; do
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
  echo ""
  echo "REBUILD — Regeneration index.json + README.md"
  echo ""

  # Rebuild index.json
  node -e "
    const fs = require('fs');
    const path = require('path');
    const dir = '$REGISTRY_DIR';
    const cats = {};
    let total = 0;
    for (const f of fs.readdirSync(dir).sort()) {
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
    for (const [cat, info] of Object.entries(index.categories)) {
      md += '| ' + cat + ' | ' + info.count + ' |\n';
    }
    md += '| **Total** | **' + index.total_tools + '** |\n\n';
    for (const f of fs.readdirSync(dir).sort()) {
      if (!f.endsWith('.json')) continue;
      const name = f.replace('.json','');
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (!Array.isArray(data) || data.length === 0) continue;
      md += '## ' + name.charAt(0).toUpperCase() + name.slice(1) + '\n\n';
      md += '| Outil | Description | Usage |\n|-------|-------------|-------|\n';
      for (const t of data) {
        const desc = (t.description||'').replace(/\|/g, '/').slice(0,70);
        const usage = (t.usage||'').replace(/\|/g, '/');
        md += '| ' + t.name + ' | ' + desc + ' | \`' + usage + '\` |\n';
      }
      md += '\n';
    }
    fs.writeFileSync('$TOOLS_DIR/README.md', md);
    console.log('✅ README.md genere');
  "
}

cmd_add() {
  local category="" toolpath="" toolid=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --category) category="$2"; shift 2 ;;
      --path) toolpath="$2"; shift 2 ;;
      --id) toolid="$2"; shift 2 ;;
      *) echo "Option inconnue: $1"; exit 1 ;;
    esac
  done

  if [ -z "$category" ] || [ -z "$toolpath" ]; then
    echo "Erreur: --category et --path sont requis"
    echo "Usage: bash scripts/tool-register.sh add --category scripts --path scripts/mon-outil.sh"
    exit 1
  fi

  if [ -z "$toolid" ]; then
    toolid="$(basename "$toolpath" | sed 's/\.[^.]*$//')"
  fi

  local regfile="$REGISTRY_DIR/$category.json"

  # Creer le fichier registre s'il n'existe pas
  if [ ! -f "$regfile" ]; then
    echo "[]" > "$regfile"
  fi

  # Verifier si deja enregistre
  if node -e "
    const r=JSON.parse(require('fs').readFileSync('$regfile','utf8'));
    process.exit(r.some(t=>t.id==='$toolid') ? 0 : 1)
  " 2>/dev/null; then
    echo "⚠ '$toolid' deja enregistre dans $category"
    exit 0
  fi

  # Ajouter le squelette
  node -e "
    const fs = require('fs');
    const r = JSON.parse(fs.readFileSync('$regfile','utf8'));
    r.push({
      id: '$toolid',
      name: '$toolid',
      category: '$category',
      path: '$toolpath',
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
    fs.writeFileSync('$regfile', JSON.stringify(r, null, 2) + '\n');
  "

  echo "✅ Squelette ajoute pour '$toolid' dans $category"
  echo "   → Demander a Claude de completer la documentation"
}

# Main
case "${1:-}" in
  scan) cmd_scan ;;
  rebuild) cmd_rebuild ;;
  add) shift; cmd_add "$@" ;;
  --help|-h|"") show_help ;;
  *) echo "Commande inconnue: $1"; show_help; exit 1 ;;
esac
