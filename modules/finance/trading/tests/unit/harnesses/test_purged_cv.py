"""Tests PurgedCV : K-fold purged + embargoed cross-validation."""
import numpy as np
import pandas as pd

from trading.backtest.harnesses.base import HarnessVerdict
from trading.backtest.harnesses.purged_cv import PurgedCV
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


def test_purged_cv_runs() -> None:
    df = _long_fixture()
    cv = PurgedCV(k=5, embargo_pct=0.01)
    result = cv.run(EMACrossStrategy(5, 20), df, config={})
    assert result.name == "purged_cv"
    assert result.metrics["k"] == 5
    assert result.metrics["n_folds"] >= 1
    assert result.verdict in {HarnessVerdict.PASS, HarnessVerdict.WARN, HarnessVerdict.FAIL}
