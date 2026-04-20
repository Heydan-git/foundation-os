"""FeeSchedule : fees maker/taker par venue + market + tier."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

FEE_TABLE: dict[tuple[str, str, str], tuple[float, float]] = {
    ("BINANCE", "spot", "VIP0"): (0.0010, 0.0010),
    ("BINANCE", "spot", "VIP1"): (0.0009, 0.0010),
    ("BINANCE", "perp", "VIP0"): (0.0002, 0.0005),
    ("BINANCE", "perp", "VIP1"): (0.00016, 0.0004),
    ("BYBIT", "spot", "VIP0"): (0.0010, 0.0010),
    ("BYBIT", "perp", "VIP0"): (0.0002, 0.00055),
}


@dataclass
class FeeSchedule:
    venue: Literal["BINANCE", "BYBIT"] = "BINANCE"
    market: Literal["spot", "perp"] = "spot"
    tier: str = "VIP0"

    def _rates(self) -> tuple[float, float]:
        return FEE_TABLE[(self.venue, self.market, self.tier)]

    def maker(self) -> float:
        return self._rates()[0]

    def taker(self) -> float:
        return self._rates()[1]
