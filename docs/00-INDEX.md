---
type: reference
status: active
topic: bifrost
---

# Bifrost Documentation Index

**Navigation hub for the Bifrost AI-powered feature orchestration framework.**

This index points you to the right document based on what you need to do. All documentation is consolidated here — no duplication, no stale files.

---

## 🆕 What's New

**Infrastructure Hardening & Efficiency Suite (Phase 2.5) — Complete as of 2026-04-30**

The Bifrost framework has been hardened with production-ready efficiency engineering:
- **65% Context Reduction** via Surgical Sectional Hydration (extractMarkdownSections)
- **100% Deterministic Hydration** via tag normalization and dual-source resolution
- **Economic Governance** with mandatory token budgets and session metrics
- **Deterministic Validation** via automated benchmarking harness

See [07-TECHNICAL-ROADMAP.md#phase-25-infrastructure-hardening--efficiency-suite](07-TECHNICAL-ROADMAP.md#phase-25-infrastructure-hardening--efficiency-suite) for details.

---

## Quick Start: Pick Your Scenario

### "I want to understand the system"
→ **[01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md)** — System design, the 7 agents, 8 skills, workflow

### "I want to initialize a feature"
→ **[02-OPERATOR-MANUAL.md](02-OPERATOR-MANUAL.md)** — How `bifrost init` works, the interrogation process, CLI flow

### "I need details on a specific agent or skill"
→ **[03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md)** — Complete spec for each of the 7 agents + 9 skills

### "I'm building the framework"
→ **[07-TECHNICAL-ROADMAP.md](07-TECHNICAL-ROADMAP.md)** — Phase-by-phase roadmap (10 phases, 6-8 weeks)

### "I need to know what success looks like"
→ **[04-SUCCESS-METRICS.md](04-SUCCESS-METRICS.md)** — Metrics, targets, and how to measure progress

### "I need to explain this to leadership"
→ **[06-BUSINESS-STRATEGY.md](06-BUSINESS-STRATEGY.md)** — Business case, ROI, why this matters

### "I need to understand a binding architectural decision"
→ **[01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md)** — Core Invariants, ground rules, and lifecycle protocols

### "I'm authoring code or reviewing delivery"
→ **[05-ENGINEERING-STANDARDS.md](05-ENGINEERING-STANDARDS.md)** — Frontend-team delivery standards (non-negotiable)

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
| **[01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md)** | System design, components, workflow | ~1000 lines | Engineers, architects, new team members |
| **[02-OPERATOR-MANUAL.md](02-OPERATOR-MANUAL.md)** | `bifrost init` command walkthrough, CLI UX | ~700 lines | Anyone setting up a feature project |
| **[03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md)** | Complete agent + skill reference | ~900 lines | Implementers, designers, anyone needing detailed specs |
| **[07-TECHNICAL-ROADMAP.md](07-TECHNICAL-ROADMAP.md)** | Build roadmap (10 phases, checklist) | ~800 lines | Framework builders, project managers |
| **[04-SUCCESS-METRICS.md](04-SUCCESS-METRICS.md)** | Metrics, targets, progress tracking | ~600 lines | Anyone tracking progress or validating success |
| **[06-BUSINESS-STRATEGY.md](06-BUSINESS-STRATEGY.md)** | Business case, ROI, stakeholder pitch | ~700 lines | CTO, decision makers, leadership |
| **[01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md)** | Core Invariants (formerly ADRs 006-010) | ~1200 lines | Anyone needing ground rules & lifecycle protocols |
| **[05-ENGINEERING-STANDARDS.md](05-ENGINEERING-STANDARDS.md)** | Code delivery standards (from Frontend team) | ~500 lines | Code authors, PR reviewers |

---

## How to Use This Folder

### Scenario: "I'm building the Bifrost framework"

1. **Start:** [07-TECHNICAL-ROADMAP.md](07-TECHNICAL-ROADMAP.md) — Phase breakdown + checklist
2. **Then:** [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) — What you're building
3. **Then:** [03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md) — Detailed specs for each component
4. **Reference:** [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) — Non-negotiable Invariants
5. **For code:** [05-ENGINEERING-STANDARDS.md](05-ENGINEERING-STANDARDS.md)

### Scenario: "I'm using Bifrost to build a feature"

1. **Start:** [02-OPERATOR-MANUAL.md](02-OPERATOR-MANUAL.md) — Set up your project
2. **Then:** [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) — Understand the workflow
3. **Then:** [03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md) — What each agent will do
4. **Ongoing:** [04-SUCCESS-METRICS.md](04-SUCCESS-METRICS.md) — Track progress

### Scenario: "I need to explain Bifrost to leadership"

1. **Start:** [06-BUSINESS-STRATEGY.md](06-BUSINESS-STRATEGY.md) — Business case + ROI
2. **Then:** [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) (section: "The System at a Glance") — High-level design
3. **Then:** [04-SUCCESS-METRICS.md](04-SUCCESS-METRICS.md) (section: "Business Success") — Success definition

### Scenario: "I'm implementing a specific component"

Use this table to find the right section:

| Component | Best Source |
|-----------|-------------|
| Agent templates | [03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md) + [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) |
| Skills | [03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md) |
| `bifrost-init` command | [02-OPERATOR-MANUAL.md](02-OPERATOR-MANUAL.md) |
| Hydration system | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) (Knowledge Graph Integration) |
| STATE.md format | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) (State Management) |
| Autonomy levels | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) (Autonomy Levels) |
| CI/CD pipelines | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) (CI/CD Integration) |
| Git hooks | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) (Workflow section) |

---

## 📜 Binding Invariants

These are **non-negotiable protocols**. Every agent and skill respects them. No implementation without understanding these.

| Invariant | Decision | Documented In |
|:--- | :--- | :--- |
| **Per-Feature Lifecycle** | 7 agents, 9 skills, per-feature artifacts | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) |
| **Single-Stack Target** | v0 target: Wiboo Angular 15 + Nx 16 | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) |
| **Rocket Flight Protocol** | TRAJECTORY.md as locked-at-launch invariant | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) |
| **Growth via Skills** | Agents fixed at 7; skills grow via `bifrost-hr` | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) |
| **Canonical Artifacts** | 10-artifact set; HEALTH deprecated | [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) |

---

## Document Relationships

```
01-SYSTEM-ARCHITECTURE (core)
├─ describes the 7 AGENTS + 9 SKILLS
│  └─ detailed in 03-AGENT-SPECIFICATIONS
├─ describes the workflow
│  └─ operational details in 02-OPERATOR-MANUAL
└─ used to build the system
   └─ phase plan in 07-TECHNICAL-ROADMAP

04-SUCCESS-METRICS (validation)
├─ measures built system via 07-TECHNICAL-ROADMAP
├─ validates 01-SYSTEM-ARCHITECTURE works
└─ used in 06-BUSINESS-STRATEGY to justify cost

06-BUSINESS-STRATEGY (justification)
├─ justifies building via 07-TECHNICAL-ROADMAP
├─ explains why via 01-SYSTEM-ARCHITECTURE
└─ proves value via 04-SUCCESS-METRICS

05-ENGINEERING-STANDARDS (standards)
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
1. [07-TECHNICAL-ROADMAP.md](07-TECHNICAL-ROADMAP.md) → overview of phases
2. [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) → what you're building
3. [03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md) → detailed component specs
4. [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) (section: "The Five Invariants") — Non-negotiable constraints
5. [05-ENGINEERING-STANDARDS.md](05-ENGINEERING-STANDARDS.md) → code quality gates

### Feature Users (Product Developers)
1. [02-OPERATOR-MANUAL.md](02-OPERATOR-MANUAL.md) → set up your project
2. [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) → understand the workflow
3. [03-AGENT-SPECIFICATIONS.md](03-AGENT-SPECIFICATIONS.md) → understand each agent
4. [04-SUCCESS-METRICS.md](04-SUCCESS-METRICS.md) → track your progress

### Leadership / Decision Makers
1. [06-BUSINESS-STRATEGY.md](06-BUSINESS-STRATEGY.md) → full business case + ROI
2. [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) → high-level system design (first section only)
3. [04-SUCCESS-METRICS.md](04-SUCCESS-METRICS.md) → Business Success section
4. [07-TECHNICAL-ROADMAP.md](07-TECHNICAL-ROADMAP.md) → timeline + phases

### Code Reviewers
1. [05-ENGINEERING-STANDARDS.md](05-ENGINEERING-STANDARDS.md) → what you're checking for
2. [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) → understand the design being delivered
3. [04-SUCCESS-METRICS.md](04-SUCCESS-METRICS.md) → what "done" looks like

---

## Version History

| 2026-04-30 | Implemented Numbered Protocol (00-07) for documentation suite; centralized all architectural invariants; finalized global link re-hydration. |
| 2026-04-29 | Consolidated all framework docs into single `docs/` folder; eliminated `instructions/` duplication; moved ADRs, removed stale planning docs |
| 2026-04-27 | ADRs 006-010 finalized; consolidated instructions folder created |

---

## Notes

- **All information is current and non-redundant.** Original ADRs (006-010) have been dissolved into the core architecture documentation.
- **Invariants are authoritative.** If something here conflicts with an Invariant in `01-SYSTEM-ARCHITECTURE.md`, the Invariant wins.
- **This is living documentation.** As the framework evolves, keep these files up to date.
- **For CLI tool docs**, see `tools/bifrost-cli/README.md` (separate from framework docs).
