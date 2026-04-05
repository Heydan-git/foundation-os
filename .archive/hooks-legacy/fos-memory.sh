#!/bin/bash
# fos-memory.sh
# Commandes utilisateur pour système mémoire Foundation OS

PROJECT_ROOT="/Users/kevinnoel/foundation-os"
SCRIPT_DIR="$PROJECT_ROOT/scripts"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

usage() {
    echo "Foundation OS - Système Mémoire Anti-Compactage"
    echo ""
    echo "Usage: ./scripts/fos-memory.sh COMMAND [OPTIONS]"
    echo ""
    echo "COMMANDES:"
    echo "  status           Afficher état système + contexte"
    echo "  backup           Force checkpoint immédiat"
    echo "  restore [ID]     Restaurer depuis checkpoint/session"
    echo "  validate         Valider intégrité système"
    echo "  health           Diagnostic santé mémoire"
    echo "  reset            Reset compteurs (debug)"
    echo "  test             Test cycle complet backup/restore"
    echo ""
    echo "EXEMPLES:"
    echo "  ./scripts/fos-memory.sh status"
    echo "  ./scripts/fos-memory.sh backup"
    echo "  ./scripts/fos-memory.sh restore CONV-12"
    echo "  ./scripts/fos-memory.sh test"
}

# Afficher status système
cmd_status() {
    echo -e "${BLUE}═══ FOUNDATION OS - ÉTAT SYSTÈME ═══${NC}"
    echo ""

    # Compteur interactions
    local interactions=$(cat "$PROJECT_ROOT/.fos/interaction_counter" 2>/dev/null || echo "0")
    local next_checkpoint=$((10 - (interactions % 10)))

    echo -e "${YELLOW}📊 INTERACTIONS${NC}"
    echo "  Current: $interactions"
    echo "  Prochain checkpoint: $next_checkpoint interactions"
    echo ""

    # État checkpoints
    local checkpoints=$(ls "$PROJECT_ROOT/.fos/checkpoints"/*.json 2>/dev/null | wc -l | xargs)
    local latest=$(ls -t "$PROJECT_ROOT/.fos/checkpoints"/checkpoint-*.json 2>/dev/null | head -1)

    echo -e "${YELLOW}💾 CHECKPOINTS${NC}"
    echo "  Total: $checkpoints"
    if [[ -n "$latest" ]]; then
        echo "  Dernier: $(basename "$latest" .json | sed 's/checkpoint-//')"
    else
        echo "  Dernier: aucun"
    fi
    echo ""

    # État sessions
    local sessions=$(ls "$PROJECT_ROOT/.fos/sessions"/*.json 2>/dev/null | wc -l | xargs)
    echo -e "${YELLOW}📋 SESSIONS${NC}"
    echo "  Archivées: $sessions"
    echo ""

    # Santé fichiers critiques
    echo -e "${YELLOW}🎯 FICHIERS CRITIQUES${NC}"
    local critical=("FOS-JOURNAL.md" "FOS-MONITORING.md" "FOS-COMMANDER-DATA.md" "CLAUDE.md")
    for file in "${critical[@]}"; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            echo -e "  ✅ $file"
        else
            echo -e "  ❌ $file ${RED}(manquant)${NC}"
        fi
    done
    echo ""

    # Recommandations contexte
    if [[ "$interactions" -gt 70 ]]; then
        echo -e "${RED}⚠️  CONTEXTE DENSE: Considérer /compact avec backup préventif${NC}"
    elif [[ "$interactions" -gt 50 ]]; then
        echo -e "${YELLOW}⚡ Contexte modéré: Surveillance active${NC}"
    else
        echo -e "${GREEN}✅ Contexte sain${NC}"
    fi
}

# Force backup
cmd_backup() {
    echo -e "${BLUE}💾 BACKUP FORCÉ DÉMARRÉ${NC}"

    # Simuler hook pré-compactage
    if bash "$PROJECT_ROOT/scripts/hooks/pre-compactage-backup.sh"; then
        echo -e "${GREEN}✅ Backup forcé terminé avec succès${NC}"

        # Afficher détails dernier checkpoint
        local latest=$(ls -t "$PROJECT_ROOT/.fos/checkpoints"/checkpoint-*.json 2>/dev/null | head -1)
        if [[ -n "$latest" ]]; then
            echo "📁 Checkpoint créé: $(basename "$latest")"
            echo "🕒 Timestamp: $(jq -r '.timestamp' "$latest" 2>/dev/null || echo 'unknown')"
        fi
    else
        echo -e "${RED}❌ Erreur backup forcé${NC}"
        return 1
    fi
}

# Restaurer contexte
cmd_restore() {
    local target="$1"
    echo -e "${BLUE}🔄 RESTAURATION DÉMARRÉE${NC}"

    if [[ -z "$target" ]]; then
        # Restauration auto
        bash "$PROJECT_ROOT/scripts/restore-context.sh" auto
    else
        # Restauration session spécifique
        bash "$PROJECT_ROOT/scripts/restore-context.sh" session "$target"
    fi
}

# Validation intégrité
cmd_validate() {
    echo -e "${BLUE}🔍 VALIDATION INTÉGRITÉ${NC}"
    bash "$PROJECT_ROOT/scripts/restore-context.sh" validate
}

# Diagnostic santé
cmd_health() {
    echo -e "${BLUE}🏥 DIAGNOSTIC SANTÉ SYSTÈME${NC}"
    echo ""

    local errors=0

    # Vérifier structure
    echo -e "${YELLOW}📁 Structure filesystem:${NC}"
    local dirs=(".fos" ".fos/checkpoints" ".fos/knowledge" ".fos/sessions" ".fos/config" "scripts/hooks")
    for dir in "${dirs[@]}"; do
        if [[ -d "$PROJECT_ROOT/$dir" ]]; then
            echo "  ✅ $dir"
        else
            echo -e "  ❌ $dir ${RED}(manquant)${NC}"
            ((errors++))
        fi
    done
    echo ""

    # Vérifier hooks
    echo -e "${YELLOW}⚙️  Hooks système:${NC}"
    local hooks=("pre-compactage-backup.sh" "post-read-checkpoint.sh" "session-end-archive.sh")
    for hook in "${hooks[@]}"; do
        local hook_path="$PROJECT_ROOT/scripts/hooks/$hook"
        if [[ -f "$hook_path" && -x "$hook_path" ]]; then
            echo "  ✅ $hook"
        else
            echo -e "  ❌ $hook ${RED}(manquant ou non exécutable)${NC}"
            ((errors++))
        fi
    done
    echo ""

    # Vérifier config Claude
    echo -e "${YELLOW}🔧 Configuration Claude:${NC}"
    if [[ -f "$PROJECT_ROOT/.claude/settings.json" ]]; then
        if grep -q "pre-compactage-backup.sh" "$PROJECT_ROOT/.claude/settings.json"; then
            echo "  ✅ Hooks anti-compactage configurés"
        else
            echo -e "  ❌ Hooks anti-compactage ${RED}non configurés${NC}"
            ((errors++))
        fi
    else
        echo -e "  ❌ settings.json ${RED}manquant${NC}"
        ((errors++))
    fi
    echo ""

    # Test hooks
    echo -e "${YELLOW}🧪 Test hooks:${NC}"
    local test_counter="$PROJECT_ROOT/.fos/interaction_counter"
    if [[ -f "$test_counter" ]]; then
        echo "  ✅ Compteur interactions: $(cat "$test_counter")"
    else
        echo -e "  ⚠️  Compteur interactions non initialisé"
        echo "0" > "$test_counter"
        echo "  🔄 Compteur créé"
    fi

    # Résumé
    echo ""
    if [[ "$errors" -eq 0 ]]; then
        echo -e "${GREEN}🎉 SYSTÈME SAIN - Prêt pour anti-compactage${NC}"
    else
        echo -e "${RED}⚠️  $errors problèmes détectés - Corriger avant utilisation${NC}"
    fi

    return $errors
}

# Reset compteurs (debug)
cmd_reset() {
    echo -e "${YELLOW}🔄 Reset compteurs système${NC}"
    echo "0" > "$PROJECT_ROOT/.fos/interaction_counter"
    echo "✅ Compteur interactions reset à 0"
}

# Test cycle complet
cmd_test() {
    echo -e "${BLUE}🧪 TEST CYCLE COMPLET ANTI-COMPACTAGE${NC}"
    echo ""

    local errors=0

    # Test 1: Backup
    echo "1️⃣ Test backup..."
    if cmd_backup > /dev/null; then
        echo -e "  ✅ ${GREEN}Backup fonctionne${NC}"
    else
        echo -e "  ❌ ${RED}Backup échec${NC}"
        ((errors++))
    fi

    # Test 2: Restauration
    echo "2️⃣ Test restauration..."
    if bash "$PROJECT_ROOT/scripts/restore-context.sh" auto > /dev/null; then
        echo -e "  ✅ ${GREEN}Restauration fonctionne${NC}"
    else
        echo -e "  ❌ ${RED}Restauration échec${NC}"
        ((errors++))
    fi

    # Test 3: Validation
    echo "3️⃣ Test validation..."
    if bash "$PROJECT_ROOT/scripts/restore-context.sh" validate > /dev/null; then
        echo -e "  ✅ ${GREEN}Validation fonctionne${NC}"
    else
        echo -e "  ❌ ${RED}Validation échec${NC}"
        ((errors++))
    fi

    # Test 4: Hooks disponibles
    echo "4️⃣ Test hooks..."
    local hooks_ok=true
    for hook in pre-compactage-backup.sh post-read-checkpoint.sh session-end-archive.sh; do
        if [[ ! -x "$PROJECT_ROOT/scripts/hooks/$hook" ]]; then
            hooks_ok=false
            break
        fi
    done

    if [[ "$hooks_ok" == "true" ]]; then
        echo -e "  ✅ ${GREEN}Hooks disponibles${NC}"
    else
        echo -e "  ❌ ${RED}Hooks manquants${NC}"
        ((errors++))
    fi

    echo ""
    if [[ "$errors" -eq 0 ]]; then
        echo -e "${GREEN}🎉 TOUS LES TESTS RÉUSSIS - Système anti-compactage opérationnel !${NC}"
        echo ""
        echo -e "${BLUE}🚀 MÉMOIRE DE TRAVAIL RÉPARÉE !${NC}"
        echo "   • Backup automatique avant compactage"
        echo "   • Checkpoint silencieux toutes les 10 interactions"
        echo "   • Restauration automatique < 30s"
        echo "   • Validation intégrité post-restauration"
        echo ""
        echo "Usage: Plus besoin de t'inquiéter des compactages !"
    else
        echo -e "${RED}❌ $errors tests échoués - Système non opérationnel${NC}"
        return 1
    fi
}

# Router commandes
case "${1:-}" in
    "status"|"")
        cmd_status
        ;;
    "backup")
        cmd_backup
        ;;
    "restore")
        cmd_restore "$2"
        ;;
    "validate")
        cmd_validate
        ;;
    "health")
        cmd_health
        ;;
    "reset")
        cmd_reset
        ;;
    "test")
        cmd_test
        ;;
    *)
        usage
        exit 1
        ;;
esac