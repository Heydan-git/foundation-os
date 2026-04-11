#!/usr/bin/env python3
"""
Pre-compiled regex patterns for Foundation OS Core Intelligence
Eliminates 230+ regex recompilations per scan cycle

ZERO import-time side effects: no print() calls.
"""

import re

# =============================================================================
# STATUS DETECTION PATTERNS (status_sync_detector.py)
# =============================================================================

PHASE_PATTERN = re.compile(r"P(\d+)\s*(✅|⏳|❌)", re.IGNORECASE | re.MULTILINE)
ARTIFACT_PATTERN = re.compile(r"fos-([a-z-]+)\.jsx.*?(✅|⏳|❌|livré)", re.IGNORECASE | re.MULTILINE)
SETUP_PATTERN = re.compile(r"e(\d+).*?(✅|⏳|❌)", re.IGNORECASE | re.MULTILINE)
LAYER_PATTERN = re.compile(r"L(\d+[ab]?)\s+.*?(✅|⏳|❌)", re.IGNORECASE | re.MULTILINE)
STATUS_LINE_PATTERN = re.compile(r"(✅|⏳|❌)\s*([^,\n]+)", re.IGNORECASE | re.MULTILINE)

# =============================================================================
# COMMUNICATION PROTOCOL PATTERNS (communication_protocol_v2.py)
# =============================================================================

INTENT_IMPLEMENT = re.compile(r"(implémente|fait|crée|build|code)", re.IGNORECASE)
INTENT_ANALYZE = re.compile(r"(analyse|audit|vérifie|check|regarde)", re.IGNORECASE)
INTENT_FIX = re.compile(r"(corrige|fix|répare|résout)", re.IGNORECASE)
INTENT_UPDATE = re.compile(r"(met à jour|update|modifie|change)", re.IGNORECASE)
INTENT_STATUS = re.compile(r"(statut|état|où en est|c'est quoi)", re.IGNORECASE)
INTENT_EXPLAIN = re.compile(r"(explique|comment|pourquoi|qu'est-ce)", re.IGNORECASE)

FOS_ARTIFACTS = re.compile(r"(fos-[a-z-]+\.jsx|artifact)", re.IGNORECASE)
FOS_PHASES = re.compile(r"(P\d+|Phase \d+)", re.IGNORECASE)
FOS_SETUP = re.compile(r"(setup|installation|configuration)", re.IGNORECASE)
FOS_STATUS = re.compile(r"(status|état|avancement)", re.IGNORECASE)
FOS_CONTRADICTIONS = re.compile(r"(contradiction|incohérence|conflict)", re.IGNORECASE)

ACTION_CREATE_FILE = re.compile(r"(Write|créer fichier|new file)", re.IGNORECASE)
ACTION_READ_FILES = re.compile(r"(Read|lire|scanner|analyser)", re.IGNORECASE)
ACTION_MODIFY_CODE = re.compile(r"(Edit|modifier|changer|update)", re.IGNORECASE)
ACTION_RUN_COMMAND = re.compile(r"(Bash|exécuter|run|install)", re.IGNORECASE)
ACTION_ANALYZE = re.compile(r"(analyser|examiner|vérifier)", re.IGNORECASE)

SOURCE_FOS_FILES = re.compile(r"FOS-[A-Z-]+\.md")
SOURCE_APP_FILES = re.compile(r"app/src/[a-zA-Z/.-]+")
SOURCE_CONFIG_FILES = re.compile(r"\.(json|js|ts|tsx)$")
SOURCE_SCRIPT_FILES = re.compile(r"scripts/[a-zA-Z/.-]+")
SOURCE_MEMORY_FILES = re.compile(r"\.fos/[a-zA-Z/.-]+")

# =============================================================================
# FILE MENTION PATTERNS (short_term_memory.py)
# =============================================================================

FILES_APP_COMPONENTS = re.compile(r'app/src/[a-zA-Z/.-]+\.(tsx|ts|js)')
FILES_ARTIFACTS = re.compile(r'fos-[a-z-]+\.jsx')
FILES_FOS_MD = re.compile(r'FOS-[A-Z-]+\.md')
FILES_CONFIG = re.compile(r'[a-zA-Z.-]+\.(json|js|ts)')
FILES_SCRIPTS = re.compile(r'scripts/[a-zA-Z/.-]+\.(sh|py|js)')

# =============================================================================
# ENHANCED SEMANTIC PATTERNS (enhanced_semantic_setup.py)
# =============================================================================

CHECKPOINTS_PHASE_STATUS = re.compile(r"P\d+\s*(✅|⏳|❌)", re.IGNORECASE)
CHECKPOINTS_ARTIFACTS = re.compile(r"artifacts.*?(\d+/\d+)", re.IGNORECASE)
CHECKPOINTS_SETUP_COMPLETE = re.compile(r"setup.*?(✅|⏳|❌)", re.IGNORECASE)
CHECKPOINTS_INFRASTRUCTURE = re.compile(r"L\d+.*?(✅|⏳|❌)", re.IGNORECASE)

# =============================================================================
# PATTERN COLLECTIONS FOR EASY ACCESS
# =============================================================================

STATUS_PATTERNS = {
    "phase": PHASE_PATTERN,
    "artifact": ARTIFACT_PATTERN,
    "setup": SETUP_PATTERN,
    "layer": LAYER_PATTERN,
    "status_line": STATUS_LINE_PATTERN,
}

INTENT_PATTERNS = {
    "implement": INTENT_IMPLEMENT,
    "analyze": INTENT_ANALYZE,
    "fix": INTENT_FIX,
    "update": INTENT_UPDATE,
    "status": INTENT_STATUS,
    "explain": INTENT_EXPLAIN,
}

FOS_PATTERNS = {
    "artifacts": FOS_ARTIFACTS,
    "phases": FOS_PHASES,
    "setup": FOS_SETUP,
    "status": FOS_STATUS,
    "contradictions": FOS_CONTRADICTIONS,
}

ACTION_PATTERNS = {
    "create_file": ACTION_CREATE_FILE,
    "read_files": ACTION_READ_FILES,
    "modify_code": ACTION_MODIFY_CODE,
    "run_command": ACTION_RUN_COMMAND,
    "analyze": ACTION_ANALYZE,
}

SOURCE_PATTERNS = {
    "FOS_files": SOURCE_FOS_FILES,
    "app_files": SOURCE_APP_FILES,
    "config_files": SOURCE_CONFIG_FILES,
    "script_files": SOURCE_SCRIPT_FILES,
    "memory_files": SOURCE_MEMORY_FILES,
}

FILE_PATTERNS = {
    "app_components": FILES_APP_COMPONENTS,
    "artifacts": FILES_ARTIFACTS,
    "fos_md": FILES_FOS_MD,
    "config": FILES_CONFIG,
    "scripts": FILES_SCRIPTS,
}

# Checkpoint patterns collection (for enhanced_semantic_setup.py)
CHECKPOINT_PATTERNS = {
    "phase_status": CHECKPOINTS_PHASE_STATUS,
    "artifacts": CHECKPOINTS_ARTIFACTS,
    "setup_complete": CHECKPOINTS_SETUP_COMPLETE,
    "infrastructure": CHECKPOINTS_INFRASTRUCTURE,
}
