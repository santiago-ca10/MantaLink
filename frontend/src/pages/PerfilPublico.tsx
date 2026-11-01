import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, publicaciones } from '../api';
import { Cargando, ErrorMensaje, Vacio } from '../components/ui/Mensaje';
import { TarjetaPublicacion } from '../components/ui/TarjetaPublicacion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCarga } from '../hooks/useCarga';

export default function PerfilPublico() {
  const { id = '' } = useParams();
  const { usuario } = useAuth();
  const avisar = useToast();
  const perfil = useCarga(() => publicaciones.perfilProductor(id), [id]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [errorValoracion, setErrorValoracion] = useState<string | null>(null);

  const calificar = async (e: FormEvent) => {
    e.preventDefault();
    setErrorValoracion(null);
    setEnviando(true);
    try {
      await publicaciones.calificarProductor(id, puntuacion);
      await perfil.recargar();
      avisar('Gracias por calificar a este productor.');
    } catch (err) {
      setErrorValoracion(err instanceof ApiError ? err.message : 'No se pudo guardar la calificación.');
    } finally { setEnviando(false); }
  };

  if (perfil.cargando && !perfil.datos) return <Cargando />;
  if (perfil.error || !perfil.datos) return <section className="screen"><ErrorMensaje texto={perfil.error ?? 'No encontramos este perfil.'} /><Link className="back" to="/">← Volver al catálogo</Link></section>;

  const { productor, publicaciones: ofertas, calificacion } = perfil.datos;
  const nombre = productor.nombreNegocio || productor.nombre;
  return (
    <section className="screen">
      <Link className="back" to="/">← Volver al catálogo</Link>
      <div className="profile-card" style={{ marginBottom: 20 }}>
        <div className="profile-avatar" aria-hidden="true">{nombre.charAt(0).toUpperCase()}</div>
        <h2>{nombre}</h2>
        <p className="seller">{productor.vereda ? `Vereda o barrio: ${productor.vereda}` : 'Productor de Manta'}</p>
        <p className="seller" aria-label="Calificación del productor">
          {calificacion.promedio === null ? 'Nuevo productor · Sin calificaciones' : `★ ${calificacion.promedio.toFixed(1)} · ${calificacion.cantidad} ${calificacion.cantidad === 1 ? 'calificación' : 'calificaciones'}`}
        </p>
        {usuario?.id === productor.id ? <p className="settings-note">No puedes calificar tu propio perfil.</p> : usuario?.estado === 'ACTIVO' ? (
          <form onSubmit={calificar} className="rating-form">
            <p id="etiqueta-puntuacion">Califica a este productor:</p>
            <div className="stars-input" role="group" aria-labelledby="etiqueta-puntuacion">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button key={estrella} type="button" className={`star-btn${puntuacion >= estrella ? ' filled' : ''}`}
                  aria-label={`${estrella} ${estrella === 1 ? 'estrella' : 'estrellas'}`} aria-pressed={puntuacion === estrella}
                  onClick={() => setPuntuacion(estrella)}>★</button>
              ))}
            </div>
            <ErrorMensaje texto={errorValoracion} />
            <button className="btn btn-primary" disabled={puntuacion === 0 || enviando}>{enviando ? 'Guardando…' : 'Guardar calificación'}</button>
            <p className="settings-note">Puedes cambiar tu calificación; solo se cuenta una por cuenta.</p>
          </form>
        ) : (
          <p className="settings-note"><Link to="/ingresar" className="link">Inicia sesión</Link> con una cuenta verificada para calificar.</p>
        )}
      </div>
      <div className="section-title"><h3>Publicaciones de {nombre}</h3><span className="seller">{ofertas.length}</span></div>
      {ofertas.length === 0 ? <Vacio titulo="Este productor aún no tiene publicaciones vigentes." /> :
        <div className="grid">{ofertas.map((p) => <TarjetaPublicacion key={p.id} p={p} />)}</div>}
    </section>
  );
}
