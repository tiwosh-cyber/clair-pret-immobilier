# Scripts instructions

Scope: `11-SCRIPTS/`.

- Scripts must be idempotent, documented at the top (purpose, inputs, target environment) and safe to run twice.
- Never hardcode secrets or production URLs; read configuration from environment variable names listed in `.env.example`.
- Scripts that delete data, reset a database or touch production require explicit user authorization before each run and must refuse to run against production unless an explicit flag is given.
- Seed scripts use synthetic data only.
- Record useful verified commands in `../10-DOCS/CODE_STYLE.md` and `../08-TESTS/TESTING.md`.
