import type { SessionActivity } from '../../shared/types';

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

// MVP: atividades recentes MOCKADAS. Apenas metadados seguros.
// IMPORTANTE: nunca incluir conteudo de mensagens privadas. Ao ligar a fonte
// real, o sessionKey deve vir ja resumido/anonimizado (read-only).
export function getSessions(): SessionActivity[] {
  return [
    {
      id: 's1',
      agent: 'Chaves',
      sessionKey: 'chaves/coordenacao-2026w23',
      type: 'coordenação',
      updatedAt: minutesAgo(6),
      model: 'claude-opus',
    },
    {
      id: 's2',
      agent: 'Kiko',
      sessionKey: 'kiko/ofertas-rascunho',
      type: 'copy / conteúdo',
      updatedAt: minutesAgo(22),
      model: 'claude-sonnet',
    },
    {
      id: 's3',
      agent: 'Chiquinha',
      sessionKey: 'chiquinha/deploy-check',
      type: 'técnico / deploy',
      updatedAt: minutesAgo(48),
      model: 'claude-sonnet',
    },
    {
      id: 's4',
      agent: 'Madruga',
      sessionKey: 'madruga/qa-gate-funil',
      type: 'qa / gate',
      updatedAt: minutesAgo(180),
      model: 'claude-sonnet',
    },
    {
      id: 's5',
      agent: 'Trafego',
      sessionKey: 'trafego/setup-campanha',
      type: 'tráfego / ads',
      updatedAt: minutesAgo(300),
      model: null,
    },
  ];
}
