import type { Agent } from '../../shared/types';

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

// MVP: dados estaticos baseados no briefing. Para ligar ao OpenClaw real,
// substitua o corpo desta funcao por uma coleta READ-ONLY (sem expor tokens,
// credenciais nem conteudo de mensagens). A assinatura nao deve mudar.
export function getAgents(): Agent[] {
  return [
    {
      id: 'chaves',
      name: 'Chaves',
      role: 'Coordenação geral, estratégia, operação e orquestração dos agentes.',
      channel: 'Telegram principal',
      status: 'Operacional',
      statusLevel: 'green',
      nextUpgrade: 'Painel semanal de prioridades e status dos agentes.',
      sessions: 3,
      lastActivity: minutesAgo(6),
      botConnected: true,
    },
    {
      id: 'kiko',
      name: 'Kiko',
      role: 'Marketing, copy, conteúdo, ofertas, Reels, captions e social.',
      channel: 'Telegram próprio / coordenação interna',
      status: 'Operacional',
      statusLevel: 'green',
      nextUpgrade:
        'Biblioteca de ofertas, objeções, hooks, CTAs, provas e públicos por nicho — popular com ofertas reais.',
      sessions: 2,
      lastActivity: minutesAgo(22),
      botConnected: true,
    },
    {
      id: 'chiquinha',
      name: 'Chiquinha',
      role: 'Tecnologia, site, checkout, integrações, scripts, automações, deploy e segurança.',
      channel: 'Telegram próprio / coordenação interna',
      status: 'Operacional',
      statusLevel: 'green',
      nextUpgrade: 'Intake técnico, handoff para Claude Code e relatório técnico recorrente.',
      sessions: 2,
      lastActivity: minutesAgo(48),
      botConnected: true,
    },
    {
      id: 'madruga',
      name: 'Madruga',
      role: 'QA, validação final, evidência, smoke, staging/produção e gate de release.',
      channel: 'Telegram próprio / coordenação interna',
      status: 'Operacional',
      statusLevel: 'green',
      nextUpgrade: 'Gate de release com veredito APROVADO / APROVADO COM RISCO / BLOQUEADO.',
      sessions: 1,
      lastActivity: minutesAgo(180),
      botConnected: true,
    },
    {
      id: 'trafego',
      name: 'Trafego',
      role: 'Facebook/Instagram/Meta Ads, Google Ads, tracking, CPL, CAC e corte de desperdício.',
      channel: 'Telegram próprio — @youAmaze_trafego_bot',
      status: 'Operacional',
      statusLevel: 'green',
      nextUpgrade: 'Template de campanha e relatório semanal de performance.',
      sessions: 1,
      lastActivity: minutesAgo(300),
      botConnected: true,
    },
  ];
}
