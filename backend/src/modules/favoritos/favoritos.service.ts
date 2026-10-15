import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoPublicacion, Favorito, Publicacion, Usuario } from '../../database/entities';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito) private favoritos: Repository<Favorito>,
    @InjectRepository(Publicacion) private pubs: Repository<Publicacion>,
  ) {}

  async agregar(uid: string, pubId: number) {
    const p = await this.pubs.findOne({ where: { id: pubId } });
    if (!p || p.estado !== EstadoPublicacion.APROBADA) throw new NotFoundException('Publicación no encontrada');
    const ya = await this.favoritos.findOne({ where: { usuario: { id: uid }, publicacion: { id: pubId } } });
    if (!ya) await this.favoritos.save(this.favoritos.create({ usuario: { id: uid } as Usuario, publicacion: p }));
    return { favorito: true };
  }

  async quitar(uid: string, pubId: number) {
    await this.favoritos.delete({ usuario: { id: uid }, publicacion: { id: pubId } });
    return { favorito: false };
  }

  async listar(uid: string) {
    const fs = await this.favoritos.find({
      where: { usuario: { id: uid }, publicacion: { estado: EstadoPublicacion.APROBADA } },
      relations: { publicacion: true }, order: { creadoEn: 'DESC' },
    });
    return fs.map((f) => f.publicacion);
  }
}
