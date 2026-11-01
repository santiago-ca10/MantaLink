import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoUsuario, Usuario } from '../../database/entities';
import { JwtUser } from '../decorators/usuario-actual.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService, @InjectRepository(Usuario) private usuarios: Repository<Usuario>) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const h: string = req.headers['authorization'] ?? '';
    if (!h.startsWith('Bearer ')) throw new UnauthorizedException('Debes iniciar sesión');
    let payload: { sub: string; iat?: number };
    try { payload = await this.jwt.verifyAsync(h.slice(7)); } catch { throw new UnauthorizedException('Sesión inválida o vencida'); }
    // El rol y el estado se leen de la BD en cada petición, no del token: si el admin suspende una cuenta
    // o cambia un rol, el efecto es inmediato aunque el token siga sin vencer.
    const u = await this.usuarios.findOneBy({ id: payload.sub });
    if (!u || u.estado === EstadoUsuario.SUSPENDIDO) throw new UnauthorizedException('Sesión inválida o cuenta suspendida');
    // Contraseña cambiada o restablecida después de emitirse este token → sesión vencida
    if (u.contrasenaCambiadaEn && (payload.iat ?? 0) < Math.floor(u.contrasenaCambiadaEn.getTime() / 1000)) throw new UnauthorizedException('Sesión vencida: la contraseña cambió. Inicia sesión de nuevo');
    req.user = { sub: u.id, rol: u.rol } as JwtUser;
    return true;
  }
}
