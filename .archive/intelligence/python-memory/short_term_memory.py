#!/usr/bin/env python3
"""
Short Term Memory v2.0 - Foundation OS
Real working memory for session continuity

ZERO import-time side effects: no print(), no global instantiation.
Global instance created lazily via get_memory().
"""

import json
import time
from datetime import datetime, timedelta
from pathlib import Path


class FOSShortTermMemory:

    def __init__(self):
        from .config import MEMORY_DIR, WORKING_MEMORY_FILE, CURRENT_SESSION_FILE
        self.memory_dir = MEMORY_DIR
        self.working_memory_file = WORKING_MEMORY_FILE
        self.session_file = CURRENT_SESSION_FILE

        self.working_memory = self.load_working_memory()
        self.session_context = self.load_session_context()

        # Batch I/O optimization: dirty flag + explicit flush
        self._dirty = False
        self._auto_save = True  # Can be disabled for batch operations

    def load_working_memory(self):
        """Load current working memory"""
        try:
            with open(self.working_memory_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, PermissionError):
            return self.create_empty_working_memory()

    def create_empty_working_memory(self):
        """Create empty working memory structure"""
        return {
            "session_id": f"STM_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "conversation_context": {
                "current_topic": "foundation_os_communication_enhancement",
                "user_intent": "implement_100_functional_communication",
                "session_goal": "zero_bullshit_perfect_communication",
                "progress": []
            },
            "active_contradictions": [],
            "recent_decisions": [],
            "working_files": [],
            "next_actions": [],
            "user_preferences": {
                "communication_style": "direct_no_bullshit",
                "response_format": "results_first",
                "validation_required": True
            }
        }

    def load_session_context(self):
        """Load current session context"""
        try:
            with open(self.session_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, PermissionError):
            return {"session_active": False}

    def update_conversation_context(self, user_query, claude_response, action_taken=None):
        """Update conversation context with latest interaction"""

        interaction = {
            "timestamp": datetime.now().isoformat(),
            "user_query": user_query[:200],
            "claude_response": claude_response[:200],
            "action_taken": action_taken,
            "files_involved": self.extract_files_mentioned(user_query + " " + claude_response)
        }

        self.working_memory["conversation_context"]["progress"].append(interaction)

        # Keep only last 20 interactions for short-term memory
        if len(self.working_memory["conversation_context"]["progress"]) > 20:
            self.working_memory["conversation_context"]["progress"] = \
                self.working_memory["conversation_context"]["progress"][-20:]

        self.update_current_focus(user_query)
        self._mark_dirty()

    def extract_files_mentioned(self, text):
        """Extract file mentions from text using pre-compiled patterns"""
        from .regex_patterns import FILE_PATTERNS

        files = []
        for _category, pattern in FILE_PATTERNS.items():
            matches = pattern.findall(text)
            # findall returns tuples for patterns with groups; flatten
            for match in matches:
                if isinstance(match, tuple):
                    files.append(match[0] if match[0] else match[-1])
                else:
                    files.append(match)

        return list(set(files))

    def update_current_focus(self, user_query):
        """Update current topic and focus based on user query"""

        query_lower = user_query.lower()

        # Topic detection
        topics = {
            "communication": ["communication", "parler", "comprendre", "protocol"],
            "contradictions": ["contradiction", "conflit", "incohérence", "status"],
            "memory": ["mémoire", "memory", "contexte", "oubli"],
            "implementation": ["implémente", "fait", "crée", "build"],
            "audit": ["audit", "vérifie", "analyse", "check"],
            "artifacts": ["artifact", "fos-", "jsx"]
        }

        current_topics = []
        for topic, keywords in topics.items():
            if any(keyword in query_lower for keyword in keywords):
                current_topics.append(topic)

        if current_topics:
            self.working_memory["conversation_context"]["current_topic"] = current_topics[0]

        # Intent detection
        intents = {
            "fix_communication": ["communication", "problème", "améliore"],
            "resolve_contradictions": ["contradiction", "résout", "corrige"],
            "implement_system": ["implémente", "système", "fonctionnel"],
            "validate_status": ["statut", "état", "vérifie"]
        }

        for intent, keywords in intents.items():
            if any(keyword in query_lower for keyword in keywords):
                self.working_memory["conversation_context"]["user_intent"] = intent
                break

    def add_active_contradiction(self, contradiction_info):
        """Add active contradiction to working memory"""

        contradiction = {
            "detected_at": datetime.now().isoformat(),
            "type": contradiction_info.get("type", "unknown"),
            "item": contradiction_info.get("item", "unknown"),
            "severity": contradiction_info.get("severity", "medium"),
            "status": "active"
        }

        self.working_memory["active_contradictions"].append(contradiction)

        if len(self.working_memory["active_contradictions"]) > 10:
            self.working_memory["active_contradictions"] = \
                self.working_memory["active_contradictions"][-10:]

        self._mark_dirty()

    def resolve_contradiction(self, contradiction_item):
        """Mark contradiction as resolved"""

        for contradiction in self.working_memory["active_contradictions"]:
            if contradiction["item"] == contradiction_item:
                contradiction["status"] = "resolved"
                contradiction["resolved_at"] = datetime.now().isoformat()

        self._mark_dirty()

    def add_recent_decision(self, decision):
        """Add recent decision to working memory"""

        decision_entry = {
            "timestamp": datetime.now().isoformat(),
            "decision": decision,
            "context": self.working_memory["conversation_context"]["current_topic"]
        }

        self.working_memory["recent_decisions"].append(decision_entry)

        if len(self.working_memory["recent_decisions"]) > 15:
            self.working_memory["recent_decisions"] = \
                self.working_memory["recent_decisions"][-15:]

        self._mark_dirty()

    def add_working_file(self, file_path, action):
        """Track files being worked on"""

        file_entry = {
            "file_path": file_path,
            "action": action,
            "timestamp": datetime.now().isoformat()
        }

        self.working_memory["working_files"] = [
            f for f in self.working_memory["working_files"]
            if f["file_path"] != file_path
        ]

        self.working_memory["working_files"].append(file_entry)

        if len(self.working_memory["working_files"]) > 20:
            self.working_memory["working_files"] = \
                self.working_memory["working_files"][-20:]

        self._mark_dirty()

    def set_next_action(self, action, priority="medium"):
        """Set next action in working memory"""

        action_entry = {
            "action": action,
            "priority": priority,
            "timestamp": datetime.now().isoformat(),
            "status": "pending"
        }

        self.working_memory["next_actions"].append(action_entry)

        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        self.working_memory["next_actions"].sort(
            key=lambda x: priority_order.get(x["priority"], 2)
        )
        self.working_memory["next_actions"] = self.working_memory["next_actions"][:10]

        self._mark_dirty()

    def complete_next_action(self, action):
        """Mark action as completed"""

        for action_entry in self.working_memory["next_actions"]:
            if action_entry["action"] == action:
                action_entry["status"] = "completed"
                action_entry["completed_at"] = datetime.now().isoformat()

        self._mark_dirty()

    def get_context_summary(self):
        """Get current context summary for Claude"""

        return {
            "session_duration": self.calculate_session_duration(),
            "current_focus": {
                "topic": self.working_memory["conversation_context"]["current_topic"],
                "intent": self.working_memory["conversation_context"]["user_intent"],
                "goal": self.working_memory["conversation_context"]["session_goal"]
            },
            "active_issues": {
                "contradictions": len([c for c in self.working_memory["active_contradictions"] if c["status"] == "active"]),
                "pending_actions": len([a for a in self.working_memory["next_actions"] if a["status"] == "pending"])
            },
            "recent_progress": self.working_memory["conversation_context"]["progress"][-3:],
            "working_files": [f["file_path"] for f in self.working_memory["working_files"][-5:]],
            "user_preferences": self.working_memory["user_preferences"]
        }

    def calculate_session_duration(self):
        """Calculate how long current session has been running"""
        try:
            created = datetime.fromisoformat(self.working_memory["created_at"])
            now = datetime.now()
            duration = now - created
            return str(duration).split('.')[0]
        except (KeyError, ValueError, TypeError):
            return "unknown"

    def _mark_dirty(self):
        """Mark working memory as modified"""
        self._dirty = True
        if self._auto_save:
            self.flush()

    def flush(self):
        """Save working memory to file if dirty (batch I/O optimization)"""
        if not self._dirty:
            return

        from .atomic_utils import atomic_json_write

        self.working_memory["last_updated"] = datetime.now().isoformat()
        atomic_json_write(self.working_memory_file, self.working_memory)
        self._dirty = False

    def save_working_memory(self):
        """Legacy method - now just calls flush for backwards compatibility"""
        self._dirty = True
        self.flush()

    def __del__(self):
        """Ensure data is saved when object is destroyed"""
        try:
            self.flush()
        except Exception:
            pass

    def get_memory_stats(self):
        """Get memory statistics"""

        return {
            "session_duration": self.calculate_session_duration(),
            "interactions_tracked": len(self.working_memory["conversation_context"]["progress"]),
            "active_contradictions": len([c for c in self.working_memory["active_contradictions"] if c["status"] == "active"]),
            "recent_decisions": len(self.working_memory["recent_decisions"]),
            "working_files": len(self.working_memory["working_files"]),
            "pending_actions": len([a for a in self.working_memory["next_actions"] if a["status"] == "pending"]),
            "memory_size_kb": self.working_memory_file.stat().st_size / 1024 if self.working_memory_file.exists() else 0
        }


# --- Lazy singleton ---
_memory_instance = None


def get_memory():
    """Lazy singleton accessor. Creates instance on first call."""
    global _memory_instance
    if _memory_instance is None:
        _memory_instance = FOSShortTermMemory()
    return _memory_instance


# Convenience functions (use lazy singleton)
def update_conversation(user_query, claude_response, action=None):
    get_memory().update_conversation_context(user_query, claude_response, action)

def add_contradiction(contradiction):
    get_memory().add_active_contradiction(contradiction)

def add_decision(decision):
    get_memory().add_recent_decision(decision)

def track_file(file_path, action):
    get_memory().add_working_file(file_path, action)

def set_action(action, priority="medium"):
    get_memory().set_next_action(action, priority)

def get_context():
    return get_memory().get_context_summary()


# Backward compatibility: `memory` attribute accessed lazily
class _LazyMemoryProxy:
    """Proxy that creates the singleton on first attribute access."""
    def __getattr__(self, name):
        return getattr(get_memory(), name)

memory = _LazyMemoryProxy()
