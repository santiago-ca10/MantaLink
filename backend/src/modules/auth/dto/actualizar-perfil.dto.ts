import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// Solo estos datos se pueden editar. Correo, documento, rol y estado NO: los controla el sistema o el administrador.
export class ActualizarPerfilDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) nombre?: string;
  @IsOptional() @IsString() @Matches(/^[0-9+()\s-]{7,20}$/, { message: 'Teléfono no válido' }) telefono?: string;
  @IsOptional() @IsString() @MaxLength(80) vereda?: string;
  @IsOptional() @IsString() @MaxLength(100) nombreNegocio?: string;
}
