# modules/finance/trading/

Backtest engine crypto + Pine Script bridge + 3Commas execution pour Foundation OS.

> **Honnetete** : Un backtest ne garantit pas de gains live. Cet outil minimise les biais courants (look-ahead, overfitting, slippage irrealiste, funding ignores) ; il ne les elimine pas. Trading crypto retail perd en moyenne. Deploiement live reste gate humaine (copy-paste Pine dans TradingView, activation 3Commas manuelle).

## Architecture

- **Backtest engine** pandas-based + **Nautilus Bridge skeleton** (V1.2 migration prep)
- **Data pipeline** : ccxt (multi-exchange) + Binance direct + Catalog Parquet + QualityChecker (gaps, outliers, delistings)
- **Strategy framework** : `BaseStrategy` + `StrategyMetadata` Pydantic, indicators reutilisables (EMA/RSI/ATR)
- **Strategy library** (5 strategies experimental) : EMA cross, Donchian breakout, RSI mean-reversion, Multi-TF trend, Bollinger breakout
- **Anti-biais harnesses** : WalkForward + PurgedCV (Lopez de Prado) + MonteCarlo (1000+ runs) + PBO (Bailey-Lopez overfitting) + DeflatedSharpe (multi-trials correction)
- **Execution bridges** : PineGenerator (Pine v5 templates Jinja2) + 3Commas REST API + FastAPI WebhookReceiver + NautilusLiveEngine skeleton (event-driven + KillSwitch, V1.2 broker integration)
- **Analysis** : PerformanceMetrics (Sharpe/Sortino/Calmar/MaxDD/ProfitFactor) + HTMLReport tearsheet Void Glass + RegimeClassifier

Design complet : [spec](../../../docs/superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md).
Plan execution : [plan](../../../docs/plans/2026-04-19-finance-trading-backtest-engine.md).
Roadmap V1.2 Nautilus migration : [spec](../../../docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md).

## Setup

```bash
cd modules/finance/trading
uv sync --all-extras
cp .env.example .env  # puis editer les secrets : Binance + 3Commas + TV webhook
```

## Usage end-to-end

### 1. Telecharger donnees

```bash
uv run trading download-data --source ccxt --symbols BTC/USDT,ETH/USDT --timeframe 1h --start 2021-01-01
```

### 2. Lancer un backtest simple

```bash
uv run trading backtest _examples.ema_cross --venue BINANCE --symbol BTCUSDT --timeframe 1h --start 2022-01-01 --end 2024-12-31
```

### 3. Validation anti-biais

```bash
uv run trading walk-forward _examples.ema_cross --train-bars 500 --test-bars 200 --embargo-bars 24
uv run trading monte-carlo _examples.ema_cross --runs 1000 --seed 42
uv run trading pbo --equity-curves reports/equity_curves.parquet --s 16
```

### 4. Generation Pine Script (deploiement TradingView)

```bash
uv run trading generate-pine _examples.ema_cross --ema-fast 10 --ema-slow 30 --out strategies/pine/ema_cross.pine
```

Puis : coller `.pine` dans TradingView Pine Editor, attacher au chart, creer alerte webhook vers `https://<your-host>/webhook` avec header `X-TV-Secret`.

### 5. Webhook receiver (TV -> 3Commas)

```bash
uv run uvicorn trading.execution.threecommas.webhook:make_app --factory --host 0.0.0.0 --port 8000
```

## Quality gates

```bash
uv run pytest -q --cov=src/trading --cov-fail-under=70  # >=70% coverage
uv run ruff check src tests
uv run mypy src
```

CI GitHub Actions : `.github/workflows/finance-trading-ci.yml` (ubuntu-24.04, Python 3.12, uv).

## Couplage wiki

- Concepts : `wiki/domains/trading/concepts/` — Sharpe Ratio, PBO, Walk-Forward Analysis, Purged CV, Deflated Sharpe, Slippage Models
- Strategies documentees : `wiki/domains/trading/strategies/`
- Backtests archives : `wiki/domains/trading/backtests/`

## Limites v1.1 (V1.2+ backlog)

- **Nautilus event-driven full integration** (skeleton B1 fait, full migration V1.2 : voir [roadmap](../../../docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md))
- **NautilusLive broker connection** (skeleton B2 fait, `connect_to_exchange()` + `send_order_to_exchange()` raise NotImplementedError V1.2)
- VectorBT pour parameter sweeps massifs
- L2 orderbook via tardis.dev
- Machine learning features engineering
- Auto-deploy pipeline (deploy reste manuel, gate humaine)
- Monitoring drift live vs backtest OOS
- Finance Dashboard Maison (V1.3+ : voir [spec](../../../docs/superpowers/specs/2026-04-19-finance-dashboard-research.md))

## Strategy library (5 strategies experimental)

| Strategie | Famille | Fichier |
|---|---|---|
| EMA Cross | trend-following | `strategies/_examples/ema_cross.py` |
| Donchian Breakout | momentum / breakout | `strategies/_examples/donchian_breakout.py` |
| RSI Mean-Reversion | mean-reversion | `strategies/_examples/rsi_mean_reversion.py` |
| Multi-TF Trend | trend-following + filtre trend | `strategies/_examples/multi_tf_trend.py` |
| Bollinger Breakout | volatility / momentum | `strategies/_examples/bollinger_breakout.py` |

Toutes `status: experimental`, pas pour trader live sans validation anti-biais (walk-forward + PBO + DSR).
Voir wiki `wiki/domains/trading/strategies/*.md` pour details + hyperparametres + limites connues.
