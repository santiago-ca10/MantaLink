import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UsuariosQueryDto {
  @IsOptional() @IsString() @MaxLength(80) q?: string;
  @IsOptional() @IsIn(['PENDIENTE', 'ACTIVO', 'SUSPENDIDO']) estado?: 'PENDIENTE' | 'ACTIVO' | 'SUSPENDIDO';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pagina?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limite?: number;
}
