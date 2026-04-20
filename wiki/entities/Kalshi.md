---
type: entity
title: "Kalshi"
entity_type: product
url: "https://kalshi.com"
docs: "https://trading-api.readme.io"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - prediction-market
  - regulated-exchange
  - usa
  - trading-platform
status: seed
confidence: medium
related:
  - "[[index-entities]]"
  - "[[anthropic-prediction-market-bot-guide]]"
  - "[[Prediction Market Trading Pipeline]]"
  - "[[Polymarket]]"
sources:
  - "[[anthropic-prediction-market-bot-guide]]"
---

# Kalshi

## What

**Plateforme de prediction markets reglementee aux USA**, reconnue par la CFTC (Commodity Futures Trading Commission) comme Designated Contract Market (DCM). Bourse traditionnelle, pas crypto-native. Permet de trader contrats "Yes"/"No" sur evenements reels (politique, economie, sport, climat, elections, etc.).

**Modele technique** : bourse classique avec API REST. Pas de blockchain. Authentication via signature headers specifiques. **Environnement demo** disponible avec fake money pour tests.

## Why It Matters

**A depasse [[Polymarket]] en volume hebdomadaire fin 2025** (source : [[anthropic-prediction-market-bot-guide]]). Legitimite reglementaire = acces US legal (contrairement a Polymarket geoblock US). Volume combine Polymarket + Kalshi 2025 : **$44B+**.

**Pertinence Foundation OS** : candidate Phase 5 Trading **si** Kevin cible US market OU veut legitimite reglementaire maximale. Environnement demo = idéal pour **paper trading** Phase 5 starter (semaine 1-4 du plan).

## Key Facts

- Fonde : 2018
- HQ : New York, USA
- Regulation : CFTC-registered Designated Contract Market (DCM)
- Modele : traditional exchange (no blockchain)
- API : REST (pas WebSocket mentionne)
- Auth : signature header specifique (doc API)
- **Environnement demo** : fonds fictifs disponibles pour tests (gros avantage vs Polymarket)
- Developer agreement obligatoire
- Restrictions : US-only pour users (mais API accessible globalement pour dev)
- Docs : https://trading-api.readme.io

## Tech integration

### APIs
- **REST** : https://trading-api.kalshi.com
- **Demo environment** : https://demo-api.kalshi.co (fake money, test ideal)
- **Auth** : HMAC-based signature headers

### Library wrappers
- `pmxt` (mentionne dans [[anthropic-prediction-market-bot-guide]]) — wrapper unifie [[Polymarket]] + Kalshi
- Python client officiel disponible

### Pour Foundation OS Phase 5 Trading
- Stack compatible : Vite + React + TypeScript + Supabase (pas de chain dependency)
- **Avantage vs Polymarket** : pas de wallet Ethereum requis, demo environment disponible
- **Inconvenient** : US regulation = pas accessible aux residents non-US (check Kevin juridiction)

## Benchmark vs Polymarket

| Aspect | [[Polymarket]] | Kalshi |
|---|---|---|
| Fondation | 2020 | 2018 |
| Modele | CLOB off-chain + on-chain settlement | Traditional exchange |
| Base tech | Polygon (Ethereum L2) | REST API pure |
| Regulation | CFTC settlement 2022 (interdit US) | CFTC DCM approved (legal US) |
| Demo env | Non | **Oui** (fake money) |
| Auth | EIP-712 (Ethereum wallet) | HMAC signature headers |
| Geoblock | Bloque US + autres | US-residents only |
| Library | pmxt, py-clob-client | pmxt, Python officiel |
| Volume 2025 | Leader historique | **Depasse Polymarket fin 2025** |

## Connections

- [[anthropic-prediction-market-bot-guide]] — guide bot trading multi-plateforme
- [[Prediction Market Trading Pipeline]] — architecture 5 etapes cible
- [[Polymarket]] — concurrent principal (crypto-native, non-US)
- `pmxt` library — wrapper unifie

## Juridique / regulation

- **Statut US** : **LEGAL** (CFTC DCM approved)
- **Europe / France / Luxembourg** : pas d'acces users non-US
- **Pour Kevin (dev Europe/Luxembourg)** :
  - ✅ Peut **developer contre l'API** (dev agreement)
  - ✅ Peut **utiliser le demo environment** (fake money, paper trading)
  - ❌ Ne peut pas **trader live** avec argent reel depuis l'Europe
  - **Implication FOS** : Kalshi utilisable pour **paper trading Phase 5 prep**, mais **pas pour live trading**

## External Refs

- Site : https://kalshi.com
- Docs API : https://trading-api.readme.io
- Demo env : https://demo-api.kalshi.co
