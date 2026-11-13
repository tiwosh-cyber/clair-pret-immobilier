# Storage decisions

Status: **Unconfigured template**.

## Provider and bucket inventory
- Provider: [Supabase Storage / S3-compatible / local / other]. Selected for: [Reasons and constraints].
- Default to private storage. Make a bucket public only when every intended object is safe for unrestricted public access.

| Bucket/container | Purpose | Public/private | Allowed types and size | Owner / path rule | Retention |
| --- | --- | --- | --- | --- | --- |
| [Bucket] | [Use] | [Visibility] | [Limits] | [User/tenant/system] | [Period] |

## Object permissions and isolation
- Document `LIST`, download/read, upload/create, overwrite/update, move/copy, and delete permissions separately for each bucket and caller type.
- Verify the authenticated identity and the object's owner/tenant on a trusted side. Frontend folder filters do not protect objects.
- For Supabase Storage, enforce relevant RLS policies on `storage.objects` and test permitted/denied operations. Overwriting via upsert requires `INSERT`, `SELECT`, and `UPDATE` permissions as applicable.
- Keep privileged S3/service-role credentials off the frontend; avoid public buckets or broad policies as a workaround for permission errors.
- For Supabase, use Storage APIs for object creation, movement, and deletion. Do not directly mutate storage metadata tables: that can leave orphaned underlying objects.

## File names, upload validation, and scanning
- Object path format: [Trusted user/tenant prefix + generated unique identifier]. Never trust supplied filenames or path segments for ownership.
- Allowed media types/extensions, maximum individual size, total quota, and upload frequency: [Policy by bucket]. Enforce on the trusted boundary/provider, not only in UI checks.
- Verify actual file content/type where feasible, reject dangerous formats for the use case, and consider malware scanning/quarantine for untrusted documents.
- Define upload cancellation, partial failure, duplicate objects, overwrites, and safe processing of images/documents. Never execute uploaded content on a privileged server.

## Downloads and sharing
- Public URL policy: [Public assets only]. Private file access: [Authenticated download / short-lived signed URL / approved proxy].
- Signed URL expiry, who may mint a URL, and behavior after membership removal or revocation: [Policy]. Avoid logging or indefinitely storing bearer-style signed URLs.
- Control caching/CDN exposure for private content; never assume a previously issued signed URL is revoked simply because a user loses access.
- Validate sharing recipient, scope, expiry, and audit requirements before enabling file sharing.

## Abuse, quotas, and operational limits
- Define per-user/tenant quotas, request limits, bandwidth/cost alerts, and responses when limits are reached.
- Check provider-level global and bucket-level limits; do not hardcode a universal file-size limit in this reusable template.
- Decide whether uploads require an authenticated account and when anonymous uploads are explicitly acceptable.

## Retention, deletion, and recovery
- Specify retention, legal holds if applicable, user-initiated deletion, version history, and account/tenant closure behavior.
- Define recovery/backups for essential assets, verification of deletion, orphan cleanup, and backup retention.
- Keep storage lifecycle consistent with privacy and incident rules in `../06-SECURITY/SECURITY.md` and operational recovery in `../07-INFRASTRUCTURE/DEPLOYMENT.md`.

## Storage verification
Test with synthetic users and objects in an isolated environment:
- Authorized upload/download/overwrite/delete for the rightful owner or permitted member.
- Denied access, listing, overwrite, and delete by another user or tenant; rejected path traversal and spoofed ownership.
- File type/size rejection, rate/quotas, expired signed URLs, and revoked sharing (according to the selected provider's guarantees).
- Failure/retry behavior and removal of partial/orphaned objects. Record evidence in `../08-TESTS/TESTING.md`.
