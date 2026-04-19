"""Tests Catalog : ecriture/lecture Parquet via Nautilus ParquetDataCatalog."""
from datetime import UTC, datetime
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from trading.data.catalog import Catalog


@pytest.fixture
def sample_df() -> pd.DataFrame:
    idx = pd.date_range(datetime(2024, 1, 1, tzinfo=UTC), periods=100, freq="1h")
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


def test_catalog_read_missing_raises(tmp_path: Path) -> None:
    catalog = Catalog(root=tmp_path)
    with pytest.raises(FileNotFoundError):
        catalog.read_ohlcv(venue="BINANCE", symbol="NONEXIST", timeframe="1h")
