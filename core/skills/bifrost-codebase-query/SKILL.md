---
name: bifrost-codebase-query
description: Efficient codebase introspection via symbol search (Serena-first) with grep fallback.
---

# bifrost-codebase-query SKILL

When querying codebase to find existing code, APIs, components, or patterns:

## Priority Protocol (Serena-First with Fallback)

### Step 1: Symbol Search

**Primary (Serena Plugin):**
If available, invoke Serena:
```
Use Serena: find_symbol "ComponentName"
Returns: path:line — symbol — definition type
Example: src/services/email.ts:15 — EmailService — class, orchestrator
```

**Fallback (Grep):**
If Serena unavailable:
```bash
grep -rn "^class ComponentName\|^export.*ComponentName\|^function ComponentName\|^const ComponentName.*=" src/
```

**Verify:** Both return same data (location + symbol name). Use whichever available.

### Step 2: Reference Search

**Primary (Serena Plugin):**
```
Use Serena: find_referencing_symbols "ComponentName"
Returns: [path:line, path:line, ...] — all call sites
```

**Fallback (Grep):**
```bash
grep -rn "ComponentName" src/ | grep -v "^class ComponentName\|^export.*ComponentName"
```

**Verify:** All references identified without loading files.

### Step 3: Targeted File Load

Load only files from steps 1-2:
```
Load: src/services/email.ts (definition, ~30 lines around symbol)
Load: src/features/notifications.ts (call site, ~10 lines around reference)
Load: src/api/routes.ts (call site, ~10 lines around reference)
→ Total: ~100 lines of context needed
```

**Avoid:** Loading entire directories. Load specific lines only.

## Cost Comparison

| Method | Tokens | Speed | Result |
|--------|--------|-------|--------|
| Full file load (old way) | 1200+ | Slow | Complete context bloat |
| Serena symbol search | 100-200 | Instant | Exact definition + references |
| Grep symbol search | 300-400 | Fast | Exact definition + references |
| **Savings (Serena vs full)** | **~90%** | **10x faster** | Same data, optimized |

## When Symbol Search Doesn't Apply

- Feature is brand new (no prior reference in codebase)
- Refactoring existing code (must load full context to understand scope)
- Architecture investigation (need cross-file understanding)

In these cases: Load files intentionally, document why.

## Plugin Detection

**At runtime, agent checks:**
1. Is Serena plugin installed?
2. If yes → use `find_symbol`, `find_referencing_symbols`
3. If no → fall back to grep commands
4. Both code paths produce identical results; plugin only changes speed

**Result:** Framework works with or without Serena. Plugin is optional performance enhancer.
