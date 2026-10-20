import { api } from './client';
import type { Categoria, Pagina, Publicacion, Reporte, SesionRespuesta, Usuario } from '../types';

export { ApiError, token, alVencerSesion } from './client';

// ---- Sesión ----
export interface RegistroDatos {
  nombre: string; tipoDocumento: string; numeroDocumento: string; correo: string; telefono?: string;
  vereda: string; nombreNegocio?: string; contrasena: string; confirmarContrasena: string; residente: boolean;
}
export const auth = {
  registro: (d: RegistroDatos) => api<{ mensaje: string }>('POST', '/auth/registro', d, false),
  login: (correo: string, contrasena: string) => api<SesionRespuesta>('POST', '/auth/login', { correo, contrasena }, false),
  me: () => api<Usuario>('GET', '/auth/me'),
  cambiarContrasena: (actual: string, nueva: string) => api<{ mensaje: string }>('POST', '/auth/cambiar-contrasena', { actual, nueva }),
};

// ---- Catálogo ----
export interface FiltrosCatalogo { q?: string; categoria?: string; subcategoria?: string; orden?: string; pagina?: number; limite?: number }
const query = (f: Record<string, unknown>) => {
  const p = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => { if (v !== undefined && v !== '' && v !== null) p.set(k, String(v)); });
  const s = p.toString();
  return s ? `?${s}` : '';
};

export interface DatosPublicacion {
  titulo: string; descripcion: string; precio: string; categoriaId?: number; subcategoria?: string;
  imagenes?: string[]; telefono?: string; whatsapp?: string; correoContacto?: string; duracionDias?: number; fechaEvento?: string;
}

export const publicaciones = {
  catalogo: (f: FiltrosCatalogo) => api<Pagina<Publicacion>>('GET', `/publicaciones${query({ ...f })}`, undefined, false),
  detalle: (id: number) => api<Publicacion>('GET', `/publicaciones/${id}`, undefined, false),
  mias: () => api<Publicacion[]>('GET', '/publicaciones/mias/lista'),
  crear: (d: DatosPublicacion) => api<Publicacion>('POST', '/publicaciones', d),
  actualizar: (id: number, d: Partial<DatosPublicacion>) => api<Publicacion>('PATCH', `/publicaciones/${id}`, d),
  agotada: (id: number) => api<Publicacion>('PATCH', `/publicaciones/${id}/agotada`),
  eliminar: (id: number) => api<{ mensaje: string }>('DELETE', `/publicaciones/${id}`),
  reportar: (id: number, motivo: string, comentario?: string) =>
    api<{ mensaje: string }>('POST', `/publicaciones/${id}/reportar`, { motivo, ...(comentario ? { comentario } : {}) }),
};

export const categorias = { listar: () => api<Categoria[]>('GET', '/categorias', undefined, false) };

export const favoritos = {
  listar: () => api<Publicacion[]>('GET', '/favoritos'),
  agregar: (id: number) => api<{ favorito: boolean }>('POST', `/favoritos/${id}`),
  quitar: (id: number) => api<{ favorito: boolean }>('DELETE', `/favoritos/${id}`),
};

export const admin = {
  cuentasPendientes: () => api<Usuario[]>('GET', '/admin/usuarios/pendientes'),
  cambiarEstadoUsuario: (id: string, estado: 'ACTIVO' | 'SUSPENDIDO') => api<Usuario>('PATCH', `/admin/usuarios/${id}/estado`, { estado }),
  publicacionesPendientes: () => api<Publicacion[]>('GET', '/admin/publicaciones/pendientes'),
  moderar: (id: number, decision: 'APROBAR' | 'RECHAZAR', motivo?: string) =>
    api<Publicacion>('PATCH', `/admin/publicaciones/${id}/moderar`, { decision, ...(motivo ? { motivo } : {}) }),
  reportes: () => api<Reporte[]>('GET', '/admin/reportes'),
  resolverReporte: (id: number, decision: 'MANTENER' | 'SOLICITAR_CAMBIOS' | 'OCULTAR' | 'RETIRAR', comentario?: string) =>
    api<{ mensaje: string }>('PATCH', `/admin/reportes/${id}/resolver`, { decision, ...(comentario ? { comentario } : {}) }),
};
