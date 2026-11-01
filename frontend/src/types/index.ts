// Formas de los datos que devuelve el backend (ver backend/src/database/entities).

export type Rol = 'PRODUCTOR' | 'ADMIN';
export type EstadoUsuario = 'PENDIENTE' | 'ACTIVO' | 'SUSPENDIDO';
export type EstadoPublicacion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'AGOTADA' | 'OCULTA' | 'RETIRADA';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  estado: EstadoUsuario;
  telefono?: string | null;
  vereda?: string | null;
  nombreNegocio?: string | null;
  creadoEn?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  diasMin: number;
  diasMax: number;
  esEvento: boolean;
  subcategorias: string[];
  descripcion?: string | null;
  activa?: boolean;               // solo el admin la ve (las inactivas no salen en el portal)
  totalPublicaciones?: number;    // solo en la lista del admin
}

export interface MensajeContacto { id: number; nombre: string; correo: string; asunto: string; mensaje: string; atendido: boolean; creadoEn: string }

export interface ProductorPublico {
  id: string;
  nombre: string;
  nombreNegocio?: string | null;
  vereda?: string | null;
}

export interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  precio: string;
  ubicacion?: string | null;
  subcategoria?: string | null;
  imagenes: string[];
  telefono?: string | null;
  whatsapp?: string | null;
  correoContacto?: string | null;
  estado: EstadoPublicacion;
  motivoRechazo?: string | null;
  vigenteHasta?: string | null;
  fechaEvento?: string | null;
  creadoEn: string;
  categoria: Categoria;
  productor: ProductorPublico;
}

export interface Pagina<T> { items: T[]; total: number; pagina: number; paginas: number }

export interface Reporte {
  id: number;
  motivo: string;
  comentario?: string | null;
  estado: 'PENDIENTE' | 'RESUELTO';
  creadoEn: string;
  publicacion: Publicacion;
}

export interface SesionRespuesta { token: string; usuario: Pick<Usuario, 'id' | 'nombre' | 'correo' | 'rol' | 'estado'> }

export const MOTIVOS_REPORTE = ['Contenido inapropiado', 'Información engañosa', 'Datos incorrectos', 'Posible estafa', 'Otro'] as const;
export const ETIQUETA_ESTADO: Record<EstadoPublicacion, string> = {
  PENDIENTE: 'En revisión', APROBADA: 'Publicada', RECHAZADA: 'Rechazada', AGOTADA: 'Agotada', OCULTA: 'Oculta', RETIRADA: 'Retirada',
};
