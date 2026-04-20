---
title: "Backtest Engine Crypto — Fondations modules/finance/trading/"
date: 2026-04-18
status: design-approved-pending-implementation
scope: backtest-engine-v1
author: Kevin + Claude (brainstorming session)
related:
  - "[[index-trading]]"
  - "[[Compounding Knowledge]]"
module: modules/finance/trading/
---

# Backtest Engine Crypto — Design v1

## 1. Contexte et objectif

Kevin lance les fondations du module `modules/finance/trading/` (umbrella `modules/finance/` avec sous-packages prevus : `trading/`, puis plus tard `patrimoine/`, `fiscalite/`).

**Ambition declaree** : construire un socle permettant de concevoir et deployer des bots de trading crypto automatises. Pipeline principal retenu : **Pine Script → TradingView alerts → 3Commas execution**, avec option Python/Nautilus live pour strategies non-exprimables en Pine.

**Ce premier spec couvre exclusivement le BACKTEST ENGINE** — le moteur qui teste les strategies sur l'historique avec un niveau de realisme proche de la production. Les autres briques (strategy library, research loop, monitoring) seront des specs separes, un a la fois (YAGNI).

**Qualites cibles** (mots de Kevin) : **fonctionnel**, **solide**, **adaptif**.

## 2. Honnetete preliminaire (non-negociable)

Trois verites posees des le cadrage, rappelees ici pour eviter toute illusion :

1. **Aucun backtest ne garantit des gains live.** 90% des backtests DIY souffrent de biais (look-ahead, survivorship, overfitting, slippage/fees irrealistes, funding ignores). Ce design MINIMISE ces biais ; il ne les ELIMINE pas. Un backtest brillant qui echoue en out-of-sample = mort-ne.
2. **Trading crypto retail perd en moyenne.** Meme avec bon outillage, l'edge durable est rare. Ce socle donne une chance reelle ; il ne promet pas de gains.
3. **Pine Script a des limites structurelles.** Pas de multi-timeframe sans repaint, backtester TV biaise par defaut, pas d'orderbook, fills theoriques. Les strategies serieuses sont developpees/validees en Python, puis seulement TRADUITES en Pine pour execution via 3Commas.

Ces limites sont integrees dans l'architecture : verdict de validation bloquant (PBO, DSR), deploy manuel, audit trail complet.

## 3. Decisions de cadrage lockees

| # | Decision | Valeur | Rationale |
|---|---|---|---|
| 1 | Point d'entree | **Backtest engine d'abord** | Sans outil de verite, toute strategie est du bruit. |
| 2 | Module path | `modules/finance/trading/` | Umbrella finance/ avec sous-package trading/ (patrimoine/ plus tard). |
| 3 | Langage | **Python 3.12** | Ecosysteme quant mature (pandas, numpy, scipy, ccxt, nautilus). |
| 4 | Framework backtest | **NautilusTrader** (seul en v1) | Production-grade, event-driven, Rust core, meme code backtest + live. |
| 5 | Horizon strategies | **Multi-horizon swing (1h-4h) + position (1D-1W)** | Pas d'intraday v1 (slippage/latency trop exigeants). Nautilus gere multi-TF nativement. |
| 6 | Univers actifs | **30+ assets spot + perps** | Plus de signaux et diversification ; complexite data pipeline +2 sessions acceptee. |
| 7 | Execution target | **Pine+3Commas principal + Python/Nautilus live optionnel** | Flexibilite max, Nautilus sert les deux chemins. |
| 8 | Rigueur anti-biais | **Rigoureux v1** | Slippage vol-based, latency, walk-forward, purged CV, Monte Carlo 1000+, PBO < 0.15, Deflated Sharpe, funding rates. |
| 9 | Source data | **ccxt + Binance direct + 5 ans max per-asset** | Portabilite (ccxt) + granularite (Binance direct). 5 ans couvre bull 2021 / bear 2022 / bull 2024-25 / regime courant. |

**Approche architecture retenue : C — Hybride pragmatique**. Nautilus natif au coeur, on ajoute AUTOUR uniquement ce qui manque (adapters data, harnesses anti-biais, Pine generator, bridge 3Commas, reports custom).

## 4. Structure des dossiers

```
modules/finance/trading/
├── pyproject.toml              # uv, Python 3.12
├── README.md                   # Overview + liens wiki/domains/trading/
├── .env.example                # Secrets template (BINANCE_*, TC_*, TV_*)
├── .gitignore                  # data/, reports/, *.parquet, .venv, .env
│
├── src/trading/                # Package "src layout"
│   ├── data/
│   │   ├── sources/
│   │   │   ├── base.py         # Protocol DataSource
│   │   │   ├── ccxt_source.py
│   │   │   └── binance_source.py
│   │   ├── catalog.py          # Wrapper Nautilus ParquetDataCatalog
│   │   ├── storage.py          # Parquet + DuckDB queries
│   │   └── quality.py          # Gap/outlier/delisting detection
│   │
│   ├── strategies/
│   │   ├── base.py             # BaseStrategy(nautilus.Strategy) + metadata
│   │   ├── indicators/         # Reusable indicators
│   │   └── _examples/          # 2-3 placeholders (EMA cross, RSI MR)
│   │
│   ├── backtest/
│   │   ├── runner.py           # Wrapper Nautilus BacktestNode
│   │   ├── slippage.py         # Volatility-based slippage + orderbook model
│   │   ├── latency.py          # 100-200ms jitter simulator
│   │   ├── fees.py             # Maker/taker tiered par exchange
│   │   ├── funding.py          # Funding rates perps
│   │   └── harnesses/
│   │       ├── walk_forward.py
│   │       ├── purged_cv.py
│   │       ├── monte_carlo.py
│   │       ├── pbo.py          # Probability of Backtest Overfitting
│   │       └── deflated_sharpe.py
│   │
│   ├── analysis/
│   │   ├── metrics.py          # Sharpe/Sortino/Calmar/DD/PF
│   │   ├── reports.py          # HTML (quantstats + custom templates)
│   │   └── regime.py           # Bull/bear/chop classifier
│   │
│   ├── execution/
│   │   ├── pine/
│   │   │   ├── generator.py    # Strategy Python → Pine v5 source
│   │   │   └── templates/      # Jinja Pine snippets
│   │   ├── threecommas/
│   │   │   ├── webhook.py      # Receiver TV alert → 3Commas
│   │   │   └── api.py          # 3Commas REST wrapper
│   │   └── live/
│   │       └── nautilus_live.py
│   │
│   └── cli/                    # Typer
│       ├── download.py         # `trading download-data ...`
│       ├── backtest.py         # `trading backtest <strategy>`
│       ├── walkforward.py      # `trading walk-forward ...`
│       ├── montecarlo.py       # `trading monte-carlo ...`
│       └── pine.py             # `trading generate-pine <strategy>`
│
├── tests/
│   ├── unit/                   # Harnesses, slippage, fees, Pine gen
│   ├── integration/            # E2E avec data fixture
│   ├── smoke/                  # < 30s, CI pre-merge
│   └── fixtures/               # OHLCV sample + Pine expected
│
├── data/                       # .gitignored (Parquet catalog local)
├── reports/                    # .gitignored (HTML reports generes)
└── scripts/
    └── bootstrap-data.py       # One-off backfill initial
```

**Conventions** :
- `src/` layout (PEP 517 best practice).
- **uv** pour package management (10x plus rapide que poetry, standard 2026).
- **Typer** pour CLI (typing auto, UX > argparse).
- **quantstats** + templates Jinja custom pour reports.
- `data/` et `reports/` gitignores (volumineux, regenerables).
- `.env.example` committe, `.env` ignore.

## 5. Composants et responsabilites

Principe : **une classe = une responsabilite**.

### 5.1 Couche `data/`

| Composant | Responsabilite | Dependances |
|---|---|---|
| `sources.DataSource` (Protocol) | Interface unique pour tout fournisseur data | — |
| `sources.CCXTSource` | OHLCV + funding multi-exchange via ccxt | ccxt |
| `sources.BinanceSource` | Granularite fine (aggTrades, depth) Binance direct | httpx |
| `catalog.Catalog` | Wrap Nautilus `ParquetDataCatalog` pour storage hierarchise | nautilus, pyarrow |
| `storage.Store` | Queries analytiques SQL sur Parquet | duckdb |
| `quality.QualityChecker` | Gap/outlier/delisting detection, `QualityReport` pass/fail | — |

### 5.2 Couche `strategies/`

| Composant | Responsabilite | Dependances |
|---|---|---|
| `base.BaseStrategy` | Parent `nautilus.Strategy` + metadata (name, horizon, instruments, hyperparams, wiki_ref) | nautilus |
| `indicators/*` | EMA, RSI, ATR, Donchian, ADX reutilisables | nautilus.Indicator |
| `_examples/ema_cross.py` | Strategy placeholder de validation socle (PAS pour trader) | base |

### 5.3 Couche `backtest/`

| Composant | Responsabilite | Dependances |
|---|---|---|
| `runner.BacktestRunner` | Orchestre 1 run (engine, data, strategy, ecrit reports) | nautilus, data, strategies |
| `slippage.VolatilityBasedSlippage` | Slippage = f(ATR, order size, spread) | analysis.metrics |
| `latency.LatencySimulator` | Injecte 100-200ms jitter + network failures | — |
| `fees.FeeSchedule` | Maker/taker tiered par exchange + VIP tier | — |
| `funding.FundingCalculator` | Cash flows funding rates sur positions perps | data |
| `harnesses.WalkForward` | Train/test rolling windows + embargo | runner |
| `harnesses.PurgedCV` | K-fold purged (Lopez de Prado) anti-leakage | runner |
| `harnesses.MonteCarlo` | 1000+ runs (trade shuffle + slippage jitter) | runner |
| `harnesses.PBO` | Probability Backtest Overfitting (Bailey/Lopez) | — |
| `harnesses.DeflatedSharpe` | Sharpe ajuste pour N trials testes | — |

### 5.4 Couche `analysis/`

| Composant | Responsabilite | Dependances |
|---|---|---|
| `metrics.PerformanceMetrics` | Sharpe/Sortino/Calmar/MaxDD/ProfitFactor/WinRate/Expectancy | — |
| `reports.HTMLReport` | Tearsheet HTML (quantstats + custom : MC distribution, WF OOS, PBO) | quantstats, jinja2 |
| `regime.RegimeClassifier` | Bull/bear/chop via regles + HMM | hmmlearn |

### 5.5 Couche `execution/`

| Composant | Responsabilite | Dependances |
|---|---|---|
| `pine.PineGenerator` | BaseStrategy → Pine v5 source | jinja2 |
| `pine.templates/` | Templates Pine (entry/exit/alert syntax v5) | — |
| `threecommas.WebhookReceiver` | FastAPI : recoit alert TV → trigger bot 3Commas | fastapi, httpx |
| `threecommas.API` | Wrapper REST 3Commas | httpx |
| `live.NautilusLive` | Strategy en live via Nautilus live mode | nautilus |

### 5.6 Couche `cli/`

Commandes Typer unifiees :
- `trading download-data --source ccxt --symbols BTC/USDT,ETH/USDT --timeframe 1h --start 2021-01-01`
- `trading backtest _examples.ema_cross --period 2022-01:2024-12 --report`
- `trading walk-forward _examples.ema_cross --train 180d --test 60d --embargo 7d`
- `trading monte-carlo _examples.ema_cross --runs 1000`
- `trading pbo --results reports/run-123/*.pkl`
- `trading generate-pine _examples.ema_cross --out strategies/pine/ema_cross.pine`

## 6. Data flow (phases 1 → 6)

**Phase 1 — Ingest** : `DataSource.fetch_ohlcv()` → `QualityChecker` → `Catalog.write_parquet()` (data/parquet/{venue}/{symbol}/{tf}.parquet).

**Phase 2 — Backtest single run** : `BacktestRunner` charge data + applique FeeSchedule + Slippage + Latency + Funding → `Nautilus BacktestNode.run()` → `BacktestResult` (trades, equity_curve, events).

**Phase 3 — Validate (anti-biais)** : `BacktestResult` → `WalkForward` + `PurgedCV` + `MonteCarlo` + `PBO` + `DeflatedSharpe`.

**Verdict rule** :
- ✅ **PASS** si : `PBO < 0.15` AND `DSR > 0` AND `OOS Sharpe > 0.5 * IS Sharpe`
- ⚠️ **WARN** si 1 critere limite
- ❌ **FAIL** si 2+ criteres rouges → strategie refused (Pine gen refuse sauf override explicite)

**Phase 4 — Report** : `HTMLReport.generate()` → `reports/YYYY-MM-DD-<strategy>/` avec `index.html` + `metrics.json` + graphes PNG + `trades.parquet`. Synthese optionnelle via `/save` wiki.

**Phase 5 — Promote** (si verdict PASS) : `PineGenerator` → `.pine` source. Page wiki strategy. Kevin copie-colle dans TV manuellement.

**Phase 6 — Deploy live** :
- **Option A** (principal, Pine+3Commas) : TV Pine → webhook → `WebhookReceiver` → `ThreeCommas.API.trigger_deal()` → exchange.
- **Option B** (optionnel, Python) : `NautilusLive.start()` → exchange via ccxt/Nautilus adapter.

**Phase 7 — Monitor** (future, post-v1) : drift detector live vs backtest OOS.

### Principes du flow

- **Unidirectionnel** : pas de court-circuit (pas de deploy sans validate PASS).
- **Idempotent** : meme inputs → memes outputs (seed Monte Carlo fixe, reproductibilite).
- **Fail-fast** : quality check refuse bad data avant backtest ; verdict refuse strategie douteuse avant report.
- **Observables** : chaque phase ecrit un artefact versioned (parquet, json, html, pine).
- **Gate humaine** : deploy reste MANUEL (copy-paste Pine dans TV, activation 3Commas). Pas d'auto-deploy en v1.

## 7. Interfaces cles (contrats)

### `DataSource` (Protocol)

```python
class DataSource(Protocol):
    def fetch_ohlcv(
        self, symbol: str, timeframe: str, start: datetime, end: datetime
    ) -> pd.DataFrame: ...

    def fetch_funding(
        self, symbol: str, start: datetime, end: datetime
    ) -> pd.DataFrame: ...  # perps only

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]: ...
```

Implementations v1 : `CCXTSource`, `BinanceSource`. Ajout futur (tardis.dev, etc.) = nouvelle classe, zero refacto.

### `BaseStrategy`

```python
class BaseStrategy(nautilus.Strategy):
    name: str                                    # "ema_cross_btc_4h"
    horizon: Literal["swing", "position"]
    instruments: list[str]                       # ["BTCUSDT.BINANCE"]
    hyperparams: dict[str, Any]                  # bornes Pydantic
    wiki_ref: str | None                         # "[[EMA Cross 4h BTC]]"

    def on_bar(self, bar: Bar) -> None: ...
    def to_pine_context(self) -> dict[str, Any]: ...  # variables pour Pine template
```

### `Harness` (Protocol)

```python
class Harness(Protocol):
    def run(
        self, strategy: BaseStrategy, data: DataCatalog, config: HarnessConfig
    ) -> HarnessResult:
        """HarnessResult = { verdict: PASS|WARN|FAIL, metrics: dict, artifacts: list[Path] }"""
```

Tous les anti-biais (WalkForward, PurgedCV, MonteCarlo, PBO, DSR) implementent ce protocole. Ajouter un nouveau test = nouvelle classe, automatiquement plugee dans HTMLReport.

### `ExecutionBridge` (Protocol)

```python
class ExecutionBridge(Protocol):
    def deploy(self, strategy: BaseStrategy, config: DeployConfig) -> DeployResult: ...
    def heartbeat(self) -> HealthStatus: ...
```

Implementations v1 : `ThreeCommasBridge`, `NautilusLiveBridge`.

**Benefice cle** : les 4 protocols rendent le systeme ADAPTIF. Changer un fournisseur, un executeur, ajouter un test = 1 classe isolee, zero refacto ailleurs.

## 8. Gestion des erreurs

| Scenario | Comportement |
|---|---|
| Exchange API rate-limited | Retry exponential backoff (ccxt natif), max 3, puis raise |
| Symbol delisted (ex: LUNA, UST) | `QualityChecker` flag → skip asset avec log explicite, **jamais fallback silencieux** |
| Gap data > 1 bar | Warn, skip range avec log, comptabilise dans QualityReport |
| Backtest crash mid-run | Log full trace + save partial state `reports/<run>/crash.log`, pas de commit partiel |
| Webhook TV ↔ 3Commas down | Retry 3x, alerte Kevin (email ou Telegram), **circuit breaker** : suspend bot apres 5 echecs consecutifs |
| Strategy config incoherente | Validation Pydantic au init, fail au demarrage pas en live |
| Overfitting detecte (PBO > 0.15) | Verdict FAIL, Pine gen refuse sauf `--force-override` manuel + log warning |
| Data fixture absente en tests | Auto-generate fixture depuis *scripts/gen_fixtures.py*, idempotent |

**Regle absolue** : aucune erreur silencieuse. Chaque fallback = log + trace dans le QualityReport du run.

## 9. Strategie de tests

**Unit tests (`tests/unit/`)** — objectif 80% coverage composants critiques :
- Chaque harness (WalkForward, PurgedCV, MonteCarlo, PBO, DSR) avec fixtures deterministes
- Slippage model (cas bas vol, haute vol, gros ordre, petit ordre)
- Fees schedule (chaque exchange tier)
- Pine generator (golden tests vs fichier attendu)
- Quality checker (cas gap, outlier, delisting)

**Integration tests (`tests/integration/`)** :
- Backtest end-to-end : fixture 6 mois BTC 1h → strategy EMA cross → BacktestResult reproductible (meme seed = meme equity curve)
- DataSource → Catalog → Strategy → BacktestRunner chain

**Smoke tests (`tests/smoke/`)** — CI pre-merge, < 30s total :
- 1 test par strategy exemple
- Import tous les modules sans erreur
- CLI `--help` retourne 0

**Golden tests Pine** :
- `trading generate-pine <strategy>` produit un fichier qui matche `tests/fixtures/<strategy>.pine.expected`
- Detection regression si le template change

**CI** : GitHub Actions, Python 3.12, `uv sync` + `pytest` + `ruff` + `mypy` strict. Hook pre-commit local *scripts/pre-commit.sh* (lint + test smoke).

## 10. Couplage avec le wiki (cerveau collaboratif)

Principe : **chaque strategie et chaque backtest a une page wiki**, avec lien bidirectionnel vers le code.

### 10.1 Page strategy (`wiki/domains/trading/strategies/<name>.md`)

Frontmatter standard :
```yaml
---
type: strategy
status: validated | experimental | deprecated
horizon: swing | position
instruments: ["BTCUSDT"]
implementation: ../../../../modules/finance/trading/src/trading/strategies/ema_cross.py
backtest_runs: ../../../../modules/finance/trading/reports/2026-04-18-ema-cross-btc/
pine_source: ../../../../modules/finance/trading/strategies/pine/ema_cross.pine
wiki_ref: "[[EMA Cross 4h BTC]]"
confidence: medium
---
```

Contenu : hypothese, rationale, hyperparametres, resultats backtests cles, decisions d'override eventuelles.

### 10.2 Page backtest (`wiki/domains/trading/backtests/<date>-<strat>.md`)

- Date + verdict (PASS/WARN/FAIL)
- 5-6 metriques cle (Sharpe, Max DD, PBO, DSR, WinRate)
- Lien vers rapport HTML complet (`reports/<run>/index.html`)
- Conclusion Kevin (why deploy / why abandon)

### 10.3 Concepts reutilisables (`wiki/domains/trading/concepts/`)

Sharpe, Kelly criterion, mean-reversion, momentum, funding arbitrage, purged CV, PBO, etc. Une fois par concept, reference par toutes les strategies qui s'en servent.

### 10.4 Skill custom (futur, hors scope v1)

`/save backtest-run <path-to-report>` : extrait automatiquement les metriques du JSON et cree la page wiki backtest. En v1 : creation manuelle suffisante.

### 10.5 Compounding knowledge

En 1 an d'usage : historique complet (hypotheses, backtests, perfs live, strategies survivantes). Le wiki devient un second-brain trading personnel, coherent avec la philosophie Foundation OS.

## 11. Risques identifies

| Risque | Probabilite | Impact | Mitigation |
|---|---|---|---|
| Nautilus learning curve | haute | medium | Docs Nautilus + 1 strategy exemple simple (EMA cross) pour iteration courte |
| Data pipeline 30+ assets complexe | haute | medium | v1 livre BTC+ETH spot+perps ; scaling 30+ assets par batches en phases ulterieures |
| Overfitting masque malgre harnesses | medium | haut | Validation 3-critere (PBO + DSR + OOS/IS ratio) + gate humaine deploy |
| Pine Script limitations (repaint, multi-TF) | haute | medium | Validator Pine gen : refuse constructs dangereux (security() avec look-ahead, etc.) |
| 3Commas webhook down / Binance API cassee | faible | haut | Circuit breaker + alerte + kill-switch manuel documente |
| Funding rates mal modelises pour perps | medium | medium | Tests dedies sur series fondings historiques reelles ; cross-check avec Binance frontend |
| Slippage sous-estime en live | haute | haut | Modele volatility-based (pas flat) + MC avec jitter 2x historical spread |
| Kevin deploye strategie FAIL par erreur | faible | haut | Pine gen refuse FAIL sauf `--force-override` + warning explicite |

## 12. Out of scope (v1, YAGNI strict)

Choses explicitement **exclues** de ce spec, a traiter dans des specs ulterieurs :

- ❌ **Research/ideation loop** : workflow Claude qui brainstorme/screen strategies. A specer apres v1 backtest engine stable.
- ❌ **Strategy library riche** : v1 livre 1-2 strategies exemples techniques (EMA cross, RSI MR) pour valider le socle, PAS pour trader. Vraies strategies = specs dedies.
- ❌ **VectorBT** : ajoute plus tard si besoin exploration massive (parameter sweeps 10k+). YAGNI en v1.
- ❌ **Tardis.dev paid data** : pas de L2 orderbook historique en v1. A considerer quand strategies orderbook-based.
- ❌ **Auto-deploy** : pas de CI/CD qui deploie auto une strategie validee. Kevin reste gate manuelle.
- ❌ **Monitoring live avance** : drift detector, alertes Grafana, reconciliation live/backtest. Phase 7 future.
- ❌ **Multi-user / SaaS** : outil personnel solo, pas de gestion de comptes/permissions.
- ❌ **Machine learning** : features engineering + ML models pour signals. v2+ quand socle rigoureux valide.
- ❌ **Options / exotic** : spot + perps uniquement. Options crypto = autre complexite (greeks, volatility surface).
- ❌ **Stablecoin yield / DeFi farming** : hors scope trading directionnel.

## 13. Criteres de "done" pour ce spec

Le backtest engine v1 est **considere livre** quand :

- ✅ Structure dossiers creee, `uv sync` passe
- ✅ DataSource CCXT + Binance fonctionnels (test : telecharger 30 jours BTC/USDT 1h et le verifier)
- ✅ Catalog Nautilus ecrit + lit du Parquet
- ✅ 1 strategy exemple (EMA cross) backteste end-to-end sur BTC 4h 2 ans
- ✅ Les 5 harnesses (WalkForward, PurgedCV, MonteCarlo, PBO, DSR) produisent un verdict sur l'exemple
- ✅ HTMLReport genere pour le run exemple avec tous les graphes et metrics
- ✅ PineGenerator produit un `.pine` v5 compilable dans TradingView pour l'exemple
- ✅ `tests/smoke/` passe en < 30s
- ✅ `tests/unit/` couvre les 5 harnesses + slippage + Pine gen
- ✅ README explique setup + commandes + couplage wiki
- ✅ Page wiki strategy exemple creee
- ✅ 0 regression Foundation OS (health-check SAIN)

**Pas necessaire v1** : 30+ assets downloades (on valide le pipeline sur BTC+ETH d'abord, scale en phase suivante).

## 14. Dependances externes identifiees

Packages Python (pyproject.toml) :
- `nautilus-trader >= 1.200` (core backtest + live)
- `ccxt >= 4.x` (multi-exchange data)
- `httpx >= 0.27` (3Commas + Binance direct)
- `fastapi >= 0.115` (webhook receiver)
- `typer >= 0.12` (CLI)
- `pydantic >= 2.x` (config validation)
- `pandas >= 2.2`, `numpy >= 2.0`, `pyarrow >= 16` (data)
- `duckdb >= 1.x` (analytics queries)
- `quantstats >= 0.0.65`, `jinja2 >= 3.x` (reports)
- `hmmlearn >= 0.3` (regime)
- `pytest`, `ruff`, `mypy` (dev)

Services externes :
- Binance API (gratuit, rate-limited)
- TradingView (Pine Script editor, plan Premium recommande pour webhooks)
- 3Commas (payant, plan Advanced minimum pour DCA + webhooks)

Secrets `.env` (hors git) :
- `BINANCE_API_KEY`, `BINANCE_SECRET`
- `TC_API_KEY`, `TC_SECRET` (3Commas)
- `TV_WEBHOOK_SECRET` (pour valider alertes entrantes)

## 15. Etapes suivantes

Apres approbation ecrite de ce spec par Kevin :

1. **writing-plans skill** (oh-my-claudecode:writing-plans) genere un plan d'execution detaille multi-sessions avec les 6 elements par phase (pre-conditions, etat repo, actions atomiques, verification, rollback, commit message) — standard Foundation OS.
2. **Plan d'execution probable** (estimation, a affiner dans le plan) :
   - **Phase 1** : Scaffold module + uv + deps + structure dossiers + README (1 session)
   - **Phase 2** : DataSource CCXT + Binance + Catalog + QualityChecker + download-data CLI (1-2 sessions)
   - **Phase 3** : BaseStrategy + example EMA cross + BacktestRunner + FeeSchedule + Slippage + Latency + Funding (2 sessions)
   - **Phase 4** : Harnesses (WalkForward + PurgedCV + MonteCarlo + PBO + DSR) (2 sessions)
   - **Phase 5** : Analysis metrics + HTMLReport + regime classifier (1 session)
   - **Phase 6** : PineGenerator + 3Commas webhook receiver + API wrapper (1-2 sessions)
   - **Phase 7** : Tests unit + integration + smoke + CI GitHub Actions (1 session)
   - **Phase 8** : Wiki strategy page exemple + backtest page + concepts Sharpe/PBO/DSR/etc. + doc README (1 session)

**Total estime v1 : 10-13 sessions** (2-3 semaines calendaires si 1 session / 1-2 jours). A affiner dans le plan detaille.

---

## Annexe — Glossaire (pour Kevin)

- **Backtest** : tester une strategie sur donnees historiques avant de risquer de l'argent reel.
- **OHLCV** : Open/High/Low/Close/Volume, format standard d'une bougie (candle).
- **Slippage** : difference entre le prix attendu et le prix execute reel (defavorable).
- **Funding rate** : paiement periodique entre longs et shorts sur les perpetual futures (peut couter cher).
- **Walk-forward** : on entraine sur periode A, on teste sur periode B (jamais melangees), on avance dans le temps.
- **Purged CV** : cross-validation avec "trous" entre train et test pour eviter que les infos fuitent.
- **Monte Carlo** : simuler 1000+ variations aleatoires pour voir si le resultat tient ou s'il etait un coup de chance.
- **PBO (Probability of Backtest Overfitting)** : chance que la strategie soit bonne par hasard. < 0.15 = sain.
- **DSR (Deflated Sharpe Ratio)** : Sharpe corrige pour tenir compte du fait qu'on a teste N strategies (pas juste une).
- **Spot** : acheter / vendre l'asset reel (ex : BTC).
- **Perp (perpetual futures)** : contrat synthetique qui imite le spot mais permet long ET short + leverage.
- **Pine Script** : langage de TradingView pour coder indicateurs et strategies.
- **3Commas** : service qui execute des trades crypto automatiquement depuis des webhooks.
- **Webhook** : URL qui recoit un message HTTP (alerte TradingView → 3Commas, par exemple).
