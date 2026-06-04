import type { BoardItem } from '../types';
import { StatusBadge } from './StatusBadge';

export function BoardTable({ items }: { items: BoardItem[] }) {
  return (
    <div className="card table-card">
      <table className="table">
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Dono</th>
            <th>Status</th>
            <th>Risco</th>
            <th>Próximo passo</th>
            <th>Prazo</th>
            <th>Aprovação</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="strong">{item.task}</td>
              <td>{item.owner}</td>
              <td>
                <StatusBadge level={item.statusLevel} label={item.status} />
              </td>
              <td>
                <StatusBadge level={item.riskLevel} label={item.risk} />
              </td>
              <td>{item.nextStep}</td>
              <td>
                {item.deadline ? (
                  new Date(item.deadline).toLocaleDateString('pt-BR')
                ) : (
                  <span className="muted">—</span>
                )}
              </td>
              <td>{item.approval}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
