import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconoEntrar, IconoInicio, IconoMas, IconoPerfil } from './iconos';

/** Barra fija abajo, solo en celulares (el CSS la oculta en pantallas grandes). */
export function BarraInferior() {
  const { usuario, esAdmin } = useAuth();
  const clase = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : undefined);
  return (
    <nav className="bottom-nav" aria-label="Acceso rápido">
      <NavLink to="/" end className={clase}><IconoInicio /><span>Inicio</span></NavLink>
      {usuario && !esAdmin && <NavLink to="/vender" className={clase}><IconoMas /><span>Publicar</span></NavLink>}
      {usuario ? <NavLink to={esAdmin ? '/admin' : '/perfil'} className={clase}><IconoPerfil /><span>{esAdmin ? 'Admin' : 'Perfil'}</span></NavLink>
        : <NavLink to="/ingresar" className={clase}><IconoEntrar /><span>Ingresar</span></NavLink>}
    </nav>
  );
}
