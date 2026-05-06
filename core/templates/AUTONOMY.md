# AUTONOMY.md

## MODEL ROUTING (Optional)

Cost optimization. By default, all phases use premium model.

To enable reduced-cost model (GLM) for execution:

```yaml
model_routing:
  planning: premium        # @Intake, @Planner — reasoning required
  execution: reduced-cost  # @CodeGen — follows plan
  qa: premium              # @QA — judgment calls
  delivery: reduced-cost   # @Conductor — routine state management
```

Omit to keep all phases on premium (default).

**Setup required:** z.ai API credentials in environment or `.bifrost/config.json`.
**Fallback:** If GLM unavailable, automatically use premium (no interruption).

**Cost impact:** Execution phases ~70% cheaper with reduced-cost model.
