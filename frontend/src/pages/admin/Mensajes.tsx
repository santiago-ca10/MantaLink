import { useState } from 'react';
import { admin } from '../../api';
import { Cargando, ErrorMensaje, Vacio } from '../../components/ui/Mensaje';
import { useCarga } from '../../hooks/useCarga';
import { fechaCorta } from '../../utils/format';
import { useAccion } from './comun';

/** CU11: mensajes que llegan por el formulario de contacto. El correo se muestra como texto + enlace mailto (nunca como HTML). */
export function Mensajes() {
  const [soloPendientes, setSoloPendientes] = useState(true);
  const lista = useCarga(() => admin.mensajes(soloPendientes), [soloPendientes]);
  const hacer = useAccion(lista.recargar);

  return (<>
    <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
      <input type="checkbox" checked={soloPendientes} onChange={(e) => setSoloPendientes(e.target.checked)} /> Mostrar solo los pendientes de responder
    </label>
    {lista.cargando && !lista.datos ? <Cargando /> : <ErrorMensaje texto={lista.error} />}
    {lista.datos?.length === 0 && <Vacio titulo={soloPendientes ? 'No hay mensajes pendientes' : 'Aún no hay mensajes'} />}
    {lista.datos?.map((m) => (
      <div className="list-row" key={m.id} style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 300px' }}>
          <strong>{m.asunto}</strong> {m.atendido && <span className="estado APROBADA">Atendido</span>}
          <div className="seller">{m.nombre} · <a className="link" href={`mailto:${encodeURIComponent(m.correo)}?subject=${encodeURIComponent('Re: ' + m.asunto)}`}>{m.correo}</a> · {fechaCorta(m.creadoEn)}</div>
          <p style={{ margin: '6px 0', whiteSpace: 'pre-line' }}>{m.mensaje}</p>
        </div>
        <div className="list-row-actions">
          <button className="btn btn-outline" onClick={() => hacer(() => admin.marcarMensaje(m.id, !m.atendido), m.atendido ? 'Marcado como pendiente' : 'Marcado como atendido')}>{m.atendido ? 'Marcar pendiente' : 'Marcar atendido'}</button>
        </div>
      </div>
    ))}
  </>);
}
