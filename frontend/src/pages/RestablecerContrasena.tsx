import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError, auth } from '../api';
import { Campo } from '../components/ui/Campo';
import { ErrorMensaje } from '../components/ui/Mensaje';
import { useToast } from '../context/ToastContext';

/** CU5 – paso 2: llega desde el enlace del correo (/restablecer?token=…) y crea la contraseña nueva. */
export default function RestablecerContrasena() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navegar = useNavigate();
  const avisar = useToast();
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!/^[0-9a-f]{64}$/.test(token)) return (
    <section className="screen">
      <div className="authbox">
        <h3>Enlace no válido</h3>
        <p>Este enlace está incompleto. Pide uno nuevo desde “¿Olvidaste tu contraseña?”.</p>
        <Link to="/olvide-contrasena" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Pedir un enlace nuevo</Link>
      </div>
    </section>
  );

  const enviar = async (e: FormEvent) => {
    e.preventDefault(); setError(null);
    if (nueva !== confirmar) { setError('Las contraseñas no coinciden'); return; }
    setEnviando(true);
    try {
      const r = await auth.restablecerContrasena(token, nueva);
      avisar(r.mensaje);
      navegar('/ingresar', { replace: true }); // replace: el enlace con el token sale del historial
    } catch (err) { setError(err instanceof ApiError ? err.message : 'No se pudo cambiar la contraseña'); }
    finally { setEnviando(false); }
  };

  return (
    <section className="screen">
      <form className="authbox" onSubmit={enviar}>
        <h3 style={{ marginBottom: 4 }}>Crea tu nueva contraseña</h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>Mínimo 8 caracteres.</p>
        <Campo etiqueta="Contraseña nueva">{(id) => <input id={id} type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={nueva} onChange={(e) => setNueva(e.target.value)} />}</Campo>
        <Campo etiqueta="Repite la contraseña nueva">{(id) => <input id={id} type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />}</Campo>
        <ErrorMensaje texto={error} />
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar contraseña'}</button>
        {error && /venci|válido/.test(error) && <p style={{ textAlign: 'center' }}><Link to="/olvide-contrasena" className="link">Pedir un enlace nuevo</Link></p>}
      </form>
    </section>
  );
}
