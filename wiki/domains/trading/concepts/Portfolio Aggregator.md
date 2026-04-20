---
type: concept
title: "Portfolio Aggregator (cross-exchange + on-chain)"
updated: 2026-04-19
tags: [trading, portfolio, aggregation, architecture, dashboard]
status: evergreen
confidence: high
related:
  - "[[Order Execution Management System]]"
  - "[[Slippage Models]]"
  - "[[index-trading]]"
---

# Portfolio Aggregator (cross-exchange + on-chain)

Un **Portfolio Aggregator** consolide toutes les balances, positions, et flux P&L d'un utilisateur a travers plusieurs sources heterogenes : exchanges centralises, wallets on-chain, protocoles DeFi, NFT. C'est le coeur d'un dashboard de controle finance crypto.

## Role

Transformer un ensemble de sources brutes (API exchanges + RPC on-chain + indexers DeFi) en **une vue unifiee** :
- Balance totale USD / EUR
- P&L global + par token + par source + par periode
- Allocation (pie chart)
- Top gainers / losers
- Historique transactions reconcilie

## Sources de donnees

### Exchanges centralises (CEX)

- **ccxt** (100+ exchanges, gratuit, deja utilise dans `modules/finance/trading/`)
- Endpoints cles : `fetch_balance`, `fetch_my_trades`, `fetch_open_orders`, `fetch_closed_orders`

### On-chain wallets (EVM + non-EVM)

- **[Moralis](https://moralis.com/)** — 19+ EVM + Solana, 1-call wallet API
- **[Alchemy](https://www.alchemy.com/)** — ETH + L2s, node as a service
- **[Covalent / GoldRush](https://goldrush.dev/)** — 100+ chains
- **[DeBank](https://debank.com/)** — DeFi portfolio focus
- **[Zapper](https://zapper.xyz/)** — protocol interactions + yield
- **[Zerion](https://zerion.io/)** — multichain portfolio

### Prices + market data

- **CoinGecko** (gratuit + payant)
- **CoinMarketCap**
- On-chain DEX : Uniswap subgraph, Jupiter (Solana)

## Challenges techniques

### Cost basis (FIFO / LIFO / HIFO)

Calcul du prix de revient d'un token achete a des dates differentes. Methode FIFO = First In First Out (standard fiscal FR). Ex : 1 BTC achete a 10k + 1 BTC a 50k, vente 1 BTC → cost basis FIFO = 10k → gain = prix de vente - 10k.

Non-trivial a coder correctement. Un dashboard serieux doit tracer **chaque lot d'achat** et associer a chaque vente.

### Reconciliation cross-source

Un meme asset peut exister dans 2+ sources (BTC sur Binance + wallet BTC on-chain). Ne pas double-compter. Necessite un **identifiant canonique** (symbol + chain) et une logique de deduplication.

### DeFi positions

- **Staking** : ETH stake → stETH (Lido) != ETH natif mais meme exposition economique
- **LP pools** : Uniswap USDC/ETH = 2 tokens + impermanent loss
- **Lending** : Aave supply → aToken receipt
- **Perps funding** : Binance perp long BTC → 3x funding par jour

Chaque protocole DeFi a sa propre mecanique. Un dashboard mature indexe les 50-100 protocoles majeurs. Un MVP peut ignorer DeFi (Foundation OS V1.3 MVP).

### Timezone + currency

Kevin en EUR, la plupart des APIs en USD. Conversion historique : instant vs close-of-day ? FIFO fiscal FR utilise close-of-day EUR officiel BCE.

### Prices historiques gaps

CoinGecko a des trous pour tokens exotiques ou periodes tres anciennes. Airdrops, forks, renames de tokens casserent les series.

## Architecture Foundation OS suggeree (V1.3+)

Voir spec [Finance Dashboard Maison](../../../../docs/superpowers/specs/2026-04-19-finance-dashboard-research.md) pour l'analyse detaillee.

Pattern retenu :
```
modules/finance/dashboard/
├── sources/          # ccxt + Moralis + Alchemy adapters
├── aggregator/       # normalization + cost basis FIFO
├── snapshots/        # DB Postgres/SQLite : timeseries balances + P&L
├── pnl/              # calculs gains/pertes cross-source
├── bots/             # integration module trading (status strategies)
└── api/              # FastAPI endpoints
```

Frontend integre a `modules/app/` (Vite + React + Tailwind) sur routes `/dashboard/finance/*`.

## Honnetete

- **Produits SaaS matures** (CoinStats, Koinly, CoinTracker) ont 5+ ans de bug-fixes sur edge cases. Un aggregator maison part de zero.
- **Cost basis** est un des domaines les plus risques : erreur = fausse P&L, potentiellement fausse declaration fiscale.
- **Permissions API** : toutes les cles exchange doivent etre **read-only** obligatoirement. Une cle trade qui fuite = drain.
- **Surface d'attaque** : stocker 5+ API keys exchange + 5+ wallet addresses = vault chiffre obligatoire, pas fichier `.env` en clair sur VPS partage.

## Implementation Foundation OS actuelle (V1)

**Aucune**. Le sous-module `modules/finance/dashboard/` n'existe pas. Recherche documentee dans le spec ci-dessus, range au backlog V1.3+.

Piste pragmatique court terme : **CoinStats** (SaaS, ~10 $/mois) en attendant. Ou Zerion free.

## Reference

- Etat de l'art 2026 : [Alchemy — 41 crypto portfolio dashboards](https://www.alchemy.com/dapps/best/crypto-portfolio-dashboards)
- Best multichain APIs : [Zerion blog 2026](https://zerion.io/blog/best-multichain-portfolio-apis-2026-guide/)
- Open-source self-hosted : [Rotki](https://github.com/rotki/rotki), [Ghostfolio](https://github.com/ghostfolio/ghostfolio)
