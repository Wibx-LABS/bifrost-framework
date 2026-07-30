---
domain: operations
type: pilot-report
status: active
topic: bifrost/internal-pilot-run2
---

# Bifrost — Piloto interno RUN 2 (gate dos fixes) — 2026-07-30

> Re-run byte-comparável do piloto (mesmo PATIENT.md md5 `b98b480a...`, mesmo shape só-PATIENT, mesmos 6 papéis) contra as skills CORRIGIDAS (commit `03bd093`, os 7 fixes). Critério composto do plano tot-h: rework <10% OU must-fix 100% capturados pré-handoff; zero false-PASS. Probes L2 4/4 PASS antes deste run.

## Veredito: GATE PASSA

| Métrica | Run 1 (baseline) | Run 2 (skills corrigidas) |
|---|---|---|
| **Rework** | 14% (`iterate`) | **7% (`pass_<10`)** |
| Review-ready | false | **true** |
| False-PASS | (C3 teatro) | **0** |
| Must-fix capturados pré-handoff | não (C1/C2 chegavam como surpresa) | **sim** (pré-diagnosticados com fix prescrito) |
| Surpresa descoberta pelo reviewer | C1+C2+C3 | ~0,7% (10 linhas, 1 seam não-marcado) |

## Os seams exatos do run 1 — todos ausentes

- **C1 (formControlName em CVA não-documentado):** AUSENTE — a regra de autoridade + COMPONENT_CONTRACTS_TODO tornaram a inferência estruturalmente impossível; `app-checkbox` ligado só ao contrato documentado (`[checked]/(checkedChange)`; grep confirma zero formControlName no source).
- **C2 (Save sem click):** AUSENTE — `app-button (click)→onSave()`, assertado pelo botão RENDERIZADO no spec.
- **C3 (NO_ERRORS_SCHEMA teatro):** AUSENTE — spec importa CommonlibModule real, asserta por children renderizados; QA grepa por escapes de schema independentemente.
- **Clobber de store/i18n:** AUSENTE — as 6 edições em arquivos compartilhados saíram como diffs aditivos `bifrost:add` ancorados com "do-NOT-replace".
- **Comportamento novo:** contratos não-confirmados viraram dependências bloqueantes nomeadas com dono; o QA re-verificou independentemente (achou o bug real M1 + drift de contagem) e rendeu **FAIL honesto com Hard Stop** — nenhum PR aberto, STATE segurado. O run 1 tinha dado PASS falso confiante.

## Achados novos (backlog run 3)

1. **Seam-marking não é mecânico** (o único escape): `ErrorHandlingService.toPayload()` — método commonlib inventado SEM `[CONFIRMAR-NO-SOURCE]` (2 de 3 seams foram marcados; este escapou). Fix: censo mecânico — grep de todo método invocado em import commonlib contra o knowledge, nos checklists de code-review E qa-validator.
2. **Contradição E2E:** PLAN atribui E2E ao @QA; QA_Template proíbe @QA escrever teste. Decidir dono (root cause do M2).
3. **Manual §13 auto-contraditório:** declara Allman mas o exemplo mostra K&R como correto.
4. **Naming split:** Vizmos/Wiboo/Token/Bifrost-Frontends = mesmo universo re-derivado por cada agente; o PROJECT_CONTEXT.md (ausente) é exatamente o arquivo que resolveria.
5. `COMPONENT_CONTRACTS_TODO.md` não está na lista de leitura do Intake_Template (foi lido por sorte do prompt).
6. Pre-flight degradado não cobre "templates de artefato não-hidratados" (recuperado por inferência; codificar).
7. Reconciliar "STATE.md é do @Conductor" vs Steps que mandam @Intake/@Planner escreverem nele; TRAJECTORY sem bullet-IDs endereçáveis (Planner inventou legenda).

## Ressalva load-bearing (honestidade do Gabriel)

Este run **nunca provou a pipeline sob toolchain funcionando** (0/32 testes executados — workspace sem node_modules/nx; pré-surfaced como Critical/FAIL, por isso o Hard Stop). **A validação final exige 1 run no clone real do Vizmos** (fecha também o C1 via COMPONENT_CONTRACTS_TODO, ~30 min). Até lá: framework validado em disciplina e honestidade, não em execução real.

## Conclusão

Ciclo fix→teste completo: 7 fixes → L1 verde → L2 4/4 → **L3 gate PASSA (14%→7%)**. As skills corrigidas mudaram o comportamento exatamente nos seams que falharam, e o modo de falha residual é contido (morre em tsc, não merge silencioso). Próximo passo que destrava tudo: o run no repo Vizmos real.
