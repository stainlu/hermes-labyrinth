# Roadmap

## Now

- Keep the public demo stable.
- Remove dead controls and make every visible action either work or clearly
  read as read-only.
- Document demo versus live plugin behavior.
- Add basic repo hygiene: license, ignore rules, limitations, and roadmap.

## Next

- Move the dashboard UI into maintainable source modules under `src/`.
- Add a reproducible build command for `dashboard/dist/index.js`.
- Replace the standalone GitHub Pages bundle with a normal static demo harness.
- Add backend tests for state-db absence, journey listing, crossing inference,
  redaction, guideposts, and report generation.
- Add frontend smoke tests for journey selection, guidepost jumps, map modes,
  reports, empty state, and API failure state.

## Later

- Lazy-load crossings for only the selected journey.
- Add live streaming/replay of active crossings.
- Build richer model-ferry views for provider/model transitions.
- Add a subagent tree with parent/child journey navigation.
- Add optional hook recording for precise tool durations and boundary events.
- Cut a tagged `v0.1.0` release once source, build, and tests are in place.

