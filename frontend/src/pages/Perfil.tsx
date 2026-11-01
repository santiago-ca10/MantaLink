import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, auth } from '../api';
import { Campo } from '../components/ui/Campo';
import { ErrorMensaje } from '../components/ui/Mensaje';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ESTADO = { PENDIENTE: '⏳ Cuenta en verificación', ACTIVO: '✓ Cuenta verificada', SUSPENDIDO: 'Cuenta suspendida' } as const;

export default function Perfil() {
  const { usuario, cerrarSesion, refrescar } = useAuth();
  const avisar = useToast();
  const navegar = useNavigate();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState({ nombre: '', telefono: '', vereda: '', nombreNegocio: '' });
  const [errorPerfil, setErrorPerfil] = useState<string | null>(null);
  if (!usuario) return null;

  const empezarEdicion = () => { setDatos({ nombre: usuario.nombre, telefono: usuario.telefono ?? '', vereda: usuario.vereda ?? '', nombreNegocio: usuario.nombreNegocio ?? '' }); setErrorPerfil(null); setEditando(true); };
  const guardarPerfil = async (e: FormEvent) => {
    e.preventDefault(); setErrorPerfil(null);
    try { await auth.actualizarPerfil(datos); await refrescar(); avisar('Datos actualizados'); setEditando(false); }
    catch (err) { setErrorPerfil(err instanceof ApiError ? err.message : 'No se pudieron guardar los datos'); }
  };

  const cambiar = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setEnviando(true);
    try { const r = await auth.cambiarContrasena(actual, nueva); avisar(r.mensaje); setActual(''); setNueva(''); }
    catch (err) { setError(err instanceof ApiError ? err.message : 'No se pudo cambiar la contraseña'); }
    finally { setEnviando(false); }
  };

  return (
    <section className="screen">
      <div className="profile-card">
        <div className="profile-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg></div>
        <h3>{usuario.nombre}</h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '.87rem' }}>{usuario.rol === 'ADMIN' ? 'Administrador' : `Emprendedor · ${usuario.vereda ?? 'Manta'}`}</p>
        <span className="badge">{ESTADO[usuario.estado]}</span>
        <dl style={{ textAlign: 'left', margin: '18px 0 0' }}>
          <dt className="seller">Correo</dt><dd style={{ margin: '0 0 8px' }}>{usuario.correo}</dd>
          {usuario.telefono && <><dt className="seller">Teléfono</dt><dd style={{ margin: '0 0 8px' }}>{usuario.telefono}</dd></>}
          {usuario.nombreNegocio && <><dt className="seller">Negocio</dt><dd style={{ margin: '0 0 8px' }}>{usuario.nombreNegocio}</dd></>}
        </dl>

        {!editando && usuario.rol === 'PRODUCTOR' && <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={empezarEdicion}>Editar mis datos</button>}
        {editando && (
          <form onSubmit={guardarPerfil} style={{ textAlign: 'left' }}>
            <h4 className="contact-title">Mis datos</h4>
            <Campo etiqueta="Nombre completo" requerido>{(id) => <input id={id} required minLength={2} maxLength={100} value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />}</Campo>
            <Campo etiqueta="Teléfono">{(id) => <input id={id} type="tel" maxLength={20} value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} placeholder="300 000 0000" />}</Campo>
            <Campo etiqueta="Vereda o barrio">{(id) => <input id={id} maxLength={80} value={datos.vereda} onChange={(e) => setDatos({ ...datos, vereda: e.target.value })} />}</Campo>
            <Campo etiqueta="Nombre del negocio (opcional)">{(id) => <input id={id} maxLength={100} value={datos.nombreNegocio} onChange={(e) => setDatos({ ...datos, nombreNegocio: e.target.value })} />}</Campo>
            <ErrorMensaje texto={errorPerfil} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Guardar</button>
              <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          </form>
        )}

        <form onSubmit={cambiar} style={{ textAlign: 'left' }}>
          <h4 className="contact-title">Cambiar contraseña</h4>
          <Campo etiqueta="Contraseña actual">{(id) => <input id={id} type="password" required autoComplete="current-password" maxLength={72} value={actual} onChange={(e) => setActual(e.target.value)} />}</Campo>
          <Campo etiqueta="Contraseña nueva" ayuda="Mínimo 8 caracteres.">{(id) => <input id={id} type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} />}</Campo>
          <ErrorMensaje texto={error} />
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} disabled={enviando}>{enviando ? 'Guardando…' : 'Cambiar contraseña'}</button>
        </form>

        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 18 }} onClick={() => { cerrarSesion(); navegar('/'); }}>Cerrar sesión</button>
      </div>
      {usuario.rol === 'PRODUCTOR' && <Link to="/vender" className="sell-cta" style={{ display: 'block', maxWidth: 440, margin: '18px auto 0', textDecoration: 'none' }}><strong>Ir a mis publicaciones</strong></Link>}
    </section>
  );
}
