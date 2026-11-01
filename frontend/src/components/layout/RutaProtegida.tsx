import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Cargando } from '../ui/Mensaje';

interface Props { children: ReactNode; soloAdmin?: boolean }

/**
 * Oculta pantallas a quien no tiene permiso. OJO: esto es solo comodidad visual;
 * la seguridad real está en el backend, que vuelve a validar sesión y rol en cada petición.
 */
export function RutaProtegida({ children, soloAdmin }: Props) {
  const { usuario, cargando, esAdmin } = useAuth();
  const ubicacion = useLocation();
  if (cargando) return <Cargando />;
  if (!usuario) return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname }} />;
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}
