---
source_url: https://mindstudio.io/posts/karpathy-llm-wiki
source_type: article
author: Andrej Karpathy
date_published: 2026-04
fetched: 2026-04-15
---

# The Karpathy LLM Wiki Pattern

En avril 2026, Andrej Karpathy a partage une idee simple mais puissante :
Au lieu de donner des documents bruts a un LLM, fais-lui pre-compiler tes sources dans un wiki Markdown structure. Ensuite, fais-le operer sur ce wiki.

L'insight cle : les LLMs raisonnent tres bien sur du texte Markdown long et structure. Pas besoin d'embeddings ou de RAG complexe pour ca.

Comment ca marche concretement :
1. Claude Code cree un dossier memory/ dans ton projet
2. Il maintient un fichier MEMORY.md (index de toutes ses notes)
3. A chaque session, il lit son index, retrouve le contexte pertinent
4. En fin de session, il met a jour ses notes automatiquement
5. Le fichier hot.md sert de cache : resume compact de la derniere session, lu en premier au demarrage

Le hot cache est la feature la plus sous-estimee. Claude met a jour hot.md a la fin de chaque session avec un resume compact (~500 mots). La session suivante lit ce fichier en premier. Tu ne reconstruis jamais le contexte.

Ca se renforce avec le temps. Plus Claude accumule de contexte, plus il est precis et pertinent dans ses reponses. Knowledge compounds like interest.

Au-dela de quelques centaines de fichiers Markdown, le systeme atteint ses limites (taille contexte, couts tokens, performance). Solution complementaire : Pinecone (vector DB managee) pour archivage long terme + recherche semantique.

Architecture finale : Obsidian (contexte actif) + Pinecone (archivage). Claude navigue entre les deux.
