# Changelog

All notable changes to Hermes Labyrinth are documented here.

## Unreleased

### Changed

- Redaction now fails closed with `[redaction unavailable]` if Hermes core
  redaction cannot be loaded or raises an error.
- Journey summaries and root prompts now use the same redaction path as
  crossing previews and reports.
- Security and install docs now include Docker PoC, pinned-version, rollback,
  and redaction smoke-test guidance.

### Added

- Regression coverage for redaction import failures, redactor exceptions, and
  journey metadata redaction.

## v0.1.0 - 2026-04-29

First public hackathon release.

### Added

- Read-only Hermes dashboard plugin manifest and API.
- Journey index for CLI, dashboard, gateway, cron, and delegated sessions.
- Labyrinth map with thread, corridor, and flight-strip modes.
- Crossing inspector with previews, status, evidence, and guideposts.
- Skill atlas, cron gate, model ferry, memory/context view, and report view.
- Static GitHub Pages demo with mocked Hermes state.
- Reproducible frontend build from `src/` to `dashboard/dist/`.
- Content-hash asset stamping for the public demo.
- Browser smoke suite for the public demo and main controls.
- API normalization fixture tests.

### Notes

- The plugin is read-only and does not mutate Hermes state.
- The public demo uses mocked state; installed plugin data comes from local
  Hermes state.
- Full Hermes dashboard integration tests remain future work.
