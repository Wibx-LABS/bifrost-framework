# ⚠️ TESTING AREA — branch `rescope/vizmos-assistant`

> **Esta branch é uma ÁREA DE TESTES exploratória. NÃO MERGEAR na `main` sem decisão explícita do Pedro.** Ela contém o re-scope do Bifrost validado por 2 pilotos internos medidos + 7 fixes de skill + a evidência completa. Este arquivo é a porta de entrada para qualquer agente/humano analisar a branch sem contexto prévio.

## O que esta branch é

O Bifrost (assistente de dev frontend Product↔TI para o monorepo Vizmos-Angular — ver `docs/planning/operation-bifrost.md`, a fonte canônica do nicho) estava meio-cabeado na `main`: CLI não compilava, skills nunca testadas ponta-a-ponta. Nesta branch: o CLI compila, as skills foram exercitadas por 2 pilotos internos completos (subagentes rodando as skills REAIS numa feature Angular), 7 defeitos de skill foram achados/corrigidos/re-testados, e o gate final passou.

## Vereditos (a história em 1 tabela)

| Etapa | Resultado | Evidência |
|---|---|---|
| Piloto run 1 (skills originais) | rework **14%** `iterate`; 3 must-fix (C1 CVA silencioso, C2 botão morto, C3 teste-teatro); pipeline honesta (QA pegou, Reviewer recusou PR) | `docs/planning/pilot-internal-2026-07.md` + `docs/pilot-evidence/run1-journal-extracts.md` |
| 7 fixes de skill (plano tot-h) | aplicados | commit `03bd093` + `docs/CHANGES_VS_MAIN.md` |
| Probes L2 (cenários-armadilha exatos) | **4/4 PASS** | `docs/pilot-evidence/probes-l2.md` |
| Piloto run 2 (byte-comparável, skills corrigidas) | rework **7%** **`pass_<10`**; C1/C2/C3 AUSENTES; zero false-PASS; FAIL honesto com Hard Stop | `docs/planning/pilot-internal-run2-gate-2026-07-30.md` + `docs/pilot-evidence/run2/` |

## Ordem de leitura (do veredito ao detalhe)

1. `docs/planning/pilot-internal-run2-gate-2026-07-30.md` — o gate final (comece aqui).
2. `docs/planning/pilot-internal-2026-07.md` — o baseline e os 7 fixes.
3. `docs/CHANGES_VS_MAIN.md` — todo o diff vs main, categorizado por commit.
4. `docs/pilot-evidence/` — a evidência bruta (artefatos, código gerado, journals).
5. `docs/planning/labs-context/` — o PORQUÊ (posicionamento vs FORGE/GSD, tese, realidade do Notion).
6. `docs/planning/current-gap-2026-07.md` + `RESCOPE_NOTES.md` — estado vs plano de 10 fases + notas da exploração.

## Snapshot de verificação (2026-07-30, real, nesta branch)

```
$ cd tools/bifrost-cli && npm run build      → exit 0 (tsc limpo, dist/ emitido)
$ node bin/run.js --help                     → CLI executa (@bifrost/cli 1.0.0, 5 comandos)
$ npx jest                                   → Test Suites: 9 failed, 1 passed, 10 total
                                               Tests: 12 failed, 24 passed, 36 total
```

**Sobre os 9 suites quebrados (conhecido, deferido):** testam o design PRÉ-rescope (importam módulos nunca construídos `validator`/`coordinator`; API antiga `buildHydration`). Reconstrução deliberadamente movida pra depois da direção confirmada — ver `RESCOPE_NOTES.md`. Só `state.test.ts` reflete código atual (verde).

## Como re-rodar os testes desta área

- **i18n-parity (código real):** `node scripts/bifrost-validate i18n-parity <dir-com-jsons>` — fixtures documentadas em `docs/CHANGES_VS_MAIN.md` (fix 5).
- **Probes L2 (comportamento de skill):** dar a um agente o cenário de `docs/pilot-evidence/probes-l2.md` + a skill correspondente; a regra deve segurar.
- **Re-piloto (caro, ~1M tokens):** seed `.bifrost/PATIENT.md` (byte em `docs/pilot-evidence/run2/bifrost-artifacts/PATIENT.md`) num workspace vazio; rodar @Intake→@Planner→@CodeGen→@QA→@Reviewer com as skills de `core/`; medir rework com um reviewer adversarial.

## Pendências (o que esta branch NÃO prova)

1. **Execução sob toolchain real** — nenhum teste gerado foi executado (workspace do piloto sem node_modules/nx). O FAIL honesto do QA existe por isso. **Validação final = 1 run no clone real do Vizmos** + executar `knowledge/COMPONENT_CONTRACTS_TODO.md` (~30 min com o repo).
2. **Backlog run 3** (achados do run 2): censo mecânico de seams `[CONFIRMAR-NO-SOURCE]` (1 escapou: `toPayload`), dono do E2E (contradição PLAN×QA_Template), manual §13 exemplo Allman errado, naming split Vizmos/Wiboo/Token, `COMPONENT_CONTRACTS_TODO` na read-list do Intake, pre-flight degradado p/ templates não-hidratados, reconciliar posse do STATE.md, bullet-IDs no TRAJECTORY.
3. **Decisão de direção** — a própria existência do re-scope aguarda confirmação do Pedro (por isso branch, não main).

## Contexto LABS (fora deste repo)

Blackboards dos painéis de planejamento: `LABS/99_archive/logs_workspace/bifrost_*.md`. Análises originais: `LABS/ARSENAL/BIOFROST/_pesquisa/` (cópias-chave em `docs/planning/labs-context/`).
