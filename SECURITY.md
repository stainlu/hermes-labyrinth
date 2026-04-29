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

- Secret redaction is applied before previews and reports are displayed.
- Reports are generated from local Hermes state.
- The public demo uses mocked data only.
- Unknown fields are intentionally preserved as unknown instead of guessed.
