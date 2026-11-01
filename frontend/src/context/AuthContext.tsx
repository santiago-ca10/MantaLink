import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { alVencerSesion, auth, token } from '../api';
import type { Usuario } from '../types';

interface AuthValor {
  usuario: Usuario | null;
  cargando: boolean;              // true mientras se comprueba si ya había una sesión guardada
  esAdmin: boolean;
  puedePublicar: boolean;         // productor con cuenta verificada
  iniciarSesion: (correo: string, contrasena: string) => Promise<Usuario>;
  cerrarSesion: () => void;
  refrescar: () => Promise<void>;
}

const Ctx = createContext<AuthValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(!!token.get());

  const cerrarSesion = useCallback(() => { token.clear(); setUsuario(null); }, []);

  const refrescar = useCallback(async () => {
    if (!token.get()) { setUsuario(null); return; }
    try { setUsuario(await auth.me()); } catch { /* si falla por sesión vencida, el cliente ya la cerró */ }
  }, []);

  useEffect(() => {
    alVencerSesion(() => setUsuario(null));
    if (token.get()) refrescar().finally(() => setCargando(false));
  }, [refrescar]);

  const iniciarSesion = useCallback(async (correo: string, contrasena: string) => {
    const r = await auth.login(correo, contrasena);
    token.set(r.token);
    const u = await auth.me();
    setUsuario(u);
    return u;
  }, []);

  const valor = useMemo<AuthValor>(() => ({
    usuario, cargando, iniciarSesion, cerrarSesion, refrescar,
    esAdmin: usuario?.rol === 'ADMIN',
    puedePublicar: usuario?.rol === 'PRODUCTOR' && usuario.estado === 'ACTIVO',
  }), [usuario, cargando, iniciarSesion, cerrarSesion, refrescar]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return v;
}
