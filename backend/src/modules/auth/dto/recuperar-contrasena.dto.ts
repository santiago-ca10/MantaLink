import { IsEmail, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class OlvideContrasenaDto {
  @IsEmail() @MaxLength(120) correo: string;
}

export class RestablecerContrasenaDto {
  @IsString() @Length(64, 64, { message: 'El enlace no es válido' }) token: string;
  @IsString() @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' }) @MaxLength(72) nueva: string;
}
