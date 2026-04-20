"""Tests RegimeClassifier : bull/bear/chop labeling."""
import numpy as np
import pandas as pd

from trading.analysis.regime import RegimeClassifier


def test_regime_labels_include_bull_or_bear_or_chop() -> None:
    idx = pd.date_range("2024-01-01", periods=300, freq="1h", tz="UTC")
    prices = 100 * np.exp(np.linspace(0, 0.5, 300))  # tendance haussiere
    df = pd.DataFrame(
        {"open": prices, "high": prices * 1.001, "low": prices * 0.999, "close": prices, "volume": 1.0},
        index=idx,
    )
    rc = RegimeClassifier(slope_window=20)
    labels = rc.classify(df)
    assert isinstance(labels, pd.Series)
    assert len(labels) == len(df)
    unique = set(labels.dropna().unique())
    assert unique.issubset({"bull", "bear", "chop"})
    # At least one non-chop label expected on a strong uptrend fixture
    assert unique & {"bull", "bear"}
