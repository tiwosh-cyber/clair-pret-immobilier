# Frontend instructions

Scope: `01-FRONTEND/`.

- Read `DESIGN_SYSTEM.md` for UI work and `../10-DOCS/PRD.md` for features.
- Keep UI pages, features, components, styles and network services separate.
- Support responsive layouts, keyboard accessibility, loading, empty and error states.
- Follow approved tokens/components and measurable accessibility criteria; ask for missing design decisions instead of inventing brand values.
- Cover permission-denied, session-expired, and recoverable network failures when the feature requires them.
- Use only publicly safe configuration in the browser; never ship service-role or secret credentials.
- Frontend visibility checks never replace server-side authorization or database/storage policies.
- For authentication, private uploads or user data, read `../06-SECURITY/SECURITY.md` and relevant domain rules.
- Prevent accidental caching or disclosure of private user/tenant data in shared UI, logs, or public assets.
- Confirm the framework and package scripts before introducing dependencies or running checks.
- Verify critical responsive/keyboard flows with the actual configured checks; record untested cases in `../08-TESTS/TESTING.md`.
