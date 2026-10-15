import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Decision, EstadoPublicacion, EstadoReporte, Publicacion, Reporte, RevisionModeracion, Usuario } from '../../database/entities';
import { ReportarDto, ResolverReporteDto } from './dto';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reporte) private reportes: Repository<Reporte>,
    @InjectRepository(Publicacion) private pubs: Repository<Publicacion>,
    @InjectRepository(RevisionModeracion) private revisiones: Repository<RevisionModeracion>,
  ) {}

  async reportar(pubId: number, dto: ReportarDto, reportanteId: string | null) {
    const p = await this.pubs.findOne({ where: { id: pubId } });
    if (!p || p.estado !== EstadoPublicacion.APROBADA) throw new NotFoundException('Publicación no encontrada');
    if (reportanteId) { // un usuario identificado no puede llenar la cola con reportes repetidos de lo mismo
      const ya = await this.reportes.findOne({ where: { publicacion: { id: pubId }, reportante: { id: reportanteId }, estado: EstadoReporte.PENDIENTE } });
      if (ya) throw new BadRequestException('Ya reportaste esta publicación; el administrador la está revisando');
    }
    await this.reportes.save(this.reportes.create({
      motivo: dto.motivo, comentario: dto.comentario ?? null, publicacion: p,
      reportante: reportanteId ? ({ id: reportanteId } as Usuario) : null,
    }));
    return { mensaje: 'Gracias, recibimos tu reporte. Un administrador lo revisará.' };
  }

  pendientes() {
    return this.reportes.find({ where: { estado: EstadoReporte.PENDIENTE }, relations: { publicacion: true }, order: { creadoEn: 'ASC' } });
  }

  async resolver(id: number, adminId: string, dto: ResolverReporteDto) {
    const r = await this.reportes.findOne({ where: { id }, relations: { publicacion: true } });
    if (!r) throw new NotFoundException('Reporte no encontrado');
    if (r.estado === EstadoReporte.RESUELTO) throw new BadRequestException('Este reporte ya fue resuelto');
    if (dto.decision !== 'MANTENER' && !dto.comentario) throw new BadRequestException('Indica un comentario: el productor lo verá como motivo');
    const p = r.publicacion;
    if (dto.decision === 'SOLICITAR_CAMBIOS') { p.estado = EstadoPublicacion.RECHAZADA; p.motivoRechazo = dto.comentario!; }
    if (dto.decision === 'OCULTAR') p.estado = EstadoPublicacion.OCULTA;
    if (dto.decision === 'RETIRAR') p.estado = EstadoPublicacion.RETIRADA;
    if (dto.decision !== 'MANTENER') await this.pubs.save(p);
    // Una sola decisión cubre todos los reportes pendientes de esa publicación
    await this.reportes.update({ publicacion: { id: p.id }, estado: EstadoReporte.PENDIENTE }, { estado: EstadoReporte.RESUELTO });
    await this.revisiones.save(this.revisiones.create({
      decision: Decision[dto.decision], comentario: dto.comentario ?? null,
      administrador: { id: adminId } as Usuario, publicacion: p, reporte: r,
    }));
    return { mensaje: 'Reporte resuelto', decision: dto.decision };
  }
}
