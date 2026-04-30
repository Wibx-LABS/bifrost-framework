# Bifrost Framework

<p align="center">
  <pre>
██████╗ ██╗███████╗██████╗  ██████╗ ███████╗████████╗
██╔══██╗██║██╔════╝██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
██████╔╝██║█████╗  ██████╔╝██║   ██║███████╗   ██║   
██╔══██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║   ██║   
██████╔╝██║██║     ██║  ██║╚██████╔╝███████║   ██║   
╚═════╝ ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   
  </pre>
  <strong>Feature orchestration framework for the Bifrost Framework</strong>
</p>

Bifrost is a specialized framework that provides the infrastructure, skills, and context for AI agents (like Claude Code or Antigravity) to automate feature development. It bridges the gap between product requirements and high-quality implementation by providing a structured environment where AI can operate with architectural consistency and engineering excellence.

> [!IMPORTANT]
> **Bifrost is NOT AI-powered.** It does not contain LLMs or AI models internally. Instead, it builds the **agents, skills, and tools** that allow external AI assistants to work effectively within your codebase.

---

## 🏗️ Visual Architecture

```text
┌───────────────────────────────────────────────────────────────────────┐
│                        BIFROST FRAMEWORK ECOSYSTEM                    │
└───────────────────────────────────────────────────────────────────────┘

                                 DEVELOPER TEAM
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
                    │   BIFROST FRAMEWORK (Monorepo)    │
                    │                                   │
                    ├───────────────────────────────────┤
                    │ Commands: /bifrost:*              │
                    ├───────────────────────────────────┤
                    │ Agents:                           │
                    │  • @Intake (analyze scope)        │
                    │  • @Planner (break into tasks)    │
                    │  • @CodeGen (write code)          │
                    │  • @QA (test & validate)          │
                    │  • @Reviewer (handoff prep)       │
                    └────────┬────────────┬─────────────┘
                             │            │
           ┌─────────────────┘            └──────────────────┐
           │                                                 │
           ▼                                                 ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│   PROJECT (.bifrost/)        │            │  KNOWLEDGE LAYER             │
│                              │            │                              │
│  Per-Feature Artifacts:      │            │        knowledge/            │
│  • PATIENT.md (scope)        │            │                              │
│  • TRAJECTORY.md (invariants)│            │                              │
│  • IMPACT.md (changes)       │            │  • API_CONTRACTS.md          │
│  • PLAN.md (tasks)           │            │  • COMPONENT_LIBRARY.md      │
│  • STATE.md (history)        │            │  • NAMING_CONVENTIONS.md     │
│  • QA_REPORT.md (tests)      │            │  • GOTCHAS.md                │
└──────────────────────────────┘            └──────────────────────────────┘
```

---

## 🚀 The Bifrost Workflow

A feature goes through a structured pipeline managed by specialized agents:

1.  **Initialize**: `bifrost init` sets up the project structure and hydrates agents with domain knowledge.
2.  **Intake**: `@Intake` analyzes the feature scope (`PATIENT.md`), locks the invariants (`TRAJECTORY.md`), and produces an impact report (`IMPACT.md`).
3.  **Plan**: `@Planner` breaks the requirements into concrete technical tasks documented in `PLAN.md`.
4.  **Build**: `@CodeGen` generates source code following Bifrost standards and architectural patterns.
5.  **QA**: `@QA` validates the implementation, running tests and finding edge cases.
6.  **Deliver**: `@Reviewer` prepares the handoff, generates `HANDOFF.md`, and creates the GitHub PR.

---

## 🛠️ The CLI Commands

| Command           | Action                                             | Output                             |
| :---------------- | :------------------------------------------------- | :--------------------------------- |
| `bifrost init`    | Ingests PATIENT.md (Headless) or Interactive setup | `.bifrost/` structure & `STATE.md` |
| `bifrost start`   | Begins automated analysis (@Intake)                | `IMPACT.md` & updated state        |
| `bifrost status`  | Displays current pipeline progress                 | Formatted status box in terminal   |
| `bifrost review`  | Interactive artifact approval                      | Finalized task list & code review  |
| `bifrost deliver` | PR creation and Backend handoff                    | GitHub PR & `HANDOFF.md`           |

---

## 🤖 Agent Matrix

| Agent         | Input         | Primary Job             | Output                          |
| :------------ | :------------ | :---------------------- | :------------------------------ |
| **@Intake**   | `PATIENT.md`  | Understand scope impact | `IMPACT.md` + Approval gate     |
| **@Planner**  | `IMPACT.md`   | Break into tasks        | `PLAN.md` (Concrete steps)      |
| **@CodeGen**  | `PLAN.md`     | Write high-quality code | Source files + `CODE_REVIEW.md` |
| **@QA**       | Source code   | Test & find issues      | `QA_REPORT.md` + Pass/Fail      |
| **@Reviewer** | All artifacts | Prepare for Backend     | `HANDOFF.md` + PR metadata      |

---

## 📜 Key Concepts

### Efficiency Suite (Context, Prompt, Harness)

The three pillars of Bifrost performance:
- **Context Engineering**: Surgical sectional extraction (Pruned Context) ensures agents maintain < 40% context density, minimizing noise and redos.
- **Prompt Engineering**: Kebab-case tag normalization and dual-source resolution ensure 100% deterministic template hydration.
- **Harness Engineering**: Mandatory token budget tracking and session metrics enforce economic discipline and prevent architectural drift.

### STATE.md (Economic Harness)

The **Single Source of Truth** for project state and economic health. Maintained in `.bifrost/STATE.md`, it tracks not only agent progress but also **mandatory token budgets** and **session metrics** (turns, redos, context density).

### Surgical Hydration

The process of injecting high-density, domain-specific knowledge into agent templates via pruned sectional extraction. This ensures agents receive only the relevant parts of the manual (e.g., specific API contracts or component rules), reducing token wastage by up to 70%.

### Deterministic Validation

A centralized benchmarking suite (`bifrost-benchmark.js`) that validates framework integrity across three dimensions: **Isolation Fidelity** (no domain leakage), **Pattern Targeting** (correct knowledge injection), and **Economic Health** (budget initialization).

---

## 📂 Project Structure

```text
bifrost-framework/
├── tools/
│   └── bifrost-cli/           # CLI tool source (init, start, deliver, etc.)
├── core/
│   ├── agents/                # Agent prompt templates
│   ├── skills/                # Domain-specific skill protocols
│   └── templates/             # Artifact templates (PATIENT, TRAJECTORY, etc.)
├── knowledge/                 # Bifrost domain knowledge base
└── docs/                      # Numbered Protocol Documentation
    ├── 00-INDEX.md            # Navigation hub
    ├── 01-SYSTEM-ARCHITECTURE.md
    ├── 02-OPERATOR-MANUAL.md
    └── ... (03-07 protocols)
```

## 📖 Documentation Map

Bifrost uses a **Numbered Protocol System** for its documentation to ensure a clear reading order and intuitive discovery.

| File | Purpose | Audience |
| :--- | :--- | :--- |
| **[00-INDEX.md](docs/00-INDEX.md)** | Navigation Hub | Everyone |
| **[01-SYSTEM-ARCHITECTURE.md](docs/01-SYSTEM-ARCHITECTURE.md)** | System Design & Ground Rules | Engineers, Architects |
| **[02-OPERATOR-MANUAL.md](docs/02-OPERATOR-MANUAL.md)** | CLI Usage & Lifecycle Flow | Product Developers |
| **[03-AGENT-SPECIFICATIONS.md](docs/03-AGENT-SPECIFICATIONS.md)** | Detailed Agent & Skill Specs | Implementers |
| **[04-SUCCESS-METRICS.md](docs/04-SUCCESS-METRICS.md)** | KPIs & Progress Tracking | Everyone |
| **[05-ENGINEERING-STANDARDS.md](docs/05-ENGINEERING-STANDARDS.md)** | Code Quality Standards | Code Authors, Reviewers |
| **[06-BUSINESS-STRATEGY.md](docs/06-BUSINESS-STRATEGY.md)** | ROI & Business Strategy | Leadership, Stakeholders |
| **[07-TECHNICAL-ROADMAP.md](docs/07-TECHNICAL-ROADMAP.md)** | Framework Build Roadmap | Builders, PMs |

---

## 💻 Development

### Zero-Config Installation

The fastest way to install Bifrost is using our one-liner script:

```bash
curl -sL https://raw.githubusercontent.com/Wibx-LABS/bifrost-framework/main/install.sh | bash
```

### Manual Setup (Developers)

If you prefer to clone the repository and build it yourself:

```bash
# Clone the repository
git clone https://github.com/Wibx-LABS/bifrost-framework.git
cd bifrost-framework

# Install dependencies and build the CLI
cd tools/bifrost-cli
npm install
npm run build
```

### Available Scripts

- `npm run build`: Compile TypeScript to `dist/`
- `npm run watch`: Development mode with auto-rebuild
- `npm test`: Run the full test suite
- `npm run lint`: Check code quality

---

## 📈 Roadmap & Success

- **Phase 1**: Core Framework & Hydration (Done)
- **Phase 2**: Infrastructure Hardening & Efficiency Suite (Done)
- **Phase 3**: Knowledge Graph integration & CI/CD hooks (In Progress)

**Success Definition**:

- Feature initialization < 5 minutes.
- Start-to-Deliver time < 4 hours.
- Backend review changes < 10% of code.
- Context Density < 40% per agent.
- Token budget adherence > 98%.

---

<p align="center">
  <strong>Built and maintained by the Wibx Labs team. Internal use only.</strong>
</p>
