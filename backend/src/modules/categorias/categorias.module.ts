import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '../../database/entities';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({ imports: [TypeOrmModule.forFeature([Categoria])], controllers: [CategoriasController], providers: [CategoriasService] })
export class CategoriasModule {}
