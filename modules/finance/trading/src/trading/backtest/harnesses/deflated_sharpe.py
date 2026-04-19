"""Deflated Sharpe Ratio (Bailey-Lopez 2014) : Sharpe corrige pour N trials testes."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
from scipy.stats import kurtosis, norm, skew  # type: ignore[import-untyped]

from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict


@dataclass
class DeflatedSharpe:
    name: str = "deflated_sharpe"

    def run(self, strategy: Any, df: Any, config: dict[str, Any]) -> HarnessResult:
        returns = config.get("returns")
        n_trials = int(config.get("n_trials", 1))
        if returns is None or len(returns) < 10:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "not_enough_returns"})

        r = np.asarray(returns, dtype=float)
        t = len(r)
        std = float(r.std(ddof=0))
        sr = float(r.mean() / std) if std > 0 else 0.0
        skew_r = float(skew(r))
        kurt_r = float(kurtosis(r, fisher=False))

        # Expected max SR sous H0 (multiple trials), Bailey-Lopez formula
        e_max_sr = (1 - np.euler_gamma) * norm.ppf(1 - 1 / n_trials) + np.euler_gamma * norm.ppf(
            1 - (1 / (n_trials * np.e))
        )

        denom_sq = (1 - skew_r * sr + (kurt_r - 1) / 4 * sr**2) / (t - 1)
        if denom_sq <= 0:
            return HarnessResult(self.name, HarnessVerdict.FAIL, {"reason": "invalid_denom"})

        dsr = float(norm.cdf((sr - e_max_sr) / np.sqrt(denom_sq)))
        if dsr > 0.95:
            verdict = HarnessVerdict.PASS
        elif dsr > 0.75:
            verdict = HarnessVerdict.WARN
        else:
            verdict = HarnessVerdict.FAIL

        return HarnessResult(
            name=self.name,
            verdict=verdict,
            metrics={
                "sharpe": sr,
                "expected_max_sr": float(e_max_sr),
                "dsr": dsr,
                "n_trials": n_trials,
                "t": t,
            },
        )
