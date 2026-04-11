#!/usr/bin/env python3
"""
Enhanced Semantic Memory v2.0 - Foundation OS
Real implementation based on 2024-2025 research patterns

ZERO import-time side effects: no print(), no global instantiation.
"""

import json
import os
from datetime import datetime
from pathlib import Path

from .config import FOS_ROOT, MEMORY_DIR, SEMANTIC_DIR


def setup_enhanced_memory():
    """Setup enhanced semantic memory with contradiction detection"""

    import chromadb

    SEMANTIC_DIR.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(SEMANTIC_DIR))

    # NOTE: ChromaDB metadata values must be scalar (str/int/float/bool) -- no lists.
    conversations = client.get_or_create_collection(
        name="fos_conversations_v2",
        metadata={
            "description": "Foundation OS conversations with enhanced context",
            "version": "2.0.0",
            "features": "contradiction_detection,pattern_recognition"
        }
    )

    knowledge = client.get_or_create_collection(
        name="fos_knowledge_graph",
        metadata={
            "description": "Foundation OS knowledge graph with semantic relationships",
            "version": "2.0.0"
        }
    )

    status = client.get_or_create_collection(
        name="fos_status_tracker",
        metadata={
            "description": "Foundation OS status and contradictions tracking",
            "version": "2.0.0"
        }
    )

    return client, {
        'conversations': conversations,
        'knowledge': knowledge,
        'status': status
    }


def index_current_state(client, collections):
    """Index current Foundation OS state for contradiction detection"""

    fos_files = list(FOS_ROOT.glob("FOS-*.md"))
    status_data = []

    for file_path in fos_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            status_entry = {
                "file": file_path.name,
                "timestamp": datetime.now().isoformat(),
                "content": content,
                "checkpoints": extract_status_checkpoints(content),
                "contradictions": []
            }
            status_data.append(status_entry)

        except Exception as e:
            import logging
            logging.getLogger(__name__).warning("Could not read %s: %s", file_path.name, e)

    if status_data:
        collections['status'].add(
            documents=[json.dumps(data) for data in status_data],
            metadatas=[{
                'file': data['file'],
                'timestamp': data['timestamp'],
                'type': 'status_snapshot'
            } for data in status_data],
            ids=[f"status_{data['file']}_{data['timestamp']}" for data in status_data]
        )

    # Save current session context
    current_context = {
        "session_id": f"ENHANCED_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "timestamp": datetime.now().isoformat(),
        "project_status": "audit_complete_35_files",
        "communication_mode": "enhanced_v2",
        "memory_active": True,
        "contradiction_detection": True
    }

    from .atomic_utils import atomic_json_write
    atomic_json_write(MEMORY_DIR / "current_session.json", current_context)


def extract_status_checkpoints(content):
    """Extract status checkpoints using pre-compiled patterns"""
    from .regex_patterns import CHECKPOINT_PATTERNS

    checkpoints = {}
    for key, pattern in CHECKPOINT_PATTERNS.items():
        matches = pattern.findall(content)
        if matches:
            checkpoints[key] = matches

    return checkpoints


def setup_contradiction_detection():
    """Setup real-time contradiction detection"""

    detector_config = {
        "enabled": True,
        "scan_frequency": "session_start",
        "conflict_threshold": 0.7,
        "auto_alert": True,
        "reconciliation_mode": "ask_user"
    }

    from .atomic_utils import atomic_json_write
    atomic_json_write(MEMORY_DIR / "contradiction_detector.json", detector_config)


def test_semantic_search(collections):
    """Test enhanced semantic search functionality"""

    results = collections['status'].query(
        query_texts=["phase status setup complete"],
        n_results=3
    )

    results_k = collections['knowledge'].query(
        query_texts=["Foundation OS architecture stack"],
        n_results=2
    )

    return {
        "status_results": len(results['documents'][0]),
        "knowledge_results": len(results_k['documents'][0])
    }


def main():
    """Main setup function"""

    try:
        client, collections = setup_enhanced_memory()
        index_current_state(client, collections)
        setup_contradiction_detection()
        test_results = test_semantic_search(collections)
        return True
    except Exception as e:
        import logging
        logging.getLogger(__name__).error("Enhanced semantic setup failed: %s", e)
        return False


if __name__ == "__main__":
    main()
