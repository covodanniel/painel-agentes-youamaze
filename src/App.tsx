import { useMemo, useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { Header } from './components/Header';
import { AgentCard } from './components/AgentCard';
import { BoardTable } from './components/BoardTable';
import { HealthPanel } from './components/HealthPanel';
import { ActivityList } from './components/ActivityList';
import { ErrorCard } from './components/ErrorCard';
import type { StatusLevel } from './types';

type Tab = 'overview' | 'board' | 'health' | 'activity';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'board', label: 'Board operacional' },
  { id: 'health', label: 'Saúde do sistema' },
  { id: 'activity', label: 'Atividades recentes' },
];

function Loading({ label }: { label: string }) {
  return <div className="card muted">Carregando {label}…</div>;
}

export function App() {
  const [tab, setTab] = useState<Tab>('overview');
  const { overview, board, health, sessions, smoke, loading, lastUpdated, intervalMs, setIntervalMs, refresh } =
    useDashboardData();

  const systemLevel: StatusLevel = useMemo(() => {
    if (health.error) return 'red';
    if (!health.data) return 'gray';
    return health.data.overall;
  }, [health]);

  const systemLabel = health.error ? 'Indisponível' : health.data ? health.data.overallLabel : 'Sem dados';

  return (
    <div className="app">
      <Header
        lastUpdated={lastUpdated}
        intervalMs={intervalMs}
        onIntervalChange={setIntervalMs}
        onRefresh={() => void refresh()}
        loading={loading}
        systemLevel={systemLevel}
        systemLabel={systemLabel}
      />

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === 'overview' &&
          (overview.error ? (
            <ErrorCard section="visão geral" message={overview.error} />
          ) : overview.data ? (
            <div className="agent-grid">
              {overview.data.agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <Loading label="agentes" />
          ))}

        {tab === 'board' &&
          (board.error ? (
            <ErrorCard section="board operacional" message={board.error} />
          ) : board.data ? (
            <BoardTable items={board.data.items} />
          ) : (
            <Loading label="board" />
          ))}

        {tab === 'health' &&
          (health.error ? (
            <ErrorCard section="saúde do sistema" message={health.error} />
          ) : (
            <HealthPanel health={health.data} smoke={smoke.data} smokeError={smoke.error} />
          ))}

        {tab === 'activity' &&
          (sessions.error ? (
            <ErrorCard section="atividades recentes" message={sessions.error} />
          ) : sessions.data ? (
            <ActivityList sessions={sessions.data.sessions} />
          ) : (
            <Loading label="atividades" />
          ))}
      </main>

      <footer className="footer">
        Painel read-only · dados mockados no MVP · não exibe tokens, credenciais nem conteúdo de mensagens.
      </footer>
    </div>
  );
}
