# BIFROST CLI: Technical Architecture & Workflow Plan

**Version:** 1.0.0
**Status:** Initial Specification
**Role:** The "Intelligent Bridge" between Product and Engineering

---

## 1. Overview
The Bifrost CLI is a native Mac command-line utility designed to automate the setup of frontend development environments for the Product team. It handles the complexity of repository structures, technical manuals, and AI agent configuration, allowing the user to focus purely on functional requirements.

---

## 2. CLI Core Architecture

### 2.1 Distribution & Installation
*   **Command Name:** `bifrost`
*   **Installation:** One-time global installation (e.g., via `npm install -g` or a bootstrap shell script).
*   **Self-Update Mechanism:** 
    *   On every startup (e.g., `bifrost init`), the CLI performs a version check against the master registry.
    *   If an update is found, it automatically pulls and installs the latest binary/scripts.

### 2.2 Knowledge Sync (Background)
*   **The Global Cache:** The CLI maintains a hidden directory at `~/.bifrost-framework/`.
*   **Dynamic Pull:** It background-syncs the latest `bifrost-framework` Git repository (containing all Master Manuals and Agent Templates) to this cache.
*   **Effect:** The Product team always works with the latest engineering standards without manual action.

---

## 3. The Interrogation Process (bifrost init)

The `bifrost init` command is run inside a fresh feature folder. It executes the following logic to translate "Product Intent" into "Engineering Reality."

### 3.1 Structural Audit & Handshake
The CLI first scans the folder to build the foundation:
*   **Assets Check:** Confirms the presence of the `assets/` folder (The "Visual Source").
*   **Instruction Check:** Confirms `assets_instruction.md` is present (The "Design & Content Rules").
*   **Manual Handshake:** Synchronizes the latest engineering standards from the central repository.

### 3.2 The Functional Interview (The "Big Split")
The CLI conducts a non-technical interview. It asks for the **"Destination"** and the **"Goal,"** then maps those answers to the structure defined in the **Bifrost Frontend Manual**.

#### **Choice A: Existing Bifrost Surface (Standard Ecosystem)**
*Used for adding features to our existing dashboards and apps.*

1.  **Select the Destination:** "Where will this feature live?"
    *   `Merchant Platform` (Maps to the **Business** application)
    *   `User Profile & Security` (Maps to the **Account** application)
    *   `Shopping & Products` (Maps to the **Shopping** application)
    *   `Token Go Game` (Maps to the **Token Go** application)
2.  **Determine the Scope:** "What are we building?"
    *   `A New Section/Page` (Directs the AI to the **Containers** folder for new screen creation).
    *   `An Update to an Existing Section` (Asks for the name of the section, e.g., 'Finance' or 'Rewards', to target the specific sub-folder).
    *   `A Reusable Tool` (Directs the AI to the **Common Library** for elements used across all apps).
3.  **Data & Logic Requirements:** "Does this feature need to handle or save information?"
    *   `Yes (Save/Connect)` → Hydrates the AI with **State Management** and **API Service** guardrails.
    *   `No (Visual Only)` → Keeps the focus on UI and styling components.

#### **Choice B: New Standalone Project (From Zero)**
*Used when no documentation exists. The CLI's job is to extract the vision and **build the `overview.md`**.*

1.  **Project Identity:** "What is the name and primary goal of this project?"
2.  **Functional Blueprint:** "List the 3-5 most important actions a user must be able to take."
3.  **External Integrations:** "Does this require external services like Maps, Payments, or Login?"
4.  **Final Action:** The CLI writes the `overview.md` based on these answers and prepares the folder.

#### **Choice C: Standalone Project / One-off (Asset-Sovereign)**
*The broadest option. Used for any project—from simple tools to mini-apps—where the instructions and assets are already provided in the folder.*

1.  **Functional Label:** "What are we building? (e.g., Internal Tool, Prototype, Promotional Page, Service)."
2.  **Asset Sovereignty:** The CLI acknowledges that the local `assets/` and `assets_instruction.md` are the absolute source of truth for the "What" and the "How." 
3.  **Final Action:** The system points the AI Agent to the provided files and loads "Universal Engineering Standards" (Clean Code, Performance, Responsive Design) to ensure a high-quality result regardless of the project type.

### 3.3 Virtual Mirroring & Context Injection
The CLI takes the interview results and "Hydrates" the environment. It tells the AI Agent:
*   **Where to work:** (e.g., "Assume the base path is `apps/business/src/app/containers`").
*   **Which rules to follow:** (e.g., "Use the established Bifrost Naming Conventions and Material Design tokens").
*   **Which assets to use:** (e.g., "Follow the instructions in `assets_instruction.md` for all visual elements").

---

## 4. Hydration & AI Training

Once the context is established, the CLI "Hydrates" the environment:

### 4.1 Local Folder Preparation
*   Creates a `.bifrost/` directory.
*   Populates it with **Hydrated Agents**: Templates where placeholders like `{{TARGET_PATH}}` and `{{STACK_RULES}}` are replaced with real data from the Manual.
*   Initializes `STATE.md` to track development progress.

### 4.2 AI Skill Injection
*   The CLI installs these hydrated agents directly into the user's AI tool configuration (e.g., `~/.claude/skills/` or `~/.antigravity/skills/`).
*   **Result:** The AI is now "trained" on this specific project’s rules, assets, and target repo structure.

---

## 5. Guardrails & Perfect Delivery

### 5.1 Pre-Commit Policies
*   The CLI installs Git hooks into the feature folder.
*   **Enforcement:** These hooks run the `@QA` agent against the code to ensure it matches the `overview.md` and follows the naming conventions in the Manual.

### 5.2 The Transplant Package
*   On completion (`bifrost deliver`), the CLI generates a **Transplant Package**.
*   **Contents:** The generated code + a `HANDOFF.md` with instructions for the Backend developer on exactly where to merge/paste the files in the actual frontend repository.

---

## 6. Success Metrics
*   **Zero-Technicality:** Product members never see a config file or a framework version.
*   **Perfect Setup:** Feature initialization takes < 2 minutes.
*   **Perfect Delivery:** Code review fixes from Backend developers drop to < 5%.
