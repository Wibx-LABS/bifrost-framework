---
type: reference
status: active
topic: bifrost
---

# Bifrost Documentation Index

**Navigation hub for the Bifrost AI-powered feature orchestration framework.**

This index points you to the right document based on what you need to do. All documentation is consolidated here — no duplication, no stale files.

---

## Quick Start: Pick Your Scenario

### "I want to understand the system"
→ **[architecture.md](architecture.md)** — System design, the 7 agents, 8 skills, workflow

### "I want to initialize a feature"
→ **[initialization.md](initialization.md)** — How `bifrost init` works, the interrogation process, CLI flow

### "I need details on a specific agent or skill"
→ **[agents-and-skills.md](agents-and-skills.md)** — Complete spec for each of the 7 agents + 9 skills

### "I'm building the framework"
→ **[implementation-plan.md](implementation-plan.md)** — Phase-by-phase roadmap (10 phases, 6-8 weeks)

### "I need to know what success looks like"
→ **[success-criteria.md](success-criteria.md)** — Metrics, targets, and how to measure progress

### "I need to explain this to leadership"
→ **[strategy.md](strategy.md)** — Business case, ROI, why this matters

### "I need to understand a binding architectural decision"
→ **[decisions/README.md](decisions/README.md)** — Index of ADRs (ADR-006 through ADR-010)

### "I'm authoring code or reviewing delivery"
→ **[principles/delivery-standards.md](principles/delivery-standards.md)** — Frontend-team delivery standards (non-negotiable)

---

## The Bifrost Idea (60 Seconds)

**Problem:** Product team can't generate frontend code independently. Backend dev codes everything → bottleneck.

**Solution:** Product generates code using Claude Code + Antigravity, guided by Bifrost framework (agent templates + skill protocols + knowledge graphs).

**Result:** Backend dev shifts from "coder" to "reviewer". Feature velocity 3-4x faster.

**Path forward:**
1. Build core framework (6-8 weeks)
2. Pilot with 1 real feature (2 weeks)
3. Measure + iterate (2 weeks)
4. Roll out to all Product (ongoing)

---

## Master Document Map

| File | Purpose | Size | For Whom |
|------|---------|------|----------|
| **[architecture.md](architecture.md)** | System design, components, workflow | ~1000 lines | Engineers, architects, new team members |
| **[initialization.md](initialization.md)** | `bifrost init` command walkthrough, CLI UX | ~700 lines | Anyone setting up a feature project |
| **[agents-and-skills.md](agents-and-skills.md)** | Complete agent + skill reference | ~900 lines | Implementers, designers, anyone needing detailed specs |
| **[implementation-plan.md](implementation-plan.md)** | Build roadmap (10 phases, checklist) | ~800 lines | Framework builders, project managers |
| **[success-criteria.md](success-criteria.md)** | Metrics, targets, progress tracking | ~600 lines | Anyone tracking progress or validating success |
| **[strategy.md](strategy.md)** | Business case, ROI, stakeholder pitch | ~700 lines | CTO, decision makers, leadership |
| **[decisions/](decisions/)** | Architecture Decision Records (5 ADRs) | ~2000 lines total | Anyone understanding "why" we decided something |
| **[principles/delivery-standards.md](principles/delivery-standards.md)** | Code delivery standards (from Frontend team) | ~500 lines | Code authors, PR reviewers |

---

## How to Use This Folder

### Scenario: "I'm building the Bifrost framework"

1. **Start:** [implementation-plan.md](implementation-plan.md) — Phase breakdown + checklist
2. **Then:** [architecture.md](architecture.md) — What you're building
3. **Then:** [agents-and-skills.md](agents-and-skills.md) — Detailed specs for each component
4. **Reference:** [decisions/README.md](decisions/README.md) — Non-negotiable decisions
5. **For code:** [principles/delivery-standards.md](principles/delivery-standards.md)

### Scenario: "I'm using Bifrost to build a feature"

1. **Start:** [initialization.md](initialization.md) — Set up your project
2. **Then:** [architecture.md](architecture.md) — Understand the workflow
3. **Then:** [agents-and-skills.md](agents-and-skills.md) — What each agent will do
4. **Ongoing:** [success-criteria.md](success-criteria.md) — Track progress

### Scenario: "I need to explain Bifrost to leadership"

1. **Start:** [strategy.md](strategy.md) — Business case + ROI
2. **Then:** [architecture.md](architecture.md) (section: "The System at a Glance") — High-level design
3. **Then:** [success-criteria.md](success-criteria.md) (section: "Business Success") — Success definition

### Scenario: "I'm implementing a specific component"

Use this table to find the right section:

| Component | Best Source |
|-----------|-------------|
| Agent templates | [agents-and-skills.md](agents-and-skills.md) + [architecture.md](architecture.md) |
| Skills | [agents-and-skills.md](agents-and-skills.md) |
| `bifrost-init` command | [initialization.md](initialization.md) |
| Hydration system | [architecture.md](architecture.md) (Knowledge Graph Integration) |
| STATE.md format | [architecture.md](architecture.md) (State Management) |
| Autonomy levels | [architecture.md](architecture.md) (Autonomy Levels) |
| CI/CD pipelines | [architecture.md](architecture.md) (CI/CD Integration) |
| Git hooks | [architecture.md](architecture.md) (Workflow section) |

---

## Active Architectural Decision Records

These are **binding decisions**. Every agent and skill respects them. No implementation without understanding these.

| ADR | Decision | Affects |
|-----|----------|---------|
| **[ADR-006](decisions/ADR-006-feature-lifecycle.md)** | Feature lifecycle: 7 agents, 9 skills, per-feature artifacts | Everything |
| **[ADR-007](decisions/ADR-007-wiboo-monorepo.md)** | v0 target: Wiboo Angular 15 + Nx 16 monorepo (single stack) | Hydration, knowledge graph, scope |
| **[ADR-008](decisions/ADR-008-trajectory-context-protocol.md)** | TRAJECTORY.md as locked-at-launch invariant; mandatory first-read | @Intake, all agents, handoff protocol |
| **[ADR-009](decisions/ADR-009-bifrost-hr.md)** | Agents fixed at 7; skills grow via `bifrost-hr` skill | Extending capabilities, agent count |
| **[ADR-010](decisions/ADR-010-artifact-set.md)** | 10-artifact canonical set; HEALTH deprecated; AUTONOMY → STATE frontmatter | All artifacts, templates, validation |

---

## Document Relationships

```
ARCHITECTURE (core)
├─ describes the 7 AGENTS + 9 SKILLS
│  └─ detailed in AGENTS-AND-SKILLS
├─ describes the workflow
│  └─ operational details in INITIALIZATION
└─ used to build the system
   └─ phase plan in IMPLEMENTATION-PLAN

SUCCESS-CRITERIA (validation)
├─ measures built system via IMPLEMENTATION-PLAN
├─ validates ARCHITECTURE works
└─ used in STRATEGY to justify cost

STRATEGY (justification)
├─ justifies building via IMPLEMENTATION-PLAN
├─ explains why via ARCHITECTURE
└─ proves value via SUCCESS-CRITERIA

DECISIONS (constraints)
├─ bind all implementation choices
└─ override skills/templates on conflict

PRINCIPLES (standards)
├─ define what "done" looks like
└─ gating criteria for PRs
```

---

## Knowledge Base (Not Documentation)

Separate from this framework documentation:

- **`knowledge/`** — Technical reference for Bifrost frontend codebase (API contracts, components, naming conventions, tech stack)
- **`core/templates/`** — Artifact templates (PATIENT.md, TRAJECTORY.md, IMPACT.md, etc.)
- **`core/agents/templates/`** — Agent prompt templates (Intake_Template.md, Planner_Template.md, etc.)
- **`core/skills/`** — Skill files (one SKILL.md per skill)
- **`tools/bifrost-cli/`** — CLI tool documentation (separate from framework; see `tools/bifrost-cli/README.md`)

---

## Reading Paths by Audience

### Framework Builders (Engineers)
1. [implementation-plan.md](implementation-plan.md) → overview of phases
2. [architecture.md](architecture.md) → what you're building
3. [agents-and-skills.md](agents-and-skills.md) → detailed component specs
4. [decisions/README.md](decisions/README.md) → non-negotiable constraints
5. [principles/delivery-standards.md](principles/delivery-standards.md) → code quality gates

### Feature Users (Product Developers)
1. [initialization.md](initialization.md) → set up your project
2. [architecture.md](architecture.md) → understand the workflow
3. [agents-and-skills.md](agents-and-skills.md) → understand each agent
4. [success-criteria.md](success-criteria.md) → track your progress

### Leadership / Decision Makers
1. [strategy.md](strategy.md) → full business case + ROI
2. [architecture.md](architecture.md) → high-level system design (first section only)
3. [success-criteria.md](success-criteria.md) → Business Success section
4. [implementation-plan.md](implementation-plan.md) → timeline + phases

### Code Reviewers
1. [principles/delivery-standards.md](principles/delivery-standards.md) → what you're checking for
2. [architecture.md](architecture.md) → understand the design being delivered
3. [success-criteria.md](success-criteria.md) → what "done" looks like

---

## Version History

| Date | Change |
|------|--------|
| 2026-04-29 | Consolidated all framework docs into single `docs/` folder; eliminated `instructions/` duplication; moved ADRs, removed stale planning docs |
| 2026-04-27 | ADRs 006-010 finalized; consolidated instructions folder created |

---

## Notes

- **All information is current and non-redundant.** Original duplicate documents in `docs/architecture/` and `docs/planning/` have been deleted.
- **ADRs are authoritative.** If something here conflicts with an ADR, the ADR wins.
- **This is living documentation.** As the framework evolves, keep these files up to date.
- **For CLI tool docs**, see `tools/bifrost-cli/README.md` (separate from framework docs).
