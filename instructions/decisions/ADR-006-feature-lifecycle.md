# ADR-006: Feature lifecycle, 7 agents, 9 skills (with bifrost-hr per ADR-009)

**Status:** accepted

## Decision

Bifrost runs a **per-feature hospital-model lifecycle** with seven named agents driven by nine skill libraries (8 original + `bifrost-hr` per [ADR-009](ADR-009-bifrost-hr.md)). The unit of work is a *feature* (Product-defined), not a screen. Scope enters as natural-language text in `PATIENT.md`. Backend dependencies are resolved by reviewing `HANDOFF.md` against the knowledge graph, not by walking placeholder tags.

### The seven agents

| Agent | When | Reads | Produces |
|---|---|---|---|
| `@Intake` | `/bifrost:start` | PATIENT.md + knowledge graph | TRAJECTORY.md + IMPACT.md |
| `@Planner` | `/bifrost:plan` | TRAJECTORY.md + IMPACT.md | PLAN.md |
| `@CodeGen` | `/bifrost:build` | TRAJECTORY.md + PLAN.md + skills + knowledge | source code + CODE_REVIEW.md |
| `@QA` | `/bifrost:qa` | TRAJECTORY.md + source + qa-validator skill | QA_REPORT.md (PASS/FAIL gate) |
| `@Reviewer` | `/bifrost:deliver` | TRAJECTORY.md + all artifacts + git | HANDOFF.md + PR opened |
| `@Conductor` | continuous | STATE.md + every artifact + git | updated STATE.md |
| `@Monitor` | continuous (background) | `.bifrost/` + filesystem + git | VITALS.md (when drift) |

### The nine skills

`bifrost-system-context`, `bifrost-code-standards`, `bifrost-api-integration`, `bifrost-component-gen`, `bifrost-code-review`, `bifrost-qa-validator`, `bifrost-graphify-ref`, `bifrost-state-management`, `bifrost-hr`. Each at `core/skills/<skill-name>/SKILL.md`.

### Per-feature artifact set

Per [ADR-010](ADR-010-artifact-set.md): `PATIENT.md`, `TRAJECTORY.md`, `IMPACT.md`, `PLAN.md`, `STATE.md`, `CODE_REVIEW.md`, `QA_REPORT.md`, `HANDOFF.md`, `VITALS.md`, `PROJECT_CONTEXT.md`. **STATE.md is the single source of truth** ("if it's not in STATE.md, it didn't happen"), `@Conductor`-owned, validated by pre-commit git hook.

### Hydration

Agent templates contain `{{INJECTION_POINTS}}` (e.g. `{{PROJECT_NAME}}`, `{{TARGET_PATH}}`, `{{TECH_STACK}}`, `{{NAMING_CONVENTIONS}}`, `{{GOTCHAS}}`). The `bifrost-init` CLI replaces them at init time using values from interview answers + `knowledge/` files. Templates are read directly by Claude Code / Antigravity after hydration; there is no runtime template engine.

### Autonomy levels

Three levels stored in STATE.md frontmatter `autonomy:` field per [ADR-010](ADR-010-artifact-set.md):
- **Task-Gated** (default) — approval before each task
- **Phase-Gated** — approval per phase
- **Full** — autonomous within the lifecycle (still hard-stops at TRAJECTORY abort + qa→deliver gate)

`@Conductor` enforces.

### Slash commands

`/bifrost:start` (`@Intake`) · `/bifrost:plan` (`@Planner`) · `/bifrost:build` (`@CodeGen`) · `/bifrost:qa` (`@QA`) · `/bifrost:deliver` (`@Reviewer`) · `/bifrost:status` (current feature state) · `/bifrost:rounds` (CTO view of all features) · `/bifrost:help`

### What is NOT in v0

- Placeholder convention (`@bifrost:placeholder` inline tags + `connections.json` sidecar) — superseded; backend wiring is verified via the knowledge graph + API-contract validation in `@QA` + GitHub Actions.
- Screen ingest from Figma — not in v0; scope enters as text in PATIENT.md.
- Per-screen ephemeral runs — the unit is a feature.

## Where to read more

- **Lifecycle architecture** (the system at a glance, the workflow diagram): [`instructions/01-ARCHITECTURE.md`](../01-ARCHITECTURE.md)
- **Agent + skill detailed specs** (each agent's input/output/job): [`instructions/03-AGENTS-AND-SKILLS.md`](../03-AGENTS-AND-SKILLS.md)
- **Operational acceptance criteria** (velocity, rework rate, kill-switch): [`instructions/05-SUCCESS-CRITERIA.md`](../05-SUCCESS-CRITERIA.md)
- **Original framework specification**: [`docs/architecture/framework-specification.md`](../../docs/architecture/framework-specification.md)
- **Strategic context** (kill-switch threshold, the three assumptions): [`docs/planning/operation-bifrost.md`](../../docs/planning/operation-bifrost.md)
