import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard, JwtUser, Roles, RolesGuard, UsuarioActual } from '../../common';
import { Rol } from '../../database/entities';
import { ReportarDto, ResolverReporteDto } from './dto';
import { ReportesService } from './reportes.service';

@Controller()
export class ReportesController {
  constructor(private s: ReportesService, private jwt: JwtService) {}

  // Público: el comprador no necesita cuenta. Si manda un token válido el reporte se asocia a él; si no, queda anónimo.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('publicaciones/:id/reportar')
  async reportar(@Param('id', ParseIntPipe) id: number, @Body() dto: ReportarDto, @Req() req: any) {
    let uid: string | null = null;
    const h: string = req.headers['authorization'] ?? '';
    if (h.startsWith('Bearer ')) { try { uid = (await this.jwt.verifyAsync(h.slice(7))).sub; } catch { /* token malo: se trata como anónimo */ } }
    return this.s.reportar(id, dto, uid);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Rol.ADMIN) @Get('admin/reportes')
  pendientes() { return this.s.pendientes(); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Rol.ADMIN) @Patch('admin/reportes/:id/resolver')
  resolver(@Param('id', ParseIntPipe) id: number, @UsuarioActual() a: JwtUser, @Body() dto: ResolverReporteDto) { return this.s.resolver(id, a.sub, dto); }
}
