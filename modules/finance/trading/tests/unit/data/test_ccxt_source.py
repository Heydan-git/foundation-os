"""Tests CCXTSource — valide parsing + structure DataFrame + gestion erreurs."""
import json
from datetime import UTC, datetime
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
        start=datetime(2024, 1, 1, tzinfo=UTC),
        end=datetime(2024, 1, 2, tzinfo=UTC),
    )

    assert isinstance(df, pd.DataFrame)
    assert list(df.columns) == ["open", "high", "low", "close", "volume"]
    assert len(df) == 10
    assert df.index.dtype.kind == "M"
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
