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

const app = express();

// Preparado para reverse proxy / autenticacao futura (ex.: painel.youamaze.app).
app.set('trust proxy', true);
app.disable('x-powered-by');

// Painel nao e publico: evita indexacao caso seja exposto cedo.
app.use((_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// MVP READ-ONLY: a API so aceita leitura. Qualquer metodo de escrita e barrado.
app.use('/api', (req, res, next) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Painel read-only: somente GET é permitido.' });
    return;
  }
  next();
});

// --- Placeholder de autenticacao (DESATIVADO no MVP local) ---
// Em producao, atras de painel.youamaze.app, plugar aqui a verificacao do
// header injetado pelo reverse proxy (ex.: X-Auth-Request-Email). Mantido
// comentado de proposito: o brief pede "sem login no MVP local".
// app.use('/api', (req, res, next) => {
//   const user = req.header('x-auth-request-email');
//   if (!user) { res.status(401).json({ error: 'Não autenticado.' }); return; }
//   next();
// });

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

app.listen(PORT, () => {
  console.log(`[painel-agentes-youamaze] API read-only em http://localhost:${PORT}`);
  if (hasDist) {
    console.log(`[painel-agentes-youamaze] Front-end estático servido de ${distPath}`);
  } else {
    console.log('[painel-agentes-youamaze] Modo dev: rode "npm run dev:client" (Vite em http://localhost:5173)');
  }
});
