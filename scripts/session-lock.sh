#!/usr/bin/env bash
# session-lock.sh — verrou local anti-collision Cowork <-> Claude Code CLI
#
# Usage:
#   bash scripts/session-lock.sh acquire <head>   # head = "cowork" | "cli"
#   bash scripts/session-lock.sh release <head>
#   bash scripts/session-lock.sh status
#   bash scripts/session-lock.sh force <head>     # override avec warning
#   bash scripts/session-lock.sh --help
#
# Exit codes:
#   0 OK
#   1 lock detenu par l'autre tete
#   2 usage invalide
#   3 lock expire recupere (warning, pas une erreur)
#
# Le lock vit a la racine du repo (.fos-session.lock), ignore par git.
# Expire automatiquement apres LOCK_TTL_MIN minutes (default 30).
# Format du lock = key=value une ligne par champ, parsable en pur bash.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK_FILE="$REPO_ROOT/.fos-session.lock"
LOCK_TTL_MIN="${LOCK_TTL_MIN:-30}"

usage() {
  sed -n '2,14p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
  exit 2
}

now_epoch() { date -u +%s; }
now_iso()   { date -u +%Y-%m-%dT%H:%M:%SZ; }

read_lock() {
  # Populate vars L_HEAD / L_STARTED / L_EXPIRES / L_EPOCH from lockfile
  L_HEAD=""; L_STARTED=""; L_EXPIRES=""; L_EPOCH=0
  [ -f "$LOCK_FILE" ] || return 1
  while IFS='=' read -r k v; do
    case "$k" in
      head)       L_HEAD="$v" ;;
      started_at) L_STARTED="$v" ;;
      expires_at) L_EXPIRES="$v" ;;
      epoch)      L_EPOCH="$v" ;;
    esac
  done < "$LOCK_FILE"
  return 0
}

is_expired() {
  local now ttl
  now="$(now_epoch)"
  ttl=$(( LOCK_TTL_MIN * 60 ))
  [ "$L_EPOCH" -gt 0 ] || return 0
  [ $(( now - L_EPOCH )) -ge "$ttl" ]
}

write_lock() {
  local head="$1"
  local epoch started expires
  epoch="$(now_epoch)"
  started="$(now_iso)"
  expires="$(date -u -r $(( epoch + LOCK_TTL_MIN * 60 )) +%Y-%m-%dT%H:%M:%SZ 2>/dev/null \
          || date -u -d "@$(( epoch + LOCK_TTL_MIN * 60 ))" +%Y-%m-%dT%H:%M:%SZ)"
  cat > "$LOCK_FILE" <<EOF
head=$head
started_at=$started
expires_at=$expires
epoch=$epoch
EOF
}

cmd_acquire() {
  local head="${1:-}"
  [ -n "$head" ] || usage
  [[ "$head" =~ ^(cowork|cli)$ ]] || { echo "head must be 'cowork' or 'cli'"; exit 2; }

  if read_lock; then
    if [ "$L_HEAD" = "$head" ]; then
      write_lock "$head"  # refresh TTL
      echo "OK lock refresh ($head, TTL ${LOCK_TTL_MIN}min)"
      exit 0
    fi
    if is_expired; then
      echo "WARN lock expire recupere (ancien: $L_HEAD @ $L_STARTED)"
      write_lock "$head"
      exit 3
    fi
    local remaining=$(( (L_EPOCH + LOCK_TTL_MIN * 60 - $(now_epoch)) / 60 ))
    echo "BLOCKED lock detenu par '$L_HEAD' depuis $L_STARTED (reste ~${remaining}min)"
    echo "        force: bash scripts/session-lock.sh force $head"
    exit 1
  fi

  write_lock "$head"
  echo "OK lock acquis ($head, TTL ${LOCK_TTL_MIN}min)"
}

cmd_release() {
  local head="${1:-}"
  [ -n "$head" ] || usage
  if ! read_lock; then
    echo "OK no lock"
    exit 0
  fi
  if [ "$L_HEAD" != "$head" ]; then
    echo "WARN lock detenu par '$L_HEAD' pas '$head' — release refuse"
    exit 1
  fi
  rm -f "$LOCK_FILE"
  echo "OK lock release ($head)"
}

cmd_status() {
  if ! read_lock; then
    echo "FREE aucun lock"
    exit 0
  fi
  local remaining=$(( (L_EPOCH + LOCK_TTL_MIN * 60 - $(now_epoch)) / 60 ))
  if is_expired; then
    echo "EXPIRED $L_HEAD depuis $L_STARTED (recuperable)"
  else
    echo "HELD $L_HEAD depuis $L_STARTED (reste ~${remaining}min)"
  fi
}

cmd_force() {
  local head="${1:-}"
  [ -n "$head" ] || usage
  [[ "$head" =~ ^(cowork|cli)$ ]] || { echo "head must be 'cowork' or 'cli'"; exit 2; }
  if read_lock; then
    echo "WARN override lock '$L_HEAD' -> '$head' (raison: force)"
  fi
  write_lock "$head"
  echo "OK lock force ($head)"
}

case "${1:-}" in
  acquire)   shift; cmd_acquire "$@" ;;
  release)   shift; cmd_release "$@" ;;
  status)    cmd_status ;;
  force)     shift; cmd_force "$@" ;;
  --help|-h) usage ;;
  *)         usage ;;
esac
