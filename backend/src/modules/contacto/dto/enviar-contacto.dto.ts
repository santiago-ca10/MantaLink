import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class EnviarContactoDto {
  @IsString() @MinLength(2) @MaxLength(100) nombre: string;
  @IsEmail() @MaxLength(120) correo: string;
  @IsString() @IsNotEmpty() @MaxLength(120) asunto: string;
  @IsString() @MinLength(10, { message: 'Cuéntanos un poco más (mínimo 10 caracteres)' }) @MaxLength(2000) mensaje: string;
}
