import { Link } from 'react-router-dom';
import { favoritos } from '../api';
import { Cargando, ErrorMensaje, Vacio } from '../components/ui/Mensaje';
import { TarjetaPublicacion } from '../components/ui/TarjetaPublicacion';
import { useCarga } from '../hooks/useCarga';

export default function Favoritos() {
  const { datos, setDatos, cargando, error } = useCarga(() => favoritos.listar(), []);
  const quitar = async (id: number) => {
    setDatos((l) => (l ? l.filter((p) => p.id !== id) : l));
    try { await favoritos.quitar(id); } catch { /* si falla, al recargar vuelve a aparecer */ }
  };
  return (
    <section className="screen">
      <div className="section-title"><h3>♥ Mis favoritos</h3></div>
      <ErrorMensaje texto={error} />
      {cargando ? <Cargando /> : datos && datos.length === 0
        ? <Vacio titulo="Todavía no guardas nada" texto="Toca el corazón en cualquier publicación para encontrarla aquí." />
        : <div className="grid">{datos?.map((p) => <TarjetaPublicacion key={p.id} p={p} esFavorito onFavorito={(x) => quitar(x.id)} />)}</div>}
      <p style={{ marginTop: 20 }}><Link to="/" className="link">← Volver al catálogo</Link></p>
    </section>
  );
}
