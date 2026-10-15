import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Decision, EstadoPublicacion, EstadoUsuario, Publicacion, RevisionModeracion, Usuario } from '../../database/entities';
import { ModerarPublicacionDto } from './dto';

@Injectable()
export class AdministracionService {
  constructor(
    @InjectRepository(Publicacion) private pubs: Repository<Publicacion>,
    @InjectRepository(Usuario) private usuarios: Repository<Usuario>,
    @InjectRepository(RevisionModeracion) private revisiones: Repository<RevisionModeracion>,
  ) {}

  publicacionesPendientes() { return this.pubs.find({ where: { estado: EstadoPublicacion.PENDIENTE }, order: { creadoEn: 'ASC' } }); }
  cuentasPendientes() { return this.usuarios.find({ where: { estado: EstadoUsuario.PENDIENTE }, order: { creadoEn: 'ASC' } }); }

  async moderar(id: number, adminId: string, dto: ModerarPublicacionDto) {
    const p = await this.pubs.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Publicación no encontrada');
    if (dto.decision === 'RECHAZAR' && !dto.motivo) throw new BadRequestException('Indica el motivo del rechazo (el productor lo verá)');
    p.estado = dto.decision === 'APROBAR' ? EstadoPublicacion.APROBADA : EstadoPublicacion.RECHAZADA;
    p.motivoRechazo = dto.decision === 'RECHAZAR' ? dto.motivo! : null;
    await this.pubs.save(p);
    // Queda historial de cada decisión (trazabilidad, 6.5.2)
    await this.revisiones.save(this.revisiones.create({
      decision: dto.decision === 'APROBAR' ? Decision.APROBAR : Decision.RECHAZAR,
      comentario: dto.motivo ?? null, administrador: { id: adminId } as Usuario, publicacion: p,
    }));
    return p;
  }

  async cambiarEstadoUsuario(id: string, estado: 'ACTIVO' | 'SUSPENDIDO') {
    const u = await this.usuarios.findOneBy({ id });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    u.estado = estado as EstadoUsuario;
    return this.usuarios.save(u);
  }
}
