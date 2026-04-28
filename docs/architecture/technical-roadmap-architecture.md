---
domain: professional
type: note
tags:
  - domain/professional
  - status/active
  - type/operation
  - topic/bifrost
---
# BIFROST: Technical Roadmap & Visual Architecture

---

## SYSTEM ARCHITECTURE DIAGRAM

```
┌───────────────────────────────────────────────────────────────────────┐
│                        BIFROST FRAMEWORK ECOSYSTEM                      │
└───────────────────────────────────────────────────────────────────────┘

                                   PRODUCT TEAM
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
            ┌─────────────┐    ┌─────────────┐   ┌──────────────┐
            │   Claude    │    │ Antigravity │   │   GSD CLI    │
            │    Code     │    │  (Gemini)   │   │  (optional)  │
            └──────┬──────┘    └──────┬──────┘   └──────┬───────┘
                   │                  │                 │
                   └──────────────────┼─────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │                                   │
                    │   BIFROST FRAMEWORK (Monorepo)   │
                    │                                   │
                    │  Token-bifrost-framework.git      │
                    │                                   │
                    ├─────────────────────────────────┤
                    │ Commands: /bifrost:*            │
                    ├─────────────────────────────────┤
                    │ Agents:                         │
                    │  • @Intake (analyze scope)      │
                    │  • @Planner (break into tasks)  │
                    │  • @CodeGen (write code)        │
                    │  • @QA (test & validate)        │
                    │  • @Conductor (manage state)    │
                    │  • @Monitor (detect drift)      │
                    │  • @Reviewer (handoff prep)     │
                    ├─────────────────────────────────┤
                    │ Skills:                         │
                    │  • code-standards               │
                    │  • api-integration              │
                    │  • component-gen                │
                    │  • code-review                  │
                    │  • qa-validator                 │
                    │  • graphify-ref                 │
                    │  • state-management             │
                    ├─────────────────────────────────┤
                    │ Workflows:                      │
                    │  • Admit → Plan → Build →       │
                    │    QA → Deliver                 │
                    └────────┬────────────┬───────────┘
                             │            │
          ┌──────────────────┘            └──────────────────┐
          │                                                   │
          ▼                                                   ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│   PROJECT (.bifrost/)        │            │  KNOWLEDGE LAYER             │
│                              │            │                              │
│  Per-Feature Artifacts:      │            │  knowledge/ (Internal Knowledge)│
│  • PATIENT.md (scope)        │            │                              │
│  • HEALTH.md (quality gates) │            │  • API_CONTRACTS.md          │
│  • AUTONOMY.md (autonomy)    │            │  • COMPONENT_LIBRARY.md      │
│  • IMPACT.md (changes)       │            │  • NAMING_CONVENTIONS.md     │
│  • PLAN.md (tasks)           │            │  • TECH_STACK.md             │
│  • STATE.md (history)        │            │  • GOTCHAS.md                │
│  • CODE_REVIEW.md (checks)   │            │  • graph.json (Graphify)     │
│  • QA_REPORT.md (tests)      │            │  • GRAPH_REPORT.md           │
│  • HANDOFF.md (for Backend)  │            │                              │
│                              │            │  Updated by: Backend Dev     │
│  Agents/ (hydrated)          │            │  Queried by: Claude Code     │
│  Skills/ (project-local)     │            └──────────────────────────────┘
│                              │
└──────────────────────────────┘
          │
          │ (delivers code + artifacts)
          │
          ▼
┌──────────────────────────────┐
│      BACKEND TEAM            │
│  (Code Review + Merge)       │
│                              │
│  Reviews:                    │
│  • Does it follow standards? │
│  • Are API calls correct?    │
│  • Are edge cases handled?   │
│  • Then merges to main       │
└──────────────────────────────┘
          │
          ▼
    ┌──────────────┐
    │  Production  │
    └──────────────┘
```

---

## DATA FLOW: A Feature from Start to Merge

```
PRODUCT STARTS FEATURE
  │
  ├─ Run: bifrost-init --project "notifications"
  │  └─ Creates: .bifrost/ + hydrated agents + skills
  │
  ├─ Edit: .bifrost/PATIENT.md (feature scope)
  │
  ├─ Command: /bifrost:start (@Intake)
  │  ├─ Reads: PATIENT.md
  │  ├─ Queries: knowledge/ (what APIs exist?)
  │  ├─ Produces: IMPACT.md (what changes?)
  │  └─ Waits: for Product approval
  │
  ├─ Product Reviews IMPACT.md
  │
  ├─ Command: /bifrost:plan (@Planner)
  │  ├─ Reads: PATIENT.md + IMPACT.md
  │  ├─ References: architecture-graph (which functions to call?)
  │  ├─ Breaks into: 5-10 concrete tasks
  │  ├─ Produces: PLAN.md
  │  └─ Waits: for Product approval
  │
  ├─ Product Reviews PLAN.md
  │
  ├─ Command: /bifrost:build (@CodeGen via Claude Code)
  │  ├─ Loads: bifrost-code-standards skill
  │  ├─ Loads: bifrost-api-integration skill
  │  ├─ Loads: bifrost-qa-validator skill
  │  ├─ Reads: PLAN.md
  │  ├─ Generates: source code (following every rule in skills)
  │  ├─ Self-reviews: against CODE_REVIEW.md checklist
  │  ├─ Produces: CODE_REVIEW.md (did we follow standards?)
  │  └─ Auto-runs: tests → QA_REPORT.md
  │
  ├─ @QA (@Inspector) Validates Results
  │  ├─ Runs: happy path + sad path + edge cases
  │  ├─ Checks: API integration (vs API_CONTRACTS.md)
  │  ├─ Produces: QA_REPORT.md
  │  ├─ If Fail: hard stops, Product fixes
  │  └─ If Pass: continues
  │
  ├─ @Conductor Updates STATE.md
  │  ├─ Marks: all tasks complete
  │  ├─ Lists: all files changed
  │  ├─ Tracks: every step taken
  │
  ├─ Command: /bifrost:deliver (@Conductor)
  │  ├─ Produces: HANDOFF.md
  │  │  ├─ What changed?
  │  │  ├─ Which APIs were called? (validated against graph)
  │  │  ├─ What tests were written?
  │  │  └─ What edge cases?
  │  └─ Creates: Pull request to Backend
  │
  ├─ Git Hooks Validate Before Commit
  │  ├─ STATE.md is valid
  │  ├─ All files referenced exist
  │  └─ API calls match API_CONTRACTS.md
  │
  ├─ PR Pushed to Backend
  │  │
  │  ├─ GitHub Actions Run
  │  │  ├─ bifrost-validate state
  │  │  ├─ bifrost-validate api-calls
  │  │  ├─ bifrost-validate code-standards
  │  │  └─ bifrost-validate qa-report
  │  │  (if any fail → comment on PR)
  │  │
  │  ├─ BACKEND DEV REVIEWS
  │  │  ├─ Reads: HANDOFF.md (context)
  │  │  ├─ Scans: code (should already follow standards)
  │  │  ├─ Validates: API calls (checked against graph)
  │  │  ├─ Reviews: tests (should be comprehensive)
  │  │  └─ If Good → Merge
  │  │
  │  ├─ CTO Oversight (Optional)
  │  │  ├─ Run: /bifrost:rounds
  │  │  ├─ See: all active features, escalations
  │  │  └─ Spot-checks: high-risk features
  │  │
  │  └─ Merge to Main
  │
  └─ Feature Complete
```

---

## AGENT RESPONSIBILITY MATRIX

```
┌─────────┬──────────────┬──────────────┬────────────────────────┐
│ Agent   │ Input        │ Primary Job  │ Output                 │
├─────────┼──────────────┼──────────────┼────────────────────────┤
│ @Intake │ PATIENT.md   │ Understand   │ IMPACT.md              │
│         │ + Arch Graph │ scope impact │ + Approval gate        │
├─────────┼──────────────┼──────────────┼────────────────────────┤
│ @Planner│ IMPACT.md    │ Break into   │ PLAN.md                │
│         │ + Arch Graph │ tasks        │ (5-10 tasks)           │
├─────────┼──────────────┼──────────────┼────────────────────────┤
│ @CodeGen│ PLAN.md      │ Write code   │ Source files           │
│         │ + All Skills │ following    │ + CODE_REVIEW.md       │
│         │              │ every rule   │                        │
├─────────┼──────────────┼──────────────┼────────────────────────┤
│ @QA     │ Source code  │ Test & find  │ QA_REPORT.md           │
│         │ + QA Skill   │ issues       │ + Pass/Fail gate       │
├─────────┼──────────────┼──────────────┼────────────────────────┤
│ @Monitor│ .bifrost/    │ Detect drift │ VITALS.md              │
│         │ + filesystem │ from spec    │ (what changed?)        │
├─────────┼──────────────┼──────────────┼────────────────────────┤
│ @Conductor
│         │ STATE.md     │ Track state  │ Updated STATE.md       │
│         │ + every step │ & decide     │ + Autonomy decisions   │
│         │              │ next         │                        │
├─────────┼──────────────┼──────────────┼────────────────────────┤
│ @Reviewer
│         │ All artifacts│ Prepare for  │ HANDOFF.md             │
│         │ + source     │ Backend      │ + PR metadata          │
└─────────┴──────────────┴──────────────┴────────────────────────┘
```

---

## SKILL MAPPING

```
┌──────────────────────────────────────────────────────────────────┐
│  SKILLS: "What Rules Do I Follow?"                               │
└──────────────────────────────────────────────────────────────────┘

1. bifrost-system-context/SKILL.md
   When: Every session starts
   What: Master system prompt
   Why: Claude Code knows it's in Bifrost, not generic coding
   Used by: @Intake, @Planner, @CodeGen, @QA

2. bifrost-code-standards/SKILL.md
   When: Before writing any code
   What: Naming conventions, file structure, patterns
   Why: Backend dev doesn't have to teach @CodeGen
   Used by: @CodeGen (self-review)

3. bifrost-api-integration/SKILL.md
   When: Generating code that calls APIs
   What: How to use HTTP client, error handling, auth
   Why: Ensures API calls match Backend's patterns
   Used by: @CodeGen, @QA (validation)

4. bifrost-component-gen/SKILL.md
   When: Creating UI components
   What: Component structure, props, testing
   Why: Ensures components match product design
   Used by: @CodeGen

5. bifrost-code-review/SKILL.md
   When: @CodeGen self-reviews
   What: Checklist of things to verify
   Why: Catches issues before Backend sees them
   Used by: @CodeGen (self-review)

6. bifrost-qa-validator/SKILL.md
   When: @QA runs tests
   What: What scenarios to test, how to structure tests
   Why: Ensures QA is comprehensive
   Used by: @QA, GitHub Actions CI

7. bifrost-graphify-ref/SKILL.md
   When: Need architectural knowledge
   What: How to query architecture-graph
   Why: Claude Code can look up API contracts on its own
   Used by: @CodeGen, @Intake

8. bifrost-state-management/SKILL.md
   When: Updating STATE.md
   What: Format, what to track, how to timestamp
   Why: Ensures STATE is always parseable and useful
   Used by: @Conductor
```

---

## TECHNICAL IMPLEMENTATION ROADMAP

### Phase 1: Core Framework (Week 1-2)

**Deliverable: Working `bifrost-init` + agent templates**

```
Week 1:
├─ Create repository structure
├─ Write agent templates (Intake, Planner, CodeGen, QA, Conductor)
├─ Write SKILL files (code-standards, api-integration, qa-validator)
└─ Create Markdown templates (PATIENT.md, PLAN.md, STATE.md, etc)

Week 2:
├─ Write bifrost-init.js (the setup script)
├─ Implement hydration system
├─ Test end-to-end: clone → init → work
├─ Write QUICKSTART.md
└─ Test on first example feature
```

**Testing:** Can Product run `bifrost-init --project "test"` and see .bifrost/ created?

### Phase 2: Skill Integration (Week 2-3)

**Deliverable: Skills auto-load into Claude Code + Antigravity**

```
├─ Write claude-code/skills-installer.js
├─ Write antigravity/skills-installer.js
├─ Test skill injection into ~/.claude/
├─ Test skill injection into Antigravity
├─ Verify /bifrost:help shows all commands
└─ Create skill troubleshooting guide
```

**Testing:** Does Claude Code recognize /bifrost:* commands immediately after init?

### Phase 3: Knowledge Graph Integration (Week 3)

**Deliverable: bifrost-init can find + reference architecture-graph**

```
├─ Write bifrost-graphify-ref skill
├─ Configure bifrost-init to reference knowledge/ directory
├─ Test: @Intake can query existing APIs from graph.json
├─ Create sample architecture-graph (seeded with Graphify)
└─ Write docs: "How to update architecture-graph"
```

**Testing:** When @CodeGen needs an API endpoint, can it find it in the graph?

### Phase 4: Workflow Commands (Week 3-4)

__Deliverable: All /bifrost:_ commands work_*

```
├─ Write bifrost-start.js (/bifrost:start)
├─ Write bifrost-plan.js (/bifrost:plan)
├─ Write bifrost-build.js (/bifrost:build)
├─ Write bifrost-qa.js (/bifrost:qa)
├─ Write bifrost-deliver.js (/bifrost:deliver)
├─ Write bifrost-status.js (/bifrost:status)
├─ Write bifrost-rounds.js (/bifrost:rounds - CTO view)
└─ Test each command in Claude Code + Antigravity
```

**Testing:** Do commands route to correct agents with correct context?

### Phase 5: State Management + Git Hooks (Week 4)

**Deliverable: STATE.md is always valid, git hooks enforce it**

```
├─ Write state-manager.js (update STATE.md after each step)
├─ Write pre-commit.sh (validate before commit)
├─ Write post-merge.sh (update on branch changes)
├─ Write validation schemas (JSON schemas for PATIENT, PLAN, HEALTH)
├─ Test: Can't commit with invalid STATE.md
└─ Document: "What STATE.md must contain"
```

**Testing:** Do git hooks catch invalid state files?

### Phase 6: CI/CD Integration (Week 4-5)

**Deliverable: GitHub Actions validate every PR**

```
├─ Write .github/workflows/bifrost-build.yml
├─ Write .github/workflows/bifrost-qa.yml
├─ Write .github/workflows/bifrost-merge.yml
├─ Create bifrost-validate CLI commands
│  ├─ bifrost-validate state
│  ├─ bifrost-validate plan
│  ├─ bifrost-validate api-calls
│  ├─ bifrost-validate code-standards
│  └─ bifrost-validate merge-ready
├─ Test: Failing code doesn't merge
└─ Test: Valid code merges smoothly
```

**Testing:** Do GH Actions catch issues before merge?

### Phase 7: Documentation + Examples (Week 5)

**Deliverable: Full docs + 3 working examples**

```
├─ Write docs/:
│  ├─ QUICKSTART.md (5-min setup)
│  ├─ ARCHITECTURE.md (how it works)
│  ├─ AGENT_REFERENCE.md (each agent explained)
│  ├─ SKILL_REFERENCE.md (each skill explained)
│  ├─ WORKFLOW_REFERENCE.md (each command)
│  ├─ AUTONOMY_LEVELS.md (when to use each)
│  └─ TROUBLESHOOTING.md (common issues)
│
├─ Write examples/:
│  ├─ feature-crud-api/ (create REST endpoint)
│  ├─ feature-ui-component/ (create React component)
│  └─ feature-integration/ (integrate third-party API)
│
└─ Test: Can a new dev follow QUICKSTART and build a feature?
```

**Testing:** Does a complete stranger succeed with just the docs?

### Phase 8: Metrics + Monitoring (Week 5-6)

**Deliverable: bifrost-metrics CLI + telemetry**

```
├─ Write metrics.js
├─ Track after each feature:
│  ├─ Velocity (time start → deliver)
│  ├─ QA accuracy (findings in QA vs production)
│  ├─ Backend review time
│  ├─ Backend review changes %
│  └─ Agent accuracy (deviation from PLAN)
│
├─ Create metrics dashboard (spreadsheet CSV → visualization)
└─ Write: "How to interpret metrics"
```

**Testing:** Can CTO run `bifrost-metrics --since "7 days"` and see trends?

### Phase 9: Pilot + Iteration (Week 6-7)

**Deliverable: Product team uses on real feature**

```
├─ Select 1 real feature to build with Bifrost
├─ Product dev follows full workflow: start → build → deliver
├─ Measure everything
├─ Collect feedback
├─ Iterate agents/skills based on real problems
├─ Document what didn't work
└─ Update playbooks
```

**Testing:** Does real-world usage reveal issues? Can we fix them in < 1 day?

### Phase 10: Full Rollout (Week 8+)

**Deliverable: All Product features use Bifrost**

```
├─ Declare framework stable
├─ Train entire Product team (1-hour workshop)
├─ Migrate existing in-progress features to framework
├─ Monitor metrics weekly
├─ CTO reviews with /bifrost:rounds monthly
└─ Continuous improvement loop
```

---

## BUILD CHECKLIST

### Pre-Build

- [ ] CTO approves this spec
- [ ] Backend identifies priority for architecture-graph seeding
- [ ] Product team confirms willing to pilot

### Core Build (Weeks 1-5)

- [ ] bifrost-init.js complete + tested
- [ ] All agent templates written + hydrated
- [ ] All skills written + validated
- [ ] Claude Code skill injection works
- [ ] Antigravity skill injection works
- [ ] State management system works
- [ ] Git hooks validate

### Integration (Week 6)

- [ ] /bifrost:* commands all work
- [ ] GitHub Actions CI/CD configured
- [ ] bifrost-metrics CLI working
- [ ] bifrost-validate CLI working
- [ ] bifrost-rounds (CTO view) working

### Documentation + Examples (Week 7)

- [ ] All docs written
- [ ] 3 examples complete + tested
- [ ] Troubleshooting guide covers common issues
- [ ] Onboarding script for new Product devs

### Pilot + Launch (Weeks 8+)

- [ ] 1 real feature built with framework
- [ ] Metrics collected + analyzed
- [ ] Feedback incorporated
- [ ] Full Product team trained
- [ ] Monitor weekly, iterate monthly

---

## SUCCESS DEFINITION

**Framework is successful when:**

1. Product dev can start new feature in < 5 minutes
2. Feature code reaches Backend in < 4 hours (start → deliver)
3. Backend dev review changes < 10% of code
4. QA finding rate stabilizes (no surprises in production)
5. CTO can see all active work with `/bifrost:rounds`
6. Product team velocity increases 2-3x
7. Backend dev can focus on actual Backend work (not rewriting frontend)

---

## RISKS & MITIGATION

|Risk|Impact|Mitigation|
|---|---|---|
|Agent templates are wrong|Features built on bad foundations|Iterate heavily during pilot|
|Skills are incomplete|Claude Code breaks on edge cases|Collect real issues, add rules|
|Architecture graph is stale|Generated code doesn't match Backend|Automate graph updates, CTO reviews|
|Product team resists|Framework never adopted|Show wins on pilot, make it fast|
|Context rot still happens|Features degrade mid-build|Skills are persistent, not session-based|
|CI/CD too strict|Blocks valid work|Tune validation, don't block learning|
|State tracking breaks|Lost context mid-feature|Validate STATE.md at every step|

---

## FILES TO CREATE (SUMMARY)

```
Token-bifrost-framework/

Node.js CLI:
├─ bifrost-cli.js (entry point)
├─ package.json (npm deps)
├─ scripts/bifrost-init (main setup command)
├─ scripts/bifrost-validate (validation CLI)
├─ scripts/bifrost-metrics (metrics CLI)
└─ scripts/bifrost-rounds (CTO overview)

Agents:
├─ core/agents/templates/Intake_Template.md
├─ core/agents/templates/Planner_Template.md
├─ core/agents/templates/CodeGen_Template.md
├─ core/agents/templates/QA_Template.md
├─ core/agents/templates/Conductor_Template.md
├─ core/agents/templates/Monitor_Template.md
├─ core/agents/templates/Reviewer_Template.md
└─ core/agents/hydration/hydrate.js

Skills:
├─ core/skills/bifrost-system-context/SKILL.md
├─ core/skills/bifrost-code-standards/SKILL.md
├─ core/skills/bifrost-api-integration/SKILL.md
├─ core/skills/bifrost-component-gen/SKILL.md
├─ core/skills/bifrost-code-review/SKILL.md
├─ core/skills/bifrost-qa-validator/SKILL.md
├─ core/skills/bifrost-graphify-ref/SKILL.md
└─ core/skills/bifrost-state-management/SKILL.md

Installers:
├─ runtime/claude-code/skills-installer.js
├─ runtime/antigravity/skills-installer.js
├─ runtime/hooks/pre-commit.sh
├─ runtime/hooks/post-merge.sh
└─ runtime/state-manager.js

Workflows:
├─ core/workflows/admit.yaml
├─ core/workflows/build.yaml
├─ core/workflows/qa.yaml
├─ core/workflows/deliver.yaml
└─ core/workflows/autonomy-levels.yaml

Templates:
├─ templates/PROJECT_CONTEXT.md
├─ templates/PATIENT.md
├─ templates/HEALTH.md
├─ templates/AUTONOMY.md
├─ templates/IMPACT.md
├─ templates/PLAN.md
├─ templates/STATE.md
├─ templates/CODE_REVIEW.md
├─ templates/QA_REPORT.md
└─ templates/HANDOFF.md

Knowledge:
├─ knowledge/architecture-graph-schema.md
├─ knowledge/sample-api-contracts.md
├─ knowledge/sample-naming-conventions.md
├─ knowledge/sample-tech-stack.md
└─ knowledge/sample-gotchas.md

Examples:
├─ examples/feature-crud-api/.bifrost/
├─ examples/feature-ui-component/.bifrost/
├─ examples/feature-integration/.bifrost/
└─ examples/EXAMPLES.md

CI/CD:
├─ .github/workflows/bifrost-build.yml
├─ .github/workflows/bifrost-qa.yml
├─ .github/workflows/bifrost-merge.yml
└─ ci-cd/hooks-config.yaml

Docs:
├─ docs/QUICKSTART.md
├─ docs/ARCHITECTURE.md
├─ docs/AGENT_REFERENCE.md
├─ docs/SKILL_REFERENCE.md
├─ docs/WORKFLOW_REFERENCE.md
├─ docs/AUTONOMY_LEVELS.md
├─ docs/TROUBLESHOOTING.md
└─ docs/EXTENDING.md

Config:
├─ config/defaults.json
├─ config/.bifrostignore
└─ config/validation-schemas/

Telemetry:
├─ telemetry/metrics.js
└─ telemetry/README.md

Root:
├─ README.md
├─ LICENSE
└─ CONTRIBUTING.md
```

**Total files: ~60-70 markdown + JS files** **Build time estimate: 6-8 weeks with 1-2 engineers**

---

## DECISION TREE: Should We Build This?

```
1. Can we get a working framework in 6-8 weeks? YES
2. Will Product team actually use it? DEPENDS (pilot tests)
3. Will Backend dev actually save time? YES (code review < rewrite)
4. Is it reversible if it fails? MOSTLY (skills can be ignored, git hooks disabled)
5. Does it solve the original problem (absorb frontend, standardize)?
   YES — Agent skills = protocols, architecture graph = reference, FORGE = workflow

VERDICT: Build it.

LOW RISK BECAUSE:
• Framework is optional (Product can ignore if needed)
• Skills are discovered, not mandatory
• Git hooks can be disabled
• Agents are templates, not enforced
• State files are just markdown (human-readable)

HIGH REWARD IF IT WORKS:
• Product code generation 2-3x faster
• Backend review time 50% less
• Quality issues caught earlier
• CTO oversight automated
• Knowledge centralized and searchable
```

---

## SIGN-OFF CHECKLIST

**CTO Review:**

- [ ] Architecture matches vision?
- [ ] Agent list complete?
- [ ] Skill priorities clear?
- [ ] Knowledge graph feasible?
- [ ] Timeline realistic?
- [ ] Go/no-go decision?

**Product Lead Review:**

- [ ] Would you use this?
- [ ] Would it make features faster?
- [ ] Would it reduce Backend dependency?
- [ ] Any gaps in the workflow?

**Backend Lead Review:**

- [ ] Can you seed architecture-graph?
- [ ] Would review time actually decrease?
- [ ] API contract documentation feasible?
- [ ] Concerns about code quality from agents?

**Labs (This Team):**

- [ ] Ready to start building?
- [ ] Resource allocation clear?
- [ ] Dependencies on other teams?
- [ ] First milestone (bifrost-init) achievable in Week 2?

---
