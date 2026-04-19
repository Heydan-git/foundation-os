"""BacktestRunner v1 : version simplifiee pandas pour iteration rapide.

Nota : l'integration Nautilus complete arrive en V1.1 (Task 3.5 skipped).
Cette version suffit pour piloter toutes les harnesses Phase 4.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

import pandas as pd  # type: ignore[import-untyped]

from trading.backtest.fees import FeeSchedule
from trading.backtest.slippage import VolatilityBasedSlippage
from trading.strategies.base import BaseStrategy
from trading.strategies.indicators.atr import atr


@dataclass
class BacktestResult:
    strategy_name: str
    trades: pd.DataFrame
    equity_curve: pd.Series
    stats: dict[str, Any] = field(default_factory=dict)


@dataclass
class BacktestRunner:
    fees: FeeSchedule = field(default_factory=FeeSchedule)
    slippage: VolatilityBasedSlippage = field(default_factory=VolatilityBasedSlippage)
    initial_capital: float = 10_000.0

    def run(self, strategy: BaseStrategy, df: pd.DataFrame) -> BacktestResult:
        if not hasattr(strategy, "generate_signals"):
            raise TypeError(f"strategy {type(strategy).__name__} must expose generate_signals(df)")

        signals = strategy.generate_signals(df)
        atr_series = atr(df, period=14)
        atr_ratio = atr_series / df["close"]

        trades: list[dict[str, Any]] = []
        position = 0
        entry_price = 0.0
        entry_ts: pd.Timestamp | None = None
        equity = [self.initial_capital]

        for ts, sig in signals.items():
            price = float(df.loc[ts, "close"])
            if sig == 1 and position == 0:
                slip_bps = self.slippage.compute_bps(
                    atr_ratio=float(atr_ratio.loc[ts]) if not pd.isna(atr_ratio.loc[ts]) else 0.005,
                    order_notional=self.initial_capital,
                    avg_volume_notional=float(df["volume"].mean() * price),
                )
                entry_price = price * (1 + slip_bps / 1e4)
                entry_ts = ts
                position = 1
            elif sig == -1 and position == 1:
                slip_bps = self.slippage.compute_bps(
                    atr_ratio=float(atr_ratio.loc[ts]) if not pd.isna(atr_ratio.loc[ts]) else 0.005,
                    order_notional=self.initial_capital,
                    avg_volume_notional=float(df["volume"].mean() * price),
                )
                exit_price = price * (1 - slip_bps / 1e4)
                pnl_pct = (exit_price - entry_price) / entry_price - 2 * self.fees.taker()
                trades.append(
                    {
                        "entry_ts": entry_ts,
                        "exit_ts": ts,
                        "entry_price": entry_price,
                        "exit_price": exit_price,
                        "pnl_pct": pnl_pct,
                    }
                )
                equity.append(equity[-1] * (1 + pnl_pct))
                position = 0

        trades_df = pd.DataFrame(trades)
        equity_idx = pd.Index(
            [df.index[0]] + [t["exit_ts"] for t in trades],
            name="ts",
        )
        equity_series = pd.Series(equity, index=equity_idx, name="equity")

        return BacktestResult(
            strategy_name=strategy.metadata.name,
            trades=trades_df,
            equity_curve=equity_series,
            stats={
                "n_trades": len(trades),
                "total_return": (equity[-1] / equity[0]) - 1,
                "final_equity": equity[-1],
            },
        )
