import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categorias, publicaciones } from '../api';
import { IconoBuscar } from '../components/layout/iconos';
import { Cargando, ErrorMensaje, Vacio } from '../components/ui/Mensaje';
import { Paginacion } from '../components/ui/Paginacion';
import { TarjetaPublicacion } from '../components/ui/TarjetaPublicacion';
import { useCarga } from '../hooks/useCarga';
import { useFavoritos } from '../hooks/useFavoritos';
import { usePreferencias } from '../context/PreferenciasContext';
import { t } from '../utils/i18n';

const LIMITE = 12;

export default function Inicio() {
  // Los filtros viven en la URL: se pueden compartir y el botón "atrás" funciona
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const categoria = params.get('categoria') ?? '';
  const categoriasSeleccionadas = params.getAll('categorias');
  const categoriasKey = categoriasSeleccionadas.join('\u0000');
  const ubicacion = params.get('ubicacion') ?? '';
  const subcategoria = params.get('subcategoria') ?? '';
  const orden = params.get('orden') ?? 'recientes';
  const pagina = Math.max(1, Number(params.get('pagina')) || 1);

  const [texto, setTexto] = useState(q);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [categoriasBorrador, setCategoriasBorrador] = useState(categoriasSeleccionadas);
  const [ubicacionBorrador, setUbicacionBorrador] = useState(ubicacion);
  const [subcategoriaBorrador, setSubcategoriaBorrador] = useState(subcategoria);
  useEffect(() => setTexto(q), [q]);
  useEffect(() => setCategoriasBorrador(categoriasSeleccionadas), [categoriasKey]);
  useEffect(() => setUbicacionBorrador(ubicacion), [ubicacion]);
  useEffect(() => setSubcategoriaBorrador(subcategoria), [subcategoria]);

  const cats = useCarga(() => categorias.listar(), []);
  const lista = useCarga(() => publicaciones.catalogo({ q, categoria, categorias: categoriasSeleccionadas, ubicacion, subcategoria, orden, pagina, limite: LIMITE }), [q, categoria, categoriasKey, ubicacion, subcategoria, orden, pagina]);
  const fav = useFavoritos();
  const { idioma } = usePreferencias();

  const cambiar = (cambios: Record<string, string>) => {
    const n = new URLSearchParams(params);
    Object.entries(cambios).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    if (!('pagina' in cambios)) n.delete('pagina'); // cualquier filtro nuevo vuelve a la página 1
    setParams(n);
  };
  const buscar = (e: FormEvent) => { e.preventDefault(); cambiar({ q: texto.trim() }); };
  const aplicarFiltrosAvanzados = (e: FormEvent) => {
    e.preventDefault();
    const n = new URLSearchParams(params);
    n.delete('categoria');
    n.delete('categorias');
    [...new Set(categoriasBorrador)].forEach((nombre) => n.append('categorias', nombre));
    n.delete('ubicacion');
    if (ubicacionBorrador.trim()) n.set('ubicacion', ubicacionBorrador.trim());
    n.delete('subcategoria');
    const subcategoriasElegidas = cats.datos?.find((c) => categoriasBorrador.length === 1 && c.nombre === categoriasBorrador[0])?.subcategorias ?? [];
    if (subcategoriasElegidas.includes(subcategoriaBorrador)) n.set('subcategoria', subcategoriaBorrador);
    n.delete('pagina');
    setParams(n);
    setFiltrosAbiertos(false);
  };
  const limpiarFiltrosAvanzados = () => {
    setCategoriasBorrador([]);
    setUbicacionBorrador('');
    setSubcategoriaBorrador('');
    const n = new URLSearchParams(params);
    n.delete('categoria');
    n.delete('categorias');
    n.delete('ubicacion');
    n.delete('subcategoria');
    n.delete('pagina');
    setParams(n);
  };
  const subcategoriasAvanzadas = cats.datos?.find((c) => categoriasBorrador.length === 1 && c.nombre === categoriasBorrador[0])?.subcategorias ?? [];
  const catActual = cats.datos?.find((c) => c.nombre === categoria);
  const hayFiltrosAvanzados = categoriasSeleccionadas.length > 0 || Boolean(ubicacion);

  return (
    <section className="screen">
      <div className="hero">
        <h2>{t(idioma, 'hero')}</h2>
        <form className="searchbar" onSubmit={buscar} role="search">
          <div className="search-input-wrap">
            <IconoBuscar />
            <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={t(idioma, 'searchPlaceholder')} aria-label={t(idioma, 'searchPlaceholder')} maxLength={80} />
          </div>
          <button className="btn btn-primary" type="submit">{t(idioma, 'search')}</button>
          <button className="btn btn-outline" type="button" aria-expanded={filtrosAbiertos} aria-controls="filtros-avanzados"
            onClick={() => setFiltrosAbiertos((abiertos) => !abiertos)}>{t(idioma, 'advancedFilters')}{hayFiltrosAvanzados ? ' · activos' : ''}</button>
        </form>
        {filtrosAbiertos && (
          <form id="filtros-avanzados" className="adv-filters" onSubmit={aplicarFiltrosAvanzados}>
            <p className="adv-filters-title">{t(idioma, 'filterInstructions')}</p>
            <label className="field">
              <span>{t(idioma, 'location')}</span>
              <input maxLength={80} value={ubicacionBorrador} onChange={(e) => setUbicacionBorrador(e.target.value)} placeholder="Ej. Salitre" />
            </label>
            <div className="adv-filters-cats" role="group" aria-label={t(idioma, 'category')}>
              {cats.datos?.map((c) => (
                <label key={c.id} className="adv-cat-check">
                  <input type="checkbox" checked={categoriasBorrador.includes(c.nombre)}
                    onChange={(e) => setCategoriasBorrador((seleccionadas) => e.target.checked
                      ? [...seleccionadas, c.nombre]
                      : seleccionadas.filter((nombre) => nombre !== c.nombre))} />
                  {c.nombre}
                </label>
              ))}
            </div>
            {subcategoriasAvanzadas.length > 0 && (
              <label className="field">
                <span>{t(idioma, 'subtype')}</span>
                <select value={subcategoriaBorrador} onChange={(e) => setSubcategoriaBorrador(e.target.value)}>
                  <option value="">{t(idioma, 'any')}</option>
                  {subcategoriasAvanzadas.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            )}
            <div className="adv-filters-actions">
              <button className="btn btn-outline" type="button" onClick={limpiarFiltrosAvanzados}>{t(idioma, 'clear')}</button>
              <button className="btn btn-primary" type="submit">{t(idioma, 'apply')}</button>
            </div>
          </form>
        )}
      </div>

      <div className="chips-row">
        <div className="chips" role="group" aria-label="Categorías">
          <button className={`chip${!categoria ? ' active' : ''}`} aria-pressed={!categoria} onClick={() => cambiar({ categoria: '', categorias: '', subcategoria: '' })}>{t(idioma, 'all')}</button>
          {cats.datos?.map((c) => (
            <button key={c.id} className={`chip${categoria === c.nombre ? ' active' : ''}`} aria-pressed={categoria === c.nombre}
                onClick={() => cambiar({ categoria: c.nombre, categorias: '', subcategoria: '' })}>{c.nombre}</button>
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
            <option value="recientes">{idioma === 'en' ? 'Most recent' : 'Más recientes'}</option>
            <option value="precio_asc">{idioma === 'en' ? 'Price: low to high' : 'Precio: de menor a mayor'}</option>
            <option value="precio_desc">{idioma === 'en' ? 'Price: high to low' : 'Precio: de mayor a menor'}</option>
          </select>
        </div>
        {(q || categoria || categoriasSeleccionadas.length > 0 || ubicacion || subcategoria) && <button className="text-link" onClick={() => setParams({})}>{t(idioma, 'removeFilters')}</button>}
      </div>

      <div className="section-title">
        <h3>{q ? `${t(idioma, 'resultsFor')} “${q}”` : categoria || t(idioma, 'recent')}</h3>
        {lista.datos && <span style={{ color: 'var(--ink-soft)', fontSize: '.88rem' }}>{lista.datos.total} {idioma === 'en' ? (lista.datos.total === 1 ? 'result' : 'results') : (lista.datos.total === 1 ? 'resultado' : 'resultados')}</span>}
      </div>

      <ErrorMensaje texto={lista.error} />
      {lista.error && <button className="btn btn-outline" onClick={lista.recargar}>Reintentar</button>}
      {lista.cargando && !lista.datos ? <Cargando /> : null}
      {lista.datos && lista.datos.items.length === 0 && <Vacio titulo={t(idioma, 'noResults')} texto={t(idioma, 'noResultsHelp')} />}
      {lista.datos && lista.datos.items.length > 0 && (
        <div className="grid" aria-busy={lista.cargando}>
          {lista.datos.items.map((p) => <TarjetaPublicacion key={p.id} p={p} esFavorito={fav.ids.has(p.id)} onFavorito={fav.alternar} />)}
        </div>
      )}
      {lista.datos && <Paginacion pagina={lista.datos.pagina} paginas={lista.datos.paginas} onCambiar={(p) => cambiar({ pagina: String(p) })} />}
    </section>
  );
}
