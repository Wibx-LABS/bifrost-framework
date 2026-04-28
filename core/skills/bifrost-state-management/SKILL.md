# SKILL: Bifrost State Management

## FILE FORMAT
The state file MUST be named `STATE.md` and live in the `.bifrost/` directory.
It must use YAML front-matter for machine-readable fields.

## TIMELINE LOGGING
Every action taken by an agent must be logged in the Timeline section with an ISO timestamp.

## ARTIFACT TRACKING
All generated files must be listed in the Artifacts section with their path and the agent that created them.

## UPDATING
Use the `runtime/state-manager.js` utility whenever possible to ensure consistency.
