---
name: livraison
description: Step 6 of the workflow — prepare, check and document delivery (staging, production authorization, post-deployment tests, monitoring, maintenance). The user runs every deployment.
argument-hint: "[preparation | preprod | production | suivi]"
disable-model-invocation: true
---

# /livraison — Delivery (workflow step 6)

Phase requested: $ARGUMENTS

## Non-negotiable rules
- Claude never deploys, never runs a remote migration, never sets secrets on a hosting provider, never pushes. The hook and permissions block these actions. Claude prepares the **exact commands**, the user runs them and pastes the result.
- Production requires the sentence **« J'autorise la mise en production de la version X »**, written by the user for this precise version. A previous authorization never covers a new version.
- Use only synthetic test accounts on deployed environments. Never create, modify or delete real user data during checks.
- Every phase updates `07-INFRASTRUCTURE/RELEASES.md` and, where relevant, `07-INFRASTRUCTURE/DEPLOYMENT.md`.
- **Git during delivery.** At the end of each phase, commit the delivery documents directly on `main` with `docs(release): vX.Y.Z <phase>`, after the user confirms. Only delivery documents are allowed in these commits (`RELEASES.md`, `DEPLOYMENT.md`, `SECURITY.md`, `06-SECURITY/audits/`, `TESTING.md` results); any code or configuration change goes through a lot (`hotfix-NN` if urgent). `main` must be clean at the end of every phase.
- **Tag.** The version is the annotated tag `vX.Y.Z`, placed in phase `preparation` on the `main` commit that will be deployed. Staging and production deploy **that tag**, never a later commit. Pushing the tag is done by the user.

## Phase `preparation` — Is the version ready?
1. Check that every MVP lot is `VALIDÉ` and merged into `main`, and that `main` is clean.
2. Re-run on `main` the real lint, typecheck, test, build and audit commands; report CI status.
3. Run `/revue-securite global` and fill the « Security release gate » of `06-SECURITY/SECURITY.md` with evidence or `Not run`. Any open `CRITIQUE` / `ÉLEVÉE` blocks delivery unless the user accepts the risk in writing.
4. Check `07-INFRASTRUCTURE/DEPLOYMENT.md`: separate environments, list of environment variable **names** per environment, backup and rollback plan, monitoring, owner. List what is still `À définir`.
5. Check user-facing legal and privacy basics required by the PRD (legal notice, privacy policy, cookie consent if applicable). Report them as missing if absent; do not write legal text as if it were validated.
6. Propose a version number (for example `v1.0.0`) and create the entry in `RELEASES.md` with status `PRÉPARÉE`.
7. Commit `docs(release): vX.Y.Z preparation` on `main` (after confirmation), then create the annotated tag `vX.Y.Z` on that commit (after confirmation). Remind the user to push `main` and the tag if they use a remote.
8. **STOP** with a verdict: `PRÊT POUR PRÉPROD` / `PRÊT AVEC RÉSERVES` / `BLOQUÉ`.

## Phase `preprod` — Staging
1. Give the user, step by step, for the tag `vX.Y.Z`: the secrets to set on the staging environment (names only), the migration command for the staging database, the deployment command. The user runs them.
2. After the user gives the staging URL, run **non-destructive** checks only: smoke test of critical journeys (with an existing E2E tool if configured, otherwise a manual checklist), HTTPS and security headers, forbidden-access checks with two synthetic accounts (user A cannot read user B's data), error pages, responsive check.
3. Record results in `RELEASES.md` (status `PRÉPROD OK` or `PRÉPROD KO`) and in `08-TESTS/TESTING.md`; commit `docs(release): vX.Y.Z preprod` after confirmation.
4. **STOP.** If everything passes: « Si tu veux mettre en production, écris **« J'autorise la mise en production de la version X »**. »

## Phase `production` — Go-live under the user's control
1. Check that the exact authorization sentence for this version is in the conversation. Otherwise stop.
2. Check that a database backup exists and that the rollback procedure is written (previous deployment to restore, migration compatibility).
3. Give the user the exact production commands in order (migration, deployment), with what to verify after each one. The user runs them.
4. After deployment: read-only smoke tests on the production URL (pages load, login with a synthetic test account if one is planned, no error in visible logs). No write operations on real data.
5. Update `RELEASES.md` (status `EN PRODUCTION`, date, tag, who authorized with the exact sentence, rollback = previous tag) and commit `docs(release): vX.Y.Z production` after confirmation.
6. If a check fails: recommend the rollback, give the commands, let the user decide.

## Phase `suivi` — Monitoring and maintenance
1. Check that monitoring is really configured (uptime, error tracking, logs, alerts reaching the user). List what is missing; never claim monitoring exists without evidence.
2. Propose a first-48-hours checklist and a monthly maintenance routine: dependency audit, security updates, backup restore test, review of logs and access, renewal of expiring keys.
3. Any fix or evolution goes through a new lot (`/lot`, `/verif-lot`, `/cloturer-lot`), then a new version through `/livraison preparation`. An urgent fix uses a short lot named `hotfix-NN`, with the same checks.
