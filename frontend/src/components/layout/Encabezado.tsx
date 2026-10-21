import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconoMenu } from './iconos';

export function Encabezado() {
  const { usuario, esAdmin, puedePublicar, cerrarSesion } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [masAbierto, setMasAbierto] = useState(false);
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const masRef = useRef<HTMLDivElement>(null);

  // Al cambiar de pantalla se cierran los menús
  useEffect(() => { setMenuAbierto(false); setMasAbierto(false); }, [ubicacion.pathname]);
  // Clic fuera o Escape cierra el menú "Más"
  useEffect(() => {
    const fuera = (e: MouseEvent) => { if (masRef.current && !masRef.current.contains(e.target as Node)) setMasAbierto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMasAbierto(false); setMenuAbierto(false); } };
    document.addEventListener('mousedown', fuera); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fuera); document.removeEventListener('keydown', esc); };
  }, []);

  const clase = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : undefined);

  return (
    <header>
      <div className="headrow">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }} aria-label="MantaLink, ir al inicio"><span className="logo-name">Manta<span>Link</span></span></Link>

        <div className="more-menu" ref={masRef}>
          <button className="icon-btn more-toggle" aria-haspopup="true" aria-expanded={masAbierto} onClick={() => setMasAbierto((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
            <span>Más</span>
          </button>
          <div className={`more-dropdown${masAbierto ? ' open' : ''}`}>
            <button onClick={() => navegar('/ayuda')}>? Ayuda</button>
            <button onClick={() => navegar('/configuracion')}>Configuración</button>
            <button onClick={() => navegar('/contacto')}>Contacto</button>
            <button onClick={() => navegar('/privacidad')}>Privacidad</button>
          </div>
        </div>

        <button className="menu-toggle" aria-label="Abrir menú" aria-expanded={menuAbierto} onClick={() => setMenuAbierto((v) => !v)}><IconoMenu /></button>

        <nav className={`mainnav${menuAbierto ? ' open' : ''}`} aria-label="Principal">
          <NavLink to="/" end className={clase}>Inicio</NavLink>
          <NavLink to="/?categoria=Servicios" className={() => (ubicacion.search.includes('Servicios') ? 'active' : undefined)}>Servicios</NavLink>
          {usuario && !esAdmin && <NavLink to="/vender" id="navVender" className={clase}>+ Vender</NavLink>}
          {usuario && <NavLink to="/favoritos" className={clase}>♥ Favoritos</NavLink>}
          {usuario && <NavLink to="/perfil" id="navPerfil" className={clase}>Perfil</NavLink>}
          {esAdmin && <NavLink to="/admin" className={clase}>🛠 Admin</NavLink>}
          {!usuario && <NavLink to="/ingresar" id="navLogin" className={clase}>Ingresar</NavLink>}
          {usuario && <button onClick={() => { cerrarSesion(); navegar('/'); }}>Salir</button>}
        </nav>
      </div>
      {usuario && !esAdmin && !puedePublicar && usuario.estado === 'PENDIENTE' && (
        <p role="status" style={{ margin: '8px auto 0', maxWidth: 1080, fontSize: '.85rem', color: 'var(--ink-soft)' }}>
          ⏳ Tu cuenta está en verificación. Cuando un administrador la apruebe podrás publicar.
        </p>
      )}
    </header>
  );
}
