---
type: plan
status: active
topic: bifrost/build
---

# BIFROST Framework: Implementation Plan

Phase-by-phase roadmap for building the Bifrost framework itself. If you're building the framework (not using it), start here. **Source material:** Technical Roadmap & Visual Architecture.

---

## Overview

**Timeline:** 6-8 weeks  
**Phases:** 10 (Core → Integration → Documentation → Pilot → Rollout)  
**Team:** 1-2 engineers + CTO oversight  
**Dependencies:** Architecture graph seeded by Backend team  

---

## Phase 1: Core Framework Setup (Week 1-2)

**Goal:** Repository structure + agent templates + foundational skills

### Deliverables

- ✓ Repository structure created (`Token-bifrost-framework`)
- ✓ Agent templates written (all 7 agents as markdown files)
- ✓ Core skills written (5 essential skills)
- ✓ Markdown templates written (PATIENT.md, PLAN.md, STATE.md, etc.)
- ✓ `bifrost-init.js` script working (sets up projects in < 2 min)
- ✓ Hydration system working (injects context into agents)

### Work Breakdown

**Week 1:**
```
Day 1-2:
  - Create repo structure
  - Write Intake_Template.md
  - Write Planner_Template.md
  
Day 3:
  - Write CodeGen_Template.md
  - Write QA_Template.md
  
Day 4:
  - Write Conductor_Template.md
  - Write Monitor_Template.md
  - Write Reviewer_Template.md

Day 5:
  - Write bifrost-system-context/SKILL.md
  - Write bifrost-code-standards/SKILL.md
  - Write bifrost-api-integration/SKILL.md
  - Begin testing templates
```

**Week 2:**
```
Day 1:
  - Write bifrost-component-gen/SKILL.md
  - Write bifrost-code-review/SKILL.md
  - Write all markdown templates (PATIENT, PLAN, STATE, etc.)

Day 2-3:
  - Write bifrost-init.js (the CLI setup command)
  - Write hydration system (inject variables into templates)
  - Test: Can bifrost-init run on a blank folder?

Day 4:
  - Implement template discovery and injection
  - Test: Do hydrated agents have project context?

Day 5:
  - End-to-end test: Clone bifrost-framework → run bifrost-init → see .bifrost/ created
  - Write QUICKSTART.md for first feature
  - Test on example project
```

### Success Criteria

- [ ] `bifrost init --project "test"` creates .bifrost/ in < 2 minutes
- [ ] Hydrated agents contain actual project-specific context
- [ ] First example project initializes cleanly
- [ ] QUICKSTART.md is clear enough for non-technical user

### Testing

```bash
# Manual test
cd /tmp/test-project
bifrost init --project "test feature"
ls -la .bifrost/  # Should show all subdirs + files
cat .bifrost/agents/CodeGen_HYDRATED.md | grep "TARGET_PATH"  # Should show actual path
```

---

## Phase 2: Skill Integration (Week 2-3)

**Goal:** Skills auto-load into Claude Code + Antigravity

### Deliverables

- ✓ `claude-code/skills-installer.js` (installs skills to ~/.claude/)
- ✓ `antigravity/skills-installer.js` (installs skills to ~/.antigravity/)
- ✓ Skills auto-load after `bifrost init`
- ✓ `/bifrost:help` shows all available commands
- ✓ Skill troubleshooting guide

### Work Breakdown

**Week 2 (continued from Phase 1):**
```
Day 4-5:
  - Write claude-code/skills-installer.js
    - Detects ~/.claude/ directory
    - Copies skills/ to ~/.claude/skills/bifrost-*/
    - Verifies all 8 skills installed
    
  - Write antigravity/skills-installer.js
    - Similar logic for Antigravity
    - Fallback if Antigravity not detected
    
  - Integrate installer into bifrost-init
    - After hydration, run installers
```

**Week 3:**
```
Day 1:
  - Test skill injection on macOS + Linux + Windows (if applicable)
  - Verify Claude Code recognizes /bifrost:* commands
  - Verify Antigravity recognizes /bifrost:* commands
  
Day 2:
  - Write skill troubleshooting guide
  - Document: "What if skills don't load?"
  - Document: "How to manually reload skills?"
  
Day 3:
  - Implement /bifrost:help command
  - Write help system (describe all /bifrost:* commands)
  
Day 4-5:
  - Test on 2+ fresh machines
  - Verify skill loading is deterministic
  - Edge case: What if user upgrades framework?
```

### Success Criteria

- [ ] Skills install automatically during `bifrost init`
- [ ] Claude Code recognizes `/bifrost:*` commands immediately
- [ ] Antigravity recognizes `/bifrost:*` commands immediately
- [ ] `/bifrost:help` lists all available commands
- [ ] Skills load on macOS (test on 2+ machines)

### Testing

```bash
# After bifrost init
ls ~/.claude/skills/ | grep bifrost  # Should show 8 bifrost skills
# In Claude Code:
/bifrost:help  # Should print available commands
```

---

## Phase 3: Knowledge Graph Integration (Week 3)

**Goal:** Agents can query the architecture graph

### Deliverables

- ✓ `bifrost-graphify-ref` skill written (how to query graph)
- ✓ Bridge from bifrost-init → knowledge/ established
- ✓ @Intake can query existing APIs from graph.json
- ✓ Sample architecture graph seeded with Graphify output
- ✓ Documentation: "How to update architecture-graph"

### Work Breakdown

**Week 3:**
```
Day 1-2:
  - Write bifrost-graphify-ref/SKILL.md
    - How to read graph.json
    - How to find API contracts
    - How to discover existing patterns
    
  - Create bridge: bifrost-init → knowledge/
    - bifrost init creates symlink or clones latest architecture-graph
    - Agents can reference it
    - Graph is always up-to-date
    
Day 3-4:
  - Coordinate with Backend team
  - Seed architecture-graph with Graphify output
  - Example: 5-10 API endpoints documented
  - Example: 3-5 components documented
  - Example: naming conventions + gotchas filled in
  
Day 5:
  - Write docs: "How to update architecture-graph"
  - Document: What happens when graph changes?
  - Document: Version control for graph
```

### Success Criteria

- [ ] @Intake can query: "What APIs exist for notifications?"
- [ ] Graph returns: "POST /api/notifications, GET /api/notifications/{id}"
- [ ] @CodeGen can query: "What pattern do we use for API calls?"
- [ ] Graph returns example code
- [ ] Knowledge base has 5+ APIs documented

### Testing

```bash
# After bifrost init
# In Claude Code:
/bifrost:start  # @Intake runs
# @Intake should output: "Found 5 existing APIs in graph.json"
```

---

## Phase 4: Workflow Commands (Week 3-4)

**Goal:** All `/bifrost:*` commands work

### Deliverables

- ✓ `/bifrost:start` — Runs @Intake
- ✓ `/bifrost:plan` — Runs @Planner
- ✓ `/bifrost:build` — Runs @CodeGen
- ✓ `/bifrost:qa` — Runs @QA
- ✓ `/bifrost:deliver` — Runs @Conductor + creates PR
- ✓ `/bifrost:status` — Shows current feature state
- ✓ `/bifrost:rounds` — CTO view of all features
- ✓ All commands tested and documented

### Work Breakdown

**Week 3 (continued):**
```
Day 1-2:
  - Write bifrost-start.js (/bifrost:start)
    - Reads: .bifrost/PATIENT.md
    - Invokes: @Intake agent
    - Outputs: .bifrost/IMPACT.md
    
  - Write bifrost-plan.js (/bifrost:plan)
    - Reads: PATIENT.md + IMPACT.md
    - Invokes: @Planner agent
    - Outputs: .bifrost/PLAN.md
    
Day 3:
  - Write bifrost-build.js (/bifrost:build)
    - Reads: PLAN.md
    - Invokes: @CodeGen agent
    - Outputs: source code + CODE_REVIEW.md + runs tests
    
  - Write bifrost-qa.js (/bifrost:qa)
    - Invokes: @QA agent
    - Outputs: QA_REPORT.md
```

**Week 4:**
```
Day 1-2:
  - Write bifrost-deliver.js (/bifrost:deliver)
    - Invokes: @Conductor agent + @Reviewer agent
    - Outputs: HANDOFF.md + creates PR
    - Pushes to Backend repo
    
  - Write bifrost-status.js (/bifrost:status)
    - Reads: .bifrost/ directory
    - Prints: Current feature state (which phase?)
    - Prints: What's next?
    
Day 3:
  - Write bifrost-rounds.js (/bifrost:rounds)
    - Lists all active features (all .bifrost/ dirs)
    - Shows each feature's status + timeline
    - CTO dashboard view
    
Day 4-5:
  - Test all commands
  - Fix routing/invocation bugs
  - Test on example projects
```

### Success Criteria

- [ ] `/bifrost:start` invokes @Intake, produces IMPACT.md
- [ ] `/bifrost:plan` invokes @Planner, produces PLAN.md
- [ ] `/bifrost:build` invokes @CodeGen, produces code + CODE_REVIEW.md
- [ ] `/bifrost:qa` invokes @QA, produces QA_REPORT.md
- [ ] `/bifrost:deliver` invokes agents, creates PR
- [ ] `/bifrost:status` shows current state
- [ ] `/bifrost:rounds` shows all features
- [ ] All commands work without errors

---

## Phase 5: State Management + Git Hooks (Week 4)

**Goal:** STATE.md is always valid; git hooks enforce it

### Deliverables

- ✓ `state-manager.js` — Updates STATE.md after every step
- ✓ `pre-commit.sh` — Validates STATE.md before commit
- ✓ `post-merge.sh` — Updates on branch changes
- ✓ Validation schemas (JSON schemas for PATIENT, PLAN, HEALTH)
- ✓ Comprehensive STATE.md documentation

### Work Breakdown

**Week 4:**
```
Day 1:
  - Write state-manager.js
    - Reads current STATE.md
    - Appends new task completion
    - Updates timestamps
    - Writes back to .bifrost/STATE.md
    
  - Integrate state-manager into bifrost-start, bifrost-plan, bifrost-build, etc.
    - After each agent completes, call state-manager
    - STATE.md always reflects reality
    
Day 2-3:
  - Write pre-commit.sh
    - Validate STATE.md syntax
    - Validate all referenced files exist
    - Validate all commits mentioned in STATE exist in git
    - Block commit if validation fails
    
  - Write post-merge.sh
    - After merge, update architecture graph reference
    - Sync latest skills if available
    
Day 4:
  - Create validation schemas
    - patient.schema.json (what PATIENT.md must contain)
    - plan.schema.json (what PLAN.md must contain)
    - health.schema.json (what HEALTH.md must contain)
    
Day 5:
  - Test git hooks
  - Edge case: what if user manually edits STATE.md incorrectly?
  - Edge case: what if git hook fails? (provide recovery instructions)
```

### Success Criteria

- [ ] STATE.md updates automatically after each bifrost command
- [ ] Git hooks prevent commit if STATE.md is invalid
- [ ] Git hooks prevent commit if referenced files don't exist
- [ ] Can't commit API calls that don't match architecture graph
- [ ] STATE.md never gets out of sync with reality

### Testing

```bash
# Create invalid STATE.md
# Try to commit
git commit -m "test"
# Should fail with: "STATE.md validation failed: ..."

# Fix STATE.md
git commit -m "test"
# Should succeed
```

---

## Phase 6: CI/CD Integration (Week 4-5)

**Goal:** GitHub Actions validate every PR

### Deliverables

- ✓ `.github/workflows/bifrost-build.yml` — PR validation
- ✓ `.github/workflows/bifrost-qa.yml` — Automated testing
- ✓ `.github/workflows/bifrost-merge.yml` — Pre-merge checks
- ✓ `bifrost-validate` CLI commands (state, plan, api-calls, standards, qa)
- ✓ All checks tested on sample PRs

### Work Breakdown

**Week 4-5:**
```
Day 1-2:
  - Write .github/workflows/bifrost-build.yml
    - Trigger: on PR push
    - Validate STATE.md: bifrost-validate state
    - Validate PLAN.md: bifrost-validate plan
    - Validate API calls: bifrost-validate api-calls
    - Validate code standards: bifrost-validate code-standards
    - Validate QA: bifrost-validate qa-report
    - Comment on PR with results
    
Day 2-3:
  - Write bifrost-validate CLI
    - bifrost-validate state .bifrost/STATE.md
    - bifrost-validate plan .bifrost/PLAN.md
    - bifrost-validate api-calls --graph knowledge/
    - bifrost-validate code-standards .bifrost/
    - bifrost-validate qa-report .bifrost/QA_REPORT.md
    - bifrost-validate merge-ready
    
  - Each validation outputs:
    - ✓ or ✗
    - Specific issues (if any)
    - Remediation steps
    
Day 4:
  - Write .github/workflows/bifrost-merge.yml
    - Final pre-merge validation
    - Everything passing? Green light
    - Anything failing? Red light + comment
    
Day 5:
  - Test on sample PRs
  - Verify CI catches issues
  - Verify CI allows clean PRs
```

### Success Criteria

- [ ] GitHub Actions runs on every PR
- [ ] PR blocks if STATE.md invalid
- [ ] PR blocks if API calls don't match graph
- [ ] PR blocks if code doesn't follow standards
- [ ] PR blocks if QA failed
- [ ] PR passes if everything is clean
- [ ] CI comments show specific issues

---

## Phase 7: Documentation + Examples (Week 5)

**Goal:** Full docs + 3 working examples

### Deliverables

- ✓ QUICKSTART.md (5-minute setup)
- ✓ ARCHITECTURE.md (how Bifrost works)
- ✓ AGENT_REFERENCE.md (each agent explained)
- ✓ SKILL_REFERENCE.md (each skill explained)
- ✓ WORKFLOW_REFERENCE.md (each command)
- ✓ AUTONOMY_LEVELS.md (when to use each level)
- ✓ TROUBLESHOOTING.md (common issues + fixes)
- ✓ 3 working examples with step-by-step walkthroughs

### Work Breakdown

**Week 5:**
```
Day 1-2:
  - Write docs/QUICKSTART.md
    - Setup in 5 minutes
    - First feature walkthrough
    - Expected output at each step
    
  - Write docs/ARCHITECTURE.md
    - System diagram
    - How agents work together
    - State flow
    - Knowledge graph integration
    
Day 2-3:
  - Write docs/AGENT_REFERENCE.md
    - Each agent detailed
    - When it runs, what it reads/produces
    - Success examples
    
  - Write docs/SKILL_REFERENCE.md
    - Each skill detailed
    - Example rules
    - How agents use it
    
Day 3-4:
  - Create examples/feature-crud-api/
    - Step-by-step: Build REST endpoint
    - Show each bifrost command
    - Show output of each command
    - Show final code
    
  - Create examples/feature-ui-component/
    - Step-by-step: Build React component
    - Same walkthrough format
    
  - Create examples/feature-integration/
    - Step-by-step: Integrate third-party API
    - Stripe integration example
    
Day 4:
  - Write docs/TROUBLESHOOTING.md
    - "Skills not loading" → solutions
    - "STATE.md became invalid" → solutions
    - "Agent failed" → solutions
    - "How to reset a feature"
    
Day 5:
  - Verify docs are readable by non-technical user
  - Test examples on fresh machine
  - Can stranger follow QUICKSTART?
```

### Success Criteria

- [ ] QUICKSTART.md gets someone from 0 to first feature in 5 min
- [ ] All 3 examples work end-to-end (run bifrost init → deliver)
- [ ] Every bifrost command is documented
- [ ] Every agent is documented
- [ ] Every skill is documented
- [ ] Troubleshooting covers 10+ common issues
- [ ] Docs are readable by non-technical user

---

## Phase 8: Metrics + Monitoring (Week 5-6)

**Goal:** Bifrost metrics CLI + telemetry dashboard

### Deliverables

- ✓ `metrics.js` — Collects framework metrics
- ✓ Tracked metrics: velocity, QA accuracy, review time, agent accuracy
- ✓ `bifrost-metrics` command (view trends)
- ✓ Simple dashboard (spreadsheet or simple charts)
- ✓ Documentation: "How to interpret metrics"

### Work Breakdown

**Week 5-6:**
```
Day 1:
  - Write metrics.js
    - After feature delivery, collect:
      - Time from start → deliver
      - QA findings vs production bugs (accuracy)
      - Backend review time
      - % of code Backend dev changed
      - Agent deviation from PLAN
      
Day 2:
  - Write bifrost-metrics command
    - bifrost-metrics --since "7 days"
    - bifrost-metrics --project all
    - Output: Table of metrics per feature
    
Day 3:
  - Create simple metrics dashboard
    - Input: CSV of metrics
    - Output: Charts (velocity trend, quality trend, etc.)
    - Manual updates for now (not real-time)
    
Day 4-5:
  - Document metrics
    - What each metric means
    - How to interpret trends
    - When to escalate (metric bad → investigate)
    - Example: "If Backend review % > 20%, skills need updating"
    
  - Integrate metrics collection into bifrost-deliver
    - Automatic collection, no manual work
```

### Success Criteria

- [ ] CTO can run `bifrost-metrics --since "7 days"` and see trends
- [ ] Velocity metric shows improvement over time
- [ ] QA accuracy shows improvements
- [ ] Review time decreases as team learns
- [ ] Metrics inform skill/agent improvements

---

## Phase 9: Pilot + Iteration (Week 6-7)

**Goal:** Product team uses Bifrost on 1 real feature

### Deliverables

- ✓ 1 real feature built completely with Bifrost
- ✓ Metrics collected + analyzed
- ✓ Feedback incorporated into skills/agents
- ✓ "What didn't work" documented
- ✓ Playbooks updated for common patterns

### Work Breakdown

**Week 6-7:**
```
Day 1:
  - Select 1 real feature (Product lead chooses)
  - Feature should be: medium complexity (not trivial, not huge)
  
Day 2-5:
  - Product dev + AI agents run full workflow
  - start → plan → build → qa → deliver
  - Measure EVERYTHING
  - Collect feedback: "What was confusing? What was great?"
  
  - Anticipated issues:
    - Agent misunderstands scope → improve system-context skill
    - Code doesn't follow pattern → improve code-standards skill
    - Tests miss edge case → improve qa-validator skill
    - STATE.md gets out of sync → improve pre-commit hook
    
Day 6-7:
  - Analyze metrics
  - Update skills based on what didn't work
  - Document new patterns discovered
  - Update playbooks: "How to build search features"
  - Document: "What we learned from pilot"
```

### Success Criteria

- [ ] 1 real feature completes start → deliver cycle
- [ ] Metrics show: velocity < 4 hours (start → code ready)
- [ ] Backend dev review changes < 10% of code
- [ ] No showstopper issues (blockers)
- [ ] Product team feedback incorporated
- [ ] Skills updated based on pilot learnings

### Testing

Real-world testing. Actual Product team building actual feature. This reveals issues that lab testing misses.

---

## Phase 10: Full Rollout (Week 8+)

**Goal:** All Product features use Bifrost

### Deliverables

- ✓ Framework declared stable
- ✓ Product team trained (1-hour workshop)
- ✓ Existing in-progress features migrated to Bifrost
- ✓ Weekly metrics reviews
- ✓ Monthly skill/agent updates

### Work Breakdown

**Week 8+:**
```
Week 8:
  - Declare framework stable
  - Announce to Product team
  - Run 1-hour onboarding workshop
  - Answer questions
  
Week 8-9:
  - Migrate existing features to Bifrost
  - For in-progress features: Create .bifrost/ directory + hydrate
  - Backfill PATIENT.md + PLAN.md based on existing work
  - Continue with bifrost workflow
  
Week 9+:
  - All new features use Bifrost
  - Weekly metrics reviews (CTO + Product lead)
  - Identify which skills need updating
  - Monthly skill/agent updates based on real usage
  - Continuous improvement loop
```

### Success Criteria

- [ ] All Product team members trained
- [ ] All new features use Bifrost
- [ ] Metrics show sustained 3-4x velocity improvement
- [ ] Backend review time < 2 hours per feature
- [ ] No production bugs from Bifrost-generated code
- [ ] Team morale: "Bifrost makes my job easier"

---

## BUILD CHECKLIST

### Pre-Build Phase

- [ ] CTO approves this spec
- [ ] Backend identifies priority for architecture-graph seeding
- [ ] Product team confirms willing to pilot
- [ ] Allocate 1-2 engineers for 8 weeks

### Phase 1-2: Core Build (Weeks 1-3)

- [ ] All 7 agent templates written + tested
- [ ] All 8 skills written + validated
- [ ] `bifrost-init` script works
- [ ] Agents hydrate correctly
- [ ] Claude Code skill injection works
- [ ] Antigravity skill injection works

### Phase 3-4: Integration (Weeks 3-4)

- [ ] Architecture graph accessible to agents
- [ ] All `/bifrost:*` commands implemented + tested
- [ ] @Intake, @Planner, @CodeGen, @QA, @Conductor working
- [ ] Commands route to correct agents with correct context

### Phase 5-6: Quality (Weeks 4-5)

- [ ] State management system working
- [ ] Git hooks validate before commit
- [ ] GitHub Actions CI/CD workflows configured
- [ ] `bifrost-validate` commands all working

### Phase 7: Documentation (Week 5)

- [ ] All docs written + clear
- [ ] 3 examples complete + tested
- [ ] Troubleshooting guide covers 10+ scenarios
- [ ] QUICKSTART tested by non-technical user

### Phase 8: Monitoring (Week 5-6)

- [ ] Metrics collection working
- [ ] `bifrost-metrics` command works
- [ ] Dashboard shows trends

### Phase 9: Pilot (Week 6-7)

- [ ] 1 real feature built with Bifrost
- [ ] Metrics collected + analyzed
- [ ] Feedback incorporated into skills
- [ ] "What didn't work" documented

### Phase 10: Rollout (Week 8+)

- [ ] Framework declared stable
- [ ] Product team trained
- [ ] All new features use Bifrost
- [ ] Metrics show 3-4x velocity improvement
- [ ] Monthly reviews + iterations ongoing

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Agent templates are wrong | Features built on bad foundations | Iterate heavily during pilot |
| Skills are incomplete | @CodeGen breaks on edge cases | Collect real issues, add rules |
| Architecture graph is stale | Generated code doesn't match Backend | Automate graph updates, CTO reviews |
| Product team resists | Framework never adopted | Show wins on pilot, make it fast |
| Context rot still happens | Features degrade mid-build | Skills are persistent, not session-based |
| CI/CD too strict | Blocks valid work | Tune validation, don't block learning |
| State tracking breaks | Lost context mid-feature | Validate STATE.md at every step |
| Skills maintenance burden | Framework becomes hard to update | Skills are modular + isolated |

---

## Success Definition

Framework is successful when:

1. Product dev can initialize feature in < 5 minutes ✓
2. Feature code reaches Backend in < 4 hours (start → deliver) ✓
3. Backend dev review changes < 10% of code ✓
4. QA finding rate stabilizes (no surprises in production) ✓
5. CTO can see all active work with `/bifrost:rounds` ✓
6. Product team velocity increases 3-4x ✓
7. Framework requires minimal ongoing maintenance ✓

---

## See Also

- [architecture.md](architecture.md) — What you're building
- [success-criteria-CRITERIA.md](success-criteria-CRITERIA.md) — Metrics that matter
- **[Technical Roadmap & Visual Architecture.md](../Technical%20Roadmap%20%26%20Visual%20Architecture.md)** — Original detailed source
