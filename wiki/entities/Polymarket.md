---
type: entity
title: "Polymarket"
entity_type: product
url: "https://polymarket.com"
docs: "https://docs.polymarket.com"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - prediction-market
  - crypto
  - polygon
  - trading-platform
status: seed
confidence: medium
related:
  - "[[index-entities]]"
  - "[[anthropic-prediction-market-bot-guide]]"
  - "[[Prediction Market Trading Pipeline]]"
  - "[[Kalshi]]"
sources:
  - "[[anthropic-prediction-market-bot-guide]]"
---

# Polymarket

## What

**Plateforme de prediction markets native crypto**, construite sur le reseau Polygon (layer-2 Ethereum). Permet de parier sur l'issue d'evenements reels (politique, economie, sport, culture, etc.) via achats de contrats "Yes" / "No" a 1$ max payout.

**Modele technique** : Centralized Limit Order Book (CLOB) avec matching off-chain + settlement on-chain via smart contracts Polygon. Authentication EIP-712 (signature cryptographique Ethereum).

## Why It Matters

**Une des 2 plateformes principales** dans l'ecosysteme prediction markets (avec [[Kalshi]]). Volume combine 2025 : **$44B+**. Polymarket a domine historiquement avant que Kalshi le depasse en volume hebdomadaire fin 2025.

**Pertinence Foundation OS** : candidate #1 pour Phase 5 Trading si Kevin choisit prediction markets. Native crypto = pas de KYC lourd (mais geoblock certaines regions).

## Key Facts

- Fonde : 2020
- Chain : Polygon (layer-2 Ethereum)
- Modele : CLOB off-chain matching + on-chain settlement
- Auth : EIP-712 signatures
- APIs :
  - REST API pour discovery markets
  - WebSocket pour orderbook temps reel
- Restrictions : geoblock USA + certains autres pays (check juridiction user)
- Payout max par contrat : $1 (resolved binary : $1 si Yes correct, $0 sinon)
- Docs : https://docs.polymarket.com
- Community : wrapper library unifie pmxt (inspire CCXT, supporte Polymarket + [[Kalshi]])

## Tech integration

### APIs
- **REST** : https://clob.polymarket.com
- **WebSocket** : real-time orderbook updates
- **Authentification** : EIP-712 signed requests (Ethereum wallet required)

### Library wrappers
- `pmxt` (mentionne dans [[anthropic-prediction-market-bot-guide]]) — wrapper unifie Polymarket + [[Kalshi]]
- `py-clob-client` (Python SDK officiel)

### Pour Foundation OS Phase 5 Trading
- Stack compatible : Vite + React + TypeScript + Supabase + viem (Ethereum client)
- Challenge : Ethereum wallet management cote user (EIP-712 signature)
- Backtest data : disponible via API history (gratuit)

## Connections

- [[anthropic-prediction-market-bot-guide]] — guide complet bot trading Polymarket + Kalshi
- [[Prediction Market Trading Pipeline]] — architecture 5 etapes cible
- [[Kalshi]] — concurrent principal (US regulated, non-crypto)
- `pmxt` library — wrapper unifie (mentionne en text, pas entity dediee)
- Polygon — layer-2 Ethereum sous-jacent (pas d'entity wiki dediee, mention en texte)

## Juridique / regulation

- **Statut US** : CFTC settlement 2022, interdit aux residents US
- **Europe** : pas de regulation claire, tolerance de facto (pas de MiCA direct coverage 2025)
- **France/Luxembourg (Kevin)** : a verifier precisement avant adoption Phase 5
- **Geoblock** : VPN detection + KYC partiel sur gros volumes

## External Refs

- Site : https://polymarket.com
- Docs API : https://docs.polymarket.com
- GitHub org : https://github.com/Polymarket
- Python client : https://github.com/Polymarket/py-clob-client
