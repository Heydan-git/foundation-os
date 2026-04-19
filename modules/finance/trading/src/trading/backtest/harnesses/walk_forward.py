"""WalkForward : rolling train/test avec embargo (anti-leakage)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd  # type: ignore[import-untyped]

from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict
from trading.backtest.runner import BacktestRunner


@dataclass
class WalkForward:
    name: str = "walk_forward"
    train_bars: int = 500
    test_bars: int = 200
    embargo_bars: int = 24

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult:
        runner = BacktestRunner()
        total = len(df)
        window = self.train_bars + self.embargo_bars + self.test_bars
        if total < window:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "not_enough_bars"})

        oos_returns: list[float] = []
        is_returns: list[float] = []
        n_windows = 0
        cursor = 0
        while cursor + window <= total:
            train = df.iloc[cursor : cursor + self.train_bars]
            test_start = cursor + self.train_bars + self.embargo_bars
            test = df.iloc[test_start : test_start + self.test_bars]
            is_r = runner.run(strategy, train).stats["total_return"]
            oos_r = runner.run(strategy, test).stats["total_return"]
            is_returns.append(is_r)
            oos_returns.append(oos_r)
            cursor += self.test_bars
            n_windows += 1

        oos_mean = float(np.mean(oos_returns)) if oos_returns else 0.0
        is_mean = float(np.mean(is_returns)) if is_returns else 0.0
        ratio = oos_mean / is_mean if is_mean > 0 else 0.0
        if ratio > 0.5:
            verdict = HarnessVerdict.PASS
        elif ratio > 0.2:
            verdict = HarnessVerdict.WARN
        else:
            verdict = HarnessVerdict.FAIL

        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={
                "n_windows": n_windows,
                "is_mean_return": is_mean,
                "oos_mean_return": oos_mean,
                "oos_is_ratio": ratio,
            },
        )
