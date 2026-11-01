import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Consulta enviada por el formulario de contacto (CU11)
@Entity('mensajes_contacto')
export class MensajeContacto {
  @PrimaryGeneratedColumn() id: number;
  @Column() nombre: string;
  @Column() correo: string;
  @Column() asunto: string;
  @Column('text') mensaje: string;
  @Column({ default: false }) atendido: boolean;
  @CreateDateColumn() creadoEn: Date;
}
