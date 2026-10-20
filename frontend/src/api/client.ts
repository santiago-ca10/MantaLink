// Único lugar que habla con el backend. Todo lo demás usa las funciones de esta carpeta.
const BASE = (import.meta.env.VITE_API_URL as string | undefined) || '/api';
const CLAVE_TOKEN = 'mantalink.token';

export const token = {
  get: () => { try { return localStorage.getItem(CLAVE_TOKEN); } catch { return null; } },
  set: (t: string) => { try { localStorage.setItem(CLAVE_TOKEN, t); } catch { /* modo privado: la sesión dura solo esta pestaña */ } },
  clear: () => { try { localStorage.removeItem(CLAVE_TOKEN); } catch { /* nada */ } },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

type Listener = () => void;
let onSesionVencida: Listener | null = null;
export const alVencerSesion = (fn: Listener) => { onSesionVencida = fn; };

// El backend responde { message: string | string[] } en los errores de validación.
function mensaje(cuerpo: any, status: number): string {
  const m = cuerpo?.message;
  if (Array.isArray(m)) return m.join('. ');
  if (typeof m === 'string') return m;
  if (status === 429) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  if (status >= 500) return 'Algo salió mal en el servidor. Inténtalo de nuevo en un momento.';
  return 'No se pudo completar la acción.';
}

export async function api<T>(metodo: string, ruta: string, cuerpo?: unknown, conSesion = true): Promise<T> {
  const t = conSesion ? token.get() : null;
  let res: Response;
  try {
    res = await fetch(BASE + ruta, {
      method: metodo,
      headers: { ...(cuerpo !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(t ? { Authorization: `Bearer ${t}` } : {}) },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.');
  }
  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    // Token vencido o cuenta suspendida: se cierra la sesión local (menos en el login, donde 401 = clave incorrecta)
    if (res.status === 401 && t && !ruta.startsWith('/auth/login')) { token.clear(); onSesionVencida?.(); }
    throw new ApiError(res.status, mensaje(datos, res.status));
  }
  return datos as T;
}
