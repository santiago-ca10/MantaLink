import { Controller, Get } from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
  constructor(private s: CategoriasService) {}
  @Get() listar() { return this.s.listar(); }
}
