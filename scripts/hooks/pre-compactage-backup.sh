#!/bin/bash
# pre-compactage-backup.sh
# Hook PreToolUse pour backup avant compactage/clear

set -e

# Configuration
PROJECT_ROOT="/Users/kevinnoel/foundation-os"
CHECKPOINT_DIR="$PROJECT_ROOT/.fos/checkpoints"
KNOWLEDGE_DIR="$PROJECT_ROOT/.fos/knowledge"
TIMESTAMP=$(date +"%Y-%m-%d-%H-%M-%S")
CHECKPOINT_FILE="$CHECKPOINT_DIR/checkpoint-$TIMESTAMP.json"

# Logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] PRE-COMPACTAGE: $1" >> "$PROJECT_ROOT/.fos/hooks.log"
}

log "🚨 COMPACTAGE DÉTECTÉ - Backup préventif démarré"

# Créer checkpoint simple mais efficace
create_checkpoint() {
    local current_time=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)

    # Créer JSON step by step pour éviter problèmes heredoc
    echo "{" > "$CHECKPOINT_FILE"
    echo "  \"timestamp\": \"$current_time\"," >> "$CHECKPOINT_FILE"
    echo "  \"type\": \"pre_compactage\"," >> "$CHECKPOINT_FILE"
    echo "  \"context_trigger\": \"compactage_immanent\"," >> "$CHECKPOINT_FILE"
    echo "  \"files_critical\": {" >> "$CHECKPOINT_FILE"

    # Fichiers critiques avec MD5
    local first=true
    for file in FOS-*.md CLAUDE.md SKILL.md; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            if [[ "$first" == "false" ]]; then
                echo "," >> "$CHECKPOINT_FILE"
            fi
            first=false

            local md5_hash=$(md5 -q "$PROJECT_ROOT/$file" 2>/dev/null || echo "error")
            local file_size=$(wc -c < "$PROJECT_ROOT/$file" 2>/dev/null || echo 0)

            echo "    \"$file\": {" >> "$CHECKPOINT_FILE"
            echo "      \"md5\": \"$md5_hash\"," >> "$CHECKPOINT_FILE"
            echo "      \"size\": $file_size" >> "$CHECKPOINT_FILE"
            echo -n "    }" >> "$CHECKPOINT_FILE"
        fi
    done

    echo "" >> "$CHECKPOINT_FILE"
    echo "  }," >> "$CHECKPOINT_FILE"

    # État projet
    local last_session=$(grep -o 'CONV-[0-9][0-9]*' "$PROJECT_ROOT/FOS-JOURNAL.md" 2>/dev/null | tail -1 || echo 'CONV-UNKNOWN')
    local artifacts_count=$(ls -1 "$PROJECT_ROOT"/fos-*.jsx 2>/dev/null | wc -l | xargs || echo 0)

    echo "  \"project_state\": {" >> "$CHECKPOINT_FILE"
    echo "    \"last_session\": \"$last_session\"," >> "$CHECKPOINT_FILE"
    echo "    \"artifacts_count\": $artifacts_count" >> "$CHECKPOINT_FILE"
    echo "  }," >> "$CHECKPOINT_FILE"

    # Backup files
    echo "  \"backup_files\": [" >> "$CHECKPOINT_FILE"
    local backup_first=true
    for critical_file in FOS-JOURNAL.md FOS-MONITORING.md FOS-COMMANDER-DATA.md; do
        if [[ -f "$PROJECT_ROOT/$critical_file" ]]; then
            local backup_path="$CHECKPOINT_DIR/backup-$TIMESTAMP-$(basename "$critical_file")"
            cp "$PROJECT_ROOT/$critical_file" "$backup_path" 2>/dev/null || continue

            if [[ "$backup_first" == "false" ]]; then
                echo "," >> "$CHECKPOINT_FILE"
            fi
            backup_first=false

            echo "    {" >> "$CHECKPOINT_FILE"
            echo "      \"original\": \"$critical_file\"," >> "$CHECKPOINT_FILE"
            echo "      \"backup\": \"$(basename "$backup_path")\"," >> "$CHECKPOINT_FILE"
            echo "      \"status\": \"backed_up\"" >> "$CHECKPOINT_FILE"
            echo -n "    }" >> "$CHECKPOINT_FILE"
        fi
    done

    echo "" >> "$CHECKPOINT_FILE"
    echo "  ]" >> "$CHECKPOINT_FILE"
    echo "}" >> "$CHECKPOINT_FILE"

    # Symlink latest
    ln -sf "checkpoint-$TIMESTAMP.json" "$CHECKPOINT_DIR/latest.json" 2>/dev/null || true
}

# Mettre à jour knowledge layer
update_knowledge_layer() {
    if [[ -f "$PROJECT_ROOT/FOS-JOURNAL.md" ]]; then
        grep -E "ADR-[0-9]+|Décisions|décision" "$PROJECT_ROOT/FOS-JOURNAL.md" | tail -10 > "$KNOWLEDGE_DIR/recent_decisions.md" 2>/dev/null || true
    fi

    echo "# État Projet $(date)" > "$KNOWLEDGE_DIR/current_state.md"
    echo "Generated before compactage at $(date)" >> "$KNOWLEDGE_DIR/current_state.md"

    if [[ -f "$PROJECT_ROOT/FOS-MONITORING.md" ]]; then
        grep -A 5 -B 2 "Statut global" "$PROJECT_ROOT/FOS-MONITORING.md" >> "$KNOWLEDGE_DIR/current_state.md" 2>/dev/null || true
    fi
}

# Exécution
create_checkpoint
update_knowledge_layer

log "✅ Backup pré-compactage terminé: $CHECKPOINT_FILE"
log "📁 Fichiers sauvegardés: $(ls "$CHECKPOINT_DIR"/backup-$TIMESTAMP-* 2>/dev/null | wc -l | xargs || echo 0)"

exit 0