import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, auth } from '../api';
import { Campo } from '../components/ui/Campo';
import { ErrorMensaje } from '../components/ui/Mensaje';

/** CU5 – paso 1: la persona escribe su correo y le llega un enlace. */
export default function OlvideContrasena() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setEnviando(true);
    try { setAviso((await auth.olvideContrasena(correo.trim())).mensaje); }
    catch (err) { setError(err instanceof ApiError ? err.message : 'No se pudo enviar la solicitud'); }
    finally { setEnviando(false); }
  };

  if (aviso) return (
    <section className="screen">
      <div className="authbox">
        <h3>Revisa tu correo</h3>
        <p role="status">{aviso}</p>
        <p className="settings-note">Si no lo ves en unos minutos, mira en “Spam” o “Correo no deseado”.</p>
        <Link to="/ingresar" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Volver a ingresar</Link>
      </div>
    </section>
  );

  return (
    <section className="screen">
      <form className="authbox" onSubmit={enviar}>
        <h3 style={{ marginBottom: 4 }}>¿Olvidaste tu contraseña?</h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>Escribe el correo con el que te registraste y te enviamos un enlace para crear una nueva.</p>
        <Campo etiqueta="Correo electrónico">{(id) => <input id={id} type="email" autoComplete="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="ana@correo.com" maxLength={120} />}</Campo>
        <ErrorMensaje texto={error} />
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar enlace'}</button>
        <p style={{ textAlign: 'center', marginBottom: 0 }}><Link to="/ingresar" className="link">← Volver a ingresar</Link></p>
      </form>
    </section>
  );
}
