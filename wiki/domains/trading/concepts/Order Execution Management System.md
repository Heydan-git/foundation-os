---
type: concept
title: "Order Execution Management System (OMS/EMS)"
updated: 2026-04-19
tags: [trading, execution, architecture, infrastructure]
status: evergreen
confidence: high
related:
  - "[[Slippage Models]]"
  - "[[index-trading]]"
---

# Order Execution Management System (OMS / EMS)

Deux acronymes souvent confondus, complementaires :

- **OMS (Order Management System)** : gere le **cycle de vie d'un ordre** cote utilisateur — reception signal, validation, routing, tracking du statut (pending / partially filled / filled / rejected / cancelled), journalisation.
- **EMS (Execution Management System)** : gere l'**execution bas niveau** — strategies d'execution (market, limit, iceberg, TWAP, VWAP), smart order routing entre venues, anti-slippage, timing.

En retail crypto, les deux sont souvent fusionnes dans un "trading bot". Chez les institutionnels, OMS et EMS sont separes (ex : Axon Trade pour les actifs digitaux).

## Pourquoi c'est critique pour Foundation OS

Le chemin **alerte TradingView → ordre execute sur Binance** passe obligatoirement par un OMS/EMS (meme si minimal). 3Commas est essentiellement un OMS/EMS as-a-service pour retail crypto.

## Composants d'un OMS/EMS robuste

### Essentiels

- **Webhook receiver** : endpoint HTTPS durci (auth HMAC + idempotence + rate limit + replay protection)
- **Signal validation** : whitelist actions, bornes size/price, kill-switch actif ?
- **Order router** : client exchange (ccxt ou natif), retry exponential, gestion rate limits
- **State tracker** : DB locale pour deals / positions / orders (SQLite ou Postgres)
- **Fill handling** : gestion des fills partiels, cancellation, timeouts
- **Kill-switch** : pause globale via endpoint + drapeau fichier + commande Telegram
- **Monitoring** : heartbeat, alertes anomalie, dashboard P&L

### Avances (V1.2+)

- **Risk guard** : max DD journalier, max position notional, circuit breaker sur N echecs consecutifs
- **Drift detector** : compare P&L live au backtest OOS predit, alerte si deviation
- **Smart order routing** : split cross-venue pour minimiser slippage sur gros ordres
- **Execution algos** : TWAP, VWAP, iceberg pour ordres importants
- **Audit trail** : log immuable (append-only) de chaque decision et chaque ordre

## Risques principaux

1. **Race conditions** : deux signaux arrivent quasi-simultanement → 2x position si pas d'idempotence
2. **Fills partiels** : ordre limit fille a 40% puis expiry → state desync
3. **Exchange disconnect** : websocket down pendant 30s → on rate un exit
4. **Rate limits** : Binance 1200 req/min → queue + throttle obligatoires
5. **Secrets leak** : cle API sortie → drain de compte (permission `trade only` + IP whitelist)
6. **Bug code** : argent reel perdu. Paper trading 1-2 mois obligatoire avant live.

## Options pour Foundation OS

Voir le spec de recherche [3Commas Maison](../../../docs/superpowers/specs/2026-04-19-3commas-alternative-research.md) pour l'analyse detaillee :

- **Option A** : Fork open-source mature (OctoBot / Superalgos / Freqtrade)
- **Option B** : Build maison integre a `modules/finance/trading/`
- **Option C** : Hybride — maison pour Signal Bot simple + 3Commas pour DCA/Grid complexes (recommande)

## Implementation Foundation OS actuelle (V1)

- Consommateur 3Commas existant : `modules/finance/trading/src/trading/execution/threecommas/` (`api.py` + `webhook.py`)
- Stub `NautilusLive` pour execution directe : `modules/finance/trading/src/trading/execution/live/nautilus_live.py`
- OMS/EMS maison complet = **V1.2+ backlog**, pas en scope D-TRADING-01 v1

## Reference

- Axon Trade — OMS/EMS institutionnel digital assets : [axon.trade](https://axon.trade/)
- 3Commas API (OMS/EMS as-a-service retail) : [developers.3commas.io](https://developers.3commas.io/)
