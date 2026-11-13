# Testing instructions

Scope: `08-TESTS/`.

- Read `TESTING.md` and relevant product/security documents.
- Use isolated test environments, deterministic fixtures and synthetic data.
- Cover critical user journeys, error paths, authentication, denied access and tenant isolation.
- Match approved PRD feature IDs to observable test scenarios, including negative cases for Auth, database/RLS, Storage, and APIs when relevant.
- For denied database writes, verify no data changed; a zero-row update can be a denial without an explicit error.
- Run only real configured commands; do not claim tests passed unless executed.
- Keep `Not run`, `Failed`, `Blocked`, and `Passed` distinct; record environment, commands, and untested risks.
- Keep failures visible and explain untested areas in French.
