import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

// Enlace de recuperación de contraseña. Se guarda solo el HASH del token: si alguien lee la base de datos
// no puede usar los enlaces pendientes (igual que con las contraseñas).
@Entity('tokens_recuperacion')
export class TokenRecuperacion {
  @PrimaryGeneratedColumn() id: number;
  @Index({ unique: true }) @Column() tokenHash: string;
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'usuarioId' }) usuario: Usuario;
  @Column() usuarioId: string;
  @Column({ type: 'timestamptz' }) expiraEn: Date;
  @Column({ type: 'timestamptz', nullable: true }) usadoEn: Date | null;
  @CreateDateColumn() creadoEn: Date;
}
