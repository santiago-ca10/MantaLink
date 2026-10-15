import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtUser, UsuarioActual } from '../../common';
import { FavoritosService } from './favoritos.service';

@UseGuards(JwtAuthGuard)
@Controller('favoritos')
export class FavoritosController {
  constructor(private s: FavoritosService) {}
  @Get() listar(@UsuarioActual() u: JwtUser) { return this.s.listar(u.sub); }
  @Post(':id') agregar(@UsuarioActual() u: JwtUser, @Param('id', ParseIntPipe) id: number) { return this.s.agregar(u.sub, id); }
  @Delete(':id') quitar(@UsuarioActual() u: JwtUser, @Param('id', ParseIntPipe) id: number) { return this.s.quitar(u.sub, id); }
}
