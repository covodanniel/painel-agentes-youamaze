import type { StatusLevel } from '../types';

// Pill colorido reutilizavel. Cores: verde (ok), amarelo (pendente/medio),
// vermelho (falha/bloqueado/alto), cinza (sem dados).
export function StatusBadge({ level, label }: { level: StatusLevel; label: string }) {
  return <span className={`badge badge--${level}`}>{label}</span>;
}
