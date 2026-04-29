---
type: guide
status: active
topic: bifrost/architecture
---

# BIFROST Architecture

This document consolidates the system design from multiple sources into a single reference. **Source materials:** Technical Roadmap & Visual Architecture, Framework Specification, Bifrost CLI Plan.

---

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

| Agent | Input | Job | Output | When |
|-------|-------|-----|--------|------|
| **@Intake** | PATIENT.md + TRAJECTORY.md + Architecture Graph | Understand scope + impact | IMPACT.md | Feature kickoff |
| **@Planner** | IMPACT.md + Architecture Graph | Break into concrete tasks | PLAN.md (5-10 tasks) | After scope approval |
| **@CodeGen** | PLAN.md + All Skills | Write code following rules | Source code + CODE_REVIEW.md | Execution phase |
| **@QA** | Source code + QA Skill | Test & find issues | QA_REPORT.md + Pass/Fail gate | After code generated |
| **@Conductor** | STATE.md + every step | Track state, decide next action | Updated STATE.md + autonomy decisions | Continuous (every step) |
| **@Monitor** | .bifrost/ + filesystem | Detect drift from spec | VITALS.md (what changed?) | Continuous monitoring |
| **@Reviewer** | All artifacts + source | Prepare for Backend handoff | HANDOFF.md + PR metadata | Before delivery |

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

## The Workflow: Feature from Scope to Merge

```
PRODUCT WRITES SCOPE (PATIENT.md)
  │
  └─ DEV RUNS: bifrost init --patient ./PATIENT.md (Headless Ingestion)
  
COMMAND: /bifrost:start (@Intake)
  ├─ Reads: PATIENT.md + TRAJECTORY.md
  ├─ Queries: Architecture graph (what APIs/components exist?)
  ├─ Produces: IMPACT.md (scope impact analysis)
  └─ Gate: Product approval required before proceeding

PRODUCT REVIEWS IMPACT.MD

COMMAND: /bifrost:plan (@Planner)
  ├─ Reads: PATIENT.md + IMPACT.md + TRAJECTORY.md
  ├─ References: Architecture graph (which functions/endpoints to call?)
  ├─ Breaks into: 5-10 concrete tasks
  ├─ Produces: PLAN.md
  └─ Gate: Product approval required

PRODUCT REVIEWS PLAN.MD

COMMAND: /bifrost:build (@CodeGen)
  ├─ Loads: All skill files
  ├─ Reads: PLAN.md + TRAJECTORY.md
  ├─ Generates: Source code (following every rule in skills)
  ├─ Self-reviews: Against CODE_REVIEW.md checklist
  ├─ Produces: CODE_REVIEW.md (did we follow standards?)
  └─ Auto-runs: Tests → QA_REPORT.md

@QA VALIDATES (@QA)
  ├─ Runs: Happy path + sad path + edge cases
  ├─ Checks: API integration vs API_CONTRACTS.md
  ├─ Produces: QA_REPORT.md
  ├─ If Fail: Hard stops, Product fixes
  └─ If Pass: Continues

@CONDUCTOR UPDATES STATE.MD
  ├─ Marks: All tasks complete
  ├─ Lists: All files changed
  └─ Tracks: Every step taken

COMMAND: /bifrost:deliver (@Conductor)
  ├─ Produces: HANDOFF.md
  │  ├─ What changed?
  │  ├─ Which APIs were called? (validated against graph)
  │  ├─ What tests were written?
  │  └─ What edge cases?
  └─ Creates: Pull request to Backend

GIT HOOKS VALIDATE BEFORE COMMIT
  ├─ STATE.md is valid
  ├─ All files referenced exist
  └─ API calls match API_CONTRACTS.md

PR PUSHED TO BACKEND
  │
  ├─ GitHub Actions Run
  │  ├─ bifrost-validate state
  │  ├─ bifrost-validate api-calls
  │  ├─ bifrost-validate code-standards
  │  └─ bifrost-validate qa-report
  │
  ├─ BACKEND DEV REVIEWS
  │  ├─ Reads: HANDOFF.md (context)
  │  ├─ Scans: Code (should already follow standards)
  │  ├─ Validates: API calls (checked against graph)
  │  ├─ Reviews: Tests (should be comprehensive)
  │  └─ If Good → Merge
  │
  └─ MERGE TO MAIN

FEATURE COMPLETE ✓
```

---

## Per-Feature Artifacts (.bifrost/)

Everything related to one feature lives in `.bifrost/` directory. The canonical 10-artifact set per ADR-010:

```
.bifrost/
├── PATIENT.md           # Feature scope (input by Product)
├── TRAJECTORY.md        # Locked invariants (output by @Intake — per ADR-008)
├── IMPACT.md            # Scope impact analysis (output by @Intake)
├── PLAN.md              # Task breakdown (output by @Planner)
├── STATE.md             # Execution state (updated by @Conductor; carries autonomy in frontmatter)
├── CODE_REVIEW.md       # Self-review results (output by @CodeGen)
├── QA_REPORT.md         # Test results (output by @QA)
├── HANDOFF.md           # Backend delivery (output by @Reviewer)
├── VITALS.md            # Drift report (output by @Monitor; only when drift detected)
├── PROJECT_CONTEXT.md   # Per-project system prompt (created once at bifrost-init)
├── agents/
│   ├── Intake_HYDRATED.md          # Customized for this project
│   ├── Planner_HYDRATED.md
│   ├── CodeGen_HYDRATED.md
│   ├── QA_HYDRATED.md
│   ├── Reviewer_HYDRATED.md
│   ├── Conductor_HYDRATED.md
│   └── Monitor_HYDRATED.md
├── skills/
│   ├── bifrost-system-context/SKILL.md
│   ├── bifrost-code-standards/SKILL.md
│   ├── bifrost-api-integration/SKILL.md
│   ├── bifrost-qa-validator/SKILL.md
│   └── [all others]
└── PROJECT_CONTEXT.md          # Per-project system prompt
```

**Note:** Per ADR-010, HEALTH.md is deprecated (acceptance criteria live in TRAJECTORY §3) and AUTONOMY.md is folded into STATE.md frontmatter as the `autonomy:` field.

---

## State Management: STATE.md

STATE.md is the **single source of truth** for feature execution state.

```markdown
# STATE.md

Feature: Add User Notifications
Admitted: 2026-04-27 09:00 UTC
Status: in_progress
Autonomy: Task-Gated

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

- [initialization.md](initialization.md) — How to set up a feature project
- [agents-and-skills.md](agents-and-skills.md) — Detailed specs for each agent + skill
- [implementation-plan.md](implementation-plan.md) — Build phases for the framework itself
- [decisions/ADR-008-trajectory-context-protocol.md](decisions/ADR-008-trajectory-context-protocol.md) — TRAJECTORY.md specification
- [decisions/ADR-010-artifact-set.md](decisions/ADR-010-artifact-set.md) — 10-artifact set decision
