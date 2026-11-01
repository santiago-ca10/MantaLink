import { ApiError } from '../../api';
import { useToast } from '../../context/ToastContext';

export interface Carga<T> { datos: T[] | null; cargando: boolean; error: string | null; recargar: () => void }

/** Ejecuta una acción del admin: avisa si salió bien o el motivo del error, y recarga la lista. */
export function useAccion(recargar: () => void) {
  const avisar = useToast();
  return async (fn: () => Promise<unknown>, ok: string) => {
    try { await fn(); avisar(ok); recargar(); return true; } catch (e) { avisar(e instanceof ApiError ? e.message : 'No se pudo completar la acción'); return false; }
  };
}

export const ESTILO_CONTROL = { width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--ink)', minHeight: 44 } as const;
