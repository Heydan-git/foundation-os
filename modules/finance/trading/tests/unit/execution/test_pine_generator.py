"""Tests PineGenerator : valide output contre template EMA cross + handling unknown strategies."""
import pytest

from trading.execution.pine.generator import PineGenerator
from trading.strategies._examples.ema_cross import EMACrossStrategy


def test_pine_ema_cross_basic_output() -> None:
    strategy = EMACrossStrategy(ema_fast=10, ema_slow=30)
    gen = PineGenerator()
    out = gen.generate(strategy)
    assert "//@version=5" in out
    assert 'strategy("ema_cross_10_30"' in out
    assert "ta.ema(close, ema_fast_len)" in out
    assert "ta.ema(close, ema_slow_len)" in out
    assert "ta.crossover(ema_fast, ema_slow)" in out
    assert "alertcondition(" in out
    # TradingView ticker placeholder must be preserved
    assert "{{ticker}}" in out


def test_pine_unknown_strategy_raises() -> None:
    from trading.strategies.base import BaseStrategy, StrategyMetadata

    meta = StrategyMetadata(
        name="unknown_family_test",
        horizon="swing",
        instruments=["XYZ"],
        hyperparams={},
    )
    strategy = BaseStrategy(metadata=meta)
    gen = PineGenerator()
    with pytest.raises(ValueError, match="no Pine template"):
        gen.generate(strategy)
