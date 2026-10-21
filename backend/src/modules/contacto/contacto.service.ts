import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MensajeContacto } from '../../database/entities';
import { CorreoService } from '../correo/correo.service';
import { EnviarContactoDto } from './dto/enviar-contacto.dto';

@Injectable()
export class ContactoService {
  private log = new Logger('Contacto');
  constructor(@InjectRepository(MensajeContacto) private repo: Repository<MensajeContacto>, private correo: CorreoService) {}

  async enviar(dto: EnviarContactoDto) {
    // Se guarda primero: aunque el correo falle, el mensaje no se pierde y el admin lo ve en el panel
    await this.repo.save(this.repo.create({ nombre: dto.nombre.trim(), correo: dto.correo.toLowerCase(), asunto: dto.asunto.trim(), mensaje: dto.mensaje.trim() }));
    // sin saltos de línea en lo que va al asunto del correo (evita inyección de cabeceras)
    const asunto = dto.asunto.replace(/[\r\n]+/g, ' ').trim();
    try {
      await this.correo.enviar(dto.correo, 'Recibimos tu mensaje - MantaLink', `Hola ${dto.nombre.trim()},\n\nRecibimos tu mensaje sobre "${asunto}". El equipo del portal te responderá pronto.\n\nGracias por escribirnos.`);
      if (process.env.CONTACTO_CORREO) await this.correo.enviar(process.env.CONTACTO_CORREO, `Nuevo mensaje de contacto: ${asunto}`, `De: ${dto.nombre} <${dto.correo}>\n\n${dto.mensaje}`);
    } catch (e) { this.log.error(`No se pudo enviar el correo: ${(e as Error).message}`); }
    return { mensaje: 'Mensaje enviado. El equipo del portal te responderá pronto.' };
  }
}
