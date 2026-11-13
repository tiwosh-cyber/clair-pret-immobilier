# Code Style

## Languages and conventions
- Language/version: JavaScript (ES modules), React 19 rendered with `htm` (no JSX), Node ≥ 20 (CI uses Node 22).
- Naming: camelCase functions/variables, PascalCase components, kebab-case folders; SQL in snake_case.
- Formatting/linting: ESLint 9 recommended rules (`01-FRONTEND/eslint.config.js`); `npm run lint`.
- Type safety: Not applicable (Q-T3); validate inputs explicitly at boundaries.
- Module system, import aliases, package manager, and runtime versions: ESM, relative imports, npm with `package-lock.json`, Vite build. Commands: `npm run dev | lint | test | build`, `npm audit` (from `01-FRONTEND/`).

## Organization
- Directory responsibilities: [Match ARCHITECTURE.md]
- Shared components/utilities: [Where they live]
- Business logic placement: [Where it belongs]
- Import/dependency boundaries: [Allowed relationships]
- Separate UI, domain logic, server-only code, provider adapters, and shared contracts according to the **selected** architecture.
- Do not create unused parallel services or duplicative abstractions for optional providers.

## Coding rules
- Keep functions focused; follow established repository patterns.
- Validate external inputs at the trust boundary.
- Handle loading, empty, error, and success states explicitly.
- Avoid silent failures and undocumented magic values.
- Reuse existing components before introducing new abstractions.
- For TypeScript projects, define rules for strictness, unknown external data, explicit domain types, and avoiding unsafe casts rather than using `any` to hide errors.
- Keep business rules testable and make side effects, retries, and external service boundaries explicit.
- Prefer parameterized database access and provider SDKs; do not build SQL, shell commands, or HTML with untrusted interpolation.
- Do not treat client-side validation or access checks as a substitute for server/database/storage authorization.

## API, data, and asynchronous conventions
- Request/response schemas, pagination, error codes, and API versioning: [Agreed contracts; see `ARCHITECTURE.md`].
- Idempotency, timeout, retry/backoff, and cancellation rules for external integrations/jobs: [When relevant].
- Database migration style and transaction/rollback expectations: [Chosen provider and tool].
- Use shared types/contracts only where both sides actually consume them; do not import privileged backend modules into frontend code.

## Errors and logging
- Error shape: [Standard contract]
- Logging levels and redaction: [Rules from SECURITY.md]
- Surface actionable user-facing errors without leaking stack traces, credentials, private records, or internal IDs unnecessarily.
- Record correlation IDs for relevant server-side failures and avoid swallowing exceptions silently.

## Dependencies
- New packages: [Approval policy]
- Versioning/lockfile practice: [Policy]
- Review maintainers, license suitability, bundle size, security advisories, and necessity before adopting packages.
- Pin installed versions where appropriate and commit the actual lockfile; do not invent a dependency or command because it is common in another project.

## Review checklist
- Implementation matches the approved feature acceptance criteria.
- Types, format, and lint checks use confirmed repository commands.
- No credentials or unrelated files in the diff.
- Tests cover meaningful changed behavior.
- Sensitive resource actions have negative authorization tests, and UI work respects the approved design/accessibility system.
- Changes to APIs, data models, config, or roles are reflected in their authoritative Markdown files.

## Verified commands
- Format: [Command or Not configured]
- Lint: [Command or Not configured]
- Type check: [Command or Not configured]
- Test: [Command or Not configured]
- Build: [Command or Not configured]
Never invent commands or claim checks passed without running them.
