import { IsInt, Max, Min } from 'class-validator';

export class CalificarProductorDto {
  @IsInt() @Min(1) @Max(5) puntuacion: number;
}
