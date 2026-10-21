import { Link } from 'react-router-dom';
import type { Publicacion } from '../../types';
import { Imagen } from './Imagen';

interface Props { p: Publicacion; esFavorito?: boolean; onFavorito?: (p: Publicacion) => void }

export function TarjetaPublicacion({ p, esFavorito, onFavorito }: Props) {
  const vendedor = p.productor.nombreNegocio || p.productor.nombre;
  return (
    <article className="card">
      {onFavorito && (
        <button className={`card-fav${esFavorito ? ' active' : ''}`} onClick={() => onFavorito(p)}
          aria-pressed={!!esFavorito} aria-label={esFavorito ? `Quitar ${p.titulo} de favoritos` : `Guardar ${p.titulo} en favoritos`}>♥</button>
      )}
      {/* Toda la tarjeta es un enlace real: funciona con teclado y se puede abrir en otra pestaña */}
      <Link to={`/oferta/${p.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
        <Imagen src={p.imagenes[0]} alt="" />
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
