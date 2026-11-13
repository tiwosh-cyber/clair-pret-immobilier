# Testing

## Goals and scope
[What must work before release? Link `../10-DOCS/PRD.md` feature IDs, acceptance criteria, and `../06-SECURITY/SECURITY.md` risks.] Prioritize tests by user impact and security risk; do not fabricate test tools or success reports.

## Test layers
- Unit: [Business rules and validation]
- Integration: [API/database/storage/auth provider boundaries, permissions, and failure behavior]
- End-to-end: [Critical user journeys using the real selected stack in an isolated environment]
- Manual: [Responsive UI, accessibility, usability, and unsupported automation cases]
- Performance/security: [Critical latency, load, abuse, and access-control scenarios appropriate to the product]

## Feature traceability
Every approved PRD feature and high-risk permission must have a test owner, an observable expected result, and an execution status. Include success, failure, and denied-access paths; avoid testing only happy paths.

## Acceptance test matrix
| Feature/risk | Scenario | Expected result | Layer | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| F-001 | [Happy path] | [Observable result] | [Layer] | [Owner] | Not run |
| F-001 | [Invalid input] | [Safe error/recovery] | [Layer] | [Owner] | Not run |
| Permissions | [Unauthorized caller] | [Denied; no data leaked or changed] | Integration | [Owner] | Not run |
| Isolation | [Access another user's/tenant's record] | [Denied] | Integration | [Owner] | Not run |

## Authorization, Auth, RLS, and tenant tests
- Test signed-out, signed-in owner, other user, valid tenant member, non-member, revoked member, and privileged user as appropriate.
- Exercise `SELECT`, `INSERT`, `UPDATE`, and `DELETE` for each exposed table under RLS, including changing `owner_id`/`tenant_id`. Verify allowed operations actually affect the expected rows.
- Distinguish SQL grant failures from RLS filtering: a denied read/update may return zero rows rather than an error. Assert no unauthorized data or mutation, not merely absence of an exception.
- For Supabase, keep repeatable policy tests under `supabase/tests/` and run `supabase test db` when the CLI/test environment is configured; include Storage object policies separately.
- Test login/logout, expired or revoked tokens, role changes, invitation acceptance/revocation, account recovery, and provider failures when applicable. Link rules to `../04-AUTH/AUTH.md` and `../03-DATABASE/DATABASE.md`.

## Storage, API, and integration tests
- For uploads, test ownership, private downloads, signed URL expiry, size/type restrictions, quotas, overwrites/upserts, and deletion; see `../05-STORAGE/STORAGE.md`.
- For APIs, test invalid/oversized input, missing credentials, unauthorized identifiers, rate limits, safe errors, and idempotent retries.
- For webhooks/background jobs, verify invalid signatures, replayed events, duplicate delivery, timeout/retry behavior, and failed external dependencies if used.

## E2E, accessibility, and performance
- Cover primary onboarding, core user task, recovery from failures, and account/session exit on approved devices and browsers.
- Check keyboard navigation, labels, focus, error announcements, loading/empty states, and responsive layouts against `../01-FRONTEND/DESIGN_SYSTEM.md`.
- Define project-specific latency/throughput and resource thresholds, with reproducible load assumptions and an owner. Do not impose arbitrary universal targets.

## Fixtures and environments
- Synthetic test users and data: [Plan]
- External services: [Mocks/sandbox and assumptions]
- Reset/isolation: [Method]
- Use separate development/test credentials and infrastructure, never production customer data for automated tests.
- Make test fixtures deterministic, resettable, and tenant-isolated. State what is mocked versus exercised against a real provider.

## Safety configuration check
- `node 11-SCRIPTS/checks/test-garde-fou.cjs` verifies the Claude Code hook against known dangerous commands, the protection of the security configuration, and fail-closed behavior (Node missing, script missing or broken). Run it at the start of `/plan-projet` and after any change to `.claude/settings.json` or `.claude/hooks/`.

## Verified commands
All frontend commands run from `01-FRONTEND/`.
- Lint: `npm run lint` (ESLint 9, `eslint.config.js`).
- Unit: `npm test` (Vitest; tests next to the code, `*.test.js`).
- End-to-end: Not configured (Playwright + axe planned in lot 06).
- Build: `npm run build` (Vite). Type check: Not applicable (Q-T3: JavaScript + htm).
- Dependency audit: `npm audit`.
- Security and RLS checks: Not configured (pgTAP on local Supabase planned in lot 03; requires Docker Desktop running).
- CI workflow: `.github/workflows/ci.yml` on push to `main` and on pull requests: `npm ci`, lint, test, build, `npm audit --audit-level=moderate`.

Only list commands that exist in the current project; do not invent framework scripts or mark unexecuted checks as completed.

## Release criteria
- Required passing scenarios: [Approved critical user journeys and security boundaries].
- CI gates: [Configured build, type/lint, tests, dependency/secret checks]. Record which checks are manual or not configured.
- Critical authorization/security failures block release. The named owner must review other failures and explicitly document any accepted residual risk.
- Release decision and owner: [Who approves, when, and with what evidence]. Production operations still require explicit authorization.

## Results
For each execution record date, environment, exact command, result, failures, and untested limitations. Allowed status values: **Not run / Passed / Failed / Blocked / Not applicable**. Keep Not run distinct from Passed and record the actual evidence; never fabricate a test result. Add regression tests for important bug fixes and previously discovered security issues.
