import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacion, Reporte, RevisionModeracion } from '../../database/entities';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';

@Module({ imports: [TypeOrmModule.forFeature([Reporte, Publicacion, RevisionModeracion])], controllers: [ReportesController], providers: [ReportesService] })
export class ReportesModule {}
