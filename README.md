# Painel operacional · agentes youAmaze

Painel **read-only** para acompanhar status e atividade dos agentes OpenClaw da youAmaze
(**Chaves, Kiko, Chiquinha, Madruga, Trafego**). MVP com dados mockados, preparado para
trocar os mocks por uma coleta read-only do OpenClaw e para deploy futuro em
`https://painel.youamaze.app`.

> ⚠️ **Read-only por design.** Este painel **não** lê, exibe nem versiona tokens,
> credenciais, `auth-profiles.json`, cookies, secrets ou conteúdo de mensagens, e **não**
> altera config, gateway, cron, agentes, permissões nem produção. A API só aceita `GET`.

## Stack

- **Frontend:** Vite + React + TypeScript (CSS puro, sem framework de UI)
- **Backend:** Express + TypeScript (executado via `tsx`)
- Sem banco e sem login no MVP (preparado para auth via reverse proxy)

## Como rodar (desenvolvimento)

```bash
npm install
npm run dev
```

Isso sobe os dois processos juntos:

| Serviço            | URL                       |
| ------------------ | ------------------------- |
| UI (Vite)          | http://localhost:5173     |
| API (Express)      | http://localhost:3000     |

Abra **http://localhost:5173**. As chamadas `/api/*` da UI são repassadas
automaticamente para a API em `:3000` (proxy do Vite).

> Se quiser rodar separado: `npm run dev:server` e `npm run dev:client`.

### Testar a API (curl)

```bash
curl http://localhost:3000/api/overview
curl http://localhost:3000/api/health
curl http://localhost:3000/api/board
curl http://localhost:3000/api/sessions
curl http://localhost:3000/api/smoke
```

### Mudar a porta

A API usa `PORT` (padrão `3000`). Copie `.env.example` para `.env` e ajuste.
Se mudar a porta da API, atualize também o `proxy` em `vite.config.ts`.

## Build / produção (preview do deploy)

```bash
npm run build:all   # gera dist/ (frontend) e dist-server/index.js (servidor compilado)
npm start           # node dist-server/index.js — serve API + dist/ no mesmo processo
```

Em produção é um único processo Node: o servidor é **compilado** com esbuild para
`dist-server/index.js` (sem `tsx`/dev-deps em runtime) e serve o frontend estático
e a API na mesma origem. Por padrão o app faz bind em **`127.0.0.1`** — ele
**não** deve ser exposto direto na rede; o acesso público passa por um reverse
proxy com autenticação (ver abaixo).

Outros scripts: `npm run build` (só frontend), `npm run build:server` (só
servidor), `npm run typecheck`, `npm run preview`.

## Deploy seguro (auth + reverse proxy)

Topologia: `Internet → [TLS] Caddy → oauth2-proxy (Google) → app (127.0.0.1:3000)`.
Sem login o painel fica bloqueado; com login autorizado, abre. Passo a passo,
comandos de validação e rollback estão em **[`docs/deploy-seguro.md`](docs/deploy-seguro.md)**;
os samples de configuração (sem segredos) em **`deploy/`**.

> Esta fase **não** conecta o OpenClaw real nem troca os mocks — só estabelece o
> acesso seguro. Segredos do login (`client_id`, `client_secret`, `cookie_secret`)
> vivem no oauth2-proxy e **nunca** são versionados.

### Variáveis de ambiente do app (sem valores — nenhuma é segredo)

| Variável             | Função                                                              |
| -------------------- | ------------------------------------------------------------------ |
| `PORT`               | Porta do servidor (padrão `3000`).                                 |
| `HOST`               | Host de bind (padrão `127.0.0.1`; público só via proxy).           |
| `NODE_ENV`           | `production` no deploy.                                             |
| `TRUST_PROXY`        | Confiança em proxy do Express (padrão `loopback`).                 |
| `REQUIRE_PROXY_AUTH` | `true` exige o header de identidade do proxy (401 sem ele).        |
| `AUTH_HEADER`        | Header de identidade injetado pelo proxy (padrão `x-auth-request-email`). |

Veja `.env.example` e `deploy/painel.env.sample`. Os segredos do login ficam no
oauth2-proxy (`deploy/oauth2-proxy.cfg.sample`), fora do versionamento.

## Telas

1. **Visão geral** — card por agente: nome, papel, canal, status, próximo upgrade,
   sessões, última atividade e bot conectado.
2. **Board operacional** — tarefa, dono, status, risco, próximo passo, prazo, aprovação.
3. **Saúde do sistema** — config válida, health geral, Telegram por conta
   (`default`, `kiko`, `chiquinha`, `madruga`, `trafego`), cron
   `smoke_semanal_agentes_youamaze` e status do smoke.
4. **Atividades recentes** — apenas metadados seguros (agente, sessão resumida,
   tipo, idade relativa, modelo). **Nunca** exibe conteúdo de mensagens.

UX: auto-refresh de **30s/60s** (seletor no topo) + botão **Atualizar agora**.
Cores de status — verde (ok/concluído), amarelo (pendente/médio), vermelho
(falha/bloqueado/alto), cinza (sem dados).

## Endpoints

Todos `GET` e read-only:

| Endpoint         | Retorno (MVP, mockado)                                            |
| ---------------- | ---------------------------------------------------------------- |
| `/api/overview`  | `{ agents[], generatedAt }`                                      |
| `/api/board`     | `{ items[], generatedAt }`                                       |
| `/api/health`    | `{ configValid, overall, telegram[], cron, lastSmoke, ... }`     |
| `/api/sessions`  | `{ sessions[], generatedAt }` (metadados seguros)                |
| `/api/smoke`     | `{ status: "ok", result: "SMOKE_AGENTES_YOUAMAZE_OK", timestamp }`|

Se um endpoint falhar, a tela **não** quebra inteira: só a seção afetada vira um
card vermelho sugerindo acionar **Chaves/Chiquinha**.

## Estrutura

```
shared/types.ts            # tipos compartilhados front/back
server/
  index.ts                 # Express: endpoints GET + estático em produção
  data/mock*.ts            # fonte de dados (mock) por endpoint
src/
  App.tsx, main.tsx, styles.css
  api.ts, types.ts
  hooks/useDashboardData.ts # fetch + auto-refresh + isolamento de erro
  utils/time.ts
  components/               # Header, AgentCard, BoardTable, HealthPanel,
                            # ActivityList, StatusBadge, ErrorCard
```

## Limitações do MVP

- **Dados são mockados** (estáticos). Não refletem o estado real do OpenClaw.
- Sem banco, sem login local, sem deploy público, sem edição pelo painel.
- Atividades mostram apenas metadados seguros — sem conteúdo de mensagens.

## Como ligar ao OpenClaw real depois

A camada de dados está isolada em `server/data/mock*.ts`. Para conectar o
OpenClaw real, **mantenha a assinatura** de `getAgents()`, `getBoard()`,
`getHealth()`, `getSessions()`, `getSmoke()` e troque apenas o corpo por uma
coleta **read-only** (ex.: ler status/health expostos pelo OpenClaw, resultado
do cron do smoke, contas de Telegram conectadas sim/não). Regras obrigatórias:

- **Nunca** ler/expor tokens, credenciais, `auth-profiles.json`, cookies, secrets
  ou conteúdo de mensagens. `sessionKey` deve chegar já resumido/anonimizado.
- **Não** alterar config, gateway, cron, agentes nem permissões — apenas leitura.
- **Autenticação:** colocar o painel atrás de um reverse proxy com auth em
  `painel.youamaze.app`. Já existe um placeholder comentado em `server/index.ts`
  para validar o header injetado pelo proxy (ex.: `X-Auth-Request-Email`).
