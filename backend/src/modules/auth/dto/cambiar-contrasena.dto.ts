import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CambiarContrasenaDto {
  @IsString() @IsNotEmpty() @MaxLength(72) actual: string;
  @IsString() @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' }) @MaxLength(72) nueva: string;
}
