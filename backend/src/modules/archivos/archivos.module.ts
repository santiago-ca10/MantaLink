import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../database/entities';
import { ArchivosController } from './archivos.controller';
import { ArchivosService } from './archivos.service';

@Module({ imports: [TypeOrmModule.forFeature([Usuario])], controllers: [ArchivosController], providers: [ArchivosService] })
export class ArchivosModule {}
