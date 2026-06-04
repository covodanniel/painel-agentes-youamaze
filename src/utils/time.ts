// Idade relativa em portugues, ex.: "há 5 min", "há 2 h", "há 1 d".
export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 45) return 'há instantes';
  const min = Math.round(sec / 60);
  if (min < 60) return `há ${min} min`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  return `há ${days} d`;
}

// Data/hora completa (pt-BR), usada em tooltips.
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR');
}
