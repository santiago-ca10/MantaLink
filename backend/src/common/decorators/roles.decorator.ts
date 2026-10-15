import { SetMetadata } from '@nestjs/common';
import { Rol } from '../../database/entities';

/** Restringe una ruta a ciertos roles. Se usa junto con JwtAuthGuard y RolesGuard. */
export const Roles = (...roles: Rol[]) => SetMetadata('roles', roles);
