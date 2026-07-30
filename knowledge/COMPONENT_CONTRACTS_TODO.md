# COMPONENT_CONTRACTS_TODO — contratos commonlib a confirmar no source (fix #1 do piloto)

> **Por que existe:** o piloto interno (2026-07-28) provou que `COMPONENT_LIBRARY.md` documenta Inputs/Outputs mas NÃO os contratos de **reactive-form (ControlValueAccessor)** e **submit** dos wrappers — e a inferência silenciosa desse contrato foi a causa raiz dos 2 must-fix (C1/C2). Até isto ser preenchido, a regra de autoridade do `bifrost-graphify-ref` trata esses contratos como **não-confirmados → dependência bloqueante**.
>
> **Execução: ~30 min no primeiro acesso ao repo Vizmos.** Owner: quem tiver o clone (Backend/Gabriel ou Pedro com acesso). Depois de preencher, mover cada entrada pro `COMPONENT_LIBRARY.md` e apagar este arquivo.

## Checklist de execução (30 min)

1. `cd bifrost.frontends && ls libs/commonlib/src/lib/components/` — listar os wrappers reais.
2. Para CADA wrapper da tabela abaixo, abrir `<component>/<component>.component.ts` e responder:
   - Implementa `ControlValueAccessor` (procurar `NG_VALUE_ACCESSOR` nos providers)? → **CVA: sim/não**
   - Quais `@Input()`/`@Output()` existem DE VERDADE (nome + tipo)?
   - Se botão: emite `submit` nativo (`type="submit"` repassado ao `<button>` interno) ou só `(click)`?
3. Preencher a entrada, remover o `[CONFIRMAR-NO-SOURCE]`, colar exemplo mínimo de uso com reactive form.
4. Mover as entradas confirmadas pro `COMPONENT_LIBRARY.md` (seção do componente) e apagar este arquivo.
5. Rodar o probe de regressão: perguntar a @CodeGen "posso usar formControlName no app-checkbox?" — a resposta deve citar o contrato documentado, não inferir.

## Entradas a confirmar

### app-checkbox (`CheckboxComponent`)
- **Seletor:** `app-checkbox`
- **CVA (formControlName funciona?):** `[CONFIRMAR-NO-SOURCE]` — documentado hoje: `[checked]` / `(checkedChange)`; CVA desconhecido
- **Inputs reais:** `[CONFIRMAR-NO-SOURCE]`
- **Outputs reais:** `[CONFIRMAR-NO-SOURCE]`
- **Uso com reactive form (exemplo canônico):** `[CONFIRMAR-NO-SOURCE]` — se CVA=não, o padrão é `[checked]="form.value.x" (checkedChange)="form.get('x').setValue($event)"`

### app-button (`ButtonComponent`)
- **Seletor:** `app-button`
- **Submit (dispara ngSubmit do form?):** `[CONFIRMAR-NO-SOURCE]` — documentado hoje: `(click)`-driven; `[type]` é variante de ESTILO, não type nativo
- **Inputs reais:** `[CONFIRMAR-NO-SOURCE]`
- **Outputs reais:** `[CONFIRMAR-NO-SOURCE]`
- **Uso canônico em form:** `[CONFIRMAR-NO-SOURCE]` — se submit=não, o padrão é `(click)="onSave()"`

### app-toggle (`ToggleComponent`)
- **Status:** existe no MANUAL §6.1 mas AUSENTE do COMPONENT_LIBRARY.md (a contradição que o piloto achou)
- **Seletor / Inputs / Outputs / CVA:** `[CONFIRMAR-NO-SOURCE]` — tudo
- **Decisão pendente:** se confirmado, é o controle preferido pra on/off (vs app-checkbox)

### app-input (`InputComponent`) — preventivo
- **CVA:** `[CONFIRMAR-NO-SOURCE]` (mesma classe de risco; confirmar junto)

### app-select / app-dropdown — preventivo
- **Existe? Nome real? CVA?:** `[CONFIRMAR-NO-SOURCE]`

## Template pra novas entradas

```markdown
### app-<nome> (`<Classe>Component`)
- **Seletor:** app-<nome>
- **CVA:** sim/não (evidência: NG_VALUE_ACCESSOR em <arquivo>:<linha>)
- **Inputs:** [nome: tipo, ...]
- **Outputs:** [nome: tipo, ...]
- **Submit:** sim/não/n-a
- **Exemplo reactive-form:**
  \`\`\`html
  <!-- exemplo mínimo funcional -->
  \`\`\`
```
