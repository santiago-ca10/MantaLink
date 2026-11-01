import { ArrayMaxSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CrearCategoriaDto {
  @IsString() @IsNotEmpty() @MaxLength(60) nombre: string;
  @IsOptional() @IsString() @MaxLength(300) descripcion?: string;
  @IsInt() @Min(1) @Max(365) diasMin: number;
  @IsInt() @Min(1) @Max(365) diasMax: number;
  @IsOptional() @IsBoolean() esEvento?: boolean;
  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true }) @MaxLength(60, { each: true }) subcategorias?: string[];
}

export class ActualizarCategoriaDto {
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(60) nombre?: string;
  @IsOptional() @IsString() @MaxLength(300) descripcion?: string;
  @IsOptional() @IsInt() @Min(1) @Max(365) diasMin?: number;
  @IsOptional() @IsInt() @Min(1) @Max(365) diasMax?: number;
  @IsOptional() @IsBoolean() esEvento?: boolean;
  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true }) @MaxLength(60, { each: true }) subcategorias?: string[];
}

// Al desactivar una categoría con ofertas, hay que decir a cuál pasan (CU7: no dejar productos huérfanos)
export class DesactivarCategoriaDto {
  @IsOptional() @IsInt() reasignarAId?: number;
}
