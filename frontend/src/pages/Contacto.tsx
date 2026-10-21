import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, contacto } from '../api';
import { Campo } from '../components/ui/Campo';
import { ErrorMensaje } from '../components/ui/Mensaje';
import { useAuth } from '../context/AuthContext';

/** CU11: formulario de contacto general con el equipo del portal. */
export default function Contacto() {
  const { usuario } = useAuth();
  const [f, setF] = useState({ nombre: usuario?.nombre ?? '', correo: usuario?.correo ?? '', asunto: '', mensaje: '' });
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));

  const enviar = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setEnviando(true);
    try { setAviso((await contacto.enviar({ nombre: f.nombre.trim(), correo: f.correo.trim(), asunto: f.asunto.trim(), mensaje: f.mensaje.trim() })).mensaje); }
    catch (err) { setError(err instanceof ApiError ? err.message : 'No se pudo enviar el mensaje'); }
    finally { setEnviando(false); }
  };

  if (aviso) return (
    <section className="screen"><div className="authbox">
      <h3>¡Gracias por escribirnos!</h3>
      <p role="status">{aviso}</p>
      <p className="settings-note">También te enviamos una confirmación a tu correo.</p>
      <Link to="/" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Volver al inicio</Link>
    </div></section>
  );

  return (
    <section className="screen">
      <form className="authbox" onSubmit={enviar}>
        <h3 style={{ marginBottom: 4 }}>Contacto</h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>¿Una duda, un problema o una idea? Escríbele al equipo de MantaLink.</p>
        <Campo etiqueta="Tu nombre" requerido>{(id) => <input id={id} required minLength={2} maxLength={100} value={f.nombre} onChange={set('nombre')} autoComplete="name" />}</Campo>
        <Campo etiqueta="Tu correo" requerido ayuda="Aquí te respondemos.">{(id) => <input id={id} type="email" required maxLength={120} value={f.correo} onChange={set('correo')} autoComplete="email" />}</Campo>
        <Campo etiqueta="Asunto" requerido>{(id) => <input id={id} required maxLength={120} value={f.asunto} onChange={set('asunto')} />}</Campo>
        <Campo etiqueta="Mensaje" requerido>{(id) => <textarea id={id} required minLength={10} maxLength={2000} rows={5} value={f.mensaje} onChange={set('mensaje')} />}</Campo>
        <ErrorMensaje texto={error} />
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar mensaje'}</button>
      </form>
    </section>
  );
}
