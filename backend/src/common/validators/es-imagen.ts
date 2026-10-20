import { registerDecorator, ValidationOptions } from 'class-validator';

// Una foto válida es: (a) un enlace http(s) externo, o (b) un archivo que subimos nosotros: /api/archivos/<uuid>.jpg|png|webp
const PROPIA = /^\/api\/archivos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export function esImagenValida(v: unknown): boolean {
  if (typeof v !== 'string' || v.length > 500) return false;
  if (PROPIA.test(v)) return true;
  try { const u = new URL(v); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; }
}

/** Valida cada elemento de un arreglo de fotos (se usa junto a @IsArray). */
export function EsImagen(opts?: ValidationOptions) {
  return (obj: object, prop: string) =>
    registerDecorator({
      name: 'esImagen', target: obj.constructor, propertyName: prop,
      options: { message: 'Cada foto debe ser un enlace http(s) o una imagen subida al portal', ...opts },
      validator: { validate: (value: unknown) => Array.isArray(value) && value.every(esImagenValida) },
    });
}
