import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconoMenu } from './iconos';
import { usePreferencias } from '../../context/PreferenciasContext';
import { t } from '../../utils/i18n';

export function Encabezado() {
  const { usuario, esAdmin, puedePublicar, cerrarSesion } = useAuth();
  const { idioma } = usePreferencias();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [masAbierto, setMasAbierto] = useState(false);
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const masRef = useRef<HTMLDivElement>(null);
  const esVistaServicios = ubicacion.pathname === '/' && new URLSearchParams(ubicacion.search).get('categoria') === 'Servicios';

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
            <span>{t(idioma, 'more')}</span>
          </button>
          <div className={`more-dropdown${masAbierto ? ' open' : ''}`}>
            <button onClick={() => navegar('/ayuda')}>? {t(idioma, 'help')}</button>
            <button onClick={() => navegar('/configuracion')}>{t(idioma, 'settings')}</button>
            <button onClick={() => navegar('/contacto')}>{t(idioma, 'contact')}</button>
            <button onClick={() => navegar('/privacidad')}>{t(idioma, 'privacy')}</button>
          </div>
        </div>

        <button className="menu-toggle" aria-label="Abrir menú" aria-expanded={menuAbierto} onClick={() => setMenuAbierto((v) => !v)}><IconoMenu /></button>

        <nav className={`mainnav${menuAbierto ? ' open' : ''}`} aria-label="Principal">
          <NavLink to="/" end className={({ isActive }) => (isActive && !esVistaServicios ? 'active' : undefined)}>{t(idioma, 'home')}</NavLink>
          <NavLink to="/?categoria=Servicios" className={() => (esVistaServicios ? 'active' : undefined)}>{t(idioma, 'services')}</NavLink>
          {usuario && !esAdmin && <NavLink to="/vender" id="navVender" className={clase}>{t(idioma, 'publish')}</NavLink>}
          {usuario && <NavLink to="/favoritos" className={clase}>{t(idioma, 'favorites')}</NavLink>}
          {usuario && <NavLink to="/perfil" id="navPerfil" className={clase}>{t(idioma, 'profile')}</NavLink>}
          {esAdmin && <NavLink to="/admin" className={clase}>{t(idioma, 'admin')}</NavLink>}
          {!usuario && <NavLink to="/ingresar" id="navLogin" className={clase}>{t(idioma, 'login')}</NavLink>}
          {usuario && <button onClick={() => { cerrarSesion(); navegar('/'); }}>{t(idioma, 'logout')}</button>}
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
