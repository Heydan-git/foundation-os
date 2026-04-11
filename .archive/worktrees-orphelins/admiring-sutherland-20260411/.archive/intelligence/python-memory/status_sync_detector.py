#!/usr/bin/env python3
"""
Communication Enhancement v2.0 - Foundation OS
Real contradiction detection + status sync

ZERO import-time side effects: no print(), no global instantiation.
"""

import json
import os
from datetime import datetime
from pathlib import Path

from .config import FOS_ROOT, MEMORY_DIR


class FOSCommunicationEnhancer:

    def __init__(self):
        self.memory_dir = MEMORY_DIR
        self.current_state = {}
        self.contradictions = []
        self.status_map = {}

    def scan_all_fos_files(self):
        """Scan ALL FOS-*.md files for status and contradictions"""

        fos_files = list(FOS_ROOT.glob("FOS-*.md"))
        self.status_map = {}

        for file_path in fos_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                file_status = self.extract_status_info(file_path.name, content)
                self.status_map[file_path.name] = file_status

            except Exception as e:
                import logging
                logging.getLogger(__name__).warning("Error reading %s: %s", file_path.name, e)

        return self.status_map

    def extract_status_info(self, filename, content):
        """Extract key status information from file content"""

        status = {
            "filename": filename,
            "timestamp": datetime.now().isoformat(),
            "phases": {},
            "artifacts": {},
            "setup_status": {},
            "stack_layers": {},
            "raw_statuses": []
        }

        from .regex_patterns import STATUS_PATTERNS

        for pattern_name, pattern in STATUS_PATTERNS.items():
            matches = pattern.findall(content)

            if pattern_name == "phase":
                for phase, stat in matches:
                    status["phases"][f"P{phase}"] = stat
            elif pattern_name == "artifact":
                for artifact, stat in matches:
                    status["artifacts"][f"fos-{artifact}.jsx"] = stat
            elif pattern_name == "setup":
                for step, stat in matches:
                    status["setup_status"][f"e{step}"] = stat
            elif pattern_name == "layer":
                for layer, stat in matches:
                    status["stack_layers"][f"L{layer}"] = stat
            elif pattern_name == "status_line":
                for stat, desc in matches:
                    status["raw_statuses"].append({"status": stat, "description": desc.strip()})

        return status

    def detect_contradictions(self):
        """Detect contradictions between files"""

        self.contradictions = []

        # Check Phase statuses across files
        phase_statuses = {}
        for filename, data in self.status_map.items():
            for phase, status in data["phases"].items():
                if phase not in phase_statuses:
                    phase_statuses[phase] = []
                phase_statuses[phase].append({"file": filename, "status": status})

        for phase, statuses in phase_statuses.items():
            unique_statuses = set(s["status"] for s in statuses)
            if len(unique_statuses) > 1:
                self.contradictions.append({
                    "type": "phase_contradiction",
                    "item": phase,
                    "conflicting_statuses": statuses,
                    "severity": "high"
                })

        # Check Artifact statuses
        artifact_statuses = {}
        for filename, data in self.status_map.items():
            for artifact, status in data["artifacts"].items():
                if artifact not in artifact_statuses:
                    artifact_statuses[artifact] = []
                artifact_statuses[artifact].append({"file": filename, "status": status})

        for artifact, statuses in artifact_statuses.items():
            unique_statuses = set(s["status"] for s in statuses)
            if len(unique_statuses) > 1:
                self.contradictions.append({
                    "type": "artifact_contradiction",
                    "item": artifact,
                    "conflicting_statuses": statuses,
                    "severity": "medium"
                })

        return self.contradictions

    def generate_status_report(self):
        """Generate comprehensive status report"""

        report = {
            "timestamp": datetime.now().isoformat(),
            "total_files_scanned": len(self.status_map),
            "contradictions_found": len(self.contradictions),
            "status_summary": {},
            "contradiction_details": self.contradictions,
            "recommendations": []
        }

        all_phases = {}
        all_artifacts = {}

        for filename, data in self.status_map.items():
            for phase, status in data["phases"].items():
                if phase not in all_phases:
                    all_phases[phase] = {}
                if status not in all_phases[phase]:
                    all_phases[phase][status] = 0
                all_phases[phase][status] += 1

            for artifact, status in data["artifacts"].items():
                if artifact not in all_artifacts:
                    all_artifacts[artifact] = {}
                if status not in all_artifacts[artifact]:
                    all_artifacts[artifact][status] = 0
                all_artifacts[artifact][status] += 1

        report["status_summary"] = {
            "phases": all_phases,
            "artifacts": all_artifacts
        }

        if self.contradictions:
            report["recommendations"].append("Resolve status contradictions before proceeding")
            report["recommendations"].append("Update files to have consistent status indicators")
        else:
            report["recommendations"].append("Status consistency validated")

        return report

    def save_enhanced_context(self, report):
        """Save enhanced context for Claude communication"""

        enhanced_context = {
            "communication_mode": "enhanced_v2",
            "contradiction_detection": True,
            "last_scan": report["timestamp"],
            "project_coherence": len(self.contradictions) == 0,
            "status_validated": True,
            "critical_contradictions": self.contradictions,
            "current_state_snapshot": {
                "phases": report["status_summary"]["phases"],
                "artifacts": report["status_summary"]["artifacts"],
                "all_contradictions": self.contradictions
            }
        }

        context_file = self.memory_dir / "enhanced_context.json"
        from .atomic_utils import atomic_json_write
        atomic_json_write(context_file, enhanced_context)

        return enhanced_context

    def run_full_analysis(self):
        """Run complete communication enhancement analysis"""

        self.scan_all_fos_files()
        self.detect_contradictions()
        report = self.generate_status_report()
        enhanced_context = self.save_enhanced_context(report)

        return report, enhanced_context


def main():
    enhancer = FOSCommunicationEnhancer()
    report, context = enhancer.run_full_analysis()
    return report, context


if __name__ == "__main__":
    main()
