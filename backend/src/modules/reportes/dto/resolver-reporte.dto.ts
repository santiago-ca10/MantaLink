import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

// Decisiones del diagrama de secuencia (6.5.2)
export class ResolverReporteDto {
  @IsIn(['MANTENER', 'SOLICITAR_CAMBIOS', 'OCULTAR', 'RETIRAR']) decision: 'MANTENER' | 'SOLICITAR_CAMBIOS' | 'OCULTAR' | 'RETIRAR';
  @IsOptional() @IsString() @MaxLength(500) comentario?: string;
}
