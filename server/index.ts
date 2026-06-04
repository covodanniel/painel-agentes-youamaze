import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { getAgents } from './data/mockAgents';
import { getBoard } from './data/mockBoard';
import { getHealth } from './data/mockHealth';
import { getSessions } from './data/mockSessions';
import { getSmoke } from './data/mockSmoke';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

// Bind em loopback por padrao: o painel NUNCA deve ser exposto direto na rede.
// O acesso publico acontece SOMENTE via reverse proxy (Caddy + oauth2-proxy).
// Override consciente via HOST (ex.: 0.0.0.0 em container), nunca em prod crua.
const HOST = process.env.HOST || '127.0.0.1';

// trust proxy restrito ao hop local: o proxy fala com o app por 127.0.0.1.
// Evita que um cliente externo forje X-Forwarded-* ou o header de identidade.
// Override via TRUST_PROXY (ex.: IP/subnet do proxy) se a topologia mudar.
const TRUST_PROXY = process.env.TRUST_PROXY || 'loopback';

// Defesa em profundidade: quando ligado, o app exige o header de identidade
// injetado pelo oauth2-proxy. A barreira primaria continua sendo o proxy;
// isto so garante 401 caso alguem alcance o app sem passar por ele.
const REQUIRE_PROXY_AUTH = process.env.REQUIRE_PROXY_AUTH === 'true';
const AUTH_HEADER = (process.env.AUTH_HEADER || 'x-auth-request-email').toLowerCase();

const app = express();

app.set('trust proxy', TRUST_PROXY);
app.disable('x-powered-by');

// Painel nao e publico: evita indexacao caso seja exposto cedo.
app.use((_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// Health check para o reverse proxy / uptime. Sempre aberto (sem auth) e sem
// nenhum dado sensivel: so confirma que o processo esta de pe. Fica ANTES do
// guard de auth de proposito.
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

// --- Autenticacao via header do reverse proxy (defesa em profundidade) ---
// Em producao, atras de painel.youamaze.app, o oauth2-proxy faz o login Google
// e injeta o header de identidade (ex.: X-Auth-Request-Email). Quando
// REQUIRE_PROXY_AUTH=true, o app exige esse header e devolve 401 sem ele,
// cobrindo todo o painel (front + API). Default desligado para o dev local.
if (REQUIRE_PROXY_AUTH) {
  app.use((req, res, next) => {
    if (!req.header(AUTH_HEADER)) {
      res.status(401).json({ error: 'Não autenticado.' });
      return;
    }
    next();
  });
}

// MVP READ-ONLY: a API so aceita leitura. Qualquer metodo de escrita e barrado.
app.use('/api', (req, res, next) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Painel read-only: somente GET é permitido.' });
    return;
  }
  next();
});

function handle<T>(producer: () => T) {
  return (_req: express.Request, res: express.Response) => {
    try {
      res.json(producer());
    } catch (err) {
      // Falha de coleta nunca derruba o servidor: devolve 500 e o front mostra
      // um card vermelho na secao afetada (as demais continuam funcionando).
      res.status(500).json({
        error: 'Falha ao coletar dados do painel.',
        detail: err instanceof Error ? err.message : 'erro desconhecido',
      });
    }
  };
}

const now = () => new Date().toISOString();

app.get('/api/overview', handle(() => ({ agents: getAgents(), generatedAt: now() })));
app.get('/api/board', handle(() => ({ items: getBoard(), generatedAt: now() })));
app.get('/api/health', handle(() => ({ ...getHealth(), generatedAt: now() })));
app.get('/api/sessions', handle(() => ({ sessions: getSessions(), generatedAt: now() })));
app.get('/api/smoke', handle(() => getSmoke()));

// Em producao (apos `npm run build`), serve o front-end estatico de dist/.
// No dev essa pasta nao existe e o Vite (porta 5173) cuida da UI via proxy.
const distPath = path.resolve(__dirname, '..', 'dist');
const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
if (hasDist) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, HOST, () => {
  console.log(`[painel-agentes-youamaze] API read-only em http://${HOST}:${PORT}`);
  if (hasDist) {
    console.log(`[painel-agentes-youamaze] Front-end estático servido de ${distPath}`);
  } else {
    console.log('[painel-agentes-youamaze] Modo dev: rode "npm run dev:client" (Vite em http://localhost:5173)');
  }
});
