import { Equals, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegistroDto {
  @IsString() @IsNotEmpty() @MaxLength(120) nombre: string;
  @IsString() @IsNotEmpty() tipoDocumento: string;
  @IsString() @IsNotEmpty() numeroDocumento: string;
  @IsEmail() correo: string;
  @IsOptional() @IsString() telefono?: string;
  @IsString() @IsNotEmpty() vereda: string;
  @IsOptional() @IsString() nombreNegocio?: string;
  // 72 = límite de bytes de bcrypt
  @IsString() @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' }) @MaxLength(72) contrasena: string;
  @IsString() @MaxLength(72) confirmarContrasena: string;
  // Checkbox del mockup: declara que reside en Manta
  @Equals(true, { message: 'Debes confirmar que resides en Manta' }) residente: boolean;
}
