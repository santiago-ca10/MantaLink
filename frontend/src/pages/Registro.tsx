import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, auth } from '../api';
import { Campo } from '../components/ui/Campo';
import { ErrorMensaje } from '../components/ui/Mensaje';

const TIPOS_DOC = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Otro'];

export default function Registro() {
  const [f, setF] = useState({ nombre: '', tipoDocumento: TIPOS_DOC[0], numeroDocumento: '', correo: '', telefono: '', vereda: '', nombreNegocio: '', contrasena: '', confirmarContrasena: '', residente: false });
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string; checked?: boolean; type?: string } }) =>
    setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? !!e.target.checked : e.target.value }));

  const enviar = async (e: FormEvent) => {
    e.preventDefault(); setError(null);
    if (f.contrasena !== f.confirmarContrasena) { setError('Las contraseñas no coinciden'); return; }
    setEnviando(true);
    try {
      const { telefono, nombreNegocio, ...resto } = f;
      const r = await auth.registro({ ...resto, correo: f.correo.trim(), ...(telefono.trim() ? { telefono: telefono.trim() } : {}), ...(nombreNegocio.trim() ? { nombreNegocio: nombreNegocio.trim() } : {}) });
      setListo(r.mensaje);
    } catch (err) { setError(err instanceof ApiError ? err.message : 'No se pudo crear la cuenta'); }
    finally { setEnviando(false); }
  };

  if (listo) return (
    <section className="screen"><div className="authbox" style={{ textAlign: 'center' }}>
      <h3>¡Cuenta creada!</h3><p>{listo}</p>
      <Link to="/ingresar" className="btn btn-primary" style={{ justifyContent: 'center', textDecoration: 'none' }}>Ir a ingresar</Link>
    </div></section>
  );

  return (
    <section className="screen">
      <form className="authbox" onSubmit={enviar}>
        <h3 style={{ marginBottom: 4 }}>Crear cuenta</h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>Solo para habitantes de Manta, Cundinamarca. Tu cuenta será verificada antes de poder publicar.</p>
        <Campo etiqueta="Nombre completo" requerido>{(id) => <input id={id} required autoComplete="name" maxLength={120} value={f.nombre} onChange={set('nombre')} placeholder="Ana Pérez" />}</Campo>
        <div className="field-row">
          <Campo etiqueta="Tipo de documento" requerido>{(id) => <select id={id} value={f.tipoDocumento} onChange={set('tipoDocumento')}>{TIPOS_DOC.map((t) => <option key={t}>{t}</option>)}</select>}</Campo>
          <Campo etiqueta="Número de documento" requerido>{(id) => <input id={id} required inputMode="numeric" value={f.numeroDocumento} onChange={set('numeroDocumento')} />}</Campo>
        </div>
        <Campo etiqueta="Correo electrónico" requerido>{(id) => <input id={id} type="email" required autoComplete="email" value={f.correo} onChange={set('correo')} placeholder="ana@correo.com" />}</Campo>
        <Campo etiqueta="Teléfono / WhatsApp" ayuda="Es el número con el que te contactarán los compradores.">{(id) => <input id={id} type="tel" autoComplete="tel" value={f.telefono} onChange={set('telefono')} placeholder="300 000 0000" />}</Campo>
        <Campo etiqueta="Vereda o barrio donde resides en Manta" requerido>{(id) => <input id={id} required value={f.vereda} onChange={set('vereda')} placeholder="Ej: Vereda El Salitre" />}</Campo>
        <Campo etiqueta="Nombre de tu negocio (si tienes)">{(id) => <input id={id} value={f.nombreNegocio} onChange={set('nombreNegocio')} />}</Campo>
        <Campo etiqueta="Contraseña" requerido ayuda="Mínimo 8 caracteres.">{(id) => <input id={id} type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={f.contrasena} onChange={set('contrasena')} />}</Campo>
        <Campo etiqueta="Confirmar contraseña" requerido>{(id) => <input id={id} type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={f.confirmarContrasena} onChange={set('confirmarContrasena')} />}</Campo>
        <div className="field-check">
          <input type="checkbox" id="residente" checked={f.residente} onChange={set('residente')} required />
          <label htmlFor="residente">Confirmo que resido en Manta, Cundinamarca, y acepto la <Link to="/privacidad" className="link">política de privacidad</Link>.</label>
        </div>
        <ErrorMensaje texto={error} />
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={enviando}>{enviando ? 'Creando cuenta…' : 'Crear cuenta'}</button>
        <p style={{ textAlign: 'center', marginBottom: 0 }}>¿Ya tienes cuenta? <Link to="/ingresar" className="link">Ingresa</Link></p>
      </form>
    </section>
  );
}
