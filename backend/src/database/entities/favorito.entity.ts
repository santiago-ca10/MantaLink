import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Publicacion } from './publicacion.entity';

@Entity('favoritos')
@Unique(['usuario', 'publicacion'])
export class Favorito {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' }) usuario: Usuario;
  @ManyToOne(() => Publicacion, (p) => p.favoritos, { onDelete: 'CASCADE' }) publicacion: Publicacion;
  @CreateDateColumn() creadoEn: Date;
}
