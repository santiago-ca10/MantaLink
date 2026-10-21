import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactoService } from './contacto.service';
import { EnviarContactoDto } from './dto/enviar-contacto.dto';

@Controller('contacto')
export class ContactoController {
  constructor(private s: ContactoService) {}
  // Público (CU11), pero con límite bajo para que no sirva para llenar la bandeja del equipo ni de terceros
  @Throttle({ default: { limit: 3, ttl: 60_000 } }) @Post() enviar(@Body() dto: EnviarContactoDto) { return this.s.enviar(dto); }
}
