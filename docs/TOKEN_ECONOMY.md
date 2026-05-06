# Token Economy in Bifrost

Bifrost uses three mechanisms to optimize token usage:

1. **Output Compression (caveman-lite):** Reduce narrative bloat in STATE.md, VITALS.md, HANDOFF.md
2. **Smart Codebase Queries (Serena-equivalent):** Find symbols without loading entire files
3. **Model Routing:** Use reduced-cost model for execution phases

## Skills

- `bifrost-caveman-lite`: Compress output
- `bifrost-caveman-review`: Structured code review
- `bifrost-codebase-query`: Efficient symbol searching

## How It Works

@Conductor writes STATE.md in caveman-lite → 30-35% size reduction
→ When @Intake reads STATE.md next phase, same context fits more logic
→ Less context rot, higher quality code generation

## Optional: Plugin Integration

If Serena plugin available: `bifrost-codebase-query` will use `find_symbol` (more efficient)
If Superpowers plugin available: agents can reference `/brainstorming`, `/execute-plan` (optional)

Framework works fine without plugins — they're optional overrides.
