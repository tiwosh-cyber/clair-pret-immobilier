# Authentication and authorization instructions

Scope: `04-AUTH/`.

- Read `AUTH.md` and `../06-SECURITY/SECURITY.md` for all changes.
- Select one identity provider after the project owner approves the choice.
- Keep session validation, identity, roles and resource authorization conceptually separate.
- Verify identity and permissions at trusted boundaries; do not trust editable client metadata for role decisions.
- Define approved login/recovery journeys, session expiry/revocation, membership changes, and sensitive-action reauthentication in `AUTH.md`.
- Use the approved action/resource permission matrix, not a global "signed-in users can do everything" rule.
- For Supabase, never authorize from user-editable `user_metadata`; server-managed claims may require refresh before new permissions take effect.
- Never expose privileged provider keys in frontend code.
- Apply risk-appropriate MFA and login abuse controls only when the product/provider requires them.
- Test sign-in, sign-out, recovery, expired/revoked sessions, denied access and tenant isolation.
