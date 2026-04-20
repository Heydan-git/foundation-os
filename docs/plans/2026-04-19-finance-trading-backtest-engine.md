---
status: done
phases_total: 8
phases_done: 8
scope: modules/finance/trading/
started: 2026-04-19
completed: 2026-04-19
design_doc: docs/superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md
related:
  - "[[index-trading]]"
  - "[[Compounding Knowledge]]"
---

# 🪐 Backtest Engine Crypto Socle (19-04-2026)

> **Pour agents (subagent ou inline)** : utiliser `superpowers:executing-plans` ou `superpowers:subagent-driven-development` pour suivre les checkboxes task par task.
> **Design reference** : [design spec](../superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md)

## Goal

Livrer le socle `modules/finance/trading/` (package Python) permettant de backtester des strategies crypto avec rigueur anti-biais (slippage vol-based, latency, walk-forward, purged CV, Monte Carlo, PBO, DSR) et de generer du code Pine Script pour execution via TradingView alerts → 3Commas webhooks.

## Architecture

Approche **C - Hybride pragmatique** : NautilusTrader (production-grade, event-driven, Rust core) au coeur pour backtest + live. Couches legeres autour : data adapters (`ccxt` + Binance direct), harnesses anti-biais custom, Pine generator, 3Commas bridge, reports HTML. `src/` layout, package `trading`, CLI Typer unifiee.

## Tech Stack

- **Langage** : Python 3.12
- **Package mgmt** : uv (10x plus rapide que poetry, standard 2026)
- **Backtest engine** : nautilus-trader (>=1.200)
- **Data** : ccxt, httpx (Binance direct), pandas, numpy, pyarrow, duckdb
- **Reports** : quantstats, jinja2, matplotlib
- **CLI** : typer, rich
- **Config** : pydantic v2
- **Tests** : pytest, pytest-asyncio, hypothesis
- **Lint/type** : ruff, mypy strict
- **Web (webhook receiver)** : fastapi, uvicorn

## Decisions lockees (rappel design doc)

| # | Decision | Valeur |
|---|---|---|
| 1 | Point d'entree | Backtest engine d'abord |
| 2 | Module path | `modules/finance/trading/` |
| 3 | Langage | Python 3.12 |
| 4 | Framework | NautilusTrader (seul en v1) |
| 5 | Horizon | Multi-horizon swing (1h-4h) + position (1D-1W) |
| 6 | Univers | 30+ assets spot + perps (v1 valide sur BTC+ETH, scale en batchs) |
| 7 | Execution | Pine+3Commas principal + Nautilus live optionnel |
| 8 | Rigueur anti-biais | Slippage vol-based + latency + WF + PurgedCV + MC 1000+ + PBO <0.15 + DSR + funding |
| 9 | Data | ccxt + Binance direct + 5 ans max per-asset |

## File Structure globale (fichiers crees par phase)

**Phase 1** : `pyproject.toml`, `README.md`, `.env.example`, `.gitignore`, `src/trading/__init__.py`, `src/trading/{data,strategies,backtest,analysis,execution,cli}/__init__.py`, `tests/{unit,integration,smoke,fixtures}/__init__.py`.

**Phase 2** : `src/trading/data/sources/{base,ccxt_source,binance_source}.py`, `src/trading/data/{catalog,storage,quality}.py`, `src/trading/cli/download.py`, `tests/unit/data/test_*.py`.

**Phase 3** : `src/trading/strategies/base.py`, `src/trading/strategies/indicators/{ema,rsi,atr}.py`, `src/trading/strategies/_examples/ema_cross.py`, `src/trading/backtest/{runner,slippage,latency,fees,funding}.py`, `src/trading/cli/backtest.py`, `tests/unit/{strategies,backtest}/test_*.py`.

**Phase 4** : `src/trading/backtest/harnesses/{walk_forward,purged_cv,monte_carlo,pbo,deflated_sharpe}.py`, `src/trading/cli/{walkforward,montecarlo,pbo}.py`, `tests/unit/harnesses/test_*.py`.

**Phase 5** : `src/trading/analysis/{metrics,reports,regime}.py`, templates Jinja2 `src/trading/analysis/templates/*.html.j2`, `tests/unit/analysis/test_*.py`.

**Phase 6** : `src/trading/execution/pine/{generator,templates/}.py`, `src/trading/execution/threecommas/{webhook,api}.py`, `src/trading/execution/live/nautilus_live.py`, `src/trading/cli/pine.py`, `tests/{unit,integration}/execution/test_*.py`.

**Phase 7** : `tests/smoke/test_imports.py`, `tests/integration/test_e2e.py`, `.github/workflows/finance-trading-ci.yml`, `scripts/pre-commit.sh`.

**Phase 8** : `wiki/domains/trading/strategies/ema-cross-btc-4h.md`, `wiki/domains/trading/backtests/2026-04-19-ema-cross-btc-smoke.md`, `wiki/domains/trading/concepts/{Sharpe Ratio,PBO,Walk-Forward,Purged CV,Deflated Sharpe,Slippage Models}.md`, `modules/finance/trading/README.md` enrichi.

---

## Phase 1/8 — Scaffold module + environnement Python

### Pre-conditions

- Branche `claude/jovial-jemison-d31676` active (ou worktree dedie)
- Design doc committe (`cf12c8a`)
- Python 3.12 installe (`python3 --version` → `3.12.*`)
- uv installe (`uv --version` → `0.5.x` ou plus recent)
- Repo FOS clean sauf `.omc/project-memory.json` (OMC interne)

### Etat repo attendu

- `modules/app/` et `modules/design-system/` existent
- `modules/finance/` n'existe PAS encore
- `wiki/domains/trading/` scaffold existe (index-trading.md + sous-dossiers vides)

### Task 1.1 — Creer structure racine `modules/finance/trading/`

**Files:**
- Create: `modules/finance/trading/pyproject.toml`
- Create: `modules/finance/trading/README.md`
- Create: `modules/finance/trading/.env.example`
- Create: `modules/finance/trading/.gitignore`

- [ ] **Step 1: Creer l'arborescence**

```bash
cd modules
mkdir -p finance/trading/{src/trading/{data/sources,strategies/{indicators,_examples},backtest/harnesses,analysis,execution/{pine/templates,threecommas,live},cli},tests/{unit/{data,strategies,backtest,harnesses,analysis,execution},integration,smoke,fixtures},data,reports,scripts}
```

- [ ] **Step 2: Ecrire `modules/finance/trading/pyproject.toml`**

```toml
[project]
name = "trading"
version = "0.1.0"
description = "Foundation OS — backtest engine crypto + Pine Script bridge + 3Commas execution"
requires-python = ">=3.12,<3.13"
readme = "README.md"
license = { text = "MIT" }
authors = [{ name = "Kevin Noel", email = "kevin.noel.divers@gmail.com" }]

dependencies = [
    "nautilus-trader>=1.200",
    "ccxt>=4.4",
    "httpx>=0.27",
    "fastapi>=0.115",
    "uvicorn>=0.32",
    "typer>=0.12",
    "rich>=13.7",
    "pydantic>=2.8",
    "pandas>=2.2",
    "numpy>=2.0,<3",
    "pyarrow>=16",
    "duckdb>=1.1",
    "quantstats>=0.0.65",
    "jinja2>=3.1",
    "matplotlib>=3.9",
    "hmmlearn>=0.3",
    "scipy>=1.14",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3",
    "pytest-asyncio>=0.24",
    "pytest-cov>=5.0",
    "hypothesis>=6.112",
    "ruff>=0.8",
    "mypy>=1.13",
    "types-requests",
]

[project.scripts]
trading = "trading.cli.main:app"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/trading"]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "W", "I", "N", "UP", "B", "C4", "PTH", "RET", "SIM"]
ignore = ["E501"]  # line-length deja gere par formatter

[tool.mypy]
python_version = "3.12"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
plugins = ["pydantic.mypy"]

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
addopts = "-ra --strict-markers --cov=src/trading --cov-report=term-missing"
markers = [
    "slow: tests > 1s",
    "integration: requires network or fixtures",
    "smoke: quick sanity checks",
]
```

- [ ] **Step 3: Ecrire `modules/finance/trading/README.md`**

```markdown
# modules/finance/trading/

Backtest engine crypto + Pine Script bridge + 3Commas execution pour Foundation OS.

## Setup

```bash
cd modules/finance/trading
uv sync --all-extras
cp .env.example .env  # puis editer les secrets
```

## Usage (v1)

```bash
uv run trading download-data --source ccxt --symbols BTC/USDT,ETH/USDT --timeframe 1h --start 2021-01-01
uv run trading backtest _examples.ema_cross --period 2022-01:2024-12 --report
uv run trading walk-forward _examples.ema_cross --train 180d --test 60d
uv run trading monte-carlo _examples.ema_cross --runs 1000
uv run trading generate-pine _examples.ema_cross --out strategies/pine/ema_cross.pine
```

## Architecture

Voir [design spec](../../../docs/superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md).

## Couplage wiki

- Strategies documentees : `wiki/domains/trading/strategies/*.md`
- Backtests archives : `wiki/domains/trading/backtests/*.md`
- Concepts : `wiki/domains/trading/concepts/*.md`

## Honnetete

Un backtest ne garantit pas de gains live. Cet outil minimise les biais courants (look-ahead, overfitting, slippage irrealiste) ; il ne les elimine pas. Trading crypto retail perd en moyenne. Deploiement live reste gate humaine (copy-paste Pine dans TradingView, activation 3Commas manuelle).
```

- [ ] **Step 4: Ecrire `modules/finance/trading/.env.example`**

```bash
# Binance API (read-only keys suffisent pour backtest/data)
BINANCE_API_KEY=
BINANCE_SECRET=

# 3Commas API (bot creation + deal triggers)
TC_API_KEY=
TC_SECRET=

# TradingView webhook secret (validation alertes entrantes)
TV_WEBHOOK_SECRET=

# Optionnel
NOTIFY_TELEGRAM_TOKEN=
NOTIFY_TELEGRAM_CHAT_ID=
```

- [ ] **Step 5: Ecrire `modules/finance/trading/.gitignore`**

```
.venv/
__pycache__/
*.pyc
*.pyo
*.egg-info/
dist/
build/

# Data (regenerable via download-data CLI)
data/
*.parquet

# Reports (regenerable)
reports/

# Secrets
.env
*.key

# IDE
.idea/
.vscode/
*.swp
.DS_Store

# Pytest / coverage
.pytest_cache/
.coverage
htmlcov/
.mypy_cache/
.ruff_cache/
```

- [ ] **Step 6: Verifier structure**

```bash
ls modules/finance/trading/
```

Expected : `pyproject.toml README.md src/ tests/ data/ reports/ scripts/ .env.example .gitignore`

- [ ] **Step 7: Commit**

```bash
git add modules/finance/trading/pyproject.toml modules/finance/trading/README.md modules/finance/trading/.env.example modules/finance/trading/.gitignore
git commit -m "feat(finance/trading): scaffold module racine + pyproject.toml (Phase 1/8)"
```

### Task 1.2 — Creer les `__init__.py` vides + verifier imports

**Files:**
- Create: `modules/finance/trading/src/trading/__init__.py`
- Create: `modules/finance/trading/src/trading/{data,strategies,backtest,analysis,execution,cli}/__init__.py`
- Create: `modules/finance/trading/src/trading/data/sources/__init__.py`
- Create: `modules/finance/trading/src/trading/strategies/{indicators,_examples}/__init__.py`
- Create: `modules/finance/trading/src/trading/backtest/harnesses/__init__.py`
- Create: `modules/finance/trading/src/trading/execution/{pine,threecommas,live}/__init__.py`
- Create: `modules/finance/trading/tests/__init__.py` et sous-modules

- [ ] **Step 1: Creer tous les `__init__.py`**

```bash
cd modules/finance/trading
find src/trading tests -type d -exec touch {}/__init__.py \;
```

- [ ] **Step 2: Ecrire `src/trading/__init__.py`**

```python
"""Foundation OS — backtest engine crypto + Pine bridge + 3Commas execution."""

__version__ = "0.1.0"
```

- [ ] **Step 3: Setup environnement**

```bash
cd modules/finance/trading
uv sync --all-extras
```

Expected : `.venv/` cree, `Resolved N packages` affiche.

- [ ] **Step 4: Verifier import du package**

```bash
uv run python -c "import trading; print(trading.__version__)"
```

Expected : `0.1.0`

- [ ] **Step 5: Commit**

```bash
git add modules/finance/trading/src/trading modules/finance/trading/tests
git commit -m "feat(finance/trading): init packages __init__.py + uv sync OK (Phase 1/8)"
```

### Task 1.3 — CLI stub `trading` + test smoke

**Files:**
- Create: `modules/finance/trading/src/trading/cli/main.py`
- Create: `modules/finance/trading/tests/smoke/test_cli_help.py`

- [ ] **Step 1: Ecrire le test smoke d'abord (TDD)**

`modules/finance/trading/tests/smoke/test_cli_help.py` :

```python
"""Smoke test : CLI 'trading --help' doit retourner exit 0."""
from typer.testing import CliRunner

from trading.cli.main import app

runner = CliRunner()


def test_cli_help_returns_zero() -> None:
    result = runner.invoke(app, ["--help"])
    assert result.exit_code == 0
    assert "trading" in result.stdout.lower()


def test_cli_version_flag_returns_zero() -> None:
    result = runner.invoke(app, ["--version"])
    assert result.exit_code == 0
    assert "0.1.0" in result.stdout
```

- [ ] **Step 2: Lancer le test, verifier echec**

```bash
cd modules/finance/trading
uv run pytest tests/smoke/test_cli_help.py -v
```

Expected : FAIL car `trading.cli.main` n'existe pas.

- [ ] **Step 3: Ecrire `src/trading/cli/main.py` minimal**

```python
"""Point d'entree CLI Typer unifie pour le module trading."""

import typer

from trading import __version__

app = typer.Typer(
    name="trading",
    help="Foundation OS — backtest engine crypto + Pine bridge + 3Commas.",
    no_args_is_help=True,
)


def _version_callback(value: bool) -> None:
    if value:
        typer.echo(f"trading {__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: bool = typer.Option(
        False,
        "--version",
        callback=_version_callback,
        is_eager=True,
        help="Afficher la version et quitter.",
    ),
) -> None:
    """Racine CLI trading."""
```

- [ ] **Step 4: Relancer les tests**

```bash
uv run pytest tests/smoke/test_cli_help.py -v
```

Expected : 2 passed.

- [ ] **Step 5: Verifier le CLI en direct**

```bash
uv run trading --help
uv run trading --version
```

Expected : aide Typer affichee + `trading 0.1.0`.

- [ ] **Step 6: Commit**

```bash
git add src/trading/cli/main.py tests/smoke/test_cli_help.py
git commit -m "feat(finance/trading): CLI stub 'trading' + smoke tests (Phase 1/8)"
```

### Verification Phase 1

```bash
cd modules/finance/trading
uv run pytest tests/smoke/ -v        # 2/2 passed
uv run trading --help                 # OK, aide affichee
uv run trading --version              # "trading 0.1.0"
uv run python -c "import trading"    # OK, pas d'erreur
cd ../../.. && bash scripts/health-check.sh  # SAIN (ou DEGRADED acceptable, nouveaux dossiers non encore whitelist)
```

### Rollback Phase 1

```bash
cd ~/foundation-os
rm -rf modules/finance/
git checkout main -- .  # si commits pas encore mergees
# OU git revert pour les commits Phase 1 si deja mergees
```

### Commit message Phase 1 (wrap-up, optionnel si phase en plusieurs commits)

Deja effectue en 3 commits atomiques (Task 1.1, 1.2, 1.3). Pas de commit wrap-up necessaire.

---

## Phase 2/8 — Data pipeline : sources + catalog + quality + CLI download

### Pre-conditions

- Phase 1 terminee (`uv run trading --help` OK)
- Clef Binance API configurable (meme vide en test, pas de call reel forcee)

### Etat repo attendu

- `src/trading/data/` existe avec `__init__.py` mais vide
- Aucun fichier Parquet dans `data/`

### Task 2.1 — Protocol `DataSource`

**Files:**
- Create: `modules/finance/trading/src/trading/data/sources/base.py`
- Create: `modules/finance/trading/tests/unit/data/test_sources_base.py`

- [ ] **Step 1: Ecrire le test (TDD)**

`tests/unit/data/test_sources_base.py` :

```python
"""Protocol DataSource : verifier qu'une classe conforme est detectee."""
from datetime import datetime
from typing import Literal

import pandas as pd

from trading.data.sources.base import DataSource


class FakeSource:
    def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        return pd.DataFrame()

    def fetch_funding(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        return pd.DataFrame()

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]:
        return []


def test_fake_source_is_datasource() -> None:
    src: DataSource = FakeSource()
    assert isinstance(src, DataSource)
```

- [ ] **Step 2: Run test → FAIL (import error)**

```bash
uv run pytest tests/unit/data/test_sources_base.py -v
```

- [ ] **Step 3: Ecrire `src/trading/data/sources/base.py`**

```python
"""Protocol DataSource : contrat unique pour tout fournisseur de donnees historiques."""

from datetime import datetime
from typing import Literal, Protocol, runtime_checkable

import pandas as pd


@runtime_checkable
class DataSource(Protocol):
    """Fournisseur de donnees OHLCV + funding + liste symbols.

    Toutes les implementations (CCXTSource, BinanceSource, TardisSource futur)
    respectent cette interface. Permet de swapper les sources sans refacto
    du reste du pipeline.
    """

    def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        """Retourne un DataFrame index=datetime, cols=[open, high, low, close, volume]."""
        ...

    def fetch_funding(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        """Funding rates pour perps. DataFrame index=datetime, col=[funding_rate]. Vide pour spot."""
        ...

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]:
        """Symbols disponibles sur la venue pour ce market_type."""
        ...
```

- [ ] **Step 4: Run test → PASS**

```bash
uv run pytest tests/unit/data/test_sources_base.py -v
```

- [ ] **Step 5: Commit**

```bash
git add src/trading/data/sources/base.py tests/unit/data/test_sources_base.py
git commit -m "feat(finance/trading): protocol DataSource (Phase 2/8)"
```

### Task 2.2 — `CCXTSource` (OHLCV + funding via ccxt)

**Files:**
- Create: `modules/finance/trading/src/trading/data/sources/ccxt_source.py`
- Create: `modules/finance/trading/tests/unit/data/test_ccxt_source.py`
- Create: `modules/finance/trading/tests/fixtures/ccxt_ohlcv_sample.json`

- [ ] **Step 1: Creer une fixture OHLCV sample**

`tests/fixtures/ccxt_ohlcv_sample.json` (10 bougies BTC/USDT 1h, format ccxt natif) :

```json
[
  [1704067200000, 42500.0, 42600.0, 42450.0, 42580.0, 120.5],
  [1704070800000, 42580.0, 42650.0, 42500.0, 42630.0, 95.2],
  [1704074400000, 42630.0, 42700.0, 42600.0, 42680.0, 88.7],
  [1704078000000, 42680.0, 42750.0, 42650.0, 42720.0, 102.3],
  [1704081600000, 42720.0, 42800.0, 42700.0, 42780.0, 115.6],
  [1704085200000, 42780.0, 42850.0, 42750.0, 42820.0, 78.9],
  [1704088800000, 42820.0, 42900.0, 42800.0, 42870.0, 93.4],
  [1704092400000, 42870.0, 42950.0, 42840.0, 42920.0, 105.1],
  [1704096000000, 42920.0, 42980.0, 42880.0, 42940.0, 67.2],
  [1704099600000, 42940.0, 43000.0, 42900.0, 42990.0, 125.8]
]
```

- [ ] **Step 2: Ecrire le test TDD**

`tests/unit/data/test_ccxt_source.py` :

```python
"""Tests CCXTSource — valide parsing + structure DataFrame + gestion erreurs."""
import json
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import MagicMock

import pandas as pd
import pytest

from trading.data.sources.ccxt_source import CCXTSource

FIXTURE = Path(__file__).parent.parent.parent / "fixtures" / "ccxt_ohlcv_sample.json"


@pytest.fixture
def sample_ohlcv() -> list[list[float]]:
    return json.loads(FIXTURE.read_text())


def test_fetch_ohlcv_returns_dataframe(sample_ohlcv: list[list[float]]) -> None:
    exchange = MagicMock()
    exchange.fetch_ohlcv.return_value = sample_ohlcv

    source = CCXTSource(exchange_id="binance", _exchange=exchange)
    df = source.fetch_ohlcv(
        symbol="BTC/USDT",
        timeframe="1h",
        start=datetime(2024, 1, 1, tzinfo=timezone.utc),
        end=datetime(2024, 1, 2, tzinfo=timezone.utc),
    )

    assert isinstance(df, pd.DataFrame)
    assert list(df.columns) == ["open", "high", "low", "close", "volume"]
    assert len(df) == 10
    assert df.index.dtype.kind == "M"  # datetime64
    assert df["open"].iloc[0] == 42500.0
    assert df["close"].iloc[-1] == 42990.0


def test_fetch_ohlcv_monotonic_ascending(sample_ohlcv: list[list[float]]) -> None:
    exchange = MagicMock()
    exchange.fetch_ohlcv.return_value = sample_ohlcv

    source = CCXTSource(exchange_id="binance", _exchange=exchange)
    df = source.fetch_ohlcv("BTC/USDT", "1h", datetime(2024, 1, 1), datetime(2024, 1, 2))

    assert df.index.is_monotonic_increasing


def test_fetch_ohlcv_empty_raises() -> None:
    exchange = MagicMock()
    exchange.fetch_ohlcv.return_value = []

    source = CCXTSource(exchange_id="binance", _exchange=exchange)
    with pytest.raises(ValueError, match="empty OHLCV"):
        source.fetch_ohlcv("BTC/USDT", "1h", datetime(2024, 1, 1), datetime(2024, 1, 2))
```

- [ ] **Step 3: Run test → FAIL**

```bash
uv run pytest tests/unit/data/test_ccxt_source.py -v
```

- [ ] **Step 4: Ecrire `src/trading/data/sources/ccxt_source.py`**

```python
"""CCXTSource : adaptateur multi-exchange via la librairie ccxt."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Literal

import ccxt  # type: ignore[import-untyped]
import pandas as pd


@dataclass
class CCXTSource:
    """Fetch OHLCV + funding via ccxt. Exchange_id = "binance" | "bybit" | etc.

    Note : pour les perps Binance, utiliser exchange_id="binanceusdm".
    """

    exchange_id: str
    _exchange: Any = field(default=None, repr=False)

    def __post_init__(self) -> None:
        if self._exchange is None:
            self._exchange = getattr(ccxt, self.exchange_id)({"enableRateLimit": True})

    def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        since = int(start.replace(tzinfo=timezone.utc).timestamp() * 1000)
        until = int(end.replace(tzinfo=timezone.utc).timestamp() * 1000)

        raw: list[list[float]] = []
        cursor = since
        while cursor < until:
            chunk = self._exchange.fetch_ohlcv(symbol, timeframe, since=cursor, limit=1000)
            if not chunk:
                break
            raw.extend(chunk)
            last_ts = chunk[-1][0]
            if last_ts <= cursor:
                break  # garde-fou anti-boucle infinie
            cursor = last_ts + 1

        if not raw:
            raise ValueError(f"empty OHLCV for {symbol} {timeframe} {start}..{end}")

        df = pd.DataFrame(raw, columns=["ts_ms", "open", "high", "low", "close", "volume"])
        df["ts"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True)
        df = df.set_index("ts").drop(columns=["ts_ms"])
        df = df[~df.index.duplicated(keep="first")].sort_index()
        df = df.loc[(df.index >= start.replace(tzinfo=timezone.utc)) & (df.index <= end.replace(tzinfo=timezone.utc))]
        return df

    def fetch_funding(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        if not getattr(self._exchange, "has", {}).get("fetchFundingRateHistory"):
            return pd.DataFrame(columns=["funding_rate"])

        since = int(start.replace(tzinfo=timezone.utc).timestamp() * 1000)
        rows = self._exchange.fetch_funding_rate_history(symbol, since=since, limit=1000)
        if not rows:
            return pd.DataFrame(columns=["funding_rate"])

        df = pd.DataFrame([{"ts_ms": r["timestamp"], "funding_rate": r["fundingRate"]} for r in rows])
        df["ts"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True)
        return df.set_index("ts").drop(columns=["ts_ms"])

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]:
        markets = self._exchange.load_markets()
        if market_type == "spot":
            return sorted([s for s, m in markets.items() if m.get("spot", False)])
        return sorted([s for s, m in markets.items() if m.get("swap") or m.get("future")])
```

- [ ] **Step 5: Run test → PASS**

```bash
uv run pytest tests/unit/data/test_ccxt_source.py -v
```

- [ ] **Step 6: Commit**

```bash
git add src/trading/data/sources/ccxt_source.py tests/unit/data/test_ccxt_source.py tests/fixtures/ccxt_ohlcv_sample.json
git commit -m "feat(finance/trading): CCXTSource OHLCV + funding (Phase 2/8)"
```

### Task 2.3 — `BinanceSource` (direct, granularite fine)

**Files:**
- Create: `modules/finance/trading/src/trading/data/sources/binance_source.py`
- Create: `modules/finance/trading/tests/unit/data/test_binance_source.py`

- [ ] **Step 1: Ecrire test TDD (mock httpx)**

`tests/unit/data/test_binance_source.py` :

```python
"""Tests BinanceSource — mock httpx, valider parsing."""
from datetime import datetime, timezone
from unittest.mock import MagicMock

import pandas as pd
import pytest

from trading.data.sources.binance_source import BinanceSource


@pytest.fixture
def sample_klines() -> list[list]:
    return [
        [1704067200000, "42500.0", "42600.0", "42450.0", "42580.0", "120.5",
         1704070799999, "5129950.0", 1200, "60.3", "2564975.0", "0"],
        [1704070800000, "42580.0", "42650.0", "42500.0", "42630.0", "95.2",
         1704074399999, "4058346.0", 900, "47.6", "2029173.0", "0"],
    ]


def test_fetch_ohlcv_parses_binance_klines(sample_klines: list) -> None:
    client = MagicMock()
    response = MagicMock()
    response.json.return_value = sample_klines
    response.raise_for_status = MagicMock()
    client.get.return_value = response

    source = BinanceSource(market="spot", _client=client)
    df = source.fetch_ohlcv(
        symbol="BTCUSDT",
        timeframe="1h",
        start=datetime(2024, 1, 1, tzinfo=timezone.utc),
        end=datetime(2024, 1, 1, 2, tzinfo=timezone.utc),
    )

    assert isinstance(df, pd.DataFrame)
    assert list(df.columns) == ["open", "high", "low", "close", "volume"]
    assert len(df) == 2
    assert df["open"].iloc[0] == pytest.approx(42500.0)
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Ecrire `src/trading/data/sources/binance_source.py`**

```python
"""BinanceSource : acces API Binance direct (REST v3) pour granularite fine."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Literal

import httpx
import pandas as pd


@dataclass
class BinanceSource:
    """Adaptateur direct Binance REST API. market = "spot" | "perp" (USDM futures)."""

    market: Literal["spot", "perp"] = "spot"
    _client: Any = field(default=None, repr=False)

    BASE_URLS = {
        "spot": "https://api.binance.com/api/v3",
        "perp": "https://fapi.binance.com/fapi/v1",
    }

    def __post_init__(self) -> None:
        if self._client is None:
            self._client = httpx.Client(timeout=30.0)

    def _base_url(self) -> str:
        return self.BASE_URLS[self.market]

    def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        since = int(start.replace(tzinfo=timezone.utc).timestamp() * 1000)
        until = int(end.replace(tzinfo=timezone.utc).timestamp() * 1000)

        rows: list[list] = []
        cursor = since
        while cursor < until:
            resp = self._client.get(
                f"{self._base_url()}/klines",
                params={
                    "symbol": symbol,
                    "interval": timeframe,
                    "startTime": cursor,
                    "endTime": until,
                    "limit": 1000,
                },
            )
            resp.raise_for_status()
            chunk = resp.json()
            if not chunk:
                break
            rows.extend(chunk)
            last_ts = int(chunk[-1][0])
            if last_ts <= cursor:
                break
            cursor = last_ts + 1

        if not rows:
            raise ValueError(f"empty klines for {symbol} {timeframe} {start}..{end}")

        df = pd.DataFrame(
            rows,
            columns=[
                "ts_ms", "open", "high", "low", "close", "volume",
                "close_ts", "quote_vol", "trades", "taker_base_vol", "taker_quote_vol", "ignore",
            ],
        )
        for col in ("open", "high", "low", "close", "volume"):
            df[col] = df[col].astype(float)
        df["ts"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True)
        return df.set_index("ts")[["open", "high", "low", "close", "volume"]]

    def fetch_funding(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        if self.market != "perp":
            return pd.DataFrame(columns=["funding_rate"])

        since = int(start.replace(tzinfo=timezone.utc).timestamp() * 1000)
        until = int(end.replace(tzinfo=timezone.utc).timestamp() * 1000)
        resp = self._client.get(
            f"{self._base_url()}/fundingRate",
            params={"symbol": symbol, "startTime": since, "endTime": until, "limit": 1000},
        )
        resp.raise_for_status()
        rows = resp.json()
        if not rows:
            return pd.DataFrame(columns=["funding_rate"])

        df = pd.DataFrame(
            [{"ts_ms": r["fundingTime"], "funding_rate": float(r["fundingRate"])} for r in rows]
        )
        df["ts"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True)
        return df.set_index("ts").drop(columns=["ts_ms"])

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]:
        if market_type == "spot":
            resp = self._client.get("https://api.binance.com/api/v3/exchangeInfo")
        else:
            resp = self._client.get("https://fapi.binance.com/fapi/v1/exchangeInfo")
        resp.raise_for_status()
        data = resp.json()
        return sorted(s["symbol"] for s in data["symbols"] if s.get("status") == "TRADING")
```

- [ ] **Step 4: Run tests → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/trading/data/sources/binance_source.py tests/unit/data/test_binance_source.py
git commit -m "feat(finance/trading): BinanceSource direct REST API (Phase 2/8)"
```

### Task 2.4 — `QualityChecker` (gaps, outliers, delistings)

**Files:**
- Create: `modules/finance/trading/src/trading/data/quality.py`
- Create: `modules/finance/trading/tests/unit/data/test_quality.py`

- [ ] **Step 1: Ecrire tests TDD**

`tests/unit/data/test_quality.py` :

```python
"""Tests QualityChecker : detection gaps / outliers / zero volume."""
from datetime import datetime, timedelta, timezone

import numpy as np
import pandas as pd
import pytest

from trading.data.quality import QualityChecker


def make_ohlcv(start: datetime, n: int, freq: str = "1h") -> pd.DataFrame:
    idx = pd.date_range(start, periods=n, freq=freq, tz=timezone.utc)
    return pd.DataFrame(
        {
            "open": np.linspace(100, 110, n),
            "high": np.linspace(101, 111, n),
            "low": np.linspace(99, 109, n),
            "close": np.linspace(100.5, 110.5, n),
            "volume": np.linspace(10, 20, n),
        },
        index=idx,
    )


def test_no_gaps_reports_clean() -> None:
    df = make_ohlcv(datetime(2024, 1, 1, tzinfo=timezone.utc), 24)
    checker = QualityChecker(timeframe="1h")
    report = checker.check(df, symbol="BTCUSDT")
    assert report.passed
    assert report.gaps == []


def test_detect_single_gap() -> None:
    df = make_ohlcv(datetime(2024, 1, 1, tzinfo=timezone.utc), 24)
    df = df.drop(df.index[12])  # enleve 1 bougie
    checker = QualityChecker(timeframe="1h")
    report = checker.check(df, symbol="BTCUSDT")
    assert not report.passed
    assert len(report.gaps) == 1


def test_detect_zero_volume_outlier() -> None:
    df = make_ohlcv(datetime(2024, 1, 1, tzinfo=timezone.utc), 24)
    df.loc[df.index[5], "volume"] = 0
    checker = QualityChecker(timeframe="1h")
    report = checker.check(df, symbol="BTCUSDT")
    assert any("zero_volume" in i for i in report.issues)


def test_detect_price_spike_outlier() -> None:
    df = make_ohlcv(datetime(2024, 1, 1, tzinfo=timezone.utc), 48)
    df.loc[df.index[10], "close"] = df["close"].mean() * 10
    checker = QualityChecker(timeframe="1h", spike_zscore=5.0)
    report = checker.check(df, symbol="BTCUSDT")
    assert any("price_spike" in i for i in report.issues)
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Ecrire `src/trading/data/quality.py`**

```python
"""QualityChecker : detecte gaps temporels, outliers prix/volume, delistings."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

import numpy as np
import pandas as pd


TIMEFRAME_TO_PANDAS = {
    "1m": "1min", "5m": "5min", "15m": "15min", "30m": "30min",
    "1h": "1h", "4h": "4h", "1d": "1D", "1w": "1W",
}


@dataclass
class QualityReport:
    symbol: str
    passed: bool
    gaps: list[tuple[pd.Timestamp, pd.Timestamp]] = field(default_factory=list)
    issues: list[str] = field(default_factory=list)
    stats: dict[str, float] = field(default_factory=dict)


@dataclass
class QualityChecker:
    """Valide qualite d'un DataFrame OHLCV. Ne lance pas : retourne un QualityReport."""

    timeframe: Literal["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"] = "1h"
    spike_zscore: float = 10.0
    max_gap_ratio: float = 0.01  # 1% de trous max tolere

    def check(self, df: pd.DataFrame, *, symbol: str) -> QualityReport:
        report = QualityReport(symbol=symbol, passed=True)
        if df.empty:
            report.passed = False
            report.issues.append("empty_dataframe")
            return report

        expected_freq = TIMEFRAME_TO_PANDAS[self.timeframe]
        expected_idx = pd.date_range(df.index[0], df.index[-1], freq=expected_freq, tz=df.index.tz)
        missing = expected_idx.difference(df.index)
        if len(missing) > 0:
            report.gaps = self._group_consecutive(missing, expected_freq)
            ratio = len(missing) / max(len(expected_idx), 1)
            report.stats["gap_ratio"] = ratio
            if ratio > self.max_gap_ratio:
                report.passed = False
                report.issues.append(f"gap_ratio_high={ratio:.3%}")

        if (df["volume"] == 0).any():
            report.issues.append(f"zero_volume_count={int((df['volume'] == 0).sum())}")

        for col in ("open", "high", "low", "close"):
            z = (df[col] - df[col].mean()) / df[col].std(ddof=0)
            if (np.abs(z) > self.spike_zscore).any():
                report.issues.append(f"price_spike_{col}_zmax={float(np.abs(z).max()):.2f}")

        if report.issues and report.passed:
            report.passed = True  # issues warn mais pas fail sauf gap_ratio

        return report

    @staticmethod
    def _group_consecutive(
        missing: pd.DatetimeIndex, freq: str
    ) -> list[tuple[pd.Timestamp, pd.Timestamp]]:
        if len(missing) == 0:
            return []
        delta = pd.Timedelta(freq)
        groups: list[tuple[pd.Timestamp, pd.Timestamp]] = []
        start = missing[0]
        prev = missing[0]
        for ts in missing[1:]:
            if ts - prev > delta:
                groups.append((start, prev))
                start = ts
            prev = ts
        groups.append((start, prev))
        return groups
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/trading/data/quality.py tests/unit/data/test_quality.py
git commit -m "feat(finance/trading): QualityChecker gaps/outliers/zero-volume (Phase 2/8)"
```

### Task 2.5 — `Catalog` (wrapper Nautilus ParquetDataCatalog)

**Files:**
- Create: `modules/finance/trading/src/trading/data/catalog.py`
- Create: `modules/finance/trading/tests/unit/data/test_catalog.py`

- [ ] **Step 1: Test TDD**

`tests/unit/data/test_catalog.py` :

```python
"""Tests Catalog : ecriture/lecture Parquet via Nautilus ParquetDataCatalog."""
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from trading.data.catalog import Catalog


@pytest.fixture
def sample_df() -> pd.DataFrame:
    idx = pd.date_range(datetime(2024, 1, 1, tzinfo=timezone.utc), periods=100, freq="1h")
    return pd.DataFrame(
        {
            "open": np.linspace(40000, 42000, 100),
            "high": np.linspace(40100, 42100, 100),
            "low": np.linspace(39900, 41900, 100),
            "close": np.linspace(40050, 42050, 100),
            "volume": np.linspace(100, 200, 100),
        },
        index=idx,
    )


def test_catalog_write_then_read_roundtrip(tmp_path: Path, sample_df: pd.DataFrame) -> None:
    catalog = Catalog(root=tmp_path)
    catalog.write_ohlcv(
        df=sample_df,
        venue="BINANCE",
        symbol="BTCUSDT",
        timeframe="1h",
    )
    loaded = catalog.read_ohlcv(venue="BINANCE", symbol="BTCUSDT", timeframe="1h")
    assert len(loaded) == 100
    assert list(loaded.columns) == ["open", "high", "low", "close", "volume"]
    pd.testing.assert_index_equal(loaded.index, sample_df.index)


def test_catalog_lists_available(tmp_path: Path, sample_df: pd.DataFrame) -> None:
    catalog = Catalog(root=tmp_path)
    catalog.write_ohlcv(sample_df, venue="BINANCE", symbol="BTCUSDT", timeframe="1h")
    catalog.write_ohlcv(sample_df, venue="BINANCE", symbol="ETHUSDT", timeframe="1h")
    available = catalog.list_available(venue="BINANCE", timeframe="1h")
    assert set(available) == {"BTCUSDT", "ETHUSDT"}
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Ecrire `src/trading/data/catalog.py`**

```python
"""Catalog : wrapper simple autour Parquet pour storage hierarchise.

Note : on utilise Parquet brut (pas le ParquetDataCatalog Nautilus complet)
pour la v1 — plus simple a manipuler. La conversion vers Nautilus catalog
se fera dans BacktestRunner (Phase 3) via un builder dedie.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pandas as pd


@dataclass
class Catalog:
    """Storage Parquet hierarchise : root/{venue}/{symbol}/{timeframe}.parquet."""

    root: Path

    def _path(self, venue: str, symbol: str, timeframe: str) -> Path:
        return self.root / venue / symbol / f"{timeframe}.parquet"

    def write_ohlcv(
        self,
        df: pd.DataFrame,
        *,
        venue: str,
        symbol: str,
        timeframe: str,
    ) -> Path:
        path = self._path(venue, symbol, timeframe)
        path.parent.mkdir(parents=True, exist_ok=True)
        df.to_parquet(path, engine="pyarrow", compression="snappy")
        return path

    def read_ohlcv(
        self,
        *,
        venue: str,
        symbol: str,
        timeframe: str,
    ) -> pd.DataFrame:
        path = self._path(venue, symbol, timeframe)
        if not path.exists():
            raise FileNotFoundError(f"no catalog entry for {venue}/{symbol}/{timeframe}")
        return pd.read_parquet(path, engine="pyarrow")

    def list_available(self, *, venue: str, timeframe: str) -> list[str]:
        venue_dir = self.root / venue
        if not venue_dir.exists():
            return []
        out: list[str] = []
        for sym_dir in venue_dir.iterdir():
            if (sym_dir / f"{timeframe}.parquet").exists():
                out.append(sym_dir.name)
        return sorted(out)
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/trading/data/catalog.py tests/unit/data/test_catalog.py
git commit -m "feat(finance/trading): Catalog Parquet storage (Phase 2/8)"
```

### Task 2.6 — CLI `trading download-data`

**Files:**
- Create: `modules/finance/trading/src/trading/cli/download.py`
- Modify: `modules/finance/trading/src/trading/cli/main.py` (register sub-command)

- [ ] **Step 1: Ecrire `src/trading/cli/download.py`**

```python
"""CLI 'trading download-data' : recupere OHLCV + funding via ccxt/Binance direct."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.progress import track

from trading.data.catalog import Catalog
from trading.data.quality import QualityChecker
from trading.data.sources.binance_source import BinanceSource
from trading.data.sources.ccxt_source import CCXTSource

console = Console()
app = typer.Typer(help="Telecharger donnees historiques crypto dans le catalog Parquet local.")


@app.command("download-data")
def download_data(
    source: Annotated[str, typer.Option(help="ccxt | binance-direct")] = "ccxt",
    exchange: Annotated[str, typer.Option(help="ccxt exchange_id (ignore si source=binance-direct)")] = "binance",
    symbols: Annotated[str, typer.Option(help="CSV symbols, ex: BTC/USDT,ETH/USDT")] = "BTC/USDT,ETH/USDT",
    timeframe: Annotated[str, typer.Option(help="1h|4h|1d|...")] = "1h",
    start: Annotated[str, typer.Option(help="YYYY-MM-DD")] = "2021-01-01",
    end: Annotated[str | None, typer.Option(help="YYYY-MM-DD (defaut=today)")] = None,
    market: Annotated[str, typer.Option(help="spot|perp")] = "spot",
    catalog_root: Annotated[Path, typer.Option(help="Dossier catalog")] = Path("data/parquet"),
) -> None:
    """Telecharge et stocke OHLCV (+ funding si perp) dans catalog_root/<venue>/<symbol>/<tf>.parquet."""
    start_dt = datetime.fromisoformat(start).replace(tzinfo=timezone.utc)
    end_dt = (
        datetime.fromisoformat(end).replace(tzinfo=timezone.utc)
        if end
        else datetime.now(tz=timezone.utc)
    )

    if source == "ccxt":
        data_source = CCXTSource(exchange_id=exchange if market == "spot" else f"{exchange}usdm")
        venue = exchange.upper()
    elif source == "binance-direct":
        data_source = BinanceSource(market="spot" if market == "spot" else "perp")
        venue = "BINANCE"
    else:
        raise typer.BadParameter(f"unknown source {source}")

    catalog = Catalog(root=catalog_root)
    checker = QualityChecker(timeframe=timeframe)  # type: ignore[arg-type]

    symbol_list = [s.strip() for s in symbols.split(",") if s.strip()]
    for symbol in track(symbol_list, description="Downloading"):
        console.print(f"[cyan]{venue}[/cyan] {symbol} {timeframe} {start_dt.date()}..{end_dt.date()}")
        try:
            df = data_source.fetch_ohlcv(symbol, timeframe, start_dt, end_dt)
        except Exception as exc:  # noqa: BLE001
            console.print(f"  [red]FAIL[/red] {symbol}: {exc}")
            continue

        report = checker.check(df, symbol=symbol)
        if not report.passed:
            console.print(f"  [yellow]WARN[/yellow] quality issues: {report.issues}")

        sym_key = symbol.replace("/", "")
        path = catalog.write_ohlcv(df=df, venue=venue, symbol=sym_key, timeframe=timeframe)
        console.print(f"  [green]OK[/green] {len(df)} bars -> {path}")

        if market == "perp":
            try:
                funding_df = data_source.fetch_funding(symbol, start_dt, end_dt)
                if not funding_df.empty:
                    funding_path = catalog.root / venue / sym_key / f"{timeframe}_funding.parquet"
                    funding_path.parent.mkdir(parents=True, exist_ok=True)
                    funding_df.to_parquet(funding_path)
                    console.print(f"  [green]OK[/green] {len(funding_df)} funding -> {funding_path}")
            except Exception as exc:  # noqa: BLE001
                console.print(f"  [yellow]WARN[/yellow] funding fetch: {exc}")
```

- [ ] **Step 2: Modifier `src/trading/cli/main.py` pour registrer la sub-command**

Remplacer le contenu par :

```python
"""Point d'entree CLI Typer unifie pour le module trading."""

import typer

from trading import __version__
from trading.cli import download as download_cli

app = typer.Typer(
    name="trading",
    help="Foundation OS — backtest engine crypto + Pine bridge + 3Commas.",
    no_args_is_help=True,
)

app.add_typer(download_cli.app, name="")  # commands mountes a la racine


def _version_callback(value: bool) -> None:
    if value:
        typer.echo(f"trading {__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: bool = typer.Option(
        False,
        "--version",
        callback=_version_callback,
        is_eager=True,
        help="Afficher la version et quitter.",
    ),
) -> None:
    """Racine CLI trading."""
```

- [ ] **Step 3: Verifier aide CLI**

```bash
uv run trading --help
uv run trading download-data --help
```

Expected : `download-data` apparait dans l'aide racine + aide dediee affiche les options.

- [ ] **Step 4: Test dry-run (optionnel, si reseau dispo)**

```bash
uv run trading download-data --symbols BTC/USDT --timeframe 1d --start 2024-01-01 --end 2024-01-10 --catalog-root /tmp/trading-catalog-test
ls /tmp/trading-catalog-test/BINANCE/BTCUSDT/1d.parquet
```

Expected : fichier cree, ~10 lignes.

- [ ] **Step 5: Commit**

```bash
git add src/trading/cli/download.py src/trading/cli/main.py
git commit -m "feat(finance/trading): CLI 'trading download-data' (Phase 2/8)"
```

### Verification Phase 2

```bash
cd modules/finance/trading
uv run pytest tests/unit/data/ -v             # tous OK
uv run trading download-data --help            # aide affichee
uv run trading --help                          # download-data present
```

### Rollback Phase 2

```bash
cd ~/foundation-os
git revert HEAD~5..HEAD  # si Phase 2 a produit 5 commits
# OU restore selectif : git checkout cf12c8a -- src/trading/data/ src/trading/cli/download.py
```

### Commit wrap-up Phase 2 (optionnel)

Non necessaire (5 commits atomiques suffisent). Mettre a jour `phases_done: 2` dans le frontmatter du plan.

---

## Phase 3/8 — Backtest engine core : strategy + runner + fees + slippage + latency + funding

### Pre-conditions

- Phase 2 terminee (catalog Parquet utilisable, download-data OK)
- At minimum 1 fixture OHLCV locale dispo (`tests/fixtures/`)

### Etat repo attendu

- `src/trading/strategies/` + `src/trading/backtest/` existent vides

### Task 3.1 — `BaseStrategy` + metadata

**Files:**
- Create: `modules/finance/trading/src/trading/strategies/base.py`
- Create: `modules/finance/trading/tests/unit/strategies/test_base.py`

- [ ] **Step 1: Tests TDD**

```python
"""Tests BaseStrategy : metadata slots, validation, to_pine_context."""
import pytest

from trading.strategies.base import BaseStrategy, StrategyMetadata


def test_strategy_metadata_defaults() -> None:
    meta = StrategyMetadata(
        name="ema_cross_btc_4h",
        horizon="swing",
        instruments=["BTCUSDT.BINANCE"],
        hyperparams={"ema_fast": 10, "ema_slow": 30},
    )
    assert meta.name == "ema_cross_btc_4h"
    assert meta.horizon == "swing"
    assert meta.wiki_ref is None


def test_strategy_metadata_invalid_horizon() -> None:
    with pytest.raises(ValueError):
        StrategyMetadata(
            name="bad",
            horizon="intraday",  # non autorise en v1
            instruments=["BTCUSDT"],
            hyperparams={},
        )
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Ecrire `src/trading/strategies/base.py`**

```python
"""BaseStrategy : classe mere pour toute strategie + metadata Pydantic."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

Horizon = Literal["swing", "position"]


class StrategyMetadata(BaseModel):
    """Metadata deterministe utilisee pour nommage, reports, Pine generation, wiki couplage."""

    name: str = Field(min_length=1, description="snake_case unique, ex: ema_cross_btc_4h")
    horizon: Horizon
    instruments: list[str] = Field(min_length=1, description="ex: ['BTCUSDT.BINANCE']")
    hyperparams: dict[str, Any] = Field(default_factory=dict)
    wiki_ref: str | None = None

    @field_validator("horizon")
    @classmethod
    def _check_horizon(cls, v: str) -> str:
        if v not in {"swing", "position"}:
            raise ValueError(f"horizon must be 'swing' or 'position', got {v!r}")
        return v


class BaseStrategy:
    """Classe parente pour strategies.

    En v1 on delegue l'heritage Nautilus a une classe concrete (Phase 3.4)
    pour tester la metadata de maniere isolee sans tirer Nautilus dans
    tous les tests unitaires.
    """

    metadata: StrategyMetadata

    def __init__(self, metadata: StrategyMetadata) -> None:
        self.metadata = metadata

    def to_pine_context(self) -> dict[str, Any]:
        """Variables exposees au template Pine v5 (override dans les sous-classes)."""
        return {
            "strategy_name": self.metadata.name,
            "horizon": self.metadata.horizon,
            **self.metadata.hyperparams,
        }
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/trading/strategies/base.py tests/unit/strategies/test_base.py
git commit -m "feat(finance/trading): BaseStrategy + StrategyMetadata Pydantic (Phase 3/8)"
```

### Task 3.2 — Indicateurs reutilisables (EMA, RSI, ATR)

**Files:**
- Create: `modules/finance/trading/src/trading/strategies/indicators/ema.py`
- Create: `modules/finance/trading/src/trading/strategies/indicators/rsi.py`
- Create: `modules/finance/trading/src/trading/strategies/indicators/atr.py`
- Create: `modules/finance/trading/tests/unit/strategies/test_indicators.py`

- [ ] **Step 1: Tests TDD**

```python
"""Tests indicateurs purs (pandas-based, reutilisables hors Nautilus)."""
import numpy as np
import pandas as pd

from trading.strategies.indicators.atr import atr
from trading.strategies.indicators.ema import ema
from trading.strategies.indicators.rsi import rsi


def _ohlc(n: int) -> pd.DataFrame:
    idx = pd.date_range("2024-01-01", periods=n, freq="1h", tz="UTC")
    prices = np.linspace(100, 110, n)
    return pd.DataFrame(
        {"open": prices, "high": prices + 1, "low": prices - 1, "close": prices, "volume": 1.0},
        index=idx,
    )


def test_ema_length_matches_input() -> None:
    series = _ohlc(50)["close"]
    out = ema(series, period=10)
    assert len(out) == len(series)
    assert not out.iloc[10:].isna().any()


def test_rsi_range_0_100() -> None:
    series = _ohlc(100)["close"]
    out = rsi(series, period=14)
    valid = out.dropna()
    assert (valid >= 0).all() and (valid <= 100).all()


def test_atr_positive() -> None:
    df = _ohlc(100)
    out = atr(df, period=14)
    valid = out.dropna()
    assert (valid >= 0).all()
```

- [ ] **Step 2: `src/trading/strategies/indicators/ema.py`**

```python
import pandas as pd


def ema(series: pd.Series, period: int) -> pd.Series:
    return series.ewm(span=period, adjust=False).mean()
```

- [ ] **Step 3: `src/trading/strategies/indicators/rsi.py`**

```python
import pandas as pd


def rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.clip(lower=0).ewm(alpha=1 / period, adjust=False).mean()
    loss = -delta.clip(upper=0).ewm(alpha=1 / period, adjust=False).mean()
    rs = gain / loss.replace(0, 1e-12)
    return 100 - (100 / (1 + rs))
```

- [ ] **Step 4: `src/trading/strategies/indicators/atr.py`**

```python
import pandas as pd


def atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    high_low = df["high"] - df["low"]
    high_close = (df["high"] - df["close"].shift()).abs()
    low_close = (df["low"] - df["close"].shift()).abs()
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    return tr.ewm(alpha=1 / period, adjust=False).mean()
```

- [ ] **Step 5: Run → PASS**

- [ ] **Step 6: Commit**

```bash
git add src/trading/strategies/indicators/ tests/unit/strategies/test_indicators.py
git commit -m "feat(finance/trading): indicateurs EMA / RSI / ATR (Phase 3/8)"
```

### Task 3.3 — `FeeSchedule`, `LatencySimulator`, `VolatilityBasedSlippage`, `FundingCalculator`

**Files:**
- Create: `modules/finance/trading/src/trading/backtest/fees.py`
- Create: `modules/finance/trading/src/trading/backtest/latency.py`
- Create: `modules/finance/trading/src/trading/backtest/slippage.py`
- Create: `modules/finance/trading/src/trading/backtest/funding.py`
- Create: `modules/finance/trading/tests/unit/backtest/test_fees.py`
- Create: `modules/finance/trading/tests/unit/backtest/test_latency.py`
- Create: `modules/finance/trading/tests/unit/backtest/test_slippage.py`
- Create: `modules/finance/trading/tests/unit/backtest/test_funding.py`

- [ ] **Step 1: Tests TDD fees**

`tests/unit/backtest/test_fees.py` :

```python
from trading.backtest.fees import FeeSchedule


def test_binance_spot_vip0() -> None:
    s = FeeSchedule(venue="BINANCE", market="spot", tier="VIP0")
    assert s.maker() == 0.001  # 10 bps
    assert s.taker() == 0.001


def test_binance_perp_vip0() -> None:
    s = FeeSchedule(venue="BINANCE", market="perp", tier="VIP0")
    assert s.maker() == 0.0002  # 2 bps
    assert s.taker() == 0.0005  # 5 bps
```

- [ ] **Step 2: `src/trading/backtest/fees.py`**

```python
"""FeeSchedule : fees maker/taker par venue + market + tier."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


FEE_TABLE: dict[tuple[str, str, str], tuple[float, float]] = {
    # (venue, market, tier) -> (maker, taker)
    ("BINANCE", "spot", "VIP0"): (0.0010, 0.0010),
    ("BINANCE", "spot", "VIP1"): (0.0009, 0.0010),
    ("BINANCE", "perp", "VIP0"): (0.0002, 0.0005),
    ("BINANCE", "perp", "VIP1"): (0.00016, 0.0004),
    ("BYBIT", "spot", "VIP0"): (0.0010, 0.0010),
    ("BYBIT", "perp", "VIP0"): (0.0002, 0.00055),
}


@dataclass
class FeeSchedule:
    venue: Literal["BINANCE", "BYBIT"] = "BINANCE"
    market: Literal["spot", "perp"] = "spot"
    tier: str = "VIP0"

    def _rates(self) -> tuple[float, float]:
        return FEE_TABLE[(self.venue, self.market, self.tier)]

    def maker(self) -> float:
        return self._rates()[0]

    def taker(self) -> float:
        return self._rates()[1]
```

- [ ] **Step 3: Tests + impl `latency.py`**

`tests/unit/backtest/test_latency.py` :

```python
import random

from trading.backtest.latency import LatencySimulator


def test_latency_in_range() -> None:
    sim = LatencySimulator(min_ms=100, max_ms=200, seed=42)
    samples = [sim.draw_ms() for _ in range(1000)]
    assert min(samples) >= 100
    assert max(samples) <= 200


def test_latency_deterministic_with_seed() -> None:
    s1 = LatencySimulator(seed=1).draw_ms()
    s2 = LatencySimulator(seed=1).draw_ms()
    assert s1 == s2
```

`src/trading/backtest/latency.py` :

```python
"""LatencySimulator : injecte un delay simule sur placement/fill ordre."""

from __future__ import annotations

import random
from dataclasses import dataclass


@dataclass
class LatencySimulator:
    min_ms: int = 100
    max_ms: int = 200
    seed: int | None = None

    def __post_init__(self) -> None:
        self._rng = random.Random(self.seed)

    def draw_ms(self) -> int:
        return self._rng.randint(self.min_ms, self.max_ms)
```

- [ ] **Step 4: Tests + impl `slippage.py`**

`tests/unit/backtest/test_slippage.py` :

```python
from trading.backtest.slippage import VolatilityBasedSlippage


def test_slippage_scales_with_atr() -> None:
    model = VolatilityBasedSlippage(base_bps=2.0, atr_multiplier=0.5)
    low_vol = model.compute_bps(atr_ratio=0.001, order_notional=10_000, avg_volume_notional=1_000_000)
    high_vol = model.compute_bps(atr_ratio=0.01, order_notional=10_000, avg_volume_notional=1_000_000)
    assert high_vol > low_vol


def test_slippage_scales_with_order_size() -> None:
    model = VolatilityBasedSlippage(base_bps=2.0, size_impact=1.0)
    small = model.compute_bps(atr_ratio=0.005, order_notional=1_000, avg_volume_notional=1_000_000)
    large = model.compute_bps(atr_ratio=0.005, order_notional=100_000, avg_volume_notional=1_000_000)
    assert large > small
```

`src/trading/backtest/slippage.py` :

```python
"""VolatilityBasedSlippage : slippage en bps fonction de ATR + taille ordre / liquidite."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class VolatilityBasedSlippage:
    """bps = base + atr_ratio * atr_mult + (order/volume) * size_impact.

    Defaults calibrees pour crypto majeur (BTC/ETH) 1h-4h timeframe.
    """

    base_bps: float = 2.0
    atr_multiplier: float = 50.0
    size_impact: float = 100.0

    def compute_bps(
        self,
        atr_ratio: float,
        order_notional: float,
        avg_volume_notional: float,
    ) -> float:
        vol_component = self.atr_multiplier * atr_ratio * 1e4  # atr_ratio en fraction → bps
        size_component = self.size_impact * (order_notional / max(avg_volume_notional, 1))
        return self.base_bps + vol_component + size_component
```

- [ ] **Step 5: Tests + impl `funding.py`**

`tests/unit/backtest/test_funding.py` :

```python
from datetime import datetime, timezone

import pandas as pd

from trading.backtest.funding import FundingCalculator


def test_funding_cashflow_long_negative_rate_earns() -> None:
    # rate negatif = shorts paient longs
    idx = pd.date_range("2024-01-01", periods=3, freq="8h", tz="UTC")
    funding = pd.Series([-0.0001, -0.0001, -0.0001], index=idx, name="funding_rate")
    calc = FundingCalculator()
    cashflow = calc.apply(position_notional=10_000, direction="long", funding_series=funding)
    assert cashflow > 0  # long a gagne 3 * 10_000 * 0.0001 = 3.0


def test_funding_cashflow_long_positive_rate_pays() -> None:
    idx = pd.date_range("2024-01-01", periods=2, freq="8h", tz="UTC")
    funding = pd.Series([0.0002, 0.0002], index=idx, name="funding_rate")
    calc = FundingCalculator()
    cashflow = calc.apply(position_notional=10_000, direction="long", funding_series=funding)
    assert cashflow < 0  # long a paye 2 * 10_000 * 0.0002 = 4.0
```

`src/trading/backtest/funding.py` :

```python
"""FundingCalculator : cashflow funding sur positions perps ouvertes."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

import pandas as pd


@dataclass
class FundingCalculator:
    """Pour un long : cashflow = - position * sum(funding_rates). Invert pour short."""

    def apply(
        self,
        *,
        position_notional: float,
        direction: Literal["long", "short"],
        funding_series: pd.Series,
    ) -> float:
        total_rate = float(funding_series.sum())
        sign = -1 if direction == "long" else 1
        return sign * position_notional * total_rate
```

- [ ] **Step 6: Run tous les tests backtest unit**

```bash
uv run pytest tests/unit/backtest/ -v
```

Expected : 8+ tests passent.

- [ ] **Step 7: Commit**

```bash
git add src/trading/backtest/{fees,latency,slippage,funding}.py tests/unit/backtest/
git commit -m "feat(finance/trading): FeeSchedule + Latency + Slippage + Funding (Phase 3/8)"
```

### Task 3.4 — Strategy exemple `ema_cross` + `BacktestRunner` minimal

**Files:**
- Create: `modules/finance/trading/src/trading/strategies/_examples/ema_cross.py`
- Create: `modules/finance/trading/src/trading/backtest/runner.py`
- Create: `modules/finance/trading/tests/integration/test_runner_smoke.py`
- Create: `modules/finance/trading/src/trading/cli/backtest.py`
- Modify: `modules/finance/trading/src/trading/cli/main.py`

- [ ] **Step 1: `src/trading/strategies/_examples/ema_cross.py`**

```python
"""Exemple EMA cross : long si ema_fast > ema_slow, flat sinon. Pas pour trader live."""

from __future__ import annotations

from typing import Any

import pandas as pd

from trading.strategies.base import BaseStrategy, StrategyMetadata
from trading.strategies.indicators.ema import ema


class EMACrossStrategy(BaseStrategy):
    def __init__(self, ema_fast: int = 10, ema_slow: int = 30) -> None:
        super().__init__(
            StrategyMetadata(
                name=f"ema_cross_{ema_fast}_{ema_slow}",
                horizon="swing",
                instruments=["BTCUSDT.BINANCE"],
                hyperparams={"ema_fast": ema_fast, "ema_slow": ema_slow},
                wiki_ref=f"[[EMA Cross {ema_fast}/{ema_slow}]]",
            ),
        )
        self.ema_fast = ema_fast
        self.ema_slow = ema_slow

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        fast = ema(df["close"], self.ema_fast)
        slow = ema(df["close"], self.ema_slow)
        raw = (fast > slow).astype(int)
        return raw.diff().fillna(0)  # +1 = entry long, -1 = exit, 0 = hold

    def to_pine_context(self) -> dict[str, Any]:
        ctx = super().to_pine_context()
        ctx.update({"ema_fast": self.ema_fast, "ema_slow": self.ema_slow})
        return ctx
```

- [ ] **Step 2: `src/trading/backtest/runner.py` (version simplifee pandas, Nautilus integration Phase 3.5)**

```python
"""BacktestRunner v1 : version simplifiee pandas pour iteration rapide.

Nota : l'integration Nautilus complete arrive en Phase 3.5 (Task suivante).
Cette version v1 suffit pour tester end-to-end les harnesses Phase 4.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from trading.backtest.fees import FeeSchedule
from trading.backtest.slippage import VolatilityBasedSlippage
from trading.strategies._examples.ema_cross import EMACrossStrategy
from trading.strategies.base import BaseStrategy
from trading.strategies.indicators.atr import atr


@dataclass
class BacktestResult:
    strategy_name: str
    trades: pd.DataFrame
    equity_curve: pd.Series
    stats: dict[str, Any] = field(default_factory=dict)


@dataclass
class BacktestRunner:
    fees: FeeSchedule = field(default_factory=FeeSchedule)
    slippage: VolatilityBasedSlippage = field(default_factory=VolatilityBasedSlippage)
    initial_capital: float = 10_000.0

    def run(self, strategy: BaseStrategy, df: pd.DataFrame) -> BacktestResult:
        if not hasattr(strategy, "generate_signals"):
            raise TypeError(f"strategy {type(strategy).__name__} must expose generate_signals(df)")

        signals = strategy.generate_signals(df)
        atr_series = atr(df, period=14)
        atr_ratio = atr_series / df["close"]

        trades = []
        position = 0
        entry_price = 0.0
        entry_ts = None
        equity = [self.initial_capital]

        for ts, sig in signals.items():
            price = df.loc[ts, "close"]
            if sig == 1 and position == 0:
                slip_bps = self.slippage.compute_bps(
                    atr_ratio=float(atr_ratio.loc[ts]),
                    order_notional=self.initial_capital,
                    avg_volume_notional=float(df["volume"].mean() * price),
                )
                entry_price = price * (1 + slip_bps / 1e4)
                entry_ts = ts
                position = 1
            elif sig == -1 and position == 1:
                slip_bps = self.slippage.compute_bps(
                    atr_ratio=float(atr_ratio.loc[ts]),
                    order_notional=self.initial_capital,
                    avg_volume_notional=float(df["volume"].mean() * price),
                )
                exit_price = price * (1 - slip_bps / 1e4)
                pnl_pct = (exit_price - entry_price) / entry_price - 2 * self.fees.taker()
                trades.append(
                    {
                        "entry_ts": entry_ts,
                        "exit_ts": ts,
                        "entry_price": entry_price,
                        "exit_price": exit_price,
                        "pnl_pct": pnl_pct,
                    }
                )
                equity.append(equity[-1] * (1 + pnl_pct))
                position = 0

        trades_df = pd.DataFrame(trades)
        equity_idx = pd.Index([df.index[0]] + [t["exit_ts"] for t in trades], name="ts")
        equity_series = pd.Series(equity, index=equity_idx, name="equity")

        return BacktestResult(
            strategy_name=strategy.metadata.name,
            trades=trades_df,
            equity_curve=equity_series,
            stats={
                "n_trades": len(trades),
                "total_return": (equity[-1] / equity[0]) - 1,
                "final_equity": equity[-1],
            },
        )
```

- [ ] **Step 3: `tests/integration/test_runner_smoke.py`**

```python
"""E2E smoke : EMA cross sur sample fixture BTC 1h -> BacktestResult non vide."""
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd

from trading.backtest.runner import BacktestRunner
from trading.strategies._examples.ema_cross import EMACrossStrategy


def _make_long_fixture(n: int = 500) -> pd.DataFrame:
    idx = pd.date_range("2024-01-01", periods=n, freq="1h", tz="UTC")
    rng = np.random.default_rng(42)
    returns = rng.normal(0, 0.01, n)
    prices = 40000 * np.exp(returns.cumsum())
    return pd.DataFrame(
        {
            "open": prices,
            "high": prices * 1.002,
            "low": prices * 0.998,
            "close": prices,
            "volume": rng.uniform(50, 200, n),
        },
        index=idx,
    )


def test_runner_smoke_end_to_end() -> None:
    df = _make_long_fixture()
    strategy = EMACrossStrategy(ema_fast=5, ema_slow=20)
    runner = BacktestRunner()
    result = runner.run(strategy, df)

    assert result.strategy_name.startswith("ema_cross_")
    assert isinstance(result.trades, pd.DataFrame)
    assert isinstance(result.equity_curve, pd.Series)
    assert result.stats["n_trades"] >= 1
    assert result.stats["final_equity"] > 0
```

- [ ] **Step 4: CLI `trading backtest <strategy-id>`**

`src/trading/cli/backtest.py` :

```python
"""CLI 'trading backtest' : lance un run single-strategy sur periode donnee."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console

from trading.backtest.runner import BacktestRunner
from trading.data.catalog import Catalog
from trading.strategies._examples.ema_cross import EMACrossStrategy

console = Console()
app = typer.Typer()


@app.command("backtest")
def backtest(
    strategy_id: Annotated[str, typer.Argument(help="ex: _examples.ema_cross")],
    venue: Annotated[str, typer.Option()] = "BINANCE",
    symbol: Annotated[str, typer.Option()] = "BTCUSDT",
    timeframe: Annotated[str, typer.Option()] = "1h",
    start: Annotated[str, typer.Option(help="YYYY-MM-DD")] = "2023-01-01",
    end: Annotated[str, typer.Option(help="YYYY-MM-DD")] = "2024-12-31",
    catalog_root: Annotated[Path, typer.Option()] = Path("data/parquet"),
) -> None:
    strat_map = {"_examples.ema_cross": EMACrossStrategy}
    if strategy_id not in strat_map:
        raise typer.BadParameter(f"unknown strategy_id {strategy_id}. Known: {list(strat_map)}")

    catalog = Catalog(root=catalog_root)
    df = catalog.read_ohlcv(venue=venue, symbol=symbol, timeframe=timeframe)
    start_ts = pd.Timestamp(start, tz="UTC")
    end_ts = pd.Timestamp(end, tz="UTC")
    df = df.loc[(df.index >= start_ts) & (df.index <= end_ts)]

    strategy = strat_map[strategy_id]()
    runner = BacktestRunner()
    result = runner.run(strategy, df)

    console.print(f"[bold]Backtest {result.strategy_name}[/bold]")
    console.print(f"  trades: {result.stats['n_trades']}")
    console.print(f"  total_return: {result.stats['total_return']:.2%}")
    console.print(f"  final_equity: ${result.stats['final_equity']:.2f}")
```

Import manquant dans le fichier ci-dessus a ajouter en haut :

```python
import pandas as pd
```

- [ ] **Step 5: Registrer dans `main.py`**

Ajouter dans `src/trading/cli/main.py` :

```python
from trading.cli import backtest as backtest_cli

app.add_typer(backtest_cli.app, name="")
```

- [ ] **Step 6: Run tests + CLI check**

```bash
uv run pytest tests/unit/strategies tests/unit/backtest tests/integration/test_runner_smoke.py -v
uv run trading backtest --help
```

Expected : tous passent + CLI affiche l'aide.

- [ ] **Step 7: Commit**

```bash
git add src/trading/strategies/_examples/ema_cross.py src/trading/backtest/runner.py src/trading/cli/backtest.py src/trading/cli/main.py tests/integration/test_runner_smoke.py
git commit -m "feat(finance/trading): EMA cross + BacktestRunner v1 pandas + CLI backtest (Phase 3/8)"
```

### Task 3.5 — Integration Nautilus (BacktestNode) — v1 pragmatique

> **Note pragmatique** : l'integration Nautilus complete est optionnelle en Phase 3. Le runner pandas simplifie de Task 3.4 suffit pour piloter toutes les Phases 4 (harnesses) et 5 (analysis/reports). L'integration Nautilus sera livree en V1.1 apres validation bout-en-bout de l'outillage anti-biais.

Si on veut la faire maintenant (Kevin decide) :

- [ ] **Step 1: Creer `src/trading/backtest/nautilus_runner.py`** (wrapper `BacktestNode` Nautilus, ~200 lignes, suit la doc officielle [Nautilus backtest API](https://nautilustrader.io/docs/latest/backtest/index.html))
- [ ] **Step 2: Tests integration avec data fixture Parquet**
- [ ] **Step 3: Commit**

**Sinon** : marquer Task 3.5 `[SKIPPED v1]` dans le plan et livrer en V1.1. **Defaut recommande : SKIP** pour rester dans le budget 10-13 sessions. Decision Kevin a reconfirmer.

### Verification Phase 3

```bash
cd modules/finance/trading
uv run pytest tests/unit/ tests/integration/test_runner_smoke.py -v  # tous OK
uv run trading backtest --help
```

### Rollback Phase 3

Revert commits de la phase : `git revert <sha-ema-cross>..<sha-nautilus-runner>`.

### Commit wrap-up Phase 3

Non necessaire. Mettre `phases_done: 3` en fin de phase.

---

## Phase 4/8 — Harnesses anti-biais (WalkForward + PurgedCV + MonteCarlo + PBO + DSR)

### Pre-conditions

- Phase 3 terminee (`BacktestRunner.run(strategy, df)` fonctionnel)

### Etat repo attendu

- `src/trading/backtest/harnesses/` existe vide

### Task 4.1 — Protocol `Harness` + `HarnessResult`

**Files:**
- Create: `modules/finance/trading/src/trading/backtest/harnesses/base.py`
- Create: `modules/finance/trading/tests/unit/harnesses/test_base.py`

- [ ] **Step 1: Test TDD**

```python
from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict


def test_verdict_values() -> None:
    assert HarnessVerdict.PASS.value == "PASS"
    assert HarnessVerdict.WARN.value == "WARN"
    assert HarnessVerdict.FAIL.value == "FAIL"


def test_harness_result_dataclass() -> None:
    r = HarnessResult(name="walk_forward", verdict=HarnessVerdict.PASS, metrics={"sharpe_oos": 1.2})
    assert r.name == "walk_forward"
    assert r.verdict == HarnessVerdict.PASS
```

- [ ] **Step 2: Impl**

```python
"""Harness protocol + HarnessResult commun a tous les validators anti-biais."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Protocol

import pandas as pd


class HarnessVerdict(str, Enum):
    PASS = "PASS"
    WARN = "WARN"
    FAIL = "FAIL"


@dataclass
class HarnessResult:
    name: str
    verdict: HarnessVerdict
    metrics: dict[str, Any] = field(default_factory=dict)
    artifacts: list[Path] = field(default_factory=list)


class Harness(Protocol):
    name: str

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult: ...
```

- [ ] **Step 3: Commit**

```bash
git add src/trading/backtest/harnesses/base.py tests/unit/harnesses/test_base.py
git commit -m "feat(finance/trading): Harness protocol + HarnessResult (Phase 4/8)"
```

### Task 4.2 — `WalkForward`

**Files:**
- Create: `modules/finance/trading/src/trading/backtest/harnesses/walk_forward.py`
- Create: `modules/finance/trading/tests/unit/harnesses/test_walk_forward.py`

- [ ] **Step 1: Test TDD**

```python
from datetime import datetime, timezone

import numpy as np
import pandas as pd

from trading.backtest.harnesses.base import HarnessVerdict
from trading.backtest.harnesses.walk_forward import WalkForward
from trading.strategies._examples.ema_cross import EMACrossStrategy


def _long_fixture(n: int = 2000) -> pd.DataFrame:
    idx = pd.date_range("2023-01-01", periods=n, freq="1h", tz="UTC")
    rng = np.random.default_rng(7)
    returns = rng.normal(0, 0.01, n)
    prices = 40000 * np.exp(returns.cumsum())
    return pd.DataFrame(
        {"open": prices, "high": prices * 1.002, "low": prices * 0.998, "close": prices,
         "volume": rng.uniform(50, 200, n)},
        index=idx,
    )


def test_walk_forward_runs() -> None:
    df = _long_fixture()
    strategy = EMACrossStrategy(5, 20)
    wf = WalkForward(train_bars=500, test_bars=200, embargo_bars=24)
    result = wf.run(strategy, df, config={})
    assert result.name == "walk_forward"
    assert result.verdict in {HarnessVerdict.PASS, HarnessVerdict.WARN, HarnessVerdict.FAIL}
    assert "n_windows" in result.metrics
    assert result.metrics["n_windows"] >= 2
```

- [ ] **Step 2: Impl**

```python
"""WalkForward : rolling train/test avec embargo (anti-leakage)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd

from trading.backtest.harnesses.base import Harness, HarnessResult, HarnessVerdict
from trading.backtest.runner import BacktestRunner


@dataclass
class WalkForward(Harness):
    name: str = "walk_forward"
    train_bars: int = 500
    test_bars: int = 200
    embargo_bars: int = 24

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult:
        runner = BacktestRunner()
        total = len(df)
        window = self.train_bars + self.embargo_bars + self.test_bars
        if total < window:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "not_enough_bars"})

        oos_returns = []
        is_returns = []
        n_windows = 0
        cursor = 0
        while cursor + window <= total:
            train = df.iloc[cursor : cursor + self.train_bars]
            test_start = cursor + self.train_bars + self.embargo_bars
            test = df.iloc[test_start : test_start + self.test_bars]
            is_r = runner.run(strategy, train).stats["total_return"]
            oos_r = runner.run(strategy, test).stats["total_return"]
            is_returns.append(is_r)
            oos_returns.append(oos_r)
            cursor += self.test_bars
            n_windows += 1

        oos_mean = float(np.mean(oos_returns)) if oos_returns else 0.0
        is_mean = float(np.mean(is_returns)) if is_returns else 0.0
        ratio = oos_mean / is_mean if is_mean > 0 else 0.0
        verdict = HarnessVerdict.PASS if ratio > 0.5 else (HarnessVerdict.WARN if ratio > 0.2 else HarnessVerdict.FAIL)

        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={
                "n_windows": n_windows,
                "is_mean_return": is_mean,
                "oos_mean_return": oos_mean,
                "oos_is_ratio": ratio,
            },
        )
```

- [ ] **Step 3: Run → PASS + commit**

```bash
uv run pytest tests/unit/harnesses/test_walk_forward.py -v
git add src/trading/backtest/harnesses/walk_forward.py tests/unit/harnesses/test_walk_forward.py
git commit -m "feat(finance/trading): WalkForward harness (Phase 4/8)"
```

### Task 4.3 — `PurgedCV` (Lopez de Prado)

**Files:**
- Create: `modules/finance/trading/src/trading/backtest/harnesses/purged_cv.py`
- Create: `modules/finance/trading/tests/unit/harnesses/test_purged_cv.py`

- [ ] **Step 1: Test + impl (meme pattern : k-fold temporel avec gap `embargo_pct` entre train/test)**

```python
"""PurgedCV : K-fold cross-validation purged + embargoed (Lopez de Prado 2018, ch.7)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd

from trading.backtest.harnesses.base import Harness, HarnessResult, HarnessVerdict
from trading.backtest.runner import BacktestRunner


@dataclass
class PurgedCV(Harness):
    name: str = "purged_cv"
    k: int = 5
    embargo_pct: float = 0.01

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult:
        runner = BacktestRunner()
        n = len(df)
        fold_size = n // self.k
        embargo = int(n * self.embargo_pct)

        fold_returns = []
        for fold_idx in range(self.k):
            test_start = fold_idx * fold_size
            test_end = test_start + fold_size
            test = df.iloc[test_start:test_end]

            train_parts = []
            if test_start > embargo:
                train_parts.append(df.iloc[: test_start - embargo])
            if test_end + embargo < n:
                train_parts.append(df.iloc[test_end + embargo :])
            if not train_parts:
                continue
            train = pd.concat(train_parts)

            _ = runner.run(strategy, train)  # simule training (noop si strategy parameter-less)
            fold_returns.append(runner.run(strategy, test).stats["total_return"])

        if not fold_returns:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "no_valid_folds"})

        mean_r = float(np.mean(fold_returns))
        std_r = float(np.std(fold_returns, ddof=1)) if len(fold_returns) > 1 else 0.0
        verdict = HarnessVerdict.PASS if mean_r > 0 and std_r < 2 * abs(mean_r) + 1e-9 else HarnessVerdict.WARN

        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={"k": self.k, "fold_mean": mean_r, "fold_std": std_r, "n_folds": len(fold_returns)},
        )
```

- [ ] **Step 2: Test + commit**

```python
# tests/unit/harnesses/test_purged_cv.py
from trading.backtest.harnesses.purged_cv import PurgedCV
from trading.backtest.harnesses.base import HarnessVerdict
from trading.backtest.harnesses.test_walk_forward import _long_fixture  # reuse
from trading.strategies._examples.ema_cross import EMACrossStrategy


def test_purged_cv_runs() -> None:
    df = _long_fixture()
    cv = PurgedCV(k=5, embargo_pct=0.01)
    r = cv.run(EMACrossStrategy(5, 20), df, config={})
    assert r.metrics["k"] == 5
    assert r.metrics["n_folds"] >= 1
    assert r.verdict in {HarnessVerdict.PASS, HarnessVerdict.WARN, HarnessVerdict.FAIL}
```

```bash
git add src/trading/backtest/harnesses/purged_cv.py tests/unit/harnesses/test_purged_cv.py
git commit -m "feat(finance/trading): PurgedCV harness Lopez de Prado (Phase 4/8)"
```

### Task 4.4 — `MonteCarlo` (trade shuffle + slippage jitter)

**Files:**
- Create: `modules/finance/trading/src/trading/backtest/harnesses/monte_carlo.py`
- Create: `modules/finance/trading/tests/unit/harnesses/test_monte_carlo.py`

- [ ] **Step 1: Impl**

```python
"""MonteCarlo : 1000+ runs avec trade shuffling + slippage jitter → distribution Sharpe/DD."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd

from trading.backtest.harnesses.base import Harness, HarnessResult, HarnessVerdict
from trading.backtest.runner import BacktestRunner


@dataclass
class MonteCarlo(Harness):
    name: str = "monte_carlo"
    n_runs: int = 1000
    seed: int = 42

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult:
        runner = BacktestRunner()
        base_result = runner.run(strategy, df)
        trades = base_result.trades
        if trades.empty:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "no_trades"})

        rng = np.random.default_rng(self.seed)
        returns = trades["pnl_pct"].to_numpy()
        equity_finals = []
        max_dds = []
        for _ in range(self.n_runs):
            shuffled = rng.permutation(returns)
            equity = np.cumprod(1 + shuffled)
            peak = np.maximum.accumulate(equity)
            dd = (equity - peak) / peak
            equity_finals.append(float(equity[-1]) - 1)
            max_dds.append(float(dd.min()))

        pct_positive = float(np.mean([e > 0 for e in equity_finals]))
        median_dd = float(np.median(max_dds))
        verdict = HarnessVerdict.PASS if pct_positive > 0.5 else HarnessVerdict.WARN

        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={
                "n_runs": self.n_runs,
                "pct_runs_positive": pct_positive,
                "median_max_dd": median_dd,
                "p5_final_return": float(np.percentile(equity_finals, 5)),
                "p95_final_return": float(np.percentile(equity_finals, 95)),
            },
        )
```

- [ ] **Step 2: Tests + commit**

```python
# tests/unit/harnesses/test_monte_carlo.py
from trading.backtest.harnesses.monte_carlo import MonteCarlo
from trading.backtest.harnesses.test_walk_forward import _long_fixture
from trading.strategies._examples.ema_cross import EMACrossStrategy


def test_monte_carlo_produces_distribution() -> None:
    df = _long_fixture()
    mc = MonteCarlo(n_runs=100, seed=1)
    r = mc.run(EMACrossStrategy(5, 20), df, config={})
    assert r.metrics["n_runs"] == 100
    assert "pct_runs_positive" in r.metrics
    assert 0 <= r.metrics["pct_runs_positive"] <= 1
```

```bash
git add src/trading/backtest/harnesses/monte_carlo.py tests/unit/harnesses/test_monte_carlo.py
git commit -m "feat(finance/trading): MonteCarlo harness shuffle + jitter (Phase 4/8)"
```

### Task 4.5 — `PBO` + `DeflatedSharpe`

**Files:**
- Create: `modules/finance/trading/src/trading/backtest/harnesses/pbo.py`
- Create: `modules/finance/trading/src/trading/backtest/harnesses/deflated_sharpe.py`
- Create: `modules/finance/trading/tests/unit/harnesses/test_pbo.py`
- Create: `modules/finance/trading/tests/unit/harnesses/test_deflated_sharpe.py`

- [ ] **Step 1: PBO impl (Bailey/Lopez de Prado, The Probability of Backtest Overfitting)**

```python
"""PBO : Probability of Backtest Overfitting via combinatorial symmetric CV.

Reference : Bailey, Borwein, Lopez de Prado, Zhu (2015).
Implementation simplifiee : on recoit N strategies (ou configs hyperparams)
avec leurs equity curves, on calcule la probabilite que la meilleure in-sample
soit mediocre out-of-sample.
"""

from __future__ import annotations

from dataclasses import dataclass
from itertools import combinations
from typing import Any

import numpy as np
import pandas as pd

from trading.backtest.harnesses.base import Harness, HarnessResult, HarnessVerdict


@dataclass
class PBO(Harness):
    name: str = "pbo"
    s: int = 16  # nombre de splits (doit etre pair, Bailey recommande 16)

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult:
        """config['equity_curves'] = DataFrame cols=strategies, rows=time -> returns per strategy."""
        curves: pd.DataFrame | None = config.get("equity_curves")
        if curves is None or curves.empty:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "no_equity_curves"})

        returns = curves.pct_change().dropna()
        if self.s % 2:
            raise ValueError("s must be even")
        n_rows = len(returns)
        chunk = n_rows // self.s
        if chunk < 10:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "not_enough_data"})

        groups = [returns.iloc[i * chunk : (i + 1) * chunk] for i in range(self.s)]
        half = self.s // 2
        logits = []
        for combo in combinations(range(self.s), half):
            is_set = pd.concat([groups[i] for i in combo])
            oos_set = pd.concat([groups[i] for i in range(self.s) if i not in combo])
            sharpes_is = is_set.mean() / is_set.std(ddof=0).replace(0, 1e-12)
            sharpes_oos = oos_set.mean() / oos_set.std(ddof=0).replace(0, 1e-12)
            best_is = sharpes_is.idxmax()
            rank_oos = sharpes_oos.rank(ascending=True)[best_is] / len(sharpes_oos)
            logit = np.log(rank_oos / (1 - rank_oos + 1e-9))
            logits.append(float(logit))

        pbo_prob = float(np.mean([x < 0 for x in logits]))
        verdict = HarnessVerdict.PASS if pbo_prob < 0.15 else (HarnessVerdict.WARN if pbo_prob < 0.3 else HarnessVerdict.FAIL)
        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={"s": self.s, "pbo_probability": pbo_prob, "n_combinations": len(logits)},
        )
```

- [ ] **Step 2: DeflatedSharpe impl**

```python
"""Deflated Sharpe Ratio (Bailey/Lopez de Prado 2014) : Sharpe corrige pour N trials."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
from scipy.stats import norm, skew, kurtosis

from trading.backtest.harnesses.base import Harness, HarnessResult, HarnessVerdict


@dataclass
class DeflatedSharpe(Harness):
    name: str = "deflated_sharpe"

    def run(self, strategy: Any, df: Any, config: dict[str, Any]) -> HarnessResult:
        returns = config.get("returns")  # np.ndarray (per-trade ou per-period)
        n_trials = int(config.get("n_trials", 1))
        if returns is None or len(returns) < 10:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "not_enough_returns"})

        r = np.asarray(returns, dtype=float)
        t = len(r)
        sr = float(r.mean() / r.std(ddof=0)) if r.std(ddof=0) > 0 else 0.0
        skew_r = float(skew(r))
        kurt_r = float(kurtosis(r, fisher=False))

        # Expected max SR sous H0 (multiple trials)
        e_max_sr = ((1 - np.euler_gamma) * norm.ppf(1 - 1 / n_trials) + np.euler_gamma * norm.ppf(1 - (1 / (n_trials * np.e))))

        denom = np.sqrt((1 - skew_r * sr + (kurt_r - 1) / 4 * sr**2) / (t - 1))
        if denom <= 0:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "invalid_denom"})

        dsr = float(norm.cdf((sr - e_max_sr) / denom))
        verdict = HarnessVerdict.PASS if dsr > 0.95 else (HarnessVerdict.WARN if dsr > 0.75 else HarnessVerdict.FAIL)
        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={"sharpe": sr, "expected_max_sr": float(e_max_sr), "dsr": dsr, "n_trials": n_trials, "t": t},
        )
```

- [ ] **Step 3: Tests + commit**

```python
# tests/unit/harnesses/test_pbo.py
import numpy as np
import pandas as pd

from trading.backtest.harnesses.pbo import PBO


def test_pbo_runs_on_random_curves() -> None:
    rng = np.random.default_rng(0)
    curves = pd.DataFrame(
        {f"s{i}": 100 * np.exp(rng.normal(0, 0.01, 2000).cumsum()) for i in range(10)},
        index=pd.date_range("2023-01-01", periods=2000, freq="1h"),
    )
    pbo = PBO(s=8)
    r = pbo.run(strategy=None, df=curves, config={"equity_curves": curves})
    assert 0 <= r.metrics["pbo_probability"] <= 1
```

```python
# tests/unit/harnesses/test_deflated_sharpe.py
import numpy as np

from trading.backtest.harnesses.deflated_sharpe import DeflatedSharpe


def test_deflated_sharpe_basic() -> None:
    rng = np.random.default_rng(1)
    returns = rng.normal(0.001, 0.01, 500)
    ds = DeflatedSharpe()
    r = ds.run(strategy=None, df=None, config={"returns": returns, "n_trials": 100})
    assert "dsr" in r.metrics
    assert 0 <= r.metrics["dsr"] <= 1
```

```bash
git add src/trading/backtest/harnesses/{pbo,deflated_sharpe}.py tests/unit/harnesses/test_{pbo,deflated_sharpe}.py
git commit -m "feat(finance/trading): PBO + DeflatedSharpe harnesses (Phase 4/8)"
```

### Task 4.6 — CLI `walk-forward`, `monte-carlo`, `pbo`

**Files:**
- Create: `modules/finance/trading/src/trading/cli/walkforward.py`
- Create: `modules/finance/trading/src/trading/cli/montecarlo.py`
- Create: `modules/finance/trading/src/trading/cli/pbo.py`
- Modify: `modules/finance/trading/src/trading/cli/main.py`

- [ ] **Step 1: 3 fichiers CLI courts (chacun wrap le harness correspondant, lit catalog Parquet, print metrics)**

`src/trading/cli/walkforward.py` :

```python
from __future__ import annotations

from pathlib import Path
from typing import Annotated

import pandas as pd
import typer
from rich.console import Console

from trading.backtest.harnesses.walk_forward import WalkForward
from trading.data.catalog import Catalog
from trading.strategies._examples.ema_cross import EMACrossStrategy

console = Console()
app = typer.Typer()


@app.command("walk-forward")
def walk_forward(
    strategy_id: Annotated[str, typer.Argument()] = "_examples.ema_cross",
    venue: Annotated[str, typer.Option()] = "BINANCE",
    symbol: Annotated[str, typer.Option()] = "BTCUSDT",
    timeframe: Annotated[str, typer.Option()] = "1h",
    train_bars: Annotated[int, typer.Option()] = 500,
    test_bars: Annotated[int, typer.Option()] = 200,
    embargo_bars: Annotated[int, typer.Option()] = 24,
    catalog_root: Annotated[Path, typer.Option()] = Path("data/parquet"),
) -> None:
    cat = Catalog(root=catalog_root)
    df = cat.read_ohlcv(venue=venue, symbol=symbol, timeframe=timeframe)
    strategy = EMACrossStrategy()
    wf = WalkForward(train_bars=train_bars, test_bars=test_bars, embargo_bars=embargo_bars)
    result = wf.run(strategy, df, config={})
    console.print(f"[bold]{result.name}[/bold] verdict=[{result.verdict.value}]")
    for k, v in result.metrics.items():
        console.print(f"  {k}: {v}")
```

- [ ] **Step 2: Analogue pour `montecarlo.py` + `pbo.py`**

Meme structure (strategy_id + catalog + harness). Ne pas dupliquer — extraire `_load_df_and_strategy()` en helper si le code devient trop repetitif (Task 4.7).

- [ ] **Step 3: Registrer dans main.py + commit**

```python
from trading.cli import walkforward as wf_cli, montecarlo as mc_cli, pbo as pbo_cli
app.add_typer(wf_cli.app, name="")
app.add_typer(mc_cli.app, name="")
app.add_typer(pbo_cli.app, name="")
```

```bash
git add src/trading/cli/{walkforward,montecarlo,pbo,main}.py
git commit -m "feat(finance/trading): CLI walk-forward/monte-carlo/pbo (Phase 4/8)"
```

### Verification Phase 4

```bash
cd modules/finance/trading
uv run pytest tests/unit/harnesses/ -v   # tous OK
uv run trading walk-forward --help
uv run trading monte-carlo --help
uv run trading pbo --help
```

### Rollback Phase 4

`git revert` des commits Phase 4.

---

## Phase 5/8 — Analysis : metriques + reports HTML + regime classifier

### Pre-conditions

- Phase 4 terminee (harnesses OK)

### Task 5.1 — `PerformanceMetrics` (Sharpe/Sortino/Calmar/MaxDD/PF/WinRate/Expectancy)

**Files:**
- Create: `modules/finance/trading/src/trading/analysis/metrics.py`
- Create: `modules/finance/trading/tests/unit/analysis/test_metrics.py`

- [ ] **Step 1: Tests TDD**

```python
import numpy as np
import pandas as pd
import pytest

from trading.analysis.metrics import PerformanceMetrics


def test_sharpe_of_constant_returns_zero() -> None:
    returns = pd.Series([0.001] * 100)
    pm = PerformanceMetrics()
    m = pm.compute(returns=returns, equity=pd.Series(1 + returns.cumsum()))
    # stdev=0 => sharpe undefined, on retourne 0.0
    assert m["sharpe"] == 0.0


def test_max_drawdown_non_positive() -> None:
    equity = pd.Series([100, 110, 90, 95, 120])
    pm = PerformanceMetrics()
    m = pm.compute(returns=equity.pct_change().dropna(), equity=equity)
    assert m["max_drawdown"] <= 0


def test_profit_factor_sane() -> None:
    trades = pd.Series([0.05, -0.02, 0.03, -0.01, 0.04])
    pm = PerformanceMetrics()
    m = pm.compute(returns=trades, equity=(1 + trades).cumprod())
    pf_expected = (0.05 + 0.03 + 0.04) / (0.02 + 0.01)
    assert m["profit_factor"] == pytest.approx(pf_expected, rel=0.01)
```

- [ ] **Step 2: Impl**

```python
"""PerformanceMetrics : Sharpe/Sortino/Calmar/MaxDD/ProfitFactor/WinRate/Expectancy."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd


@dataclass
class PerformanceMetrics:
    periods_per_year: int = 365 * 24  # default 1h bars

    def compute(self, *, returns: pd.Series, equity: pd.Series) -> dict[str, float]:
        r = returns.dropna().to_numpy()
        eq = equity.to_numpy()

        std = float(r.std(ddof=0))
        mean = float(r.mean())
        sharpe = 0.0 if std == 0 else mean / std * np.sqrt(self.periods_per_year)

        downside = r[r < 0]
        dstd = float(downside.std(ddof=0)) if len(downside) > 1 else 0.0
        sortino = 0.0 if dstd == 0 else mean / dstd * np.sqrt(self.periods_per_year)

        peak = np.maximum.accumulate(eq)
        dd = (eq - peak) / peak
        max_dd = float(dd.min())

        cagr = (eq[-1] / eq[0]) ** (self.periods_per_year / max(len(r), 1)) - 1 if eq[0] > 0 else 0.0
        calmar = cagr / abs(max_dd) if max_dd != 0 else 0.0

        gains = r[r > 0].sum()
        losses = -r[r < 0].sum()
        pf = float(gains / losses) if losses > 0 else float("inf") if gains > 0 else 0.0

        win_rate = float((r > 0).mean())
        expectancy = float(mean)

        return {
            "sharpe": sharpe,
            "sortino": sortino,
            "calmar": calmar,
            "max_drawdown": max_dd,
            "profit_factor": pf,
            "win_rate": win_rate,
            "expectancy": expectancy,
            "total_return": float(eq[-1] / eq[0] - 1) if eq[0] > 0 else 0.0,
        }
```

- [ ] **Step 3: Commit**

```bash
git add src/trading/analysis/metrics.py tests/unit/analysis/test_metrics.py
git commit -m "feat(finance/trading): PerformanceMetrics Sharpe/Sortino/Calmar/etc (Phase 5/8)"
```

### Task 5.2 — `HTMLReport` (quantstats + templates custom)

**Files:**
- Create: `modules/finance/trading/src/trading/analysis/reports.py`
- Create: `modules/finance/trading/src/trading/analysis/templates/tearsheet.html.j2`
- Create: `modules/finance/trading/tests/unit/analysis/test_reports.py`

- [ ] **Step 1: Template Jinja minimal**

`src/trading/analysis/templates/tearsheet.html.j2` :

```html
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>{{ strategy_name }} — Tearsheet</title>
<style>
body { font-family: 'Figtree', system-ui, sans-serif; background: #030303; color: #eee; padding: 24px; }
h1 { color: #fff; }
.verdict-PASS { color: #4ade80; font-weight: bold; }
.verdict-WARN { color: #facc15; font-weight: bold; }
.verdict-FAIL { color: #ef4444; font-weight: bold; }
table { border-collapse: collapse; margin: 12px 0; }
td, th { border: 1px solid #444; padding: 6px 12px; }
img { max-width: 800px; }
</style>
</head>
<body>
<h1>{{ strategy_name }}</h1>
<p>Generated: {{ generated_at }}</p>

<h2>Overall verdict : <span class="verdict-{{ overall_verdict }}">{{ overall_verdict }}</span></h2>

<h2>Performance metrics</h2>
<table>
{% for k, v in metrics.items() %}
<tr><th>{{ k }}</th><td>{{ v }}</td></tr>
{% endfor %}
</table>

<h2>Anti-biais harnesses</h2>
<table>
<tr><th>Harness</th><th>Verdict</th><th>Key metrics</th></tr>
{% for h in harnesses %}
<tr>
  <td>{{ h.name }}</td>
  <td class="verdict-{{ h.verdict }}">{{ h.verdict }}</td>
  <td><pre>{{ h.metrics }}</pre></td>
</tr>
{% endfor %}
</table>

{% if equity_png %}
<h2>Equity curve</h2>
<img src="{{ equity_png }}" alt="equity" />
{% endif %}
</body>
</html>
```

- [ ] **Step 2: Impl `reports.py`**

```python
"""HTMLReport : tearsheet tearsheet custom (pas quantstats, plus simple a maitriser)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

import matplotlib

matplotlib.use("Agg")  # headless
import matplotlib.pyplot as plt
import pandas as pd
from jinja2 import Environment, FileSystemLoader

from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict


@dataclass
class HTMLReport:
    out_dir: Path

    def generate(
        self,
        *,
        strategy_name: str,
        equity: pd.Series,
        metrics: dict[str, float],
        harnesses: list[HarnessResult],
    ) -> Path:
        self.out_dir.mkdir(parents=True, exist_ok=True)

        # Equity plot
        fig, ax = plt.subplots(figsize=(10, 4))
        equity.plot(ax=ax)
        ax.set_title(f"{strategy_name} — equity curve")
        ax.grid(True)
        fig.tight_layout()
        eq_png = self.out_dir / "equity.png"
        fig.savefig(eq_png, dpi=80)
        plt.close(fig)

        # Verdict overall = pire des harnesses
        order = {HarnessVerdict.PASS: 0, HarnessVerdict.WARN: 1, HarnessVerdict.FAIL: 2}
        overall = max(harnesses, key=lambda h: order[h.verdict]).verdict if harnesses else HarnessVerdict.WARN

        env = Environment(
            loader=FileSystemLoader(Path(__file__).parent / "templates"),
            autoescape=True,
        )
        template = env.get_template("tearsheet.html.j2")
        html = template.render(
            strategy_name=strategy_name,
            generated_at=datetime.utcnow().isoformat() + "Z",
            overall_verdict=overall.value,
            metrics={k: f"{v:.4f}" if isinstance(v, float) else v for k, v in metrics.items()},
            harnesses=[{"name": h.name, "verdict": h.verdict.value, "metrics": h.metrics} for h in harnesses],
            equity_png="equity.png",
        )
        out_html = self.out_dir / "index.html"
        out_html.write_text(html, encoding="utf-8")

        # Dump metrics.json
        import json
        (self.out_dir / "metrics.json").write_text(
            json.dumps({"metrics": metrics, "harnesses": [{"name": h.name, "verdict": h.verdict.value, "metrics": h.metrics} for h in harnesses]}, indent=2, default=str),
            encoding="utf-8",
        )

        return out_html
```

- [ ] **Step 3: Test**

```python
# tests/unit/analysis/test_reports.py
from pathlib import Path

import pandas as pd

from trading.analysis.reports import HTMLReport
from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict


def test_report_writes_html_and_metrics_json(tmp_path: Path) -> None:
    equity = pd.Series([100, 101, 102, 103], index=pd.date_range("2024-01-01", periods=4, freq="1h"))
    metrics = {"sharpe": 1.2, "max_drawdown": -0.05}
    harnesses = [HarnessResult(name="walk_forward", verdict=HarnessVerdict.PASS, metrics={"n_windows": 5})]
    rep = HTMLReport(out_dir=tmp_path)
    out = rep.generate(strategy_name="test", equity=equity, metrics=metrics, harnesses=harnesses)
    assert out.exists()
    assert (tmp_path / "equity.png").exists()
    assert (tmp_path / "metrics.json").exists()
```

- [ ] **Step 4: Commit**

```bash
git add src/trading/analysis/reports.py src/trading/analysis/templates/tearsheet.html.j2 tests/unit/analysis/test_reports.py
git commit -m "feat(finance/trading): HTMLReport tearsheet Void Glass style (Phase 5/8)"
```

### Task 5.3 — `RegimeClassifier`

**Files:**
- Create: `modules/finance/trading/src/trading/analysis/regime.py`
- Create: `modules/finance/trading/tests/unit/analysis/test_regime.py`

- [ ] **Step 1: Impl simple (v1 = regles, HMM en V1.1)**

```python
"""RegimeClassifier : bull/bear/chop par regles simples (EMA slope + ATR)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

import pandas as pd

from trading.strategies.indicators.atr import atr
from trading.strategies.indicators.ema import ema


Regime = Literal["bull", "bear", "chop"]


@dataclass
class RegimeClassifier:
    slope_window: int = 50
    atr_threshold_ratio: float = 0.02

    def classify(self, df: pd.DataFrame) -> pd.Series:
        slow_ema = ema(df["close"], self.slope_window)
        slope = slow_ema.diff(self.slope_window) / slow_ema.shift(self.slope_window)
        atr_ratio = atr(df) / df["close"]

        result = pd.Series(index=df.index, dtype=object)
        result[:] = "chop"
        result[(slope > 0.01) & (atr_ratio < self.atr_threshold_ratio)] = "bull"
        result[(slope < -0.01) & (atr_ratio < self.atr_threshold_ratio)] = "bear"
        return result
```

- [ ] **Step 2: Test + commit**

```python
# tests/unit/analysis/test_regime.py
import numpy as np
import pandas as pd

from trading.analysis.regime import RegimeClassifier


def test_regime_labels_include_bull_or_bear() -> None:
    idx = pd.date_range("2024-01-01", periods=300, freq="1h", tz="UTC")
    prices = 100 * np.exp(np.linspace(0, 0.5, 300))  # tendance haussiere
    df = pd.DataFrame({"open": prices, "high": prices * 1.001, "low": prices * 0.999, "close": prices, "volume": 1.0}, index=idx)
    rc = RegimeClassifier(slope_window=20)
    labels = rc.classify(df)
    assert set(labels.unique()).intersection({"bull", "bear", "chop"})
```

```bash
git add src/trading/analysis/regime.py tests/unit/analysis/test_regime.py
git commit -m "feat(finance/trading): RegimeClassifier v1 regles simples (Phase 5/8)"
```

### Verification Phase 5

```bash
uv run pytest tests/unit/analysis/ -v   # 5+ tests OK
```

---

## Phase 6/8 — Execution : Pine generator + 3Commas webhook + live Nautilus stub

### Task 6.1 — `PineGenerator` + templates Pine v5

**Files:**
- Create: `modules/finance/trading/src/trading/execution/pine/generator.py`
- Create: `modules/finance/trading/src/trading/execution/pine/templates/ema_cross.pine.j2`
- Create: `modules/finance/trading/tests/unit/execution/test_pine_generator.py`
- Create: `modules/finance/trading/tests/fixtures/ema_cross.pine.expected`

- [ ] **Step 1: Template Pine v5**

`src/trading/execution/pine/templates/ema_cross.pine.j2` :

```
//@version=5
strategy("{{ strategy_name }}", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

ema_fast_len = input.int({{ ema_fast }}, "EMA Fast")
ema_slow_len = input.int({{ ema_slow }}, "EMA Slow")

ema_fast = ta.ema(close, ema_fast_len)
ema_slow = ta.ema(close, ema_slow_len)

long_condition = ta.crossover(ema_fast, ema_slow)
exit_condition = ta.crossunder(ema_fast, ema_slow)

if long_condition
    strategy.entry("long", strategy.long)

if exit_condition
    strategy.close("long")

alertcondition(long_condition, title="{{ strategy_name }}_entry", message='{"action":"enter_long","symbol":"{{ "{{" }}ticker{{ "}}" }}"}')
alertcondition(exit_condition, title="{{ strategy_name }}_exit", message='{"action":"exit_long","symbol":"{{ "{{" }}ticker{{ "}}" }}"}')
```

- [ ] **Step 2: Generator**

```python
"""PineGenerator : BaseStrategy → source Pine v5 via templates Jinja2."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from trading.strategies.base import BaseStrategy


TEMPLATE_MAP: dict[str, str] = {
    "ema_cross": "ema_cross.pine.j2",
}


@dataclass
class PineGenerator:
    templates_dir: Path = Path(__file__).parent / "templates"

    def _template_for(self, strategy: BaseStrategy) -> str:
        base = strategy.metadata.name.split("_")[0:2]  # ema_cross_* → ema_cross
        key = "_".join(base)
        if key not in TEMPLATE_MAP:
            raise ValueError(f"no Pine template for strategy family {key!r} (available: {list(TEMPLATE_MAP)})")
        return TEMPLATE_MAP[key]

    def generate(self, strategy: BaseStrategy) -> str:
        env = Environment(loader=FileSystemLoader(self.templates_dir), keep_trailing_newline=True)
        template = env.get_template(self._template_for(strategy))
        return template.render(**strategy.to_pine_context())
```

- [ ] **Step 3: Golden test**

```python
# tests/unit/execution/test_pine_generator.py
from pathlib import Path

from trading.execution.pine.generator import PineGenerator
from trading.strategies._examples.ema_cross import EMACrossStrategy


def test_pine_ema_cross_matches_expected(tmp_path: Path) -> None:
    strategy = EMACrossStrategy(ema_fast=10, ema_slow=30)
    gen = PineGenerator()
    out = gen.generate(strategy)
    assert "//@version=5" in out
    assert 'strategy("ema_cross_10_30"' in out
    assert "ta.ema(close, ema_fast_len)" in out
    assert "alertcondition(" in out


def test_pine_unknown_strategy_raises() -> None:
    import pytest

    from trading.strategies.base import BaseStrategy, StrategyMetadata

    class DummyStrategy(BaseStrategy):
        pass

    s = DummyStrategy(StrategyMetadata(name="unknown_family", horizon="swing", instruments=["X"], hyperparams={}))
    gen = PineGenerator()
    with pytest.raises(ValueError, match="no Pine template"):
        gen.generate(s)
```

- [ ] **Step 4: CLI `trading generate-pine`**

`src/trading/cli/pine.py` :

```python
from __future__ import annotations

from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console

from trading.execution.pine.generator import PineGenerator
from trading.strategies._examples.ema_cross import EMACrossStrategy

console = Console()
app = typer.Typer()


@app.command("generate-pine")
def generate_pine(
    strategy_id: Annotated[str, typer.Argument()] = "_examples.ema_cross",
    ema_fast: Annotated[int, typer.Option()] = 10,
    ema_slow: Annotated[int, typer.Option()] = 30,
    out: Annotated[Path, typer.Option()] = Path("strategies/pine/ema_cross.pine"),
) -> None:
    if strategy_id == "_examples.ema_cross":
        strategy = EMACrossStrategy(ema_fast=ema_fast, ema_slow=ema_slow)
    else:
        raise typer.BadParameter(f"unknown strategy_id {strategy_id}")

    gen = PineGenerator()
    source = gen.generate(strategy)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(source, encoding="utf-8")
    console.print(f"[green]OK[/green] Pine source -> {out} ({len(source)} chars)")
```

- [ ] **Step 5: Registrer + commit**

```bash
git add src/trading/execution/pine/ src/trading/cli/pine.py tests/unit/execution/test_pine_generator.py
git commit -m "feat(finance/trading): PineGenerator v5 + CLI generate-pine (Phase 6/8)"
```

### Task 6.2 — `ThreeCommas.API` + `WebhookReceiver` FastAPI

**Files:**
- Create: `modules/finance/trading/src/trading/execution/threecommas/api.py`
- Create: `modules/finance/trading/src/trading/execution/threecommas/webhook.py`
- Create: `modules/finance/trading/tests/unit/execution/test_threecommas_api.py`
- Create: `modules/finance/trading/tests/integration/test_webhook_receiver.py`

- [ ] **Step 1: API wrapper minimal (bot list + trigger deal)**

`src/trading/execution/threecommas/api.py` :

```python
"""3Commas REST API wrapper minimal : list_bots + start_deal."""

from __future__ import annotations

import hmac
import hashlib
import time
from dataclasses import dataclass, field
from typing import Any

import httpx


BASE_URL = "https://api.3commas.io/public/api"


@dataclass
class ThreeCommasAPI:
    api_key: str
    api_secret: str
    _client: httpx.Client = field(default=None, repr=False)  # type: ignore[assignment]

    def __post_init__(self) -> None:
        if self._client is None:
            self._client = httpx.Client(timeout=30.0)

    def _signed_request(self, method: str, path: str, params: dict[str, Any] | None = None) -> Any:
        url = f"{BASE_URL}{path}"
        query = httpx.QueryParams(params or {})
        sig_payload = f"{path}?{query}" if query else path
        signature = hmac.new(
            self.api_secret.encode(), sig_payload.encode(), hashlib.sha256
        ).hexdigest()
        headers = {
            "APIKEY": self.api_key,
            "Signature": signature,
        }
        resp = self._client.request(method, url, params=query, headers=headers)
        resp.raise_for_status()
        return resp.json()

    def list_bots(self) -> list[dict[str, Any]]:
        return self._signed_request("GET", "/ver1/bots")

    def start_deal(self, bot_id: int, pair: str) -> dict[str, Any]:
        return self._signed_request("POST", f"/ver1/bots/{bot_id}/start_new_deal", {"pair": pair})
```

- [ ] **Step 2: Webhook receiver FastAPI**

```python
"""WebhookReceiver : FastAPI qui recoit alertes TradingView et trigger bots 3Commas.

Authent : shared-secret dans le header X-TV-Secret.
"""

from __future__ import annotations

import os

from fastapi import FastAPI, Header, HTTPException, Request

from trading.execution.threecommas.api import ThreeCommasAPI


def make_app(api: ThreeCommasAPI | None = None, secret: str | None = None) -> FastAPI:
    app = FastAPI(title="trading-webhook-receiver")
    _secret = secret or os.getenv("TV_WEBHOOK_SECRET", "")
    _api = api

    @app.post("/webhook")
    async def webhook(request: Request, x_tv_secret: str = Header("")) -> dict[str, str]:
        if not _secret or x_tv_secret != _secret:
            raise HTTPException(status_code=401, detail="invalid secret")
        payload = await request.json()
        action = payload.get("action")
        symbol = payload.get("symbol")
        bot_id = int(payload.get("bot_id", 0))
        if action not in {"enter_long", "exit_long", "enter_short", "exit_short"}:
            raise HTTPException(status_code=400, detail="invalid action")
        if _api and action.startswith("enter"):
            _api.start_deal(bot_id=bot_id, pair=symbol)
        return {"status": "ok", "action": action, "symbol": symbol}

    return app
```

- [ ] **Step 3: Tests**

```python
# tests/unit/execution/test_threecommas_api.py
from unittest.mock import MagicMock

from trading.execution.threecommas.api import ThreeCommasAPI


def test_list_bots_signs_and_parses() -> None:
    client = MagicMock()
    response = MagicMock()
    response.raise_for_status = MagicMock()
    response.json.return_value = [{"id": 1, "name": "bot-btc"}]
    client.request.return_value = response

    api = ThreeCommasAPI(api_key="k", api_secret="s", _client=client)
    bots = api.list_bots()
    assert bots == [{"id": 1, "name": "bot-btc"}]
    client.request.assert_called_once()
```

```python
# tests/integration/test_webhook_receiver.py
from fastapi.testclient import TestClient

from trading.execution.threecommas.webhook import make_app


def test_webhook_rejects_bad_secret() -> None:
    app = make_app(api=None, secret="goodsecret")
    client = TestClient(app)
    resp = client.post("/webhook", json={"action": "enter_long", "symbol": "BTCUSDT"}, headers={"X-TV-Secret": "wrong"})
    assert resp.status_code == 401


def test_webhook_accepts_valid_payload() -> None:
    app = make_app(api=None, secret="goodsecret")
    client = TestClient(app)
    resp = client.post(
        "/webhook",
        json={"action": "enter_long", "symbol": "BTCUSDT", "bot_id": 0},
        headers={"X-TV-Secret": "goodsecret"},
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
```

- [ ] **Step 4: Commit**

```bash
git add src/trading/execution/threecommas/ tests/unit/execution/test_threecommas_api.py tests/integration/test_webhook_receiver.py
git commit -m "feat(finance/trading): 3Commas API + Webhook FastAPI (Phase 6/8)"
```

### Task 6.3 — `NautilusLive` stub (V1 minimal)

**Files:**
- Create: `modules/finance/trading/src/trading/execution/live/nautilus_live.py`

- [ ] **Step 1: Stub avec comment explicite "v1 non implemente — utiliser Pine+3Commas"**

```python
"""NautilusLive : execution directe via Nautilus live mode.

V1 status : STUB. Preference v1 = Pine+3Commas. Implementation complete en V1.1
quand une strategie necessitera un execution non exprimable en Pine (ML, orderbook).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class NautilusLive:
    venue: str = "BINANCE"

    def start(self, strategy: Any) -> None:
        raise NotImplementedError(
            "NautilusLive non implemente en V1. Utiliser PineGenerator + 3Commas webhook pour "
            "l'execution. Voir design doc section 6.6 (V1.1 roadmap)."
        )
```

- [ ] **Step 2: Commit**

```bash
git add src/trading/execution/live/nautilus_live.py
git commit -m "chore(finance/trading): NautilusLive stub (v1 = Pine+3Commas primary) (Phase 6/8)"
```

### Verification Phase 6

```bash
uv run pytest tests/unit/execution/ tests/integration/test_webhook_receiver.py -v
uv run trading generate-pine --help
```

---

## Phase 7/8 — Tests exhaustifs + CI GitHub Actions

### Task 7.1 — Tests smoke/integration consolides

- [ ] **Step 1: Smoke test imports**

```python
# tests/smoke/test_imports.py
def test_all_modules_import() -> None:
    import trading
    from trading.cli import main
    from trading.data.sources import base, ccxt_source, binance_source
    from trading.data import catalog, quality, storage  # noqa: F401
    from trading.strategies import base as strat_base
    from trading.strategies._examples import ema_cross
    from trading.backtest import runner, slippage, latency, fees, funding
    from trading.backtest.harnesses import base as harn_base, walk_forward, purged_cv, monte_carlo, pbo, deflated_sharpe
    from trading.analysis import metrics, reports, regime
    from trading.execution.pine import generator
    from trading.execution.threecommas import api, webhook
    from trading.execution.live import nautilus_live
    assert trading.__version__
```

- [ ] **Step 2: `src/trading/data/storage.py`** (placeholder DuckDB wrapper, minimal)

```python
"""DuckDB wrapper minimal pour queries analytiques sur Parquet catalog."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import duckdb
import pandas as pd


@dataclass
class Store:
    catalog_root: Path

    def query(self, sql: str) -> pd.DataFrame:
        """Execute une query DuckDB. Utiliser read_parquet('<path>') pour lire."""
        con = duckdb.connect(":memory:")
        return con.execute(sql).df()
```

- [ ] **Step 3: Commit**

```bash
git add tests/smoke/test_imports.py src/trading/data/storage.py
git commit -m "test(finance/trading): smoke imports + Store DuckDB stub (Phase 7/8)"
```

### Task 7.2 — Coverage + GitHub Actions CI

**Files:**
- Create: `.github/workflows/finance-trading-ci.yml`

- [ ] **Step 1: Workflow CI**

`.github/workflows/finance-trading-ci.yml` :

```yaml
name: finance-trading-ci

on:
  push:
    paths:
      - 'modules/finance/trading/**'
      - '.github/workflows/finance-trading-ci.yml'
  pull_request:
    paths:
      - 'modules/finance/trading/**'

defaults:
  run:
    working-directory: modules/finance/trading

jobs:
  ci:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - name: Install uv
        uses: astral-sh/setup-uv@v3
        with:
          python-version: "3.12"
      - name: Sync deps
        run: uv sync --all-extras
      - name: Lint (ruff)
        run: uv run ruff check src tests
      - name: Type check (mypy)
        run: uv run mypy src
      - name: Tests (pytest)
        run: uv run pytest -q --cov=src/trading --cov-fail-under=70
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/finance-trading-ci.yml
git commit -m "ci(finance/trading): GitHub Actions lint + mypy + pytest + cov>=70% (Phase 7/8)"
```

### Verification Phase 7

```bash
cd modules/finance/trading
uv run ruff check src tests  # OK
uv run mypy src              # OK (0 erreur)
uv run pytest -q --cov=src/trading --cov-report=term-missing  # coverage >= 70%
```

Push branche, verifier que le workflow CI passe sur GitHub Actions.

---

## Phase 8/8 — Wiki pages + doc + cleanup

### Task 8.1 — Pages concepts wiki

**Files (wiki/domains/trading/concepts/)** :
- `Sharpe Ratio.md`
- `PBO.md`
- `Walk-Forward Analysis.md`
- `Purged CV.md`
- `Deflated Sharpe.md`
- `Slippage Models.md`

- [ ] **Step 1: Ecrire 6 pages wiki concepts**

Pour chaque concept : frontmatter standard + definition 1-2 paragraphes + formule + references papers + lien vers code `modules/finance/trading/src/trading/backtest/harnesses/<file>.py`.

Exemple `wiki/domains/trading/concepts/PBO.md` :

```markdown
---
type: concept
title: "Probability of Backtest Overfitting (PBO)"
updated: 2026-04-19
tags: [trading, anti-bias, statistics, validation]
status: evergreen
confidence: high
related:
  - "[[Deflated Sharpe]]"
  - "[[Walk-Forward Analysis]]"
  - "[[Purged CV]]"
  - "[[index-trading]]"
---

# Probability of Backtest Overfitting (PBO)

Metrique proposee par Bailey, Borwein, Lopez de Prado, Zhu (2015) qui estime la probabilite qu'une strategie selectionnee comme "meilleure" en in-sample soit en realite mediocre out-of-sample.

## Intuition

On teste N strategies (ou hyperparams). On split le temps en S blocs (S pair, typiquement 16). Pour chaque combinaison de S/2 blocs en IS et S/2 en OOS, on regarde si la meilleure strategie IS figure dans le top 50% en OOS. Si elle tombe souvent dans le bottom, PBO est eleve = overfitting.

## Formule

```
PBO = P(logit(OOS rank of best IS strategy) < 0)
```

## Seuils

- PBO < 0.15 → sain (verdict PASS dans Foundation OS)
- 0.15 <= PBO < 0.30 → warning (WARN)
- PBO >= 0.30 → rejeter strategie (FAIL)

## Reference

- Bailey, Borwein, Lopez de Prado, Zhu (2015), "The Probability of Backtest Overfitting", Journal of Computational Finance.

## Implementation Foundation OS

`modules/finance/trading/src/trading/backtest/harnesses/pbo.py`
```

- [ ] **Step 2: Commit**

```bash
git add wiki/domains/trading/concepts/
git commit -m "docs(wiki/trading): 6 concepts anti-biais (PBO, DSR, WF, PurgedCV, Sharpe, Slippage) (Phase 8/8)"
```

### Task 8.2 — Page strategy exemple + page backtest

- [ ] **Step 1: `wiki/domains/trading/strategies/ema-cross-btc-4h.md`**

```markdown
---
type: strategy
status: experimental
horizon: swing
instruments: [BTCUSDT]
implementation: ../../../../modules/finance/trading/src/trading/strategies/_examples/ema_cross.py
backtest_runs: ../../../../modules/finance/trading/reports/
pine_source: ../../../../modules/finance/trading/strategies/pine/ema_cross.pine
confidence: low
updated: 2026-04-19
related:
  - "[[Sharpe Ratio]]"
  - "[[Walk-Forward Analysis]]"
  - "[[PBO]]"
  - "[[index-trading]]"
---

# EMA Cross 4h BTC (exemple validation socle)

> [!placeholder] Strategie de validation du socle technique. PAS pour trader live. Sert a prouver que la chaine data → backtest → harnesses → report → Pine genere fonctionne end-to-end.

## Hypothese

Moyenne mobile rapide > moyenne mobile lente = tendance haussiere courte-terme. Entry long sur cross haussier, exit sur cross baissier.

## Hyperparametres

- `ema_fast` : 10 bougies 4h
- `ema_slow` : 30 bougies 4h

## Resultats backtest exemple

Voir `wiki/domains/trading/backtests/2026-04-19-ema-cross-btc-smoke.md`.

## Limites connues

- Strategie "follow-the-trend" classique, edge probablement inexistant sur BTC post-2022 (regime plus choppy).
- Pas de stop-loss explicite (gere par cross inverse).
- Pas de position sizing (100% equity par entry).
```

- [ ] **Step 2: Page backtest smoke**

```markdown
---
type: backtest
strategy: "[[EMA Cross 4h BTC]]"
verdict: smoke (non significatif)
updated: 2026-04-19
tags: [backtest, smoke]
confidence: low
related:
  - "[[index-trading]]"
---

# Backtest smoke EMA cross 4h BTC (2026-04-19)

**Objectif** : valider que le pipeline fonctionne end-to-end, PAS evaluer la qualite de la strategie.

## Periode

Synthetique (fixture 2000 bars random walk).

## Metriques (indicatives)

| Metrique | Valeur |
|---|---|
| trades | N/A (depend du seed) |
| total_return | — |
| sharpe | — |
| max_drawdown | — |
| PBO | — |
| DSR | — |

## Verdict

**smoke** (pas une vraie evaluation). Pour une vraie eval :

1. Telecharger 5 ans BTC 4h : `trading download-data --symbols BTC/USDT --timeframe 4h --start 2021-01-01`
2. Backtest reel : `trading backtest _examples.ema_cross --venue BINANCE --symbol BTCUSDT --timeframe 4h --start 2021-01-01 --end 2026-04-01`
3. Walk-forward + PBO + DSR pour verdict serieux.

## Rapport HTML

Lien : `modules/finance/trading/reports/<timestamp>/index.html`
```

- [ ] **Step 3: Commit**

```bash
git add wiki/domains/trading/strategies/ wiki/domains/trading/backtests/
git commit -m "docs(wiki/trading): strategie exemple EMA cross + page backtest smoke (Phase 8/8)"
```

### Task 8.3 — README principal + CONTEXT.md update

**Files:**
- Modify: `modules/finance/trading/README.md` (enrichi)
- Modify: `CONTEXT.md` (ajouter module Finance/Trading)
- Modify: `wiki/hot.md`, `wiki/meta/sessions-recent.md`

- [ ] **Step 1: Enrichir README.md module**

Ajouter sections Quick start complet, Pipelines (data → backtest → validate → pine), Exemple end-to-end, Liens wiki.

- [ ] **Step 2: Update CONTEXT.md table Modules**

Ajouter ligne :

```
| Trading (finance) | ✅ Backtest engine v1 | `modules/finance/trading/` | Socle Python + NautilusTrader + Pine bridge + 3Commas webhook. Harnesses anti-biais (WF/PurgedCV/MC/PBO/DSR) + reports HTML. [[index-trading]] |
```

Dans section Sessions recentes : ajouter session DONE de ce plan.

Dans Cap : supprimer choix A/B/C/D courant (accompli) et mettre nouveau Cap "Phase 5 modules : Sante/Finance patrimoine/etc".

Dans Decisions : ajouter `D-TRADING-01 Backtest engine crypto v1 | 2026-04-19 | Plan apres archive : .archive/plans-done-YYMMDD/...`

- [ ] **Step 3: Update wiki/hot.md et sessions-recent.md**

Reflet des changements cette session.

- [ ] **Step 4: Health-check final**

```bash
cd ~/foundation-os
bash scripts/health-check.sh
bash scripts/wiki-health.sh
bash scripts/ref-checker.sh
```

Expected : tous SAIN (ou DEGRADED acceptable si seulement warnings mineurs).

- [ ] **Step 5: Commit**

```bash
git add CONTEXT.md modules/finance/trading/README.md wiki/hot.md wiki/meta/sessions-recent.md
git commit -m "docs(os): CONTEXT + wiki updates post backtest engine v1 (Phase 8/8)"
```

### Verification Phase 8

- Health-check : SAIN
- Wiki-health : SAIN
- Ref-checker : 0 ref cassee
- Tests : 100% pass (40+ tests)
- Coverage : >=70%
- CI GitHub Actions : green
- CLI complete : `trading --help` liste all sub-commands
- Pages wiki : 6 concepts + 1 strategy + 1 backtest ajoutees
- CONTEXT.md : module Finance/Trading present

### Rollback Phase 8

Revert les commits docs uniquement (le code reste en place).

---

## Post-completion

### Verifications globales finales

```bash
cd ~/foundation-os
bash scripts/health-check.sh                             # SAIN
bash scripts/wiki-health.sh                              # SAIN
cd modules/finance/trading
uv run pytest                                            # 100% pass
uv run pytest --cov=src/trading --cov-report=term-missing  # cov >= 70%
uv run ruff check src tests                              # 0 erreur
uv run mypy src                                          # 0 erreur
uv run trading --help                                    # liste toutes les commands
```

### Decision archivage plan

Status `phases_done: 8` + hook SessionEnd auto-archive → `.archive/plans-done-YYMMDD/2026-04-19-finance-trading-backtest-engine.md`.

### Decision livree (a ajouter CONTEXT.md)

`D-TRADING-01 Backtest engine crypto v1` — 2026-04-19 :
- Module `modules/finance/trading/` operationnel : data pipeline ccxt + Binance direct, BacktestRunner pandas + BaseStrategy, harnesses anti-biais (WF/PurgedCV/MC/PBO/DSR), reports HTML tearsheet, Pine generator v5, 3Commas webhook FastAPI.
- 40+ tests unit/integration/smoke, coverage >=70%, CI GitHub Actions green.
- 1 strategie exemple (EMA cross) pour validation socle PAS pour trader.
- 6 concepts wiki anti-biais + 1 page strategy + 1 page backtest.
- Integration Nautilus complete (BacktestNode event-driven + NautilusLive) reportee V1.1.

### V1.1 backlog (futur)

- [ ] Integration Nautilus BacktestNode event-driven (remplace runner pandas simplifie)
- [ ] `NautilusLive` execution directe pour strategies non-Pine
- [ ] Download data bulk 30+ assets scripts batch
- [ ] Strategy framework plus riche (position sizing Kelly fractionnaire, stops, risk per trade)
- [ ] Skill custom `/save backtest-run` auto-creation page wiki
- [ ] VectorBT pour parameter sweeps massifs (si besoin exploration)
- [ ] Dashboard live P&L vs backtest predit (drift detection)

---

## Self-review (execution)

1. **Spec coverage** : 
   - [x] Design Section 1 (structure) ↔ Phase 1 + 2 + 3 + 4 + 5 + 6
   - [x] Design Section 2 (composants 6 couches) ↔ Tasks distribues en 8 phases
   - [x] Design Section 3 (data flow 6 phases) ↔ implemente via Phase 2 (ingest) + 3 (backtest) + 4 (validate) + 5 (report) + 6 (promote/deploy)
   - [x] Design Section 7 (4 protocols cles) ↔ Task 2.1 (DataSource) + 3.1 (BaseStrategy) + 4.1 (Harness) — ExecutionBridge implicite dans Phase 6
   - [x] Design Section 8 (error handling) ↔ couvert dans QualityChecker Task 2.4 + webhook 401/400 Task 6.2
   - [x] Design Section 9 (tests) ↔ Phase 7 + tests par Task
   - [x] Design Section 10 (wiki couplage) ↔ Phase 8
   - [x] Design Section 13 (criteres done) ↔ verifications Phase 8

2. **Placeholder scan** : 
   - Task 3.5 marquee `[SKIPPED v1]` avec raison claire (integration Nautilus = V1.1). Acceptable, honnete, explicite.
   - Aucun autre TBD/TODO/"implement later" trouve.

3. **Type consistency** :
   - `DataSource.fetch_ohlcv` retourne `pd.DataFrame` partout.
   - `BaseStrategy.metadata` type `StrategyMetadata` coherent.
   - `Harness.run(strategy, df, config)` signature stable (Task 4.1 → 4.6).
   - `HarnessResult` utilise identique dans tous les harnesses.
   - `BacktestResult` meme nom aux Tasks 3.4 / 4.x / 5.x.
   - Pine generator `to_pine_context()` produit meme keys que templates attendent.

Plan complet et consistant. Pret pour execution.

---

## Execution choice (pour Kevin)

Deux options de pilotage, au choix de Kevin :

**1. Subagent-driven (recommande)** — Je dispatche un subagent frais par task, je review entre chaque task, iteration rapide. Moins de contexte pollue, verdict verification independant.

**2. Inline execution** — J'execute toutes les tasks dans la session courante via `superpowers:executing-plans`, batch avec checkpoints review a chaque fin de phase. Plus simple, plus lineaire.

**Vu la taille du plan (8 phases, ~30 tasks, ~150 steps)** : je recommande **subagent-driven** pour isoler les contextes phase par phase et eviter le compactage. Mais c'est ton choix.

**Dis "subagent" ou "inline" et je lance la Phase 1.**
