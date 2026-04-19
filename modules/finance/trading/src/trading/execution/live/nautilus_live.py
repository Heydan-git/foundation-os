"""NautilusLive : execution directe via Nautilus live mode.

V1 status : STUB. Preference v1 = Pine+3Commas. Implementation complete en V1.1
quand une strategie necessitera un execution non exprimable en Pine (ML, orderbook).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class NautilusLive:
    venue: str = "BINANCE"

    def start(self, strategy: Any) -> None:
        raise NotImplementedError(
            "NautilusLive non implemente en V1. Utiliser PineGenerator + 3Commas webhook "
            "pour l'execution. Voir design doc section 6.6 (V1.1 roadmap)."
        )
