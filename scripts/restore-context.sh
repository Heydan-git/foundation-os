#!/bin/bash
# restore-context.sh
# Script de restauration post-compactage
# Usage: ./scripts/restore-context.sh [auto|session_id]

set -e

PROJECT_ROOT="/Users/kevinnoel/foundation-os"
CHECKPOINT_DIR="$PROJECT_ROOT/.fos/checkpoints"
SESSION_DIR="$PROJECT_ROOT/.fos/sessions"
KNOWLEDGE_DIR="$PROJECT_ROOT/.fos/knowledge"

# Configuration
RESTORE_MODE="${1:-auto}"
SESSION_ID="${2:-latest}"

echo "🔄 FOUNDATION OS - Restauration contexte démarrée"
echo "Mode: $RESTORE_MODE | Session: $SESSION_ID"

# Fonction de restauration automatique
restore_auto() {
    echo "📂 Recherche dernier checkpoint..."

    # Trouver dernier checkpoint
    local latest_checkpoint
    if [[ -L "$CHECKPOINT_DIR/latest.json" ]]; then
        latest_checkpoint=$(readlink "$CHECKPOINT_DIR/latest.json")
        latest_checkpoint="$CHECKPOINT_DIR/$latest_checkpoint"
    else
        latest_checkpoint=$(ls -t "$CHECKPOINT_DIR"/checkpoint-*.json 2>/dev/null | head -1 || echo "")
    fi

    if [[ -z "$latest_checkpoint" || ! -f "$latest_checkpoint" ]]; then
        echo "❌ Aucun checkpoint trouvé - restauration impossible"
        return 1
    fi

    echo "✅ Checkpoint trouvé: $(basename "$latest_checkpoint")"

    # Charger informations checkpoint
    local checkpoint_time=$(jq -r '.timestamp // "unknown"' "$latest_checkpoint" 2>/dev/null || echo "unknown")
    local files_backed_up=$(jq -r '.backup_files | length' "$latest_checkpoint" 2>/dev/null || echo "0")

    echo "📅 Timestamp: $checkpoint_time"
    echo "📁 Fichiers sauvegardés: $files_backed_up"

    # Restaurer état si fichiers backup disponibles
    if [[ "$files_backed_up" != "0" && "$files_backed_up" != "null" ]]; then
        echo "🔄 Restauration fichiers critiques..."

        # Parcourir backup_files et restaurer si nécessaire
        jq -r '.backup_files[] | select(.status == "backed_up") | .backup' "$latest_checkpoint" 2>/dev/null | while read backup_file; do
            if [[ -n "$backup_file" && -f "$CHECKPOINT_DIR/$backup_file" ]]; then
                local original_file=$(jq -r ".backup_files[] | select(.backup == \"$backup_file\") | .original" "$latest_checkpoint")
                if [[ -n "$original_file" ]]; then
                    echo "  → Vérifiant $original_file"

                    # Restaurer seulement si fichier modifié ou manquant
                    if [[ ! -f "$PROJECT_ROOT/$original_file" ]]; then
                        cp "$CHECKPOINT_DIR/$backup_file" "$PROJECT_ROOT/$original_file"
                        echo "    ✅ Restauré $original_file"
                    fi
                fi
            fi
        done
    fi

    echo "🧠 Chargement knowledge layer..."
    load_knowledge_layer

    echo "📋 Affichage état projet..."
    display_project_status "$latest_checkpoint"

    echo "✅ Restauration automatique terminée"
}

# Charger knowledge layer pour contexte rapide
load_knowledge_layer() {
    if [[ -f "$KNOWLEDGE_DIR/current_state.md" ]]; then
        echo ""
        echo "═══ ÉTAT PROJET (Knowledge Layer) ═══"
        head -20 "$KNOWLEDGE_DIR/current_state.md" 2>/dev/null || echo "Erreur lecture état"
    fi

    if [[ -f "$KNOWLEDGE_DIR/recent_decisions.md" ]]; then
        echo ""
        echo "═══ DÉCISIONS RÉCENTES ═══"
        cat "$KNOWLEDGE_DIR/recent_decisions.md" 2>/dev/null || echo "Aucune décision récente"
    fi
}

# Afficher état projet depuis checkpoint
display_project_status() {
    local checkpoint_file="$1"

    echo ""
    echo "═══ ÉTAT FOUNDATION OS ═══"
    echo "Dernière session: $(jq -r '.project_state.last_session // "unknown"' "$checkpoint_file")"
    echo "Artifacts: $(jq -r '.project_state.artifacts_count // "unknown"' "$checkpoint_file")"
    echo "Stack health: $(jq -r '.project_state.stack_health // "unknown"' "$checkpoint_file")"
    echo ""
    echo "Hot paths:"
    jq -r '.project_state.hot_paths[]? // "- Aucun hot path"' "$checkpoint_file" | head -5 | sed 's/^/  - /'
    echo ""
    echo "Prochaines actions suggérées:"
    jq -r '.next_actions[]? // "- Aucune action définie"' "$checkpoint_file" | sed 's/^/  - /'
    echo ""
}

# Restauration session spécifique
restore_session() {
    local session="$1"
    echo "📋 Restauration session: $session"

    # Chercher métadonnées session
    local session_metadata=$(find "$SESSION_DIR" -name "*$session*metadata.json" | head -1)

    if [[ -z "$session_metadata" || ! -f "$session_metadata" ]]; then
        echo "❌ Session $session introuvable"
        return 1
    fi

    echo "✅ Métadonnées trouvées: $(basename "$session_metadata")"

    # Afficher informations session
    echo ""
    echo "═══ DÉTAILS SESSION $session ═══"
    echo "Date: $(jq -r '.timestamp // "unknown"' "$session_metadata")"
    echo "Fichiers modifiés:"
    jq -r '.filesModified[]? // "- Aucun fichier"' "$session_metadata" | sed 's/^/  - /'
    echo ""
    echo "ADR clés:"
    jq -r '.decisionsKey[]? // "- Aucune décision"' "$session_metadata" | sed 's/^/  - /'
    echo ""
    echo "Actions suivantes:"
    jq -r '.nextActions[]? // "- Aucune action"' "$session_metadata" | sed 's/^/  - /'
}

# Validation intégrité
validate_integrity() {
    echo "🔍 Validation intégrité système..."

    local errors=0

    # Vérifier fichiers critiques
    local critical_files=("FOS-JOURNAL.md" "FOS-MONITORING.md" "FOS-COMMANDER-DATA.md" "CLAUDE.md")

    for file in "${critical_files[@]}"; do
        if [[ ! -f "$PROJECT_ROOT/$file" ]]; then
            echo "❌ Fichier critique manquant: $file"
            ((errors++))
        else
            echo "✅ $file présent"
        fi
    done

    # Vérifier cohérence MD ↔ JSX
    local jsx_count=$(ls -1 "$PROJECT_ROOT"/fos-*.jsx 2>/dev/null | wc -l | xargs)
    local md_data_count=$(ls -1 "$PROJECT_ROOT"/FOS-*-DATA.md 2>/dev/null | wc -l | xargs)

    if [[ "$jsx_count" -gt 0 && "$md_data_count" -gt 0 ]]; then
        echo "✅ Artifacts JSX: $jsx_count | MD-DATA: $md_data_count"
    else
        echo "⚠️  Possible désync MD/JSX: JSX=$jsx_count MD-DATA=$md_data_count"
        ((errors++))
    fi

    # Vérifier structure système
    if [[ -d "$PROJECT_ROOT/.fos" ]]; then
        echo "✅ Structure .fos présente"
    else
        echo "❌ Structure .fos manquante"
        ((errors++))
    fi

    echo ""
    if [[ "$errors" -eq 0 ]]; then
        echo "🎉 VALIDATION RÉUSSIE - Système intègre"
    else
        echo "⚠️  $errors erreurs détectées - Vérifier manuellement"
    fi

    return $errors
}

# Exécution principale
case "$RESTORE_MODE" in
    "auto"|"")
        restore_auto
        ;;
    "session")
        restore_session "$SESSION_ID"
        ;;
    "validate")
        validate_integrity
        ;;
    *)
        echo "Usage: $0 [auto|session session_id|validate]"
        echo ""
        echo "Exemples:"
        echo "  $0 auto          # Restauration automatique dernier checkpoint"
        echo "  $0 session CONV-12  # Restauration session spécifique"
        echo "  $0 validate      # Validation intégrité seulement"
        exit 1
        ;;
esac

echo ""
echo "🏁 Restauration terminée"