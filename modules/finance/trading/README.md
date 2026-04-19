# modules/finance/trading/

Backtest engine crypto + Pine Script bridge + 3Commas execution pour Foundation OS.

> **Honnetete** : Un backtest ne garantit pas de gains live. Cet outil minimise les biais courants (look-ahead, overfitting, slippage irrealiste, funding ignores) ; il ne les elimine pas. Trading crypto retail perd en moyenne. Deploiement live reste gate humaine (copy-paste Pine dans TradingView, activation 3Commas manuelle).

## Architecture

- **Backtest engine** pandas-based (V1 simplified, NautilusTrader event-driven en V1.1)
- **Data pipeline** : ccxt (multi-exchange) + Binance direct + Catalog Parquet + QualityChecker (gaps, outliers, delistings)
- **Strategy framework** : `BaseStrategy` + `StrategyMetadata` Pydantic, indicators reutilisables (EMA/RSI/ATR)
- **Anti-biais harnesses** : WalkForward + PurgedCV (Lopez de Prado) + MonteCarlo (1000+ runs) + PBO (Bailey-Lopez overfitting) + DeflatedSharpe (multi-trials correction)
- **Execution bridges** : PineGenerator (Pine v5 templates Jinja2) + 3Commas REST API + FastAPI WebhookReceiver + NautilusLive stub (V1.1)
- **Analysis** : PerformanceMetrics (Sharpe/Sortino/Calmar/MaxDD/ProfitFactor) + HTMLReport tearsheet Void Glass + RegimeClassifier

Design complet : [spec](../../../docs/superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md).
Plan execution : [plan](../../../docs/plans/2026-04-19-finance-trading-backtest-engine.md).

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

## Limites v1 (V1.1 backlog)

- Nautilus event-driven integration (Task 3.5 SKIPPED v1)
- `NautilusLive` execution directe (stub, pas implemente)
- VectorBT pour parameter sweeps massifs
- L2 orderbook via tardis.dev
- Machine learning features engineering
- Strategy library riche (v1 ne contient que `_examples/ema_cross.py` comme validateur)
- Auto-deploy pipeline (deploy reste manuel, gate humaine)
- Monitoring drift live vs backtest OOS
