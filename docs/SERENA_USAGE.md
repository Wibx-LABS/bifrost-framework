# Serena Plugin Usage — Bifrost

## Install Serena
```bash
# Claude Code
/install-plugin https://claude.com/plugins/serena
```

## Commands (Available in Agent Context)

- `find_symbol "Name"` → locate definition
- `find_referencing_symbols "Name"` → find call sites
- `insert_after_symbol "Name" "code"` → inject code after symbol

## When Bifrost Uses Serena

- `Intake` during `/bifrost:plan` → codebase exploration
- `CodeGen` during `/bifrost:build` → existing pattern lookup
- `Reviewer` during `/bifrost:review` → cross-file impact analysis

## If Serena Unavailable

Bifrost falls back to grep. Framework still works, just ~30% slower on large repos.
