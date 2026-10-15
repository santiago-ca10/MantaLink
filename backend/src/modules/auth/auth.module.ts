import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../database/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard, RolesGuard } from '../../common';

// Global para que los guards estén disponibles en los demás módulos sin reimportar
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET ?? 'dev-secret-solo-desarrollo', signOptions: { expiresIn: '8h' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [JwtAuthGuard, RolesGuard, TypeOrmModule],
})
export class AuthModule {}
