import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria, MensajeContacto, Publicacion, RevisionModeracion, Usuario } from '../../database/entities';
import { AdministracionController } from './administracion.controller';
import { AdministracionService } from './administracion.service';

@Module({ imports: [TypeOrmModule.forFeature([Publicacion, Usuario, RevisionModeracion, Categoria, MensajeContacto])], controllers: [AdministracionController], providers: [AdministracionService] })
export class AdministracionModule {}
