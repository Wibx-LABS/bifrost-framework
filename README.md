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
  <strong>AI-powered feature orchestration for the Bifrost ecosystem</strong>
</p>

Bifrost is a specialized framework that orchestrates intelligent AI agents to automate feature development. It bridges the gap between product requirements and high-quality implementation, ensuring architectural consistency and engineering excellence across the entire Bifrost ecosystem.

---

## 🏗️ Visual Architecture

```text
┌───────────────────────────────────────────────────────────────────────┐
│                        BIFROST FRAMEWORK ECOSYSTEM                    │
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
2.  **Intake**: `@Intake` analyzes the feature scope and produces a detailed impact report (`IMPACT.md`).
3.  **Plan**: `@Planner` breaks the requirements into 5-10 concrete technical tasks documented in `PLAN.md`.
4.  **Build**: `@CodeGen` generates source code following Bifrost standards and architectural patterns.
5.  **QA**: `@QA` validates the implementation, running tests and finding edge cases.
6.  **Deliver**: `@Reviewer` prepares the handoff, generates `HANDOFF.md`, and creates the GitHub PR.

---

## 🛠️ The CLI Commands

| Command           | Action                              | Output                             |
| :---------------- | :---------------------------------- | :--------------------------------- |
| `bifrost init`    | Interactive setup for new features  | `.bifrost/` structure & `STATE.md` |
| `bifrost start`   | Begins automated analysis (@Intake) | `IMPACT.md` & updated state        |
| `bifrost status`  | Displays current pipeline progress  | Formatted status box in terminal   |
| `bifrost review`  | Interactive artifact approval       | Finalized task list & code review  |
| `bifrost deliver` | PR creation and Backend handoff     | GitHub PR & `HANDOFF.md`           |

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

### STATE.md

The **Single Source of Truth** for project state. Maintained in `.bifrost/STATE.md`, it tracks agent progress, completion signals, and the overall feature delivery timeline. Git hooks ensure this file remains valid before any commit.

### Hydration

The process of injecting Bifrost-specific knowledge (API contracts, naming conventions, design tokens) into agent templates. This ensures agents are "trained" on your specific project context from Day 1.

### Knowledge Layer

A centralized layer of architectural knowledge (`knowledge/` directory) that agents query to understand existing APIs, components, and patterns, preventing redundant work and architectural drift.

---

## 📂 Project Structure

```text
bifrost-framework/
├── tools/
│   └── bifrost-cli/           # CLI tool source
│       ├── src/
│       │   ├── commands/      # Command implementations (init, start, etc.)
│       │   ├── core/          # Orchestration, git logic, and hydration
│       │   ├── ui/            # Premium terminal UI components
│       │   └── hydration/     # Context injection system
│       └── package.json
├── knowledge/                 # Bifrost domain knowledge base
├── docs/                      # Extensive guides and specifications
├── instructions/              # Agent and system instructions
└── README.md
```

---

## 💻 Development

### Setup

```bash
# Clone the repository
git clone https://github.com/Token-LABS/bifrost-framework.git
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

- **Phase 1**: Core Framework & hydration system (Done)
- **Phase 2**: Agent specialization & skill injection (In Progress)
- **Phase 3**: Knowledge Graph integration & CI/CD hooks (Planned)

**Success Definition**:

- Feature initialization < 5 minutes.
- Start-to-Deliver time < 4 hours.
- Backend review changes < 10% of code.
- Agent accuracy > 95%.

---

<p align="center">
  <strong>Token Labs</strong>
</p>
