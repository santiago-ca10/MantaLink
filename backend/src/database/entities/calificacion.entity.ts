import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('calificaciones')
@Index('IDX_calificacion_votante_productor', ['votante', 'productor'], { unique: true })
export class Calificacion {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'smallint' }) puntuacion: number;
  @CreateDateColumn() creadoEn: Date;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' }) votante: Usuario;
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' }) productor: Usuario;
}
