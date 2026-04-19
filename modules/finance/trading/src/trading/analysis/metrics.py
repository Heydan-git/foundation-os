"""PerformanceMetrics : Sharpe/Sortino/Calmar/MaxDD/ProfitFactor/WinRate/Expectancy."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd  # type: ignore[import-untyped]


@dataclass
class PerformanceMetrics:
    periods_per_year: int = 365 * 24  # default 1h bars

    def compute(self, *, returns: pd.Series, equity: pd.Series) -> dict[str, float]:
        r = returns.dropna().to_numpy()
        eq = equity.to_numpy()

        mean = float(r.mean()) if len(r) else 0.0
        std = float(r.std(ddof=1)) if len(r) > 1 else 0.0
        # Use ptp (peak-to-peak) to detect truly constant series — fp-safe guard
        sharpe = (
            0.0
            if std == 0 or float(np.ptp(r)) == 0
            else mean / std * float(np.sqrt(self.periods_per_year))
        )

        downside = r[r < 0]
        dstd = float(downside.std(ddof=1)) if len(downside) > 1 else 0.0
        sortino = 0.0 if dstd == 0 else mean / dstd * float(np.sqrt(self.periods_per_year))

        peak = np.maximum.accumulate(eq)
        dd = (eq - peak) / peak
        max_dd = float(dd.min())

        cagr = (
            (eq[-1] / eq[0]) ** (self.periods_per_year / max(len(r), 1)) - 1
            if eq[0] > 0
            else 0.0
        )
        calmar = cagr / abs(max_dd) if max_dd != 0 else 0.0

        gains = float(r[r > 0].sum())
        losses = float(-r[r < 0].sum())
        pf = gains / losses if losses > 0 else float("inf") if gains > 0 else 0.0

        win_rate = float((r > 0).mean()) if len(r) else 0.0
        expectancy = mean

        return {
            "sharpe": sharpe,
            "sortino": sortino,
            "calmar": calmar,
            "max_drawdown": max_dd,
            "profit_factor": pf,
            "win_rate": win_rate,
            "expectancy": expectancy,
            "total_return": float(eq[-1] / eq[0] - 1) if eq[0] > 0 else 0.0,
        }
