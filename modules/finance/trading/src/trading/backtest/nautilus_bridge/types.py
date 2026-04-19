"""Local dataclasses mirroring Nautilus concepts — evite import heavy nautilus_trader en tests."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Literal


@dataclass(frozen=True)
class NautilusBar:
    """Mirror de nautilus_trader.model.data.Bar (subset minimal)."""

    instrument_id: str
    ts_event: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float


@dataclass(frozen=True)
class OrderIntent:
    """Intent d'ordre pre-Nautilus. V1.2 conversion -> MarketOrder/LimitOrder Nautilus."""

    instrument_id: str
    ts: datetime
    side: Literal["BUY", "SELL"]
    quantity: float
    order_type: Literal["MARKET"] = "MARKET"  # v1 : market only
