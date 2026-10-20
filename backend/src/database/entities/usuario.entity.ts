import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Publicacion } from './publicacion.entity';

export enum Rol { PRODUCTOR = 'PRODUCTOR', ADMIN = 'ADMIN' }
// El admin verifica a los residentes antes de que puedan publicar (sección 6.6.1 del documento)
export enum EstadoUsuario { PENDIENTE = 'PENDIENTE', ACTIVO = 'ACTIVO', SUSPENDIDO = 'SUSPENDIDO' }

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() nombre: string;
  @Column({ nullable: true }) tipoDocumento: string;
  @Column({ nullable: true }) numeroDocumento: string;
  @Column({ unique: true }) correo: string;
  @Column({ nullable: true }) telefono: string;
  @Column({ nullable: true }) vereda: string;
  @Column({ nullable: true }) nombreNegocio: string;
  // Nunca se guarda la contraseña en texto plano: solo el hash (6.5.1)
  @Column({ select: false }) contrasenaHash: string;
  @Column({ type: 'enum', enum: Rol, default: Rol.PRODUCTOR }) rol: Rol;
  @Column({ type: 'enum', enum: EstadoUsuario, default: EstadoUsuario.PENDIENTE }) estado: EstadoUsuario;
  // Si cambia la contraseña, las sesiones iniciadas ANTES de este momento dejan de valer
  @Column({ type: 'timestamptz', nullable: true }) contrasenaCambiadaEn: Date | null;
  @CreateDateColumn() creadoEn: Date;
  @OneToMany(() => Publicacion, (p) => p.productor) publicaciones: Publicacion[];
}
