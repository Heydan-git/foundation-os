"""BaseStrategy : classe mere pour toute strategie + metadata Pydantic."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

Horizon = Literal["swing", "position"]


class StrategyMetadata(BaseModel):
    """Metadata deterministe utilisee pour nommage, reports, Pine generation, wiki couplage."""

    name: str = Field(min_length=1, description="snake_case unique, ex: ema_cross_btc_4h")
    horizon: Horizon
    instruments: list[str] = Field(min_length=1, description="ex: ['BTCUSDT.BINANCE']")
    hyperparams: dict[str, Any] = Field(default_factory=dict)
    wiki_ref: str | None = None

    @field_validator("horizon")
    @classmethod
    def _check_horizon(cls, v: str) -> str:
        if v not in {"swing", "position"}:
            raise ValueError(f"horizon must be 'swing' or 'position', got {v!r}")
        return v


class BaseStrategy:
    """Classe parente pour strategies.

    En v1 on delegue l'heritage Nautilus a une classe concrete (Phase 3.4)
    pour tester la metadata de maniere isolee sans tirer Nautilus dans
    tous les tests unitaires.
    """

    metadata: StrategyMetadata

    def __init__(self, metadata: StrategyMetadata) -> None:
        self.metadata = metadata

    def to_pine_context(self) -> dict[str, Any]:
        """Variables exposees au template Pine v5 (override dans les sous-classes)."""
        return {
            "strategy_name": self.metadata.name,
            "horizon": self.metadata.horizon,
            **self.metadata.hyperparams,
        }
