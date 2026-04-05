#!/usr/bin/env python3
"""
Communication Protocol v2.0 - Foundation OS
Real-time validation + contradiction checking + honest communication

ZERO import-time side effects: no print(), lazy singleton.
"""

import json
from datetime import datetime
from pathlib import Path


class FOSCommunicationProtocol:

    def __init__(self):
        from .config import MEMORY_DIR, ENHANCED_CONTEXT_FILE
        self.memory_dir = MEMORY_DIR
        self.context_file = ENHANCED_CONTEXT_FILE
        self.current_context = self.load_enhanced_context()
        self.validation_active = True

    def load_enhanced_context(self):
        """Load current enhanced context with contradictions"""
        try:
            with open(self.context_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, PermissionError):
            return {"contradictions_detected": False, "project_coherence": False}

    def validate_before_response(self, user_query, intended_response):
        """CORE FUNCTION: Validate understanding before responding"""

        validation = {
            "timestamp": datetime.now().isoformat(),
            "user_query": user_query,
            "my_understanding": self.extract_understanding(user_query),
            "intended_action": self.extract_intended_action(intended_response),
            "contradiction_check": self.check_contradictions_relevant(user_query),
            "sources_used": self.identify_sources(intended_response),
            "confidence_level": self.assess_confidence(user_query, intended_response),
            "requires_clarification": False
        }

        if validation["confidence_level"] < 0.8 or validation["contradiction_check"]["conflicts_found"]:
            validation["requires_clarification"] = True
            validation["clarification_needed"] = self.generate_clarification_questions(validation)

        return validation

    def extract_understanding(self, query):
        """Extract what I understand from user query"""
        understanding = {
            "main_intent": "unknown",
            "specific_request": "unknown",
            "scope": "unknown",
            "urgency": "normal"
        }

        from .regex_patterns import INTENT_PATTERNS

        query_lower = query.lower()
        for intent, pattern in INTENT_PATTERNS.items():
            if pattern.search(query_lower):
                understanding["main_intent"] = intent
                break

        # Urgency detection
        if any(word in query_lower for word in ["urgent", "immédiat", "maintenant", "vite"]):
            understanding["urgency"] = "high"

        # Scope detection
        if any(word in query_lower for word in ["tout", "tous", "complet", "exhaustif"]):
            understanding["scope"] = "comprehensive"
        elif any(word in query_lower for word in ["juste", "seulement", "quick"]):
            understanding["scope"] = "limited"

        understanding["specific_request"] = self.extract_specific_request(query)

        return understanding

    def extract_specific_request(self, query):
        """Extract specific request details using pre-compiled patterns"""
        from .regex_patterns import FOS_PATTERNS

        specific = []
        for category, pattern in FOS_PATTERNS.items():
            if pattern.search(query):
                specific.append(category)

        return specific if specific else ["general"]

    def extract_intended_action(self, response):
        """Extract what I intend to do from my response"""
        from .regex_patterns import ACTION_PATTERNS

        intended_actions = []
        for action, pattern in ACTION_PATTERNS.items():
            if pattern.search(response):
                intended_actions.append(action)

        return intended_actions if intended_actions else ["respond_only"]

    def check_contradictions_relevant(self, query):
        """Check if current contradictions are relevant to the query"""

        if not self.current_context.get("critical_contradictions"):
            return {"conflicts_found": False, "relevant_conflicts": []}

        query_lower = query.lower()
        relevant_conflicts = []

        contradiction_areas = ["artifacts", "status", "phase", "setup"]

        for contradiction in self.current_context.get("critical_contradictions", []):
            contradiction_item = contradiction.get("item", "").lower()
            contradiction_type = contradiction.get("type", "").lower()

            if (contradiction_item in query_lower) or any(
                area in contradiction_type for area in contradiction_areas if area in query_lower
            ):
                relevant_conflicts.append(contradiction)

        return {
            "conflicts_found": len(relevant_conflicts) > 0,
            "relevant_conflicts": relevant_conflicts,
            "total_conflicts": len(self.current_context.get("critical_contradictions", []))
        }

    def identify_sources(self, response):
        """Identify what sources I'm planning to use -- uses pre-compiled patterns"""
        from .regex_patterns import SOURCE_PATTERNS

        sources_identified = {}
        for source_type, pattern in SOURCE_PATTERNS.items():
            matches = pattern.findall(response)
            if matches:
                sources_identified[source_type] = list(set(matches))

        return sources_identified

    def assess_confidence(self, query, response):
        """Assess my confidence level in understanding and response"""

        confidence_score = 1.0

        vague_indicators = ["ça", "truc", "chose", "machin", "quelque chose"]
        for indicator in vague_indicators:
            if indicator in query.lower():
                confidence_score -= 0.2

        if self.check_contradictions_relevant(query)["conflicts_found"]:
            confidence_score -= 0.3

        if len(query.split()) > 50:
            confidence_score -= 0.1

        specific_indicators = ["exactement", "précisément", "spécifiquement"]
        for indicator in specific_indicators:
            if indicator in query.lower():
                confidence_score += 0.1

        return max(0.0, min(1.0, confidence_score))

    def generate_clarification_questions(self, validation):
        """Generate specific clarification questions"""

        questions = []

        if validation["contradiction_check"]["conflicts_found"]:
            conflicts = validation["contradiction_check"]["relevant_conflicts"]
            items = [c.get('item', 'unknown') for c in conflicts]
            questions.append(
                f"Contradictions detected in: {items}. What is the REAL status?"
            )

        if validation["confidence_level"] < 0.7:
            questions.append(
                f"I understand intent='{validation['my_understanding']['main_intent']}' "
                f"but can you be more specific?"
            )

        if validation["my_understanding"]["scope"] == "unknown":
            questions.append("Comprehensive or limited scope?")

        return questions

    def format_validation_output(self, validation):
        """Format validation output for user display"""

        output = []
        output.append("UNDERSTANDING:")
        output.append(f"  Intent: {validation['my_understanding']['main_intent']}")
        output.append(f"  Scope: {validation['my_understanding']['scope']}")
        output.append(f"  Confidence: {validation['confidence_level']:.0%}")

        output.append("\nPLANNED ACTION:")
        for action in validation["intended_action"]:
            output.append(f"  - {action}")

        if validation["sources_used"]:
            output.append("\nSOURCES:")
            for source_type, files in validation["sources_used"].items():
                output.append(f"  {source_type}: {len(files)} files")

        if validation["contradiction_check"]["conflicts_found"]:
            output.append(
                f"\nCONFLICTS: {validation['contradiction_check']['total_conflicts']} active contradictions"
            )

        if validation["requires_clarification"]:
            output.append("\nCLARIFICATION NEEDED:")
            for question in validation["clarification_needed"]:
                output.append(f"  - {question}")

        output.append("\nCorrect?")

        return "\n".join(output)

    def save_communication_log(self, validation):
        """Save communication log for analysis"""

        log_entry = {
            "timestamp": validation["timestamp"],
            "validation_result": validation,
            "protocol_version": "v2.0"
        }

        log_file = self.memory_dir / "communication_log.json"

        try:
            with open(log_file, 'r') as f:
                log_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, PermissionError):
            log_data = {"entries": []}

        log_data["entries"].append(log_entry)

        if len(log_data["entries"]) > 50:
            log_data["entries"] = log_data["entries"][-50:]

        from .atomic_utils import atomic_json_write
        atomic_json_write(log_file, log_data)


# --- Lazy singleton ---
_protocol_instance = None


def get_protocol():
    """Lazy singleton accessor."""
    global _protocol_instance
    if _protocol_instance is None:
        _protocol_instance = FOSCommunicationProtocol()
    return _protocol_instance


# Backward compat proxy
class _LazyProtocolProxy:
    def __getattr__(self, name):
        return getattr(get_protocol(), name)

protocol = _LazyProtocolProxy()


def validate_communication(user_query, intended_response):
    """Main function to validate communication before responding"""
    p = get_protocol()
    validation = p.validate_before_response(user_query, intended_response)
    p.save_communication_log(validation)
    return validation


def format_validation_for_user(validation):
    """Format validation for user display"""
    return get_protocol().format_validation_output(validation)
