# Configure a new project

This folder is a **reusable decision and instruction skeleton**, not a configured or running SaaS. Perform these steps for each new project and ask for approval when an important choice is unresolved.

1. **Product:** Complete and approve `PRD.md`: personas, MVP, feature IDs, permissions, measurable outcomes, constraints, and explicit exclusions.
2. **Architecture:** Choose managed Supabase, custom API, or hybrid in `ARCHITECTURE.md` (APIs, webhooks and automations in `API_INTEGRATIONS.md`); select only necessary frontend, database, auth, storage, hosting, and integrations. Do not assume a backend is mandatory.
3. **Design:** Complete `APP_FLOW.md`, `UX_UI.md` and `../01-FRONTEND/DESIGN_SYSTEM.md` with approved brand decisions, components, responsiveness, and accessibility criteria.
4. **Data and access:** Complete `../03-DATABASE/DATABASE.md`, `../04-AUTH/AUTH.md`, and `../05-STORAGE/STORAGE.md` as applicable. Define ownership, CRUD permissions, RLS/grants for exposed Supabase tables, and private object access before feature implementation.
5. **Security and operations:** Complete `../06-SECURITY/SECURITY.md` and `../07-INFRASTRUCTURE/DEPLOYMENT.md`: trust boundaries, abuse protections, environment separation, secrets, backup/restore, and release approval.
6. **Implementation conventions:** Once the plan is validated, initialize the approved stack during lot 01, then record **verified** format/lint/type/test/build commands in `CODE_STYLE.md` and `../08-TESTS/TESTING.md`.
7. **Plan before coding:** In Plan mode, run `/plan-projet` in Claude Code. Claude inspects `../AGENTS.md`, the active domain instructions and the approved Markdown decisions, then writes `PLAN_IMPLEMENTATION.md` (from `PLAN_IMPLEMENTATION_MODELE.md`) after « Enregistre le plan », with small vertical lots and acceptance tests. Lot 01 includes Git on `main` and a CI workflow. Product gaps go to `QUESTIONS_PRODUIT.md`. Do not build unused optional providers.
8. **Build lot by lot:** `/lot N` (automatically runs `/verif-lot N`: real checks, CI, independent security review; `CRITIQUE`/`ÉLEVÉE` findings block) → « Je valide l'étape N » → `/cloturer-lot N` (commit, diff review, merge into `main`).
9. **Deliver (phase 09):** `/livraison preparation` → `preprod` → `production` → `suivi`. You run every deployment; production requires « J'autorise la mise en production de la version X »; each version is logged in `../07-INFRASTRUCTURE/RELEASES.md`.
10. **Verify and release:** Run configured checks with synthetic data, test denial and cross-tenant isolation, record results, and request explicit authorization before deploying or altering production.

## Approval checkpoints
- Product and scope decisions approved: [Yes/No; owner]
- Active stack and provider choices approved: [Yes/No; owner]
- Data ownership, Auth, RLS/Storage policy model approved where relevant: [Yes/No; owner]
- Release/test evidence and production authorization: [Not yet / Approved by owner]

Keep `[placeholders]` as unresolved decisions until the project owner supplies facts. Mark unused features **Not applicable** rather than inventing configuration.

Do not assume the skeleton already contains functioning app code.
