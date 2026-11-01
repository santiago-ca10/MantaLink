import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensajeContacto } from '../../database/entities';
import { ContactoController } from './contacto.controller';
import { ContactoService } from './contacto.service';

@Module({ imports: [TypeOrmModule.forFeature([MensajeContacto])], controllers: [ContactoController], providers: [ContactoService] })
export class ContactoModule {}
