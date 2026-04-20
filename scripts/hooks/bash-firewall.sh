#!/bin/bash
# bash-firewall.sh - Foundation OS Bash firewall (PreToolUse Bash)
#
# Role : bloque les commandes bash destructives AVANT execution par Claude Code.
# Spec : docs/core/knowledge.md + wiki/concepts/Claude Code Configuration Pattern.md
# Pattern : guide community config CC (wiki/sources/claude-code-config-guide-2026-04.md)
#
# Exit codes :
#   0 = allow (commande safe)
#   2 = BLOCK (commande matche pattern dangereux, message renvoye a Claude)
#
# Usage : hook dans .claude/settings.json PreToolUse matcher Bash
# Test manuel : echo '{"tool_input":{"command":"rm -rf /"}}' | bash scripts/hooks/bash-firewall.sh
#
# IMPORTANT : exit code 2 OBLIGATOIRE pour bloquer (exit 1 = warning non-bloquant).

set -uo pipefail

# Read JSON payload from stdin
INPUT=$(cat)

# Extract command (empty if not a Bash tool call)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  # Pas une commande Bash ou JSON malforme, autoriser (fail-open non-critical)
  exit 0
fi

# Patterns dangereux (regex grep -E compatible, case-insensitive via grep -i)
# Focus : destruction irreversible + force push + pipe bash exec.
# Justification : CLAUDE.md section "Interdit sans Kevin" + guide config CC.
BLOCKED_PATTERNS=(
  # Destruction filesystem
  "rm -rf /($| )"
  "rm -rf ~($| |/)"
  "rm -rf \.($| )"
  "rm -rf \*"
  "rm -rf /(bin|etc|usr|var|home|boot|sbin|lib)"
  # Disk format / overwrite
  "mkfs\."
  "> /dev/sd[a-z]"
  "dd if=.*of=/dev/sd"
  # Git force (jamais sans Kevin, cf CLAUDE.md)
  "git push.*--force($| |')"
  "git push.*-f($| )"
  "git reset --hard origin"
  "git clean -fdx"
  # Permissions root
  "chmod 777 /($| )"
  "chmod -R 777 /($| )"
  # Network pipe exec (code execution from web)
  "curl.*\| *bash"
  "curl.*\| *sh($| )"
  "wget.*\| *bash"
  "wget.*\| *sh($| )"
  "curl.*-o.*\.sh.*&&.*bash"
  # SQL destruction
  "DROP DATABASE"
  "DROP TABLE.*CASCADE"
  "TRUNCATE TABLE"
  # Git history rewrite public
  "git push.*--mirror"
  "git filter-branch"
)

# Check each pattern (case-insensitive via grep -iE)
for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qiE "$pattern"; then
    cat >&2 <<EOF
╔════════════════════════════════════════════════════════════════╗
║  🚫 FOUNDATION OS BASH FIREWALL — COMMAND BLOCKED              ║
╚════════════════════════════════════════════════════════════════╝

Pattern matched : $pattern
Command         : $COMMAND

Reason : This command matches a destructive pattern that Foundation OS
blocks automatically. Raison racine : perte de donnees irreversible,
force push sur remote, ou code execution from web.

If intentional : run the command manually outside Claude Code session,
OR edit scripts/hooks/bash-firewall.sh to exclude this specific case
with explicit justification in commit message.

Reference :
- CLAUDE.md section "Interdit sans Kevin"
- wiki/concepts/Claude Code Configuration Pattern.md
- scripts/hooks/bash-firewall.sh
EOF
    exit 2
  fi
done

# Commande safe, autoriser
exit 0
