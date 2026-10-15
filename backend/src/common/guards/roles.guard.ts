import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Rol } from '../../database/entities';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.get<Rol[]>('roles', ctx.getHandler()) ?? this.reflector.get<Rol[]>('roles', ctx.getClass());
    if (!roles?.length) return true;
    if (!roles.includes(ctx.switchToHttp().getRequest().user?.rol)) throw new ForbiddenException('No tienes permiso para esta acción');
    return true;
  }
}
