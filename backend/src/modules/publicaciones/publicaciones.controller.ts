import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtUser, Roles, RolesGuard, UsuarioActual } from '../../common';
import { Rol } from '../../database/entities';
import { ActualizarPublicacionDto, CalificarProductorDto, CatalogoQueryDto, CrearPublicacionDto } from './dto';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private s: PublicacionesService) {}

  // --- públicas ---
  @Get() catalogo(@Query() q: CatalogoQueryDto) { return this.s.catalogo(q); }
  @Get('productor/:id/perfil') perfilProductor(@Param('id', ParseUUIDPipe) id: string) { return this.s.perfilProductor(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Rol.PRODUCTOR, Rol.ADMIN) @Post('productor/:id/calificaciones')
  calificarProductor(@Param('id', ParseUUIDPipe) id: string, @UsuarioActual() u: JwtUser, @Body() dto: CalificarProductorDto) {
    return this.s.calificarProductor(id, u.sub, dto);
  }

  // --- del productor (la ruta fija va antes que :id) ---
  @UseGuards(JwtAuthGuard) @Get('mias/lista') mias(@UsuarioActual() u: JwtUser) { return this.s.misPublicaciones(u.sub); }

  @Get(':id') detalle(@Param('id', ParseIntPipe) id: number) { return this.s.detalle(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Rol.PRODUCTOR, Rol.ADMIN) @Post()
  crear(@UsuarioActual() u: JwtUser, @Body() dto: CrearPublicacionDto) { return this.s.crear(u.sub, dto); }

  @UseGuards(JwtAuthGuard) @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @UsuarioActual() u: JwtUser, @Body() dto: ActualizarPublicacionDto) { return this.s.actualizar(id, u.sub, u.rol, dto); }

  @UseGuards(JwtAuthGuard) @Patch(':id/agotada')
  agotada(@Param('id', ParseIntPipe) id: number, @UsuarioActual() u: JwtUser) { return this.s.marcarAgotada(id, u.sub); }

  @UseGuards(JwtAuthGuard) @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number, @UsuarioActual() u: JwtUser) { return this.s.eliminar(id, u.sub, u.rol); }
}
