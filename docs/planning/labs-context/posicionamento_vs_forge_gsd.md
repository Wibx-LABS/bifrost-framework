# Posicionamento do Bifrost vs FORGE + GSD

> **Data:** 2026-07-23 · **Método:** mapeamento do código + intel do kb_vault (2 agentes) + síntese vs FORGE+GSD (dogfoodados esta sessão). **Recomendação inicial: ABSORVER — REVERTIDA pelo attending (ver §8).**

> ## ⚠️ §8 — Correção do attending (2026-07-23, prevalece sobre §6)
>
> A recomendação "absorver" tratou o domain-lock como fraqueza. **Errado.** O attending (Pedro) reenquadrou: o domain-lock é o **fosso**, não redundância. O Bifrost NÃO é um FORGE genérico — é a **ponte Produto↔TI travada no stack real da empresa**, que aprende dos dois lados.
>
> **Tese afiada (nova canônica):**
> - **Escopo único e estreito** (não abrangente como o FORGE): a ponte Produto↔TI e vice-versa.
> - **"Diminuir as possibilidades":** usa SÓ os frameworks/stack que a empresa de fato usa — não genérico, não qualquer stack.
> - **Aprende do Produto E do TI:** convenções, contratos, feedback de cada entrega (o bifrost-hr self-extending + a knowledge layer, mirados nos dois lados).
> - A economia "Backend-dev vira reviewer" (que o mapa achou) É essa ponte.
>
> **Veredito revisado: CONTINUAR-AFIADO**, não absorver. O TRAJECTORY segue joia (mantém dentro do Bifrost, não exporta pro FORGE). O que a §2 achou (meio-cabeado, não compila, 3 states, doc-à-frente) continua verdade e vira **o trabalho**: afiar a tese + fazer rodar de ponta a ponta no stack da empresa. A parte da §6 sobre "aposentar CLI/reskin" fica suspensa — reavaliar à luz da tese estreita.

## 1. O que o Bifrost é (código real, não claims)

Framework de orquestração de agentes **derivado do FORGE**, travado a UM monorepo frontend Angular (WiBX/Wiboo). Duas metades:
- **CLI oclif real** (~2700 LOC + testes): interview de init, scaffold `.bifrost/`, hidratação de templates, STATE.md, git branch/commit/`gh pr create`. **Não chama LLM** — depois do init imprime "abra o Claude Code e rode /bifrost:start".
- **Camada de prompt** (7 agentes, 9 skills, 5 ADRs, 10 templates): a inteligência real, roda dentro do Claude Code/Antigravity.

Unidade = uma **feature** frontend (a metáfora hospital do FORGE encolhida de projeto → feature). Herda PATIENT/@Intake/VITALS/admit-discharge do FORGE.

## 2. Estado: meio-cabeado, doc-à-frente-do-código (5 commits)

- A **ponte CLI↔agentes** (`core/commands/*.js`) são **stubs de 0 byte** — o elo que faria rodar de ponta a ponta não existe.
- `init.ts` ainda escreve o artefato ANTIGO (HEALTH/AUTONOMY), nunca cria o `TRAJECTORY.md` que os ADRs e todos os agentes assumem.
- **Três** impls paralelas de state (duplicação); barrel importa módulos inexistentes → **não compila as-is**; `install.sh` baixa um binário não publicado.

## 3. A tese distintiva foi abandonada no código

- **ADR-001 (Pedro, original):** Bifrost **rejeita o lifecycle FORGE** — "cada run é curto, uma tela → um PR"; unidade = *run* efêmero.
- **Caio:** abraça o modelo hospital FORGE.
- **O que foi construído (ADR-005 supersede):** adotou o lifecycle FORGE. A direção do Caio venceu.
- **Consequência:** o único diferencial real do Bifrost (run curto, não-paciente) sumiu. O que existe é um reskin do FORGE — exatamente redundante, contra a razão original de ser separado.

## 4. Matriz de capacidade

| Capacidade | Bifrost | FORGE | GSD |
|---|---|---|---|
| Unidade | feature (1 monorepo Angular) | projeto (paciente) | projeto→fases |
| Descoberta de fuzzy | fraca (só interview) | fraca | **forte** |
| Pesquisa de domínio | nenhuma | nenhuma | **forte** (4-dim) |
| Execução autônoma | desenhada, **não cabeada** | **forte** | fase (wave) |
| Drift monitoring | @Monitor/VITALS (copiado do FORGE) | **forte** | gates |
| **Constraint travado imutável + provenance grep-able** | **ÚNICO** (TRAJECTORY/ADR-008) | blueprint = diagnóstico | spec = front-load |
| Gates de verificação | 1 (QA) | HEALTH | **forte** (plan-check/verifier/nyquist) |
| **Skill self-extending no intake** | **ÚNICO-ish** (bifrost-hr, só prompt) | toolset fixo | toolset fixo |
| Brownfield admit | travado a 1 repo | **forte** (/forge:map) | map-codebase |
| PR/delivery | real (git+gh) | discharge | ship |
| Portabilidade cross-tool | **ÚNICO** (Claude+Antigravity) | Claude | Claude |
| Framework chama o LLM? | **NÃO** (ponte = stub) | sim | sim |
| Maturidade | 5 commits, não compila, 3 states | madura, dogfoodada | madura, dogfoodada |

## 5. O que é genuinamente único (e só isto)

1. **TRAJECTORY-context (ADR-008) — a joia.** Constituição por-feature: @Intake TRAVA §1-5 na escrita (imutável); §6 só adiciona, nunca amolece; todo artefato downstream carrega `## Trajectory acknowledged`; @CodeGen cita §N.bullet em comentário de código (provenance grep-able); conflito mid-flight = Hard Stop com schema_version+1 preservando o antigo. **Disciplina de preservação de contexto mais forte que o spec do GSD (não imutável, sem provenance) e o blueprint do FORGE (diagnóstico, não contrato travado).** Pura disciplina de artefato+prompt, zero dependência de Angular → portável.
2. **bifrost-hr (ADR-009) — secundário.** Biblioteca de skills auto-extensível: no intake, detecta gap de domínio → propõe/forka skill → Hard Stop pra aprovação → commita. Conceito novo, mas o mais especulativo e dependente da ponte stub.

Tudo o mais "único" **não é**: feature-granularity é a máquina do FORGE apontada a unidade menor (nada impede o FORGE admitir uma feature como paciente); a knowledge layer duplica graphify/map-codebase (e o `loader.ts` do Bifrost é código morto, importado por ninguém); a metáfora hospital é copiada verbatim.

## 6. Recomendação: ABSORVER

Teste do FINANCE_RECON: o Bifrost tem razão VALIDADA de existir como framework separado — capacidade que FORGE/GSD estruturalmente não cobrem? **Não.** É a máquina do FORGE em unidade menor, travada a um monorepo que **nem está na org** (busca por wiboo/angular vazia), com ponte stub, 3 states, não compila. Seu nicho-manchete (feature-granularity) é racionalização; a tese que seria real (run curto) foi abandonada no código.

Mas **duas ideias valem resgate.** Então não é "retire" (jogaria fora o TRAJECTORY) nem "continue" (mantém um fork FORGE quebrado, o 3º framework redundante que a sessão inteira evitou). É **absorver**.

### Salvar no FORGE
1. **TRAJECTORY (ADR-008)** — prioridade. Dobrar no BLUEPRINT do FORGE como modo OPT-IN "locked constraints" pra trabalho de alto risco (travado §1-5 + §6 append-only + `## Trajectory acknowledged` por artefato + provenance §N.bullet em código + hard-stop schema+1). Não precisa porta de código.
2. **bifrost-hr (ADR-009)** — opcional. Portar a IDEIA (check de gap de capacidade no intake propondo skill, com Hard Stop de aprovação humana), não a maquinária.
3. **Conteúdo da knowledge layer** (TECH_STACK/COMPONENT_LIBRARY/NAMING/GOTCHAS) — só se o monorepo Angular WiBX for alvo vivo (verificar; não parece estar na org).

### Morre (aposentar)
CLI oclif (2º scaffolder que escreve o artefato errado), o reskin hospital-por-feature, o roster de 7 agentes, as 3 impls de state, a ponte de 0 byte, o barrel que não compila, o install.sh de binário fantasma, o targeting Antigravity (sem demanda validada), o screen-ingest (só detecção) e o Phase 3 graphify (GSD já tem).

## 7. Ressalvas honestas

- **TRAJECTORY nunca rodou de verdade** (doc-à-frente-do-código: o CLI não escreve TRAJECTORY.md). Tratar como design forte a validar dentro do FORGE, não feature battle-tested.
- **Pressão de sunk-cost:** a camada de prompt é bem-autorada e acabou de aterrissar — aposentar vai parecer desperdício. Contra-argumento é o precedente FINANCE_RECON: qualidade de autoria não é necessidade validada. Resgata a ideia, aposenta o framework.
- **Absorção precisa de dono/timebox** senão "absorver" degrada silenciosamente em "aposentar e perder o TRAJECTORY". Atribuir a dobra do TRAJECTORY explicitamente.
- Verificar se o monorepo Angular WiBX/Wiboo é alvo ativo antes de valorizar o resgate de conteúdo.
