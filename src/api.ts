const BASE = '/api';

// Wrapper simples de fetch read-only. No dev, /api e repassado pelo Vite ao
// Express (:3000); em producao e o mesmo processo/origem.
export async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao buscar ${path}`);
  }
  return (await res.json()) as T;
}
