"""Hermes Labyrinth plugin package.

The repository ships dashboard UI assets plus dashboard/plugin_api.py, which
Hermes mounts separately. The generic plugin loader imports enabled plugins
from their root, so expose a no-op register() hook.
"""


def register(ctx):
    return None
