import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Publicacion } from './publicacion.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) nombre: string;
  // Vigencia de la publicación según la categoría (6.6.1): un animal dura poco, una artesanía no caduca
  @Column({ type: 'int', default: 1 }) diasMin: number;
  @Column({ type: 'int', default: 60 }) diasMax: number;
  // Los eventos se publican con fecha puntual y desaparecen solos al pasar
  @Column({ default: false }) esEvento: boolean;
  @Column('text', { array: true, default: [] }) subcategorias: string[];
  @Column({ type: 'text', nullable: true }) descripcion: string | null;
  // Una categoría desactivada no sale en el portal ni acepta ofertas nuevas (CU7); no se borra para conservar el historial
  @Column({ default: true }) activa: boolean;
  @OneToMany(() => Publicacion, (p) => p.categoria) publicaciones: Publicacion[];
}
