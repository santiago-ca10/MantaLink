import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Rol } from '../../database/entities';

export interface JwtUser { sub: string; rol: Rol }

/** Entrega el usuario autenticado (id y rol leídos de la BD por JwtAuthGuard). */
export const UsuarioActual = createParamDecorator((_: unknown, ctx: ExecutionContext): JwtUser => ctx.switchToHttp().getRequest().user);
