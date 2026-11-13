# Database instructions

Scope: `03-DATABASE/`.

- Read `DATABASE.md` and `../06-SECURITY/SECURITY.md` before schema or access changes.
- Choose one active provider per project; the provider folders are placeholders, not active integrations.
- Version schema changes, review constraints and protect existing data.
- Maintain user/tenant isolation across queries, policies and migrations.
- If using Supabase, enable RLS for every table in exposed schemas; review SQL grants and per-operation policies together. Authentication alone is not row authorization.
- Check `USING`/`WITH CHECK` ownership rules, views, privileged functions, and client-exposed credentials as required by `DATABASE.md`.
- Use the approved CRUD matrix; never create permissive or cross-tenant policies merely to fix a failed query.
- Never apply destructive or production migrations without explicit authorization.
- Test migrations and positive/negative access restrictions in isolated environments with synthetic identities, including cross-tenant reads and writes.
