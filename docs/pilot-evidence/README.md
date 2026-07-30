# pilot-evidence — evidência bruta dos pilotos internos

O que cada coisa é, de onde veio, o que prova:

- **`run2/bifrost-artifacts/`** — os 8 artefatos do ciclo de vida do piloto run 2 (2026-07-30), produzidos pelos agentes rodando as skills REAIS de `core/` (pós-fixes `03bd093`). Resgatados do workspace efêmero do piloto. Prova: o ciclo completo @Intake→@Reviewer com TRAJECTORY locked, QA FAIL honesto e HANDOFF blocked (nenhum false-PASS).
- **`run2/generated-code/`** — o código Angular que o @CodeGen gerou (feature Notification Preferences). NÃO é código do framework — é OUTPUT de teste, read-only. Os `.bifrost-add` são a regra de additive-diff em ação (arquivos compartilhados nunca full-file).
- **`run1-journal-extracts.md`** — registro estruturado do run 1 (baseline 14%). Os arquivos originais do run 1 foram sobrescritos pelo reset byte-comparável; isto é o que o journal preservou (proveniência declarada no cabeçalho).
- **`probes-l2.md`** — os 4 probes adversariais pós-fix (4/4 PASS), extraídos do journal.

Vereditos consolidados: `../planning/pilot-internal-2026-07.md` (run 1) e `../planning/pilot-internal-run2-gate-2026-07-30.md` (run 2/gate).
