"""PBO : Probability of Backtest Overfitting (Bailey, Borwein, Lopez de Prado, Zhu 2015).

Implementation simplifiee : on recoit un DataFrame d'equity curves pour N strategies
(ou hyperparam configs), on calcule la probabilite que la meilleure in-sample
soit mediocre out-of-sample.
"""

from __future__ import annotations

from dataclasses import dataclass
from itertools import combinations
from typing import Any

import numpy as np
import pandas as pd  # type: ignore[import-untyped]

from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict


@dataclass
class PBO:
    name: str = "pbo"
    s: int = 16  # nombre de splits (doit etre pair, Bailey recommande 16)

    def run(self, strategy: Any, df: Any, config: dict[str, Any]) -> HarnessResult:
        """config['equity_curves'] = DataFrame cols=strategies, rows=time -> equity per strategy."""
        curves: pd.DataFrame | None = config.get("equity_curves")
        if curves is None or curves.empty:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "no_equity_curves"})

        if self.s % 2:
            raise ValueError("s must be even")

        returns = curves.pct_change().dropna()
        n_rows = len(returns)
        chunk = n_rows // self.s
        if chunk < 10:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "not_enough_data"})

        groups = [returns.iloc[i * chunk : (i + 1) * chunk] for i in range(self.s)]
        half = self.s // 2
        logits: list[float] = []
        for combo in combinations(range(self.s), half):
            is_set = pd.concat([groups[i] for i in combo])
            oos_set = pd.concat([groups[i] for i in range(self.s) if i not in combo])
            sharpes_is = is_set.mean() / is_set.std(ddof=0).replace(0, 1e-12)
            sharpes_oos = oos_set.mean() / oos_set.std(ddof=0).replace(0, 1e-12)
            best_is = sharpes_is.idxmax()
            rank_oos = sharpes_oos.rank(ascending=True)[best_is] / len(sharpes_oos)
            logit = float(np.log(rank_oos / (1 - rank_oos + 1e-9)))
            logits.append(logit)

        pbo_prob = float(np.mean([x < 0 for x in logits]))
        if pbo_prob < 0.15:
            verdict = HarnessVerdict.PASS
        elif pbo_prob < 0.30:
            verdict = HarnessVerdict.WARN
        else:
            verdict = HarnessVerdict.FAIL

        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={
                "s": self.s,
                "pbo_probability": pbo_prob,
                "n_combinations": len(logits),
            },
        )
