#!/bin/bash
# session-start-wiki.sh — Wrapper SessionStart Foundation OS + claude-obsidian
# Role : cat wiki/hot.md au SessionStart. Pattern Karpathy LLM Wiki.
# Usage : declenche auto via ~/.claude/settings.json hook SessionStart matcher "startup|resume"
# Spec : docs/core/knowledge.md section 5 (Integration Foundation OS > Hooks)
# Regle : aucun exit != 0 (hooks doivent toujours retourner 0 pour ne pas bloquer la session).
# Note : drift-detector retire d'ici (deja chain dans health-check.sh section INFO, evite double appel).
# Phase 7 refactor mapping/routage 2026-04-17 : cat complet (pas head -60) car hot.md cible 500 mots = ~40-70L max.

set -uo pipefail

if [ -f wiki/hot.md ]; then
  echo ""
  echo "═══════════════ HOT CACHE (wiki/hot.md) ═══════════════"
  cat wiki/hot.md
  echo ""
  echo "═══════════════════════════════════════════════════════"
fi

exit 0
