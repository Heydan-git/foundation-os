#!/usr/bin/env python3
"""
Batch operations context manager for optimized I/O
Prevents multiple writes during batch operations

ZERO import-time side effects.
"""

from contextlib import contextmanager


@contextmanager
def batch_memory_operations(memory_instance):
    """
    Context manager for batch operations on memory instances.

    Usage:
        with batch_memory_operations(memory) as batch:
            memory.add_contradiction(...)
            memory.add_decision(...)
            memory.set_next_action(...)
            # Only 1 write at the end instead of 3
    """

    original_auto_save = memory_instance._auto_save
    memory_instance._auto_save = False

    try:
        yield memory_instance
    finally:
        memory_instance._auto_save = original_auto_save
        memory_instance.flush()


@contextmanager
def batch_communication_log(protocol_instance):
    """
    Context manager for batch communication log operations.
    """
    try:
        yield protocol_instance
    finally:
        if hasattr(protocol_instance, 'flush'):
            protocol_instance.flush()


def batch_activate_system(master_system):
    """
    Optimized activation with batched operations.
    Reduces I/O from ~10 operations to 1-2.
    """

    with batch_memory_operations(master_system.memory):
        result = master_system.activate_system()

    return result
