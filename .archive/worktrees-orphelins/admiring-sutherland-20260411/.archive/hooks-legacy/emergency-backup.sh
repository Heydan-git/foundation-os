#!/bin/bash
# emergency-backup.sh - Sauvegarde anti-compaction ultra-rapide
# Créé checkpoint complet en < 30s pour recovery immédiate

set -e

BACKUP_DIR="/Users/kevinnoel/.claude/emergency-backups"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_PATH="$BACKUP_DIR/foundation-os-$TIMESTAMP"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[EMERGENCY BACKUP] Creating foundation-os checkpoint...${NC}"

# Créer dossier backup
mkdir -p "$BACKUP_PATH"

# Sauvegarder fichiers critiques MINIMUM pour recovery
echo -e "${YELLOW}[BACKUP] Critical files...${NC}"
cp -R /Users/kevinnoel/foundation-os/*.md "$BACKUP_PATH/" 2>/dev/null || true
cp -R /Users/kevinnoel/foundation-os/app/src "$BACKUP_PATH/app-src/" 2>/dev/null || true
cp -R /Users/kevinnoel/foundation-os/scripts "$BACKUP_PATH/" 2>/dev/null || true
cp /Users/kevinnoel/foundation-os/app/package.json "$BACKUP_PATH/" 2>/dev/null || true
cp /Users/kevinnoel/foundation-os/.claude/settings.json "$BACKUP_PATH/" 2>/dev/null || true

# Sauvegarder état git
cd /Users/kevinnoel/foundation-os
git log --oneline -10 > "$BACKUP_PATH/git-history.txt" 2>/dev/null || true
git status > "$BACKUP_PATH/git-status.txt" 2>/dev/null || true
git diff HEAD > "$BACKUP_PATH/git-diff.txt" 2>/dev/null || true

# Créer manifeste recovery
cat > "$BACKUP_PATH/RECOVERY-INSTRUCTIONS.md" << EOF
# EMERGENCY RECOVERY - Foundation OS

## CONTEXTE BACKUP
- Date: $(date)
- Git HEAD: $(git rev-parse HEAD 2>/dev/null || echo "unknown")
- Files saved: Core MD + app/src/ + scripts/

## RECOVERY STEPS (< 2min)

\`\`\`bash
# Restore files:
cp -R $BACKUP_PATH/*.md /Users/kevinnoel/foundation-os/
cp -R $BACKUP_PATH/app-src/* /Users/kevinnoel/foundation-os/app/src/
cp -R $BACKUP_PATH/scripts/* /Users/kevinnoel/foundation-os/scripts/
\`\`\`

## SCORE ÉTAT AU BACKUP
- Phase 0: 65/100 (foundation solide, fonctionnel manquant)
- Write Capability: 0% (mutations.ts manquant)
- Next: Phase 1 Write Capability implementation

## FICHIERS CRITIQUES MANQUANTS
- app/src/lib/mutations.ts
- app/src/components/forms/
- app/src/contexts/AuthContext.tsx
- supabase/migrations/
EOF

# Nettoyer vieux backups (garder 5 derniers)
ls -t "$BACKUP_DIR"/foundation-os-* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true

# Créer symlink vers backup le plus récent
ln -sf "$BACKUP_PATH" "$BACKUP_DIR/latest"

BACKUP_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)
echo -e "${GREEN}[SUCCESS] Emergency backup created: $BACKUP_PATH ($BACKUP_SIZE)${NC}"
echo -e "${GREEN}[INFO] Latest backup symlink: $BACKUP_DIR/latest${NC}"
echo -e "${YELLOW}[RECOVERY] In case of compaction: cat $BACKUP_DIR/latest/RECOVERY-INSTRUCTIONS.md${NC}"

exit 0