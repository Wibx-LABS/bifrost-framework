# Branch `rescope/vizmos-assistant` — notas de exploração

> **Branch exploratória, reversível.** Direção do Bifrost ainda não confirmada (decisão do Pedro). A `main` fica intacta; se este caminho for descartado, apaga-se a branch.

## Contexto (análise completa mora no workspace LABS)

`ARSENAL/BIOFROST/_pesquisa/` no LABS:
- `posicionamento_vs_forge_gsd.md` — Bifrost vs FORGE+GSD (veredito revisado: continuar-afiado).
- `bifrost_tese_afiada.md` — tese: ponte Produto↔TI no stack real, aprende dos dois lados.
- `rescope/REALIDADE_notion.md` — **a realidade** (Notion + este repo): Bifrost = assistente PRÁTICO de frontend (traduções pt/en/es, forms↔API, criação de PR c/ aprovação do Gabriel), GSD-inspired, alvo = **Vizmos (Angular, Nx monorepo)**. As convenções reais estão em `knowledge/FRONTEND_REPOSITORY_MANUAL.md` (este repo), não no Notion.

## Phase 0 — feito nesta branch (fazer compilar)

- `tools/bifrost-cli/src/index.ts`: removidos 2 re-exports de módulos nunca construídos (`core/hydration/validator`, `core/agent/coordinator`) que quebravam o build.
- `tools/bifrost-cli/tsconfig.json`: build compila só `src/` (testes rodam via jest à parte, não travam o build).
- Apagado `core/commands/` — ponte de slash-commands que eram stubs de 0 byte / `console.log`, não referenciados.
- **Resultado:** `npm run build` verde (`dist/index.js` gerado).

## Correções à execução (2026-07-27) — o plano do painel tinha 2 premissos errados

1. **"Dedup das 3 impls de state" = VOID.** NÃO são duplicatas: `runtime/state-manager.js` se auto-documenta "Runtime Version — used by git hooks and standalone scripts" (JS puro, sem deps), referenciado por `runtime/hooks/pre-commit.sh` + `scripts/bifrost-validate`; `core/agents/hydration/hydrate.js` + `injection-points.json` referenciados pelos templates de agente. São a **camada de runtime que o framework instala nos projetos**, distinta do TS interno do CLI (`tools/bifrost-cli/src/`). Deletar quebraria hooks/validate/hidratação. **Mantidos.** (DRY real de lógica de STATE existe entre as camadas — fix próprio seria gerar o JS do TS, mas é design-change, não higiene.)
2. **Testes (`tools/bifrost-cli`): 9/10 suítes quebradas**, acopladas ao design pré-rescope (comandos importam `validator`/`coordinator` nunca construídos; `buildHydration`→`writeHydrationFiles`; arg drift). Consertar agora = testar código que a Fase 4 reescreve. **Reconstrução dos testes movida PARA a Fase 4** (contra a API real dos comandos/bridge). Só `state.test.ts` passa hoje.

## Deferido (NÃO feito — precisa direção confirmada)

- Duplicatas JS legadas no root: `runtime/state-manager.js` + `core/agents/hydration/hydrate.js` (impls paralelas das versões TS reais em `tools/bifrost-cli/src/core/`). Deixadas até confirmar que nada as referencia (install.sh/ignition).
- Testes quebrados: `tests/` referenciam `buildHydration` (real = `writeHydrationFiles`) + módulos removidos. Precisam de fix/quarentena.
- Re-narrar agentes/skills às 3 tarefas reais (i18n, forms↔API, PR) + apontar knowledge layer pro FRONTEND_REPOSITORY_MANUAL / convenções Vizmos-Angular.
- Targeting Antigravity (dual-runtime): candidato a corte, sem demanda validada.
