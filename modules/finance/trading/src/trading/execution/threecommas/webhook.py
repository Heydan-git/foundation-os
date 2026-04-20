"""WebhookReceiver FastAPI : recoit alertes TradingView et trigger bots 3Commas.

Auth : shared-secret via header X-TV-Secret.
"""

from __future__ import annotations

import os

from fastapi import FastAPI, Header, HTTPException, Request

from trading.execution.threecommas.api import ThreeCommasAPI

ALLOWED_ACTIONS = {"enter_long", "exit_long", "enter_short", "exit_short"}


def make_app(api: ThreeCommasAPI | None = None, secret: str | None = None) -> FastAPI:
    app = FastAPI(title="trading-webhook-receiver")
    _secret = secret or os.getenv("TV_WEBHOOK_SECRET", "")
    _api = api

    @app.post("/webhook")
    async def webhook(
        request: Request,
        x_tv_secret: str = Header(""),
    ) -> dict[str, str]:
        if not _secret or x_tv_secret != _secret:
            raise HTTPException(status_code=401, detail="invalid secret")
        payload = await request.json()
        action = payload.get("action")
        symbol = payload.get("symbol")
        bot_id = int(payload.get("bot_id", 0))
        if action not in ALLOWED_ACTIONS:
            raise HTTPException(status_code=400, detail="invalid action")
        if _api and action.startswith("enter"):
            _api.start_deal(bot_id=bot_id, pair=symbol)
        return {"status": "ok", "action": action, "symbol": symbol}

    return app
