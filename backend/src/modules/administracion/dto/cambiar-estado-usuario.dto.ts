import { IsIn } from 'class-validator';

export class CambiarEstadoUsuarioDto {
  @IsIn(['ACTIVO', 'SUSPENDIDO']) estado: 'ACTIVO' | 'SUSPENDIDO';
}
