---
domain: professional
type: note
tags:
  - domain/professional
  - status/active
  - type/operation
  - topic/bifrost
---
# BIFROST Framework Specification

## A Self-Contained System Repository for Token

---

## OBJECTIVE

Create a single, cloneable repository (`Token-bifrost-framework`) that Product team can:

1. Clone once
2. Run `bifrost-init --project "Feature Name"`
3. Immediately start coding with:
    - All agent skills loaded
    - Architecture knowledge graph accessible
    - Workflow commands ready
    - Templates in place
    - Full autonomy-aware execution framework

**Result:** Zero setup friction. Product starts new features in < 5 minutes.

---

## REPOSITORY STRUCTURE

```
Token-bifrost-framework/
│
├── package.json                          # CLI + dependency management
├── bifrost-cli.js                        # Main entry point
├── README.md                             # Setup + quick-start
│
├── core/
│   ├── commands/                         # Slash command definitions
│   │   ├── bifrost-start.js             # Initialize feature
│   │   ├── bifrost-plan.js              # Generate task plan
│   │   ├── bifrost-build.js             # Execute code generation
│   │   ├── bifrost-qa.js                # Run validation
│   │   ├── bifrost-deliver.js           # Handoff to Backend
│   │   ├── bifrost-status.js            # Show all features (rounds)
│   │   ├── bifrost-rounds.js            # CTO view of all work
│   │   └── bifrost-help.js              # Help system
│   │
│   ├── agents/                           # FORGE-style named agents
│   │   ├── templates/
│   │   │   ├── Intake_Template.md       # @Intake - feature analysis
│   │   │   ├── Planner_Template.md      # @Planner - task breakdown
│   │   │   ├── CodeGen_Template.md      # @CodeGen - code generation
│   │   │   ├── QA_Template.md           # @QA - testing & validation
│   │   │   ├── Conductor_Template.md    # @Conductor - state management
│   │   │   ├── Monitor_Template.md      # @Monitor - drift detection
│   │   │   └── Reviewer_Template.md     # @Reviewer - Backend handoff
│   │   │
│   │   └── hydration/                    # How to customize agents per project
│   │       ├── hydrate.js               # Inject project context into templates
│   │       └── injection-points.json    # Where variables go
│   │
│   ├── skills/                           # GSD-style repeatable protocols
│   │   ├── bifrost-system-context/
│   │   │   └── SKILL.md                # Master system prompt
│   │   ├── bifrost-code-standards/
│   │   │   └── SKILL.md                # Naming, structure, patterns
│   │   ├── bifrost-api-integration/
│   │   │   └── SKILL.md                # How to call APIs safely
│   │   ├── bifrost-component-gen/
│   │   │   └── SKILL.md                # Component generation rules
│   │   ├── bifrost-code-review/
│   │   │   └── SKILL.md                # Self-review checklist
│   │   ├── bifrost-qa-validator/
│   │   │   └── SKILL.md                # Testing + validation rules
│   │   ├── bifrost-graphify-ref/
│   │   │   └── SKILL.md                # How to query architecture graph
│   │   └── bifrost-state-management/
│   │       └── SKILL.md                # Markdown state file format
│   │
│   └── workflows/                        # FORGE-style workflow definitions
│       ├── admit.yaml                   # New feature workflow
│       ├── build.yaml                   # Code generation workflow
│       ├── qa.yaml                      # Testing workflow
│       ├── deliver.yaml                 # Handoff workflow
│       └── autonomy-levels.yaml         # Task-Gated, Phase-Gated, Full
├── knowledge/
│   ├── FRONTEND_REPOSITORY_MANUAL.md    # Master manual audit
│   ├── API_CONTRACTS.md                 # Backend endpoint reference
│   ├── COMPONENT_LIBRARY.md             # Standard UI components
│   ├── NAMING_CONVENTIONS.md            # Naming rules
│   ├── TECH_STACK.md                    # Core architecture stack
│   └── GOTCHAS.md                       # Known issues and quirks
│
├── templates/
│   ├── PROJECT_CONTEXT.md               # Per-project system prompt template
│   ├── PATIENT.md                       # Feature scope template
│   ├── HEALTH.md                        # Quality gates template
│   ├── AUTONOMY.md                      # Autonomy level template
│   ├── IMPACT.md                        # Change impact template
│   ├── PLAN.md                          # Task breakdown template
│   ├── STATE.md                         # State file template
│   ├── CODE_REVIEW.md                   # Self-review template
│   ├── QA_REPORT.md                     # QA results template
│   └── HANDOFF.md                       # Backend handoff template
│
├── runtime/
│   ├── claude-code/
│   │   └── skills-installer.js          # Inject skills into ~/.claude/
│   ├── antigravity/
│   │   └── skills-installer.js          # Inject skills into Antigravity
│   ├── hooks/
│   │   ├── pre-commit.sh                # Validate state before commit
│   │   ├── post-merge.sh                # Update architecture graph
│   │   └── init-hook-installer.js       # Set up git hooks
│   │
│   └── state-manager.js                 # Update STATE.md, track changes
│
├── scripts/
│   ├── bifrost-init                     # Main initialization command
│   ├── bifrost-validate                 # Validate project structure

│   ├── bifrost-update-skills            # Update agents from latest framework
│   ├── bifrost-ci                       # CI mode (for GitHub Actions)
│   └── bifrost-migrate                  # Migrate old projects to new framework
│
├── examples/
│   ├── feature-crud-api/                # Example: Build a REST endpoint
│   ├── feature-ui-component/            # Example: Build a UI component
│   ├── feature-integration/             # Example: Integrate third-party API
│   └── EXAMPLES.md                      # How to use examples
│
├── ci-cd/
│   ├── github-actions/
│   │   ├── bifrost-build.yml            # Auto-run on feature branches
│   │   ├── bifrost-qa.yml               # Auto-run QA tests
│   │   └── bifrost-merge.yml            # Pre-merge validation
│   │
│   └── hooks-config.yaml                # Default CI/CD settings
│
├── docs/
│   ├── QUICKSTART.md                    # 5-minute setup guide
│   ├── ARCHITECTURE.md                  # How the system works
│   ├── AGENT_REFERENCE.md               # What each agent does
│   ├── SKILL_REFERENCE.md               # What each skill is for
│   ├── WORKFLOW_REFERENCE.md            # All commands explained
│   ├── AUTONOMY_LEVELS.md               # When to use each level
│   ├── TROUBLESHOOTING.md               # Common issues & fixes
│   └── EXTENDING.md                     # How to add new agents/skills
│
├── config/
│   ├── defaults.json                    # Default settings
│   ├── .bifrostignore                   # What to exclude from graph
│   └── validation-schemas/
│       ├── patient.schema.json          # Validate PATIENT.md structure
│       ├── plan.schema.json             # Validate PLAN.md structure
│       └── health.schema.json           # Validate HEALTH.md structure
│
├── telemetry/
│   ├── metrics.js                       # Track code quality trends
│   ├── .gitkeep                         # Placeholder (no actual tracking yet)
│   └── README.md                        # How metrics work
│
└── .github/
    ├── workflows/
    │   ├── test-framework.yml           # Test framework itself
    │   └── publish.yml                  # Publish new framework versions
    └── CONTRIBUTING.md                  # How to contribute to framework

```

---

## COMMAND INTERFACE

### For Product Team (Developers)

```bash
# One-time setup
git clone git@github.com:Token/bifrost-framework.git
cd bifrost-framework
npm install

# Start a new feature
bifrost-init --project "Add user notifications" --type "feature"
# Creates: .bifrost/ with all templates, agents, skills ready

# Inside Claude Code or Antigravity
/bifrost:start                           # Initialize feature (@Intake)
/bifrost:plan                            # Generate plan (@Planner)
/bifrost:build                           # Generate code (@CodeGen)
/bifrost:qa                              # Run validation (@QA)
/bifrost:deliver                         # Handoff to Backend (@Conductor)

# Status & help
/bifrost:status                          # Show current feature state
/bifrost:help                            # Show all commands
```

### For CTO (Oversight)

```bash
# View all active work
/bifrost:rounds                          # Show all features, their state, escalations

# Audit & metrics
bifrost-audit --since "7 days ago"      # Code quality trends
bifrost-metrics --project all            # All-projects overview

# Update framework
bifrost review                           # Execute @CodeGen & @QA loops
bifrost-update-skills                    # Update all agents to latest
```

---

## INITIALIZATION FLOW

### `bifrost-init --project "Feature Name"`

**What happens (5 minutes):**

```
1. Validate Node + npm + git
2. Check: .bifrost/ doesn't exist (prevent overwrites)
3. Create .bifrost/ directory structure:
   ├── PATIENT.md (feature scope template)
   ├── HEALTH.md (quality gates)
   ├── AUTONOMY.md (set to Task-Gated by default)
   ├── IMPACT.md (template only)
   ├── PLAN.md (template only)
   ├── STATE.md (initialized to "admitted")
   ├── agents/
   │   ├── Intake_HYDRATED.md (customized for this project)
   │   ├── Planner_HYDRATED.md
   │   ├── CodeGen_HYDRATED.md
   │   ├── QA_HYDRATED.md
   │   └── Conductor_HYDRATED.md
   ├── skills/
   │   ├── bifrost-system-context/SKILL.md
   │   ├── bifrost-code-standards/SKILL.md
   │   ├── bifrost-api-integration/SKILL.md
   │   ├── bifrost-qa-validator/SKILL.md
   │   └── [all others]
   └── PROJECT_CONTEXT.md (per-project system prompt)

4. Install to Claude Code:
   cp .bifrost/agents/*.md ~/.claude/skills/bifrost-*/
   cp .bifrost/skills/*/*.md ~/.claude/skills/bifrost-*/

5. Install to Antigravity (if detected):
   cp .bifrost/agents/*.md ~/.antigravity/skills/bifrost-*/
   cp .bifrost/skills/*/*.md ~/.antigravity/skills/bifrost-*/

6. Set up git hooks:
   cp hooks/* .git/hooks/
   chmod +x .git/hooks/*

7. Create .bifrostignore from config/

8. Initialize git branch:
   git checkout -b bifrost/feature-name
   git add .bifrost/
   git commit -m "bifrost: initialize feature"

9. Print next steps:
   "✓ Feature initialized.
    1. Edit .bifrost/PATIENT.md with scope
    2. In Claude Code, run /bifrost:start
    3. Review IMPACT.md when ready
    4. Run /bifrost:build
    See docs/QUICKSTART.md for full workflow."
```

---

## AGENT HYDRATION SYSTEM

### How Agents Get Project Context

**Problem:** Agent templates are generic. Each project is different.

**Solution:** Hydration injects project-specific values.

**Hydration Template (hydration/injection-points.json):**

```json
{
  "Intake_Template.md": {
    "PROJECT_NAME": "{{project-name}}",
    "TECH_STACK": "{{tech-stack-from-knowledge/}}",
    "API_BASE_URL": "{{api-base-url-from-config}}",
    "COMPONENT_LIBRARY": "{{components-from-graphify}}",
    "KNOWN_GOTCHAS": "{{gotchas-from-knowledge/}}"
  },
  "CodeGen_Template.md": {
    "NAMING_CONVENTIONS": "{{naming-from-knowledge/}}",
    "CODE_STANDARDS": "{{standards-from-skills/}}",
    "TESTING_RULES": "{{testing-from-skills/}}",
    "ARCHITECTURE_GRAPH": "{{graph-location}}"
  }
}
```

**Hydrate.js workflow:**

```javascript
// Read template
const template = fs.readFileSync('agents/CodeGen_Template.md', 'utf8');

// Find all {{injection-points}}
const injectionPoints = template.match(/{{[\w-/]+}}/g);

// Load values from knowledge/ and skills/
const values = {
  'naming-from-knowledge/': fs.readFileSync('knowledge/naming-conventions.md'),
  'standards-from-skills/': fs.readFileSync('core/skills/bifrost-code-standards/SKILL.md'),
  // ... etc
};

// Inject and write
let hydrated = template;
injectionPoints.forEach(point => {
  hydrated = hydrated.replace(point, values[point.slice(2, -2)]);
});

fs.writeFileSync('.bifrost/agents/CodeGen_HYDRATED.md', hydrated);
```

**Result:** @CodeGen gets the _specific_ standards, gotchas, and API info for _this_ project. No re-teaching.

---

## KNOWLEDGE BASE INTEGRATION

### Bifrost Knows Your Architecture

**Setup (one-time manual audit):**

```bash
# Maintainers run manual audits and document in:
knowledge/FRONTEND_REPOSITORY_MANUAL.md
# Sub-documents (API_CONTRACTS.md, etc.) are extracted from this master document.
```

**Product accesses it:**

```bash
# In feature repo
bifrost init automatically references: knowledge/

# Agent skill can query:
bifrost-api-integration/SKILL.md says:
"Check API_CONTRACTS.md for endpoint signatures"

# Claude Code skill:
/bifrost-knowledge-ref
"List all components used in notifications"
# Returns results directly from COMPONENT_LIBRARY.md
```

**Example: Product says "integrate with Stripe"**

1. @CodeGen asks skill: "What Stripe integrations already exist?"
2. Skill reads `knowledge/API_CONTRACTS.md` → finds existing Stripe code
3. Shows Product the pattern
4. Reuses it, doesn't invent new approach

---

## STATE MANAGEMENT (FORGE Pattern)

### STATE.md is the Single Source of Truth

**Conductor always updates it. If it's not in STATE, it didn't happen.**

```markdown
# STATE.md

## Feature: Add User Notifications
Admitted: 2026-04-27 09:00 UTC
Status: in_progress
Autonomy: Task-Gated

## Phase 1: API Integration
- [x] Task 1: Create notification endpoint (CodeGen) - COMPLETED 09:15
- [x] Task 2: Add database schema (Backend approved) - COMPLETED 10:00
- [ ] Task 3: Write tests - IN_PROGRESS 10:30
- [ ] Task 4: Security audit - NOT_STARTED

## Changes Made
- files/: [api/notifications.js, db/schema.sql]
- tests/: [tests/notifications.test.js]
- docs/: [docs/notifications.md]

## Open Issues
- Edge case: User deletes notification preference mid-request → @QA flagged, needs handling

## Next Actions
1. Complete Task 3 (tests)
2. QA runs full suite
3. Deliver to Backend for review

## Commits
- 1234abc: feat: add notification endpoint
- 5678def: test: add notification tests (pending)
```

**@Conductor updates after every step. Git hooks validate before commit.**

---

## SKILL INJECTION INTO CLAUDE CODE / ANTIGRAVITY

### The Skills Always Load

**bifrost-init installs skills to:**

```
~/.claude/skills/bifrost-*/SKILL.md           # Claude Code global
~/.antigravity/skills/bifrost-*/SKILL.md      # Antigravity global
.claude/skills/bifrost-*/SKILL.md             # Claude Code local (optional)
.antigravity/skills/bifrost-*/SKILL.md        # Antigravity local (optional)
```

**Commands reference them:**

```markdown
# bifrost-code-standards/SKILL.md

When generating code:
1. Follow naming conventions (see bifrost-naming-conventions skill)
2. Use API client pattern (see bifrost-api-integration skill)
3. Add tests matching bifrost-qa-validator patterns
4. Self-review against code checklist below
```

**Result:** Whenever Product or CTO runs a command, Claude Code immediately has all context. No manual loading.

---

## CI/CD INTEGRATION

### Automatic Validation on Every Commit

**.github/workflows/bifrost-build.yml:**

```yaml
name: Bifrost Build Validation
on: [push]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate STATE.md
        run: bifrost-validate state .bifrost/STATE.md
      
      - name: Validate PLAN.md
        run: bifrost-validate plan .bifrost/PLAN.md
      
      - name: Check API contracts (against graph)
        run: bifrost-validate api-calls --graph knowledge/
      
      - name: Lint generated code
        run: bifrost-validate code-standards .bifrost/
      
      - name: Run QA checklist
        run: bifrost-validate qa-report .bifrost/QA_REPORT.md
      
      - name: Pre-merge check
        if: github.event_name == 'pull_request'
        run: bifrost-validate merge-ready
```

**On failure:** PR gets comment with specific issues. No merge until fixed.

---

## SCALING: MULTI-FEATURE WORKFLOW

### Product Team Managing 5 Features Simultaneously

```bash
# Feature 1: Notifications (in QA)
cd ~/Token-projects/notifications
/bifrost:qa

# Feature 2: Analytics (in code generation)
cd ~/Token-projects/analytics
/bifrost:build

# Feature 3: User settings (in planning)
cd ~/Token-projects/user-settings
/bifrost:plan

# Feature 4: Search (newly admitted)
cd ~/Token-projects/search
bifrost-init --project "Add search"
/bifrost:start

# CTO oversight (all projects)
bifrost-rounds
# Shows state of all 5 features + any escalations
```

---

## ONBOARDING A NEW PRODUCT DEVELOPER

```bash
# Day 1
git clone git@github.com:Token/bifrost-framework.git
npm install
bifrost-init --project "My First Feature"
# Done. They're ready to work.

# CTO doesn't need to explain:
# - How to use Claude Code
# - What the API contract is
# - What code standards are
# - How to structure tests
# Everything is in skills. Everything is discovered.
```

---

## VERSION MANAGEMENT

### Framework Evolves, Projects Stay Stable

**bifrost-framework has versions:**

```json
{
  "version": "1.0.0",
  "agents": "v1.2.3",
  "skills": "v1.2.3",
  "breaking-changes": false
}
```

**Projects lock to a version:**

```
.bifrost/.bifrostrc
{
  "framework_version": "1.0.0",
  "auto_update": false
}
```

**CTO decides when to upgrade:**

```bash
# Check what's new
bifrost-changelog --since "1.0.0"

# Upgrade all active projects
bifrost-migrate all --to "1.1.0"

# Or upgrade one
bifrost-migrate --project search --to "1.1.0"
```

---

## MONITORING & METRICS

### Bifrost Sees Quality Trends

**After every feature delivery:**

```bash
bifrost-metrics
# Shows:
# - Code quality score (based on QA_REPORT + CODE_REVIEW)
# - Backend review time (how much did Backend dev change?)
# - Feature velocity (time from start → deliver)
# - Agent accuracy (did @CodeGen follow PLAN correctly?)
# - API call accuracy (% of calls matched API_CONTRACTS)
```

**Dashboard (optional, MVP = spreadsheet):**

```
| Feature | Velocity | QA Pass | Review % | Agent Accuracy |
|---------|----------|---------|----------|----------------|
| notify  | 3.5h     | 98%     | 5%       | 97%            |
| analytics | 5.2h   | 92%     | 12%      | 89%            |
| settings | 2.8h    | 100%    | 2%       | 99%            |
```

**If quality drops, CTO gets alert → investigates → updates skills/agents.**

---

## DEPLOYMENT CHECKLIST

### What Needs to Exist Before Day 1

- [ ] `Token-bifrost-framework` repository created (private)
- [ ] Knowledge base directory seeded with Graphify output
- [ ] All agent templates written (templates/agents/)
- [ ] All skill files written (core/skills/)
- [ ] `bifrost-init` script tested end-to-end
- [ ] Claude Code skill installer tested
- [ ] Antigravity skill installer tested
- [ ] Example features work (docs/examples/)
- [ ] Product team trained (1-hour workshop)
- [ ] CTO can run `/bifrost:rounds` and see all features

### Pilot Phase (Week 1-2)

- [ ] Product starts 1 feature using framework
- [ ] Measure: time to code, Backend review changes, QA findings
- [ ] Collect feedback
- [ ] Iterate agents/skills based on real usage
- [ ] Document playbooks for common patterns

### Full Rollout (Week 3+)

- [ ] Product starts all new features using framework
- [ ] Analytics dashboard online
- [ ] CTO weekly reviews (Bifrost:rounds)
- [ ] Monthly skill updates based on metrics

---

## SUCCESS CRITERIA

|Metric|Target|Measured How|
|---|---|---|
|Feature initialization time|< 5 minutes|`time bifrost-init`|
|Time from start → deliver|< 4 hours|STATE.md timestamps|
|Backend review changes|< 10%|diff against delivered code|
|QA finding rate|Stable/declining|QA_REPORT.md data|
|Agent accuracy|> 95%|Commits to PLAN % without deviation|
|Product velocity|3x before Bifrost|Features per week|
|CTO overhead|Minimal|`/bifrost:rounds` time|

---

## DELIVERABLES (What Gets Built)

1. **Token-bifrost-framework** repo
    
    - All core/ agents, skills, commands
    - All templates/
    - All docs/
    - bifrost-cli.js + npm scripts
    - CI/CD workflows
2. **bifrost-init** script
    
    - Clones self
    - Initializes .bifrost/
    - Installs skills
    - Sets up hooks
    - Prints next steps
3. **Example features** (working end-to-end)
    
    - feature-crud-api/
    - feature-ui-component/
    - feature-integration/
4. **Documentation**
    
    - QUICKSTART.md
    - ARCHITECTURE.md
    - AGENT_REFERENCE.md
    - SKILL_REFERENCE.md
    - TROUBLESHOOTING.md
5. **CI/CD Templates**
    
    - GitHub Actions workflows
    - Pre-commit hooks
    - Merge validation

---

## ROLLOUT TIMELINE

|Phase|Week|Owner|Output|
|---|---|---|---|
|**Design**|1|CTO + Labs|This spec (finalized)|
|**Agent Templates**|2|Labs|All agents written|
|**Skill Files**|2|Labs|All skills written|
|**Framework CLI**|3|Labs|bifrost-init works|
|**Testing**|3|Labs|Examples pass e2e|
|**Documentation**|4|Labs|All docs complete|
|**Product Training**|4|CTO|1-hour workshop|
|**Pilot Feature**|5|Product|1 real feature|
|**Feedback Loop**|5|Labs|Iterate agents|
|**Rollout**|6+|All|Steady state|

---