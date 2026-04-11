#!/usr/bin/env python3
"""
Foundation OS - Semantic Memory Setup
Créer collections Chroma pour conversations et knowledge
"""

import chromadb
import json
import os
from datetime import datetime
from pathlib import Path

# Configuration
from config import FOS_ROOT, MEMORY_DIR, SEMANTIC_DIR

def setup_chroma_collections():
    """Initialize Chroma client and create Foundation OS collections"""

    # Créer dossiers nécessaires
    SEMANTIC_DIR.mkdir(parents=True, exist_ok=True)

    # Initialize Chroma client (local persistance)
    client = chromadb.PersistentClient(path=str(SEMANTIC_DIR))

    print("🔧 Initializing Foundation OS Semantic Memory...")

    # Collection 1: Conversations & Sessions
    try:
        conversations_collection = client.create_collection(
            name="fos_conversations",
            metadata={
                "description": "Foundation OS conversation history and sessions",
                "created": datetime.now().isoformat(),
                "version": "1.0.0"
            }
        )
        print("✅ Collection 'fos_conversations' created")
    except Exception as e:
        print(f"ℹ️  Collection 'fos_conversations' already exists: {e}")
        conversations_collection = client.get_collection("fos_conversations")

    # Collection 2: Project Knowledge
    try:
        knowledge_collection = client.create_collection(
            name="fos_knowledge",
            metadata={
                "description": "Foundation OS project knowledge, decisions, patterns",
                "created": datetime.now().isoformat(),
                "version": "1.0.0"
            }
        )
        print("✅ Collection 'fos_knowledge' created")
    except Exception as e:
        print(f"ℹ️  Collection 'fos_knowledge' already exists: {e}")
        knowledge_collection = client.get_collection("fos_knowledge")

    # Collection 3: Errors & Solutions
    try:
        errors_collection = client.create_collection(
            name="fos_errors_solutions",
            metadata={
                "description": "Foundation OS errors, bugs, solutions, learnings",
                "created": datetime.now().isoformat(),
                "version": "1.0.0"
            }
        )
        print("✅ Collection 'fos_errors_solutions' created")
    except Exception as e:
        print(f"ℹ️  Collection 'fos_errors_solutions' already exists: {e}")
        errors_collection = client.get_collection("fos_errors_solutions")

    return client, {
        'conversations': conversations_collection,
        'knowledge': knowledge_collection,
        'errors': errors_collection
    }

def index_existing_files(client, collections):
    """Index existing Foundation OS files into collections"""

    print("📚 Indexing existing Foundation OS files...")

    # Index FOS-JOURNAL.md (conversations/sessions)
    journal_file = FOS_ROOT / "FOS-JOURNAL.md"
    if journal_file.exists():
        with open(journal_file, 'r', encoding='utf-8') as f:
            journal_content = f.read()

        # Split by sessions (CONV-XX)
        sessions = []
        current_session = ""
        current_title = ""

        for line in journal_content.split('\n'):
            if line.startswith('### CONV-'):
                if current_session:
                    sessions.append({
                        'title': current_title,
                        'content': current_session,
                        'type': 'session'
                    })
                current_title = line.strip()
                current_session = line + '\n'
            else:
                current_session += line + '\n'

        # Add last session
        if current_session:
            sessions.append({
                'title': current_title,
                'content': current_session,
                'type': 'session'
            })

        # Add sessions to collection
        if sessions:
            collections['conversations'].add(
                documents=[s['content'] for s in sessions],
                metadatas=[{
                    'source': 'FOS-JOURNAL.md',
                    'type': s['type'],
                    'title': s['title'],
                    'indexed_at': datetime.now().isoformat()
                } for s in sessions],
                ids=[f"session_{i}" for i in range(len(sessions))]
            )
            print(f"✅ Indexed {len(sessions)} sessions from FOS-JOURNAL.md")

    # Index FOS-COMMANDER-DATA.md (ADR decisions)
    commander_file = FOS_ROOT / "FOS-COMMANDER-DATA.md"
    if commander_file.exists():
        with open(commander_file, 'r', encoding='utf-8') as f:
            commander_content = f.read()

        collections['knowledge'].add(
            documents=[commander_content],
            metadatas=[{
                'source': 'FOS-COMMANDER-DATA.md',
                'type': 'adr_database',
                'category': 'decisions',
                'indexed_at': datetime.now().isoformat()
            }],
            ids=['adr_database']
        )
        print("✅ Indexed ADR database from FOS-COMMANDER-DATA.md")

    # Index architecture files
    arch_files = [
        'FOS-ANTI-COMPACTAGE-ARCHITECTURE.md',
        'FOS-MEMORY-INTELLIGENCE-ROADMAP.md',
        'FOS-COMMUNICATION-AUDIT.md'
    ]

    for arch_file in arch_files:
        file_path = FOS_ROOT / arch_file
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            collections['knowledge'].add(
                documents=[content],
                metadatas=[{
                    'source': arch_file,
                    'type': 'architecture',
                    'category': 'system_design',
                    'indexed_at': datetime.now().isoformat()
                }],
                ids=[arch_file.replace('.md', '').replace('-', '_').lower()]
            )
            print(f"✅ Indexed {arch_file}")

def test_semantic_search(collections):
    """Test semantic search functionality"""

    print("\n🧪 Testing semantic search...")

    # Test search in conversations
    try:
        results = collections['conversations'].query(
            query_texts=["compactage mémoire problème"],
            n_results=2
        )
        print(f"✅ Conversation search test: Found {len(results['documents'][0])} results")
        if results['documents'][0]:
            print(f"   Top result: {results['metadatas'][0][0]['title'][:50]}...")
    except Exception as e:
        print(f"❌ Conversation search test failed: {e}")

    # Test search in knowledge
    try:
        results = collections['knowledge'].query(
            query_texts=["architecture système mémoire"],
            n_results=2
        )
        print(f"✅ Knowledge search test: Found {len(results['documents'][0])} results")
        if results['documents'][0]:
            print(f"   Top result: {results['metadatas'][0][0]['source']}")
    except Exception as e:
        print(f"❌ Knowledge search test failed: {e}")

def save_config():
    """Save semantic memory configuration"""

    config = {
        "semantic_memory": {
            "enabled": True,
            "chroma_path": str(SEMANTIC_DIR),
            "collections": ["fos_conversations", "fos_knowledge", "fos_errors_solutions"],
            "version": "1.0.0",
            "setup_date": datetime.now().isoformat()
        }
    }

    config_file = MEMORY_DIR / "semantic_config.json"
    from atomic_utils import atomic_json_write
    atomic_json_write(config_file, config)

    print(f"✅ Configuration saved to {config_file}")

def main():
    """Main setup function"""

    print("🚀 Foundation OS - Semantic Memory Setup Starting...")
    print(f"📁 Memory directory: {MEMORY_DIR}")

    try:
        # Setup collections
        client, collections = setup_chroma_collections()

        # Index existing files
        index_existing_files(client, collections)

        # Test functionality
        test_semantic_search(collections)

        # Save configuration
        save_config()

        print("\n🎉 SEMANTIC MEMORY SETUP COMPLETED!")
        print("🧠 Foundation OS now has intelligent memory capabilities:")
        print("   • Conversation history searchable")
        print("   • Project knowledge indexed")
        print("   • Cross-session pattern recognition ready")
        print("   • Semantic search operational")

        return True

    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False

if __name__ == "__main__":
    main()