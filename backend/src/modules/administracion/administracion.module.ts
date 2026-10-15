import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacion, RevisionModeracion, Usuario } from '../../database/entities';
import { AdministracionController } from './administracion.controller';
import { AdministracionService } from './administracion.service';

@Module({ imports: [TypeOrmModule.forFeature([Publicacion, Usuario, RevisionModeracion])], controllers: [AdministracionController], providers: [AdministracionService] })
export class AdministracionModule {}
