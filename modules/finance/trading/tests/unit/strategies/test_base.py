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


def test_base_strategy_to_pine_context_has_keys() -> None:
    meta = StrategyMetadata(
        name="test_strat",
        horizon="position",
        instruments=["BTCUSDT"],
        hyperparams={"lookback": 20},
    )
    strat = BaseStrategy(metadata=meta)
    ctx = strat.to_pine_context()
    assert ctx["strategy_name"] == "test_strat"
    assert ctx["horizon"] == "position"
    assert ctx["lookback"] == 20
