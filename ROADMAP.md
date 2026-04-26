# Roadmap

## Now

- Keep the public demo stable.
- Keep every visible action either working or clearly read-only.
- Keep `dashboard/dist` reproducible from `src`.
- Add API and frontend smoke tests.

## Next

- Convert `src/parts/*.js` into true ES modules with focused exports/imports.
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
