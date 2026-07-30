# Bifrost — Tese afiada + stack alvo (2026-07-23)

> Canoniza a reframe do attending (ver `posicionamento_vs_forge_gsd.md §8`). Substitui o "absorver". Bifrost **continua**, com escopo estreito.

## 1. Tese

**Bifrost = a ponte especializada Produto↔TI de entrega de features, travada no stack real da empresa, que aprende dos dois lados.**

- **Escopo estreito** (o fosso, não fraqueza): NÃO é um FORGE genérico. Só a passagem Produto→implementação-com-qualidade-de-TI (e feedback de volta).
- **As duas pontas:** **Produto ↔ TI** (times da empresa). **LABS só CONSTRÓI a ponte** — não é ponta; é o fornecedor/mantenedor da ferramenta.
- **"Diminuir as possibilidades":** trava nos frameworks que a empresa de fato usa (§2). Nada genérico.
- **Aprende dos dois lados:** (a) **skills auto-extensíveis** (bifrost-hr/ADR-009 — detecta gap, cria/estende skill sob aprovação) + (b) **feedback por entrega** (captura o que o TI corrigiu na revisão — "Backend vira reviewer" — e o que o Produto ajustou, pra melhorar o próximo PR). Loop de aprendizado por PR.

## 2. Stack alvo (imagem "Migração de código Base", 2026-07-23)

| Camada | Stack | Nota |
|---|---|---|
| Cloud & DevOps | **AWS** | |
| Observabilidade | Prometheus, Grafana, CloudWatch | |
| **Frontend** | **Angular + NativeScript → MIGRANDO para Expo (React Native) + Storybook** | ⚠️ ver §3 |
| Backend | **TypeScript + Node.js** | |
| Banco | PostgreSQL + Redis + Amazon (RDS/Aurora) | |
| Blockchain | Ethereum + Hyperledger Fabric → Ethereum pública-privada | migração |

## 3. ⚠️ Achado crítico: Bifrost está preso no stack que está sendo aposentado

O código atual do Bifrost é **domain-locked em Angular/NgRx/Material** (o mapa confirmou, e o FRONTEND_REPOSITORY_MANUAL do Caio é Angular). Mas a empresa está **migrando o frontend Angular → Expo/Storybook.**

Consequência: **afiar o Bifrost não é só cabear a ponte stub — é re-mirar o alvo.** Construir/consertar o Bifrost pra Angular agora = investir no stack que está de saída. A prioridade real:
1. Bifrost tem que mirar o **stack novo** (Expo + Storybook no front; TS/Node no back; AWS/Postgres/Redis na infra).
2. O que era "knowledge layer Angular" (TECH_STACK/COMPONENT_LIBRARY/NAMING/GOTCHAS) precisa ser **reescrito pro stack novo** — e é exatamente aí que "aprender do TI" ganha sentido: o Bifrost ingere as convenções do stack novo à medida que o TI as define.

## 4. Implicação pro TRAJECTORY

O TRAJECTORY (a joia, ADR-008) é **pura disciplina de artefato+prompt, zero dependência de stack** — sobrevive à migração intacto. É o ativo mais durável do Bifrost: independe de Angular vs Expo.

## 5. Estado e próximo passo

- **Código:** meio-cabeado (ponte stub, não compila, 3 states) E travado no stack errado. Não dá pra "só continuar".
- **Natureza do trabalho:** re-scope real (stack novo + tese estreita) = fuzzy → **frente do GSD pina o escopo → FORGE faz rodar** no stack novo. É o handoff GSD→FORGE que a sessão comprovou, aplicado ao Bifrost.
- **Antes de construir:** confirmar o timing da migração frontend (§3) — Bifrost mira o alvo (Expo) desde já, ou há uma janela em que Angular ainda importa?

## 6. Plano de re-scope (GSD-front, 2026-07-23)

Descoberta GSD rodada → plano em `_pesquisa/rescope/` (REQUIREMENTS.md + ROADMAP.md + research/{STACK,BRIDGE_LEARNING,SALVAGE}.md). Núcleo:
- **A ponte é uma máquina de economia:** review+fix+re-review < write. Rework rate é métrica de CONFIANÇA (kill-switch <10% bom / >20% morto). PR de baixa confiança custa MAIS que escrever — pior que nenhum agente.
- **Storybook é o ganho do re-target:** a superfície de revisão vira story + interaction test + visual-diff (o Angular nunca deu isso limpo; o Expo/Storybook que a empresa adota, sim). A migração AJUDA o Bifrost.
- **O loop de aprendizado torna o re-target tratável:** semear as 4 skills stack-locked FINAS e deixar a ponte aprender as convenções Expo das correções reais do TI ("aprende do TI" mecânico). Fica em 7 agentes (sem agente novo).
- **Fases:** 0 (fazer compilar + state único — pura deleção, ~zero risco, SEM dependência do TI) → 1 (o crux: provar a ponte em UMA feature Expo real, saída = rework <10%) → 2 (fechar o loop de feedback) → 3 (skills auto-extensíveis + trust ladder). Cada fase gated pela anterior (anti over-engineering).
- **Dependência dura:** Phase 1 não começa sem o **repo Expo + convenções + 1 feature-piloto do Caio/TI** (LABS constrói a ponte, não é dona das pontas). Lista completa em `rescope/` §inputs.
