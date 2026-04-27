# Hermes Labyrinth

Where the agent has been.

Hermes Labyrinth is a read-only observability plugin for
[Hermes Agent](https://github.com/NousResearch/hermes-agent). It turns agent
activity into a map of crossings: prompts, tool calls, tool results, failures,
model switches, subagents, approvals, memory hits, redactions, context
compression, cron runs, and reportable evidence.

It is not a chat UI. It is a blackbox recorder for autonomous work.

## Demo

- Live demo: https://stainlu.github.io/hermes-labyrinth/
- Repo: https://github.com/stainlu/hermes-labyrinth

The public demo is static and uses mocked Hermes state so it can run on GitHub
Pages. The installable dashboard plugin reads local Hermes state through its
FastAPI plugin routes.

## What it does

- **Journey index**: recent CLI, dashboard, gateway, cron, and delegated work.
- **Labyrinth map**: ordered crossings through a selected agent journey.
- **Inspector**: input, output, duration, status, evidence, and guideposts for
  a selected crossing.
- **Guideposts**: generated observations backed by local evidence.
- **Skill atlas**: bundled, optional, external, and user skill inventory.
- **Cron gate**: scheduled autonomy, next runs, last failures, and workdirs.
- **Model ferry**: model/provider transitions across sessions.
- **Reports**: redacted Markdown and JSON exports for one journey.

## Install

Install into the Hermes user plugin directory:

```bash
mkdir -p ~/.hermes/plugins
git clone https://github.com/stainlu/hermes-labyrinth.git ~/.hermes/plugins/hermes-labyrinth
```

Start or restart the dashboard:

```bash
hermes dashboard
```

If the dashboard is already running, rescan plugins:

```bash
curl http://127.0.0.1:9119/api/dashboard/plugins/rescan
```

Open the dashboard and select the `Labyrinth` tab.

Optional theme scaffold:

```bash
mkdir -p ~/.hermes/dashboard-themes
cp ~/.hermes/plugins/hermes-labyrinth/theme/hermes-labyrinth.yaml ~/.hermes/dashboard-themes/
```

## Repository Layout

```text
.
├── dashboard/
│   ├── manifest.json        # Hermes dashboard plugin manifest
│   ├── plugin_api.py        # Read-only API over local Hermes state
│   └── dist/                # Generated dashboard plugin bundle
├── docs/
│   ├── CONCEPT.md
│   ├── DESIGN_BRIEF.md
│   └── FUNCTIONAL_SPEC.md
├── scripts/
│   ├── build-plugin.mjs     # Builds dashboard/dist from src
│   └── verify.mjs           # Local verification checks
├── src/
│   ├── demo/                # GitHub Pages demo source
│   ├── parts/               # Ordered frontend source chunks
│   └── labyrinth.css        # Frontend CSS source
├── theme/
│   └── hermes-labyrinth.yaml
├── index.html               # Generated GitHub Pages demo
├── package.json             # Build/check scripts, no runtime deps
└── Hermes Labyrinth _standalone_.html
```

## Development

`dashboard/dist/` is generated from `src/parts/*.js` and `src/labyrinth.css`.
`index.html` is generated from `src/demo/index.html` with content-hash query
strings on the local JS/CSS assets. These files are checked in because Hermes
dashboard plugins and GitHub Pages are loaded directly from built static files.

```bash
npm run build
npm run check
```

`npm run check` verifies:

- `dashboard/dist` is up to date with `src`
- the public demo is using cache-busted plugin assets
- frontend JavaScript parses
- backend Python parses
- both static HTML demo artifacts parse
- the removed `New journey` dead control has not returned

## Architecture

```text
Hermes local state
  ├─ state.db sessions/messages
  ├─ skills directories
  └─ cron config
        ↓
dashboard/plugin_api.py
        ↓
/api/plugins/hermes-labyrinth/*
        ↓
src/parts/*.js + src/labyrinth.css
        ↓ npm run build
dashboard/dist/*
        ↓
Hermes dashboard tab: Labyrinth
```

The plugin is read-only. It does not start, stop, mutate, or create Hermes
sessions.

## API Surface

```text
GET /api/plugins/hermes-labyrinth/health
GET /api/plugins/hermes-labyrinth/journeys
GET /api/plugins/hermes-labyrinth/journeys/{journey_id}
GET /api/plugins/hermes-labyrinth/journeys/{journey_id}/crossings
GET /api/plugins/hermes-labyrinth/skills
GET /api/plugins/hermes-labyrinth/cron
GET /api/plugins/hermes-labyrinth/guideposts
GET /api/plugins/hermes-labyrinth/reports/{journey_id}.json
GET /api/plugins/hermes-labyrinth/reports/{journey_id}.md
```

## Data Policy

- Read-only by design.
- Secret redaction is applied to previews and reports.
- Unknown fields stay unknown.
- Reports are generated from local Hermes state.
- The public demo uses sample data and should not be treated as live telemetry.

## Status

Hackathon build, moving toward production readiness. See
[Known Limitations](./KNOWN_LIMITATIONS.md) and [Roadmap](./ROADMAP.md).
