import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reporte } from './reporte.entity';
import { Usuario } from './usuario.entity';
import { Publicacion } from './publicacion.entity';

// Decisiones del diagrama de secuencia (6.5.2): mantener, solicitar cambios, ocultar temporalmente o retirar
export enum Decision { MANTENER = 'MANTENER', SOLICITAR_CAMBIOS = 'SOLICITAR_CAMBIOS', OCULTAR = 'OCULTAR', RETIRAR = 'RETIRAR', APROBAR = 'APROBAR', RECHAZAR = 'RECHAZAR' }

@Entity('revisiones_moderacion')
export class RevisionModeracion {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'enum', enum: Decision }) decision: Decision;
  @Column({ type: 'text', nullable: true }) comentario: string | null;
  @CreateDateColumn() creadoEn: Date;
  @ManyToOne(() => Usuario) administrador: Usuario;
  @ManyToOne(() => Publicacion, { onDelete: 'CASCADE' }) publicacion: Publicacion;
  // Nulo cuando es la revisión previa a publicar (no viene de un reporte)
  @ManyToOne(() => Reporte, (r) => r.revisiones, { nullable: true, onDelete: 'SET NULL' }) reporte: Reporte | null;
}
