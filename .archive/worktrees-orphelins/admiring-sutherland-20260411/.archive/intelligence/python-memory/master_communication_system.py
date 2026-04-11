#!/usr/bin/env python3
"""
Master Communication System v2.0 - Foundation OS
Integrates: Contradiction Detection + Communication Protocol + Short Term Memory

ZERO import-time side effects: no print(), lazy singleton.
"""

import json
from pathlib import Path

from .status_sync_detector import FOSCommunicationEnhancer
from .communication_protocol_v2 import (
    get_protocol,
    validate_communication,
    format_validation_for_user,
)
from .short_term_memory import get_memory, add_contradiction, get_context, update_conversation


class MasterCommunicationSystem:

    def __init__(self):
        self.enhancer = FOSCommunicationEnhancer()
        self.protocol = get_protocol()
        self.memory = get_memory()

        self.system_active = False
        self.last_scan = None
        self.communication_guaranteed = False

    def activate_system(self):
        """Activate complete communication system"""

        # Step 1: Scan for contradictions
        report, context = self.enhancer.run_full_analysis()

        # Step 2: Load contradictions into memory
        if report["contradictions_found"] > 0:
            for contradiction in report["contradiction_details"]:
                add_contradiction(contradiction)

        # Step 3: Update protocol with latest context
        self.protocol.current_context = context

        # Step 4: System status
        self.system_active = True
        self.communication_guaranteed = report["contradictions_found"] == 0
        self.last_scan = report["timestamp"]

        return {
            "system_active": True,
            "contradictions_found": report["contradictions_found"],
            "communication_guaranteed": self.communication_guaranteed,
            "files_monitored": report["total_files_scanned"]
        }

    def validate_user_interaction(self, user_query, intended_claude_response):
        """Master validation function - validates before any Claude response"""

        if not self.system_active:
            return {
                "error": "System not activated. Call activate_system() first.",
                "validation_passed": False
            }

        # Step 1: Protocol validation
        validation = validate_communication(user_query, intended_claude_response)

        # Step 2: Update memory with interaction
        update_conversation(user_query, intended_claude_response, "validation_check")

        # Step 3: Format for user display
        formatted_validation = format_validation_for_user(validation)

        # Step 4: Determine if clarification needed
        needs_clarification = validation.get("requires_clarification", False)

        return {
            "validation_passed": not needs_clarification,
            "confidence_level": validation.get("confidence_level", 0.0),
            "contradictions_detected": validation["contradiction_check"]["conflicts_found"],
            "formatted_output": formatted_validation,
            "clarification_needed": validation.get("clarification_needed", []) if needs_clarification else None,
            "raw_validation": validation
        }

    def get_system_status(self):
        """Get comprehensive system status"""

        memory_stats = self.memory.get_memory_stats()
        context = get_context()

        return {
            "timestamp": self.last_scan,
            "system_active": self.system_active,
            "communication_guaranteed": self.communication_guaranteed,
            "memory_stats": memory_stats,
            "current_context": context,
            "subsystem_status": {
                "contradiction_detector": "active" if self.enhancer else "inactive",
                "communication_protocol": "active" if self.protocol else "inactive",
                "short_term_memory": "active" if self.memory else "inactive"
            }
        }

    def emergency_resync(self):
        """Emergency resync if contradictions detected during conversation"""

        report, context = self.enhancer.run_full_analysis()
        self.protocol.current_context = context

        self.memory.working_memory["active_contradictions"] = []
        if report["contradictions_found"] > 0:
            for contradiction in report["contradiction_details"]:
                add_contradiction(contradiction)

        self.communication_guaranteed = report["contradictions_found"] == 0

        return report


# --- Lazy singleton ---
_master_instance = None


def get_master_system():
    """Lazy singleton accessor."""
    global _master_instance
    if _master_instance is None:
        _master_instance = MasterCommunicationSystem()
    return _master_instance


# Backward compat proxy
class _LazyMasterProxy:
    def __getattr__(self, name):
        return getattr(get_master_system(), name)

master_system = _LazyMasterProxy()


# Convenience functions
def activate():
    """Activate the master communication system"""
    return get_master_system().activate_system()

def validate(user_query, claude_response):
    """Validate communication before responding"""
    return get_master_system().validate_user_interaction(user_query, claude_response)

def status():
    """Get system status"""
    return get_master_system().get_system_status()

def resync():
    """Emergency resync"""
    return get_master_system().emergency_resync()
