---
domain: implementation
type: plan
status: active
topic: bifrost/cli
owner: caio
---

# Bifrost CLI Implementation Plan (Phase 1)

**Owner:** Caio (CLI + all logic, hydration mechanism, state management)  
**Stakeholder:** Pedro (Agents + Skills)  
**Scope:** Phase 1 only (all CLI commands with mocked agents)  
**Technology:** Node.js/TypeScript CLI (npm package)  
**Timeline:** TBD (blocks on Pedro's agent design + STATE.md schema)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture & Design](#architecture--design)
3. [Work Breakdown Structure](#work-breakdown-structure)
4. [Detailed Deliverables](#detailed-deliverables)
5. [Dependencies & Handoffs with Pedro](#dependencies--handoffs-with-pedro)
6. [Testing Strategy](#testing-strategy)
7. [Implementation Sequence](#implementation-sequence)
8. [Success Criteria](#success-criteria)
9. [Risks & Mitigation](#risks--mitigation)
10. [References to Documentation](#references-to-documentation)

---

## Overview

### What You're Building

A Node.js CLI tool that:
- Initializes new Bifrost feature projects (bifrost-init command)
- Manages all Bifrost workflows (/bifrost:* commands)
- Handles hydration (injecting project context into agents)
- Manages STATE.md as single source of truth for agent coordination
- Integrates with knowledge graph (API constants, components, naming conventions)
- Validates all data before agents see it

### What You're NOT Building

- Agent implementation (Pedro)
- Skill library (Pedro)
- Agent documentation templates (Pedro)

### Why Phase 1 Only

Phase 1 includes all CLI commands needed for a complete feature workflow:
- `bifrost-init` — Initialize project
- `/bifrost:start` — Begin feature development
- `/bifrost:status` — Check workflow status
- `/bifrost:review` — Review agent outputs
- `/bifrost:deliver` — Finalize and merge

All other phases add agent capabilities, monitoring, CI/CD integration, etc.

### Tech Stack

**Technology:** Node.js 20.x + TypeScript 4.8.3  
**Package Manager:** Yarn 3.5.0 (Berry, PnP disabled)  
**Distribution:** npm package (install via `npm install -g bifrost`)  
**Runtime:** Standalone executable via `pkg` or similar  
**Monorepo:** Nx (Bifrost CLI is an Nx package within bifrost-framework repo)  

**Key Dependencies:**
- `oclif` — CLI framework (https://oclif.io) — handles commands, plugins, help
- `enquirer` — Interactive prompts (yes/no, select, input)
- `chalk` — Colored terminal output
- `ora` — Loading spinners + progress indicators
- `cosmiconfig` — Configuration file management (.bifrostrc.json)
- `zod` — Runtime schema validation (for STATE.md + hydration)
- `node-fetch` — HTTP client (if calling knowledge graph API)
- `fs-extra` — File system utilities (reading/writing STATE.md)

---

## Architecture & Design

### System Flow (From Technical Roadmap - DATA FLOW Section)

```
┌─────────────────────────────────────────────────────────────────┐
│  Bifrost CLI (Your Work)                                        │
│                                                                  │
│  User Command                                                    │
│    ↓                                                             │
│  Parse + Validate Input                                          │
│    ↓                                                             │
│  Load Knowledge Graph (API, components, conventions)             │
│    ↓                                                             │
│  Build Hydration Templates (project context + knowledge)         │
│    ↓                                                             │
│  Validate Hydration Files (against required points)              │
│    ↓                                                             │
│  Write STATE.md (single source of truth)                         │
│    ↓                                                             │
│  Trigger Agent (Pedro's responsibility)                          │
│    ↓                                                             │
│  Monitor STATE.md for agent updates                              │
│    ↓                                                             │
│  Validate agent outputs (your work)                              │
│    ↓                                                             │
│  Display results to user / next steps                            │
│    ↓                                                             │
│  Git workflow (add, commit, create PR)                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

**Bifrost CLI Nx package location:**
```
bifrost-framework/
├── tools/bifrost-cli/
│   ├── src/
│   │   ├── commands/              ← All CLI commands
│   │   │   ├── init.ts            ← bifrost-init command
│   │   │   ├── start.ts           ← /bifrost:start
│   │   │   ├── status.ts          ← /bifrost:status
│   │   │   ├── review.ts          ← /bifrost:review
│   │   │   ├── deliver.ts         ← /bifrost:deliver
│   │   │   ├── index.ts           ← Command registry
│   │   ├── core/
│   │   │   ├── hydration/
│   │   │   │   ├── builder.ts     ← Build hydration from templates
│   │   │   │   ├── types.ts       ← Hydration interfaces
│   │   │   ├── state/
│   │   │   │   ├── manager.ts     ← STATE.md CRUD operations
│   │   │   │   ├── validator.ts   ← Validate state schema (Pedro's)
│   │   │   │   ├── types.ts       ← State interfaces
│   │   │   ├── knowledge/
│   │   │   │   ├── loader.ts      ← Load API contracts, components, conventions
│   │   │   │   ├── graph.ts       ← Knowledge graph API integration
│   │   │   ├── git/
│   │   │   │   ├── workflow.ts    ← Git add/commit/PR operations
│   │   │   ├── agent/
│   │   │   │   ├── coordinator.ts ← Orchestrate agent execution
│   │   │   │   ├── monitor.ts     ← Watch STATE.md for updates
│   │   ├── ui/
│   │   │   ├── prompts.ts         ← Interrogation questions (from CLI layout)
│   │   │   ├── screens.ts         ← Progress screens, loading states
│   │   │   ├── output.ts          ← Formatted output (tables, lists)
│   │   ├── config/
│   │   │   ├── defaults.ts        ← Default configuration
│   │   │   ├── loader.ts          ← Load .bifrostrc.json
│   │   ├── index.ts               ← CLI entry point
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── commands/
│   │   │   ├── core/
│   │   ├── integration/
│   │   │   ├── workflows/
│   │   ├── mocks/
│   │   │   ├── agents/            ← Mock agent implementations
│   │   │   ├── state/
│   │   ├── manual-testing/
│   │   │   ├── TESTING_GUIDE.md
│   ├── project.json               ← Nx project config
│   ├── tsconfig.json
│   ├── package.json               ← Version, entry points, bin
│   ├── README.md                  ← User documentation
│   └── DEVELOPMENT.md             ← Developer guide
├── knowledge/                      ← Shared knowledge (your code loads from here)
│   ├── API_CONTRACTS.md
│   ├── COMPONENT_LIBRARY.md
│   ├── NAMING_CONVENTIONS.md
│   ├── TECH_STACK.md
│   ├── GOTCHAS.md
```

---

## Work Breakdown Structure

### Phase 1 Deliverables (All CLI Commands)

| ID | Component | Owner | Status | Est. Hours |
|----|-----------| ------|--------|-----------|
| **Core Infrastructure** ||||
| 1.1 | CLI framework setup (oclif, Nx config, build) | Caio | Done | 8 |
| 1.2 | Hydration system (builder + validator) | Caio | Done | 16 |
| 1.3 | STATE.md management system | Caio | Done | 12 |
| 1.4 | Knowledge graph loader (from /knowledge/) | Caio | Done | 8 |
| 1.5 | Configuration system (.bifrostrc.json) | Caio | Done | 4 |
| **Commands** ||||
| 2.1 | bifrost-init (interrogation + project setup) | Caio | Done | 24 |
| 2.2 | /bifrost:start (kick off first agent) | Caio | Done | 12 |
| 2.3 | /bifrost:status (show workflow status) | Caio | Done | 8 |
| 2.4 | /bifrost:review (display agent outputs) | Caio | Done | 10 |
| 2.5 | /bifrost:deliver (finalize + merge) | Caio | Done | 14 |
| **UI/UX** ||||
| 3.1 | Interrogation prompts (interactive questions) | Caio | Done | 12 |
| 3.2 | Progress screens + spinners | Caio | Done | 8 |
| 3.3 | Output formatting (tables, lists, colors) | Caio | Done | 10 |
| **Testing** ||||
| 4.1 | Unit tests (all commands + core) | Caio | In Progress | 20 |
| 4.2 | Integration tests (workflows + STATE.md) | Caio | Done | 20 |
| 4.3 | Mock agent implementations | Caio | Done | 12 |
| 4.4 | Manual testing guide + checklist | Caio | Done | 8 |
| 4.5 | E2E tests (with real agents, when available) | Caio | In Progress | 16 |
| **Documentation** ||||
| 5.1 | CLI user documentation (README) | Caio | Done | 8 |
| 5.2 | Developer guide (contributing, architecture) | Caio | Done | 8 |
| 5.3 | API reference (hydration, state, schemas) | Caio | In Progress | 8 |
| **Deliverables** ||||
| 6.1 | npm package (bifrost CLI published) | Caio | TBD | 6 |
| 6.2 | Installation instructions + troubleshooting | Caio | Done | 4 |
| | **TOTAL** | | | **263 hours** |

---

## Detailed Deliverables

### 1. Core Infrastructure

#### 1.1 CLI Framework Setup

**Input:** From Technical Roadmap, Framework Spec  
**Deliverable:** Working Nx package with oclif framework + build config

**Tasks:**
1. Create Nx library package (`nx generate @nrwl/node:library tools/bifrost-cli`)
2. Install oclif + dependencies (`oclif`, `enquirer`, `chalk`, `ora`, etc.)
3. Configure TypeScript for CLI (target ES2020, outDir bin/)
4. Set up build script (tsc + pkg for standalone binary)
5. Configure Nx project.json (build, lint, test targets)
6. Create entry point (src/index.ts that calls oclif)
7. Test that `node dist/tools/bifrost-cli/bin/bifrost --help` works

**Acceptance Criteria:**
- ✅ oclif is running
- ✅ `bifrost --version` returns version from package.json
- ✅ `bifrost --help` shows command list
- ✅ `bifrost <command> --help` shows command help
- ✅ Build produces executable binary

**References:** Framework Spec (repo structure), Technical Roadmap (Phase 1)

---

#### 1.2 Hydration System

**Input:** From Framework Spec (Agent Hydration System section), CLI Plan (Hydration & AI Training)  
**Deliverable:** Complete hydration builder + validator

**Hydration Data Structure** (what gets injected):
The hydration system uses Markdown text replacement (`{{injection-points}}`), NOT a JSON object.

**Builder Tasks:**
1. Read the agent template (`.bifrost/agents/templates/CodeGen_Template.md`)
2. Find all `{{injection-points}}` using regex
3. Load the corresponding raw text from the `/knowledge/` markdown files or `/skills/` files
4. Replace the placeholders with the raw text
5. Write the final result to `.bifrost/agents/CodeGen_HYDRATED.md`

**Validator Tasks:**
1. Check that all required `{{injection-points}}` have corresponding files in `/knowledge/`
2. Warn if any `{{placeholder}}` is left unreplaced in the output file
3. Report validation errors clearly

**Acceptance Criteria:**
- ✅ Hydrated Markdown files are successfully generated
- ✅ All Bifrost knowledge is correctly injected into the prompts
- ✅ Validation catches missing knowledge files
- ✅ Final agents are installed to `~/.claude/skills/`

**References:** Framework Spec (AGENT HYDRATION SYSTEM)

---

#### 1.3 STATE.md Management System

**Input:** From Framework Spec (STATE MANAGEMENT - FORGE Pattern section)  
**Deliverable:** STATE.md CRUD operations + validation

**STATE.md Format** (from docs):
```markdown
---
id: <feature-id>
feature: <feature-name>
status: <pending|intake|planning|coding|qa|review|merged>
version: <timestamp>
---

# Bifrost State

## Timeline
- [timestamp] — Agent intake created
- [timestamp] — Planning complete
- [timestamp] — Code generated
- ...

## Artifacts
- @Intake: `/path/to/intake.md`
- @Planner: `/path/to/plan.md`
- @CodeGen: `/path/to/code.patch`
- @QA: `/path/to/qa-report.md`
- @Reviewer: `/path/to/review.md`

## Decisions
- [date] Decision 1: rationale
- [date] Decision 2: rationale

## Blockers
- None | [list of blockers]

## Next Steps
- [next action]
```

**Manager Tasks:**
1. Initialize STATE.md (create with initial status = "pending")
2. Read STATE.md (parse YAML front matter + timeline + artifacts)
3. Update STATE.md (add timeline entry, update status, add artifact link)
4. Get current status (returns status field)
5. Get all artifacts (returns list of agent output links)
6. Validate STATE.md (check required fields, valid status values, etc.)

**Acceptance Criteria:**
- ✅ STATE.md can be created in `.bifrost/` directory
- ✅ YAML front matter is parsed correctly
- ✅ Status transitions are valid (pending → intake → planning → coding → qa → review → merged)
- ✅ Artifacts can be added/removed
- ✅ Timeline entries are added with timestamps
- ✅ Validation rejects invalid states

**References:** Framework Spec (STATE MANAGEMENT section)

---

#### 1.4 Knowledge Graph Loader

**Input:** From `/knowledge/` files (your existing docs)  
**Deliverable:** Loader that reads knowledge files and makes data available to CLI + hydration

**Loader Tasks:**
1. Read `/knowledge/API_CONTRACTS.md` — parse endpoints, domains, request/response specs
2. Read `/knowledge/COMPONENT_LIBRARY.md` — parse components, props, events
3. Read `/knowledge/NAMING_CONVENTIONS.md` — parse rules, patterns, ESLint rules
4. Read `/knowledge/TECH_STACK.md` — parse versions, dependencies, rationale
5. Read `/knowledge/GOTCHAS.md` — parse pitfalls, security rules, patterns
6. Cache in memory (or serialize to JSON for faster loads)
7. Provide search functions (find component by name, find API by path, etc.)

**Validation Tasks:**
1. Verify that referenced components actually exist (in component library)
2. Verify that API endpoints are valid (no malformed URLs)
3. Check that naming conventions are consistently applied
4. Flag any inconsistencies (same component mentioned twice with different props)

**Acceptance Criteria:**
- ✅ All 5 knowledge files are loaded
- ✅ Parsed data is structured + type-safe (TypeScript interfaces)
- ✅ Search queries work (find component, find API, find convention)
- ✅ Validation catches parsing errors or inconsistencies
- ✅ Load time is <500ms (caching works)
- ✅ Hydration includes relevant knowledge extracts

**References:** `/knowledge/` files, Framework Spec (KNOWLEDGE GRAPH INTEGRATION)

---

#### 1.5 Configuration System

**Input:** From Framework Spec (project structure mentions .bifrostrc.json)  
**Deliverable:** Config file loader + validation

**Config File** (`.bifrostrc.json`):
```json
{
  "version": "1.0",
  "projectName": "Bifrost-shopping",
  "projectPath": "/path/to/project",
  "apps": ["shopping", "account"],
  "features": {
    "wallet": true,
    "rewards": false,
    "notifications": true
  },
  "agents": {
    "timeout": 300,
    "retryOnFailure": true,
    "maxRetries": 3
  },
  "knowledge": {
    "path": "/path/to/knowledge",
    "validateOnLoad": true
  },
  "git": {
    "autoCommit": false,
    "requireReview": true,
    "branchPrefix": "feature/"
  }
}
```

**Loader Tasks:**
1. Search for `.bifrostrc.json` in project root, then parent dirs
2. Parse JSON and validate schema
3. Merge with defaults (if key not in config, use default)
4. Provide getter functions (getProjectName(), getTimeout(), etc.)
5. Allow runtime override via CLI flags (--project-name, --timeout, etc.)

**Acceptance Criteria:**
- ✅ Config file is optional (defaults work if not present)
- ✅ Config can be overridden by CLI flags
- ✅ Invalid config fails with clear error message
- ✅ All required settings have sensible defaults

**References:** Framework Spec (Workspace & Tooling)

---

### 2. Commands

Each command follows this pattern:
1. Parse user input (arguments, flags, options)
2. Load config + knowledge
3. Run validation
4. Execute business logic
5. Update STATE.md
6. Display results

#### 2.1 bifrost-init Command

**Input:** From Framework Spec (INITIALIZATION FLOW), CLI Plan (The Interrogation Process), CLI layout (all screens)  
**Deliverable:** Complete bifrost-init initialization flow

**Flow:**
```
Screen 1: Splash & Auto-Update
  ↓
Screen 2: Asset Discovery (confirm assets/instructions exist)
  ↓
Screen 3: The "Big Split" (Path A/B/C)
  ├─ Path A: Existing Bifrost surface (ask which app)
  ├─ Path B: New standalone project (ask setup questions)
  └─ Path C: Landing page / one-off (minimal setup)
  ↓
Screen 4: Destination Selection (for Path A only)
  ↓
Screen 5: Deep Interview (questions based on path)
  ↓
Screen 6: Hydration Progress (build + validate hydration)
  ↓
Screen 7: Completion & Launch
```

**Interrogation Questions** (from CLI layout + Framework Spec):

**Path A (Existing Bifrost):**
- Which Bifrost app? (account, business, shopping, Tokengo)
- What feature are you building? (name, 1-2 line description)
- Why is this feature needed? (business value, user need)
- Who owns this feature? (email or name)
- Timeline: When is this due? (date)
- Constraints/gotchas? (any known limitations)

**Path B (New Standalone):**
- Project name? (kebab-case)
- Technology stack? (which frontend framework, if any)
- What problem does this solve?
- Who is the primary user?
- What are success metrics?
- Timeline?

**Path C (Landing Page):**
- Page name? (what is it about)
- Target audience?
- Key messaging?
- Deadline?

**Builder Tasks:**
1. Display splash screen (version, auto-update prompt if needed)
2. Confirm project assets exist (git repo, knowledge files, etc.)
3. Show big split menu (Path A/B/C) with descriptions
4. Prompt for path choice
5. Ask path-specific questions (interactive prompts)
6. Build interrogation answers object
7. Write to `.bifrost/interrogation.md` (human-readable)
8. Validate answers (no empty required fields, etc.)
9. Show summary + ask for confirmation
10. Initialize `.bifrost/` directory structure:
    ```
    .bifrost/
    ├── STATE.md              (created)
    ├── interrogation.md      (created)
    ├── hydration.json        (created)
    ├── artifacts/            (directory)
    │   ├── @Intake/
    │   ├── @Planner/
    │   ├── @CodeGen/
    │   ├── @QA/
    │   ├── @Reviewer/
    │   └── @Monitor/
    └── logs/                 (directory)
        └── bifrost.log
    ```
11. Create initial STATE.md with status = "initialized"
12. Display next steps (bifrost start)

**Acceptance Criteria:**
- ✅ Screens display correctly (no wrapping, correct colors)
- ✅ Big split clearly explains three paths
- ✅ Questions are asked in correct order for each path
- ✅ Answers are validated (required fields, valid choices)
- ✅ Interrogation summary can be reviewed before confirmation
- ✅ `.bifrost/` directory is fully initialized
- ✅ STATE.md is created with valid YAML front matter
- ✅ User can easily see next steps

**References:** Framework Spec (INITIALIZATION FLOW), CLI Plan (The Interrogation Process), CLI layout (Screens 1-7), Technical Roadmap (DATA FLOW)

---

#### 2.2 /bifrost:start Command

**Input:** From Technical Roadmap (DATA FLOW), Framework Spec (INITIALIZATION FLOW)  
**Deliverable:** Command that starts first agent workflow

**Flow:**
```
Load STATE.md (ensure it exists + status is "initialized")
  ↓
Load hydration.json
  ↓
Validate hydration
  ↓
Build full hydration with all context
  ↓
Update STATE.md (status = "intake", add timeline entry)
  ↓
Trigger @Intake agent (Pedro's responsibility)
  ↓
Show "Agent starting..." message + polling instructions
  ↓
Monitor STATE.md for agent completion (watch artifacts/)
  ↓
Display completion message + next steps
```

**Implementation Tasks:**
1. Check that STATE.md exists (error if not, suggest bifrost-init)
2. Check that hydration.json exists and is valid
3. Load full hydration from builder (includes knowledge)
4. Update STATE.md (status → "intake", add timeline)
5. Show "Starting @Intake agent..." spinner
6. (Pedro's work) Call agent execution mechanism
7. Poll STATE.md every 2 seconds for artifact updates
8. Detect when @Intake completes (artifact appears)
9. Show agent output summary (artifact path, key decisions)
10. Display next steps ("bifrost status" to check progress, "bifrost review" to see outputs)

**Acceptance Criteria:**
- ✅ Works only if STATE.md exists + is initialized
- ✅ Hydration is valid before agent starts
- ✅ STATE.md is updated correctly
- ✅ Agent is triggered (integration with Pedro's agent interface)
- ✅ Agent completion is detected
- ✅ Clear next steps are shown
- ✅ Error messages are actionable (if hydration invalid, show what's wrong)

**References:** Technical Roadmap (DATA FLOW), Framework Spec (INITIALIZATION FLOW)

---

#### 2.3 /bifrost:status Command

**Input:** From Technical Roadmap (state tracking)  
**Deliverable:** Command that shows workflow status

**Display:**
```
╭─ Bifrost Status ────────────────────────────╮
│ Feature: Search Advanced Feature            │
│ Status: coding (in progress)                │
│ Created: 2026-04-27 10:00 AM                │
│                                             │
│ Timeline:                                   │
│ ✅ Intake (10:00 AM) - completed           │
│ ✅ Planner (10:15 AM) - completed          │
│ 🔄 CodeGen (10:30 AM) - in progress        │
│ ⏳ QA (pending)                             │
│ ⏳ Review (pending)                         │
│                                             │
│ Artifacts:                                  │
│ • @Intake: .bifrost/artifacts/@Intake/...  │
│ • @Planner: .bifrost/artifacts/@Planner/.. │
│ • @CodeGen: .bifrost/artifacts/@CodeGen/.. │
│                                             │
│ Blockers: None                              │
╰─────────────────────────────────────────────╯
```

**Implementation Tasks:**
1. Load STATE.md
2. Parse front matter (get status, version, feature name)
3. Extract timeline entries
4. Extract artifact links
5. Extract blockers (if any)
6. Format as table/ASCII box
7. Show clear status emoji (✅ done, 🔄 in progress, ⏳ pending, ❌ failed)
8. Provide quick jump links ("bifrost review" to see outputs)

**Acceptance Criteria:**
- ✅ Shows current status clearly
- ✅ Timeline is easy to scan
- ✅ All artifacts are listed with paths
- ✅ Blockers are highlighted if present
- ✅ Works even if some agents haven't run yet

**References:** Framework Spec (STATE MANAGEMENT)

---

#### 2.4 /bifrost:review Command

**Input:** From Framework Spec (agent output review)  
**Deliverable:** Command that displays agent outputs

**Flow:**
```
Load STATE.md
  ↓
Get list of artifacts from timeline
  ↓
For each artifact:
  - Load file content
  - Display with formatting (syntax highlighting, table formatting, etc.)
  - Show artifact metadata (agent, timestamp, status)
  ↓
Prompt for next steps:
  - Accept artifact? → Update STATE.md
  - Request changes? → Add blocker, update status
  - Review next artifact?
```

**Implementation Tasks:**
1. Load STATE.md (get artifact list)
2. For each artifact, load file and parse based on type:
   - `.md` files: render as formatted markdown
   - `.json` files: pretty-print with syntax highlighting
   - `.patch` files: show diff format
3. Display artifact metadata (agent, time, size)
4. Show artifact content with syntax highlighting
5. Prompt for decision:
   - `y` = Accept (move to next)
   - `n` = Request changes (add blocker, stay on this)
   - `q` = Quit review
6. If rejected, update STATE.md (add blocker, update status)
7. If accepted, update STATE.md (timeline entry, status)

**Acceptance Criteria:**
- ✅ All artifact types display correctly
- ✅ Syntax highlighting works for code
- ✅ Markdown is readable
- ✅ User can easily accept/reject
- ✅ Blockers are recorded in STATE.md
- ✅ Can review one artifact or all in sequence

**References:** Framework Spec (state management, artifact format)

---

#### 2.5 /bifrost:deliver Command

**Input:** From Technical Roadmap (delivery + merge)  
**Deliverable:** Command that finalizes feature + creates PR

**Flow:**
```
Validate STATE.md (all agents completed)
  ↓
Ask for review confirmation
  ↓
Create git branch (if not already on feature branch)
  ↓
Stage all code changes (.bifrost/artifacts/*/code.patch)
  ↓
Commit with generated message
  ↓
Create GitHub PR (with STATE.md summary)
  ↓
Update STATE.md (status = "merged" or "pr-created")
  ↓
Display PR link + next steps
```

**Implementation Tasks:**
1. Validate STATE.md (all required agents have completed, no blockers)
2. Ask for final confirmation ("Review looks good? Create PR?")
3. Detect git status (create feature branch if needed, using `feature/` prefix)
4. Parse code artifacts from `.bifrost/artifacts/@CodeGen/`
5. Apply patches to codebase
6. Git add + commit (with message from STATE.md)
7. Create GitHub PR (using gh CLI):
   - Title: from STATE.md feature name
   - Body: summary of decisions + artifacts + timeline
   - Labels: auto-label as "bifrost-generated"
8. Update STATE.md (status → "pr-created", add PR link)
9. Display PR URL + congratulations message

**Git Commit Message Template:**
```
feat: [feature-name] - generated by Bifrost

## Summary
[Feature description from interrogation]

## Timeline
[Timeline from STATE.md]

## Artifacts
- Intake: [link]
- Planner: [link]
- CodeGen: [link]
- QA: [link]
- Reviewer: [link]

Bifrost: https://github.com/bifrost-framework
Generated: [timestamp]
```

**Acceptance Criteria:**
- ✅ Validates that feature is complete before creating PR
- ✅ Git workflow is clean (no conflicts, correct branch)
- ✅ PR is created with all artifacts linked
- ✅ Commit message is descriptive + includes timeline
- ✅ PR title and body match STATE.md
- ✅ User sees PR URL immediately

**References:** Technical Roadmap (DATA FLOW - git workflow), Framework Spec (delivery)

---

### 3. UI/UX

#### 3.1 Interrogation Prompts

**Input:** From CLI Plan (section 3), CLI layout (Screen 5)  
**Deliverable:** Interactive prompt sequences for each path

**Implementation:**
- Use `enquirer` for interactive prompts (yes/no, select, input, checkbox)
- Store answers in object as typed data
- Validate each answer (required vs optional, valid choices)
- Show progress (question 1/5, etc.)
- Allow going back to previous question
- Show summary at end for confirmation

**Acceptance Criteria:**
- ✅ Prompts are clear + descriptive
- ✅ Answers are validated immediately
- ✅ Users can go back and change answers
- ✅ Summary is accurate + easy to review
- ✅ Works for all three paths (A, B, C)

**References:** CLI Plan (section 3), CLI layout (Screen 5)

---

#### 3.2 Progress Screens & Spinners

**Input:** From CLI layout (Screen 6 - Hydration Progress)  
**Deliverable:** Loading spinners + progress screens

**Types of Progress:**
- Spinner (when duration unknown): "Building hydration context..." ✓
- Progress bar (when duration known): "Validating schema" [████░░░░░░] 40%
- Status list (multiple steps): 
  ```
  ✓ Loaded knowledge graph
  ✓ Analyzed codebase
  🔄 Building hydration
  ⏳ Validating schema
  ```

**Implementation Tasks:**
1. Use `ora` library for spinners
2. Use `progress` library or custom for progress bars
3. Show status emoji transitions (⏳ → 🔄 → ✓)
4. Clear spinner when step completes
5. Move to next step

**Acceptance Criteria:**
- ✅ Spinners display smoothly (no flickering)
- ✅ Progress bars are accurate
- ✅ Status lists are easy to scan
- ✅ No visual glitches on terminal resize
- ✅ Works in CI/CD (respects piped output)

**References:** CLI layout (Screen 6)

---

#### 3.3 Output Formatting

**Input:** From CLI layout (various screens)  
**Deliverable:** Formatted output (tables, lists, colored text)

**Formatting Functions:**
- `formatTable(data)` — Display structured data as ASCII table
- `formatList(items)` — Bullet list with colors
- `formatBox(title, content)` — ASCII box with title
- `formatCode(code, language)` — Syntax-highlighted code
- `formatStatus(status)` — Status badges (✅ ✓ 🔄 ⏳ ❌)
- `formatError(message)` — Error message (red, bold)
- `formatSuccess(message)` — Success message (green, bold)
- `formatWarning(message)` — Warning (yellow)

**Implementation Tasks:**
1. Use `chalk` for colors/bold/underline
2. Use custom ASCII box drawing for tables
3. Use syntax highlighting library for code
4. Ensure output is readable in 80-char terminals
5. Ensure colors work across platforms (Windows, Mac, Linux)

**Acceptance Criteria:**
- ✅ All tables render correctly
- ✅ Colors work on all platforms
- ✅ Text is readable (good contrast)
- ✅ No overflow on 80-char terminals
- ✅ Works with `--no-color` flag (graceful degradation)

**References:** CLI layout (all screens)

---

### 4. Testing Strategy

#### 4.1 Unit Tests

**Scope:** Individual functions, no dependencies

**Test Suites:**
- `tests/unit/commands/*.spec.ts` — Each command (mocked dependencies)
- `tests/unit/core/hydration/*.spec.ts` — Hydration builder, validator
- `tests/unit/core/state/*.spec.ts` — STATE.md operations
- `tests/unit/core/knowledge/*.spec.ts` — Knowledge loader, search
- `tests/unit/core/git/*.spec.ts` — Git operations
- `tests/unit/ui/*.spec.ts` — Prompt logic, output formatting

**Example Test:**
```typescript
describe('hydration validator', () => {
  it('should accept valid hydration', () => {
    const valid = { project: {...}, context: {...} };
    const result = validator.validate(valid);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalid = { project: {...} }; // missing context
    const result = validator.validate(invalid);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('context is required');
  });
});
```

**Coverage Target:** 80%+ of commands + core logic

**References:** Framework Spec (testing strategy)

---

#### 4.2 Integration Tests

**Scope:** Commands + dependencies together (with mocks for agents)

**Test Scenarios:**
- `tests/integration/bifrost-init-pathA.spec.ts` — Full bifrost-init flow (path A)
- `tests/integration/bifrost-init-pathB.spec.ts` — Full bifrost-init flow (path B)
- `tests/integration/start-to-status.spec.ts` — bifrost start → bifrost status
- `tests/integration/state-workflow.spec.ts` — STATE.md updates through workflow
- `tests/integration/knowledge-loading.spec.ts` — Load knowledge, build hydration, validate

**Example Test:**
```typescript
describe('bifrost-init workflow (path A)', () => {
  it('should complete full initialization', async () => {
    const cmd = new InitCommand();
    const result = await cmd.run({
      path: 'Bifrost-shopping',
      app: 'shopping',
      feature: 'Search Advanced',
      ...
    });

    expect(result.success).toBe(true);
    expect(fs.existsSync('.bifrost/STATE.md')).toBe(true);
    expect(fs.existsSync('.bifrost/hydration.json')).toBe(true);
  });
});
```

**References:** Framework Spec (testing strategy)

---

#### 4.3 Mock Agent Implementations

**Scope:** Fake agents for testing workflows

**Mocks Needed:**
- `mocks/agents/@Intake.mock.ts` — Simulates @Intake output
- `mocks/agents/@Planner.mock.ts` — Simulates @Planner output
- `mocks/agents/@CodeGen.mock.ts` — Simulates @CodeGen output
- `mocks/agents/@QA.mock.ts` — Simulates @QA output
- `mocks/agents/@Reviewer.mock.ts` — Simulates @Reviewer output

**Mock Behavior:**
- Takes hydration.json as input
- Outputs realistic artifact (intake.md, plan.md, code.patch, etc.)
- Updates STATE.md (status, timeline)
- Can simulate failures/blockers for error testing

**Example Mock:**
```typescript
export class MockIntakeAgent {
  async run(hydration: Hydration): Promise<void> {
    const intake = `# Intake Summary\n\nFeature: ${hydration.project.feature}\n...`;
    fs.writeFileSync('.bifrost/artifacts/@Intake/intake.md', intake);
    stateManager.updateTimeline('Intake completed');
    stateManager.updateStatus('planning');
  }
}
```

**References:** Framework Spec (agent interface - to be defined by Pedro)

---

#### 4.4 Manual Testing Guide

**Deliverable:** `tests/manual-testing/TESTING_GUIDE.md`

**Contents:**
- Pre-test checklist (git clean, Node version, env vars)
- Step-by-step test scenarios:
  1. `bifrost-init` (all paths A/B/C)
  2. `bifrost start` → agent triggers
  3. `bifrost status` → shows progress
  4. `bifrost review` → review outputs
  5. `bifrost deliver` → create PR
- Expected outputs for each step
- Troubleshooting guide (if X happens, check Y)
- Screenshots or ASCII mockups

**Example Section:**
```markdown
## Test Scenario: bifrost-init Path A

### Setup
1. Clone fresh Bifrost repo
2. Run: cd apps/shopping
3. Run: bifrost init

### Expected Flow
- Splash screen appears
- Asset discovery runs (checks for .git, /knowledge/)
- "Big split" menu shown
- Select "Path A"
- Asked: Which app? (select shopping)
- Asked: Feature name? (enter "Search Advanced")
- Interrogation summary shown
- Confirm? (enter y)

### Verification
- ✓ .bifrost/STATE.md exists
- ✓ .bifrost/hydration.json exists and is valid
- ✓ STATUS.md shows "status: initialized"
- ✓ Terminal shows "Ready to start feature" + next steps
```

---

#### 4.5 E2E Tests

**Scope:** Full workflow with real agents (when Pedro completes agent implementation)

**Test Scenarios:**
- `tests/e2e/full-workflow.spec.ts` — bifrost-init → start → status → review → deliver (complete feature)
- `tests/e2e/agent-failure-handling.spec.ts` — Agent fails, user can retry or skip
- `tests/e2e/state-recovery.spec.ts` — Kill workflow halfway, recover and continue

**Status:** These tests are blocked until Pedro delivers agent interface.

**References:** Framework Spec (E2E testing strategy)

---

### 5. Documentation

#### 5.1 CLI User Documentation (README.md)

**Contents:**
- Quick start (install, first command)
- Command reference (all /bifrost:* commands with examples)
- Interrogation paths explained (A/B/C)
- Configuration (.bifrostrc.json examples)
- Troubleshooting (common errors, solutions)
- Examples (complete workflow walkthrough)

#### 5.2 Developer Guide (DEVELOPMENT.md)

**Contents:**
- Architecture overview (hydration, STATE.md, knowledge graph)
- File structure walkthrough
- Adding a new command (step-by-step)
- Running tests locally
- Debugging tips
- Contribution guidelines

#### 5.3 API Reference

**Contents:**
- Hydration interface (TypeScript types)
- STATE.md schema (required fields, valid values)
- Knowledge loader API (search functions, data structures)
- Command interface (signature for new commands)

---

### 6. Deliverables

#### 6.1 npm Package

**Publication Steps:**
1. Create `package.json` with `"name": "@bifrost/cli"` (scoped package)
2. Build: `npm run build`
3. Test: `npm run test`
4. Version bump: `npm version patch|minor|major`
5. Publish: `npm publish`

**Entry Points:**
- CLI binary: `/bin/bifrost` (executable)
- Node API: `lib/index.ts` (exports all functions for programmatic use)

#### 6.2 Installation & Troubleshooting

**Installation Guide:**
```bash
# Global installation
npm install -g @bifrost/cli

# Verify installation
bifrost --version
bifrost --help

# Local development
git clone <repo>
cd bifrost-framework/tools/bifrost-cli
npm install
npm run build
npm link  # symlink local version
```

**Troubleshooting:**
- "bifrost: command not found" → Check npm global path
- "Permission denied" → Run with sudo or fix npm permissions
- "Hydration validation failed" → Check knowledge/ files exist
- Agent doesn't start → Check STATE.md is valid, hydration is complete

---

## Dependencies & Handoffs with Pedro

### Core Alignment (Solved by Framework Spec)

We previously thought we were blocked waiting on Pedro to define these interfaces. However, the `docs/architecture/framework-specification.md` already defines them:

1. **Agent Trigger Mechanism:** Option D. Agents are Claude Code/Antigravity skills (Markdown files). The CLI just copies them to `~/.claude/skills/`. The human user types `/bifrost:start` inside Claude Code to trigger them natively.
2. **STATE.md Schema:** It's standard Markdown text, not a strict JSON schema.
3. **Hydration Interface:** It's text replacement using `{{injection-points}}` in Markdown templates, not a `hydration.json` file.

### Timeline Dependencies

| Your Work | Depends On |
|-----------|-----------|
| 1.2 Hydration System | Ready to implement (Template Replacement) |
| 1.3 STATE.md Management | Ready to implement (Markdown format) |
| 2.2 /bifrost:start | Ready to implement (Skill alias mapping) |

**Recommendation:** Schedule a joint design session with Pedro to align on:
- Agent interface (input/output)
- STATE.md schema
- Artifact formats
- Communication mechanism (file-based STATE.md is working hypothesis)

---

## Implementation Sequence

### Phase 1A: Foundation (Weeks 1-2)

**Goals:** Get core infrastructure working

1. ✅ Set up CLI framework (oclif + build)
2. ✅ Implement knowledge loader (read /knowledge/ files)
3. ✅ Implement STATE.md manager (CRUD operations)
4. ✅ Define Agent interface with Pedro
5. ✅ Implement hydration system
6. ✅ Unit tests for core (knowledge, state)

**By End of Week 2:**
- CLI runs and shows help
- Knowledge is loaded + searchable
- STATE.md can be created/read/updated
- Core unit tests pass

---

### Phase 1B: Commands (Weeks 3-4)

**Goals:** Implement all 5 commands

1. ✅ bifrost-init (full interrogation + setup)
2. ✅ /bifrost:start (kick off agent)
3. ✅ /bifrost:status (show progress)
4. ✅ /bifrost:review (display artifacts)
5. ✅ /bifrost:deliver (create PR)
6. ✅ Integration tests for workflows

**By End of Week 4:**
- All commands work end-to-end (with mock agents)
- Integration tests pass
- Manual testing guide written

---

### Phase 1C: Polish (Weeks 5-6)

**Goals:** Make it production-ready

1. ✅ UI/UX polish (colors, formatting, progress)
2. ✅ Error handling + helpful messages
3. ✅ Documentation (README, DEVELOPMENT, API ref)
4. ✅ E2E tests (with real agents if available)
5. ✅ npm package setup + publish

**By End of Week 6:**
- CLI is published to npm
- All documentation is complete
- E2E tests pass (or ready to pass once Pedro ships agents)

---

## Success Criteria

### Build Success

- ✅ All 5 commands implemented + working
- ✅ Hydration system builds + validates correctly
- ✅ STATE.md is managed accurately
- ✅ All unit + integration tests pass (80%+ coverage)
- ✅ CLI is published to npm
- ✅ All documentation is complete + accurate

### Operational Success

- ✅ Users can initialize a feature project with bifrost-init
- ✅ Users can trigger agent workflows with /bifrost:start
- ✅ Users can track progress with /bifrost:status + /bifrost:review
- ✅ Users can finalize features with /bifrost:deliver
- ✅ Errors are clear + actionable
- ✅ CLI completes a full workflow in <5 minutes

### Code Quality

- ✅ TypeScript strict mode passes
- ✅ ESLint passes (no errors, no warnings)
- ✅ No console.log statements in production code
- ✅ All async operations have timeout handling
- ✅ All user inputs are validated

### Documentation Quality

- ✅ README is clear to first-time users
- ✅ DEVELOPMENT guide is complete for contributors
- ✅ API reference is precise + includes examples
- ✅ Manual testing guide is step-by-step + verifiable
- ✅ All code has TSDoc comments (no implementation comments)

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Pedro's agent interface changes | All hydration + STATE work needs rework | Medium | Define agent interface early + lock it in writing |
| STATE.md schema conflicts | STATE manager becomes outdated | Medium | Have Pedro define schema + you implement validator |
| Knowledge files become stale | Hydration has wrong info | Low | Add knowledge validation step to CLI |
| Knowledge files are too large (parsing slow) | CLI startup is slow | Low | Cache parsed knowledge to JSON file |
| Git operations fail (merge conflicts) | /bifrost:deliver fails | Low | Add safety checks + clear error messages + manual fallback |
| Agents timeout / don't complete | /bifrost:status hangs | Medium | Implement configurable timeout + require agent completion signal |
| Tests are flaky (timing issues) | CI fails intermittently | Medium | Use fake timers in tests, avoid real delays |

---

## References to Documentation

### Framework Specification.md
- INITIALIZATION FLOW (section 3) — bifrost-init process
- AGENT HYDRATION SYSTEM (section 5) — how to build hydration
- STATE MANAGEMENT - FORGE Pattern (section 7) — STATE.md format
- KNOWLEDGE GRAPH INTEGRATION (section 6) — knowledge loader
- SKILL INJECTION (section 8) — how skills work (reference only)

### Technical Roadmap & Visual Architecture.md
- SYSTEM ARCHITECTURE DIAGRAM — system design
- DATA FLOW: A Feature from Start to Merge — complete workflow
- AGENT RESPONSIBILITY MATRIX — agent specs (reference only)
- SKILL MAPPING — skill specs (reference only)
- TECHNICAL IMPLEMENTATION ROADMAP (Phase 1 section) — detailed phases

### Bifrost CLI Plan.md
- THE INTERROGATION PROCESS (section 3) — interview questions
- HYDRATION & AI TRAINING (section 4) — hydration details
- GUARDRAILS & PERFECT DELIVERY (section 5) — validation

### bifrost CLI layout.md
- All screens (Screen 1-7) — UI/UX mockups

### Frontend_repository_manual.md
- Referenced by knowledge loader (API_CONTRACTS, COMPONENT_LIBRARY, etc.)

### Knowledge folder files
- API_CONTRACTS.md — Loaded by knowledge loader
- COMPONENT_LIBRARY.md — Loaded by knowledge loader
- NAMING_CONVENTIONS.md — Loaded by knowledge loader
- TECH_STACK.md — Loaded by knowledge loader
- GOTCHAS.md — Loaded by knowledge loader

---

## Version & Status

**Version:** 1.0 (Phase 1)  
**Status:** Ready for development  
**Owner:** Caio  
**Last Updated:** 2026-04-27

**Next Step:** Schedule joint design session with Pedro to define:
- Agent interface (input/output)
- STATE.md schema
- Artifact naming + formats
- Communication mechanism

