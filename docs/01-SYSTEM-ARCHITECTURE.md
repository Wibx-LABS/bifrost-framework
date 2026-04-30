---
type: guide
status: active
topic: bifrost/architecture
---

# BIFROST Architecture

This document consolidates the system design from multiple sources into a single reference. **Source materials:** Technical Roadmap & Visual Architecture, Framework Specification, Bifrost CLI Plan.

---

Bifrost "hydrates" templates so that an external AI (like Claude or Gemini) can act as a specialized role (e.g., @Intake) with all the project-specific knowledge it needs. The hydration is **surgical**—it prunes massive knowledge files into high-density context chunks to minimize token wastage and context loss.

### The Five Invariants (Ground Rules)
1. **Per-Feature Lifecycle**: The unit of work is a *feature*, not a screen.
2. **Fixed Agents (7)**: The lifecycle roles are immutable. Growth happens via **Skills**, not new agents.
3. **Rocket Flight Protocol**: The trajectory is locked at launch. Context lost at intake is lost forever.
4. **Knowledge Graph as Truth**: Backend dependencies are resolved via the graph, not placeholder tags.
5. **Single-Stack Target**: v0 targets Wiboo's Angular 15 + Nx 16 monorepo exclusively.

## The System at a Glance

```
DEVELOPER TEAM                 BIFROST FRAMEWORK                  KNOWLEDGE
    │                           (Monorepo)                         LAYER
    │                               │                              │
    ├─ Claude Code         ┌────────┴────────┐            ┌────────────────┐
    ├─ Antigravity         │                 │            │ Architecture   │
    └─ GSD CLI (optional)  │ • Commands      │            │ Graph (.git)   │
          │                │ • Agents        │            │                │
          │                │ • Skills        │            │ • API contracts│
          └────────────────┤ • Workflows     │────────────┤ • Components   │
                           │ • Templates     │            │ • Naming rules │
                           │                 │            │ • Tech stack   │
                           └────────┬────────┘            └────────────────┘
                                    │
                           ┌────────▼─────────┐
                           │ PER-FEATURE      │
                           │ ARTIFACTS        │
                           │ (.bifrost/)      │
                           │                  │
                           │ • PATIENT.md     │
                           │ • PLAN.md        │
                           │ • STATE.md       │
                           │ • QA_REPORT.md   │
                           │ • HANDOFF.md     │
                           └────────┬─────────┘
                                    │
                           ┌────────▼──────────┐
                           │ BACKEND TEAM     │
                           │ (Code Review)    │
                           │ ↓                │
                           │ Production       │
                           └──────────────────┘
```

---

## The 7 Agents (Named Roles)

Each agent is a markdown template with a specific job. Hydrated per-project with actual context.

| Agent | Input | Job | Output | Efficiency Law |
|-------|-------|-----|--------|----------------|
| **@Intake** | PATIENT.md + TRAJECTORY.md + Architecture Graph | Understand scope + impact | IMPACT.md | Context Density < 40% |
| **@Planner** | IMPACT.md + Architecture Graph | Break into concrete tasks | PLAN.md (5-10 tasks) | Context Density < 40% |
| **@CodeGen** | PLAN.md + All Skills | Write code following rules | Source code + CODE_REVIEW.md | Pattern Density > 60% |
| **@QA** | Source code + QA Skill | Test & find issues | QA_REPORT.md + Pass/Fail gate | Comprehensive Edge-Case Capture |
| **@Conductor** | STATE.md + every step | Track state, decide next action | Updated STATE.md + autonomy decisions | Zero-Noise Status Reporting |
| **@Monitor** | .bifrost/ + filesystem | Detect drift from spec | VITALS.md (what changed?) | Real-time Drift Detection |
| **@Reviewer** | All artifacts + source | Prepare for Backend handoff | HANDOFF.md + PR metadata | Zero-Jargon Delivery |

---

## The 9 Skills (Protocols)

Each skill is a repeatable protocol file. Always loaded into Claude Code + Antigravity. Answers: "What rules do I follow?"

| Skill | When Used | What It Contains | Used By |
|-------|-----------|------------------|---------|
| **bifrost-system-context** | Every session | Master system prompt | @Intake, @Planner, @CodeGen, @QA |
| **bifrost-code-standards** | Before writing code | Naming conventions, file structure, patterns | @CodeGen (self-review) |
| **bifrost-api-integration** | Generating API calls | HTTP client pattern, error handling, auth | @CodeGen, @QA |
| **bifrost-component-gen** | Creating UI components | Component structure, props, testing | @CodeGen |
| **bifrost-code-review** | @CodeGen self-review | Checklist of things to verify | @CodeGen |
| **bifrost-qa-validator** | @QA runs tests | What to test, how to structure tests | @QA, CI/CD |
| **bifrost-graphify-ref** | Need architectural knowledge | How to query the architecture graph | @CodeGen, @Intake |
| **bifrost-state-management** | Updating STATE.md | Format, what to track, timestamps | @Conductor |
| **bifrost-hr** | Extending capabilities | Gap detection, skill bootstrap protocol | @Intake, framework builders |

---

### The Rocket Flight Workflow

The feature lifecycle is modeled after a rocket flight: **Ignition** is the raw `PATIENT.md`, **Landing** is the merged PR. The **Trajectory** is the framework's responsibility.

1. **Ignition (@Intake)**: `/bifrost:start` reads `PATIENT.md` and locks the **TRAJECTORY.md**.
2. **Pathfinding (@Planner)**: `/bifrost:plan` breaks requirements into 5-10 concrete tasks.
3. **Execution (@CodeGen)**: `/bifrost:build` generates source code following skill protocols.
4. **Validation (@QA)**: `/bifrost:qa` runs tests against Trajectory §3 criteria.
5. **Guidance (@Conductor)**: Continuous state management and autonomy enforcement in `STATE.md`.
6. **Telemetry (@Monitor)**: Background drift detection against the locked invariants.
7. **Landing (@Reviewer)**: `/bifrost:deliver` produces `HANDOFF.md` and opens the GitHub PR.

### Autonomy Levels (Enforced by @Conductor)
Set in `.bifrost/STATE.md` frontmatter:
- **Task-Gated**: Approval required before each task (Default).
- **Phase-Gated**: Approval required before each phase.
- **Full**: Autonomous within the lifecycle (stops at Trajectory abort or QA fail).

---

### The Canonical 10-Artifact Set (.bifrost/)

Everything related to one feature lives in the `.bifrost/` directory.

| Artifact | Purpose | Author |
| :--- | :--- | :--- |
| **PATIENT.md** | Feature scope input | Developer |
| **TRAJECTORY.md** | **Locked invariants** (ADR-008) | @Intake |
| **IMPACT.md** | Scope analysis & Gap detection | @Intake |
| **PLAN.md** | Task breakdown (Trajectory tagged) | @Planner |
| **STATE.md** | Execution state & Economic harness | @Conductor |
| **CODE_REVIEW.md** | Self-review report | @CodeGen |
| **QA_REPORT.md** | Test results (Pass/Fail gate) | @QA |
| **HANDOFF.md** | Backend delivery summary | @Reviewer |
| **VITALS.md** | Drift report (when drift happens) | @Monitor |
| **PROJECT_CONTEXT.md** | Per-project system prompt | `bifrost-init` |

> [!NOTE]
> `HEALTH.md` is deprecated (acceptance criteria live in TRAJECTORY §3) and `AUTONOMY.md` is folded into `STATE.md` frontmatter.

---

## State Management: STATE.md

STATE.md is the **single source of truth** for feature execution state.

```markdown
# STATE.md (Economic Harness)

Feature: Add User Notifications
Admitted: 2026-04-27 09:00 UTC
Status: in_progress
Autonomy: Task-Gated
Token Budget: 500,000 (Used: 42,000)
Session Metrics: { turns: 3, redos: 0, context_density: 34% }

## Phase 1: API Integration
- [x] Task 1: Create notification endpoint - COMPLETED 09:15
- [x] Task 2: Add database schema - COMPLETED 10:00
- [ ] Task 3: Write tests - IN_PROGRESS 10:30
- [ ] Task 4: Security audit - NOT_STARTED

## Changes Made
- files/: [api/notifications.js, db/schema.sql]
- tests/: [tests/notifications.test.js]

## Open Issues
- Edge case: User deletes preference mid-request → flagged, needs handling

## Next Actions
1. Complete Task 3
2. QA runs full suite
3. Deliver to Backend

## Commits
- 1234abc: feat: add notification endpoint
- 5678def: test: add notification tests (pending)
```

**@Conductor updates after every step.** Git hooks validate before commit.

---

## Knowledge Graph Integration

The Architecture Graph (internal directory: `knowledge/`) provides:
- **API_CONTRACTS.md** — All endpoint signatures
- **COMPONENT_LIBRARY.md** — Reusable components
- **NAMING_CONVENTIONS.md** — Naming rules
- **TECH_STACK.md** — Dependencies + versions
- **GOTCHAS.md** — Known issues
- **graph.json** — Graphify output (machine-readable)

**How agents use it:**
- **@Intake** queries: "What APIs exist for notifications?"
- **@CodeGen** queries: "What pattern do we use for API calls?"
- **@QA** validates: "Do our API calls match the graph?"

### Sectional Hydration Engine (Technical Specification)

The hydration engine (`builder.ts`) implements surgical markdown section extraction to achieve surgical context density:

**extractMarkdownSections Implementation**
- **Header-Based Stop Logic**: Parses markdown headers (h2, h3, h4) and extracts only relevant sections by hierarchy
- **Sectional Mapping**: `injection-points.json` defines which headers are injected for each agent role (e.g., @Intake receives §1-2 only)
- **Context Reduction Results**: 
  - @Intake: 1065 → 373 lines (65% reduction)
  - @CodeGen: 991 → 737 lines (26% reduction)
  - Target: All agents < 40% context density threshold
- **Instruction Purging**: Redundant inline instruction bloat removed (400+ lines from templates)
- **Pattern Preservation**: High-value operational content retained; zero loss of critical patterns

**Tag Normalization**
- **Case-Insensitive Matching**: `{{TOKEN}}`, `{{token}}`, `{{Token}}` all resolve correctly
- **Kebab-Case and Snake_Case Support**: Handles both naming conventions in template tags
- **100% Hydration Success Rate**: No failed injections; deterministic resolution across global and agent-specific sources

**Dual-Source Resolution**
- **Global Templates**: `core/templates/` contains shared artifact templates (PATIENT.md, TRAJECTORY.md, etc.)
- **Agent-Specific Templates**: `core/agents/templates/` contains role-specialized prompts (Intake_Template.md, CodeGen_Template.md, etc.)
- **Precedence Logic**: Agent-specific overrides global templates; consistent hydration order prevents conflicts

### Framework Benchmarking

framework integrity is verified via `bifrost-benchmark.js`:
- **Isolation Fidelity**: Ensures zero domain leakage between parallel feature lifecycles.
- **Pattern Targeting**: Validates that agents receive the correct surgical context for their specific role.
- **Economic Health**: Ensures session metrics and budgets are initialized and tracked accurately.

---

## Skill Injection

Skills auto-load into Claude Code + Antigravity:

```bash
# Global (all projects)
~/.claude/skills/bifrost-*/SKILL.md
~/.antigravity/skills/bifrost-*/SKILL.md

# Per-project (optional)
.claude/skills/bifrost-*/SKILL.md
.antigravity/skills/bifrost-*/SKILL.md
```

**Result:** Agents always have the latest context. No manual loading.

---

## Autonomy Levels

How much can agents decide independently?

| Level | Means | When Used |
|-------|-------|-----------|
| **Task-Gated** | Each task requires approval before proceeding | Default for features |
| **Phase-Gated** | Each phase requires approval | Complex features |
| **Full** | Agents decide and proceed autonomously | Trusted agents + well-defined scope |

Set in `.bifrost/STATE.md` frontmatter as the `autonomy:` field (per ADR-010).

---

## CI/CD Integration

GitHub Actions validate automatically on push:

```yaml
validate-state:      # Is STATE.md valid?
validate-plan:       # Is PLAN.md valid?
validate-api-calls:  # Do API calls match API_CONTRACTS.md?
validate-standards:  # Does code follow code-standards skill?
validate-qa-report:  # Is QA_REPORT.md complete?
```

On failure: PR gets comment with specific issues. No merge until fixed.

---

## Key Principles

1. **State is everything** — If it's not in STATE.md, it didn't happen
2. **Skills are persistent** — Not session-based; always available
3. **Graph is source of truth** — @CodeGen queries it, not invents patterns
4. **Agents are templates** — Hydrated per-project with real context
5. **Gates are approval points** — Products decides when to proceed
6. **All code is pre-validated** — Security, standards, testing done before Backend sees it
7. **Handoff is documentation** — HANDOFF.md tells Backend everything
8. **TRAJECTORY is invariant** — Locked at launch; tracks design decisions and amendments

---

## See Also

- [02-OPERATOR-MANUAL.md](02-OPERATOR-MANUAL.md) — How to set up a feature project
- [03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md) — Detailed specs for each agent + skill
- [07-TECHNICAL-ROADMAP.md](07-TECHNICAL-ROADMAP.md) — Build phases for the framework itself
- [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) — Core Invariants & Trajectory specification
- [01-SYSTEM-ARCHITECTURE.md](#the-five-invariants-ground-rules) — Core Invariants & Canonical Artifact Set
