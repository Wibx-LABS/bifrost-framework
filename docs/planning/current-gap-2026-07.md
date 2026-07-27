---
domain: operations
type: status-report
status: active
topic: bifrost/current-gap
---

# Bifrost — Estado atual vs plano (2026-07-27)

> Atualiza `project-state-next-steps.md` (abril, "blocking on Pedro"). O framework FOI construído desde então (Fases 1-2), mas está **meio-cabeado**. Gap medido contra `instructions/04-IMPLEMENTATION-PLAN.md` (10 fases). Inventário do código, não re-derivação.

## Resumo em uma linha

Agentes + skills + init existem (Fases 1-2 ~ok). **O que falta é fazer RODAR de ponta a ponta** (Fase 4 — a ponte `/bifrost:*` não existe) e **provar no piloto** (Fase 9 — o gate de validação, rework <10%). O resto pende em cima disso.

## Gap por fase

| Fase | Deliverable | Estado |
|---|---|---|
| **1 Core** | 7 agentes (`core/agents/`), 9 skills (`core/skills/`), init.ts (18.9K), hydration | ✅ construído |
| **2 Skill integration** | installer (`skills/installer.ts`), `/bifrost:help` | 🟡 installer ok; `/bifrost:help` ausente |
| **3 Knowledge graph** | graph.json, loader vivo, @Intake consulta APIs | ❌ **sem graph.json; loader morto**; skill graphify-ref escrita mas não semeada |
| **4 Workflow commands** | `/bifrost:*` start/plan/build/qa/deliver/status/rounds + ponte p/ agentes | ❌ **CRÍTICO: a ponte não existe** (eram stubs 0-byte, apagados na Phase 0). CLI tem init/start/status/review/deliver (5) — **falta plan/build/qa/rounds**; não roda o ciclo |
| **5 State + git hooks** | state-manager, pre-commit, schemas (patient/plan/health) | 🟡 state-manager existe (3 impls duplicadas); pre-commit.sh existe; **schemas ausentes** |
| **6 CI/CD** | workflows + `bifrost-validate` CLI | 🟡 workflows presentes (bifrost-build/merge/qa.yml); `scripts/bifrost-validate` existe — **não verificado que roda** |
| **7 Docs + 3 exemplos** | QUICKSTART, refs, 3 exemplos rodáveis | 🟡 docs abundantes; **exemplos = só EXAMPLES.md** (os 3 rodáveis não existem) |
| **8 Métricas** | metrics.js real, `bifrost-metrics` | ❌ **metrics.js é stub** (703 bytes) |
| **9 Piloto** | 1 feature real ponta-a-ponta, rework <10% | ❌ **NUNCA rodou — é o gate de validação** (kill-switch >20%) |
| **10 Rollout** | estável, time treinado, todas features no Bifrost | ❌ não iniciado |

## O caminho crítico (a ordem que a fonte impõe)

1. **Fase 4 — fazer rodar.** Sem a ponte `/bifrost:*` → agentes, nada do resto importa (não dá pra buildar feature nenhuma). É o "meio-cabeado" central. Inclui: construir os comandos faltantes (plan/build/qa/rounds) e a ponte que invoca os agentes dentro do Claude Code/Antigravity.
2. **Fase 3 — knowledge graph.** Semear graph.json + ligar o loader, senão @Intake/@CodeGen geram sem conhecer as APIs/componentes reais do Vizmos.
3. **Fase 9 — piloto.** 1 feature real, medir rework. É o teste honesto que o próprio repo define (>20% mata o programa).

## Higiene herdada (branch `rescope/vizmos-assistant`)

- Phase 0 FEITA: CLI compila (removidos barrel re-exports mortos + apagado `core/commands/` stub).
- Pendente: dedup das 3 impls de state (`runtime/state-manager.js`, `core/agents/hydration/hydrate.js` vs `src/core/state/manager.ts`); consertar testes quebrados; decidir targeting Antigravity.

## O que NÃO falta

Fase 1 está sólida: os 7 agentes e 9 skills estão escritos e sérios; o init/hydration é real. O design inteiro (Fases 1-10) está documentado. O buraco é **execução da Fase 4 pra frente**, não design.
