import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError, archivos, categorias, DatosPublicacion, publicaciones } from '../api';
import { Campo } from '../components/ui/Campo';
import { Imagen } from '../components/ui/Imagen';
import { Cargando, ErrorMensaje } from '../components/ui/Mensaje';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCarga } from '../hooks/useCarga';
import { prepararFoto } from '../utils/foto';

const MAX_FOTOS = 5;

/** Sirve para crear (/vender/nueva) y para editar (/vender/:id/editar). */
export default function PublicacionForm() {
  const { id } = useParams();
  const editando = id !== undefined;
  const navegar = useNavigate();
  const avisar = useToast();
  const { usuario, puedePublicar } = useAuth();

  const cats = useCarga(() => categorias.listar(), []);
  const existente = useCarga(async () => (editando ? (await publicaciones.mias()).find((p) => p.id === Number(id)) ?? null : null), [id]);

  const [f, setF] = useState({ categoriaId: 0, subcategoria: '', titulo: '', descripcion: '', precio: '', telefono: '', whatsapp: '', correoContacto: '', duracionDias: '', fechaEvento: '' });
  const [fotos, setFotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const selector = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: k === 'categoriaId' ? Number(e.target.value) : e.target.value, ...(k === 'categoriaId' ? { subcategoria: '' } : {}) }));

  // Al editar, se rellena el formulario con lo que ya existe; al crear, con el teléfono del perfil
  useEffect(() => {
    const p = existente.datos;
    if (p) {
      setF({ categoriaId: p.categoria.id, subcategoria: p.subcategoria ?? '', titulo: p.titulo, descripcion: p.descripcion, precio: p.precio, telefono: p.telefono ?? '', whatsapp: p.whatsapp ?? '', correoContacto: p.correoContacto ?? '', duracionDias: '', fechaEvento: p.fechaEvento ?? '' });
      setFotos(p.imagenes);
    } else if (!editando && usuario) setF((x) => ({ ...x, telefono: x.telefono || usuario.telefono || '' }));
  }, [existente.datos, editando, usuario]);

  if (!puedePublicar) return <section className="screen"><ErrorMensaje texto="Tu cuenta aún no puede publicar: debe ser verificada por un administrador." /><Link to="/vender" className="back">← Volver</Link></section>;
  if (cats.cargando || existente.cargando) return <Cargando />;
  if (editando && !existente.datos) return <section className="screen"><ErrorMensaje texto="No encontramos esa publicación." /><Link to="/vender" className="back">← Volver</Link></section>;

  const cat = cats.datos?.find((c) => c.id === f.categoriaId);
  const elegirFotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const elegidas = Array.from(e.target.files ?? []).slice(0, MAX_FOTOS - fotos.length);
    e.target.value = ''; // permite volver a elegir la misma foto
    if (!elegidas.length) return;
    setError(null); setSubiendo(true);
    try {
      const nuevas: string[] = [];
      for (const archivo of elegidas) nuevas.push(await archivos.subirFoto(await prepararFoto(archivo)));
      setFotos((l) => [...l, ...nuevas].slice(0, MAX_FOTOS));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la foto');
    } finally { setSubiendo(false); }
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault(); setError(null);
    if (!cat) { setError('Elige una categoría'); return; }
    if (subiendo) { setError('Espera a que termine de subirse la foto'); return; }

    const datos: DatosPublicacion = {
      titulo: f.titulo.trim(), descripcion: f.descripcion.trim(), precio: f.precio.trim(),
      imagenes: fotos,
      ...(f.subcategoria ? { subcategoria: f.subcategoria } : {}),
      ...(f.telefono.trim() ? { telefono: f.telefono.trim() } : {}),
      ...(f.whatsapp.trim() ? { whatsapp: f.whatsapp.trim() } : {}),
      ...(f.correoContacto.trim() ? { correoContacto: f.correoContacto.trim() } : {}),
      ...(cat.esEvento ? (f.fechaEvento ? { fechaEvento: f.fechaEvento } : {}) : f.duracionDias ? { duracionDias: Number(f.duracionDias) } : {}),
    };
    setEnviando(true);
    try {
      if (editando) { await publicaciones.actualizar(Number(id), datos); avisar('Cambios guardados. Se enviará a revisión de nuevo.'); }
      else { await publicaciones.crear({ ...datos, categoriaId: cat.id }); avisar('¡Listo! Tu publicación fue enviada a revisión.'); }
      navegar('/vender');
    } catch (err) { setError(err instanceof ApiError ? err.message : 'No se pudo guardar'); }
    finally { setEnviando(false); }
  };

  return (
    <section className="screen">
      <Link to="/vender" className="back" style={{ textDecoration: 'none' }}>← Volver a mis publicaciones</Link>
      <form className="publish-card" onSubmit={enviar}>
        <div className="publish-head"><h3>{editando ? 'Editar producto o servicio' : 'Publicar producto o servicio'}</h3></div>

        <Campo etiqueta="Categoría" requerido ayuda={editando ? 'La categoría no se puede cambiar. Si te equivocaste, elimina la publicación y crea otra.' : undefined}>
          {(fid) => <select id={fid} required disabled={editando} value={f.categoriaId || ''} onChange={set('categoriaId')}>
            <option value="" disabled>Elige una categoría…</option>
            {cats.datos?.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select>}
        </Campo>
        {cat && cat.subcategorias.length > 0 && (
          <Campo etiqueta="Tipo específico">{(fid) => <select id={fid} value={f.subcategoria} onChange={set('subcategoria')}><option value="">Sin especificar</option>{cat.subcategorias.map((s) => <option key={s}>{s}</option>)}</select>}</Campo>
        )}
        <Campo etiqueta="Nombre" requerido>{(fid) => <input id={fid} required maxLength={120} value={f.titulo} onChange={set('titulo')} placeholder="Ej: Panela orgánica" />}</Campo>
        <Campo etiqueta="Precio" requerido ayuda="Escríbelo como quieras que se vea: “$8.000 libra”, “Según destino”, “Entrada libre”.">{(fid) => <input id={fid} required maxLength={60} value={f.precio} onChange={set('precio')} placeholder="Ej: $8.000 libra" />}</Campo>
        <Campo etiqueta="Descripción" requerido>{(fid) => <textarea id={fid} required rows={4} maxLength={2000} value={f.descripcion} onChange={set('descripcion')} placeholder="Cuéntale a la comunidad qué ofreces…" />}</Campo>

        {cat?.esEvento
          ? <Campo etiqueta="Fecha del evento" requerido ayuda="Al pasar esta fecha, el evento se quita solo del catálogo.">{(fid) => <input id={fid} type="date" required value={f.fechaEvento} onChange={set('fechaEvento')} />}</Campo>
          : cat && <Campo etiqueta="Días que estará publicada" ayuda={`Entre ${cat.diasMin} y ${cat.diasMax} días. ${editando ? 'Déjalo vacío para no cambiarlo.' : `Si lo dejas vacío serán ${cat.diasMax}.`}`}>{(fid) => <input id={fid} type="number" min={cat.diasMin} max={cat.diasMax} step={1} value={f.duracionDias} onChange={set('duracionDias')} />}</Campo>}

        <p className="field-label-standalone">Fotos del producto (máximo {MAX_FOTOS})</p>
        <input ref={selector} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={elegirFotos} aria-label="Elegir fotos" />
        <div className="photo-grid">
          {fotos.map((u, i) => (
            <div key={u + i} className="photo-slot filled">
              <Imagen src={u} alt={`Foto ${i + 1}`} className="" />
              <button type="button" className="photo-remove" onClick={() => setFotos((l) => l.filter((_, n) => n !== i))} aria-label={`Quitar foto ${i + 1}`}>×</button>
            </div>
          ))}
          {fotos.length < MAX_FOTOS && (
            <button type="button" className="photo-slot add" onClick={() => selector.current?.click()} disabled={subiendo} aria-label="Agregar foto">
              {subiendo ? <span>Subiendo…</span> : <span>+ Foto</span>}
            </button>
          )}
        </div>

        <h4 className="contact-title">Contacto</h4>
        <Campo etiqueta="Teléfono">{(fid) => <input id={fid} type="tel" value={f.telefono} onChange={set('telefono')} placeholder="300 000 0000" />}</Campo>
        <Campo etiqueta="WhatsApp (si es distinto al teléfono)">{(fid) => <input id={fid} type="tel" value={f.whatsapp} onChange={set('whatsapp')} placeholder="300 000 0000" />}</Campo>
        <Campo etiqueta="Correo de contacto (opcional)">{(fid) => <input id={fid} type="email" value={f.correoContacto} onChange={set('correoContacto')} />}</Campo>

        <p className="settings-note">Un administrador revisará tu publicación antes de que aparezca en el catálogo.</p>
        <ErrorMensaje texto={error} />
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={enviando}>{enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Guardar y publicar'}</button>
      </form>
    </section>
  );
}
