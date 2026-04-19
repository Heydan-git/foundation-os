"""Tests ThreeCommasAPI : HMAC signing + response parsing."""
from unittest.mock import MagicMock

from trading.execution.threecommas.api import ThreeCommasAPI


def test_list_bots_signs_and_parses() -> None:
    client = MagicMock()
    response = MagicMock()
    response.raise_for_status = MagicMock()
    response.json.return_value = [{"id": 1, "name": "bot-btc"}]
    client.request.return_value = response

    api = ThreeCommasAPI(api_key="k", api_secret="s", _client=client)
    bots = api.list_bots()
    assert bots == [{"id": 1, "name": "bot-btc"}]
    client.request.assert_called_once()
    args, kwargs = client.request.call_args
    assert kwargs["headers"]["APIKEY"] == "k"
    assert "Signature" in kwargs["headers"]


def test_start_deal_posts_bot_id_and_pair() -> None:
    client = MagicMock()
    response = MagicMock()
    response.raise_for_status = MagicMock()
    response.json.return_value = {"id": 123, "status": "open"}
    client.request.return_value = response

    api = ThreeCommasAPI(api_key="k", api_secret="s", _client=client)
    deal = api.start_deal(bot_id=42, pair="USDT_BTC")
    assert deal == {"id": 123, "status": "open"}
    args, kwargs = client.request.call_args
    assert kwargs["params"]["pair"] == "USDT_BTC"
