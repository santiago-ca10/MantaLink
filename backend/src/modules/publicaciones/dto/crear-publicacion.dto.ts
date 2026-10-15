import { ArrayMaxSize, IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CrearPublicacionDto {
  @IsString() @IsNotEmpty() @MaxLength(120) titulo: string;
  @IsString() @IsNotEmpty() @MaxLength(2000) descripcion: string;
  @IsString() @IsNotEmpty() @MaxLength(60) precio: string;
  @IsInt() categoriaId: number;
  @IsOptional() @IsString() subcategoria?: string;
  // Máx. 5 fotos, como en el mockup. Por ahora son URLs; la subida de archivos viene en la siguiente etapa.
  @IsOptional() @IsArray() @ArrayMaxSize(5) @IsUrl({ require_tld: false }, { each: true }) imagenes?: string[];
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() correoContacto?: string;
  // Días que quedará publicada (se valida contra el rango de la categoría)
  @IsOptional() @IsInt() @Min(1) duracionDias?: number;
  // Solo para categorías de tipo evento
  @IsOptional() @IsDateString() fechaEvento?: string;
}
