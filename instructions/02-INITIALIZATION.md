---
type: guide
status: active
topic: bifrost/setup
---

# BIFROST Initialization: bifrost init

How the `bifrost init` command transforms a blank folder into a ready-to-work feature environment. **Source materials:** Framework Specification, Bifrost CLI Plan, bifrost CLI layout.

---

## What Is Initialization?

`bifrost init` is a single CLI command that:
1. Asks you 3-5 questions about your feature
2. Sets up `.bifrost/` directory with all templates
3. Hydrates agents with your project context
4. Installs skills into Claude Code + Antigravity
5. Creates git branch + commit
6. Prints next steps

**Time:** ~2-3 minutes  
**Result:** Feature ready to start coding

---

## The Interrogation (Interview Process)

The CLI asks: **"Where is this work going?"** and **"What are we building?"**

### Path A: Existing Bifrost Surface (Standard Case)

Use this if you're adding a feature to an existing dashboard or app.

```
? WHERE IS THE DESTINATION?
> Existing Bifrost Surface
  New Standalone Project
  Landing Page / One-off

? Which application are we targeting?
> Merchant Platform (Business)
  User Profile & Security (Account)
  Shopping & Products (Shopping)
  Token Go Game (Gamification)

? What scope?
> New Section/Page
  Update Existing Section
  Reusable Tool

[If "Update Existing Section"]
? Which section? e.g., "Finance", "Rewards"
> [user enters section name]

? Does this need to handle/save information?
> Yes (Save/Connect)   → Hydrates with State Management + API patterns
  No (Visual Only)     → Focus on UI only
```

**Result:** Context injected into agents. They know: target app, target folder, which patterns to use.

### Path B: New Standalone Project (From Zero)

Use this if you're building something entirely new with no existing docs.

```
? WHERE IS THE DESTINATION?
> New Standalone Project

1. What is the name of this project?
   [user types: "Search Portal Redesign"]

2. List the 3 most important user actions:
   [user enters: "1. Search by token name"]
   [user enters: "2. Filter by category"]
   [user enters: "3. View transaction history"]

3. Does this require external services?
   [checkboxes: Stripe, Google Maps, Auth, etc.]

4. [CLI writes overview.md]
```

**Result:** CLI generates `overview.md` based on answers. Agents read it.

### Path C: Landing Page / One-off (Fast-Track)

Use this for quick projects where you provide your own instructions.

```
? WHERE IS THE DESTINATION?
> Landing Page / One-off

1. What are we building?
   [user types: "Internal Tool", "Prototype", "Promotional Page", etc.]

2. [CLI confirms: local assets_instruction.md + assets/ are source of truth]

3. [Setup proceeds with Universal Engineering Standards]
```

**Result:** Agents follow your local instructions + universal standards.

---

## What bifrost init Actually Does

**Step 1: Validation & Handshake**
```bash
✓ Checking Node + npm + git
✓ Validating no existing .bifrost/ (prevent overwrites)
✓ Syncing latest engineering standards from framework repo
```

**Step 2: Interview** (as above)

**Step 3: Create .bifrost/ Directory Structure**
```
.bifrost/
├── PATIENT.md              (scope template)
├── HEALTH.md               (quality gates)
├── AUTONOMY.md             (autonomy level = Task-Gated by default)
├── IMPACT.md               (template, will be filled by @Intake)
├── PLAN.md                 (template, will be filled by @Planner)
├── STATE.md                (initialized to "admitted" status)
├── agents/
│   ├── Intake_HYDRATED.md
│   ├── Planner_HYDRATED.md
│   ├── CodeGen_HYDRATED.md
│   ├── QA_HYDRATED.md
│   └── Conductor_HYDRATED.md
├── skills/
│   ├── bifrost-system-context/SKILL.md
│   ├── bifrost-code-standards/SKILL.md
│   ├── bifrost-api-integration/SKILL.md
│   ├── bifrost-component-gen/SKILL.md
│   ├── bifrost-code-review/SKILL.md
│   ├── bifrost-qa-validator/SKILL.md
│   ├── bifrost-graphify-ref/SKILL.md
│   └── bifrost-state-management/SKILL.md
└── PROJECT_CONTEXT.md      (per-project system prompt)
```

**Step 4: Hydrate Agents**

Template variables replaced with actual values:

```
Before:
  {{PROJECT_NAME}} → "Search Portal Redesign"
  {{TARGET_PATH}} → "apps/business/src/app/containers/search-portal"
  {{TECH_STACK}} → "Angular 15, NgRx, Material Design"
  {{API_BASE_URL}} → "api.accounting.searchPortals()"
  {{NAMING_CONVENTIONS}} → "[rules from knowledge/]"
  {{GOTCHAS}} → "[issues from knowledge/]"

After:
  Intake_HYDRATED.md now contains all real values
  @Intake knows exactly where to work + what patterns to follow
```

**Step 5: Install to Claude Code**

```bash
cp .bifrost/agents/*.md ~/.claude/skills/bifrost-*/
cp .bifrost/skills/*/*.md ~/.claude/skills/bifrost-*/
cp .bifrost/PROJECT_CONTEXT.md ~/.claude/
```

Now when you type `/bifrost:start`, Claude Code has all context preloaded.

**Step 6: Install to Antigravity** (if detected)

```bash
cp .bifrost/agents/*.md ~/.antigravity/skills/bifrost-*/
cp .bifrost/skills/*/*.md ~/.antigravity/skills/bifrost-*/
cp .bifrost/PROJECT_CONTEXT.md ~/.antigravity/
```

**Step 7: Set Up Git Hooks**

```bash
cp bifrost-framework/runtime/hooks/pre-commit.sh .git/hooks/
cp bifrost-framework/runtime/hooks/post-merge.sh .git/hooks/
chmod +x .git/hooks/*
```

Git hooks validate STATE.md before each commit.

**Step 8: Initialize Git**

```bash
git checkout -b bifrost/feature-name
git add .bifrost/
git commit -m "bifrost: initialize feature"
```

**Step 9: Print Next Steps**

```
✓ SETUP COMPLETE

Staging Area: .bifrost/
Git Branch:   bifrost/search-portal

NEXT STEPS:
1. Edit .bifrost/PATIENT.md with feature scope
2. In Claude Code, run /bifrost:start
3. Review IMPACT.md when ready
4. Proceed with /bifrost:plan

See docs/QUICKSTART.md for full workflow.
```

---

## The CLI User Experience

### Screen 1: Splash + Auto-Update

```
██████╗ ██╗███████╗██████╗  ██████╗ ███████╗████████╗
██╔══██╗██║██╔════╝██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
██████╔╝██║█████╗  ██████╔╝██║   ██║███████╗   ██║   
██╔══██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║   ██║   
██████╔╝██║██║     ██║  ██║╚██████╔╝███████║   ██║   
╚═════╝ ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   

> Token Labs | Advanced Agentic Coding Framework

[◌] Checking for CLI updates... (v1.0.4 found)
[◌] Syncing engineering manuals... (Frontend_Manual v1.4.2)
[✓] System Ready.
```

### Screen 2: Asset Discovery

```
┌─ SEARCHING FOR ASSETS ──────────────────────────────┐
│                                                     │
│  [✓] /assets folder detected                        │
│  [✓] assets_instruction.md detected                 │
│                                                     │
│  Bifrost will use these as the primary source of    │
│  truth for all design and content decisions.        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Screen 3: The "Big Split" (Main Menu)

```
? WHERE IS THE DESTINATION FOR THIS WORK?

> [A] Existing Bifrost Surface (Dashboard, App, etc.)
  [B] New Standalone Project (From Zero)
  [C] Landing Page / One-off (Fast-Track)

(Use arrow keys to select, press Enter)
```

### Screen 4: Path A - Destination Selection

```
┌─ SELECT DESTINATION ────────────────────────────────┐
│                                                     │
│  Which Bifrost application are we targeting?          │
│                                                     │
│  > Merchant Platform (Dashboard)                    │
│    User Profile & Security (Account)                │
│    Shopping & Products (Shopping)                   │
│    Token Go Game (Gamification)                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Screen 5: Path B - Deep Interview

```
┌─ NEW PROJECT INTERVIEW ─────────────────────────────┐
│                                                     │
│  1. What is the name of this project?               │
│     [ Search Portal Redesign          ]             │
│                                                     │
│  2. List the 3 most important user actions:         │
│     [ 1. Search by token name         ]             │
│     [ 2. Filter by category           ]             │
│     [ 3. View transaction history     ]             │
│                                                     │
│  3. Does this require external services?            │
│     [ ( ) Stripe   (x) Google Maps  ( ) Auth ]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Screen 6: Hydration Progress

```
┌─ HYDRATING AGENTS ──────────────────────────────────┐
│                                                     │
│  Mapping to apps/business...          [ DONE ]      │
│  Injecting NgRx patterns...           [ DONE ]      │
│  Training AI (Claude/Antigravity)...  [ DONE ]      │
│  Installing Git Hooks...              [ DONE ]      │
│                                                     │
│  Progress: [████████████████████████████████] 100%  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Screen 7: Completion

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ✓ SETUP COMPLETE                                   │
│                                                     │
│  Staging Area: .bifrost/                            │
│  Git Branch:   bifrost/search-portal                │
│                                                     │
│  NEXT STEPS:                                        │
│  1. Open Antigravity in this folder.                │
│  2. Type '/bifrost:start' to begin the mission.     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Agent Hydration: How It Works

**Problem:** Agent templates are generic. Each project is different.

**Solution:** Inject project-specific values at initialization.

### Example: CodeGen Agent

**Before (template):**
```markdown
# @CodeGen Instructions

Follow these standards:
{{NAMING_CONVENTIONS}}
{{CODE_STANDARDS}}
{{TECH_STACK}}

Target path:
{{TARGET_PATH}}

API endpoints:
{{API_BASE_URL}}

Known gotchas:
{{GOTCHAS}}
```

**After (hydrated):**
```markdown
# @CodeGen Instructions

Follow these standards:
- Use kebab-case for file names
- Use camelCase for functions
- 4 space indent
- Single quotes
- ESLint compliance required

Target path:
apps/business/src/app/containers/search-portal

API endpoints:
- api.searching.queryPortals()
- api.searching.filterByCategory()
- api.searching.getTransactionHistory()

Known gotchas:
- Don't use .subscribe() directly (use async pipe or ngrx selects)
- State changes are immediate; DB changes are async
- Material Dialog overlays need CDK portal host
```

**Result:** @CodeGen knows exactly where to work, what rules apply, and what patterns exist in _this_ project.

---

## After Initialization: What's Next?

1. **Edit `.bifrost/PATIENT.md`**  
   Write your feature scope. Be specific about requirements, constraints, edge cases.

2. **Open Claude Code or Antigravity** in the project folder

3. **Run `/bifrost:start`**  
   @Intake reads PATIENT.md, queries architecture graph, produces IMPACT.md

4. **Review IMPACT.md**  
   Does the scope impact analysis look right? Any surprises?

5. **Approve and proceed**  
   When you're ready, run `/bifrost:plan`

See [01-ARCHITECTURE.md](01-ARCHITECTURE.md) for the full workflow after initialization.

---

## See Also

- [01-ARCHITECTURE.md](01-ARCHITECTURE.md) — Workflow after init is complete
- [03-AGENTS-AND-SKILLS.md](03-AGENTS-AND-SKILLS.md) — Details on what each agent/skill does
- **[Bifrost CLI Plan.md](../Bifrost%20CLI%20Plan.md)** — Original detailed source (CLI architecture)
- **[bifrost CLI layout.md](../bifrost%20CLI%20layout.md)** — Original detailed source (UI mockups)
- **[Framework Specification.md](../Framework%20Specification.md)** — Original detailed source (hydration system)
