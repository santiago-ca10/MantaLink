import { ArrayMaxSize, IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { EsImagen } from '../../../common';

export class CrearPublicacionDto {
  @IsString() @IsNotEmpty() @MaxLength(120) titulo: string;
  @IsString() @IsNotEmpty() @MaxLength(2000) descripcion: string;
  @IsString() @IsNotEmpty() @MaxLength(60) precio: string;
  @IsInt() categoriaId: number;
  @IsOptional() @IsString() @MaxLength(80) ubicacion?: string;
  @IsOptional() @IsString() subcategoria?: string;
  // Máx. 5 fotos, como en el mockup: enlaces externos o archivos subidos con POST /api/archivos
  @IsOptional() @IsArray() @ArrayMaxSize(5) @EsImagen() imagenes?: string[];
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() correoContacto?: string;
  // Días que quedará publicada (se valida contra el rango de la categoría)
  @IsOptional() @IsInt() @Min(1) duracionDias?: number;
  // Solo para categorías de tipo evento
  @IsOptional() @IsDateString() fechaEvento?: string;
}
