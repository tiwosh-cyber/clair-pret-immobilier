---
name: plan-projet
description: Phase 07 of the 9-phase workflow — read-only audit of the validated specification documents, then (after the user's go-ahead) write the implementation plan. Never writes application code.
argument-hint: "[optional extra constraints]"
disable-model-invocation: true
---

# /plan-projet — Implementation plan (phase 07)

Extra constraints from the user: $ARGUMENTS

This command has **two separate phases**. Never merge them. Keep the audit concise and do not redo the previously approved architecture.

## Phase A — Audit (read-only)

Recommended: run this phase in Claude Code's native **Plan mode**, which prevents file edits. If the session is not in Plan mode, behave as if it were: read and analyze only, write nothing.

0. **Check the safety prerequisites first** (read-only commands) and report them in a short table before anything else:
   - `node --version` — required: the security hook is a Node script. Without Node, the hook blocks every action by design (fail-closed).
   - `git --version` — required for the lot cycle.
   - `node 11-SCRIPTS/checks/test-garde-fou.cjs` — every case must be conforming. If not, stop and tell the user: the protections are not working as documented.
   - Remind the user to check `/sandbox` (macOS, Linux, WSL2; not available on native Windows) and to add the domains their stack needs (for example their Supabase project) to `sandbox.network.allowedDomains` themselves.
   If Node or Git is missing, or the hook test fails, stop after this step.
1. Read `AGENTS.md`, `10-DOCS/START_HERE.md`, `10-DOCS/PRD.md` and **validated** `10-DOCS/ARCHITECTURE.md` first. Then read only relevant domain documents (UX/UI, Auth, Database, Storage, Integrations, Security, Test, Deployment) required by the actual approved stack and MVP. Do not spend time on unused provider directories or empty optional documents.
2. Use the phase 01–06 Markdown deliverables as the source of truth. Do not ask for or reconcile an obsolete Excel Product Builder.
3. Identify the architecture mode actually chosen (Supabase-managed, custom API, hybrid) and the real stack. Do not add a backend or provider that is not needed.
4. Identify blocking decisions, contradictions and missing dependencies; separate **product questions** (for `10-DOCS/QUESTIONS_PRODUIT.md`) from **technical questions**.
5. Do a first security analysis: sensitive data, trust boundaries, roles, exposed tables, main risks, gaps in the CRUD/RLS matrix or `AUTH.md`.
6. Draft the lot breakdown (in the chat, not in a file):
   - Lot 01 = foundations: initialize the **approved stack during implementation only** (not during planning), `.gitignore`, `.env.example`, Git on `main`, lint/test/build scripts, **CI workflow running those real scripts** (mandatory), dependency audit.
   - Then **vertical slices** (UI + data + authorization/RLS + tests) mapped to real `F-xxx` / `US-xxx` IDs, small enough to validate individually.
   - Last lot = cross-cutting checks (security release gate, accessibility, delivery readiness). Deployment itself belongs to step 6 (`/livraison`), never to a lot.
   - Each lot: expected result, IDs, likely files, security points, acceptance criteria (normal, error, forbidden access), verification commands or `À DÉTERMINER`, user mini-test.
7. Present in French: architecture summary, lot table, product and technical questions, risks. Explain choices simply (the user is a student and must be able to justify them).
8. **STOP.** End with: « Si ce découpage te convient, réponds **« Enregistre le plan »** (ou accepte la sortie du mode Plan). Sinon, indique tes corrections. »

## Phase B — Save the plan (only after « Enregistre le plan » or approval of the Plan-mode exit)

1. Create or update `10-DOCS/PLAN_IMPLEMENTATION.md` from `10-DOCS/PLAN_IMPLEMENTATION_MODELE.md`, exactly as approved in Phase A plus the requested corrections.
2. Add product questions to `10-DOCS/QUESTIONS_PRODUIT.md` (ID, documents/IDs, blocked lot, options, status `OUVERTE`).
3. If an architecture choice needs a trace, add an ADR in `10-DOCS/decisions/` from `ADR_MODELE.md`.
4. These are the only files you may write. No application code, no dependency installation, no migration.
5. **STOP.** End with: « Le plan est enregistré dans `10-DOCS/PLAN_IMPLEMENTATION.md`. Relis-le, puis réponds **« Je valide le plan »** pour lancer le lot 01 avec `/lot 01`. »
