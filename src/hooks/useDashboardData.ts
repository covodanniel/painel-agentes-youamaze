import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from '../api';
import type {
  BoardResponse,
  HealthResponse,
  OverviewResponse,
  SessionsResponse,
  SmokeStatus,
} from '../types';

export interface Resource<T> {
  data: T | null;
  error: string | null;
}

interface DashboardState {
  overview: Resource<OverviewResponse>;
  board: Resource<BoardResponse>;
  health: Resource<HealthResponse>;
  sessions: Resource<SessionsResponse>;
  smoke: Resource<SmokeStatus>;
}

const EMPTY_RESOURCE = { data: null, error: null };

const INITIAL: DashboardState = {
  overview: EMPTY_RESOURCE,
  board: EMPTY_RESOURCE,
  health: EMPTY_RESOURCE,
  sessions: EMPTY_RESOURCE,
  smoke: EMPTY_RESOURCE,
};

function toResource<T>(result: PromiseSettledResult<T>): Resource<T> {
  if (result.status === 'fulfilled') {
    return { data: result.value, error: null };
  }
  const reason = result.reason;
  return {
    data: null,
    error: reason instanceof Error ? reason.message : 'Falha ao carregar',
  };
}

// Busca os 5 endpoints de forma isolada (allSettled): se um falhar, os outros
// continuam exibindo dados. Auto-refresh configuravel + refresh manual.
export function useDashboardData() {
  const [state, setState] = useState<DashboardState>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [intervalMs, setIntervalMs] = useState(30_000);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [overview, board, health, sessions, smoke] = await Promise.allSettled([
      fetchJson<OverviewResponse>('/overview'),
      fetchJson<BoardResponse>('/board'),
      fetchJson<HealthResponse>('/health'),
      fetchJson<SessionsResponse>('/sessions'),
      fetchJson<SmokeStatus>('/smoke'),
    ]);
    setState({
      overview: toResource(overview),
      board: toResource(board),
      health: toResource(health),
      sessions: toResource(sessions),
      smoke: toResource(smoke),
    });
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const id = window.setInterval(() => void refresh(), intervalMs);
    return () => window.clearInterval(id);
  }, [refresh, intervalMs]);

  return { ...state, loading, lastUpdated, intervalMs, setIntervalMs, refresh };
}
