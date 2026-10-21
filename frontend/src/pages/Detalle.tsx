import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError, publicaciones } from '../api';
import { Carrusel } from '../components/ui/Carrusel';
import { Campo } from '../components/ui/Campo';
import { Cargando, ErrorMensaje } from '../components/ui/Mensaje';
import { useToast } from '../context/ToastContext';
import { useCarga } from '../hooks/useCarga';
import { useFavoritos } from '../hooks/useFavoritos';
import { MOTIVOS_REPORTE } from '../types';
import { diasHasta, enlaceLlamada, enlaceWhatsApp, fechaCorta } from '../utils/format';

export default function Detalle() {
  const { id } = useParams();
  const num = Number(id);
  const navegar = useNavigate();
  const avisar = useToast();
  const fav = useFavoritos();
  const { datos: p, cargando, error } = useCarga(() => publicaciones.detalle(num), [num]);

  const [reportando, setReportando] = useState(false);
  const [motivo, setMotivo] = useState<string>(MOTIVOS_REPORTE[0]);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errReporte, setErrReporte] = useState<string | null>(null);

  if (!Number.isInteger(num)) return <ErrorMensaje texto="Publicación no válida" />;
  if (cargando) return <Cargando />;
  if (error || !p) return (
    <section className="screen">
      <ErrorMensaje texto={error ?? 'Publicación no encontrada'} />
      <button className="back" onClick={() => navegar('/')}>← Volver al catálogo</button>
    </section>
  );

  const vendedor = p.productor.nombreNegocio || p.productor.nombre;
  const wa = enlaceWhatsApp(p.whatsapp || p.telefono, `Hola, vi "${p.titulo}" en MantaLink y quiero más información.`);
  const llamar = enlaceLlamada(p.telefono || p.whatsapp);
  const restantes = diasHasta(p.vigenteHasta);

  const enviarReporte = async (e: FormEvent) => {
    e.preventDefault(); setEnviando(true); setErrReporte(null);
    try {
      const r = await publicaciones.reportar(p.id, motivo, comentario.trim() || undefined);
      avisar(r.mensaje); setReportando(false); setComentario('');
    } catch (err) { setErrReporte(err instanceof ApiError ? err.message : 'No se pudo enviar el reporte'); }
    finally { setEnviando(false); }
  };

  return (
    <section className="screen">
      <button className="back" onClick={() => (window.history.length > 1 ? navegar(-1) : navegar('/'))}>← Volver al catálogo</button>
      <div className="detail">
        <Carrusel imagenes={p.imagenes} alt={p.titulo} />
        <div>
          <p className="seller" style={{ marginBottom: 4 }}>{p.categoria.nombre}{p.subcategoria ? ` · ${p.subcategoria}` : ''}</p>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 8 }}>{p.titulo}</h2>
          <div className="price" style={{ fontSize: '1.4rem' }}>{p.precio}</div>
          {(p.ubicacion || p.productor.vereda) && <p className="seller">Vereda o sector: {p.ubicacion || p.productor.vereda}</p>}
          {p.fechaEvento && <p className="seller">📅 {fechaCorta(p.fechaEvento)}</p>}
          {restantes !== null && restantes >= 0 && restantes <= 7 && <p className="seller">Disponible {restantes === 0 ? 'hasta hoy' : `${restantes} ${restantes === 1 ? 'día' : 'días'} más`}</p>}
          {/* Texto plano: React escapa el contenido, así que ningún HTML escrito por un usuario se ejecuta */}
          <p style={{ whiteSpace: 'pre-line', marginTop: 14 }}>{p.descripcion}</p>

          <div className="seller-box">
            <div className="avatar" aria-hidden="true">{vendedor.charAt(0).toUpperCase()}</div>
            <div><strong>{vendedor}</strong><div className="seller">{p.productor.vereda ? `Vereda/barrio: ${p.productor.vereda}` : 'Manta, Cundinamarca'}</div></div>
          </div>

          <div className="contact-row">
            {wa && <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a>}
            {llamar && <a className="btn btn-outline" href={llamar}>Llamar al productor</a>}
            {p.correoContacto && <a className="btn btn-outline" href={`mailto:${encodeURIComponent(p.correoContacto)}`}>Escribir correo</a>}
            {!wa && !llamar && !p.correoContacto && <p className="seller">Este productor aún no dejó datos de contacto.</p>}
            <button className="btn btn-outline" aria-pressed={fav.ids.has(p.id)} onClick={() => fav.alternar(p)}>{fav.ids.has(p.id) ? '♥ Guardado' : '♡ Guardar'}</button>
          </div>

          <div className="report-box">
            {!reportando ? (
              <button className="text-link" onClick={() => setReportando(true)}>⚑ Reportar esta publicación</button>
            ) : (
              <form id="reporteForm" onSubmit={enviarReporte}>
                <Campo etiqueta="¿Qué problema tiene?">{(fid) => <select id={fid} value={motivo} onChange={(e) => setMotivo(e.target.value)}>{MOTIVOS_REPORTE.map((m) => <option key={m}>{m}</option>)}</select>}</Campo>
                <Campo etiqueta="Cuéntanos más (opcional)">{(fid) => <textarea id={fid} rows={3} maxLength={500} value={comentario} onChange={(e) => setComentario(e.target.value)} />}</Campo>
                <ErrorMensaje texto={errReporte} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar reporte'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => setReportando(false)}>Cancelar</button>
                </div>
              </form>
            )}
          </div>
          <p className="settings-note">MantaLink no cobra comisiones ni maneja pagos: el acuerdo se hace directamente con quien ofrece. <Link to="/ayuda" className="link">Más ayuda</Link></p>
        </div>
      </div>
    </section>
  );
}
