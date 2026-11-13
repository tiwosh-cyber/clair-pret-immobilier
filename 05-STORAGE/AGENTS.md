# File storage instructions

Scope: `05-STORAGE/`.

- Read `STORAGE.md` and `../06-SECURITY/SECURITY.md` for all changes to uploads or file access.
- Choose only the required storage provider; provider directories are optional alternatives.
- Validate file type, size, ownership and allowed paths; avoid trusting user-supplied filenames.
- Default to private buckets, enforce bucket/object authorization, and use expiring access where appropriate.
- For Supabase Storage, review RLS on `storage.objects`, including permissions needed for overwrite/upsert. Use Storage APIs, not direct SQL metadata mutations, for object lifecycle operations.
- Test other-user/other-tenant reads, overwrites, deletes, signed URL expiry, and quota/type failures.
- Never store secrets in public files or make private objects public to fix permission failures.
- Keep test uploads synthetic and isolated from production.
