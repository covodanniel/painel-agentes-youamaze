// Card vermelho exibido quando um endpoint falha. Nao derruba a tela toda:
// apenas a secao afetada e substituida por este aviso com proximo passo.
export function ErrorCard({ section, message }: { section: string; message: string }) {
  return (
    <div className="card error-card">
      <h3>Falha ao carregar: {section}</h3>
      <p className="muted small">{message}</p>
      <p className="next-step">
        Próximo passo: acionar <strong>Chaves / Chiquinha</strong> para verificar a coleta
        read-only do OpenClaw.
      </p>
    </div>
  );
}
