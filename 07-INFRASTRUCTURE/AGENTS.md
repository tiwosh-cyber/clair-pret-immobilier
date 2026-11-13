# Infrastructure instructions

Scope: `07-INFRASTRUCTURE/`.

- Read `DEPLOYMENT.md` and `../06-SECURITY/SECURITY.md` for production-related tasks.
- Configure only infrastructure actually used by the selected project.
- Separate local, test/staging and production environments.
- Avoid storing secrets in repository configurations or logs.
- Verify backups **by restoration**, with documented recovery objectives, monitoring/alerts, and rollback mechanisms appropriate to the selected project.
- Document real CI/CD commands, least-privilege deployment identities, migration compatibility, and cost/usage limits; do not invent configured services.
- Production deployment, infrastructure changes and destructive actions require explicit authorization.
