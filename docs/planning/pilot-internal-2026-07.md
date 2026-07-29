---
domain: operations
type: pilot-report
status: active
topic: bifrost/internal-pilot
---

# Bifrost — Piloto interno (2026-07-28)

> Dogfood: 6 subagentes rodaram as skills REAIS (@Intake→@Planner→@CodeGen→@QA→@Reviewer + um "Gabriel" reviewer) numa feature de teste ("Notification Preferences" = form + API + i18n, app account/Vizmos-Angular), contra as convenções reais em `knowledge/`. Responde a pergunta que decide o Bifrost: **as skills, como escritas, produzem código review-ready?**
>
> ⚠️ Simulação INTERNA (subagentes), não uma sessão Claude Code real no Vizmos com o Gabriel real. Código gerado contra os `knowledge/` docs (que têm lacunas), não contra o repo real. Os NÚMEROS são aproximados; os ACHADOS ESTRUTURAIS valem.

## Veredito

- **Rework: 14%** → **kill-switch: `iterate` (10-20%)** — acima do "<10% passa", abaixo do ">20% mata". **A tese se sustenta; as skills precisam de tuning, não de descarte.**
- **A PIPELINE COMO UM TODO passou no teste de confiança.** NÃO entregou PR quebrado rotulado PASS: o @QA pegou os 2 bugs críticos de UI, o @Reviewer honrou o FAIL e **recusou abrir o PR**, entregou um HANDOFF "blocked" honesto. **O self-check funcionou** — é exatamente o comportamento que faz a troca valer.
- **~80% do código era genuinamente review-ready** ("mergearia as-is"): NgRx (triad/reducer puro/selectors memoizados/switchMap-load+exhaustMap-save/success effect-gated), API (service-wrapped, api factory, sem URL hardcoded), i18n (paridade pt/en/es completa), code-standards. As skills `bifrost-state-management`/`api-integration`/`code-standards` = quase perfeitas.

## Onde quebrou (a lacuna real)

Um único seam: **o contrato componente↔template** (a UI interativa).
- **C1/C2 (must-fix):** os checkboxes foram ligados com `formControlName` contra um `app-checkbox` documentado como `[checked]/(checkedChange)` (suporte a ControlValueAccessor NÃO documentado); o botão Save não tem `(click)`. Resultado: load não reflete, save não persiste — 2 dos 5 MUSTs falham na UI.
- **Causa raiz = lacuna knowledge/skills, não desleixo:** `COMPONENT_LIBRARY.md` não diz se os wrappers commonlib (`app-checkbox`, `app-button`) suportam reactive-form/CVA/submit. O @CodeGen assumiu o ergonômico-mas-não-documentado e errou.
- **Falha correlacionada:** @CodeGen e @QA raciocinam dos MESMOS docs — se o doc estiver errado, os dois são enganados. E `bifrost-code-review` permitiu `NO_ERRORS_SCHEMA` no teste, mascarando o break (test theater: os 2 MUSTs não foram genuinamente verificados).

## Backlog acionável (o que move de `iterate` → `pass <10%`)

**Os 2 fixes que o Gabriel nomeou (confiança incondicional):**
1. **Documentar autoritativamente** em `COMPONENT_LIBRARY.md` o contrato reactive-form/CVA + submit de cada wrapper commonlib. ⚠️ **precisa do repo Vizmos real** (ler o source dos componentes).
2. **`bifrost-code-review`:** exigir teste de RENDERIZAÇÃO (proibir `NO_ERRORS_SCHEMA`) para qualquer critério de aceitação a nível de componente. ✅ **fix de skill, dá pra fazer sem o repo.**

**Fricção de skill achada pelos agentes (robustez, dá pra fazer sem o repo):**
3. **partial-init:** `Intake_Template` assume STATE.md/PROJECT_CONTEXT.md existentes; sem branch pra "PATIENT preenchido mas init não rodou". Adicionar fallback.
4. **PROJECT_CONTEXT.md:** obrigatório no read-order de @Intake/@Planner, sem fallback quando ausente.
5. **Tie-breaker do knowledge:** `app-toggle` aparece em FRONTEND_REPOSITORY_MANUAL mas não em COMPONENT_LIBRARY; `graphify-ref` não diz qual arquivo vence. Definir regra de precedência.
6. **CI aspiracional:** PLAN/TRAJECTORY referenciam `bifrost-validate api-calls` + "CI translation-key-parity" que não existem em `knowledge/`. Ou construir, ou parar de referenciar.
7. **Whole-file vs additive-diff:** @CodeGen entregou `store.ts` e os 3 i18n como arquivos INTEIROS (reconstrução do AppState existente) — aplicados literalmente, clobbariam o repo real. Skill deve exigir diffs aditivos (artefato de gerar-contra-repo-ausente, mas a regra vale).

## Conclusão

**Primeira evidência real de que o Bifrost funciona — encorajadora com condições.** A pipeline é confiável (gates funcionam, zero false-PASS), 80% review-ready, um seam quebrado bem-diagnosticado. Rework 14% = itere as skills; os fixes são específicos e conhecidos. O maior deles (#1, documentar os contratos commonlib) é a ponte pro repo Vizmos — a única coisa que ainda depende do TI de verdade.
