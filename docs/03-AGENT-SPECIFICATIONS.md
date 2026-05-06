---
type: reference
status: active
topic: bifrost/agents-skills
---

# BIFROST Agents & Skills Reference

Complete specification of all 7 agents and all 9 skills. This is the **single source of truth** for what each does. **Source materials:** Technical Roadmap & Visual Architecture, Framework Specification, Core Invariants.

---

Each agent is a **markdown template file** that provides instructions and context for an external AI assistant (like Claude Code). Bifrost does not run these agents internally via AI; instead, it prepares the templates so that the AI can act as the specified role. Agents are "hydrated" per-project with context-specific values before being used by the AI.

### Core Agent Protocols
1. **Fixed Roster**: Agents are fixed at 7 lifecycle roles. Adding a new agent requires a formal architectural override.
2. **Mandatory Trajectory Read**: Every agent's first action is to read `.bifrost/TRAJECTORY.md`.
3. **Artifact Acknowledgement**: Every artifact produced must contain a `## Trajectory acknowledged` section.
4. **Trajectory Abort**: If a locked invariant is violated or a gap is found mid-flight, the agent must **Hard Stop**.

> [!IMPORTANT]
> **The "Thin Agent" Law**: All hydrated agents must maintain a **Context Density < 40%**. Excessive context (instruction sets > 20k tokens) is a failure of Context Engineering. Bifrost uses **Surgical Hydration** to ensure agents receive only the high-density sections of knowledge relevant to their phase.

---

## Deterministic Efficiency Metrics

All agents are measured against three dimensions to ensure predictable, economic performance:

| Metric | Definition | Target | Measurement |
|--------|-----------|--------|-------------|
| **Context Density** | Ratio of instruction tokens to total context | < 40% | Calculated post-hydration via sectional extraction metrics |
| **Turns (Execution Efficiency)** | Number of iterations to complete phase | ≤ 2 per complex task | Tracked in STATE.md; counts redo/retry cycles |
| **Redos (Determinism)** | Failed attempts due to hydration/instruction errors | 0 | Logged when agent restarts task; indicator of normalization fidelity |
| **Pattern Density** | Ratio of matched architectural patterns to custom implementations | > 60% for @CodeGen | Validated via `bifrost-graphify-ref` skill; ensures reuse |
| **Token Efficiency** | Tokens used vs. token_budget allocation | > 90% accuracy | STATE.md tracks `token_usage` vs. `token_budget` |

**Economic Harness Integration**
- Every feature initializes with explicit `token_budget` in STATE.md
- Session metrics (`metrics_turns`, `metrics_redos`, `metrics_density`) updated after each agent phase
- Benchmarking suite (`bifrost-benchmark.js`) validates metrics at initialization, preventing budget overruns
- Autonomous health monitoring flags sessions exceeding density thresholds for manual review

---

### @Intake — Feature Scope Analysis

**File:** `Intake_Template.md` → `Intake_HYDRATED.md`

**When it runs:** Feature kickoff (`/bifrost:start`)

**What it reads:**
- `.bifrost/PATIENT.md` (feature scope / admission record)
- Architecture Graph (existing APIs, components, patterns)
- `PROJECT_CONTEXT.md` (project-specific system prompt)

**What it does:**
1. Analyzes the scope: "What are we really building?"
2. Queries the architecture graph: "Do these APIs/components exist?"
3. Identifies potential impact: "What parts of the system change?"
4. Flags unknowns: "What needs clarification?"
5. Validates assumptions: "Are the constraints realistic?"
6. Produces TRAJECTORY.md: Locks design decisions and constraints (per ADR-008)

**What it produces:**
- `TRAJECTORY.md` — Locked-at-launch invariant store (per ADR-008)
- `IMPACT.md` — Detailed scope impact analysis
- Approval gate: Developer must review + approve before proceeding

**Success looks like:**
```
IMPACT.md contains:
✓ Clear restatement of what's being built
✓ List of APIs that will be called (with links to API contracts)
✓ List of components that will be created/modified
✓ Data flow diagram
✓ Identified edge cases
✓ Dependency list (what else must be done first?)
✓ Risk flags (if any)

TRAJECTORY.md contains:
✓ Feature identity (name, author, deadline)
✓ Hard constraints (technical, regulatory, business)
✓ Acceptance criteria (clear definition of "done")
✓ Architectural decisions (patterns chosen, why)
✓ External context (APIs, dependencies, gotchas)
✓ Amendments log (append-only record of changes)

Efficiency Metrics:
✓ Context Density < 40% (Verified)
✓ Redos: 0 (Deterministic intake)
✓ Token usage within phase budget
```

---

### @Planner — Task Breakdown

**File:** `Planner_Template.md` → `Planner_HYDRATED.md`

**When it runs:** After scope approval (`/bifrost:plan`)

**What it reads:**
- `.bifrost/PATIENT.md` (original scope)
- `.bifrost/TRAJECTORY.md` (locked constraints and decisions)
- `.bifrost/IMPACT.md` (scope analysis from @Intake)
- Architecture Graph (function signatures, patterns)
- `bifrost-code-standards` skill
- `PROJECT_CONTEXT.md`

**What it does:**
1. Takes the impact analysis
2. Breaks it into 5-10 concrete, sequential tasks
3. Each task should be completable in 30-60 minutes
4. Identifies task dependencies
5. Suggests autonomy gates (which tasks need approval?)

**What it produces:**
- `PLAN.md` — Detailed task breakdown with estimated time per task
- Approval gate: Developer must review + approve before coding starts

**Success looks like:**
```
PLAN.md contains:

## Phase 1: Backend Integration
- Task 1: Create API endpoint (30 min)
  - Run @CodeGen to generate function signature
  - Follow api-integration skill
  - Endpoint: POST /api/search/query
  
- Task 2: Add database schema (45 min)
  - Update migrations
  - Add indexes for query performance
  
- Task 3: Write API tests (30 min)
  - Happy path: valid query
  - Sad path: empty query, malformed input
  - Edge case: timeout on slow DB

## Phase 2: Frontend Integration
- Task 4: Create search component (45 min)
  - Use Material search input
  - Emit query events
  - Tests included
  
- Task 5: Integrate with store (30 min)
  - Dispatch search actions
  - Subscribe to results
  
- Task 6: UI refinement (30 min)
  - Pagination
  - Loading state
  - Error handling
```

---

### @CodeGen — Code Generation

**File:** `CodeGen_Template.md` → `CodeGen_HYDRATED.md`

**When it runs:** Execution phase (`/bifrost:build`)

**What it reads:**
- `.bifrost/PLAN.md` (task breakdown)
- `.bifrost/TRAJECTORY.md` (locked constraints)
- `bifrost-system-context` skill (master prompt)
- `bifrost-code-standards` skill (naming, structure, patterns)
- `bifrost-api-integration` skill (how to call APIs)
- `bifrost-component-gen` skill (UI component rules)
- `bifrost-code-review` skill (self-review checklist)
- Architecture Graph (existing code patterns)
- `PROJECT_CONTEXT.md`

**What it does:**
1. Reads each task in PLAN.md
2. Generates source code for that task
3. Follows every rule in the skills (naming, structure, error handling, testing)
4. Self-reviews against `bifrost-code-review` checklist
5. Runs tests: `yarn test` or equivalent
6. Documents what was generated

**What it produces:**
- Source files (TypeScript, HTML, SCSS)
- Unit tests for each component/function
- `CODE_REVIEW.md` — Self-review results + checklist
- Auto-run QA_REPORT.md (test results)

**Success looks like:**
```
CODE_REVIEW.md contains:

✓ All tasks in PLAN completed
✓ Code follows bifrost-code-standards
✓ All functions have unit tests (>80% coverage)
✓ API calls match API_CONTRACTS.md
✓ Component props documented
✓ Error cases handled
✓ No console warnings
✓ ESLint passes
✓ TypeScript strict mode passes

Test Results:
✓ unit tests passing (Happy path, Sad path, Edge cases)

Efficiency Metrics:
✓ Context Density < 45% (High density implementation)
✓ Pattern Targeting: 100% (No generic inventions)
✓ Redos < 2 per complex task
```

---

### @QA — Testing & Validation

**File:** `QA_Template.md` → `QA_HYDRATED.md`

**When it runs:** After code generation (`/bifrost:qa`)

**What it reads:**
- Generated source code
- `bifrost-qa-validator` skill (test scenarios, patterns)
- `.bifrost/PLAN.md` (what was supposed to be built)
- `.bifrost/TRAJECTORY.md` (constraints that must be respected)
- Architecture Graph (API contracts to validate against)
- `CODE_REVIEW.md` (what @CodeGen claims)

**What it does:**
1. Runs unit tests: `yarn test`
2. Runs e2e tests (if applicable)
3. Tests happy path: "Does the feature work as designed?"
4. Tests sad path: "Does it fail gracefully?"
5. Tests edge cases: "What happens with weird input?"
6. Validates API integration: "Do API calls match the contracts?"
7. Checks accessibility: "Can users with screen readers use it?"
8. Checks responsive design: "Does it work on mobile?"

**What it produces:**
- `QA_REPORT.md` — Test results + findings
- Pass/Fail gate: If fail, hard stops. Developer must fix issues.

**Success looks like:**
```
QA_REPORT.md contains:

Feature: Search Portal
Status: PASS ✓

Unit Tests:
✓ 24/24 passing
✓ Happy path: user types "token", gets results
✓ Sad path: user types invalid char, sees error
✓ Edge case: user types very long query, handled
✓ Edge case: no results, "no results" message shown

E2E Tests:
✓ Full flow: load page → search → click result → navigate
✓ Mobile: search works on 320px width
✓ Accessibility: keyboard nav works, screen reader announces results

API Validation:
✓ POST /api/search/query — matches contract
✓ Response shape matches API_CONTRACTS.md
✓ Error responses follow standard format

Performance:
✓ Search completes <500ms
✓ Page load <2s
✓ No memory leaks

Issues Found:
(none)
```

---

### @Conductor — State Management & Orchestration

**File:** `Conductor_Template.md` → `Conductor_HYDRATED.md`

**When it runs:** After every step (continuous)

**What it reads:**
- `.bifrost/STATE.md` (current execution state)
- `.bifrost/TRAJECTORY.md` (locked constraints)
- All other artifacts (PATIENT, PLAN, CODE_REVIEW, QA_REPORT)
- File system (what files were actually changed?)
- Git history (what commits were made?)

**What it does:**
1. After @Intake completes: Updates STATE.md with "scope analyzed"
2. After @Planner completes: Updates STATE.md with "plan approved"
3. After @CodeGen completes: Updates STATE.md with "code generated"
4. After @QA completes: Updates STATE.md with "QA passed"
5. Before delivery: Finalizes STATE.md with complete record
6. Enforces autonomy: Respects STATE.md frontmatter `autonomy:` field

**What it produces:**
- Updated `STATE.md` (append-only log of what happened)
- Decision: Can we proceed to next phase? Any blockers?

**Success looks like:**
```
STATE.md shows:

Feature: Add Search Portal
Admitted: 2026-04-27 09:00 UTC
Status: qa_passed
Autonomy: Task-Gated

Phase 1: Analysis
- [x] @Intake analyzed scope → IMPACT.md (09:15)
- [x] @Intake locked trajectory → TRAJECTORY.md (09:15)
- [x] Developer approved impact (09:30)

Phase 2: Planning
- [x] @Planner broke into tasks → PLAN.md (10:00)
- [x] Developer approved plan (10:15)

Phase 3: Development
- [x] @CodeGen generated code (11:45)
- [x] @CodeGen self-reviewed → CODE_REVIEW.md (11:50)

Phase 4: Quality
- [x] @QA tested → QA_REPORT.md PASS (12:00)

All tasks complete. Ready for delivery.

Commits:
- abc1234: feat: add search endpoint
- def5678: feat: add search component
- ghi9012: test: add search tests
```

---

### @Monitor — Drift Detection

**File:** `Monitor_Template.md` → `Monitor_HYDRATED.md`

**When it runs:** Continuous monitoring (background)

**What it reads:**
- `.bifrost/` directory structure
- `.bifrost/TRAJECTORY.md` (locked constraints)
- All artifact files (PATIENT, PLAN, STATE, etc.)
- File system (what actually exists in source tree?)
- Git changes (what was actually committed?)

**What it does:**
1. Checks: "Does everything in PLAN.md exist in source tree?"
2. Checks: "Are all files referenced in STATE.md actually tracked?"
3. Checks: "Have any unexpected files been modified?"
4. Checks: "Is anything violating TRAJECTORY constraints?"
5. Detects drift: "Did something change that STATE.md doesn't know about?"
6. Alerts: "Here's what changed outside the plan"

**What it produces:**
- `VITALS.md` — Health check report
- Alerts: If drift detected, flag it for @Conductor

**Success looks like:**
```
VITALS.md shows:

Feature: Search Portal
Last Check: 2026-04-27 12:05 UTC
Status: HEALTHY ✓

STATE.md Validation:
✓ STATE.md is valid YAML
✓ All tasks marked complete exist in code
✓ All commits listed exist in git
✓ Timestamps are sequential

Trajectory Validation:
✓ No constraints violated
✓ Hard constraints still hold
✓ Design decisions still enforced

File Validation:
✓ All files from PLAN.md exist
✓ No unexpected files modified
✓ No orphaned files detected

Git Validation:
✓ All commits follow "feature: ..." naming
✓ No uncommitted changes
✓ Branch is clean

Issues:
(none)
```

---

### @Reviewer — Backend Handoff Preparation

**File:** `Reviewer_Template.md` → `Reviewer_HYDRATED.md`

**When it runs:** Before delivery (`/bifrost:deliver`)

**What it reads:**
- All artifacts (PATIENT, TRAJECTORY, IMPACT, PLAN, STATE, CODE_REVIEW, QA_REPORT, VITALS)
- Generated source code
- Git history
- Architecture Graph (to verify API alignment)

**What it does:**
1. Compiles all evidence: "What did we build? How?"
2. Writes HANDOFF.md: "Backend dev, here's everything you need to know"
3. Prepares PR metadata: Title, description, testing instructions
4. Creates pull request: Push branch to Backend repo
5. Prepares for code review: Summarizes changes + validates completeness

**What it produces:**
- `HANDOFF.md` — Complete handoff documentation for Backend
- Pull request with all context
- PR template: What changed, why, how to test, edge cases

**Success looks like:**
```
HANDOFF.md shows:

# Search Portal Feature Handoff

## What We Built
- Search endpoint: POST /api/search/query
- Search component: SearchPortalComponent
- Database schema: search_queries table
- Full test coverage: 24 tests, all passing

## Files Changed
### Backend
- src/api/search.api.ts (new)
- src/db/schema.sql (migration)

### Frontend
- apps/business/src/app/containers/search-portal/ (new)
  - search-portal.component.ts
  - search-portal.component.html
  - search-portal.component.scss
  - search-portal.spec.ts
- apps/business/src/app/core/stores/search/ (new)
  - search.actions.ts
  - search.reducer.ts
  - search.selectors.ts

## Trajectory Validation
✓ All hard constraints met
✓ All acceptance criteria satisfied
✓ Design decisions documented

## API Validation
✓ All endpoints match API_CONTRACTS.md
✓ Error responses follow standard format

## Test Results
✓ 24 unit tests passing
✓ Happy path, sad path, edge cases covered
✓ E2E tests pass on Chrome, Firefox, Safari

## Known Limitations
(none)

## Backend Review Checklist
- [ ] Code follows naming conventions
- [ ] API calls are correct
- [ ] Tests are comprehensive
- [ ] All trajectory constraints met
- [ ] Merge and deploy
```

---

## THE 9 SKILLS (Protocols)

Each skill is a repeatable protocol file. Skills are **always loaded** into Claude Code + Antigravity. They answer: "What rules do I follow?"

---

### Skill 1: bifrost-system-context

**When:** Every session (loaded globally)

**What it contains:**
- Master system prompt
- "You are in Bifrost framework context"
- "Read STATE.md and TRAJECTORY.md to understand current progress"
- "Follow all rules in other skills"
- High-level mission statement

**Used by:** @Intake, @Planner, @CodeGen, @QA, @Monitor (all agents)

**Example rule:**
```
You are working within the Bifrost framework.
Before any decision, check STATE.md for current status.
Before any implementation, check TRAJECTORY.md for hard constraints.
If STATE.md says "Task 3 blocked on missing API", 
respect that block — don't proceed until unblocked.
```

---

### Skill 2: bifrost-code-standards

**When:** Before writing any code

**What it contains:**
- Naming conventions (kebab-case files, camelCase functions)
- File structure (where things go)
- Design patterns (how we build components, services, etc.)
- Code quality rules (complexity, length, style)
- Linting rules reference (@angular-eslint, ESLint)
- Testing requirements (unit tests, coverage targets)

**Used by:** @CodeGen (self-review), GitHub Actions CI

**Example rules:**
```
Naming:
- Files: kebab-case (my-component.ts)
- Classes: PascalCase (MyComponent)
- Functions: camelCase (myFunction)
- Constants: UPPER_SNAKE_CASE (MY_CONSTANT)
- Private members: _privateMethod()

Structure:
- Components: {name}.component.ts, .html, .scss, .spec.ts
- Services: {name}.service.ts, .spec.ts
- Stores: {name}.actions.ts, .reducer.ts, .selectors.ts, .store.ts

Style:
- 4 spaces indent
- Single quotes only
- No var, only const/let
- Complexity < 4 per function
- Max line length: 140 chars
- No console.log (use logging service)
```

---

### Skill 3: bifrost-api-integration

**When:** Generating code that calls APIs

**What it contains:**
- HTTP client pattern (how to call APIs)
- Error handling (catch errors, dispatch to store)
- Authentication (how to send auth tokens)
- Timeout configuration
- Retry logic
- Response transformation (adapters)

**Used by:** @CodeGen, @QA (validation), @Reviewer

**Example rules:**
```
Always use the centralized API constant:
  import { api } from 'commonlib';
  const url = api.searching.queryPortals();

Wrap calls in services:
  @Injectable({ providedIn: 'root' })
  export class SearchService {
    constructor(private http: HttpClient) {}
    search(query: string): Observable<Result[]> {
      return this.http.post<Result[]>(
        api.searching.queryPortals(),
        { query },
        { timeout: 5000 }  // 5 second timeout
      );
    }
  }

Error handling:
  - Never catch errors silently
  - Dispatch to ErrorHandlingService
  - ErrorHandlingService shows snackbar + stores error
  - Never use .subscribe() directly
  - Use async pipe or ngrx selectors instead
```

---

### Skill 4: bifrost-component-gen

**When:** Creating UI components

**What it contains:**
- Component structure template
- Props (inputs/outputs) pattern
- Form handling (reactive forms)
- Material Design usage
- Accessibility requirements
- Testing patterns for components

**Used by:** @CodeGen, @Reviewer

**Example rules:**
```
Every component must have:
- @Component decorator with selector, template, styles
- @Input() for read-only data
- @Output() for events emitted to parent
- ngOnInit for setup
- ngOnDestroy for cleanup (unsubscribe from observables)
- Unit tests covering happy path + sad path

Material compliance:
- Use <mat-form-field> for inputs
- Use <mat-button> for buttons, not plain <button>
- Use <mat-card> for card layouts
- Use Material icons: <mat-icon>close</mat-icon>

Accessibility:
- Every input has a <label>
- Every button has aria-label
- Color is not the only indicator (also use text)
- Keyboard nav works (tab through all interactive elements)
- Screen reader can navigate the form
```

---

### Skill 5: bifrost-code-review

**When:** @CodeGen self-reviews

**What it contains:**
- Self-review checklist
- Questions to ask about the code
- Common mistakes to watch for
- When to flag issues

**Used by:** @CodeGen (self-review), GitHub Actions CI

**Example checklist:**
```
Before marking code complete:

✓ Does every function have a test?
✓ Do tests cover happy + sad + edge cases?
✓ Are error messages user-friendly?
✓ Does code follow naming conventions?
✓ Is complexity < 4 per function?
✓ Any TODO/FIXME comments? (explain in PR)
✓ Are there any console.log statements? (remove)
✓ Does it handle null/undefined gracefully?
✓ Are HTTP errors caught and handled?
✓ Does the code follow the established pattern?
✓ Is type safety 100%? (no any, unknown)
✓ Are imports organized (absolute then relative)?
✓ Does it pass ESLint?
✓ Does it pass TypeScript strict mode?
```

---

### Skill 6: bifrost-qa-validator

**When:** @QA runs tests

**What it contains:**
- Test scenarios to run
- What "happy path" means
- What "sad path" means
- What "edge cases" mean
- Performance targets
- Accessibility checks
- Mobile responsiveness checks

**Used by:** @QA, GitHub Actions CI

**Example test scenarios:**
```
Every feature must test:

Happy Path:
- User does what they're supposed to do
- System responds as expected
- No errors occur

Sad Path:
- User enters invalid input (empty, too long, wrong type)
- System shows error message, doesn't crash
- User can recover and retry

Edge Cases:
- User is logged out → redirect to login
- Network timeout → show error, allow retry
- Server returns error → show friendly message
- Database is slow → show loading state
- User mashes buttons fast → debounce, no duplicates
- Browser back button → state is consistent
- Page refresh → state persists (via store)

Performance:
- Page load < 2 seconds
- Button click → action < 100ms
- List render < 500ms
- Search results < 500ms

Accessibility:
- Keyboard-only user can navigate
- Screen reader announces all text
- Color is not only indicator
- Touch targets > 44px
- Contrast ratio > 4.5:1
```

---

### Skill 7: bifrost-graphify-ref

**When:** Need to query the architecture graph

**What it contains:**
- How to find the graph.json file
- How to query it (what functions exist?)
- How to read API_CONTRACTS.md
- How to discover existing patterns
- How to validate against the graph

**Used by:** @CodeGen, @Intake, @Reviewer

**Example usage:**
```
Query: "What endpoints exist for search?"
Answer from graph.json:
  - POST /api/search/query (takes query: string)
  - GET /api/search/categories (returns Category[])
  - GET /api/search/trending (returns string[])

Query: "How do other features call POST endpoints?"
Answer from graph: "See shopping/search-results for pattern"
  - All POST calls wrapped in service
  - All use api.xyz() from commonlib
  - All dispatch success/error actions

Query: "What's the Component library?"
Answer from COMPONENT_LIBRARY.md:
  - SearchInputComponent (in commonlib)
  - SearchResultsTableComponent (in commonlib)
  - Use these; don't reinvent
```

---

### Skill 8: bifrost-state-management

**When:** Updating STATE.md

**What it contains:**
- State file format (YAML, structure)
- What to track (tasks, phases, timestamps)
- When to update (after every step)
- How to timestamp (ISO 8601)
- How to mark completion (checkboxes)
- Autonomy field (Task-Gated, Phase-Gated, Full)

**Used by:** @Conductor, @Monitor

**Example structure:**
```yaml
Feature: "Search Portal"
Admitted: 2026-04-27T09:00:00Z
Status: "in_progress"
Autonomy: "Task-Gated"

Phases:
  - name: "Analysis"
    tasks:
      - name: "@Intake analyzes scope"
        status: "completed"
        timestamp: 2026-04-27T09:15:00Z
      - name: "Developer approves impact"
        status: "completed"
        timestamp: 2026-04-27T09:30:00Z

  - name: "Development"
    tasks:
      - name: "@CodeGen implements tasks 1-3"
        status: "in_progress"
        timestamp: 2026-04-27T10:00:00Z

Files Changed:
  - src/api/search.api.ts
  - apps/business/src/app/containers/search-portal/

Commits:
  - abc1234: "feat: add search endpoint"
  - def5678: "feat: add search component"
```

---

### Skill 9: bifrost-hr (Gap Detection & Growth)

**When:** During `@Intake` (/bifrost:start) when a domain gap is detected.

**What it contains:**
- **Gap Detection Criterion**: Triggers when `PATIENT.md` surfaces patterns/libraries not covered by existing skills.
- **Bootstrap Protocol**: "Extend or Fork" decision logic for new skills.
- **User Approval Checklist**: Roster changes require a **Hard Stop** and explicit human authorization.

**Used by:** `@Intake` only.

**Efficiency Law**: 
- Mid-flight gaps (discovered by `@CodeGen` or `@QA`) trigger a **Trajectory Abort**, not `bifrost-hr`.
- New skills are permanently committed to `core/skills/` to prevent redundant bootstrapping.

---

## Agent × Skill Matrix

Which skills does each agent use?

| Agent | system-context | code-standards | api-integration | component-gen | code-review | qa-validator | graphify-ref | state-mgmt | bifrost-hr |
|-------|---|---|---|---|---|---|---|---|---|
| @Intake | ✓ | - | - | - | - | - | ✓ | - | ✓ |
| @Planner | ✓ | ✓ | - | - | - | - | ✓ | - | - |
| @CodeGen | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | - | - |
| @QA | ✓ | ✓ | ✓ | - | - | ✓ | ✓ | - | - |
| @Conductor | ✓ | - | - | - | - | - | - | ✓ | - |
| @Monitor | ✓ | ✓ | - | - | - | - | - | ✓ | - |
| @Reviewer | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | ✓ | - |

---

## See Also

- [01-SYSTEM-ARCHITECTURE.md](01-SYSTEM-ARCHITECTURE.md) — How agents work together
- [02-OPERATOR-MANUAL.md](02-OPERATOR-MANUAL.md) — How agents get hydrated
- [01-SYSTEM-ARCHITECTURE.md](#the-five-invariants-ground-rules) — Invariants & Artifact Set
