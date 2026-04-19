---
title: "Nautilus V1.2 Roadmap — Migration event-driven complete"
date: 2026-04-19
status: roadmap-future-work
scope: modules/finance/trading/ V1.2 extension
author: Kevin + Claude (planning)
related:
  - "[[index-trading]]"
  - "[[Slippage Models]]"
---

# Nautilus V1.2 Roadmap — Migration event-driven complete

> **Statut** : ROADMAP pour V1.2. Pas implemente aujourd'hui. Ce doc est la **cible precise** des `NotImplementedError` actuels dans B1/B2 skeleton.

## 1. Contexte et motivation

### Ce qui existe aujourd'hui (V1 + B1/B2 skeleton)

- `BacktestRunner` pandas simple (module runner de V1)
- `NautilusBridgeRunner` skeleton (B1) : transforms `pandas_to_nautilus_bars()` + `signals_to_order_intents()` + `run()` delegue au runner pandas avec annotation `nautilus_bridge=True`
- `NautilusLiveEngine` skeleton (B2) : lifecycle + order tracking in-memory + kill-switch + on_fill handler
- **Aucun import de `nautilus_trader`** dans les modules actuels (volontaire : garde les tests rapides, evite dependance lourde en V1)

### Ce que V1.2 doit debloquer

Migration vers Nautilus event-driven reelle avec :
- Vrai `BacktestEngine` / `BacktestNode` Nautilus pour backtest (fills partiels, latency reelle, event ordering)
- Vrai `ExecClient` / `DataClient` pour live trading (Binance websocket + REST, ou ccxt Pro fallback)
- Strategies portees en `nautilus_trader.model.Strategy` ou un bridge Adapter qui consume les signals pandas existants
- Data catalog Nautilus natif (`ParquetDataCatalog`) alimenté par notre `Catalog` actuel

## 2. Cartographie des `NotImplementedError` actuels → V1.2 phases

| Code | Fichier | NotImplementedError | Phase V1.2 |
|---|---|---|---|
| 1 | `src/trading/backtest/nautilus_bridge/runner.py::run_full_nautilus()` | Vraie execution via `BacktestNode` Nautilus | **Phase A** (backtest migration) |
| 2 | `src/trading/execution/live/nautilus_live.py::NautilusLiveEngine.connect_to_exchange()` | Connection websocket + REST exchange | **Phase B** (live integration) |
| 3 | `src/trading/execution/live/nautilus_live.py::NautilusLiveEngine.send_order_to_exchange()` | Submission reelle ordre vers broker | **Phase B** (live integration) |

Phases independantes : A peut etre livre sans B, et vice-versa.

## 3. Phase A — Backtest migration Nautilus event-driven

### A.1 — Data catalog migration

**Scope** : alimenter un `nautilus_trader.persistence.ParquetDataCatalog` depuis notre `trading.data.catalog.Catalog` existant.

**Fichiers** :
- Create `src/trading/data/nautilus_catalog_builder.py` — fonction `build_nautilus_catalog(our_catalog, out_dir) -> Path`
- Tests `tests/unit/data/test_nautilus_catalog_builder.py`

**Tasks** :
- [ ] Installer nautilus-trader (deja dans deps main via pyproject)
- [ ] Convertir notre Parquet OHLCV en format Bar Nautilus (requires `BarType`, `Instrument`, `BarSpecification`)
- [ ] Enregistrer l'instrument via `InstrumentProvider`
- [ ] Tests : round-trip write + read depuis `ParquetDataCatalog`

**Effort estime** : 1-2 sessions subagent

### A.2 — Strategy Nautilus Adapter

**Scope** : creer une classe `NautilusStrategyAdapter` qui herite `nautilus_trader.model.Strategy` et **wrappe** nos `BaseStrategy` pandas existantes sans les modifier.

**Principe** : les 5 strategies actuelles (ema_cross, donchian, rsi, multi_tf, bollinger) restent pandas-based. L'adapter :
1. Accumule les bars Nautilus en DataFrame au fil de l'eau
2. Apelle periodiquement `our_strategy.generate_signals(df)` sur la fenetre recente
3. Convertit les signals en `MarketOrder` Nautilus et submit via `self.submit_order()`

**Fichiers** :
- Create `src/trading/strategies/nautilus_adapter.py`
- Tests `tests/integration/test_nautilus_adapter.py`

**Effort** : 2-3 sessions

### A.3 — BacktestNode integration

**Scope** : debloquer `NautilusBridgeRunner.run_full_nautilus()` avec un vrai `BacktestNode`.

**Tasks** :
- [ ] Instancier `BacktestEngineConfig` + `BacktestVenueConfig`
- [ ] Charger data via catalog A.1
- [ ] Lancer strategy via adapter A.2
- [ ] Extraire trades/equity du `BacktestEngine.trader.generate_order_fills_report()`
- [ ] Mapper vers notre `BacktestResult` existant (compat ascendante)

**Fichiers** :
- Modify `src/trading/backtest/nautilus_bridge/runner.py`
- Tests `tests/integration/test_nautilus_bridge_full_run.py`

**Effort** : 2-3 sessions

### A.4 — Harnesses migration

**Scope** : valider que les 5 harnesses anti-biais (WalkForward, PurgedCV, MonteCarlo, PBO, DSR) fonctionnent toujours avec les `BacktestResult` produits par le runner Nautilus.

**Tasks** :
- [ ] Run chaque harness sur une strategie exemple via `NautilusBridgeRunner.run_full_nautilus()`
- [ ] Comparer distributions : les verdicts doivent etre coherents avec le runner pandas (tolerance sur ecart)
- [ ] Documenter ecarts (slippage model Nautilus peut differer — on utilise son fill engine natif)

**Effort** : 1 session

### A.5 — CLI update

**Scope** : flag `--engine nautilus` sur `trading backtest`, `walk-forward`, `monte-carlo`.

**Effort** : 0.5 session

**Total Phase A** : 6-9 sessions subagent

## 4. Phase B — Live integration

### B.1 — Exchange adapter choice

Decision a prendre avant de commencer :

- **Option 1** : Adapter Nautilus natif Binance (`nautilus_trader.adapters.binance.BinanceExecClient` + `BinanceDataClient`)
  - Pro : integre, event-driven natif, fills partiels corrects
  - Con : coverage exchange limite (Binance, Bybit principalement)

- **Option 2** : ccxt Pro WebSocket (deja utilise partiellement via `CCXTSource`)
  - Pro : 100+ exchanges, deja familier
  - Con : pas event-driven au sens Nautilus, necessite bridging

- **Option 3** : Hybrid (Nautilus adapter natif pour Binance principal + ccxt fallback pour exotiques)
  - Pro : best of both
  - Con : 2 stacks a maintenir

**Recommandation V1.2** : Option 1 (Nautilus Binance adapter) pour MVP. Option 3 si besoin multi-exchange.

### B.2 — Connect + authentication

**Scope** : debloquer `NautilusLiveEngine.connect_to_exchange(api_key, api_secret)`.

**Tasks** :
- [ ] Instancier `BinanceAccountType.SPOT` ou `USDT_FUTURE`
- [ ] Configure `LiveExecClient` + `LiveDataClient`
- [ ] WebSocket subscribe to instruments
- [ ] Gestion reconnect automatique

**Fichiers** :
- Modify `src/trading/execution/live/nautilus_live.py`
- Tests `tests/integration/test_nautilus_live_connect.py` — avec **testnet Binance**, pas mainnet

**Effort** : 2 sessions

### B.3 — Order submission + reconcile

**Scope** : debloquer `send_order_to_exchange(order_id)`.

**Tasks** :
- [ ] Conversion `LiveOrder` → `nautilus_trader.model.orders.MarketOrder`
- [ ] Submit via `self.submit_order(order)` (heritage Nautilus Strategy)
- [ ] Gestion fills partiels (on_fill event-driven deja present, a enrichir)
- [ ] **Reconcile** : au startup, query exchange pour positions + open orders, sync avec state local
- [ ] Retry logic sur rejections

**Effort** : 2-3 sessions

### B.4 — Monitoring + alerts

**Scope** : Telegram/email alerts sur events critiques.

**Tasks** :
- [ ] Hook `on_order_rejected` → alert
- [ ] Hook `on_position_opened/closed` → log
- [ ] Heartbeat VPS (healthcheck endpoint)
- [ ] Kill-switch auto si N failures consecutives (deja present dans `KillSwitch.record_failure()`, a brancher sur les events Nautilus)

**Effort** : 1-2 sessions

### B.5 — Paper trading mode

**Scope** : `NautilusLiveEngine(paper=True)` utilise Binance testnet au lieu de production.

**Pratique obligatoire** : Kevin doit rouler 1-2 mois en paper avant live sur une strategie donnee.

**Effort** : 0.5 session

**Total Phase B** : 5-7 sessions subagent

## 5. Prerequis

### Prerequis techniques

1. Installer `nautilus-trader>=1.200` (deja dans deps main, mais jamais importe aujourd'hui — tester la compat d'abord)
2. Fix `pyproject.toml` : verifier que `numpy<3` + `nautilus-trader` coexistent (historiquement source de conflits)
3. Disposer d'un testnet Binance (gratuit)
4. VPS deja loue (ou Hetzner 10-20 $/mois)

### Prerequis organisationnels

1. **D-TRADING-01 v1 prouve** : au moins 1 strategie qui passe les harnesses anti-biais avec verdict PASS
2. **Kevin a utilise 3Commas live 1-3 mois** : il sait ce qui marche, ce qui manque, ce qui merite d'etre reimplemente
3. **Paper trading budget** : Kevin accepte 1-2 mois de paper avant live sur chaque strategie

## 6. Risques honnetes

| Risque | Probabilite | Impact | Mitigation |
|---|---|---|---|
| Nautilus API breaking change entre versions | moyenne | haut | Pin `nautilus-trader==<version>` stricte, test CI a chaque update |
| Fills partiels pas geres correctement | haute | haut | Integration tests avec testnet sur 1 semaine minimum avant live |
| Reconcile state desync (startup, crash VPS) | haute | haut | Reconcile obligatoire au startup + tests crash-recovery |
| Exchange rate limit / ban API key | moyenne | haut | Throttle + backoff exponential + circuit breaker |
| Secrets leak VPS | faible | critique | Permission API `trade only` + IP whitelist exchange + vault chiffre |
| Bug execution = argent reel perdu | haute | critique | Paper trading 1-2 mois, kill-switch testable avant live, micro-positions au debut |
| V1.2 scope creep | haute | moyen | Discipline YAGNI, 1 strategie live d'abord puis extension |

## 7. Ce que V1.2 ne fera PAS

Explicitement hors scope V1.2 (reporte V1.3+) :

- VectorBT integration pour parameter sweeps massifs
- tardis.dev L2 orderbook historique
- Machine learning features engineering
- Multi-venue smart order routing
- Options crypto
- DeFi protocols integration
- Mobile app native

## 8. Decision queue V1.2

| Decision | Quand | Critere |
|---|---|---|
| Option 1 vs 2 vs 3 adapter exchange | debut Phase B | Coverage exchange prevue + preference stack |
| Testnet Binance vs ccxt paper mode | debut B.5 | Simplicite + fidelity to production |
| VPS provider (Hetzner / DigitalOcean / autre) | debut Phase B | Latence vers Binance + cout |
| 1 strategie live vs multi-strategies | pendant Phase B | Stabilite B.3 reconcile sur 1 strat d'abord |

## 9. Estimation totale V1.2

**Phase A (Backtest migration)** : 6-9 sessions subagent (~1-2 semaines calendaires)

**Phase B (Live integration)** : 5-7 sessions subagent (~1-2 semaines) + **2-3 mois paper trading** avant live

**Total effort dev** : 11-16 sessions subagent = ~2-4 semaines calendaires intensives

**Total temps reel** (avec paper) : **3-5 mois** avant d'etre prod live confiant

## 10. Check-points suggeres

- **2026-05** (1 mois apres V1) : D-TRADING-01 a-t-il prouve sa valeur ? Si non, pas de V1.2.
- **2026-06** (2 mois) : 1 strategie tournant sur 3Commas + wiki update qui documente ce qui manque ? Si oui, demarrer Phase A.
- **2026-07** (3 mois) : Phase A livree + harnesses valides sur Nautilus ? Si oui, demarrer Phase B.
- **2026-09** : Phase B livree + 2 mois paper Binance testnet ? Si metrics live match backtest OOS dans tolerance, **premier trade live petit volume**.

## 11. Relation avec les autres specs

- [3Commas Maison V1.2+](2026-04-19-3commas-alternative-research.md) : V1.2 Nautilus **remplace** l'option "build 3Commas maison from scratch". Nautilus live = l'execution engine self-hosted equivalent a 3Commas.
- [Finance Dashboard Maison V1.3+](2026-04-19-finance-dashboard-research.md) : consomme les events live (fills, positions, PNL) du `NautilusLiveEngine` pour alimenter le dashboard "bots monitor" P1.

## 12. Honnetete finale

V1.2 est un **gros chantier**. C'est le plus gros step apres D-TRADING-01. Prudence :

- **Pas de V1.2 si V1 ne marche pas** (critere go/no-go : au moins 1 strategie passe PASS sur walk-forward + PBO + DSR sur donnees reelles BTC/ETH 3+ ans)
- **Pas de live sans 2 mois paper minimum** par strategie
- **Pas de deploy sans kill-switch testable et teste**
- **Pas de multi-strategies en live en meme temps** avant 1 strategie stable 3 mois
- **Pas d'argument economique** ("3Commas coute 50$/mois" ≠ argument) — le vrai argument est **controle + apprentissage + possibilite d'ajouter features non-dispos chez 3Commas** (drift detector live vs OOS backtest, notamment)

V1.2 n'est pas urgent. V1 (livre aujourd'hui) est deja un outil utile : code les strategies, backtest-les rigoureusement via harnesses, genere le Pine, fais tourner via 3Commas. Quand Kevin aura vraiment besoin de fills partiels / low-latency / drift-detector-live, V1.2 sera reoouvert avec ce doc comme point de depart.
