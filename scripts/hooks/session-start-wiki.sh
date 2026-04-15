#!/bin/bash
# session-start-wiki.sh — Wrapper SessionStart Foundation OS + claude-obsidian
# Chaine drift-detector (Foundation OS) + cat wiki/hot.md (pattern Karpathy LLM Wiki)
# Usage : declenche auto via ~/.claude/settings.json hook SessionStart matcher "startup|resume"
# Spec : docs/core/knowledge.md section 5 (Integration Foundation OS > Hooks)
# Regle : aucun exit != 0 (hooks doivent toujours retourner 0 pour ne pas bloquer la session).

set -uo pipefail

# 1. Foundation OS drift-detector (existant, inchange)
if [ -x scripts/drift-detector.sh ]; then
  bash scripts/drift-detector.sh 2>&1 || true
fi

# 2. Wiki hot cache (claude-obsidian pattern Karpathy)
if [ -f wiki/hot.md ]; then
  echo ""
  echo "═══════════════ HOT CACHE (wiki/hot.md) ═══════════════"
  # Limite a 60 lignes pour eviter inondation contexte
  head -60 wiki/hot.md
  echo ""
  echo "═══════════════════════════════════════════════════════"
fi

exit 0
