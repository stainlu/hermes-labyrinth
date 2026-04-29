# Contributing

Hermes Labyrinth is a small read-only dashboard plugin for Hermes Agent.
Contributions should preserve that boundary.

## Local Checks

Run the full project check before opening a PR:

```bash
npm test
```

For faster iteration:

```bash
npm run build
npm run check
npm run smoke
```

## Development Notes

- Edit frontend source under `src/`; do not hand-edit `dashboard/dist/`.
- Run `npm run build` after frontend source changes.
- Keep the public demo static and deterministic.
- Keep plugin API behavior read-only.
- Do not add dependencies unless they remove meaningful complexity.

## Pull Requests

Good PRs include:

- a short description of the user-facing change
- screenshots for visual changes
- verification commands and results
- any known limitations or follow-up work

Bug fixes should include a regression check when practical.
