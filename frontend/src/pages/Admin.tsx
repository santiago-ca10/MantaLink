import { useState } from 'react';
import { admin, ApiError } from '../api';
import { Imagen } from '../components/ui/Imagen';
import { Cargando, ErrorMensaje, Vacio } from '../components/ui/Mensaje';
import { useToast } from '../context/ToastContext';
import { useCarga } from '../hooks/useCarga';
import type { Publicacion, Reporte, Usuario } from '../types';
import { fechaCorta } from '../utils/format';

type Vista = 'cuentas' | 'publicaciones' | 'reportes';

export default function Admin() {
  const [vista, setVista] = useState<Vista>('cuentas');
  const cuentas = useCarga(() => admin.cuentasPendientes(), []);
  const pubs = useCarga(() => admin.publicacionesPendientes(), []);
  const reportes = useCarga(() => admin.reportes(), []);

  const tarjetas: { v: Vista; n?: number; texto: string }[] = [
    { v: 'cuentas', n: cuentas.datos?.length, texto: 'Cuentas por verificar' },
    { v: 'publicaciones', n: pubs.datos?.length, texto: 'Publicaciones por revisar' },
    { v: 'reportes', n: reportes.datos?.length, texto: 'Publicaciones reportadas' },
  ];

  return (
    <section className="screen">
      <div className="section-title"><h3>Panel de administración</h3></div>
      <div className="admin-dash" role="tablist" aria-label="Qué revisar">
        {tarjetas.map((t) => (
          <button key={t.v} role="tab" aria-selected={vista === t.v} className="admin-card" style={vista === t.v ? { borderColor: 'var(--primary)' } : undefined} onClick={() => setVista(t.v)}>
            <span className="admin-card-n">{t.n ?? '–'}</span><span>{t.texto}</span>
          </button>
        ))}
      </div>
      {vista === 'cuentas' && <Cuentas {...cuentas} />}
      {vista === 'publicaciones' && <Publicaciones {...pubs} />}
      {vista === 'reportes' && <Reportes {...reportes} />}
    </section>
  );
}

interface Carga<T> { datos: T[] | null; cargando: boolean; error: string | null; recargar: () => void }

function useAccion(recargar: () => void) {
  const avisar = useToast();
  return async (fn: () => Promise<unknown>, ok: string) => {
    try { await fn(); avisar(ok); recargar(); } catch (e) { avisar(e instanceof ApiError ? e.message : 'No se pudo completar la acción'); }
  };
}

function Cuentas({ datos, cargando, error, recargar }: Carga<Usuario>) {
  const hacer = useAccion(recargar);
  if (cargando && !datos) return <Cargando />;
  return (<>
    <ErrorMensaje texto={error} />
    {datos?.length === 0 && <Vacio titulo="No hay cuentas pendientes" texto="Todas las cuentas nuevas ya fueron revisadas." />}
    {datos?.map((u) => (
      <div className="list-row" key={u.id}>
        <div>
          <strong>{u.nombre}</strong>
          <div className="seller">{u.correo} · {u.vereda ?? 'sin vereda'}</div>
          <div className="listing-status">Registrada el {fechaCorta(u.creadoEn)}. Verifica que sea habitante de Manta.</div>
        </div>
        <div className="list-row-actions">
          <button className="btn btn-primary" onClick={() => hacer(() => admin.cambiarEstadoUsuario(u.id, 'ACTIVO'), 'Cuenta aprobada')}>Aprobar</button>
          <button className="btn btn-danger" onClick={() => window.confirm(`¿Suspender la cuenta de ${u.nombre}?`) && hacer(() => admin.cambiarEstadoUsuario(u.id, 'SUSPENDIDO'), 'Cuenta suspendida')}>Suspender</button>
        </div>
      </div>
    ))}
  </>);
}

function Publicaciones({ datos, cargando, error, recargar }: Carga<Publicacion>) {
  const hacer = useAccion(recargar);
  const [rechazando, setRechazando] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  if (cargando && !datos) return <Cargando />;
  return (<>
    <ErrorMensaje texto={error} />
    {datos?.length === 0 && <Vacio titulo="No hay publicaciones por revisar" />}
    {datos?.map((p) => (
      <div className="list-row" key={p.id} style={{ alignItems: 'flex-start' }}>
        <div style={{ width: 84, height: 84, flex: '0 0 84px', borderRadius: 10, overflow: 'hidden' }}><Imagen src={p.imagenes[0]} alt="" /></div>
        <div style={{ flex: '1 1 260px' }}>
          <strong>{p.titulo}</strong> <span className="estado PENDIENTE">En revisión</span>
          <div className="seller">{p.categoria.nombre} · {p.precio} · de {p.productor.nombreNegocio || p.productor.nombre}</div>
          <p style={{ margin: '6px 0', whiteSpace: 'pre-line' }}>{p.descripcion}</p>
          {rechazando === p.id && (
            <div>
              <label htmlFor={`m${p.id}`} className="seller">Motivo (lo verá el productor)</label>
              <textarea id={`m${p.id}`} rows={2} maxLength={500} value={motivo} onChange={(e) => setMotivo(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--ink)' }} />
              <div className="list-row-actions" style={{ marginTop: 8 }}>
                <button className="btn btn-danger" disabled={!motivo.trim()} onClick={() => hacer(() => admin.moderar(p.id, 'RECHAZAR', motivo.trim()), 'Publicación rechazada').then(() => { setRechazando(null); setMotivo(''); })}>Confirmar rechazo</button>
                <button className="btn btn-outline" onClick={() => setRechazando(null)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
        {rechazando !== p.id && (
          <div className="list-row-actions">
            <button className="btn btn-primary" onClick={() => hacer(() => admin.moderar(p.id, 'APROBAR'), 'Publicación aprobada')}>Aprobar</button>
            <button className="btn btn-danger" onClick={() => { setRechazando(p.id); setMotivo(''); }}>Rechazar</button>
          </div>
        )}
      </div>
    ))}
  </>);
}

const DECISIONES = [
  ['MANTENER', 'Mantenerla (el reporte no procede)'],
  ['SOLICITAR_CAMBIOS', 'Pedir cambios al productor'],
  ['OCULTAR', 'Ocultarla temporalmente'],
  ['RETIRAR', 'Retirarla definitivamente'],
] as const;

function Reportes({ datos, cargando, error, recargar }: Carga<Reporte>) {
  const hacer = useAccion(recargar);
  const [decision, setDecision] = useState<Record<number, (typeof DECISIONES)[number][0]>>({});
  const [coment, setComent] = useState<Record<number, string>>({});
  if (cargando && !datos) return <Cargando />;
  return (<>
    <ErrorMensaje texto={error} />
    {datos?.length === 0 && <Vacio titulo="No hay reportes pendientes" />}
    {datos?.map((r) => {
      const d = decision[r.id] ?? 'MANTENER';
      const falta = d !== 'MANTENER' && !(coment[r.id] ?? '').trim();
      return (
        <div className="list-row" key={r.id} style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 260px' }}>
            <strong>{r.publicacion.titulo}</strong>
            <div className="seller">Motivo: {r.motivo} · {fechaCorta(r.creadoEn)}</div>
            {r.comentario && <p style={{ margin: '4px 0' }}>“{r.comentario}”</p>}
          </div>
          <div style={{ flex: '1 1 260px' }}>
            <label className="seller" htmlFor={`d${r.id}`}>Decisión</label>
            <select id={`d${r.id}`} value={d} onChange={(e) => setDecision((x) => ({ ...x, [r.id]: e.target.value as typeof d }))} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--ink)', minHeight: 44 }}>
              {DECISIONES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
            {d !== 'MANTENER' && <textarea aria-label="Comentario para el productor" placeholder="Comentario (lo verá el productor)" rows={2} maxLength={500} value={coment[r.id] ?? ''} onChange={(e) => setComent((x) => ({ ...x, [r.id]: e.target.value }))} style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--ink)' }} />}
            <button className="btn btn-primary" style={{ marginTop: 8 }} disabled={falta} onClick={() => hacer(() => admin.resolverReporte(r.id, d, (coment[r.id] ?? '').trim() || undefined), 'Reporte resuelto')}>Resolver</button>
          </div>
        </div>
      );
    })}
  </>);
}
