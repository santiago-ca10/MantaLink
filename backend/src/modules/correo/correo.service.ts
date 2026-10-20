import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

/**
 * Envío de correos. Si hay SMTP_HOST configurado se envía de verdad (Gmail con "contraseña de aplicación", SendGrid, etc.).
 * Si no (desarrollo), el correo se IMPRIME en la consola del backend, así se puede probar sin cuenta de correo.
 */
@Injectable()
export class CorreoService {
  private log = new Logger('Correo');
  private transporte = process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true', // true = puerto 465
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      })
    : null;

  async enviar(para: string, asunto: string, texto: string) {
    if (!this.transporte) {
      // En producción NUNCA se imprime el contenido: traería el enlace secreto de recuperación en los logs
      if (process.env.NODE_ENV === 'production') this.log.error(`SMTP no configurado: no se pudo enviar "${asunto}"`);
      else this.log.warn(`SMTP no configurado: correo NO enviado (solo desarrollo).\n  Para: ${para}\n  Asunto: ${asunto}\n  ${texto}`);
      return;
    }
    await this.transporte.sendMail({ from: process.env.SMTP_FROM ?? 'MantaLink <no-responder@mantalink.local>', to: para, subject: asunto, text: texto });
  }
}
