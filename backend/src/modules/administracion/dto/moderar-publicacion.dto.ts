import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ModerarPublicacionDto {
  @IsIn(['APROBAR', 'RECHAZAR']) decision: 'APROBAR' | 'RECHAZAR';
  @IsOptional() @IsString() @MaxLength(500) motivo?: string;
}
