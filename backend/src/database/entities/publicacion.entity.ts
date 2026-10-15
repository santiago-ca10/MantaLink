import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Categoria } from './categoria.entity';
import { Reporte } from './reporte.entity';
import { Favorito } from './favorito.entity';

export enum EstadoPublicacion {
  PENDIENTE = 'PENDIENTE', APROBADA = 'APROBADA', RECHAZADA = 'RECHAZADA', AGOTADA = 'AGOTADA', OCULTA = 'OCULTA', RETIRADA = 'RETIRADA',
}

@Entity('publicaciones')
export class Publicacion {
  @PrimaryGeneratedColumn() id: number;
  @Index() @Column() titulo: string;
  @Column('text') descripcion: string;
  // Texto libre a propósito: "$8.000 libra", "Según destino", "Entrada libre"
  @Column() precio: string;
  @Column({ nullable: true }) subcategoria: string;
  @Column('text', { array: true, default: [] }) imagenes: string[];
  @Column({ nullable: true }) telefono: string;
  @Column({ nullable: true }) whatsapp: string;
  @Column({ nullable: true }) correoContacto: string;
  @Index() @Column({ type: 'enum', enum: EstadoPublicacion, default: EstadoPublicacion.PENDIENTE }) estado: EstadoPublicacion;
  @Column({ type: 'text', nullable: true }) motivoRechazo: string | null;
  @Column({ type: 'date', nullable: true }) vigenteHasta: string | null;
  @Column({ type: 'date', nullable: true }) fechaEvento: string | null;
  @CreateDateColumn() creadoEn: Date;
  @UpdateDateColumn() actualizadoEn: Date;

  @ManyToOne(() => Usuario, (u) => u.publicaciones, { onDelete: 'CASCADE', eager: true }) productor: Usuario;
  @ManyToOne(() => Categoria, (c) => c.publicaciones, { eager: true }) categoria: Categoria;
  @OneToMany(() => Reporte, (r) => r.publicacion) reportes: Reporte[];
  @OneToMany(() => Favorito, (f) => f.publicacion) favoritos: Favorito[];
}
