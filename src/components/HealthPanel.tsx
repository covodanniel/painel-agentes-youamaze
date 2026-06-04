import type { HealthResponse, SmokeStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatTime, relativeTime } from '../utils/time';

interface Props {
  health: HealthResponse | null;
  smoke: SmokeStatus | null;
  smokeError: string | null;
}

export function HealthPanel({ health, smoke, smokeError }: Props) {
  if (!health) {
    return <div className="card">Carregando saúde do sistema…</div>;
  }

  return (
    <div className="health-grid">
      <section className="card">
        <h3>Status geral</h3>
        <div className="kv">
          <span>Config válida</span>
          <StatusBadge level={health.configValid ? 'green' : 'red'} label={health.configValid ? 'Sim' : 'Não'} />
        </div>
        <div className="kv">
          <span>Health geral</span>
          <StatusBadge level={health.overall} label={health.overallLabel} />
        </div>
      </section>

      <section className="card">
        <h3>Telegram por conta</h3>
        <ul className="account-list">
          {health.telegram.map((t) => (
            <li key={t.account}>
              <span className={`dot dot--${t.connected ? 'green' : 'red'}`} />
              <code>{t.account}</code>
              <span className="muted small">{t.connected ? 'conectado' : 'offline'}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Cron semanal</h3>
        <div className="kv">
          <span>Job</span>
          <code>{health.cron.name}</code>
        </div>
        <div className="kv">
          <span>Agenda</span>
          <span>{health.cron.schedule}</span>
        </div>
        <div className="kv">
          <span>Ativo</span>
          <StatusBadge level={health.cron.active ? 'green' : 'gray'} label={health.cron.active ? 'Sim' : 'Não'} />
        </div>
      </section>

      <section className="card">
        <h3>Smoke</h3>
        {smokeError ? (
          <div className="kv">
            <span>Status</span>
            <StatusBadge level="red" label="Indisponível" />
          </div>
        ) : smoke ? (
          <>
            <div className="kv">
              <span>Status</span>
              <StatusBadge level={smoke.status === 'ok' ? 'green' : 'red'} label={smoke.status.toUpperCase()} />
            </div>
            <div className="kv">
              <span>Resultado</span>
              <code>{smoke.result}</code>
            </div>
            <div className="kv">
              <span>Verificado</span>
              <span title={formatTime(smoke.timestamp)}>{relativeTime(smoke.timestamp)}</span>
            </div>
          </>
        ) : (
          <span className="muted small">Carregando…</span>
        )}
        <p className="muted small">
          Último smoke do cron: <code>{health.lastSmoke.result}</code> ({relativeTime(health.lastSmoke.timestamp)}).
        </p>
      </section>
    </div>
  );
}
