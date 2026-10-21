import { FormEvent, useState } from 'react';
import { admin, ApiError } from '../../api';
import { Campo } from '../../components/ui/Campo';
import { Cargando, ErrorMensaje } from '../../components/ui/Mensaje';
import { useToast } from '../../context/ToastContext';
import { useCarga } from '../../hooks/useCarga';
import type { Categoria } from '../../types';
import { ESTILO_CONTROL, useAccion } from './comun';

interface Form { id?: number; nombre: string; descripcion: string; diasMin: string; diasMax: string; esEvento: boolean; subcategorias: string }
const VACIO: Form = { nombre: '', descripcion: '', diasMin: '1', diasMax: '30', esEvento: false, subcategorias: '' };
const aForm = (c: Categoria): Form => ({ id: c.id, nombre: c.nombre, descripcion: c.descripcion ?? '', diasMin: String(c.diasMin), diasMax: String(c.diasMax), esEvento: c.esEvento, subcategorias: c.subcategorias.join(', ') });

/** CU7: crear, editar y desactivar categorías. Al desactivar una con publicaciones hay que elegir a cuál pasan. */
export function Categorias() {
  const lista = useCarga(() => admin.categorias(), []);
  const hacer = useAccion(lista.recargar);
  const avisar = useToast();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [desactivando, setDesactivando] = useState<Categoria | null>(null);
  const [destino, setDestino] = useState('');

  const guardar = async (e: FormEvent) => {
    e.preventDefault(); if (!form) return; setError(null);
    const subs = form.subcategorias.split(',').map((x) => x.trim()).filter(Boolean);
    const datos = { nombre: form.nombre.trim(), descripcion: form.descripcion.trim(), diasMin: Number(form.diasMin), diasMax: Number(form.diasMax), subcategorias: subs };
    try {
      if (form.id) await admin.editarCategoria(form.id, datos); else await admin.crearCategoria({ ...datos, esEvento: form.esEvento });
      avisar(form.id ? 'Categoría actualizada' : 'Categoría creada'); setForm(null); lista.recargar();
    } catch (err) { setError(err instanceof ApiError ? err.message : 'No se pudo guardar'); }
  };

  if (lista.cargando && !lista.datos) return <Cargando />;
  const activas = lista.datos?.filter((c) => c.activa) ?? [];

  return (<>
    <ErrorMensaje texto={lista.error} />
    {!form && <button className="btn btn-primary" style={{ marginBottom: 14 }} onClick={() => { setForm(VACIO); setError(null); }}>+ Nueva categoría</button>}

    {form && (
      <form className="authbox" style={{ maxWidth: 'none', marginBottom: 16 }} onSubmit={guardar}>
        <h4 style={{ marginTop: 0 }}>{form.id ? 'Editar categoría' : 'Nueva categoría'}</h4>
        <Campo etiqueta="Nombre" requerido>{(id) => <input id={id} required maxLength={60} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />}</Campo>
        <Campo etiqueta="Descripción (opcional)">{(id) => <input id={id} maxLength={300} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />}</Campo>
        <Campo etiqueta="Días mínimos publicada" requerido>{(id) => <input id={id} type="number" required min={1} max={365} value={form.diasMin} onChange={(e) => setForm({ ...form, diasMin: e.target.value })} />}</Campo>
        <Campo etiqueta="Días máximos publicada" requerido ayuda="Un animal dura poco; una artesanía puede durar meses.">{(id) => <input id={id} type="number" required min={1} max={365} value={form.diasMax} onChange={(e) => setForm({ ...form, diasMax: e.target.value })} />}</Campo>
        <Campo etiqueta="Subcategorías (separadas por coma)" ayuda="Opcional. Ejemplo: Frutas, Verduras, Tubérculos">{(id) => <input id={id} value={form.subcategorias} onChange={(e) => setForm({ ...form, subcategorias: e.target.value })} />}</Campo>
        {!form.id && <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}><input type="checkbox" checked={form.esEvento} onChange={(e) => setForm({ ...form, esEvento: e.target.checked })} /> Es una categoría de eventos (se publican con fecha y se quitan solos al pasar)</label>}
        <ErrorMensaje texto={error} />
        <div className="list-row-actions">
          <button className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>Cancelar</button>
        </div>
      </form>
    )}

    {lista.datos?.map((c) => (
      <div className="list-row" key={c.id} style={{ alignItems: 'flex-start', opacity: c.activa ? 1 : 0.65 }}>
        <div style={{ flex: '1 1 260px' }}>
          <strong>{c.nombre}</strong> {!c.activa && <span className="estado RECHAZADA">Desactivada</span>} {c.esEvento && <span className="estado PENDIENTE">Eventos</span>}
          <div className="seller">{c.totalPublicaciones ?? 0} publicación(es) · {c.diasMin}–{c.diasMax} días{c.subcategorias.length ? ` · ${c.subcategorias.join(', ')}` : ''}</div>
          {c.descripcion && <div className="listing-status">{c.descripcion}</div>}
          {desactivando?.id === c.id && (
            <div style={{ marginTop: 10 }}>
              {(c.totalPublicaciones ?? 0) > 0 ? (<>
                <label className="seller" htmlFor={`dest${c.id}`}>Esta categoría tiene {c.totalPublicaciones} publicación(es). ¿A qué categoría pasan?</label>
                <select id={`dest${c.id}`} value={destino} onChange={(e) => setDestino(e.target.value)} style={ESTILO_CONTROL}>
                  <option value="">Elige una categoría…</option>
                  {activas.filter((x) => x.id !== c.id && x.esEvento === c.esEvento).map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
                </select>
              </>) : <p className="seller" style={{ margin: 0 }}>No tiene publicaciones. Se desactivará sin más.</p>}
              <div className="list-row-actions" style={{ marginTop: 8 }}>
                <button className="btn btn-danger" disabled={(c.totalPublicaciones ?? 0) > 0 && !destino} onClick={async () => { if (await hacer(() => admin.desactivarCategoria(c.id, destino ? Number(destino) : undefined), 'Categoría desactivada')) setDesactivando(null); }}>Confirmar</button>
                <button className="btn btn-outline" onClick={() => setDesactivando(null)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
        {desactivando?.id !== c.id && (
          <div className="list-row-actions">
            <button className="btn btn-outline" onClick={() => { setForm(aForm(c)); setError(null); window.scrollTo({ top: 0 }); }}>Editar</button>
            {c.activa
              ? <button className="btn btn-danger" onClick={() => { setDesactivando(c); setDestino(''); }}>Desactivar</button>
              : <button className="btn btn-primary" onClick={() => hacer(() => admin.activarCategoria(c.id), 'Categoría activada')}>Activar</button>}
          </div>
        )}
      </div>
    ))}
  </>);
}
