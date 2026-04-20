"""Tests MonteCarlo : 1000+ runs distribution via trade shuffle."""
import numpy as np
import pandas as pd

from trading.backtest.harnesses.base import HarnessVerdict
from trading.backtest.harnesses.monte_carlo import MonteCarlo
from trading.strategies._examples.ema_cross import EMACrossStrategy


def _long_fixture(n: int = 2000) -> pd.DataFrame:
    idx = pd.date_range("2023-01-01", periods=n, freq="1h", tz="UTC")
    rng = np.random.default_rng(7)
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


def test_monte_carlo_produces_distribution() -> None:
    df = _long_fixture()
    mc = MonteCarlo(n_runs=100, seed=1)
    result = mc.run(EMACrossStrategy(5, 20), df, config={})
    assert result.name == "monte_carlo"
    assert result.metrics["n_runs"] == 100
    assert "pct_runs_positive" in result.metrics
    assert 0 <= result.metrics["pct_runs_positive"] <= 1
    assert result.verdict in {HarnessVerdict.PASS, HarnessVerdict.WARN, HarnessVerdict.FAIL}
