---
name: cloturer-lot
description: After the user wrote « Je valide l'étape N », record the validation on the lot branch, commit, show what enters main, merge with the user's confirmation and re-check main. main stays clean.
argument-hint: "[lot number]"
disable-model-invocation: true
---

# /cloturer-lot — Close a validated lot and merge it into main

Lot: $ARGUMENTS

Principle: **every document update happens on the lot branch, before the merge.** After the merge, `main` must be clean (`git status` shows nothing to commit).

1. **Check.** The user wrote **« Je valide l'étape N »** for this lot in the conversation; the lot is `À VALIDER`; no `CRITIQUE` / `ÉLEVÉE` finding is open (or a written risk acceptance is recorded). You are on the branch `lot-NN-…`. Otherwise stop and say what is missing.
2. **Record the validation on the lot branch.** In `10-DOCS/PLAN_IMPLEMENTATION.md`: status `VALIDÉ`, section « CLÔTURE » filled, and a row in the validation log with the date, the user's exact sentence and the branch name. Update `08-TESTS/TESTING.md` if results changed. Do not write a merge commit hash anywhere: it does not exist yet, and `git log --merges` finds it later.
3. **Final commit on the lot branch.** `git status`, then commit everything with `lot-NN: <IDs> <summary>`, after the user confirms. The working tree must then be clean.
4. **Show what will enter `main`.** `git log --oneline main..HEAD` and `git diff --stat main...HEAD`. Point out anything unexpected (files outside the lot, lockfile, migrations, configuration).
5. **Merge after confirmation.** Ask « Je fusionne `lot-NN-…` dans `main` ? ». After the user confirms: `git switch main`, then `git merge --no-ff lot-NN-short-name -m "merge lot-NN: <summary>"`. On a conflict, stop and explain it; never resolve it by discarding changes.
6. **Re-check `main`.** Run the real lint, typecheck, test and build commands. Then `git status` must be clean.
   - If a check fails: say so plainly, do not modify `main` directly. Create `lot-NN-correctif` from `main`, fix there, run `/verif-lot`, then close it with this same procedure. The next lot waits until `main` is green.
7. **Report.** Give the merge commit (`git log --merges -1 --oneline`). Never push. End with: « Le lot N est dans `main`. Si tu utilises GitHub, c'est à toi de faire `git push`. Prochaine étape : `/lot N+1`. »
