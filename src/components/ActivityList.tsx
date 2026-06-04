import type { SessionActivity } from '../types';
import { formatTime, relativeTime } from '../utils/time';

export function ActivityList({ sessions }: { sessions: SessionActivity[] }) {
  return (
    <div className="card table-card">
      <p className="muted small">
        Conteúdo de mensagens não é exibido — somente metadados seguros (read-only).
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Agente</th>
            <th>Sessão</th>
            <th>Tipo</th>
            <th>Atualizado</th>
            <th>Modelo</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td className="strong">{s.agent}</td>
              <td>
                <code>{s.sessionKey}</code>
              </td>
              <td>{s.type}</td>
              <td title={formatTime(s.updatedAt)}>{relativeTime(s.updatedAt)}</td>
              <td>{s.model ?? <span className="muted">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
