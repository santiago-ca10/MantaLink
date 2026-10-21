import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtUser, Roles, RolesGuard, UsuarioActual } from '../../common';
import { Rol } from '../../database/entities';
import { AdministracionService } from './administracion.service';
import { ActualizarCategoriaDto, CambiarEstadoUsuarioDto, CrearCategoriaDto, DesactivarCategoriaDto, ModerarPublicacionDto, UsuariosQueryDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.ADMIN)
@Controller('admin')
export class AdministracionController {
  constructor(private s: AdministracionService) {}
  @Get('publicaciones/pendientes') publicacionesPendientes() { return this.s.publicacionesPendientes(); }
  @Get('publicaciones/todas') publicacionesTodas() { return this.s.publicacionesTodas(); }
  @Get('usuarios/pendientes') cuentasPendientes() { return this.s.cuentasPendientes(); }
  @Patch('publicaciones/:id/moderar')
  moderar(@Param('id', ParseIntPipe) id: number, @UsuarioActual() a: JwtUser, @Body() dto: ModerarPublicacionDto) { return this.s.moderar(id, a.sub, dto); }
  @Patch('usuarios/:id/estado')
  estado(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CambiarEstadoUsuarioDto) { return this.s.cambiarEstadoUsuario(id, dto.estado); }

  // CU9
  @Get('usuarios') usuarios(@Query() q: UsuariosQueryDto) { return this.s.usuariosLista(q); }

  // CU7
  @Get('categorias') categorias() { return this.s.categoriasTodas(); }
  @Post('categorias') crearCategoria(@Body() dto: CrearCategoriaDto) { return this.s.crearCategoria(dto); }
  @Patch('categorias/:id') editarCategoria(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarCategoriaDto) { return this.s.actualizarCategoria(id, dto); }
  @Post('categorias/:id/desactivar') desactivarCategoria(@Param('id', ParseIntPipe) id: number, @Body() dto: DesactivarCategoriaDto) { return this.s.desactivarCategoria(id, dto.reasignarAId); }
  @Post('categorias/:id/activar') activarCategoria(@Param('id', ParseIntPipe) id: number) { return this.s.activarCategoria(id); }

  // CU11
  @Get('mensajes') mensajes(@Query('pendientes', new ParseBoolPipe({ optional: true })) pend?: boolean) { return this.s.mensajesLista(pend ?? false); }
  @Patch('mensajes/:id/atendido') atendido(@Param('id', ParseIntPipe) id: number, @Body('atendido', ParseBoolPipe) a: boolean) { return this.s.marcarMensaje(id, a); }
}
