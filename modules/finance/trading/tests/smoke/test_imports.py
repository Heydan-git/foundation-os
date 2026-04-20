"""Smoke test : verifie que tous les modules s'importent sans erreur."""


def test_all_modules_import() -> None:
    import trading  # noqa: F401
    from trading import __version__
    from trading.analysis import metrics, regime, reports  # noqa: F401
    from trading.backtest import fees, funding, latency, runner, slippage  # noqa: F401
    from trading.backtest.harnesses import (  # noqa: F401
        base,
        deflated_sharpe,
        monte_carlo,
        pbo,
        purged_cv,
        walk_forward,
    )
    from trading.cli import (  # noqa: F401
        backtest,
        download,
        main,
        montecarlo,
        pbo,  # noqa: F811
        pine,
        walkforward,
    )
    from trading.data import catalog, quality, storage  # noqa: F401
    from trading.data.sources import base as src_base  # noqa: F401
    from trading.data.sources import binance_source, ccxt_source  # noqa: F401
    from trading.execution.live import nautilus_live  # noqa: F401
    from trading.execution.pine import generator  # noqa: F401
    from trading.execution.threecommas import api, webhook  # noqa: F401
    from trading.strategies import base as strat_base  # noqa: F401
    from trading.strategies._examples import ema_cross  # noqa: F401
    from trading.strategies.indicators import atr, ema, rsi  # noqa: F401

    assert __version__ == "0.1.0"
