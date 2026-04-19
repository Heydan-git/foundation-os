"""Tests NautilusBridge : transforms + skeleton runner (NOT full Nautilus integration)."""
from datetime import UTC, datetime

import numpy as np
import pandas as pd

from trading.backtest.nautilus_bridge.runner import NautilusBridgeRunner
from trading.backtest.nautilus_bridge.transforms import (
    pandas_to_nautilus_bars,
    signals_to_order_intents,
)
from trading.backtest.nautilus_bridge.types import NautilusBar, OrderIntent
from trading.strategies._examples.ema_cross import EMACrossStrategy


def _sample_ohlcv(n: int = 50) -> pd.DataFrame:
    idx = pd.date_range(datetime(2024, 1, 1, tzinfo=UTC), periods=n, freq="1h")
    rng = np.random.default_rng(42)
    prices = 100 * np.exp(rng.normal(0, 0.01, n).cumsum())
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


def test_pandas_to_nautilus_bars_shape() -> None:
    df = _sample_ohlcv(10)
    bars = pandas_to_nautilus_bars(df, instrument_id="BTCUSDT.BINANCE")
    assert len(bars) == 10
    assert all(isinstance(b, NautilusBar) for b in bars)
    assert bars[0].instrument_id == "BTCUSDT.BINANCE"
    assert bars[0].ts_event == df.index[0].to_pydatetime()
    assert bars[0].close == float(df["close"].iloc[0])


def test_pandas_to_nautilus_bars_monotonic() -> None:
    df = _sample_ohlcv(20)
    bars = pandas_to_nautilus_bars(df, instrument_id="ETHUSDT.BINANCE")
    for i in range(1, len(bars)):
        assert bars[i].ts_event > bars[i - 1].ts_event


def test_signals_to_order_intents_entries_only() -> None:
    # Signal series with 1 entry and 1 exit
    idx = pd.date_range("2024-01-01", periods=5, freq="1h", tz="UTC")
    signals = pd.Series([0, 1, 0, -1, 0], index=idx)
    intents = signals_to_order_intents(
        signals,
        instrument_id="BTCUSDT.BINANCE",
        quantity=1.0,
    )
    assert len(intents) == 2
    assert all(isinstance(i, OrderIntent) for i in intents)
    assert intents[0].side == "BUY"
    assert intents[0].ts == idx[1].to_pydatetime()
    assert intents[1].side == "SELL"
    assert intents[1].ts == idx[3].to_pydatetime()


def test_signals_to_order_intents_skips_zero_signals() -> None:
    idx = pd.date_range("2024-01-01", periods=3, freq="1h", tz="UTC")
    signals = pd.Series([0, 0, 0], index=idx)
    intents = signals_to_order_intents(signals, instrument_id="X", quantity=1.0)
    assert intents == []


def test_bridge_runner_smoke_e2e() -> None:
    df = _sample_ohlcv(200)
    strategy = EMACrossStrategy(ema_fast=5, ema_slow=20)
    runner = NautilusBridgeRunner()
    result = runner.run(strategy, df, instrument_id="BTCUSDT.BINANCE")
    # Shape identical to BacktestResult + nautilus_bridge annotation
    assert result.strategy_name.startswith("ema_cross_")
    assert isinstance(result.trades, pd.DataFrame)
    assert isinstance(result.equity_curve, pd.Series)
    assert result.stats.get("nautilus_bridge") is True, "result must be annotated bridge=True"
    # The actual Nautilus BacktestNode path is NotImplemented in v1
    assert "bars_count" in result.stats
    assert result.stats["bars_count"] == 200


def test_bridge_runner_full_nautilus_path_raises() -> None:
    """The path that would invoke real nautilus_trader.BacktestNode is explicitly NotImplemented in v1."""
    import pytest

    runner = NautilusBridgeRunner()
    with pytest.raises(NotImplementedError, match="V1.2"):
        runner.run_full_nautilus(strategy=None, df=None, config={})
