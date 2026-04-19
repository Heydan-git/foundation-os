"""VolatilityBasedSlippage : slippage en bps fonction de ATR + taille ordre / liquidite."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class VolatilityBasedSlippage:
    """bps = base + atr_ratio * atr_mult + (order/volume) * size_impact."""

    base_bps: float = 2.0
    atr_multiplier: float = 50.0
    size_impact: float = 100.0

    def compute_bps(
        self,
        atr_ratio: float,
        order_notional: float,
        avg_volume_notional: float,
    ) -> float:
        vol_component = self.atr_multiplier * atr_ratio * 1e4
        size_component = self.size_impact * (order_notional / max(avg_volume_notional, 1))
        return self.base_bps + vol_component + size_component
