---
title: "Finance Dashboard Maison — Recherche exploratoire (future work)"
date: 2026-04-19
status: research-future-work
scope: modules/finance/dashboard/ (nouveau sous-module V1.3+)
author: Kevin + Claude (recherche autonome)
related:
  - "[[index-trading]]"
  - "[[Portfolio Aggregator]]"
  - "[[Order Execution Management System]]"
---

# Finance Dashboard Maison — Recherche exploratoire (V1.3+)

> **Statut** : RECHERCHE SEULEMENT. Hors scope immediat. Idee rangee au backlog pour decision plus tard.

## 1. Contexte et motivation (vision Kevin)

Kevin veut un **dashboard de controle ultra-complet** integre a Foundation OS qui affiche :

- **Portfolio consolide cross-exchange + wallets** : tout son argent crypto au meme endroit (Binance + Bybit + Kraken + wallets on-chain ETH/SOL/BSC/...)
- **Analyse gains / pertes** par token, par periode, par venue
- **Top performers** : quel token/strategie rapporte le plus, lequel perd le plus
- **Suivi bots actifs** : strategies en cours (du module trading) avec P&L live et etat
- **Hub unifie** : fusion portfolio-tracker + bot-monitor + analytics

Kevin dit explicitement "on approfondira plus tard" — c'est **conceptuel**, a la meme profondeur de recherche que le spec [3Commas Maison](2026-04-19-3commas-alternative-research.md) produit le meme jour.

## 2. Etat de l'art 2026

### 2.1 Produits commerciaux SaaS

| Outil | Focus | Prix approx. | Notes |
|---|---|---|---|
| **CoinStats** | Portfolio + 200+ exchanges + 120+ chains + 10k+ DeFi | Free + Premium ~10 $/mois | API disponible |
| **CoinTracker** | Tax + portfolio | Free + Plus 53 $/an | Focus reporting fiscal |
| **Delta** (eToro) | Portfolio mobile | Free + Pro ~60 $/an | Mobile-first |
| **Koinly** | Tax + portfolio multi-chain | Free + 49 $/an min | Tax focus |
| **CoinTracking** | Analytics futures P&L granulaire | Free limite + 180 $/an | Granularite derivative |

### 2.2 Open-source self-hosted (candidats fork)

| Outil | Stack | Licence | Maturite | Adequation |
|---|---|---|---|---|
| **[Rotki](https://github.com/rotki/rotki)** | Python + Vue | BSD-3 (premium tiered EUR 25/mois) | ~6k stars, mature | ✅ privacy-first, local-first, multi-exchange + on-chain |
| **[Ghostfolio](https://github.com/ghostfolio/ghostfolio)** | TypeScript NestJS + Angular + Postgres + Redis + Prisma | AGPL-3 | ~7k stars, mature | ✅ wealth mgmt multi-asset, Docker Compose ready |
| **[Cryptofolio](https://github.com/Xtrendence/Cryptofolio)** | web+mobile+desktop RESTful | MIT | petit, 300 stars | ⚠️ projet plus petit |

**Rotki** = best fit pour l'esprit Foundation OS (privacy-first, local-only). **Ghostfolio** = best UI deja-fait si Kevin accepte AGPL-3 contamination.

### 2.3 APIs data disponibles

#### Exchanges (balance + trades + P&L cost basis)

- **ccxt** (on l'utilise deja) — 100+ exchanges, balance + trades + orders unified API. Gratuit.
- **CoinStats Crypto API** — 200+ exchanges + 10k+ DeFi protocols agreges en 1 endpoint. Commercial.
- **Luzia** — 5 exchanges top (Binance/Coinbase/Kraken/Bybit/OKX) sub-second latency. Commercial.

#### On-chain wallets (balances + tokens + NFT + P&L on-chain)

- **[Moralis](https://moralis.com/)** — 19+ EVM + Solana. Wallet API 1-payload : native + ERC20 + NFT + P&L. Free tier + paid.
- **[Alchemy](https://www.alchemy.com/)** — ETH + Polygon + Solana + L2s (Arbitrum, Optimism, Base). Node + enhanced APIs. Generous free tier.
- **[Covalent / GoldRush](https://goldrush.dev/)** — 100+ chains, longest running. Unified API.
- **[DeBank](https://debank.com/)** — DeFi portfolio focus (hundreds of protocols, historical snapshots). Commercial API.
- **[Zapper](https://zapper.xyz/)** — protocol interaction + yield opportunity. Freemium.
- **[Zerion](https://zerion.io/)** — multichain portfolio aggregator, wallet-centric. API disponible.

#### Prices + market data

- **CoinGecko API** (gratuit + payant)
- **CoinMarketCap API**
- On-chain DEX : Uniswap subgraph, Jupiter (Solana)

## 3. Scope minimal viable d'un dashboard maison

### 3.1 MVP (V1.3 minimum viable)

1. **Portfolio snapshot** : balance par exchange + par wallet on-chain + total USD
2. **P&L global** : 24h / 7j / 30j / all-time (cost basis FIFO simple)
3. **Top performers** : top 5 gainers + top 5 losers sur periode selectionnee
4. **Allocation** : pie chart par token + par venue
5. **Integration bots** : list strategies actives du module trading + P&L live
6. **Historique transactions** : table filtrable des trades (exchange + on-chain)

### 3.2 Advanced (V1.4+)

- Dashboard P&L par strategie (vs backtest OOS predit — drift detector integre)
- Fiscal reporting (FIFO/LIFO/HIFO au choix, export CSV pour comptable FR)
- Alertes price / DD / rebalance seuils
- Benchmarks (compare portfolio a BTC/ETH/SPX)
- DeFi positions (staking, LP, lending, perps funding gains)
- NFT value tracker (optionnel)
- Mobile responsive (pas app native)

### 3.3 Non-goals (hors scope explicite)

- Trading depuis le dashboard (separation claire : module trading execute, dashboard observe)
- Copy trading social features
- Gestion multi-user / multi-tenant (Kevin solo)
- App mobile native (responsive web suffit)

## 4. Architecture Foundation OS possible

### 4.1 Integration au monorepo existant

```
modules/
├── app/                       # App Builder Vite + React + TS + Tailwind (existant)
│   └── src/routes/
│       └── dashboard/finance/  # Nouvelles routes pour UI dashboard
├── design-system/             # Void Glass DS (existant)
├── finance/
│   ├── trading/               # Backtest engine v1 (deja livre D-TRADING-01)
│   └── dashboard/             # NOUVEAU sous-module V1.3+
│       ├── pyproject.toml     # Python 3.12 + uv, same pattern que trading/
│       ├── src/dashboard/
│       │   ├── sources/       # adapters : ccxt / Moralis / Alchemy / Covalent
│       │   ├── aggregator/    # normalization + cost basis FIFO
│       │   ├── snapshots/     # DB Postgres/SQLite : balances + historique
│       │   ├── pnl/           # calculs gains/pertes cross-source
│       │   ├── bots/          # integration module trading pour status bots
│       │   └── api/           # FastAPI endpoints consommes par App Builder
│       └── tests/
```

**Principe** : dashboard est un sous-module Python qui expose une API FastAPI. Le frontend est integre a l'App Builder existant (routes `/dashboard/finance/*`) pour beneficier de Void Glass DS + stack deja en place.

### 4.2 Stack technique

| Couche | Techno | Raison |
|---|---|---|
| Backend dashboard | Python 3.12 + FastAPI + uv | Coherent avec `modules/finance/trading/`, partage deps ccxt |
| DB snapshots | PostgreSQL (ou SQLite v1 MVP) | Timeseries balances + P&L historique |
| On-chain indexer | **Moralis** ou **Alchemy** (choix v1 : Moralis pour 1-call wallet API) | Cross-chain natif |
| Exchange data | ccxt (reuse Task 2 D-TRADING-01) | Deja en place |
| Cache | Redis (snapshots prix + aggregates) | Standard |
| Frontend | `modules/app/` existant : routes `/dashboard/finance/*` | Evite duplication UI |
| Charts | Recharts (React) ou D3 | Ecosystem React |
| Auth | Secrets API chiffres locaux (pareil que trading) | Kevin solo |

### 4.3 Data flow

```
┌──────────────────────────────────────────────────────────────────┐
│  SOURCES                                                           │
│  ─ ccxt (exchanges) ─ Moralis (on-chain) ─ module trading (bots) │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
       [Aggregator]
               │
               ▼
    [Normalizer + Cost basis FIFO]
               │
               ├─► Snapshots DB (quotidien)
               │
               ▼
       [P&L engine]
               │
               ▼
       [FastAPI endpoints]
               │
               ▼
      modules/app/ (dashboard routes)
               │
               ▼
         Kevin browser
```

## 5. Options retenues

### Option A — Fork Ghostfolio + adaptation (moins d'effort UI)

**Pro** : UI deja polie, multi-asset deja en place, Docker compose ready.
**Con** : AGPL-3 contamine tout fork public. Angular (pas React, desalignement avec App Builder). Crypto pas le focus principal (fait stocks+ETF+crypto indistinctement). Integration bots trading necessite **un deuxieme backend** ou des shims.

**Verdict** : moyen. Bon pour "portfolio only", mauvais pour integration bot.

### Option B — Fork Rotki + adaptation

**Pro** : privacy-first (aligne Foundation OS), crypto-focused, local-only, multi-exchange + on-chain natif, BSD-3 (moins viral que AGPL). Python backend (aligne notre stack trading).
**Con** : Vue frontend (pas React). Tiered subscription premium features (les features avancees sont cote Rotki Cloud). Integration bots pas native.

**Verdict** : meilleur candidat fork. Mais toujours 2 stacks a maintenir.

### Option C — Build maison integre (Recommande a priori)

**Pro** : 100% integre au monorepo, partage deps avec `modules/finance/trading/`, UI Void Glass dans App Builder existant, MIT license, integration bots native (le module trading et le dashboard partagent `BaseStrategy`, `BacktestResult`, etc.).
**Con** : 10-15 sessions de dev MVP + maintenance continue. Reinventer cost basis FIFO/LIFO, UI charts, etc.

**Verdict** : C est le plus aligne si V1.1 trading stabilise + Kevin motive pour ~3 mois de dev.

### Option D — Hybride minimaliste

- **Court terme** : continuer a utiliser CoinStats ou Zerion (gratuit + suffisant pour vue basique)
- **V1.3 MVP maison** : build UNIQUEMENT la partie "integration bots" (P&L strategies actives du module trading) dans App Builder. Le portfolio global reste sur CoinStats.
- **V1.4+ maison** : migrer portfolio global quand le socle "bots view" est stable

**Verdict** : le plus pragmatique. **Scope reduit, valeur rapide, migration progressive.**

## 6. Honnetete, risques, limites

### 6.1 Complexite cachee

- **Cost basis FIFO/LIFO/HIFO** : non-trivial. Un trade BTC achete a 3 dates differentes, vendu partiellement : calcul du cout moyen demande de l'algorithmique serieuse. Erreurs = fausses metriques P&L.
- **Prix historiques fiables** : CoinGecko a des gaps, les prix tardifs ne sont pas toujours disponibles pour tokens exotiques.
- **Reconciliation cross-source** : une balance Binance + une wallet ETH peuvent contenir le meme asset (ex: ETH). Ne pas double-compter.
- **DeFi positions complexes** : Uniswap LP = 2 tokens avec impermanent loss, comment compter ? Staking ETH via Lido = stETH != ETH. Chaque protocole DeFi est son propre probleme.
- **Timezone + currency** : Kevin en EUR, la plupart des APIs en USD. Conversion historique quotidienne vs instant ?

### 6.2 Risques ops

- **API keys read-only** : essentiel. Une cle trade qui fuite depuis le dashboard = drain du compte. Permission exchange "read only" est une must.
- **Fenetre attack secrets** : stocker API keys de 5+ exchanges et 5+ wallets = surface elargie. Vault chiffre au repos minimum.
- **Drift sync** : si Binance API down 10 min, le dashboard affiche des balances perimees. UI doit afficher "last sync: X min ago" honnetement.

### 6.3 Limites self-host vs SaaS

- CoinStats indexe 200+ exchanges, nous 5-10 en v1. Si Kevin ouvre un nouveau compte chez un exchange exotique, il devra attendre qu'on ajoute le support.
- SaaS ont des annees de bug fixing sur edge cases (airdrops, forks, renames de tokens). Nous partons de zero.

### 6.4 Honnetete economique

- CoinStats Premium = ~10 $/mois. Zerion Free + CoinTracker Free suffisent pour la plupart des cas.
- VPS + Postgres + Moralis/Alchemy free tier = 10-20 $/mois.
- **L'economie pure est marginale** (~60 $/an). Le vrai argument : **integration avec les bots trading maison** (features impossibles a avoir chez CoinStats : drift detector live vs backtest OOS, P&L par strategie Foundation OS, etc.).

## 7. Roadmap suggeree (Option D hybride)

| Phase | Scope | Effort estime |
|---|---|---|
| **P1 — Bots monitor** | Dans App Builder : route `/dashboard/bots` qui list strategies actives + P&L live + status + equity curve | 2-3 sessions |
| **P2 — Exchange aggregator** | Backend Python `modules/finance/dashboard/` + ccxt adapters Binance/Bybit/Kraken + balance snapshot endpoint | 2-3 sessions |
| **P3 — On-chain aggregator** | Moralis integration + wallet addresses configurables + ETH/SOL/BSC native + ERC20 balances | 2 sessions |
| **P4 — P&L engine** | Cost basis FIFO + snapshots DB quotidiens + P&L 24h/7j/30j/all-time par asset | 3-4 sessions |
| **P5 — UI dashboard** | Routes `/dashboard/finance/*` dans App Builder : portfolio overview + top performers + allocation + charts Recharts | 3-4 sessions |
| **P6 — Integration drift** | Lie bots P&L live a backtest OOS predit, alerte si deviation | 1-2 sessions |
| **P7 — Advanced (optionnel)** | Fiscal reporting FIFO/LIFO export CSV, DeFi positions, alertes seuils | 3-5 sessions |

**Total MVP hybride (P1-P5)** : 12-17 sessions. **Realiste sur 2-3 mois calendaires.**

## 8. Prerequis

1. **D-TRADING-01 v1 stabilise** (livre 2026-04-19) + V1.1 Nautilus livre — les bots live existent a ce moment.
2. **Permissions exchange READ-ONLY** cotes Kevin sur Binance/Bybit/Kraken.
3. **Wallet addresses publiques** identifiees (ETH, SOL, BSC) — juste read, pas de seed phrase a leak.
4. **Moralis ou Alchemy account** (free tier suffit MVP).
5. **1 mois usage CoinStats + 1 mois bots live** = Kevin sait precisement ce qui lui manque chez les SaaS → definit vraiment le MVP.

## 9. Decision queue (plus tard)

| Decision | Quand | Critere |
|---|---|---|
| Option B (fork Rotki) vs C (maison) vs D (hybride) | Apres V1.1 trading | Voir si la partie "bots monitor" a elle seule justifie le module dashboard |
| Moralis vs Alchemy vs Covalent | P3 | Comparer free tier + chains supportees + latency |
| PostgreSQL vs SQLite snapshots | P2 debut | Volume previsible (100 snapshots/jour pendant 2 ans = ~70k rows → SQLite tient largement) |
| Frontend Recharts vs D3 vs Chart.js | P5 debut | Alignement Void Glass existant |

## 10. Sources consultees (verifiables)

### Open-source self-hosted

- [Rotki GitHub](https://github.com/rotki/rotki) (Python, privacy-first)
- [Ghostfolio GitHub](https://github.com/ghostfolio/ghostfolio) (TypeScript NestJS+Angular)
- [Cryptofolio GitHub](https://github.com/Xtrendence/Cryptofolio) (projet plus petit)

### Commercial / SaaS benchmarks

- [CoinStats](https://coinstats.app/) + [API docs](https://coinstats.app/blog/best-crypto-api/)
- [CoinTracker](https://www.cointracker.io/)
- [Delta by eToro](https://delta.app/)
- [Koinly](https://koinly.io/)
- [CoinTracking](https://cointracking.info/)

### APIs portfolio + on-chain

- [Moralis Wallet API](https://moralis.com/api/wallet/) — 19+ EVM + Solana, 1-payload portfolio
- [Alchemy](https://www.alchemy.com/) — ETH + Polygon + Solana + L2s
- [Covalent / GoldRush](https://goldrush.dev/) — 100+ chains
- [DeBank](https://debank.com/) — DeFi portfolio focus
- [Zapper](https://zapper.xyz/) — protocol interactions + yield
- [Zerion Blog — best multichain portfolio APIs 2026](https://zerion.io/blog/best-multichain-portfolio-apis-2026-guide/)

### Awesome lists

- [Alchemy — List of 41 crypto portfolio dashboards (2026)](https://www.alchemy.com/dapps/best/crypto-portfolio-dashboards)

## 11. Verdict final (tranche Kevin, honnete)

**Ce document conclut : RANGER au backlog V1.3+ avec Option D (hybride) comme piste principale.**

Les vrais blockers avant de commencer :
1. D-TRADING-01 v1 a prouve sa valeur (au moins 2-3 strategies passent les harnesses)
2. V1.1 Nautilus livre (bots live tournent vraiment)
3. Kevin a utilise 1-2 mois CoinStats ou Zerion en observant ce qui lui manque vraiment
4. Option D MVP commence par **P1 (bots monitor dans App Builder)** — la piece unique impossible a avoir chez un SaaS externe, plus forte valeur immediate

**Avant ca, recommandation pragmatique** : utiliser **CoinStats** (free tier ou 10 $/mois) pour voir le portfolio cross-exchange/wallets. C'est le CoinStats ce que 3Commas est pour l'execution : un outil prouve qu'on peut remplacer plus tard quand on saura exactement ce qu'on veut.

**Check-point suggere** : dans 3-6 mois (2026-07 a 2026-10). A ce moment, relire ce doc + voir si l'option D P1 (bots monitor) est pertinente a demarrer seule.

## 12. Relation avec le spec 3Commas Maison

Ce dashboard et [l'OMS/EMS 3Commas Maison](2026-04-19-3commas-alternative-research.md) sont **complementaires** :

- **3Commas Maison** = **execution** (recoit alerte Pine → execute ordre)
- **Dashboard** = **observation** (voit argent partout + status bots + P&L)

Les deux partagent potentiellement :
- `modules/finance/trading/` en dependance (source des strategies + backtest predit)
- Secrets exchange (API keys utilisees aussi bien pour execution que lecture balance)
- VPS deploiement (meme infra 24/7)

A decider plus tard : 1 module unique `modules/finance/live/` (execution + observation) ou 2 modules separes (`finance/trading/` executant + `finance/dashboard/` observant). Probablement 2 separes pour scope discipline.
