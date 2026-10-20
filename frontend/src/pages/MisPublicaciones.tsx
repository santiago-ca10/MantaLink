import { Link } from 'react-router-dom';
import { ApiError, publicaciones } from '../api';
import { Cargando, ErrorMensaje, Vacio } from '../components/ui/Mensaje';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCarga } from '../hooks/useCarga';
import { ETIQUETA_ESTADO } from '../types';
import { diasHasta, fechaCorta } from '../utils/format';

export default function MisPublicaciones() {
  const { puedePublicar, usuario } = useAuth();
  const avisar = useToast();
  const { datos, cargando, error, recargar } = useCarga(() => publicaciones.mias(), []);

  const accion = async (fn: () => Promise<unknown>, ok: string) => {
    try { await fn(); avisar(ok); recargar(); } catch (e) { avisar(e instanceof ApiError ? e.message : 'No se pudo completar la acción'); }
  };
  const eliminar = (id: number, titulo: string) => {
    if (window.confirm(`¿Eliminar “${titulo}”? No se puede deshacer.`)) accion(() => publicaciones.eliminar(id), 'Publicación eliminada');
  };

  return (
    <section className="screen">
      <div className="section-title"><h3>Mis publicaciones</h3></div>
      {puedePublicar ? (
        <Link to="/vender/nueva" className="sell-cta" style={{ display: 'block', textDecoration: 'none' }}>
          <strong>+ Publicar producto o servicio</strong>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.87rem', margin: '6px 0 0' }}>Publica lo que ofreces en pocos pasos.</p>
        </Link>
      ) : (
        <Vacio titulo="Tu cuenta aún está en verificación" texto={usuario?.estado === 'SUSPENDIDO' ? 'Tu cuenta está suspendida.' : 'Un administrador debe aprobarla antes de que puedas publicar. Te avisaremos cuando esté lista.'} />
      )}

      <ErrorMensaje texto={error} />
      {cargando && !datos ? <Cargando /> : null}
      {datos && datos.length === 0 && puedePublicar && <Vacio titulo="Aún no has publicado nada" texto="Toca “Publicar producto o servicio” para empezar." />}

      {datos?.map((p) => {
        const dias = diasHasta(p.vigenteHasta);
        const vencida = dias !== null && dias < 0;
        return (
          <div className="list-row" key={p.id} style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 240px' }}>
              <strong>{p.titulo}</strong> <span className={`estado ${p.estado}`}>{ETIQUETA_ESTADO[p.estado]}</span>
              <div className="seller">{p.categoria.nombre} · {p.precio}</div>
              {p.estado === 'PENDIENTE' && <div className="listing-status">Un administrador la está revisando.</div>}
              {p.motivoRechazo && <div className="motivo-box"><strong>Motivo:</strong> {p.motivoRechazo}<br />Edítala y se enviará de nuevo a revisión.</div>}
              {p.estado === 'APROBADA' && p.vigenteHasta && <div className={`listing-status${vencida ? ' expired' : ''}`}>{vencida ? `⏱ Venció el ${fechaCorta(p.vigenteHasta)}` : `Publicada hasta el ${fechaCorta(p.vigenteHasta)}`}</div>}
              {p.fechaEvento && <div className="listing-status">📅 {fechaCorta(p.fechaEvento)}</div>}
            </div>
            <div className="list-row-actions">
              {p.estado === 'APROBADA' && !vencida && <Link className="btn btn-outline" to={`/oferta/${p.id}`}>Ver</Link>}
              {puedePublicar && <Link className="btn btn-outline" to={`/vender/${p.id}/editar`}>Editar</Link>}
              {p.estado === 'APROBADA' && <button className="btn btn-outline" onClick={() => accion(() => publicaciones.agotada(p.id), 'Marcada como agotada')}>Agotada</button>}
              <button className="btn btn-danger" onClick={() => eliminar(p.id, p.titulo)}>Eliminar</button>
            </div>
          </div>
        );
      })}
    </section>
  );
}
