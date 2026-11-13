# Shared code instructions

Scope: `09-SHARED/`.

- Put here only types, schemas, constants, contracts and utilities that at least two domains actually consume.
- Keep this folder free of secrets, server-only logic and privileged SDK clients: anything here may end up in the browser bundle.
- API contracts in `contracts/` must match `../10-DOCS/API_INTEGRATIONS.md` and reference their `API-xxx` IDs.
- Validation schemas used on both sides do not replace server-side validation; the trusted side must still validate.
- Changing a shared contract is a cross-domain change: check every consumer and update tests.
