# CHANGES_VS_MAIN — diff categorizado da branch `rescope/vizmos-assistant`

> Tudo que esta branch muda vs `main`, por categoria, com o commit de cada mudança. Para o contexto e vereditos, comece por `TESTING_AREA.md` (raiz).

## A. Código do CLI (fazer compilar — Phase 0)

| Arquivo | Mudança | Por quê | Commit |
|---|---|---|---|
| `tools/bifrost-cli/src/index.ts` | −2 re-exports (`core/hydration/validator`, `core/agent/coordinator`) | módulos nunca construídos; barrel não compilava | `c7546f7` |
| `tools/bifrost-cli/tsconfig.json` | build compila só `src/` (exclui `tests/`) | testes quebrados não travam o build; jest roda à parte | `c7546f7` |
| `core/commands/` (8 arquivos) | **DELETADO** | ponte de slash-commands que eram stubs 0-byte/`console.log`, não referenciados — design abandonado (a ponte real é o sistema de skills) | `c7546f7` |

Resultado: `npm run build` verde; CLI executa (`bin/run.js --help`).

## B. Skills/agentes — os 7 fixes do piloto (commit `03bd093`)

| # | Fix | Arquivos | Defeito que mata |
|---|---|---|---|
| 1 | Proibir `NO_ERRORS_SCHEMA` em teste de critério de UI (regra §4.3.1 + espelho independente no QA) | `core/skills/bifrost-code-review/SKILL.md`, `core/skills/bifrost-qa-validator/SKILL.md` | C3: teste-teatro mascarando bindings quebrados (defesa em profundidade contra falha correlacionada) |
| 2 | Shared-file additive-diff rule (`// bifrost:add` com âncora; full-file = review FAIL) | `core/agents/templates/CodeGen_Template.md`, `core/skills/bifrost-code-standards/SKILL.md` | reconstrução full-file de store/i18n clobbaria o repo real |
| 3 | Pre-flight degradado (partial init: bootstrap STATE, deriva identidade — nunca Hard-Stop nos 2 casos observados) | `core/agents/templates/Intake_Template.md`, `core/agents/templates/Planner_Template.md` | init parcial estrangulava o ciclo |
| 4 | Ordem de autoridade (source > COMPONENT_LIBRARY > MANUAL > inferência) + **inferência de contrato = dependência BLOQUEANTE** | `core/skills/bifrost-graphify-ref/SKILL.md` | C1: assunção silenciosa de CVA (a causa raiz do run 1) |
| 5 | `bifrost-validate i18n-parity` — subcomando REAL (paridade de key-sets + detecção de valor vazio) | `scripts/bifrost-validate` | protege o MUST de i18n mecanicamente. Testado: fixtures igual→exit 0; key ausente→exit 1 nomeada; vazio→exit 1 |
| 6 | Honestidade: `api-calls`/`standards` viram `[SKIP]` explícito (eram stubs imprimindo `[OK]` falso); 5 referências a `api-calls` removidas das skills | `scripts/bifrost-validate`, Intake/Planner templates, qa-validator, `core/templates/TRAJECTORY.md` | citação de tooling inexistente = dívida de confiança |
| 7 | `knowledge/COMPONENT_CONTRACTS_TODO.md` — template+checklist 30min p/ confirmar contratos CVA/submit dos wrappers commonlib no source | novo arquivo | C1 definitivo — executável no 1º acesso ao repo Vizmos |

## C. Relatórios e análise (docs novos)

| Doc | O que é | Commit |
|---|---|---|
| `docs/planning/current-gap-2026-07.md` | estado vs plano de 10 fases + correção empírica ("a ponte existe; framework roda") | `6628d3a`, `a342fc8` |
| `docs/planning/pilot-internal-2026-07.md` | piloto run 1: rework 14%, os 7 fixes | `a8c7cca` |
| `docs/planning/pilot-internal-run2-gate-2026-07-30.md` | run 2: GATE PASSA (7%, zero false-PASS) | `3da1174` |
| `docs/planning/labs-context/` | posicionamento vs FORGE/GSD, tese afiada, realidade do Notion (cópias do LABS) | este commit |
| `RESCOPE_NOTES.md` | notas da exploração + premissos corrigidos (states não são duplicatas; testes→Fase 4) | `c7546f7`, `32b240f` |
| `TESTING_AREA.md` + este arquivo | porta de entrada + mapa do diff | este commit |

## D. Evidência (`docs/pilot-evidence/`)

- `run2/bifrost-artifacts/` — os 8 artefatos reais do ciclo run 2 (PATIENT byte-idêntico ao run 1, TRAJECTORY locked, PLAN 9 tasks, QA_REPORT com FAIL honesto, HANDOFF blocked).
- `run2/generated-code/` — o código Angular gerado (quartet do componente, slice NgRx, adapter/DTO, specs, i18n) — **note os `.bifrost-add`**: os 6 arquivos compartilhados saíram como diffs aditivos, a regra #2 funcionando.
- `run1-journal-extracts.md` — registro estruturado do run 1 (arquivos originais sobrescritos pelo reset; proveniência declarada).
- `probes-l2.md` — os 4 probes adversariais 4/4 PASS.

## O que NÃO mudou

`core/agents/templates/` (fora os 4 editados), os 9 skills (fora os 5 editados), `knowledge/` (fora o TODO novo), `runtime/`, `instructions/`, `docs/` originais (operation-bifrost, framework-spec, manuais) — intactos. `runtime/state-manager.js` + `core/agents/hydration/hydrate.js` MANTIDOS deliberadamente (camada de runtime dos hooks, não duplicatas — ver RESCOPE_NOTES).
