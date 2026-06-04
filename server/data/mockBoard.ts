import type { BoardItem } from '../../shared/types';

// MVP: board operacional estatico vindo do briefing. Trocar por coleta
// read-only quando ligar ao OpenClaw real.
export function getBoard(): BoardItem[] {
  return [
    {
      id: 'melhorias-operacionais',
      task: 'Melhorias operacionais dos agentes',
      owner: 'Chaves',
      status: 'Concluído',
      statusLevel: 'green',
      risk: 'baixo',
      riskLevel: 'green',
      nextStep: 'Usar o sistema em tarefa real',
      deadline: null,
      approval: 'Interna',
    },
    {
      id: 'biblioteca-ofertas',
      task: 'Biblioteca de ofertas',
      owner: 'Kiko',
      status: 'Criada, falta popular',
      statusLevel: 'yellow',
      risk: 'médio',
      riskLevel: 'yellow',
      nextStep: 'Preencher com ofertas reais da youAmaze',
      deadline: null,
      approval: 'Danniel quando envolver posicionamento',
    },
    {
      id: 'handoff-claude-code',
      task: 'Handoff Claude Code',
      owner: 'Chiquinha',
      status: 'Criado, falta usar',
      statusLevel: 'yellow',
      risk: 'médio',
      riskLevel: 'yellow',
      nextStep: 'Aplicar na próxima entrega técnica',
      deadline: null,
      approval: 'Chiquinha + Madruga antes de produção',
    },
    {
      id: 'gate-release',
      task: 'Gate de release',
      owner: 'Madruga',
      status: 'Criado, falta aplicar',
      statusLevel: 'yellow',
      risk: 'médio',
      riskLevel: 'yellow',
      nextStep: 'Validar próximo funil / site / landing',
      deadline: null,
      approval: 'Obrigatório antes de publicar',
    },
    {
      id: 'template-campanha',
      task: 'Template de campanha',
      owner: 'Trafego',
      status: 'Criado, falta usar',
      statusLevel: 'yellow',
      risk: 'médio',
      riskLevel: 'yellow',
      nextStep: 'Aplicar antes da primeira campanha paga',
      deadline: null,
      approval: 'Danniel antes de verba / gasto',
    },
  ];
}
