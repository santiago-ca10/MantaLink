import 'dotenv/config'; // carga .env ANTES de que los módulos lean process.env (p. ej. JWT_SECRET)
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { validarConfig } from './config/env.validation';

async function bootstrap() {
  validarConfig();
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); // cabeceras seguras (RNF Seguridad de datos)
  // En producción solo los orígenes listados en CORS_ORIGINS (separados por coma)
  const origenes = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim());
  app.enableCors({ origin: origenes?.length ? origenes : true });
  app.use((req: any, res: any, next: any) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  app.setGlobalPrefix('api');
  // whitelist descarta campos no esperados; así nadie se asigna rol ADMIN desde el body
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
