# SaaS Template — Claude Code (Codex-compatible) + VS Code

Reusable **documentation and folder** template for React SaaS projects with a custom backend, Supabase-managed services, or a hybrid architecture. It contains project instructions and decision worksheets, **not a working application**.

Open the entire `SAAS-TEMPLATE` folder in VS Code. Start with [`10-DOCS/START_HERE.md`](10-DOCS/START_HERE.md), then give Claude Code the approved specification documents and choose only the providers the project actually needs.

## Navigation

| Folder | Responsibility |
| --- | --- |
| `01-FRONTEND` | UI, pages, React components |
| `02-BACKEND` | Custom API and server, optional |
| `03-DATABASE` | Schema, migrations and data providers |
| `04-AUTH` | Identity, roles and permissions |
| `05-STORAGE` | File storage providers and policies |
| `06-SECURITY` | Cross-cutting security requirements |
| `07-INFRASTRUCTURE` | Hosting, deployment, monitoring |
| `08-TESTS` | Cross-domain tests |
| `09-SHARED` | Shared contracts and utilities |
| `10-DOCS` | Product, architecture and code style |
| `11-SCRIPTS` | Maintenance and development tooling |

## Recommended workflow

1. Fill in and approve [`10-DOCS/PRD.md`](10-DOCS/PRD.md) and [`10-DOCS/ARCHITECTURE.md`](10-DOCS/ARCHITECTURE.md).
2. Complete relevant design, database, Auth, Storage, security, tests, and deployment documents. Mark inactive alternatives **Not applicable**.
3. Open the folder with Claude Code, switch to Plan mode and run `/plan-projet`: Claude reads `AGENTS.md` directly and the domain instructions, audits the documents read-only and proposes the lots; after « Enregistre le plan » it writes `10-DOCS/PLAN_IMPLEMENTATION.md`.
4. After « Je valide le plan », for each lot: `/lot N` (runs real checks, CI and independent security review automatically) → « Je valide l'étape N » → `/cloturer-lot N` (commit, diff review, merge into `main`).
5. Step 6: `/livraison preparation`, `preprod`, `production`, `suivi`. Claude prepares and checks; you run every deployment, and production needs « J'autorise la mise en production de la version X ».
6. Verify behavior and get explicit approval before any production deployment or destructive action.

For a new project, a useful starting request is:

> `/plan-projet` — or, without the command: Read `AGENTS.md`, `10-DOCS/START_HERE.md`, and `10-DOCS/PRD.md`. Identify missing decisions, propose the smallest appropriate architecture, and wait for my approval before installing providers or implementing features.

## Agent configuration

| File | Purpose |
| --- | --- |
| `AGENTS.md` (root and domains) | Shared rules for every coding agent (Claude Code, Codex). Edit these. |
| `.claude/settings.json` | Enforced permissions, OS-level sandbox for shell commands, and the PreToolUse hook registration. No reading `.env`, no push/deploy/remote migration, confirmation before commits, merges, deletions, installs and any unsandboxed retry. |
| `.claude/hooks/garde-fou.cjs` | Hook run before each command or file access: blocks dangerous commands whatever their spelling, and any write to the security configuration. Fail-closed: if Node.js or the script is missing or broken, every action is blocked. |
| `11-SCRIPTS/checks/test-garde-fou.cjs` | Test suite for the hook, run through the real command declared in `settings.json`. |
| `.claude/skills/` | Workflow commands `/plan-projet`, `/lot`, `/verif-lot`, `/cloturer-lot`, `/revue-securite`, `/livraison`. |
| `.claude/agents/security-reviewer.md` | Independent security reviewer used after each lot: no shell, no write access. Reports go to `06-SECURITY/audits/`. |
| `07-INFRASTRUCTURE/RELEASES.md` | Journal of delivered versions (step 6). |
| `.gitignore`, `.env.example` | Keep secrets out of Git; list environment variable names only. |
| `10-DOCS/QUESTIONS_PRODUIT.md` | Product questions sent back to ChatGPT. |

## Important

- This is a documentation and folder skeleton, **not a runnable application**. Do not expect an executable frontend, API or database yet.
- The Markdown documents contain unresolved bracketed fields; fill the relevant fields for **each project** and keep proposals separate from confirmed decisions.
- Optional provider folders do not mean those technologies are installed.
- Directories that contain no files may disappear from ZIP viewers. `.gitkeep` markers preserve the full intended tree.
- No package installation, database migration, production deployment, backup verification, or security test has been performed by distributing this template.
- Permissions, hook, sandbox and AI review reduce risk; none of them is a security guarantee. The sandbox works on macOS, Linux and WSL2 (check with `/sandbox`); on native Windows, use WSL2.

## Architecture-first rule
All technical app directories are optional. The nine-phase Product Builder framing is kept. Phase 04 defines the approved stack; phase 07 generates only a plan; phase 08 lot 01 initializes app code and the appropriate `package.json` from scratch. The existing template does not impose a frontend, backend, auth provider or hosting choice. Security scripts use `.cjs` independently of app `"type": "module"`.

**Claude Code compatibility:** use a Claude Code version/configuration that actually loads `AGENTS.md` (including nested instructions). Verify this in the local Claude Code setup; if it does not, configure AGENTS.md support rather than silently ignoring these rules.
