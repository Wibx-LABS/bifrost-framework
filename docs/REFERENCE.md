---
type: reference
status: active
topic: bifrost
---

# Documentation Reference Index

**Where to find information in the original 6 source documents, consolidated guides, and implementation plans.**

This index helps you navigate all documentation files:

- **Original 6 source documents** in `/docs/`
- **Consolidated guides** in `/instructions/` (root level)
- **Implementation plans** in `/docs/` (for specific teams/roles)
- **Knowledge base** in `/knowledge/` (extracted from Bifrost frontend manual)

---

## Quick Navigation by Topic

### "I want to understand the system design"

→ **[01-ARCHITECTURE.md](../instructions/01-ARCHITECTURE.md)** (consolidated) OR  
→ **Technical Roadmap & Visual Architecture.md** (original, section: "SYSTEM ARCHITECTURE DIAGRAM", "DATA FLOW")

### "I want to build the Bifrost framework"

→ **[04-IMPLEMENTATION-PLAN.md](../instructions/04-IMPLEMENTATION-PLAN.md)** (consolidated) OR  
→ **Technical Roadmap & Visual Architecture.md** (original, section: "TECHNICAL IMPLEMENTATION ROADMAP", "BUILD CHECKLIST")

### "I want to initialize a feature project"

→ **[02-INITIALIZATION.md](../instructions/02-INITIALIZATION.md)** (consolidated) OR  
→ **Framework Specification.md** (original, section: "INITIALIZATION FLOW") OR  
→ **Bifrost CLI Plan.md** (original, section: "3. The Interrogation Process") OR  
→ **bifrost CLI layout.md** (original, all sections - visual screens)

### "I need details on a specific agent or skill"

→ **[03-AGENTS-AND-SKILLS.md](../instructions/03-AGENTS-AND-SKILLS.md)** (consolidated) OR  
→ **Technical Roadmap & Visual Architecture.md** (original, sections: "AGENT RESPONSIBILITY MATRIX", "SKILL MAPPING")

### "I need to explain this to leadership"

→ **[06-STRATEGY.md](../instructions/06-STRATEGY.md)** (consolidated) OR  
→ **Operation Bifrost.md** (original, all sections)

### "I need to know what success looks like"

→ **[05-SUCCESS-CRITERIA.md](../instructions/05-SUCCESS-CRITERIA.md)** (consolidated) OR  
→ **Technical Roadmap & Visual Architecture.md** (original, section: "SUCCESS DEFINITION") OR  
→ **Framework Specification.md** (original, section: "SUCCESS CRITERIA") OR  
→ **Operation Bifrost.md** (original, section: "Success Criteria")

### "I need to understand a binding architectural decision"

→ **[instructions/decisions/README.md](../instructions/decisions/README.md)** — index of all active ADRs

The active ADRs are operational specifications every agent and skill respects:

- **[ADR-006: Feature lifecycle](../instructions/decisions/ADR-006-feature-lifecycle.md)** — 7 lifecycle agents, 9 skills (with `bifrost-hr`), per-feature artifact set
- **[ADR-007: Wiboo monorepo as v0 target](../instructions/decisions/ADR-007-wiboo-monorepo.md)** — single-stack target + operational acceptance criteria
- **[ADR-008: Trajectory-context protocol](../instructions/decisions/ADR-008-trajectory-context-protocol.md)** — TRAJECTORY.md as locked-at-launch invariant store; mandatory first-read; acknowledgement chain
- **[ADR-009: bifrost-hr — agents fixed at 7](../instructions/decisions/ADR-009-bifrost-hr.md)** — skills grow on demand via `bifrost-hr` (loaded by `@Intake` only)
- **[ADR-010: Artifact set refinement](../instructions/decisions/ADR-010-artifact-set.md)** — 10-artifact set; HEALTH deprecated; AUTONOMY folds into STATE frontmatter

### "I need to understand the receiving team's delivery standards"

→ **[instructions/principles/delivery-standards.md](../instructions/principles/delivery-standards.md)** — Frontend-department-stated, non-negotiable: focused PRs, structured/documented delivery, Angular components

### "I need to work with Bifrost frontend codebase"

→ **`/knowledge/` folder** for complete Bifrost reference:

- **API_CONTRACTS.md** — All backend API endpoints + request/response specs
- **COMPONENT_LIBRARY.md** — All reusable UI components with usage examples
- **NAMING_CONVENTIONS.md** — Code style rules (file naming, formatting, linting)
- **TECH_STACK.md** — Dependencies, versions, configuration, performance targets
- **GOTCHAS.md** — Known issues, security rules, common mistakes

→ **Frontend_repository_manual.md** (original) — Complete source documentation

### "I'm building the Bifrost CLI (as Caio)"

→ **[CAIO_CLI_IMPLEMENTATION_PLAN.md](CAIO_CLI_IMPLEMENTATION_PLAN.md)** (primary working document) — Complete Phase 1 CLI implementation roadmap for CLI tool, hydration system, state management, all 5 commands, and testing strategy

- This is your detailed specification + work breakdown + timeline
- References all original docs + consolidated guides as source material
- Contains handoff points with Pedro (agents + skills)

→ **[02-INITIALIZATION.md](../instructions/02-INITIALIZATION.md)** (consolidated) — bifrost-init process walkthrough
→ **Bifrost CLI Plan.md** (original) — Technical details on interrogation process
→ **bifrost CLI layout.md** (original) — UI/UX mockups of all 7 CLI screens

---

## Original Documents (Detailed Index)

### 1. Technical Roadmap & Visual Architecture.md

**What it contains:** Most detailed phase-by-phase breakdown of framework development.

**Best for:** Understanding implementation phases + detailed technical architecture.

| Section                                  | Topic                                          | Use When                                          |
| ---------------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| SYSTEM ARCHITECTURE DIAGRAM              | System design with ASCII diagram               | You need to visualize the full system             |
| DATA FLOW: A Feature from Start to Merge | Step-by-step workflow                          | You need to understand the complete workflow      |
| AGENT RESPONSIBILITY MATRIX              | What each of 7 agents does (input/output/job)  | You need agent specs                              |
| SKILL MAPPING                            | What each of 8 skills contains (with examples) | You need skill specs                              |
| TECHNICAL IMPLEMENTATION ROADMAP         | Phases 1-10 with detailed work breakdown       | You're planning framework development             |
| BUILD CHECKLIST                          | Detailed phase-by-phase checklist              | You're building the framework + tracking progress |
| SUCCESS DEFINITION                       | Framework success criteria (7 goals)           | You need clear success metrics                    |
| RISKS & MITIGATION                       | Risk table (7 risks)                           | You're assessing risk factors                     |
| DECISION TREE                            | Should we build this? (go/no-go)               | You're justifying investment                      |

**Size:** ~750 lines  
**Audience:** Engineers, architects, CTO  
**Updated by:** Original author (consolidation captured in instructions/ folder)

---

### 2. Framework Specification.md

**What it contains:** Deep dive into repository structure, initialization, hydration, CI/CD, version management.

**Best for:** Complete reference of framework structure + detailed technical specs.

| Section                          | Topic                                        | Use When                                 |
| -------------------------------- | -------------------------------------------- | ---------------------------------------- |
| OBJECTIVE                        | What we're building (1-pager)                | You need the elevator pitch              |
| REPOSITORY STRUCTURE             | Full file structure of framework repo        | You're building the repo                 |
| COMMAND INTERFACE                | All CLI commands for Product + CTO           | You need to see available commands       |
| INITIALIZATION FLOW              | Step-by-step bifrost-init breakdown          | You're implementing bifrost-init         |
| AGENT HYDRATION SYSTEM           | How agents get project context               | You're designing hydration system        |
| KNOWLEDGE GRAPH INTEGRATION      | How agents query architecture graph          | You need architecture graph details      |
| STATE MANAGEMENT (FORGE Pattern) | STATE.md deep dive with example              | You're designing state system            |
| SKILL INJECTION                  | How skills load into Claude Code/Antigravity | You're building skill installer          |
| CI/CD INTEGRATION                | GitHub Actions workflows                     | You're setting up CI/CD                  |
| SCALING                          | Multi-feature workflow example               | You want to understand parallel features |
| ONBOARDING                       | New developer experience                     | You're training team                     |
| VERSION MANAGEMENT               | Framework versioning + upgrades              | You're managing framework versions       |
| MONITORING & METRICS             | Metrics tracking                             | You're setting up observability          |
| DEPLOYMENT CHECKLIST             | What must exist before day 1                 | You're launching the framework           |
| SUCCESS CRITERIA                 | Success table (7 metrics)                    | You need success definition              |
| DELIVERABLES                     | What gets built (summary)                    | You need scope overview                  |
| ROLLOUT TIMELINE                 | Phase-by-phase timeline (table)              | You're planning timeline                 |

**Size:** ~850 lines  
**Audience:** Engineers, architects, DevOps  
**Updated by:** Original author (consolidation captured in instructions/ folder)

---

### 3. Operation Bifrost.md

**What it contains:** Strategic pitch, business case, ROI analysis, stakeholder buy-in context.

**Best for:** Explaining why Bifrost matters + justifying investment.

| Section                              | Topic                                  | Use When                               |
| ------------------------------------ | -------------------------------------- | -------------------------------------- |
| OBJECTIVE                            | What problem does this solve?          | You're pitching to non-technical folks |
| SYSTEM ARCHITECTURE (Current/Future) | Before/after comparison                | You're showing impact                  |
| CAUTION ALERTS                       | Assumptions, gaps, scale friction      | You're assessing risks                 |
| NEXT ACTIONS                         | 3 recommended steps                    | You're deciding what to do next        |
| PITCH                                | The full business case                 | You're presenting to CTO/CEO           |
| ROI                                  | Quantifiable + unquantifiable benefits | You're justifying cost                 |
| What Happens After Validation        | Go/no-go decision framework            | You're setting expectations            |

**Size:** ~240 lines  
**Audience:** C-suite, Product lead, Backend lead, decision makers  
**Updated by:** Original author (consolidation captured in 06-STRATEGY.md)

---

### 4. Bifrost CLI Plan.md

**What it contains:** Technical architecture of the CLI tool, interrogation process, hydration details.

**Best for:** Detailed technical specs of CLI implementation.

| Section                                  | Topic                                                   | Use When                                    |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| Overview                                 | What the CLI does                                       | You want a summary                          |
| CLI CORE ARCHITECTURE                    | Distribution, installation, self-update, knowledge sync | You're building the CLI distribution system |
| The Interrogation Process (bifrost init) | Interview process + context injection                   | You're implementing bifrost-init questions  |
| Hydration & AI Training                  | How to inject context into agents                       | You're building hydration system            |
| Guardrails & Perfect Delivery            | Pre-commit policies, transplant package                 | You're designing validation                 |
| Success Metrics                          | 3 target metrics                                        | You need success criteria for CLI           |

**Size:** ~115 lines  
**Audience:** Engineers building CLI, architects  
**Updated by:** Original author (consolidation captured in 02-INITIALIZATION.md)

---

### 5. bifrost CLI layout.md

**What it contains:** UI/UX mockups of CLI screens using ASCII art.

**Best for:** Visual reference of what CLI should look like.

| Section                                  | Topic                        | Use When                           |
| ---------------------------------------- | ---------------------------- | ---------------------------------- |
| Screen 1: Splash & Auto-Update           | Version check + sync         | You're designing startup screen    |
| Screen 2: Asset Discovery                | Confirms assets/instructions | You're designing asset detection   |
| Screen 3: The "Big Split"                | Main menu (Path A/B/C)       | You're designing main menu         |
| Screen 4: Path A - Destination Selection | Choose which app             | You're designing Path A flow       |
| Screen 5: Path B - Deep Interview        | Interview questions          | You're designing Path B flow       |
| Screen 6: Hydration Progress             | Setup progress bar           | You're designing progress screen   |
| Screen 7: Completion & Launch            | Final instructions           | You're designing completion screen |

**Size:** ~135 lines (mostly ASCII art)  
**Audience:** Engineers building CLI UI  
**Updated by:** Original author (visual reference captured in 02-INITIALIZATION.md)

---

### 6. Frontend_repository_manual.md

**What it contains:** Complete Bifrost monorepo reference (project structure, tech stack, apps, libraries, patterns).

**Best for:** Technical reference for Bifrost frontend codebase. **NOT** about Bifrost framework (separate domain).

| Section                              | Topic                                               | Use When                                  |
| ------------------------------------ | --------------------------------------------------- | ----------------------------------------- |
| 1. Project Overview                  | Monorepo summary (Nx, Angular, etc.)                | You need Bifrost tech stack overview        |
| 2. Repository Structure              | File structure of monorepo                          | You're navigating Bifrost codebase          |
| 3. Technology Stack                  | All dependencies + versions                         | You need to know what's installed         |
| 4. Workspace & Tooling Configuration | TypeScript, Prettier, Yarn, Nx, etc.                | You're configuring dev environment        |
| 5. Applications In-Depth             | Details on account, business, shopping, Tokengo apps | You're building features in specific apps |
| 6. Shared Libraries                  | commonlib, wallet library details                   | You're using shared components            |
| 7. State Management (NgRx)           | Store architecture + patterns                       | You're writing state-managed components   |
| 8. Styling System                    | SCSS variables, colors, breakpoints                 | You're styling components                 |
| 9. Internationalization              | i18n setup + files                                  | You're adding multi-language support      |
| 10. API Layer                        | Centralized API constant + endpoints                | You're calling backend APIs               |
| 11. Security & Cryptography          | CryptoService + RSA encryption                      | You're implementing security              |
| 12. Angular Module Architecture      | Module types + patterns                             | You're structuring modules                |
| 13. Coding Standards & ESLint Rules  | Comprehensive linting + style rules                 | You're writing code that passes lint      |
| 14. File Header Compliance           | Bifrost confidentiality header requirement            | You're adding file headers                |
| 15. Testing Strategy                 | Jest, Cypress, test patterns                        | You're writing tests                      |
| 16. CI/CD Pipeline                   | GitHub Actions workflows                            | You're setting up CI/CD                   |
| 17. Development Workflow             | Commands to start, build, test                      | You're developing locally                 |
| 18. Environment Management           | Environment configuration                           | You're configuring environments           |
| 19. Nx Caching & Affected Builds     | Build optimization                                  | You're optimizing builds                  |
| 20. Feature Flags                    | Feature gating system                               | You're using feature flags                |
| 21. Platform Application IDs         | App ID enum                                         | You're checking app identity              |
| 22. Proxy Configuration              | Dev proxy setup                                     | You're debugging API calls                |
| 23. Key Dependencies Reference       | Why specific packages were chosen                   | You're understanding dependencies         |

**Size:** ~1500 lines  
**Audience:** Bifrost frontend developers, architects  
**Note:** This is **project knowledge**, not Bifrost framework documentation. Preserved here for completeness.

---

## Consolidated Documents (New Guides)

All in `/instructions/` (root level):

| Document                      | Purpose                             | Consolidates From                                                                                             |
| ----------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **OVERVIEW.md**               | Master guide to instructions folder | N/A (new)                                                                                                     |
| **01-ARCHITECTURE.md**        | System design reference             | Technical Roadmap (diagrams, architecture) + Framework Spec (prose)                                           |
| **02-INITIALIZATION.md**      | bifrost init process walkthrough    | Framework Spec (init flow) + CLI Plan (interrogation) + CLI layout (screens)                                  |
| **03-AGENTS-AND-SKILLS.md**   | Complete agent + skill specs        | Technical Roadmap (agent matrix, skill mapping) + Framework Spec                                              |
| **04-IMPLEMENTATION-PLAN.md** | Phase-by-phase build roadmap        | Technical Roadmap (phases 1-10, build checklist)                                                              |
| **05-SUCCESS-CRITERIA.md**    | Metrics + success definition        | Technical Roadmap (success def, risks) + Framework Spec (success criteria) + Operation Bifrost (metrics, ROI) |
| **06-STRATEGY.md**            | Business case + stakeholder pitch   | Operation Bifrost (all sections)                                                                              |

---

## Knowledge Base Documents

All in `/knowledge/`:

| Document                  | Purpose                                                                                        | Source                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **API_CONTRACTS.md**      | Complete Bifrost API endpoint reference (15+ endpoints across 9 domains)                         | Frontend_repository_manual.md (Section 10. API Layer)        |
| **COMPONENT_LIBRARY.md**  | All reusable UI components (50+ components, organized by category)                             | Frontend_repository_manual.md (Section 6.1 Components)       |
| **NAMING_CONVENTIONS.md** | Comprehensive coding standards (file/class/function/variable naming, formatting rules)         | Frontend_repository_manual.md (Section 13. Coding Standards) |
| **TECH_STACK.md**         | Complete tech reference (Angular 15, NgRx, Material, versions, rationale, performance targets) | Frontend_repository_manual.md (Section 3. Technology Stack)  |
| **GOTCHAS.md**            | Known issues, pitfalls, lessons learned (RxJS, state management, styling, security, testing)   | Frontend_repository_manual.md + team experience              |

---

## Implementation Plans (Working Documents)

All in `/docs/`:

| Document                            | Purpose                                                                                                       | For Whom                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **CAIO_CLI_IMPLEMENTATION_PLAN.md** | Complete Phase 1 CLI implementation roadmap (263 hours breakdown, detailed deliverables, handoffs with Pedro) | Caio (CLI lead) — primary working document for CLI development                          |
| **GRAPHIFY_SEEDING_PLAN.md**        | One-time safe knowledge extraction from Bifrost codebase with human verification gates                          | Knowledge base curators — after knowledge base is established, to validate completeness |

---

## Cross-Reference: Where Topics Appear

### Agent Specifications

| Agent      | Found In                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| @Intake    | Technical Roadmap (AGENT RESPONSIBILITY MATRIX), Framework Spec (repo structure)                      |
| @Planner   | Technical Roadmap (AGENT RESPONSIBILITY MATRIX), Framework Spec (repo structure)                      |
| @CodeGen   | Technical Roadmap (AGENT RESPONSIBILITY MATRIX), Framework Spec (repo structure), CLI Plan (mentions) |
| @QA        | Technical Roadmap (AGENT RESPONSIBILITY MATRIX), Framework Spec (repo structure)                      |
| @Conductor | Technical Roadmap (AGENT RESPONSIBILITY MATRIX), Framework Spec (state management section)            |
| @Monitor   | Technical Roadmap (AGENT RESPONSIBILITY MATRIX), Framework Spec (repo structure)                      |
| @Reviewer  | Technical Roadmap (AGENT RESPONSIBILITY MATRIX), Framework Spec (repo structure)                      |

### Skill Specifications

| Skill                    | Found In                                          |
| ------------------------ | ------------------------------------------------- |
| bifrost-system-context   | Technical Roadmap (SKILL MAPPING), Framework Spec |
| bifrost-code-standards   | Technical Roadmap (SKILL MAPPING), Framework Spec |
| bifrost-api-integration  | Technical Roadmap (SKILL MAPPING), Framework Spec |
| bifrost-component-gen    | Technical Roadmap (SKILL MAPPING), Framework Spec |
| bifrost-code-review      | Technical Roadmap (SKILL MAPPING), Framework Spec |
| bifrost-qa-validator     | Technical Roadmap (SKILL MAPPING), Framework Spec |
| bifrost-graphify-ref     | Technical Roadmap (SKILL MAPPING), Framework Spec |
| bifrost-state-management | Technical Roadmap (SKILL MAPPING), Framework Spec |

### Implementation Details

| Topic                      | Found In                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| Phase 1: Core Framework    | Technical Roadmap (6 pages of detail)                                                    |
| Phase 2: Skill Integration | Technical Roadmap (detailed breakdown)                                                   |
| Phase 3-10                 | Technical Roadmap (each phase detailed)                                                  |
| bifrost-init command       | Framework Spec (INITIALIZATION FLOW) + CLI Plan (entire document) + CLI layout (screens) |
| Agent hydration            | Framework Spec (AGENT HYDRATION SYSTEM section, code example)                            |
| Knowledge graph            | Framework Spec (KNOWLEDGE GRAPH INTEGRATION section)                                     |
| STATE.md                   | Framework Spec (STATE MANAGEMENT section, example)                                       |
| Skill injection            | Framework Spec (SKILL INJECTION section)                                                 |
| CI/CD                      | Framework Spec (CI/CD INTEGRATION section) + Technical Roadmap (mentions)                |
| Git hooks                  | Technical Roadmap (DATA FLOW) + Framework Spec                                           |

---

## Reading Paths by Audience

### "I'm building the Bifrost framework" (Engineers)

1. **Start:** [04-IMPLEMENTATION-PLAN.md](../instructions/04-IMPLEMENTATION-PLAN.md) (consolidated) → Overview of phases
2. **Then:** [01-ARCHITECTURE.md](../instructions/01-ARCHITECTURE.md) (consolidated) → Understand what you're building
3. **Then:** [03-AGENTS-AND-SKILLS.md](../instructions/03-AGENTS-AND-SKILLS.md) (consolidated) → Understand agent/skill specs
4. **For deep dives:** Technical Roadmap, Framework Spec, CLI Plan, CLI layout (originals)
5. **For debugging:** Search originals for specific component (e.g., "hydration", "STATE.md", "git hooks")

### "I'm using Bifrost to build a feature" (Product Developer)

1. **Start:** [02-INITIALIZATION.md](../instructions/02-INITIALIZATION.md) (consolidated) → Learn bifrost init
2. **Then:** [01-ARCHITECTURE.md](../instructions/01-ARCHITECTURE.md) (consolidated) → Understand the workflow
3. **Then:** [03-AGENTS-AND-SKILLS.md](../instructions/03-AGENTS-AND-SKILLS.md) (consolidated) → Understand each agent/skill
4. **Reference:** [05-SUCCESS-CRITERIA.md](../instructions/05-SUCCESS-CRITERIA.md) (consolidated) → Track progress + metrics

### "I'm building the Bifrost CLI" (Caio - CLI Lead)

1. **Start:** [CAIO_CLI_IMPLEMENTATION_PLAN.md](CAIO_CLI_IMPLEMENTATION_PLAN.md) (primary working document)
   - Detailed work breakdown (263 hours across Phase 1)
   - All 5 CLI commands specified (init, start, status, review, deliver)
   - Hydration system + STATE.md management
   - Testing strategy (unit, integration, mock agents, E2E)
   - Handoff points with Pedro (agents + skills)
   - Timeline and dependencies
2. **For design references:** [02-INITIALIZATION.md](../instructions/02-INITIALIZATION.md) (consolidated) → CLI design patterns
3. **For UI/UX mockups:** bifrost CLI layout.md (original) → All 7 CLI screens
4. **For interrogation details:** Bifrost CLI Plan.md (original) → Technical interrogation process
5. **For architecture overview:** [01-ARCHITECTURE.md](../instructions/01-ARCHITECTURE.md) (consolidated) → System design
6. **For success metrics:** [05-SUCCESS-CRITERIA.md](../instructions/05-SUCCESS-CRITERIA.md) (consolidated) → Success definition

### "I need to explain Bifrost to leadership" (CTO/Decision Maker)

1. **Start:** [06-STRATEGY.md](../instructions/06-STRATEGY.md) (consolidated) → Full business case + ROI
2. **Then:** [01-ARCHITECTURE.md](../instructions/01-ARCHITECTURE.md) (consolidated, section: "The System at a Glance") → High-level design
3. **Then:** [05-SUCCESS-CRITERIA.md](../instructions/05-SUCCESS-CRITERIA.md) (consolidated, section: "Business Success") → Success definition
4. **For detailed pitch:** Operation Bifrost.md (original, all sections)

### "I'm implementing a specific component" (Architect/Engineer)

Use this table to find exact section:

| Component           | Best Source                                                 |
| ------------------- | ----------------------------------------------------------- |
| Agent templates     | Technical Roadmap + Framework Spec (repo structure section) |
| Skills              | Technical Roadmap (SKILL MAPPING)                           |
| bifrost-init script | CLI Plan (section 3) + CLI layout (all screens)             |
| Hydration system    | Framework Spec (AGENT HYDRATION SYSTEM section)             |
| STATE.md format     | Framework Spec (STATE MANAGEMENT section)                   |
| Git hooks           | Technical Roadmap (DATA FLOW section)                       |
| CI/CD pipelines     | Framework Spec (CI/CD INTEGRATION section)                  |
| Metrics collection  | Technical Roadmap (TECHNICAL IMPLEMENTATION section)        |

---

## Notes

- **All original files are preserved** in `/docs/`. Nothing deleted.
- **Consolidated guides** in `/instructions/` (root level) reduce redundancy while pointing back to originals for deep dives.
- **Implementation plans** in `/docs/` are detailed working documents for specific roles (Caio for CLI, knowledge curators for Graphify).
- **Knowledge base** in `/knowledge/` is extracted from Frontend_repository_manual.md for easy reference.
- **No information is lost.** Consolidation captures key points; originals have complete context.
- **Updates:** If originals change, update both originals AND consolidated guides to stay in sync.

---

## Version History

| Date       | Change                                                                                                                                            | Author        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 2026-04-27 | Fixed broken paths (`instructions/` → `../instructions/`), added CAIO_CLI_IMPLEMENTATION_PLAN.md reference, added "Building the CLI" reading path | Audit fix     |
| 2026-04-27 | Created consolidated instructions folder + REFERENCE.md                                                                                           | Initial audit |

---

See: [OVERVIEW.md](../instructions/OVERVIEW.md) for master guide to instructions folder.
