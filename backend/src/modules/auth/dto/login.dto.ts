import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail() correo: string;
  @IsString() @IsNotEmpty() @MaxLength(72) contrasena: string;
}
