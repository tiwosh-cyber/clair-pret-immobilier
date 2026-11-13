---
name: lot
description: Phase 08 of the workflow — implement exactly one validated lot of PLAN_IMPLEMENTATION.md on its own Git branch, then stop for verification.
argument-hint: "[lot number]"
disable-model-invocation: true
---

# /lot — Implement one lot (phase 08)

Lot requested: $ARGUMENTS

## Before coding
1. Read `10-DOCS/PLAN_IMPLEMENTATION.md` and its validation log.
2. Check prerequisites. If any is false, explain which one and **stop**:
   - the plan was validated (« Je valide le plan »);
   - for lot N > 01: lot N-1 is `VALIDÉ` **and merged into `main`** (`/cloturer-lot N-1` done);
   - no row with status `OUVERTE` in `10-DOCS/QUESTIONS_PRODUIT.md` blocks this lot.
3. Git (from lot 02 on, or once lot 01 has initialized the repository): `git status` must be clean on `main`; then `git switch -c lot-NN-short-name`. For lot 01, initialize Git on `main` after creating `.gitignore`, propose the first commit of the skeleton, then create `lot-01-fondations`.
4. Announce in French: **CE QUI EST ATTENDU**, files likely to change, acceptance criteria, security points. Set the lot to `EN COURS` in the plan.

## While coding
- For lot 01, initialize the approved stack and its `package.json`/lockfile from scratch only in the applicable app folder. Never adopt configurations from unused template directories. Template guard scripts remain `.cjs` and independent of app module type.
- Only this lot. No bonus features, no anticipation of the next lot.
- Read the `AGENTS.md` of each domain you touch.
- Respect the Design System and the `loading / empty / error / success` states.
- Enforce authorization on the trusted side; for Supabase write versioned migrations with RLS enabled, explicit grants and separate `SELECT/INSERT/UPDATE/DELETE` policies. Apply them only to a **local** database, never to a remote project.
- Add tests for the happy path, errors, and forbidden / cross-user access.
- Lot 01 only: create the CI workflow (for example `.github/workflows/ci.yml`) running the real lint, typecheck, test, build and audit commands, and record those commands in `10-DOCS/CODE_STYLE.md` and `08-TESTS/TESTING.md`.
- Secrets: names only in `.env.example`.
- Keep code simple and explainable: a student must be able to justify each choice in an oral defense.
- If an action is blocked by the permissions, the hook or the sandbox, explain why it was needed and ask; never try another spelling.

## When the code is written
Run `/verif-lot $ARGUMENTS`. Never mark the lot `VALIDÉ` yourself, never merge into `main` here, and never start the next lot.

## Automatic lot verification
- Once coding is finished, execute the full procedure of `/verif-lot N` yourself (actual available checks, negative permission tests where relevant, independent security review, fixes, report). Stop at `À VALIDER` for the user. `/verif-lot` remains a standalone manual command if checks need to be rerun; it is not a mandatory user action.
