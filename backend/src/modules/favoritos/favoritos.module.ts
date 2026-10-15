import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito, Publicacion } from '../../database/entities';
import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';

@Module({ imports: [TypeOrmModule.forFeature([Favorito, Publicacion])], controllers: [FavoritosController], providers: [FavoritosService] })
export class FavoritosModule {}
