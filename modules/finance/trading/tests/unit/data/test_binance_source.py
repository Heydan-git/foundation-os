"""Tests BinanceSource — mock httpx, valider parsing."""
from datetime import UTC, datetime
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
        start=datetime(2024, 1, 1, tzinfo=UTC),
        end=datetime(2024, 1, 1, 2, tzinfo=UTC),
    )

    assert isinstance(df, pd.DataFrame)
    assert list(df.columns) == ["open", "high", "low", "close", "volume"]
    assert len(df) == 2
    assert df["open"].iloc[0] == pytest.approx(42500.0)
