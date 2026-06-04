# Deploy seguro — Fase ① (auth + proxy + runtime)

Runbook do **deploy privado** do painel: Express read-only servido em loopback,
atrás de **Caddy (TLS)** + **oauth2-proxy (login Google)**. Esta fase **não**
conecta o OpenClaw real nem troca os mocks — só estabelece o acesso seguro.

```
Internet ──TLS──> Caddy (:443) ──> oauth2-proxy (127.0.0.1:4180, Google)
                                      └──> app Express (127.0.0.1:3000, read-only)
```

- App e oauth2-proxy escutam **só em 127.0.0.1**. Firewall externo abre **só a 443**.
- Sem login → bloqueado pelo oauth2-proxy. Com login autorizado → painel abre.
- Defesa em profundidade: o app ainda exige `X-Auth-Request-Email`
  (`REQUIRE_PROXY_AUTH=true`), devolvendo 401 se alguém alcançá-lo sem o proxy.

## O que NÃO versionar

`client_id`, `client_secret` e `cookie_secret` do oauth2-proxy, qualquer `.env`
real, cookies ou tokens. O `.gitignore` já bloqueia `deploy/painel.env`,
`deploy/oauth2-proxy.cfg` e `deploy/secrets/`. Os arquivos `*.sample` (com
placeholders) **são** versionados.

## Pré-requisitos

- Node 20+, Caddy 2.x e o binário do oauth2-proxy no host.
- DNS de `painel.youamaze.app` apontando para o host.
- Credencial OAuth 2.0 (Web application) no Google Cloud, com
  **Authorized redirect URI** = `https://painel.youamaze.app/oauth2/callback`.

## Passo a passo

```bash
# 1. Código + build (frontend dist/ + servidor dist-server/index.js)
git clone <repo> /opt/painel-agentes-youamaze
cd /opt/painel-agentes-youamaze
npm ci
npm run build:all
# (em runtime só é preciso express; pode-se reduzir depois com: npm ci --omit=dev)

# 2. Env do app (sem segredos)
cp deploy/painel.env.sample deploy/painel.env   # ajuste se necessário

# 3. oauth2-proxy: configure e PREENCHA os segredos
sudo cp deploy/oauth2-proxy.cfg.sample /etc/oauth2-proxy/oauth2-proxy.cfg
#   - client_id / client_secret do Google
#   - cookie_secret:
python3 -c 'import os,base64;print(base64.urlsafe_b64encode(os.urandom(32)).decode())'

# 4. Caddy
sudo cp deploy/Caddyfile.sample /etc/caddy/Caddyfile   # ajuste o domínio

# 5. systemd
sudo cp deploy/systemd/painel.service.sample        /etc/systemd/system/painel.service
sudo cp deploy/systemd/oauth2-proxy.service.sample  /etc/systemd/system/oauth2-proxy.service
sudo systemctl daemon-reload
sudo systemctl enable --now painel oauth2-proxy
sudo systemctl reload caddy
```

## Validação (critério de aceite da Fase ①)

### a) App cru em loopback (sem proxy) — read-only e health

```bash
REQUIRE_PROXY_AUTH=false node dist-server/index.js &   # ou: npm start
curl -s localhost:3000/healthz                                              # {"status":"ok"}
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/api/overview        # 200
curl -s -o /dev/null -w '%{http_code}\n' -X POST   localhost:3000/api/overview  # 405
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE localhost:3000/api/board     # 405
```

### b) Guard de auth do app (defesa em profundidade)

```bash
REQUIRE_PROXY_AUTH=true node dist-server/index.js &
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/api/overview                                   # 401 (sem header)
curl -s -o /dev/null -w '%{http_code}\n' -H 'X-Auth-Request-Email: a@youamaze.com' localhost:3000/api/overview  # 200
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/healthz                                        # 200 (sempre aberto)
```

### c) Pilha completa (após o deploy)

```bash
# Sem login → oauth2-proxy redireciona para o Google (302), painel NÃO abre:
curl -sI https://painel.youamaze.app/ | head -1            # HTTP/2 302 (Location: accounts.google.com/...)
# Com login autorizado (no browser) → painel abre.
# Escrita continua barrada mesmo autenticado:
#   POST https://painel.youamaze.app/api/overview → 405
# Portas internas fechadas para fora (só a 443 responde):
#   nmap -Pn painel.youamaze.app  → 3000/4180 NÃO acessíveis
```

## Rollback

- **Tirar do ar agora:** `sudo systemctl stop painel` (app cai; nada exposto).
  Para fechar também o login: `sudo systemctl stop oauth2-proxy`.
- **Desligar só o guard do app** (mantendo a auth real do proxy):
  `REQUIRE_PROXY_AUTH=false` no `deploy/painel.env` + `systemctl restart painel`.
- **Reverter o código:** `git revert` do merge da Fase ① → volta ao MVP anterior.
  O artefato compilado não é versionado: `rm -rf dist-server` limpa.
- **OpenClaw/produção:** nada foi tocado nesta fase, portanto **não há nada a
  reverter** lá.
