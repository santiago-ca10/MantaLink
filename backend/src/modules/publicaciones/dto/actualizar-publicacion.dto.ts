import { ArrayMaxSize, IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class ActualizarPublicacionDto {
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(120) titulo?: string;
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(2000) descripcion?: string;
  @IsOptional() @IsString() @MaxLength(60) precio?: string;
  @IsOptional() @IsString() subcategoria?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(5) @IsUrl({ require_tld: false }, { each: true }) imagenes?: string[];
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() correoContacto?: string;
  @IsOptional() @IsInt() @Min(1) duracionDias?: number;
  @IsOptional() @IsDateString() fechaEvento?: string;
}
