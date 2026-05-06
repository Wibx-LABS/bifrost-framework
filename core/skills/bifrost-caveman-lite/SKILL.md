---
name: bifrost-caveman-lite
description: Output compression for inter-agent artifacts. Produce prose in caveman-lite format — no articles, no filler, fragments OK, technical terms untouched.
---

# bifrost-caveman-lite SKILL

When invoked, follow this protocol to compress output:

## Rules

- **Remove:** articles (a, an, the), filler (just, really, basically, actually, simply), pleasantries (sure, certainly, happy to), hedging (might, could be, may)
- **Keep:** technical terms exact, function names, API names, variable names, code blocks as-is, numbers, dates
- **Okay:** fragments, short words, abbreviations where unambiguous (DB, API, auth)

## Pattern Examples

| Before (Prose) | After (caveman-lite) |
|---|---|
| "The system successfully validates the user input by checking if it matches the required schema." | "Input validation: check against schema." |
| "It's important to note that the database connection might timeout after 30 seconds." | "DB connection timeout: 30s. Review if appropriate." |
| "We need to make sure that the API response includes error handling for missing fields." | "API response: add error handling for missing fields." |

## When to Revert to Prose

**Auto-clarity rule:** If compression creates technical ambiguity, revert to full prose for that section only. Resume caveman-lite after.

Never compress:
- Security findings (explain threat)
- Irreversible action confirmations (drop, delete, schema change)
- Instructions where order matters (step 1 → step 2 → step 3)

## Example: STATE.md Production

Before compression:
```
## Phase 1: API Integration
The system has successfully completed all API endpoint definitions. 
Each endpoint has been implemented with proper validation.
There are currently two issues that need to be resolved.
```

After compression:
```
## Phase 1: API Integration
API endpoints: defined, validated. 2 blockers pending.
```

## Invocation

In agent templates:
```
Use bifrost-caveman-lite skill: compress output before writing to STATE.md, VITALS.md, or HANDOFF.md.
```
