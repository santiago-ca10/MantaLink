import { useState } from 'react';
import { admin } from '../../api';
import { Paginacion } from '../../components/ui/Paginacion';
import { Cargando, ErrorMensaje, Vacio } from '../../components/ui/Mensaje';
import { useCarga } from '../../hooks/useCarga';
import { fechaCorta } from '../../utils/format';
import { ESTILO_CONTROL, useAccion } from './comun';

const ESTADOS = [['', 'Todos'], ['PENDIENTE', 'En verificación'], ['ACTIVO', 'Activos'], ['SUSPENDIDO', 'Suspendidos']] as const;
const ETIQUETA = { PENDIENTE: 'En verificación', ACTIVO: 'Activa', SUSPENDIDO: 'Suspendida' } as const;

/** CU9: ver, buscar y activar/suspender a los productores. */
export function Usuarios() {
  const [texto, setTexto] = useState('');
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const lista = useCarga(() => admin.usuarios({ q, estado, pagina }), [q, estado, pagina]);
  const hacer = useAccion(lista.recargar);

  return (<>
    <form role="search" onSubmit={(e) => { e.preventDefault(); setPagina(1); setQ(texto.trim()); }} style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
      <input aria-label="Buscar usuario por nombre, correo o negocio" placeholder="Buscar por nombre, correo o negocio…" value={texto} maxLength={80} onChange={(e) => setTexto(e.target.value)} style={{ ...ESTILO_CONTROL, flex: '1 1 240px', width: 'auto' }} />
      <button className="btn btn-primary">Buscar</button>
    </form>
    <label className="seller" htmlFor="filtro-estado">Estado de la cuenta</label>
    <select id="filtro-estado" value={estado} onChange={(e) => { setPagina(1); setEstado(e.target.value); }} style={{ ...ESTILO_CONTROL, maxWidth: 260, marginBottom: 14 }}>
      {ESTADOS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
    </select>
    {lista.cargando && !lista.datos ? <Cargando /> : <ErrorMensaje texto={lista.error} />}
    {lista.datos?.items.length === 0 && <Vacio titulo="No hay usuarios con ese filtro" />}
    {lista.datos?.items.map((u) => (
      <div className="list-row" key={u.id}>
        <div>
          <strong>{u.nombre}</strong> <span className={`estado ${u.estado === 'ACTIVO' ? 'APROBADA' : u.estado === 'PENDIENTE' ? 'PENDIENTE' : 'RECHAZADA'}`}>{ETIQUETA[u.estado]}</span>
          <div className="seller">{u.correo}{u.telefono ? ` · ${u.telefono}` : ''} · {u.vereda ?? 'sin vereda'}{u.nombreNegocio ? ` · ${u.nombreNegocio}` : ''}</div>
          <div className="listing-status">Registrada el {fechaCorta(u.creadoEn)}</div>
        </div>
        <div className="list-row-actions">
          {u.estado !== 'ACTIVO' && <button className="btn btn-primary" onClick={() => hacer(() => admin.cambiarEstadoUsuario(u.id, 'ACTIVO'), u.estado === 'SUSPENDIDO' ? 'Cuenta reactivada' : 'Cuenta aprobada')}>{u.estado === 'SUSPENDIDO' ? 'Reactivar' : 'Aprobar'}</button>}
          {u.estado !== 'SUSPENDIDO' && <button className="btn btn-danger" onClick={() => window.confirm(`¿Suspender la cuenta de ${u.nombre}? No podrá ingresar y sus publicaciones dejarán de verse.`) && hacer(() => admin.cambiarEstadoUsuario(u.id, 'SUSPENDIDO'), 'Cuenta suspendida')}>Suspender</button>}
        </div>
      </div>
    ))}
    {lista.datos && lista.datos.paginas > 1 && <Paginacion pagina={lista.datos.pagina} paginas={lista.datos.paginas} onCambiar={setPagina} />}
  </>);
}
