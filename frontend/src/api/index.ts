import { api } from './client';
import type { Categoria, MensajeContacto, Pagina, Publicacion, Reporte, SesionRespuesta, Usuario } from '../types';

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
  olvideContrasena: (correo: string) => api<{ mensaje: string }>('POST', '/auth/olvide-contrasena', { correo }, false),
  restablecerContrasena: (token: string, nueva: string) => api<{ mensaje: string }>('POST', '/auth/restablecer-contrasena', { token, nueva }, false),
  actualizarPerfil: (d: { nombre?: string; telefono?: string; vereda?: string; nombreNegocio?: string }) => api<Usuario>('PATCH', '/auth/perfil', d),
  cambiarContrasena: (actual: string, nueva: string) => api<{ mensaje: string }>('POST', '/auth/cambiar-contrasena', { actual, nueva }),
};

// ---- Catálogo ----
export interface FiltrosCatalogo { q?: string; categoria?: string; categorias?: string[]; ubicacion?: string; subcategoria?: string; orden?: string; pagina?: number; limite?: number }
const query = (f: Record<string, unknown>) => {
  const p = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((item) => { if (item !== undefined && item !== '' && item !== null) p.append(k, String(item)); });
    else if (v !== undefined && v !== '' && v !== null) p.set(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : '';
};

export interface DatosPublicacion {
  titulo: string; descripcion: string; precio: string; ubicacion?: string; categoriaId?: number; subcategoria?: string;
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

export const contacto = {
  enviar: (d: { nombre: string; correo: string; asunto: string; mensaje: string }) => api<{ mensaje: string }>('POST', '/contacto', d, false),
};

export interface DatosCategoria { nombre?: string; descripcion?: string; diasMin?: number; diasMax?: number; esEvento?: boolean; subcategorias?: string[] }

export const admin = {
  usuarios: (f: { q?: string; estado?: string; pagina?: number }) => api<Pagina<Usuario>>('GET', `/admin/usuarios${query({ ...f })}`),
  categorias: () => api<Categoria[]>('GET', '/admin/categorias'),
  crearCategoria: (d: DatosCategoria & { nombre: string; diasMin: number; diasMax: number }) => api<Categoria>('POST', '/admin/categorias', d),
  editarCategoria: (id: number, d: DatosCategoria) => api<Categoria>('PATCH', `/admin/categorias/${id}`, d),
  desactivarCategoria: (id: number, reasignarAId?: number) => api<Categoria>('POST', `/admin/categorias/${id}/desactivar`, reasignarAId ? { reasignarAId } : {}),
  activarCategoria: (id: number) => api<Categoria>('POST', `/admin/categorias/${id}/activar`),
  mensajes: (soloPendientes: boolean) => api<MensajeContacto[]>('GET', `/admin/mensajes${soloPendientes ? '?pendientes=true' : ''}`),
  marcarMensaje: (id: number, atendido: boolean) => api<MensajeContacto>('PATCH', `/admin/mensajes/${id}/atendido`, { atendido }),
  cuentasPendientes: () => api<Usuario[]>('GET', '/admin/usuarios/pendientes'),
  cambiarEstadoUsuario: (id: string, estado: 'ACTIVO' | 'SUSPENDIDO') => api<Usuario>('PATCH', `/admin/usuarios/${id}/estado`, { estado }),
  publicacionesPendientes: () => api<Publicacion[]>('GET', '/admin/publicaciones/pendientes'),
  moderar: (id: number, decision: 'APROBAR' | 'RECHAZAR', motivo?: string) =>
    api<Publicacion>('PATCH', `/admin/publicaciones/${id}/moderar`, { decision, ...(motivo ? { motivo } : {}) }),
  reportes: () => api<Reporte[]>('GET', '/admin/reportes'),
  resolverReporte: (id: number, decision: 'MANTENER' | 'SOLICITAR_CAMBIOS' | 'OCULTAR' | 'RETIRAR', comentario?: string) =>
    api<{ mensaje: string }>('PATCH', `/admin/reportes/${id}/resolver`, { decision, ...(comentario ? { comentario } : {}) }),
};

export const archivos = {
  /** Sube una foto y devuelve su ruta pública (/api/archivos/…). */
  subirFoto: async (foto: Blob) => {
    const fd = new FormData();
    fd.append('archivo', foto, 'foto.jpg');
    return (await api<{ url: string }>('POST', '/archivos', fd)).url;
  },
};
