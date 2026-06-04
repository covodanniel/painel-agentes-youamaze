import type { Agent } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatTime, relativeTime } from '../utils/time';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <article className="card agent-card">
      <header className="agent-card__head">
        <h3 className="agent-card__name">{agent.name}</h3>
        <StatusBadge level={agent.statusLevel} label={agent.status} />
      </header>

      <p className="agent-card__role">{agent.role}</p>

      <dl className="agent-card__meta">
        <div>
          <dt>Canal</dt>
          <dd>{agent.channel}</dd>
        </div>
        <div>
          <dt>Sessões</dt>
          <dd>{agent.sessions}</dd>
        </div>
        <div>
          <dt>Última atividade</dt>
          <dd title={formatTime(agent.lastActivity)}>{relativeTime(agent.lastActivity)}</dd>
        </div>
        <div>
          <dt>Bot conectado</dt>
          <dd>
            <span className={`dot dot--${agent.botConnected ? 'green' : 'red'}`} />
            {agent.botConnected ? 'Sim' : 'Não'}
          </dd>
        </div>
      </dl>

      <div className="agent-card__next">
        <span className="label">Próximo upgrade</span>
        <p>{agent.nextUpgrade}</p>
      </div>
    </article>
  );
}
