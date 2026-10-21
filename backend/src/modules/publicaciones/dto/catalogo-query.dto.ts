import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayUnique, IsArray, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CatalogoQueryDto {
  @IsOptional() @IsString() @MaxLength(80) q?: string;
  @IsOptional() @IsString() categoria?: string;
  @IsOptional()
  @Transform(({ value }) => value === undefined ? undefined : Array.isArray(value) ? value : [value])
  @IsArray() @ArrayMaxSize(20) @ArrayUnique() @IsString({ each: true }) @MaxLength(80, { each: true })
  categorias?: string[];
  @IsOptional() @IsString() @MaxLength(80) ubicacion?: string;
  @IsOptional() @IsString() subcategoria?: string;
  @IsOptional() @IsString() orden?: 'recientes' | 'precio_asc' | 'precio_desc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pagina?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limite?: number;
}
