# Bifrost — a realidade, do Notion (2026-07-24)

> Mineração do Notion (sem depender do TI). **Corrige** o over-engineering da análise e da pesquisa. Fonte: página de kickoff do BIOFROST (ata 2026-04-30) + páginas de referência "Frontend" e "Backend" (LABS-MAESTRO/ARQUITETURA).

## 1. O que o Bifrost REALMENTE é (da própria ata de apresentação)

Ferramenta prática de **assistência ao desenvolvimento frontend da Wibix**, **inspirada no GSD** ("Get Shit Done"), toolkit local que integra provedores de IA (Claude Code, Antigravity, Codex, Cursor).

- **Propósito declarado:** "uma ferramenta que realmente AJUDA, não só automatiza agentes." Foco em **tarefas tediosas**, NÃO automação 100% ("seria impossível e prejudicaria a qualidade"). Agentes autônomos = **segunda ordem**.
- **Casos de uso concretos (as dores reais do frontend):**
  1. **Traduções pt/en/es** — tedioso, propenso a erro; tem que ser feito junto com o componente.
  2. **Forms ↔ integração com API** — adaptar como a API consome os dados.
  3. **Criação de Pull Requests** — automatizável, mas **passa por aprovação do Gabriel**.
  4. Reestruturação de código (projeto grande, muitos contribuidores).
- **Repo-alvo original:** **Vizmos** (o frontend mais simples pra começar) — Angular 15, versão atual 21, "eventualmente precisará migração".
- **Reviewer/aprovador:** **Gabriel** (não Caio — eu tinha chutado errado).
- **Origem:** projeto começou 2026-04-27; Juan testaria no Vizmos; mover pra org privada (feito). Pedro: "envolvido com **Front↔product bridge**" (a ponte que ele reafirmou agora).

## 2. Correção honesta (o que eu e a pesquisa erramos)

- Minha análise achou "hospital-por-feature + TRAJECTORY + trust ladder + economia de reviewer" — isso é o código **FORGE-derived** que **driftou** do propósito prático. A ata diz o oposto: NÃO 100% automação, foco em tédio.
- A pesquisa de re-scope assumiu **Storybook, Zustand, TanStack Query, tRPC-codegen, feedback state machine** — genérico e **contraditado pela realidade** (§3). Semear o Bifrost com aquilo teria sido errado.
- **O Bifrost é GSD-inspired na origem** — não um rival do GSD. Resolve a confusão "FORGE-derived vs GSD": nasceu do GSD, ganhou esqueleto FORGE depois.

## 3. Convenções REAIS do stack (Notion, [LOCKED])

### Frontend — página de referência "Frontend" (LABS-MAESTRO)
> ⚠️ Esta é a convenção do frontend **Expo do Maestro**. O repo-alvo original do Bifrost (Vizmos) é **Angular**. Ver §4 — qual é o alvo vivo precisa de 1 confirmação.

| Camada | Escolha real | Invariante |
|---|---|---|
| Framework | **Expo (universal)**, web-first | Web é prioridade (quebra no web = hard blocker) |
| Styling | **Tailwind via NativeWind v5** | NativeWind pra TODO styling — sem inline, sem `StyleSheet.create` |
| Components | **Custom (NativeWind)** | controle total da identidade — **sem design-system lib** (Gluestack/Tamagui descartados) |
| Routing | **Expo Router** (file-based) | |
| Data + State | **`useState` + Context + `fetch`** | **poll-on-demand only** — sem WebSocket/SSE/long-poll; **sem Zustand/TanStack** sem discussão |
| Animations | **Moti** | Moti pra tudo — sem Reanimated raw / Framer Motion / CSS transitions |
| Types | **TypeScript à mão** | **sem codegen/openapi-typescript** — contrato atualizado à mão |
| Auth | bearer token `EXPO_PUBLIC_GATEWAY_TOKEN` | |

**Descartados explicitamente:** TanStack Query, Zustand, openapi-typescript, Framer Motion, Reanimated raw, Gluestack/Tamagui. **Storybook não aparece** na página de convenções.

### Backend — página "Backend" (LABS-MAESTRO)
- Engine **Go determinístico** (core, sem AI) + Gateway **TypeScript + Fastify v5 + TypeBox**
- Dados: **PostgreSQL** (Blackboard único) · AI: **OpenRouter só na borda**
- Nota MVP: o gateway front↔engine é **tRPC + superjson** (~20 rotas) — mas a página Frontend crava tipos à mão (tensão a confirmar).

## 4. A única ambiguidade que sobra (1 confirmação, não do TI)

Há (pelo menos) **dois frontends** documentados:
- **Vizmos** — o repo-alvo ORIGINAL do Bifrost, **Angular** (15→21). As dores reais (traduções, forms, PR) são desse mundo.
- **LABS-MAESTRO front** — **Expo + NativeWind** (a página de convenções acima).

A imagem que você mandou mostra o frontend migrando **Angular → Expo/Storybook**. Então: o Bifrost mira o **Vizmos-Angular** (origem, onde as dores estão hoje) ou o **Expo** (destino da migração)? As convenções mudam 100% conforme a resposta. **Isso é decisão sua** — não depende do TI, é qual repo o Bifrost serve.

## 4.1 Onde a realidade do Vizmos REALMENTE mora (achado 2026-07-24)

Alvo confirmado = **Vizmos (Angular)**. Mas o Notion **não tem** as convenções do Vizmos — só documenta o front Expo/Maestro (outro repo). A busca por Vizmos/Angular no Notion retornou vazio de convenções ("detalhe vivo mora no repo").

**A realidade do Vizmos já está EM MÃOS, no próprio repo do Bifrost:** `bifrost-framework/knowledge/FRONTEND_REPOSITORY_MANUAL.md` (59KB, do Caio) É o manual real:
- **Nx Monorepo · Angular 15 · Nx 16 · Yarn 3.5 Berry · TypeScript 4.8 · Node 20 CI**
- Apps: `account` (auth/perfil/onboarding), `business` (merchant/enterprise), `shopping` (e-commerce), `tokengo` (gamificação)
- Libs: `commonlib` (componentes/serviços/estilos/utils compartilhados), `wallet` (financeiro)
- NgRx, ESLint root aplicável a todos apps/libs, CI `angular_push.yml`/`angular_pr.yml`
- O manual também cobre a migração Expo (menciona os dois).

Ou seja: **"perto da realidade sem TI" É ALCANÇÁVEL** — a fonte é o manual que já está no LABS (movemos), não o Notion. O que o Notion adiciona pro Vizmos: (a) o padrão **i18n** (`LanguageContext` + dicionário pt/en/es, troca em runtime — feature Done, PR #148) e (b) o processo de **PR com aprovação do Gabriel**.

## 5. Implicação pro re-scope

- Se **Expo**: as convenções da §3 são o knowledge layer real (LOCKED), muito mais opinativo que a pesquisa genérica. Semear com ISSO.
- Se **Vizmos-Angular**: preciso minerar as convenções do Vizmos no Notion (menos documentadas no que puxei) — mas o valor (traduções/forms/PR) está aí hoje.
- Em ambos: **estreitar pro propósito real** (tarefas tediosas: i18n, forms↔API, PR com aprovação do Gabriel), NÃO o hospital-por-feature. O TRAJECTORY (joia) fica opcional; a ata pede utilidade, não cerimônia.
