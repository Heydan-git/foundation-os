"""MonteCarlo : N runs avec trade shuffling -> distribution Sharpe/DD/equity."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd  # type: ignore[import-untyped]

from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict
from trading.backtest.runner import BacktestRunner


@dataclass
class MonteCarlo:
    name: str = "monte_carlo"
    n_runs: int = 1000
    seed: int = 42

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult:
        runner = BacktestRunner()
        base_result = runner.run(strategy, df)
        trades = base_result.trades
        if trades.empty:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "no_trades"})

        rng = np.random.default_rng(self.seed)
        returns = trades["pnl_pct"].to_numpy()
        equity_finals: list[float] = []
        max_dds: list[float] = []
        for _ in range(self.n_runs):
            shuffled = rng.permutation(returns)
            equity = np.cumprod(1 + shuffled)
            peak = np.maximum.accumulate(equity)
            dd = (equity - peak) / peak
            equity_finals.append(float(equity[-1]) - 1)
            max_dds.append(float(dd.min()))

        pct_positive = float(np.mean([e > 0 for e in equity_finals]))
        median_dd = float(np.median(max_dds))
        verdict = HarnessVerdict.PASS if pct_positive > 0.5 else HarnessVerdict.WARN

        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={
                "n_runs": self.n_runs,
                "pct_runs_positive": pct_positive,
                "median_max_dd": median_dd,
                "p5_final_return": float(np.percentile(equity_finals, 5)),
                "p95_final_return": float(np.percentile(equity_finals, 95)),
            },
        )
