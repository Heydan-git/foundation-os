# .raw/trading/

Sources brutes trading avant ingestion wiki.

## Contenu attendu

- Whitepapers quant (Jegadeesh, Asness, Fama-French, Carhart, etc.)
- Articles strategies (momentum, mean reversion, carry, vol)
- Papers backtesting, risk models, factor investing
- Extraits books trading systematique

## Donnees sensibles — INTERDIT ici

Backtests raw, cles API brokers/exchanges, positions → `modules/trading/backtests/raw/` + `modules/trading/secrets/` (Phase 5, gitignored).

## Convention

Drop paper → `wiki-ingest .raw/trading/<file>` → page dans `wiki/domains/trading/sources/`.

## Spec

Voir `docs/core/knowledge.md`.
