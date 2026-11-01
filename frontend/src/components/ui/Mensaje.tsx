export const ErrorMensaje = ({ texto }: { texto?: string | null }) =>
  texto ? <p role="alert" style={{ color: '#B4483C', fontWeight: 600, margin: '0 0 12px' }}>{texto}</p> : null;

export const Cargando = ({ texto = 'Cargando…' }: { texto?: string }) =>
  <p role="status" style={{ color: 'var(--ink-soft)', padding: '24px 0', textAlign: 'center' }}>{texto}</p>;

export const Vacio = ({ titulo, texto }: { titulo: string; texto?: string }) => (
  <div className="help-item" style={{ textAlign: 'center' }}><h4>{titulo}</h4>{texto && <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{texto}</p>}</div>
);
