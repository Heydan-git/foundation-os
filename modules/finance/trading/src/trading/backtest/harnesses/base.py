"""Harness protocol + HarnessResult commun a tous les validators anti-biais."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum
from pathlib import Path
from typing import Any, Protocol

import pandas as pd  # type: ignore[import-untyped]


class HarnessVerdict(StrEnum):
    PASS = "PASS"
    WARN = "WARN"
    FAIL = "FAIL"


@dataclass
class HarnessResult:
    name: str
    verdict: HarnessVerdict
    metrics: dict[str, Any] = field(default_factory=dict)
    artifacts: list[Path] = field(default_factory=list)


class Harness(Protocol):
    name: str

    def run(self, strategy: Any, df: pd.DataFrame, config: dict[str, Any]) -> HarnessResult: ...
