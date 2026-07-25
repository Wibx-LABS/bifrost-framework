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

## Deferido (NÃO feito — precisa direção confirmada)

- Duplicatas JS legadas no root: `runtime/state-manager.js` + `core/agents/hydration/hydrate.js` (impls paralelas das versões TS reais em `tools/bifrost-cli/src/core/`). Deixadas até confirmar que nada as referencia (install.sh/ignition).
- Testes quebrados: `tests/` referenciam `buildHydration` (real = `writeHydrationFiles`) + módulos removidos. Precisam de fix/quarentena.
- Re-narrar agentes/skills às 3 tarefas reais (i18n, forms↔API, PR) + apontar knowledge layer pro FRONTEND_REPOSITORY_MANUAL / convenções Vizmos-Angular.
- Targeting Antigravity (dual-runtime): candidato a corte, sem demanda validada.
