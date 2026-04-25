# Hermes Labyrinth

Hermes Labyrinth is a read-only dashboard extension for orienting inside Hermes
Agent activity.

It normalizes existing Hermes state into:

- journeys: sessions, cron runs, gateway work, and delegated child work
- crossings: prompts, tool calls, tool results, model/context transitions,
  approvals, and delegation boundaries
- guideposts: explainable observations backed by local evidence
- skill atlas: built-in, optional, user, and external skill inventory
- cron gate: scheduled autonomy and project workdir visibility
- reports: redacted Markdown exports for debugging and submission

The visual layer is intentionally minimal. The product behavior is here for a
designer to shape.

## Folder structure

```text
plugins/hermes-labyrinth/
  README.md
  docs/
    CONCEPT.md
    FUNCTIONAL_SPEC.md
    DESIGN_BRIEF.md
  dashboard/
    manifest.json
    plugin_api.py
    dist/index.js
  theme/
    hermes-labyrinth.yaml
```

## Docs

- [Concept](./docs/CONCEPT.md)
- [Functional spec](./docs/FUNCTIONAL_SPEC.md)
- [Design brief](./docs/DESIGN_BRIEF.md)

## Install from a repo checkout

The dashboard plugin is auto-discovered because this directory lives under
`plugins/`.

To install the theme scaffold:

```bash
mkdir -p ~/.hermes/dashboard-themes
cp plugins/hermes-labyrinth/theme/hermes-labyrinth.yaml ~/.hermes/dashboard-themes/
```

Restart `hermes dashboard`, or call:

```bash
curl http://127.0.0.1:9119/api/dashboard/plugins/rescan
```

Open the dashboard and select the `Labyrinth` tab.

## Data policy

- The plugin is read-only.
- Secret redaction is applied to previews and reports.
- Unknown fields remain unknown.
- The report endpoint is generated from local Hermes state.
