import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categorias, publicaciones } from '../api';
import { IconoBuscar } from '../components/layout/iconos';
import { Cargando, ErrorMensaje, Vacio } from '../components/ui/Mensaje';
import { Paginacion } from '../components/ui/Paginacion';
import { TarjetaPublicacion } from '../components/ui/TarjetaPublicacion';
import { useCarga } from '../hooks/useCarga';
import { useFavoritos } from '../hooks/useFavoritos';

const LIMITE = 12;

export default function Inicio() {
  // Los filtros viven en la URL: se pueden compartir y el botón "atrás" funciona
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const categoria = params.get('categoria') ?? '';
  const subcategoria = params.get('subcategoria') ?? '';
  const orden = params.get('orden') ?? 'recientes';
  const pagina = Math.max(1, Number(params.get('pagina')) || 1);

  const [texto, setTexto] = useState(q);
  useEffect(() => setTexto(q), [q]);

  const cats = useCarga(() => categorias.listar(), []);
  const lista = useCarga(() => publicaciones.catalogo({ q, categoria, subcategoria, orden, pagina, limite: LIMITE }), [q, categoria, subcategoria, orden, pagina]);
  const fav = useFavoritos();

  const cambiar = (cambios: Record<string, string>) => {
    const n = new URLSearchParams(params);
    Object.entries(cambios).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    if (!('pagina' in cambios)) n.delete('pagina'); // cualquier filtro nuevo vuelve a la página 1
    setParams(n);
  };
  const buscar = (e: FormEvent) => { e.preventDefault(); cambiar({ q: texto.trim() }); };
  const catActual = cats.datos?.find((c) => c.nombre === categoria);

  return (
    <section className="screen">
      <div className="hero">
        <h2>¿Qué necesitas encontrar hoy en Manta?</h2>
        <form className="searchbar" onSubmit={buscar} role="search">
          <div className="search-input-wrap">
            <IconoBuscar />
            <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar producto o servicio…" aria-label="Buscar producto o servicio" maxLength={80} />
          </div>
          <button className="btn btn-primary" type="submit">Buscar</button>
        </form>
      </div>

      <div className="chips-row">
        <div className="chips" role="group" aria-label="Categorías">
          <button className={`chip${!categoria ? ' active' : ''}`} aria-pressed={!categoria} onClick={() => cambiar({ categoria: '', subcategoria: '' })}>Todos</button>
          {cats.datos?.map((c) => (
            <button key={c.id} className={`chip${categoria === c.nombre ? ' active' : ''}`} aria-pressed={categoria === c.nombre}
              onClick={() => cambiar({ categoria: c.nombre, subcategoria: '' })}>{c.nombre}</button>
          ))}
        </div>
      </div>

      <div className="toolbar">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {catActual && catActual.subcategorias.length > 0 && (
            <select aria-label="Tipo específico" value={subcategoria} onChange={(e) => cambiar({ subcategoria: e.target.value })}>
              <option value="">Todos los tipos de {catActual.nombre}</option>
              {catActual.subcategorias.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <select aria-label="Ordenar resultados" value={orden} onChange={(e) => cambiar({ orden: e.target.value === 'recientes' ? '' : e.target.value })}>
            <option value="recientes">Más recientes</option>
            <option value="precio_asc">Precio: de menor a mayor</option>
            <option value="precio_desc">Precio: de mayor a menor</option>
          </select>
        </div>
        {(q || categoria || subcategoria) && <button className="text-link" onClick={() => setParams({})}>Quitar filtros</button>}
      </div>

      <div className="section-title">
        <h3>{q ? `Resultados para “${q}”` : categoria || 'Publicaciones recientes'}</h3>
        {lista.datos && <span style={{ color: 'var(--ink-soft)', fontSize: '.88rem' }}>{lista.datos.total} {lista.datos.total === 1 ? 'resultado' : 'resultados'}</span>}
      </div>

      <ErrorMensaje texto={lista.error} />
      {lista.error && <button className="btn btn-outline" onClick={lista.recargar}>Reintentar</button>}
      {lista.cargando && !lista.datos ? <Cargando /> : null}
      {lista.datos && lista.datos.items.length === 0 && <Vacio titulo="No encontramos nada con esos filtros" texto="Prueba con otra palabra o quita los filtros." />}
      {lista.datos && lista.datos.items.length > 0 && (
        <div className="grid" aria-busy={lista.cargando}>
          {lista.datos.items.map((p) => <TarjetaPublicacion key={p.id} p={p} esFavorito={fav.ids.has(p.id)} onFavorito={fav.alternar} />)}
        </div>
      )}
      {lista.datos && <Paginacion pagina={lista.datos.pagina} paginas={lista.datos.paginas} onCambiar={(p) => cambiar({ pagina: String(p) })} />}
    </section>
  );
}
