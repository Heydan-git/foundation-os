"""LatencySimulator : injecte un delay simule sur placement/fill ordre."""

from __future__ import annotations

import random
from dataclasses import dataclass, field


@dataclass
class LatencySimulator:
    min_ms: int = 100
    max_ms: int = 200
    seed: int | None = None
    _rng: random.Random = field(init=False, repr=False)

    def __post_init__(self) -> None:
        self._rng = random.Random(self.seed)

    def draw_ms(self) -> int:
        return self._rng.randint(self.min_ms, self.max_ms)
