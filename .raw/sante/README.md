# .raw/sante/

Sources brutes sante avant ingestion wiki.

## Contenu attendu

- Etudes medicales (PubMed, PDFs)
- Articles nutrition, sommeil, supplementation
- Recommandations practitioners (cardio, endocrino, etc.)

## Donnees sensibles — INTERDIT ici

Biomarkers personnels (TSH, ferritine, vitamines), scans, resultats bio → `modules/sante/data/` (Phase 5, gitignored). Pas dans `.raw/`.

## Convention

Drop article/whitepaper → `wiki-ingest .raw/sante/<file>` → page dans `wiki/domains/sante/sources/`.

## Spec

Voir `docs/core/knowledge.md` section "Sources sensibles".
