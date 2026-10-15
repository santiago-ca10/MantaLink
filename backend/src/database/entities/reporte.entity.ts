import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Publicacion } from './publicacion.entity';
import { Usuario } from './usuario.entity';
import { RevisionModeracion } from './revision-moderacion.entity';

export enum EstadoReporte { PENDIENTE = 'PENDIENTE', RESUELTO = 'RESUELTO' }

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn() id: number;
  @Column() motivo: string;
  @Column({ type: 'text', nullable: true }) comentario: string | null;
  @Column({ type: 'enum', enum: EstadoReporte, default: EstadoReporte.PENDIENTE }) estado: EstadoReporte;
  @CreateDateColumn() creadoEn: Date;
  // El comprador no necesita cuenta, así que el reportante puede ser anónimo
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' }) reportante: Usuario | null;
  @ManyToOne(() => Publicacion, (p) => p.reportes, { onDelete: 'CASCADE' }) publicacion: Publicacion;
  @OneToMany(() => RevisionModeracion, (r) => r.reporte) revisiones: RevisionModeracion[];
}
