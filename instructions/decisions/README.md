# Decisions (in-repo Architecture Decision Records)

This folder contains the **binding architectural decisions** every Bifrost agent must respect. They are referenced from agent templates, skill files, and artifact templates throughout the framework.

Each ADR is short, focused on what binds behavior, and self-contained — a reader with only the framework repo (no external context) can act on them.

## Active ADRs

| ADR | Decision | Most-affected files |
|---|---|---|
| [ADR-006](ADR-006-feature-lifecycle.md) | Feature lifecycle: 7 lifecycle agents, 8 skills (now 9 with `bifrost-hr` per ADR-009), per-feature artifact set | `instructions/01-ARCHITECTURE.md`, `instructions/03-AGENTS-AND-SKILLS.md`, every agent template |
| [ADR-007](ADR-007-wiboo-monorepo.md) | Wiboo Angular 15 + Nx 16 monorepo as v0 single-stack target; operational acceptance criteria | `instructions/05-SUCCESS-CRITERIA.md`, `knowledge/FRONTEND_REPOSITORY_MANUAL.md`, `core/templates/PROJECT_CONTEXT.md` |
| [ADR-008](ADR-008-trajectory-context-protocol.md) | Trajectory-context protocol — `TRAJECTORY.md` as locked-at-launch invariant store; mandatory first-read; acknowledgement section in every artifact | Every agent template, `core/templates/TRAJECTORY.md`, `core/skills/bifrost-system-context/SKILL.md` |
| [ADR-009](ADR-009-bifrost-hr.md) | Agents fixed at 7; skills grow on demand via `bifrost-hr` (loaded by `@Intake` only) | `core/skills/bifrost-hr/SKILL.md`, `@Intake` template |
| [ADR-010](ADR-010-artifact-set.md) | 10-artifact set; `HEALTH.md` deprecated; `AUTONOMY.md` folded into `STATE.md` frontmatter | `core/templates/STATE.md`, every agent template that references the artifact set |

## How to read these

If you're an agent (Claude Code / Antigravity loading a skill from `~/.claude/skills/bifrost-*/`):
- These ADRs constrain you. They are non-negotiable.
- When a skill or agent template says "per ADR-NNN," you may consult the corresponding file here. The reference is canonical.
- When ADRs and skill instructions appear to conflict, the ADR wins.

If you're a human (Backend reviewer, Product user, framework maintainer):
- These ADRs describe what the framework guarantees. New work that contradicts an ADR is wrong by definition; an ADR can be amended only via an explicit supersede event (a new ADR with the next number, the prior ADR marked superseded with a `superseded_by:` link, every page that referenced the old decision updated, the change logged).
- Each ADR here is a tight, agent-readable reference. They're the canonical operational specs; new agents and skills should be authored against them.

## Related

- **Principles** (stakeholder-stated, non-negotiable behavioral standards): [`instructions/principles/`](../principles/)
- **Architecture overview**: [`instructions/01-ARCHITECTURE.md`](../01-ARCHITECTURE.md)
- **Agent + skill specifications**: [`instructions/03-AGENTS-AND-SKILLS.md`](../03-AGENTS-AND-SKILLS.md)
- **Strategic context** (kill-switch, three assumptions): [`docs/planning/operation-bifrost.md`](../../docs/planning/operation-bifrost.md)
