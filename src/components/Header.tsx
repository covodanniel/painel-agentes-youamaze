import type { StatusLevel } from '../types';
import { StatusBadge } from './StatusBadge';

interface Props {
  lastUpdated: Date | null;
  intervalMs: number;
  onIntervalChange: (ms: number) => void;
  onRefresh: () => void;
  loading: boolean;
  systemLevel: StatusLevel;
  systemLabel: string;
}

export function Header({
  lastUpdated,
  intervalMs,
  onIntervalChange,
  onRefresh,
  loading,
  systemLevel,
  systemLabel,
}: Props) {
  return (
    <header className="topbar">
      <div className="topbar__title">
        <h1>Painel operacional · agentes youAmaze</h1>
        <span className="topbar__sub">MVP read-only · dados mockados</span>
      </div>

      <div className="topbar__status">
        <span className="muted small">Sistema</span>
        <StatusBadge level={systemLevel} label={systemLabel} />
      </div>

      <div className="topbar__controls">
        <label className="control">
          <span className="muted small">Auto-refresh</span>
          <select
            value={intervalMs}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
          >
            <option value={30_000}>30s</option>
            <option value={60_000}>60s</option>
          </select>
        </label>
        <span className="muted small">
          {lastUpdated ? `atualizado ${lastUpdated.toLocaleTimeString('pt-BR')}` : '—'}
        </span>
        <button className="btn" onClick={onRefresh} disabled={loading}>
          {loading ? 'Atualizando…' : 'Atualizar agora'}
        </button>
      </div>
    </header>
  );
}
