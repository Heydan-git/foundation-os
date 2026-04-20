"""Tests WebhookReceiver : FastAPI app, auth shared-secret."""
from fastapi.testclient import TestClient

from trading.execution.threecommas.webhook import make_app


def test_webhook_rejects_bad_secret() -> None:
    app = make_app(api=None, secret="goodsecret")
    client = TestClient(app)
    resp = client.post(
        "/webhook",
        json={"action": "enter_long", "symbol": "BTCUSDT"},
        headers={"X-TV-Secret": "wrong"},
    )
    assert resp.status_code == 401


def test_webhook_accepts_valid_payload() -> None:
    app = make_app(api=None, secret="goodsecret")
    client = TestClient(app)
    resp = client.post(
        "/webhook",
        json={"action": "enter_long", "symbol": "BTCUSDT", "bot_id": 0},
        headers={"X-TV-Secret": "goodsecret"},
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_webhook_rejects_invalid_action() -> None:
    app = make_app(api=None, secret="goodsecret")
    client = TestClient(app)
    resp = client.post(
        "/webhook",
        json={"action": "garbage", "symbol": "BTCUSDT"},
        headers={"X-TV-Secret": "goodsecret"},
    )
    assert resp.status_code == 400
