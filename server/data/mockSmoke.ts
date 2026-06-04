import type { SmokeStatus } from '../../shared/types';

// MVP: smoke MOCKADO e seguro, conforme briefing. Sem segredos.
// Real: trocar por leitura do resultado do cron smoke_semanal_agentes_youamaze
// (somente o veredito/resultado, nunca logs com dados sensiveis).
export function getSmoke(): SmokeStatus {
  return {
    status: 'ok',
    result: 'SMOKE_AGENTES_YOUAMAZE_OK',
    timestamp: new Date().toISOString(),
  };
}
