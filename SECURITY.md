# Security

Hermes Labyrinth is a read-only observability plugin. It should not mutate
Hermes sessions, local state, tools, credentials, or configuration.

## Supported Versions

| Version | Supported |
| --- | --- |
| `v0.1.x` | yes |

## Reporting

Please do not open public issues for security-sensitive findings. Report issues
privately to the repository owner.

Include:

- affected version or commit
- reproduction steps
- whether local Hermes state, logs, previews, or reports expose sensitive data
- any proposed mitigation

## Data Handling

- Secret redaction is applied before journey summaries, previews, and reports
  are displayed.
- Redaction delegates to Hermes core redaction. If that redactor cannot be
  loaded or raises an error, Labyrinth fails closed and returns
  `[redaction unavailable]` instead of raw trace text.
- Reports are generated from local Hermes state.
- The public demo uses mocked data only.
- Unknown fields are intentionally preserved as unknown instead of guessed.

## Deployment Guidance

- Keep dashboards on localhost or a private network unless protected by your
  normal internal access controls.
- For Docker installs, mount Labyrinth into a dedicated Hermes profile first.
- Pin a tag or commit for production; do not track `main` directly.
- Run a local redaction smoke test with dummy provider keys, webhook secrets,
  OAuth tokens, and tool outputs before enabling the plugin on real traces.
- Check both the UI and report exports when validating redaction.
