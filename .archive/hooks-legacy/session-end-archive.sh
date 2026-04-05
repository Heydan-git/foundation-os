#!/bin/bash
# session-end-archive.sh
# Hook Stop pour archiver session et préparer restauration
# Style Memory-Keeper + LIFE journaling

set -e

PROJECT_ROOT="/Users/kevinnoel/foundation-os"
SESSION_DIR="$PROJECT_ROOT/.fos/sessions"
TRANSCRIPT_DIR="$PROJECT_ROOT/.fos/transcripts"
TIMESTAMP=$(date +"%Y-%m-%d-%H-%M-%S")

# Logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] SESSION-END: $1" >> "$PROJECT_ROOT/.fos/hooks.log"
}

log "🏁 Session end détectée - Archivage démarré"

# Créer métadonnées session (Memory-Keeper style)
create_session_metadata() {
    local session_id="CONV-$(date +%m%d)"
    local metadata_file="$SESSION_DIR/${session_id}-metadata.json"

    # Extraire informations session depuis FOS-JOURNAL.md
    local last_session=$(grep -o 'CONV-[A-Z0-9-]*' "$PROJECT_ROOT/FOS-JOURNAL.md" 2>/dev/null | tail -1 || echo "CONV-UNKNOWN")
    local files_modified=($(git diff --name-only HEAD~1 2>/dev/null || echo "no-git-changes"))

    cat > "$metadata_file" <<EOF
{
    "sessionId": "$session_id",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "type": "session_archive",
    "lastSession": "$last_session",
    "filesModified": [
EOF

    # Liste fichiers modifiés
    local first=true
    for file in "${files_modified[@]}"; do
        if [[ "$first" == "true" ]]; then
            first=false
        else
            echo "," >> "$metadata_file"
        fi
        echo -n "        \"$file\"" >> "$metadata_file"
    done

    cat >> "$metadata_file" <<EOF

    ],
    "decisionsKey": [
EOF

    # Extraire ADR récents
    if [[ -f "$PROJECT_ROOT/FOS-JOURNAL.md" ]]; then
        local adrs=($(grep -o 'ADR-[0-9][0-9]*' "$PROJECT_ROOT/FOS-JOURNAL.md" 2>/dev/null | tail -3 || echo))
        local adr_first=true
        for adr in "${adrs[@]}"; do
            if [[ "$adr_first" == "true" ]]; then
                adr_first=false
            else
                echo "," >> "$metadata_file"
            fi
            echo -n "        \"$adr\"" >> "$metadata_file"
        done
    fi

    cat >> "$metadata_file" <<EOF

    ],
    "contextSnapshot": {
        "interactionCount": $(cat "$PROJECT_ROOT/.fos/interaction_counter" 2>/dev/null || echo 0),
        "artifactsCount": $(ls -1 "$PROJECT_ROOT"/fos-*.jsx 2>/dev/null | wc -l | xargs),
        "projectHealth": "$(grep -o '[0-9][0-9]*%.*ready\|[0-9][0-9]*%.*opérationnel' "$PROJECT_ROOT/FOS-MONITORING.md" 2>/dev/null | tail -1 || echo 'unknown')",
        "stackStatus": "$(grep -A 2 'Stack L.*active' "$PROJECT_ROOT/FOS-MONITORING.md" 2>/dev/null | head -1 || echo 'unknown')"
    },
    "nextActions": [
EOF

    # Extraire prochaines actions depuis différentes sources
    local actions=()
    if [[ -f "$PROJECT_ROOT/FOS-JOURNAL.md" ]]; then
        actions+=($(grep -i "next\|suivant\|prochaine" "$PROJECT_ROOT/FOS-JOURNAL.md" 2>/dev/null | tail -1 | sed 's/.*: //' | head -c 50 || echo))
    fi
    if [[ -f "$PROJECT_ROOT/FOS-SCALE-ORCHESTRATOR-DATA.md" ]]; then
        actions+=($(grep -E "e[0-9]+.*à.*faire\|TODO\|⏳" "$PROJECT_ROOT/FOS-SCALE-ORCHESTRATOR-DATA.md" 2>/dev/null | head -1 | head -c 50 || echo))
    fi

    local action_first=true
    for action in "${actions[@]}"; do
        if [[ -n "$action" && "$action" != "echo" ]]; then
            if [[ "$action_first" == "true" ]]; then
                action_first=false
            else
                echo "," >> "$metadata_file"
            fi
            echo -n "        \"$action\"" >> "$metadata_file"
        fi
    done

    cat >> "$metadata_file" <<EOF

    ],
    "keyInsights": [
        "Session archived for context preservation",
        "Ready for seamless restoration"
    ]
}
EOF

    log "📋 Métadonnées session créées: $metadata_file"
}

# Créer transcript session (LIFE/Memento style)
create_session_transcript() {
    local transcript_file="$TRANSCRIPT_DIR/session-$TIMESTAMP.md"

    cat > "$transcript_file" <<EOF
# Session Transcript $(date)
> Archive automatique fin de session
> Restauration: Charger ce fichier pour contexte détaillé

## Session Summary
- **Date**: $(date)
- **Type**: Archive automatique
- **Files modified**: $(git diff --name-only HEAD~1 2>/dev/null | wc -l | xargs) files
- **Interactions**: $(cat "$PROJECT_ROOT/.fos/interaction_counter" 2>/dev/null || echo 0)

## Key Files State
EOF

    # Backup état fichiers critiques dans transcript
    for critical in FOS-JOURNAL.md FOS-MONITORING.md FOS-COMMANDER-DATA.md; do
        if [[ -f "$PROJECT_ROOT/$critical" ]]; then
            echo "### $critical" >> "$transcript_file"
            echo '```' >> "$transcript_file"
            tail -20 "$PROJECT_ROOT/$critical" >> "$transcript_file" 2>/dev/null || echo "Error reading $critical"
            echo '```' >> "$transcript_file"
            echo "" >> "$transcript_file"
        fi
    done

    cat >> "$transcript_file" <<EOF

## Project State Snapshot
- Artifacts: $(ls -1 "$PROJECT_ROOT"/fos-*.jsx 2>/dev/null | xargs | tr '\n' ' ')
- Stack health: $(grep -o 'OS Readiness.*%' "$PROJECT_ROOT/FOS-MONITORING.md" 2>/dev/null | tail -1 || echo 'unknown')
- Last session: $(grep -o 'CONV-[A-Z0-9-]*' "$PROJECT_ROOT/FOS-JOURNAL.md" 2>/dev/null | tail -1 || echo 'unknown')

---
*Archive généré automatiquement - Foundation OS Anti-Compactage System*
EOF

    log "📝 Transcript session créé: $transcript_file"
}

# Reset compteur interactions
reset_interaction_counter() {
    echo "0" > "$PROJECT_ROOT/.fos/interaction_counter"
    log "🔄 Compteur interactions reset"
}

# Cleanup ancien checkpoints (garde dernier 20)
cleanup_old_checkpoints() {
    find "$PROJECT_ROOT/.fos/checkpoints" -name "checkpoint-*.json" -type f | sort | head -n -20 | xargs rm -f 2>/dev/null || true
    find "$PROJECT_ROOT/.fos/checkpoints" -name "silent-*.json" -type f | sort | head -n -50 | xargs rm -f 2>/dev/null || true
    log "🧹 Cleanup anciens checkpoints terminé"
}

# Exécution
create_session_metadata
create_session_transcript
reset_interaction_counter
cleanup_old_checkpoints

log "✅ Session archivée avec succès - Prêt pour restauration future"

exit 0