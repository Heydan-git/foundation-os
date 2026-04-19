"""KillSwitch : pause globale activee manuellement, par flag fichier, ou par threshold failures."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class KillSwitch:
    """Pause globale du live trading.

    3 modes d'activation :
    - Manuel via `activate(reason)` / `deactivate()`
    - File flag : si `flag_path` existe sur disque
    - Threshold : apres N failures consecutives via `record_failure()`
    """

    flag_path: Path | None = None
    max_consecutive_failures: int = 5
    _active: bool = field(default=False, init=False)
    _reason: str = field(default="", init=False)
    _consecutive_failures: int = field(default=0, init=False)

    def is_active(self) -> bool:
        # File flag check (re-read each call for live detection)
        if self.flag_path is not None and self.flag_path.exists():
            self._active = True
            self._reason = f"file flag present at {self.flag_path}"
        return self._active

    def reason(self) -> str:
        self.is_active()  # refresh state
        return self._reason

    def activate(self, reason: str) -> None:
        self._active = True
        self._reason = reason

    def deactivate(self) -> None:
        self._active = False
        self._reason = ""
        self._consecutive_failures = 0

    def record_failure(self) -> None:
        self._consecutive_failures += 1
        if self._consecutive_failures >= self.max_consecutive_failures:
            self._active = True
            self._reason = (
                f"{self._consecutive_failures} consecutive failures "
                f"(threshold {self.max_consecutive_failures})"
            )

    def record_success(self) -> None:
        self._consecutive_failures = 0
