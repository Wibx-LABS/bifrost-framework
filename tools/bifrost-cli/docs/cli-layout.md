# BIFROST CLI: Interface & Layout Design

**Objective:** To provide a premium, "hacker-aesthetic" ASCII interface that feels state-of-the-art while remaining perfectly clear for non-technical users.

---

## Screen 1: The Splash & Auto-Update
*Triggered on `bifrost init`. Performs the background handshake.*

```text
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

---

## Screen 2: Asset Discovery
*The CLI acknowledges the staging folder's contents.*

```text
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

---

## Screen 3: The "Big Split"
*The main interrogation menu.*

```text
    ? WHERE IS THE DESTINATION FOR THIS WORK?
    
    > [A] Existing Bifrost Surface (Dashboard, App, etc.)
      [B] New Standalone Project (From Zero)
      [C] Landing Page / One-off (Fast-Track)
    
    (Use arrow keys to select, press Enter)
```

---

## Screen 4: Path A (Existing Surface Selection)
*Mapping to the Monorepo Apps.*

```text
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

---

## Screen 5: Path B (The Deep Interview)
*Building the overview.md autonomously.*

```text
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

---

## Screen 6: Hydration Progress
*Setting up the Staging Area and AI training.*

```text
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

---

## Screen 7: Completion & Launch
*Final instructions for the user.*

```text
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
