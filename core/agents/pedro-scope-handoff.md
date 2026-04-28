---
domain: implementation
type: handoff-document
status: active
topic: bifrost/agents-and-skills
owner: pedro
---

# Bifrost Agent & Skill Implementation (Pedro)

**This document explains your scope, responsibilities, critical design decisions needed, and handoff points with Caio.**

---

## Executive Summary

You are building the **agent architecture and skill library** that powers Bifrost.

**Your Work:**
- 7 Agent implementations (@Intake, @Planner, @CodeGen, @QA, @Conductor, @Monitor, @Reviewer)
- 8 Skill libraries (domain-specific capabilities each agent can use)
- Agent hydration system (how agents receive project context)
- Agent documentation + onboarding
- Agent testing + validation

**Caio's Work (CLI):**
- Node.js CLI tool (bifrost-init, /bifrost:* commands)
- Hydration system (building context JSON)
- STATE.md management (single source of truth)
- Git workflow (create PRs, commit)
- Knowledge integration (load Bifrost reference docs)
- Testing + documentation

**Shared Responsibility:**
- Agent interface definition (you design, Caio implements the trigger mechanism)
- Hydration data format (you specify what you need, Caio provides it)
- STATE.md schema (you define, Caio validates)
- Artifact naming + format (you define, Caio handles display)

---

## Your Responsibilities

### 1. Agent Implementation (7 Agents)

**Agents to build:**

| Agent | When Runs | Input | Output | Job | Success Criteria |
|-------|-----------|-------|--------|-----|-----------------|
| **@Intake** | 1st (after init) | Hydration JSON | intake.md | Understand feature scope, ask clarifying questions, create feature spec | Spec is complete + unambiguous |
| **@Planner** | 2nd (after intake) | Hydration + intake.md | plan.md | Break feature into implementation steps, identify components, estimate effort | Plan is detailed + realistic |
| **@CodeGen** | 3rd (after plan) | Hydration + plan.md | code.patch | Generate code for feature, follow Bifrost conventions | Code is compilable + tested |
| **@QA** | 4th (after coding) | Hydration + code.patch | qa-report.md | Test generated code, identify bugs, verify acceptance criteria | Report lists all issues found |
| **@Reviewer** | 5th (after QA) | Hydration + all artifacts | review.md | Final review of code quality, security, performance, conventions | Review approves or requests changes |
| **@Conductor** | During workflow | All state | commands.json | Orchestrate agent execution, decide next steps based on status | Workflow progresses or escalates |
| **@Monitor** | After delivery | Merged code | metrics.json | Track metrics: velocity, quality, knowledge retention | Baseline established |

**Source Material:**
- Technical Roadmap & Visual Architecture.md (AGENT RESPONSIBILITY MATRIX section)
- Framework Specification.md (Agent hydration, STATE management sections)

---

### 2. Skill Implementation (8 Skills)

**Skills to build:**

| Skill | When Used | Contains | Used By | Example |
|-------|-----------|----------|---------|---------|
| **bifrost-system-context** | All agents | Project structure, app layout, file organization | All agents | Agent knows where to place new components |
| **bifrost-code-standards** | @CodeGen, @Reviewer | ESLint rules, naming conventions, patterns, file headers | @CodeGen (generate), @Reviewer (verify) | Agent generates code that passes lint |
| **bifrost-api-integration** | @CodeGen, @QA | API constants, endpoints, request/response specs, error handling | @CodeGen (call APIs), @QA (test) | Agent integrates with backend correctly |
| **bifrost-component-gen** | @CodeGen | Reusable components library, props, events, usage patterns | @CodeGen | Agent uses existing components correctly |
| **bifrost-code-review** | @Reviewer | Security patterns, performance best practices, Bifrost patterns | @Reviewer | Agent can critique code quality |
| **bifrost-qa-validator** | @QA | Test patterns, Jest/Cypress examples, coverage targets | @QA | Agent writes and runs correct tests |
| **bifrost-graphify-ref** | All agents (optional) | Architecture graph API, component inventory, dependency map | Any agent | Agent understands codebase topology |
| **bifrost-state-management** | @CodeGen, @Reviewer | NgRx patterns, reducer examples, selector patterns | @CodeGen (generate), @Reviewer (verify) | Agent writes proper state management code |

**Source Material:**
- Technical Roadmap & Visual Architecture.md (SKILL MAPPING section)
- Knowledge files in `/knowledge/`:
  - API_CONTRACTS.md → bifrost-api-integration
  - COMPONENT_LIBRARY.md → bifrost-component-gen
  - NAMING_CONVENTIONS.md → bifrost-code-standards
  - TECH_STACK.md → bifrost-system-context + bifrost-state-management
  - GOTCHAS.md → All skills (patterns + warnings)

---

### 3. Agent Documentation

**Document for each agent:**
- Purpose + responsibilities
- Input format (hydration structure)
- Output format (artifact format)
- Internal reasoning process
- How it uses skills
- Error handling + escalation
- Testing strategy

**Source Template:**
- Framework Specification.md (Agent section)
- Technical Roadmap (Agent matrix with detailed specs)

---

## Architecture Decisions (Pre-Defined)

**THESE DECISIONS HAVE ALREADY BEEN MADE IN THE MASTER FRAMEWORK SPEC:**
You do NOT need to define these. You just need to follow them.

### 1. Agent Interface (How CLI Triggers Agents)

**Decision:** Option D - Agents are Claude Code instances with skills loaded.

The CLI does NOT call your agents programmatically. It simply copies your agent markdown files into the user's `~/.claude/skills/` directory. The human user triggers them by typing `/bifrost:start` inside Claude Code.

**What you need to build:** 
- Agent templates (Markdown files) that tell Claude Code how to act.

---

### 2. Hydration Data Format

**Decision:** Markdown text replacement.

There is no massive `hydration.json`. The CLI reads your template (e.g., `CodeGen_Template.md`), looks for `{{injection-points}}` like `{{naming-from-knowledge}}`, and does a raw string replacement with the contents of the `/knowledge/` files.

**What you need to build:**
- Templates with clear `{{variables}}` for Caio to replace.

---

### 3. STATE.md Schema

**Decision:** Human-readable Markdown.

`STATE.md` is not a strict JSON or TypeScript schema. It is a standard Markdown file that the `@Conductor` edits manually.

**Example format:**
```markdown
# STATE.md
## Feature: Add User Notifications
Status: in_progress

## Phase 1: API Integration
- [x] Task 1: Create notification endpoint
- [ ] Task 2: Write tests
```

**What you need to build:**
- Agents that know how to read and update this Markdown format.

---

### 4. Artifact Naming & Format

**Decision:** Markdown and specific structured files.

The output artifacts are primarily Markdown for human review, plus specific generated code.

**Expected Structure:**
```
.bifrost/artifacts/
├── @Intake/
│   └── intake.md              (markdown summary)
├── @Planner/
│   └── plan.md                (markdown plan)
├── @CodeGen/
│   └── code.patch             (or direct file edits)
├── @QA/
│   └── qa-report.md           (markdown report)
└── @Conductor/
    └── STATE.md               (updated state)
```

---

### 5. Agent Execution Flow

Because agents run inside Claude Code natively, there are no "Timeouts" or "Completion Signals" for the CLI to poll. The CLI is just a setup and validation tool.

**Full workflow:**
1. User runs `bifrost-init` (CLI sets up `.bifrost/` and hydrates templates)
2. User opens Claude Code
3. User types `/bifrost:start` (Claude reads the Intake skill and begins)
4. User types `/bifrost:plan` (Claude reads the Planner skill and begins)
5. User runs `bifrost-validate` (CLI validates the generated files)

---

## Skills Library

### bifrost-system-context

**Contains:**
- Bifrost monorepo structure (apps: account, business, shopping, Tokengo)
- Bifrost shared libraries (commonlib, wallet)
- File structure for each app
- Import paths
- Module organization

**Used by:** All agents (understand project layout)

**Source:** Frontend_repository_manual.md (Sections 1-5)

---

### bifrost-code-standards

**Contains:**
- File naming (kebab-case)
- Class naming (PascalCase)
- Function naming (camelCase)
- Variable naming (camelCase, _private prefix)
- Formatting (4 spaces, single quotes, semicolons, Allman braces)
- ESLint rules
- TypeScript strict mode requirements
- File header requirement

**Used by:** @CodeGen (follow conventions), @Reviewer (verify compliance)

**Source:** NAMING_CONVENTIONS.md + Frontend_repository_manual.md (Section 13)

---

### bifrost-api-integration

**Contains:**
- All API endpoints (15+ across 9 domains)
- Request/response schemas
- Error handling patterns
- Authentication (Bearer token, x-app-id, x-promo-code)
- Timeout (35 seconds)
- Error response format
- When to use which endpoint

**Used by:** @CodeGen (call APIs), @QA (test API calls)

**Source:** API_CONTRACTS.md + Frontend_repository_manual.md (Section 10)

---

### bifrost-component-gen

**Contains:**
- All 50+ reusable UI components
- Component selectors (app-component-name)
- Props/inputs for each component
- Events/outputs for each component
- Usage examples
- When to use which component
- Form validation patterns
- Loading states
- Error handling

**Used by:** @CodeGen (use correct components)

**Source:** COMPONENT_LIBRARY.md + Frontend_repository_manual.md (Section 6.1)

---

### bifrost-code-review

**Contains:**
- Security patterns (password encryption, HTML sanitization)
- Performance patterns (change detection, trackBy)
- Common mistakes (memory leaks, mutation)
- Best practices (async patterns, error handling)
- Code quality metrics
- Testing requirements

**Used by:** @Reviewer (critique code quality)

**Source:** GOTCHAS.md + Technical Roadmap (Success Definition)

---

### bifrost-qa-validator

**Contains:**
- Jest testing patterns (unit tests, mocks)
- Cypress testing patterns (E2E tests)
- Test file naming
- Coverage requirements
- Test organization
- Assertion patterns
- Mocking patterns

**Used by:** @QA (write and run tests)

**Source:** Frontend_repository_manual.md (Section 15)

---

### bifrost-graphify-ref

**Contains:**
- Component inventory (with file paths)
- Service inventory (with methods)
- State management (reducers, selectors, actions)
- Dependency graph
- API usage patterns
- Type definitions

**Used by:** Agents (optional, for codebase analysis)

**Source:** Generated by Graphify analysis (GRAPHIFY_SEEDING_PLAN.md)

---

### bifrost-state-management

**Contains:**
- NgRx action patterns
- Reducer patterns (immutable updates, no side effects)
- Selector patterns
- Effect patterns (side-effect handling)
- Common mistakes (mutation, unsubscribed observables)
- Memory leak prevention

**Used by:** @CodeGen (generate state), @Reviewer (verify state patterns)

**Source:** TECH_STACK.md (NgRx 14.3.2) + GOTCHAS.md (state management section)

---

## Handoff Checklist with Caio

**Before you start, you must deliver:**

- [ ] **Agent Interface Specification** (how CLI triggers agents)
  - Entry point (function, file path, API endpoint)
  - Input format (JSON file, function params, HTTP body)
  - Output mechanism (file write, return value, HTTP)
  - Timeout + completion signal

- [ ] **Hydration Data Format Spec**
  - Final hydration.json schema (TypeScript interface or JSON Schema)
  - What fields are required vs optional
  - Example hydration.json for Path A, B, C
  - Any additional fields beyond what Caio proposes

- [ ] **STATE.md Schema**
  - Valid status values (confirm: pending|intake|planning|coding|qa|review|merged)
  - Additional fields needed
  - Timeline entry format
  - Blocker format
  - JSON Schema or TypeScript interface for validation

- [ ] **Artifact Naming & Format**
  - File names for each agent (intake.md, plan.json, etc.)
  - File formats (markdown, JSON, patch, etc.)
  - Example artifact for each agent
  - How agent signals completion (file exists? specific field?)

- [ ] **Agent Execution Timeline**
  - Agent sequence (intake → planner → codegen → qa → reviewer)
  - Can agents be run in parallel or sequential only?
  - Can subsequent agents run if prior agent fails?
  - Fallback strategy if agent timeout

- [ ] **Skills Library Content**
  - Confirm 8 skills list is correct
  - Propose any additions/removals
  - Specify what goes in each skill (exact content)

- [ ] **Agent Documentation Template**
  - How you'll document each agent
  - Template format for agent docs

---

## Timeline & Phases

**Phase 1 (Immediate Start):** 
- Implement @Intake + @Planner (1-2 weeks)
- Build skills library (1-2 weeks)

**Phase 2+:**
- Implement remaining agents
- Advanced skill features
- Performance optimization

---

## Success Criteria

### Agent Implementation (Weeks 1-3)
- ✅ @Intake works natively in Claude Code
- ✅ @Planner works natively in Claude Code
- ✅ Skills library is accessible to agents
- ✅ Agent outputs match specification
- ✅ All templates properly use `{{injection-points}}` for hydration

### Operational Success
- ✅ Agents produce high-quality outputs
- ✅ Artifacts are clear + actionable
- ✅ Templates effectively utilize the injected `/knowledge/`

---

## Questions to Answer During Implementation

- [ ] Should agents update STATE.md directly, or only write their specific artifacts?
- [ ] Should agents be able to ask for clarification (re-prompt user) when running in Claude Code?
- [ ] Should artifacts include agent reasoning/thinking?

---

## Critical Path

**Timeline:**
1. **Week 1:** You implement @Intake and @Planner as Claude Code skills. Caio implements CLI setup and hydration injection.
2. **Week 2:** We test the E2E flow (CLI hydrates template -> User runs in Claude Code).

**Status:** Caio is UNBLOCKED. He is building the CLI hydration injection now. You are UNBLOCKED. You can start writing the agent templates and skills immediately.

---

## Key Documents

**Read in this order:**

1. **Framework Specification.md** — This is the primary source of truth. Read the AGENT HYDRATION SYSTEM and STATE MANAGEMENT sections.
2. **Technical Roadmap & Visual Architecture.md** — Look at the AGENT RESPONSIBILITY MATRIX.
3. **CAIO_CLI_IMPLEMENTATION_PLAN.md** — Understand what Caio is building (he is strictly handling `bifrost-init` setup and string injection).
4. **Knowledge files** (`/knowledge/*`) — Content that will be injected into your templates.

**Your responsibility:**
- Implement agent templates (Markdown files for Claude Code).
- Implement skills library (Markdown instructions).
- Ensure your templates use the correct `{{variables}}` that Caio will replace.

---

## Next Steps

1. **Start implementation** (Now)
   - Build @Intake template
   - Build @Planner template
   - Build skills library
   - Coordinate with Caio to test the hydration pipeline (`bifrost-init`)

---

**Version:** 1.1
**Owner:** Pedro  
**Last Updated:** 2026-04-27  
**Status:** In Progress (Unblocked)

