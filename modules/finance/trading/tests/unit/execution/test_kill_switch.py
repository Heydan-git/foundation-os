"""Tests KillSwitch : activation manuelle + file-flag + threshold."""
from pathlib import Path

from trading.execution.live.kill_switch import KillSwitch


def test_initial_state_inactive() -> None:
    ks = KillSwitch()
    assert not ks.is_active()


def test_manual_activation() -> None:
    ks = KillSwitch()
    ks.activate("manual test reason")
    assert ks.is_active()
    assert "manual test reason" in ks.reason()


def test_manual_deactivation() -> None:
    ks = KillSwitch()
    ks.activate("test")
    ks.deactivate()
    assert not ks.is_active()


def test_file_flag_activation(tmp_path: Path) -> None:
    flag_path = tmp_path / "kill.flag"
    ks = KillSwitch(flag_path=flag_path)
    assert not ks.is_active()
    flag_path.write_text("stop")
    # Force rechecking by calling is_active (it re-reads the flag)
    assert ks.is_active()
    assert "file flag" in ks.reason().lower()


def test_threshold_activation() -> None:
    ks = KillSwitch(max_consecutive_failures=3)
    assert not ks.is_active()
    ks.record_failure()
    ks.record_failure()
    assert not ks.is_active()
    ks.record_failure()  # 3rd failure triggers
    assert ks.is_active()
    assert "consecutive failures" in ks.reason().lower()


def test_success_resets_failure_counter() -> None:
    ks = KillSwitch(max_consecutive_failures=3)
    ks.record_failure()
    ks.record_failure()
    ks.record_success()
    ks.record_failure()
    ks.record_failure()
    assert not ks.is_active()  # counter was reset, only 2 after reset
