# Bifrost CLI Developer Guide

This document provides technical details for developers working on the Bifrost CLI.

## 🏗️ Architecture Detail

### Command Pattern
We use `@oclif/core` for command handling. Each command resides in `src/commands/` and inherits from the `Command` class.

Key commands:
- `init.ts`: The "Interrogation" process. Collects user requirements and initializes the `.bifrost/` directory.
- `start.ts`: Triggers the first agent (`@Intake`).
- `status.ts`: Renders the current state from `STATE.md`.
- `review.ts`: Provides an interactive loop for approving/rejecting agent artifacts.
- `deliver.ts`: Handles the final Git workflow (branching, committing, PR creation).

### State Management (`STATE.md`)
`STATE.md` is the single source of truth for a feature's progress. It uses YAML frontmatter for metadata and Markdown for the timeline and artifact links.
Logic resides in `src/core/state/manager.ts`.

### Hydration System
Hydration is the process of building a comprehensive JSON context for agents. It combines:
1. Interrogation answers.
2. Knowledge base (APIs, components, conventions from `/knowledge`).
3. Codebase analysis (existing components/services found via grep).

Logic resides in `src/core/hydration/builder.ts`.

---

## 🛠️ Development Workflow

### Setup
```bash
npm install
npm run build
```

### Watching for changes
```bash
npm run watch
```

### Adding a New Command
Use oclif's generator or create a new file in `src/commands/`:
```bash
npx oclif generate command my-new-command
```

---

## 📜 Coding Standards

1. **Type Safety**: Always define types in `src/types/index.ts`. Use Zod for runtime validation where possible.
2. **UI Consistency**: Use the helper functions in `src/ui/index.ts` for all terminal output. Avoid direct `console.log`.
3. **Error Handling**: Use `this.error()` for fatal errors and `fail()`/`warn()` from `src/ui` for non-fatal feedback.
4. **Git Operations**: Use the wrappers in `src/core/git/index.ts`.

---

## 🚀 Building for Production

To build the project:
```bash
npm run build
```

The plan includes distributing as a standalone binary via `pkg`. This is currently being configured.

---

## 🤝 Contributing

1. Create a feature branch.
2. Implement changes.
3. Add unit tests in `tests/unit`.
4. Ensure `npm test` passes.
5. Create a PR.
