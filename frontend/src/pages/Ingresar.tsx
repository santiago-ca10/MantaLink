import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../api';
import { Campo } from '../components/ui/Campo';
import { ErrorMensaje } from '../components/ui/Mensaje';
import { useAuth } from '../context/AuthContext';

export default function Ingresar() {
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const desde = (useLocation().state as { desde?: string } | null)?.desde;
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setEnviando(true);
    try {
      const u = await iniciarSesion(correo.trim(), clave);
      navegar(desde ?? (u.rol === 'ADMIN' ? '/admin' : '/'), { replace: true });
    } catch (err) { setError(err instanceof ApiError ? err.message : 'No se pudo ingresar'); }
    finally { setEnviando(false); }
  };

  return (
    <section className="screen">
      <form className="authbox" onSubmit={enviar}>
        <h3 style={{ marginBottom: 4 }}>Ingresar a tu cuenta</h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>Para publicar y gestionar lo que ofreces.</p>
        <Campo etiqueta="Correo electrónico">{(id) => <input id={id} type="email" autoComplete="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="ana@correo.com" />}</Campo>
        <Campo etiqueta="Contraseña">{(id) => <input id={id} type="password" autoComplete="current-password" required value={clave} onChange={(e) => setClave(e.target.value)} placeholder="••••••••" maxLength={72} />}</Campo>
        <ErrorMensaje texto={error} />
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={enviando}>{enviando ? 'Ingresando…' : 'Ingresar'}</button>
        <p style={{ textAlign: 'center', marginBottom: 0 }}>¿No tienes cuenta? <Link to="/registro" className="link">Regístrate</Link></p>
        <p className="settings-note" style={{ textAlign: 'center' }}>¿Olvidaste tu contraseña? Por ahora escríbele a un administrador del portal.</p>
      </form>
    </section>
  );
}
