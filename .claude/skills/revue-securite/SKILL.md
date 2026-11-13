---
name: revue-securite
description: Run an independent security review of the current changes or of a given scope with the read-only security-reviewer subagent.
argument-hint: "[scope: lot number, folder, or 'global']"
disable-model-invocation: true
---

# /revue-securite — Independent security review

Scope: $ARGUMENTS (default: changes on the current branch compared with `main`).

1. Prepare the material the reviewer cannot produce itself (it has no shell):
   - lot or current branch: `git diff main...HEAD > .claude/reviews/<scope>.diff` and `git diff --name-only main...HEAD`;
   - folder: the list of files in that folder;
   - `global`: the list of application folders actually used, plus the latest results of tests, CI and dependency audit.
2. Delegate to the `security-reviewer` subagent with the scope, the relevant lot of `10-DOCS/PLAN_IMPLEMENTATION.md`, the file list and the diff path.
3. For scope `global`, also ask it to fill the « Security release gate » table of `06-SECURITY/SECURITY.md` with evidence or `Not run`.
4. Save the report to `06-SECURITY/audits/<scope>-<YYYY-MM-DD>.md` and relay it to the user in French without softening it: verdict, findings table, missing negative tests, checks not covered.
5. Do not fix anything in this command; propose the fixes and wait for the user's decision. Remind that an AI review reduces risk but is not a guarantee.
