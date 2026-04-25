# Hermes Labyrinth

Hermes Labyrinth is a combined dashboard plugin and theme concept for the
Hermes Agent hackathon.

The project treats Hermes Agent as a guide across boundaries: user intent into
tool action, local machine into network services, single agent into delegated
agents, short-term context into memory, and manual work into scheduled autonomy.
The dashboard becomes a map of those crossings.

This is not a detailed visual design document. It defines the spirit,
functional scope, data surfaces, and several design directions for a designer
to interpret.

## Core pitch

Hermes Labyrinth turns the dashboard into a live map of an agent becoming
itself. Sessions, tool calls, skills, memory, cron jobs, provider routes,
approvals, failures, and delegated agents become a traversable record of the
journey.

It is a microscope for the self-improving loop, not a decorative skin.

## Why this fits Hermes

- Hermes is the god of thresholds, roads, messages, merchants, thieves,
  travelers, and souls crossing between worlds.
- The agent is already crossing boundaries: CLI, dashboard, gateway, browser,
  files, memory, skills, models, providers, and subagents.
- The labyrinth is the right metaphor because the hard problem is not raw
  activity. The hard problem is orientation inside many branching paths.
- A great Hermes dashboard should make the agent legible without making it
  less strange.

## Documents

- [Functional Spec](./FUNCTIONAL_SPEC.md) defines the product behavior,
  data model, MVP, integrations, and acceptance criteria.
- [Design Brief](./DESIGN_BRIEF.md) defines the spirit and high-level design
  directions without prescribing detailed visuals.

## Proposed deliverable

For the hackathon, ship a drop-in dashboard extension:

```text
plugins/hermes-labyrinth/
  README.md
  dashboard/
    manifest.json
    plugin_api.py
    dist/index.js
  theme/
    hermes-labyrinth.yaml
```

The plugin should work read-only by default. It should use real Hermes state
where possible and degrade gracefully when a data source is unavailable.

An initial implementation scaffold now lives at:

- `plugins/hermes-labyrinth/dashboard/manifest.json`
- `plugins/hermes-labyrinth/dashboard/plugin_api.py`
- `plugins/hermes-labyrinth/dashboard/dist/index.js`
- `plugins/hermes-labyrinth/theme/hermes-labyrinth.yaml`
