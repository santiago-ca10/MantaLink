import { Global, Module } from '@nestjs/common';
import { CorreoService } from './correo.service';

@Global()
@Module({ providers: [CorreoService], exports: [CorreoService] })
export class CorreoModule {}
