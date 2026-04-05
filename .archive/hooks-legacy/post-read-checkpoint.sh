#!/bin/bash
# post-read-checkpoint.sh
# Hook PostToolUse pour checkpoint silencieux après lecture
# Style MUSE : toutes les 10 interactions

set -e

PROJECT_ROOT="/Users/kevinnoel/foundation-os"
COUNTER_FILE="$PROJECT_ROOT/.fos/interaction_counter"
CHECKPOINT_DIR="$PROJECT_ROOT/.fos/checkpoints"

# Logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] POST-READ: $1" >> "$PROJECT_ROOT/.fos/hooks.log"
}

# Incrémenter compteur interactions
increment_counter() {
    local count=1
    if [[ -f "$COUNTER_FILE" ]]; then
        count=$(( $(cat "$COUNTER_FILE" 2>/dev/null || echo 0) + 1 ))
    fi
    echo "$count" > "$COUNTER_FILE"
    echo "$count"
}

# Checkpoint silencieux si 10 interactions
silent_checkpoint() {
    local timestamp=$(date +"%Y-%m-%d-%H-%M-%S")
    local checkpoint_file="$CHECKPOINT_DIR/silent-$timestamp.json"

    cat > "$checkpoint_file" <<EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "type": "silent_checkpoint",
    "interaction_count": $1,
    "context_status": "healthy",
    "last_files_accessed": [
EOF

    # Capturer derniers fichiers accédés via OMC project-memory
    if [[ -f "$PROJECT_ROOT/.omc/project-memory.json" ]]; then
        python3 -c "
import json
try:
    with open('$PROJECT_ROOT/.omc/project-memory.json', 'r') as f:
        data = json.load(f)
    recent = sorted(data.get('hotPaths', []), key=lambda x: x.get('lastAccessed', 0), reverse=True)[:3]
    for i, item in enumerate(recent):
        if i > 0: print(',')
        print(f'        \"{item.get(\"path\", \"unknown\")}\"', end='')
except:
    print('        \"error_reading_recent_files\"', end='')
" 2>/dev/null
    fi

    cat >> "$checkpoint_file" <<EOF
    ],
    "quick_snapshot": {
        "fos_files": $(ls -1 "$PROJECT_ROOT"/FOS-*.md 2>/dev/null | wc -l | xargs),
        "jsx_artifacts": $(ls -1 "$PROJECT_ROOT"/fos-*.jsx 2>/dev/null | wc -l | xargs),
        "project_size_kb": $(du -sk "$PROJECT_ROOT" 2>/dev/null | cut -f1 || echo 0)
    }
}
EOF

    log "📷 Silent checkpoint créé: interaction $1"
}

# Exécution principal
count=$(increment_counter)

# Checkpoint silencieux toutes les 10 interactions
if (( count % 10 == 0 )); then
    silent_checkpoint "$count"
fi

# Si > 50 interactions, log warning contexte
if (( count > 50 )); then
    log "⚠️  Contexte dense: $count interactions - considérer compactage préventif"
fi

exit 0