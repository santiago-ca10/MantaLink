import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const MOTIVOS_REPORTE = ['Contenido inapropiado', 'Información engañosa', 'Datos incorrectos', 'Posible estafa', 'Otro'];

export class ReportarDto {
  @IsIn(MOTIVOS_REPORTE) motivo: string;
  @IsOptional() @IsString() @MaxLength(500) comentario?: string;
}
