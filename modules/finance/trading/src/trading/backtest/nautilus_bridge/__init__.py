"""Nautilus Bridge — skeleton pour future migration V1.2 vers NautilusTrader event-driven.

V1 status : SKELETON. Transforms pandas <-> Nautilus types testees, runner delegue
au BacktestRunner pandas sous-jacent avec annotation `nautilus_bridge=True`.

V1.2 roadmap : voir docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md (a venir).
"""

from trading.backtest.nautilus_bridge.runner import NautilusBridgeRunner
from trading.backtest.nautilus_bridge.transforms import (
    pandas_to_nautilus_bars,
    signals_to_order_intents,
)
from trading.backtest.nautilus_bridge.types import NautilusBar, OrderIntent

__all__ = [
    "NautilusBar",
    "NautilusBridgeRunner",
    "OrderIntent",
    "pandas_to_nautilus_bars",
    "signals_to_order_intents",
]
