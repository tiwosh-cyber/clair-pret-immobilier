# Security instructions

Scope: `06-SECURITY/`.

- `SECURITY.md` is the detailed security source of truth; root `AGENTS.md` (read directly by Claude Code when AGENTS.md support is enabled) security baseline applies everywhere.
- Review identity, authorization, tenant isolation, secret management, input validation, privacy and abuse prevention.
- Identify trust boundaries, product-specific threats, and any high-impact residual risks before security-sensitive implementation.
- For database access, check `../03-DATABASE/DATABASE.md`; for file access, check `../05-STORAGE/STORAGE.md`.
- For Supabase, verify RLS and storage policies and keep privileged credentials server-side.
- Avoid weakening controls or logging sensitive values to resolve errors.
- For APIs or webhooks, review validation, signatures/idempotency, rate limits, and browser/session controls as applicable.
- Require concrete tests for denied access and cross-tenant boundaries; follow the documented security release gate and record blockers honestly.
