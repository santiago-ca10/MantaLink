import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../../database/entities';

@Injectable()
export class CategoriasService {
  constructor(@InjectRepository(Categoria) private categorias: Repository<Categoria>) {}
  listar() { return this.categorias.find({ order: { nombre: 'ASC' } }); }
}
