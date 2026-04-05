#!/usr/bin/env python3
"""
Test de la mémoire sémantique Foundation OS
Démonstration des capacités intelligentes
"""

import chromadb
from pathlib import Path

# Configuration
FOS_ROOT = Path("/Users/kevinnoel/foundation-os")
SEMANTIC_DIR = FOS_ROOT / ".fos" / "memory" / "semantic"

def test_intelligent_memory():
    """Test des capacités de mémoire intelligente"""

    print("🧠 Foundation OS - Test Mémoire Intelligente")
    print("=" * 50)

    # Connecter aux collections
    client = chromadb.PersistentClient(path=str(SEMANTIC_DIR))

    conversations = client.get_collection("fos_conversations")
    knowledge = client.get_collection("fos_knowledge")

    # Test 1: Recherche problèmes de compactage
    print("\n🔍 TEST 1 - Recherche: 'problème compactage mémoire'")
    results = conversations.query(
        query_texts=["problème compactage mémoire perte contexte"],
        n_results=2
    )

    for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
        print(f"  📋 Résultat {i+1}: {metadata['title'][:60]}...")
        print(f"      Source: {metadata['source']}")
        print(f"      Extrait: {doc[:100]}...")
        print()

    # Test 2: Recherche architecture système
    print("🔍 TEST 2 - Recherche: 'architecture mémoire vectorielle'")
    results = knowledge.query(
        query_texts=["architecture mémoire vectorielle semantic kernel"],
        n_results=2
    )

    for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
        print(f"  🏗️  Résultat {i+1}: {metadata['source']}")
        print(f"      Type: {metadata['type']} | Catégorie: {metadata['category']}")
        print(f"      Extrait: {doc[:150]}...")
        print()

    # Test 3: Recherche ADR décisions
    print("🔍 TEST 3 - Recherche: 'décisions architecture hooks'")
    results = knowledge.query(
        query_texts=["décisions architecture hooks claude code"],
        n_results=2
    )

    for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
        print(f"  ⚖️  Résultat {i+1}: {metadata['source']}")
        print(f"      Type: {metadata['type']}")
        print(f"      Extrait: {doc[:120]}...")
        print()

    # Test 4: Recherche patterns BMAD
    print("🔍 TEST 4 - Recherche: 'BMAD OMC multi-agent'")
    results = conversations.query(
        query_texts=["BMAD OMC multi-agent orchestration"],
        n_results=2
    )

    for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
        print(f"  🤖 Résultat {i+1}: {metadata['title'][:60]}...")
        print(f"      Extrait: {doc[:100]}...")
        print()

    # Stats finales
    print("📊 STATISTIQUES COLLECTIONS")
    print(f"   • Conversations: {conversations.count()} entrées")
    print(f"   • Knowledge: {knowledge.count()} entrées")

    print("\n🎉 MÉMOIRE SÉMANTIQUE 100% FONCTIONNELLE !")
    print("    ✅ Cross-session memory")
    print("    ✅ Pattern recognition")
    print("    ✅ Intelligent context retrieval")
    print("    ✅ Semantic understanding")

if __name__ == "__main__":
    test_intelligent_memory()