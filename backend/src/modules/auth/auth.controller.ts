import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CambiarContrasenaDto, LoginDto, RegistroDto } from './dto';
import { JwtAuthGuard, JwtUser, UsuarioActual } from '../../common';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  // Límites estrictos contra fuerza bruta y creación masiva de cuentas
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) @Post('registro') registro(@Body() dto: RegistroDto) { return this.auth.registrar(dto); }
  @Throttle({ default: { limit: 8, ttl: 60_000 } }) @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto); }
  @UseGuards(JwtAuthGuard) @Get('me') me(@UsuarioActual() u: JwtUser) { return this.auth.perfil(u.sub); }
  @UseGuards(JwtAuthGuard) @Throttle({ default: { limit: 5, ttl: 60_000 } }) @Post('cambiar-contrasena')
  cambiar(@UsuarioActual() u: JwtUser, @Body() dto: CambiarContrasenaDto) { return this.auth.cambiarContrasena(u.sub, dto); }
}
