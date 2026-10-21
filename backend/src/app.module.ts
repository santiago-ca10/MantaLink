import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as entities from './database/entities';
import { AuthModule } from './modules/auth/auth.module';
import { CorreoModule } from './modules/correo/correo.module';
import { ContactoModule } from './modules/contacto/contacto.module';
import { ArchivosModule } from './modules/archivos/archivos.module';
import { PublicacionesModule } from './modules/publicaciones/publicaciones.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { FavoritosModule } from './modules/favoritos/favoritos.module';
import { AdministracionModule } from './modules/administracion/administracion.module';
import { ReportesModule } from './modules/reportes/reportes.module';

export const ENTIDADES = Object.values(entities).filter((e) => typeof e === 'function');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ENTIDADES as any[],
      // synchronize solo para desarrollo del MVP: crea las tablas desde las entidades.
      // Antes de producción hay que pasar a migraciones.
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    // Límite general por IP: 120 peticiones/minuto (los endpoints sensibles tienen límites más estrictos)
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 120 }], skipIf: () => process.env.THROTTLE_OFF === '1' }),
    AuthModule, PublicacionesModule, CategoriasModule, FavoritosModule, ReportesModule, AdministracionModule, ArchivosModule, CorreoModule, ContactoModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
