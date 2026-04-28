# @bifrost/cli

Bifrost CLI is the orchestration engine for the Bifrost framework. It manages the feature development lifecycle, coordinates AI agents, and ensures architectural consistency across the Bifrost ecosystem.

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Token-LABS/bifrost-framework.git
cd bifrost-framework/tools/bifrost-cli

# Install dependencies and build
npm install
npm run build

# Link for global use (optional)
npm link
```

### Usage

1. **Initialize a feature**:
   ```bash
   bifrost init
   ```
   Follow the interactive "Interrogation" to define your feature scope and path.

2. **Start the workflow**:
   ```bash
   bifrost start
   ```
   This triggers the `@Intake` agent to analyze your scope and produce an `IMPACT.md`.

3. **Check status**:
   ```bash
   bifrost status
   ```

4. **Review agent outputs**:
   ```bash
   bifrost review
   ```

5. **Deliver the feature**:
   ```bash
   bifrost deliver
   ```

---

## 🏗️ Architecture

The CLI is built using:
- **oclif**: Command-line framework.
- **Enquirer**: Interactive prompts.
- **Zod**: Schema validation for state and hydration.
- **Nx**: Monorepo management.

### Directory Structure

- `src/commands/`: Command implementations (`init`, `start`, `status`, `review`, `deliver`).
- `src/core/`: Business logic for state management, hydration, and agent coordination.
- `src/ui/`: Terminal UI components and formatting.
- `src/types/`: TypeScript definitions for all Bifrost entities.

---

## 🛠️ Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed information on architecture, contributing, and adding new commands.

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for unit, integration, and manual testing instructions.

```bash
# Run all tests
npm test
```

---

Built with ❤️ by **Token Labs**
