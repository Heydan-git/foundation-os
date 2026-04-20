"""E2E smoke : EMA cross sur sample synthetic BTC 1h -> BacktestResult non vide."""
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
