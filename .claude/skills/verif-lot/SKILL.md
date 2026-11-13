---
name: verif-lot
description: Verify a finished lot — real checks, CI status, independent security review, update the plan to À VALIDER (only if nothing blocks), report and stop.
argument-hint: "[lot number]"
disable-model-invocation: true
---

# /verif-lot — Verify a lot and stop for validation

Lot: $ARGUMENTS

1. **Real checks.** Run the build, lint, typecheck, test and audit commands that really exist (check `package.json` or equivalent first). Fix the errors caused by this lot and re-run. Run locally the same commands as the CI workflow; if the repository has a remote with CI, say that the user can confirm the pipeline after pushing.
2. **Diff for the review.** `git diff main...HEAD > .claude/reviews/lot-NN.diff` and list changed files (`git diff --name-only main...HEAD`).
3. **Independent review.** Delegate to the `security-reviewer` subagent with the lot number, the changed files, the diff path and the check results. Save its full report to `06-SECURITY/audits/lot-NN.md`.
4. **Fix blocking findings.** Fix every `CRITIQUE` and `ÉLEVÉE` finding within the lot scope, re-run the checks, and ask the reviewer to re-check those points. `MOYENNE` / `FAIBLE` findings are reported and may be fixed or scheduled.
5. **Gate.** The lot may be set to `À VALIDER` only if: required checks pass (or are `NON VÉRIFIÉ` with a cause), and no `CRITIQUE` / `ÉLEVÉE` finding remains open. Otherwise set it to `BLOQUÉ`, explain why, and offer two options: fix, or the user accepts the risk in writing (record their exact words in the lot sheet and the `06-SECURITY/SECURITY.md` risk register).
6. **Update documents.** `10-DOCS/PLAN_IMPLEMENTATION.md` (section « FIN DE LOT » and status) and `08-TESTS/TESTING.md` results with real statuses (`Passed / Failed / Not run / Blocked`). Never write `VALIDÉ`.
7. **Report in French** with exactly these headings:
   - **CE QUI A ÉTÉ FAIT**
   - **TESTS EXÉCUTÉS** (command → result; `NON VÉRIFIÉ` for anything not run)
   - **REVUE SÉCURITÉ** (verdict, open findings, path of the report) — remind that an AI review is not a guarantee
   - **COMMENT JE VÉRIFIE** (a concrete mini-test: screen/URL, action, expected result, plus one forbidden-access check)
   - **CE QUI RESTE**
8. **STOP.** End with: « Réponds **« Je valide l'étape N »** puis lance `/cloturer-lot N` pour l'intégrer à `main`, ou décris les corrections à faire. »
