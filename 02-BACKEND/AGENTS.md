# Backend instructions

Scope: `02-BACKEND/`; this domain is optional if a project uses a managed backend only.

- Read `../10-DOCS/ARCHITECTURE.md` before changing API boundaries.
- Read `../06-SECURITY/SECURITY.md` for API, authorization, secrets or user-data work.
- Authenticate callers and authorize every sensitive operation on the trusted side.
- Validate request schemas, enforce tenant ownership and return safe errors.
- Keep routes/controllers thin and separate business logic, integrations and data access.
- Use `../09-SHARED/contracts/` for agreed API contracts when configured.
- Document request/response schemas, error codes, rate limits, and ownership checks before exposing new endpoints.
- Verify incoming webhook signatures and freshness where supported; make retries, duplicate events, and external side effects idempotent when relevant.
- Apply timeouts and safe failure handling to untrusted network calls; avoid SSRF from user-supplied destinations.
- Add relevant negative authorization tests; never assume an authenticated user may access all records.
- Do not add a custom backend when `../10-DOCS/ARCHITECTURE.md` selects a fully managed design that does not need one.
- Never deploy or mutate production services without explicit authorization.
