# Known Limitations

Hermes Labyrinth is currently a hackathon build. The demo is polished, but the
repo still needs a production source/build/test pipeline.

## Demo

- The GitHub Pages demo is static and uses mocked Hermes state.
- The demo is bundled as a standalone HTML artifact so it can run without a
  Hermes install.
- The demo does not create, stop, resume, or mutate journeys.

## Plugin

- The plugin API is read-only.
- Crossings are inferred from existing Hermes session messages. Some durations,
  model switches, tool timings, and subagent links depend on what Hermes has
  recorded in local state.
- Fresh Hermes installs may show sparse data until sessions, skills, or cron
  jobs exist.
- The frontend currently loads crossings for all listed journeys. This should
  become lazy per selected journey for larger local histories.

## Repository

- `dashboard/dist/index.js` is checked in as the installable dashboard bundle.
- There is not yet a first-class `src/` tree or build command.
- Frontend smoke tests and backend API fixtures are not in place yet.
- `Hermes Labyrinth _standalone_.html` is kept as the design/demo artifact and
  should not be treated as maintainable source.

