import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { mkdir, readdir, stat, unlink, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';

export const MAX_BYTES = 5 * 1024 * 1024; // 5 MB por foto
export const NOMBRE_VALIDO = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;
export const TIPOS: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

/** Detecta el tipo REAL mirando los primeros bytes. Lo que diga el navegador (nombre, Content-Type) no se cree. */
export function detectarTipo(b: Buffer): 'jpg' | 'png' | 'webp' | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length > 12 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.length > 12 && b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp';
  return null;
}

@Injectable()
export class ArchivosService implements OnModuleInit {
  readonly carpeta = resolve(process.env.UPLOADS_DIR ?? './uploads');

  private log = new Logger('Archivos');
  constructor(private ds: DataSource) {}

  async onModuleInit() {
    await mkdir(this.carpeta, { recursive: true });
    // Limpieza diaria de fotos que ninguna publicación usa (en las pruebas no se programa)
    if (process.env.NODE_ENV !== 'test') {
      setTimeout(() => void this.limpiarHuerfanas(), 60_000).unref();
      setInterval(() => void this.limpiarHuerfanas(), 24 * 3600_000).unref();
    }
  }

  /**
   * Borra del disco las fotos que no aparecen en ninguna publicación (se subieron y nunca se usaron, o la
   * publicación se borró / le quitaron la foto). Las de menos de 24 h se respetan: pueden estar a medio publicar.
   */
  async limpiarHuerfanas(): Promise<number> {
    try {
      const usadas = new Set<string>((await this.ds.query('SELECT DISTINCT unnest(imagenes) AS u FROM publicaciones')).map((r: { u: string }) => r.u.split('/').pop()));
      let borradas = 0;
      for (const nombre of await readdir(this.carpeta)) {
        if (!NOMBRE_VALIDO.test(nombre) || usadas.has(nombre)) continue; // solo toca archivos que subió el portal
        const ruta = resolve(this.carpeta, nombre);
        if (Date.now() - (await stat(ruta)).mtimeMs < 24 * 3600_000) continue;
        await unlink(ruta); borradas++;
      }
      if (borradas) this.log.log(`Se borraron ${borradas} foto(s) sin usar`);
      return borradas;
    } catch (e) { this.log.error(`No se pudo limpiar fotos: ${(e as Error).message}`); return 0; }
  }

  async guardar(archivo?: Express.Multer.File) {
    if (!archivo) throw new BadRequestException('Falta la imagen (campo "archivo")');
    const tipo = detectarTipo(archivo.buffer);
    if (!tipo) throw new BadRequestException('Solo se aceptan fotos JPG, PNG o WebP');
    // Nombre generado por nosotros: nunca se usa el nombre que mandó el usuario (evita "../" y extensiones raras)
    const nombre = `${randomUUID()}.${tipo}`;
    await writeFile(resolve(this.carpeta, nombre), archivo.buffer, { flag: 'wx' });
    return { url: `/api/archivos/${nombre}` };
  }

  ruta(nombre: string) {
    if (!NOMBRE_VALIDO.test(nombre)) throw new NotFoundException();
    const r = resolve(this.carpeta, nombre);
    if (!existsSync(r)) throw new NotFoundException();
    return { r, tipo: TIPOS[nombre.split('.')[1]] };
  }
}
