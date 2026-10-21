import { Link } from 'react-router-dom';
import type { Publicacion } from '../../types';
import { Imagen } from './Imagen';
import { useToast } from '../../context/ToastContext';
import { compartir } from '../../utils/compartir';

interface Props { p: Publicacion; esFavorito?: boolean; onFavorito?: (p: Publicacion) => void }

export function TarjetaPublicacion({ p, esFavorito, onFavorito }: Props) {
  const avisar = useToast();
  const vendedor = p.productor.nombreNegocio || p.productor.nombre;
  const compartirTarjeta = async () => {
    try {
      const resultado = await compartir(`/oferta/${p.id}`, p.titulo);
      if (resultado === 'copiado') avisar('Enlace copiado.');
    } catch (error) {
      avisar(error instanceof Error ? error.message : 'No se pudo compartir la publicación.');
    }
  };
  return (
    <article className="card">
      <button className="card-share" type="button" onClick={compartirTarjeta} aria-label={`Compartir ${p.titulo}`} title="Compartir publicación">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
        </svg>
      </button>
      {onFavorito && (
        <button className={`card-fav${esFavorito ? ' active' : ''}`} onClick={() => onFavorito(p)}
          aria-pressed={!!esFavorito} aria-label={esFavorito ? `Quitar ${p.titulo} de favoritos` : `Guardar ${p.titulo} en favoritos`}>♥</button>
      )}
      {/* Toda la tarjeta es un enlace real: funciona con teclado y se puede abrir en otra pestaña */}
      <Link to={`/oferta/${p.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
        <Imagen src={p.imagenes[0]} alt={p.titulo} className="card-image" />
        <div className="body">
          <h4>{p.titulo}</h4>
          <div className="seller">{vendedor}</div>
          {(p.ubicacion || p.productor.vereda) && <div className="seller">{p.ubicacion || p.productor.vereda}</div>}
          <div className="seller">{p.categoria.nombre}{p.subcategoria ? ` · ${p.subcategoria}` : ''}</div>
          <div className="price">{p.precio}</div>
        </div>
      </Link>
    </article>
  );
}
