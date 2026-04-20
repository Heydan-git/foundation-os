"""PurgedCV : K-fold cross-validation purged + embargoed (Lopez de Prado 2018, ch.7)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd  # type: ignore[import-untyped]

from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict
from trading.backtest.runner import BacktestRunner


@dataclass
class PurgedCV:
    name: str = "purged_cv"
    k: int = 5
    embargo_pct: float = 0.01

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult:
        runner = BacktestRunner()
        n = len(df)
        fold_size = n // self.k
        embargo = int(n * self.embargo_pct)

        fold_returns: list[float] = []
        for fold_idx in range(self.k):
            test_start = fold_idx * fold_size
            test_end = test_start + fold_size
            test = df.iloc[test_start:test_end]

            train_parts = []
            if test_start > embargo:
                train_parts.append(df.iloc[: test_start - embargo])
            if test_end + embargo < n:
                train_parts.append(df.iloc[test_end + embargo :])
            if not train_parts:
                continue
            train = pd.concat(train_parts)

            _ = runner.run(strategy, train)  # train pass (noop pour strategies sans params learnables)
            fold_returns.append(runner.run(strategy, test).stats["total_return"])

        if not fold_returns:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "no_valid_folds"})

        mean_r = float(np.mean(fold_returns))
        std_r = float(np.std(fold_returns, ddof=1)) if len(fold_returns) > 1 else 0.0
        verdict = HarnessVerdict.PASS if mean_r > 0 and std_r < 2 * abs(mean_r) + 1e-9 else HarnessVerdict.WARN

        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={
                "k": self.k,
                "fold_mean": mean_r,
                "fold_std": std_r,
                "n_folds": len(fold_returns),
            },
        )
