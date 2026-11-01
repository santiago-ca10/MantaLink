interface Props { pagina: number; paginas: number; onCambiar: (p: number) => void }

export function Paginacion({ pagina, paginas, onCambiar }: Props) {
  if (paginas <= 1) return null;
  return (
    <nav aria-label="Paginación" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
      <button className="btn btn-outline" disabled={pagina <= 1} onClick={() => onCambiar(pagina - 1)}>← Anterior</button>
      <span style={{ color: 'var(--ink-soft)' }} aria-current="page">Página {pagina} de {paginas}</span>
      <button className="btn btn-outline" disabled={pagina >= paginas} onClick={() => onCambiar(pagina + 1)}>Siguiente →</button>
    </nav>
  );
}
