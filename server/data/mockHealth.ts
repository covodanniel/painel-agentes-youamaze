import type { HealthStatus } from '../../shared/types';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

// MVP: saude do sistema MOCKADA e segura. Nao reflete o estado real do OpenClaw.
// Ao ligar a fonte real, ler apenas sinais nao-sensiveis (config valida sim/nao,
// conta de Telegram conectada sim/nao, cron ativo sim/nao, resultado do smoke).
// NUNCA expor tokens, cookies, auth-profiles.json nem conteudo de mensagens.
export function getHealth(): HealthStatus {
  return {
    configValid: true,
    overall: 'green',
    overallLabel: 'OK',
    telegram: [
      { account: 'default', connected: true },
      { account: 'kiko', connected: true },
      { account: 'chiquinha', connected: true },
      { account: 'madruga', connected: true },
      { account: 'trafego', connected: true },
    ],
    cron: {
      name: 'smoke_semanal_agentes_youamaze',
      schedule: 'Semanal — segunda-feira 08:00 (America/Sao_Paulo)',
      active: true,
    },
    lastSmoke: {
      result: 'SMOKE_AGENTES_YOUAMAZE_OK',
      timestamp: hoursAgo(20),
    },
  };
}
