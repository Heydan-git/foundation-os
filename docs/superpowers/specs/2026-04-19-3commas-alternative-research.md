---
title: "3Commas Maison — Recherche exploratoire (future work, hors scope immediat)"
date: 2026-04-19
status: research-future-work
scope: modules/finance/trading/ extension V1.2+
author: Kevin + Claude (recherche autonome)
related:
  - "[[index-trading]]"
  - "[[Order Execution Management System]]"
---

# 3Commas Maison — Recherche exploratoire (V1.2+)

> **Statut** : RECHERCHE SEULEMENT. Hors scope du plan D-TRADING-01 (backtest engine v1 socle) deja livre. Ce document consolide l'investigation commandee par Kevin et **range l'idee au backlog** pour decision plus tard.

## 1. Contexte et motivation

Kevin paie actuellement ~50 $/mois pour 3Commas (plan Pro estime). Usage principal : recevoir les alertes Pine Script depuis TradingView et executer les ordres sur exchange (Binance / Bybit). Question posee : peut-on **reproduire la partie critique de 3Commas en self-hosted**, integre a `modules/finance/trading/`, et economiser l'abonnement ?

**Objectif long-terme** : un service maison tournant 24/7, aussi fiable que 3Commas sur le chemin alerte → ordre, integre organiquement au reste du module trading.

**Contrainte explicite Kevin** : pas d'implementation maintenant, juste documenter et ranger.

## 2. Ce que fait 3Commas (synthese doc officielle)

Source : [developers.3commas.io](https://developers.3commas.io/), [github.com/3commas-io/3commas-official-api-docs](https://github.com/3commas-io/3commas-official-api-docs), [help.3commas.io](https://help.3commas.io/en/articles/10660580-3commas-api-official-documentation).

### 2.1 Types de bots

| Bot | Usage | Equivalent maison |
|---|---|---|
| **Signal Bot** | Recoit un webhook TradingView JSON → ouvre/ferme un deal | **C'est CE qu'on veut repliquer en priorite.** |
| **DCA Bot** | Dollar-Cost Averaging avec safety orders, take-profit, stop-loss | Complexe, multi-orders en attente, non prioritaire |
| **Grid Bot** | Place N ordres buy/sell dans une range, profit sur oscillations | Complexe, gestion d'inventaire, non prioritaire |
| **Options Bot** | Strategies sur crypto options | Hors scope |
| **Smart Trade** | Order manuel + SL/TP/trailing conditionnels | Simple a imiter |

**80% du use-case Kevin = Signal Bot** (strategie Pine → alerte → execute). DCA/Grid peuvent rester chez 3Commas ou etre abandonnes.

### 2.2 API (authentication + endpoints)

- **Protocole** : REST HTTPS + webhook entrant
- **Authentification** : HMAC SHA256 sur `uri?totalParams` avec `APIKEY` + `Signature` headers
- **Endpoints cles** :
  - `GET /ver1/bots` — liste bots
  - `POST /ver1/bots/:id/start_new_deal` — trigger un deal
  - `GET /ver1/deals` — liste deals (state, pnl)
  - `POST /ver1/smart_trades` — orders conditionnels
  - `GET /ver1/accounts` — comptes exchange connectes
- **Permissions** : read / trade / system_info (separees)
- **Rate limits** : non documentes precisement (a deduire a l'usage)

**Note** : on a deja implemente dans `modules/finance/trading/src/trading/execution/threecommas/api.py` (Task 6.2) le wrapper HMAC SHA256 + `list_bots` + `start_deal`. Le wrapper sert a **consommer** 3Commas. Un remplacement maison impose de **reimplementer cote serveur** ce que 3Commas fournit.

### 2.3 Features de valeur

- Multi-exchange : ~30 exchanges abstraits (Binance spot/perp, Bybit, Kraken, OKX, Coinbase, Bitfinex, KuCoin, etc.)
- Paper trading integre
- Monitoring web UI (P&L, deals history, equity curve)
- Copy-trading (pas utile pour Kevin a priori)
- Kill-switch / pause globale (essentiel en prod)
- Gestion des retries sur ordres refuses (insufficient balance, market closed, etc.)
- Mobile app (alertes push)
- Multi-user (pas utile solo)

## 3. Scope minimal viable d'un "3Commas maison" (Signal Bot only)

Si on se limite a ce que Kevin utilise vraiment (Signal Bot a 80-90%), le scope devient **raisonnable** :

### 3.1 Composants indispensables

1. **Webhook receiver** (FastAPI) — deja present partiellement dans `execution/threecommas/webhook.py`, a durcir (auth renforcee, rate limit, idempotence, replay protection).
2. **Order router / execution engine** — le coeur : recoit un signal valide → calcule la taille → envoie ordre via ccxt → retry si echec → confirme fill.
3. **Position / deal tracker** — etat local (PostgreSQL ou SQLite) : deals ouverts, PNL en vol, stops trailing, synchronisation exchange ↔ local.
4. **Kill-switch / pause** — endpoint `/pause`, commande Telegram, fichier drapeau. Essentiel pour intervention humaine urgente.
5. **Monitoring + alertes** — P&L live, heartbeat VPS, alertes drift live vs backtest, Telegram/email/SMS sur anomalie (reject, disconnect, DD trop grand).
6. **Secrets management** — chiffre au repos, `.env` + peut-etre vault tiers (SOPS, age).
7. **Deployment 24/7** — Docker + systemd `restart=always` sur VPS (Hetzner/DigitalOcean ~10-20 $/mois).

### 3.2 Composants secondaires (peut attendre)

- UI web (dashboard deals, equity). V1 : logs + Telegram suffisent.
- Paper trading mode natif. V1 : utiliser testnet Binance.
- Multi-account / multi-tenant. V1 : solo Kevin.
- DCA et Grid. Attendre valeur prouvee Signal Bot d'abord.

### 3.3 Economie reelle estimee

| Poste | 3Commas | Maison |
|---|---|---|
| Abonnement | 50 $/mois = 600 $/an | 0 |
| VPS | inclus | 10-20 $/mois = 120-240 $/an |
| Monitoring (Grafana Cloud free tier / Telegram gratuit) | inclus | 0 |
| **Total annuel** | **600 $** | **120-240 $** |
| **Economie** | — | **360-480 $/an** |

Puis il y a le cout **temps de dev** (hors argent Kevin, mais reel) : 5-10 sessions sub-agent-driven similaires au plan D-TRADING-01, plus maintenance continue (bug fix, adaptations API exchange, etc.). L'economie pure argent (~400 $/an) ne suffit probablement pas a justifier l'effort **en valeur strictement financiere**. **Mais** :

- Controle total (pas de changement unilateral 3Commas, pas de risque service down cote eux)
- Apprentissage et IP
- Personnalisation profonde (features non-disponibles 3Commas, ex : routing cross-exchange ou integration custom regime classifier interne)
- Suppression d'une dependance externe critique (un outil qui execute ton argent = surface d'attaque)

**Honnetete** : l'argument economique seul est faible. L'argument **autonomie + controle** est le vrai moteur.

## 4. Options architecturales

### Option A — Fork/integration d'un open-source mature (moins d'effort)

Candidats principaux (recherche 2026) :

| Framework | Stars | Focus | Adequation Signal Bot TV | License |
|---|---|---|---|---|
| **[Freqtrade](https://github.com/freqtrade/freqtrade)** | 25k+ | Signal-driven Python, multi-exchange, FreqAI ML, Hyperopt | ✅ moyen — strategy framework different de Pine | GPL-3 |
| **[Jesse](https://jesse.trade/)** | ~5k | Clean Python, MIT, backtest rigoureux | ⚠️ limite aux strategies Python natives | MIT |
| **[Hummingbot](https://hummingbot.org/)** | 6k+ | Market making, liquidite | ❌ pas signal-based | Apache-2 |
| **[OctoBot](https://www.octobot.cloud/)** | ~3k | No-code GUI, TV triggers, AI | ✅ **bon match**, recoit TV webhooks nativement | GPL-3 |
| **[Superalgos](https://superalgos.org/)** | ~3k | Reception TV alertes + strategy engine visuel | ✅ match | Apache-2 |
| **[OpenAlgo](https://github.com/marketcalls/openalgo)** | ~2k | Flask + React, multi-broker | ✅ match, mais focus brokers indiens/US | AGPL-3 |

**OctoBot** et **Superalgos** sont les plus proches du use-case Signal Bot TV. Les deux recoivent nativement TV webhooks et gerent execution cross-exchange.

**Avantages fork** :
- Enorme economie de temps (le 0 → 1 est deja fait)
- Communaute active, bugs trouves par d'autres
- Plugins / strategies partages

**Inconvenients fork** :
- Integration avec notre `modules/finance/trading/` pas naturelle (2 stacks a maintenir)
- License GPL-3 contamine (pour Freqtrade et OctoBot) : si on veut IP privee un jour, AGPL/GPL pose question
- Dependance a un projet externe (si maintainer abandonne, on herite de la dette)
- Features 3Commas specifiques (DCA multi-pair, grid) pas forcement couverts

### Option B — Build maison minimal integre (controle total)

Architecture proposee si on chemine cette voie :

```
modules/finance/trading/src/trading/execution/
├── live/                               # Deja scaffold Phase 6
│   ├── engine.py                       # Order execution engine (ccxt + retry + idempotence)
│   ├── state.py                        # Deal tracker (SQLite/Postgres)
│   ├── kill_switch.py                  # Pause globale + health-check endpoint
│   ├── risk_guard.py                   # Max DD journalier, max position size, circuit breaker
│   └── nautilus_live.py                # STUB actuel, a remplir V1.1 + V1.2
├── threecommas/                        # Deja Phase 6, client API 3Commas (consommation)
│   └── (existant — consommer 3Commas reste possible en fallback)
├── webhook/                            # Nouveau en V1.2
│   ├── server.py                       # FastAPI durci (auth HMAC + rate limit + replay)
│   ├── auth.py                         # Validation HMAC entrant + anti-replay (nonce + TTL)
│   ├── dispatcher.py                   # Route signal → strategy → engine
│   └── dedup.py                        # Idempotence (alerte TV dupliquee = 1 ordre)
├── monitoring/                         # Nouveau en V1.2
│   ├── telegram.py                     # Alertes
│   ├── metrics.py                      # Prometheus (optionnel)
│   └── drift.py                        # Compare live P&L vs backtest OOS (drift detector)
└── deploy/                             # Nouveau en V1.2
    ├── docker-compose.yml              # FastAPI + Postgres + optionnel Redis
    ├── systemd-trading.service         # restart=always
    └── scripts/
        ├── deploy.sh                   # Deploiement VPS
        └── backup-state.sh             # Dump Postgres quotidien
```

**Avantages** :
- Integration parfaite au reste du module trading (meme `BaseStrategy`, meme `BacktestRunner`, meme `Catalog`)
- License libre (MIT comme le reste de Foundation OS)
- Kevin garde tous les secrets
- Possibilite de drift detection auto : compare P&L live du bot a ce que le backtest OOS predisait (invention Foundation OS)

**Inconvenients** :
- 6-10 sessions subagent-driven (similar au plan D-TRADING-01)
- Bugs en prod = risque financier reel (a dosifier avec paper trading 1-2 mois d'abord)
- Maintenance continue (API exchange changes, certificats TLS renewal, etc.)

### Option C — Hybride (recommande a priori, a valider)

- **Garder 3Commas** pour DCA et Grid (complexes, valeur reelle de l'abonnement)
- **Build minimum maison** pour **Signal Bot uniquement** : webhook receiver → ccxt execution
- Si Signal Bot maison tient 3 mois stable en paper, **migrer** les Signal Bots de 3Commas vers maison
- Plus tard (V1.3+) : envisager DCA/Grid maison si la valeur est prouvee

Avantage : scope reduit (1 type de bot au lieu de 5), risque bas, garde le filet 3Commas pour les choses complexes.

## 5. Honnetete, risques et limites

### 5.1 Risques techniques majeurs

- **Race conditions** : deux webhooks arrivent en 50ms → on envoie 2 ordres → on se retrouve avec 2x la position. Solution : idempotence via nonce/ID dans le payload TV + table `processed_alerts` en DB.
- **Fills partiels** : un ordre limit n'est fille que partiellement. Notre runner pandas ne gere pas ca (il suppose fills complets instantanes). Une execution live doit etre event-driven avec `on_fill_partial`, `on_cancel`, etc. → pousse vers **Nautilus live** (Task 3.5 + 6.3 reportees V1.1).
- **Disconnect exchange** : websocket degrade pendant 30s, on rate un exit. Solution : heartbeat + fallback polling + kill-switch auto si derive > seuil.
- **Rate limits** : Binance rate-limit = 1200 req/min. Si une strategie se reveille avec 10 alertes simultanees, on peut tomber. Solution : queue + throttle.
- **Secrets leak** : une cle API qui sort = drain de compte. Solution : permission `trade only` sans withdraw, IP whitelist exchange, vault chiffre au repos.
- **Bug de code** = argent reel perdu. 3Commas a des annees de bugs fixes. Un bot maison neuf est dangereux : **paper trading 1-2 mois obligatoire**.

### 5.2 Risques humains

- Kevin est solo. Un bug d'infra a 2h du matin = pas d'intervention rapide. Mitigation : kill-switch Telegram, alertes anomalie, stop-loss exchange-side hard (pas seulement software-side).
- Dette de maintenance : chaque update API Binance = potentielle regression. Budget temps continuel.
- Tentation d'ajouter des features : une fois le socle en place, envie d'ajouter multi-exchange, arb, etc. → scope creep. Discipline YAGNI.

### 5.3 Limites inherentes au self-host

- Jamais la meme surface de test que 3Commas (millions de deals annuels vs nos quelques centaines).
- Support exchange nouveaux plus lent (3Commas ajoute un exchange, nous devons faire le travail nous-memes — ccxt aide, mais pas magique).
- Pas de mobile app native (sauf a developer aussi, hors scope).

### 5.4 Ce que ce document **ne garantit pas**

- Qu'un bot maison sera aussi fiable que 3Commas. Probable avec 6+ mois de stabilisation, pas en 10 sessions.
- Que l'economie financiere vaille l'effort. L'argument est l'autonomie + controle, pas le prix.
- Que l'idee doit etre executee. Ce document **range** l'option au backlog pour decision ulterieure quand la valeur sera claire.

## 6. Roadmap suggeree (SI et quand Kevin decide d'y aller)

Decomposition indicative, **pas un plan execute**. Chaque phase produit un incrementally deployable step.

| Phase | Scope | Effort estime |
|---|---|---|
| **P1 — Webhook receiver durci** | FastAPI + HMAC incoming + idempotence nonce + rate limit + replay protection. Upgrade de l'existant Phase 6.2. | 1-2 sessions |
| **P2 — Execution engine minimal** | ccxt client abstrait + retry exponential + fills partiels basiques + deal tracker SQLite | 2-3 sessions |
| **P3 — Kill-switch + monitoring** | Endpoint `/pause`, drapeau fichier, commande Telegram, heartbeat VPS, alertes reject/disconnect | 1-2 sessions |
| **P4 — Paper trading mode** | Exchange testnet Binance integre, mode `PAPER` dans config, 1 mois de validation avant live | 1 session + 30j observation |
| **P5 — Risk guard** | Max DD journalier, max position notional, circuit breaker auto-pause apres N echecs | 1-2 sessions |
| **P6 — Drift detector** | Compare live P&L au backtest OOS predit. Alerte si deviation > seuil. Integre au plan backtest deja livre (reports/). | 1-2 sessions |
| **P7 — Migration progressive** | Migrer 1 strategie de 3Commas vers maison. Observer. Migrer les autres si stable 2 mois. | 1 mois calendaire |
| **P8 — Decision finale 3Commas** | Apres 6+ mois paper + live sur 1-2 strategies : couper 3Commas ou garder en parallele | a mesurer |

**Total estime** : 9-12 sessions + 3-6 mois calendaires de stabilisation/paper/live.

## 7. Prerequis non-trivaux

1. **Nautilus event-driven** (Task 3.5 du plan D-TRADING-01, reporte) — **indispensable** pour fills partiels et event-driven correct. On ne fait pas P2-P3 sans ca.
2. **NautilusLive** (Task 6.3, stub actuel) — base d'execution robuste.
3. **1-2 strategies stables** via V1.1 — il faut avoir quelque chose a executer qui marche avant de construire l'executeur.
4. **VPS loue et configure** — pas necessaire immediatement mais a prevoir en P1-P2.
5. **Paper trading discipline** — Kevin doit accepter de ne pas passer live pendant 1-2 mois minimum.

## 8. Decision queue (pour plus tard, pas maintenant)

| Decision | Quand la prendre | Critere |
|---|---|---|
| Option A (fork OctoBot/Superalgos) vs B (maison) vs C (hybride) | Quand V1.1 livree | Voir la vraie complexite de Nautilus live ; juger si l'ecart avec OctoBot est petit ou grand |
| VPS provider (Hetzner / DigitalOcean / autre) | P1 debut | Latence vers Binance, cout, confiance |
| PostgreSQL vs SQLite pour deal state | P2 debut | Volume prevu, robustesse |
| Redis queue pour signaux ou pas | P2 debut | Frequence signaux attendue |
| Telegram vs email vs SMS pour alertes | P3 debut | Preference Kevin |

## 9. Sources consultees (verifiables)

### Documentation officielle 3Commas

- [developers.3commas.io](https://developers.3commas.io/) — API platform
- [github.com/3commas-io/3commas-official-api-docs](https://github.com/3commas-io/3commas-official-api-docs) — OpenAPI specs
- [help.3commas.io — API docs](https://help.3commas.io/en/articles/10660580-3commas-api-official-documentation)
- [help.3commas.io — Signal bot FAQ](https://help.3commas.io/en/articles/8637909-signal-bot-faq)

### Open-source alternatives

- [Freqtrade GitHub](https://github.com/freqtrade/freqtrade) (25k+ stars, signal-driven, ML)
- [Hummingbot](https://hummingbot.org/) (market making focus)
- [Jesse GitHub](https://github.com/jesse-ai/jesse) (MIT, Python clean)
- [OctoBot](https://www.octobot.cloud/) (no-code GUI, TV triggers natifs)
- [Superalgos](https://superalgos.org/) (visual strategy engine)
- [OpenAlgo](https://github.com/marketcalls/openalgo) (Flask + React)
- [awesome-crypto-trading-bots](https://github.com/botcrypto-io/awesome-crypto-trading-bots) (liste curated)

### TradingView webhook specifiques

- [CryptoGnome/Tradingview-Webhook-Bot](https://github.com/CryptoGnome/Tradingview-Webhook-Bot)
- [robswc/tradingview-webhooks-bot](https://github.com/robswc/tradingview-webhooks-bot)
- [Mtemi/Bybit-Trading-Bot-Integrated-with-TradingView-Webhook-Alerts](https://github.com/Mtemi/Bybit-Trading-Bot-Integrated-with-TradingView-Webhook-Alerts)
- [51bitquant/binance-tradingview-webhook-bot](https://github.com/51bitquant/binance-tradingview-webhook-bot)

### Commercial competitors 3Commas

- [WunderTrading](https://wundertrading.com/) — TV-native, pricing inferieur
- [Altrady](https://www.altrady.com/) — 18+ exchanges
- [Wise Trade](https://yzetrade.com/) — execution sub-second claimed
- [TradersPost](https://traderspost.io/) — multi-asset
- [Pionex](https://www.pionex.com/) — gratuit single exchange

### VPS / hosting production 24/7

- [Bluehost blog — VPS for crypto bots](https://www.bluehost.com/blog/vps-for-crypto-trading-bots/)
- [coin.host — How to choose VPS](https://coin.host/blog/how-to-choose-a-vps-for-your-crypto-trading-bot)

### OMS/EMS

- [Axon Trade](https://axon.trade/) — digital asset OMS/EMS (institutional)

## 10. Verdict final (tranche Kevin, honnete)

**Ce document conclut : RANGER au backlog V1.2+.**

La question ne se pose sincerement que quand :
1. Le backtest engine actuel (D-TRADING-01) a prouve sa valeur avec 2-3 strategies qui passent les harnesses anti-biais.
2. V1.1 (Nautilus event-driven + NautilusLive) est livre.
3. Kevin tourne au moins 1 strategie en live via 3Commas depuis 2-3 mois et peut dire precisement quoi ne marche PAS chez eux.

Avant ca, **3Commas reste le meilleur choix** : 50 $/mois pour eviter 10+ sessions de dev + 6 mois de paper + risque bug prod = excellent deal. L'economie apparente est une illusion si on compte le cout caché du dev et du risque.

**Prochaine verification (check-point suggere)** : dans 3 mois (2026-07), quand le socle aura vecu. A ce moment, relire ce doc et decider Option A/B/C ou abandon.
