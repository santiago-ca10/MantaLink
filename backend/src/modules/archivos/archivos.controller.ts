import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { JwtAuthGuard, Roles, RolesGuard } from '../../common';
import { Rol } from '../../database/entities';
import { ArchivosService, MAX_BYTES } from './archivos.service';

@Controller('archivos')
export class ArchivosController {
  constructor(private s: ArchivosService) {}

  // Solo productores con sesión; máx. 30 subidas por minuto; 1 archivo de hasta 5 MB por petición
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Rol.PRODUCTOR)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post()
  @UseInterceptors(FileInterceptor('archivo', { storage: memoryStorage(), limits: { fileSize: MAX_BYTES, files: 1 } }))
  subir(@UploadedFile() archivo?: Express.Multer.File) { return this.s.guardar(archivo); }

  // Pública: las fotos se ven en el catálogo sin iniciar sesión
  @Get(':nombre')
  ver(@Param('nombre') nombre: string, @Res() res: Response) {
    const { r, tipo } = this.s.ruta(nombre);
    res.set({
      'Content-Type': tipo,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'",
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cache-Control': 'public, max-age=31536000, immutable', // el nombre es un UUID: nunca cambia su contenido
    });
    res.sendFile(r);
  }
}
