# Releases

Journal of every delivered version (workflow step 6, `/livraison`). One section per version, newest first. Each version is an annotated Git tag `vX.Y.Z` on `main`; this file is updated by `docs(release): …` commits on `main`. Statuses: `PRÉPARÉE` · `PRÉPROD OK` · `PRÉPROD KO` · `EN PRODUCTION` · `ANNULÉE (rollback)`.

<!--
Example of an entry — not a real release:

## v1.0.0 — EN PRODUCTION
- Date: 2026-11-15 · Tag: v1.0.0 (commit abc1234 on main)
- Content: lots 01–06 (F-001 → F-005)
- Checks on main: lint ✔ · tests ✔ (42) · build ✔ · audit: 0 high
- Security review: 06-SECURITY/audits/global-2026-11-14.md — AUCUN BLOQUANT
- Preprod: https://staging.example.app — smoke ✔ · access A/B ✔ · headers ✔
- Authorization: « J'autorise la mise en production de la version v1.0.0 » — 2026-11-15
- Backup before migration: yes (provider snapshot) · Rollback: redeploy tag v0.9.0 + migration down 0005
- Post-deployment checks: pages ✔ · login test account ✔
-->

