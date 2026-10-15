import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtUser, Roles, RolesGuard, UsuarioActual } from '../../common';
import { Rol } from '../../database/entities';
import { AdministracionService } from './administracion.service';
import { CambiarEstadoUsuarioDto, ModerarPublicacionDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.ADMIN)
@Controller('admin')
export class AdministracionController {
  constructor(private s: AdministracionService) {}
  @Get('publicaciones/pendientes') publicacionesPendientes() { return this.s.publicacionesPendientes(); }
  @Get('usuarios/pendientes') cuentasPendientes() { return this.s.cuentasPendientes(); }
  @Patch('publicaciones/:id/moderar')
  moderar(@Param('id', ParseIntPipe) id: number, @UsuarioActual() a: JwtUser, @Body() dto: ModerarPublicacionDto) { return this.s.moderar(id, a.sub, dto); }
  @Patch('usuarios/:id/estado')
  estado(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CambiarEstadoUsuarioDto) { return this.s.cambiarEstadoUsuario(id, dto.estado); }
}
