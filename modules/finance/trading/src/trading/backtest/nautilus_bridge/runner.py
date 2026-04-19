"""NautilusBridgeRunner : skeleton pour V1.2 migration Nautilus event-driven.

V1 : delegue run() au BacktestRunner pandas sous-jacent + annotation `nautilus_bridge=True`.
V1.2 : run_full_nautilus() utilisera BacktestNode event-driven pour fills partiels / latency reelle.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import pandas as pd  # type: ignore[import-untyped]

from trading.backtest.nautilus_bridge.transforms import (
    pandas_to_nautilus_bars,
    signals_to_order_intents,
)
from trading.backtest.runner import BacktestResult, BacktestRunner
from trading.strategies.base import BaseStrategy


@dataclass
class NautilusBridgeRunner:
    """V1 skeleton : wrappe BacktestRunner pandas avec bridge annotation.

    Objectif : definir l'API V1.2 aujourd'hui. Les tests valident les transforms
    (pandas<->Nautilus) qui seront reutilises tels quels en V1.2.
    """

    quantity: float = 1.0

    def run(
        self,
        strategy: BaseStrategy,
        df: pd.DataFrame,
        *,
        instrument_id: str = "BTCUSDT.BINANCE",
    ) -> BacktestResult:
        """V1 : convertit en bars Nautilus (testable), puis delegue au runner pandas.

        V1.2 : remplacera cette logique par un BacktestNode Nautilus event-driven.
        """
        # Transform testable (prouve que les donnees sont pretes pour Nautilus)
        bars = pandas_to_nautilus_bars(df, instrument_id=instrument_id)

        # Delegation au runner pandas existant (zero regression des 5 strategies)
        underlying = BacktestRunner()
        result = underlying.run(strategy, df)

        # Annotation bridge pour tracabilite
        result.stats["nautilus_bridge"] = True
        result.stats["bars_count"] = len(bars)
        result.stats["instrument_id"] = instrument_id

        # V1.2 will also populate intents here
        if not result.trades.empty:
            # Build intents from trades for symmetry
            entry_signals = pd.Series(
                0, index=df.index, dtype=int
            )  # placeholder — real signals path in V1.2
            for _, trade in result.trades.iterrows():
                entry_signals.loc[trade["entry_ts"]] = 1
                entry_signals.loc[trade["exit_ts"]] = -1
            result.stats["intents_count"] = len(
                signals_to_order_intents(
                    entry_signals, instrument_id=instrument_id, quantity=self.quantity
                )
            )

        return result

    def run_full_nautilus(
        self, strategy: Any, df: Any, config: dict[str, Any]
    ) -> BacktestResult:
        """Path V1.2 : vraie execution via nautilus_trader.BacktestNode.

        V1 status : NotImplementedError explicite. Voir spec V1.2 roadmap.
        """
        raise NotImplementedError(
            "run_full_nautilus non implemente en V1. V1.2 roadmap : "
            "instancier BacktestEngine + SimulatedVenue + importer strategie Nautilus-native + "
            "feed bars via ParquetDataCatalog. Voir "
            "docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md"
        )
