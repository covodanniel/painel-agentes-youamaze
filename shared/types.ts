// Tipos compartilhados entre o backend (Express) e o frontend (React).
// Mantidos sem nenhum campo sensivel: nada de tokens, credenciais ou conteudo
// bruto de mensagens trafega por aqui.

export type StatusLevel = 'green' | 'yellow' | 'red' | 'gray';

export type RiskLevel = 'baixo' | 'médio' | 'alto';

export interface Agent {
  id: string;
  name: string;
  role: string;
  channel: string;
  status: string;
  statusLevel: StatusLevel;
  nextUpgrade: string;
  sessions: number;
  lastActivity: string; // ISO 8601
  botConnected: boolean;
}

export interface BoardItem {
  id: string;
  task: string;
  owner: string;
  status: string;
  statusLevel: StatusLevel;
  risk: RiskLevel;
  riskLevel: StatusLevel;
  nextStep: string;
  deadline: string | null; // ISO 8601 ou null quando sem prazo definido
  approval: string;
}

export interface TelegramAccount {
  account: string;
  connected: boolean;
}

export interface HealthStatus {
  configValid: boolean;
  overall: StatusLevel;
  overallLabel: string;
  telegram: TelegramAccount[];
  cron: {
    name: string;
    schedule: string;
    active: boolean;
  };
  lastSmoke: {
    result: string;
    timestamp: string; // ISO 8601
  };
}

export interface SessionActivity {
  id: string;
  agent: string;
  sessionKey: string; // ja resumido / seguro, nunca a chave bruta
  type: string;
  updatedAt: string; // ISO 8601
  model: string | null;
}

export interface SmokeStatus {
  status: 'ok' | 'fail';
  result: string;
  timestamp: string; // ISO 8601
}

// Envelopes de resposta dos endpoints.
export interface OverviewResponse {
  agents: Agent[];
  generatedAt: string;
}

export interface BoardResponse {
  items: BoardItem[];
  generatedAt: string;
}

export interface HealthResponse extends HealthStatus {
  generatedAt: string;
}

export interface SessionsResponse {
  sessions: SessionActivity[];
  generatedAt: string;
}
