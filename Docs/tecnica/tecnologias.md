# Tecnologías utilizadas

Las versiones exactas y los scripts están definidos en `frontend/package.json`, `backend/package.json` y sus respectivos archivos de bloqueo.

| Área | Tecnología | Uso |
|---|---|---|
| Lenguaje | TypeScript | Frontend y backend. |
| Interfaz | React 18 | Componentes y pantallas de la SPA. |
| Enrutamiento | React Router 6 | Navegación y rutas del frontend. |
| Desarrollo y compilación frontend | Vite 5 | Servidor de desarrollo, proxy de API y compilación de recursos estáticos. |
| API | NestJS 12 | Módulos, controladores, servicios y arranque del servidor Node.js. |
| Persistencia | PostgreSQL 16 y TypeORM | Base relacional, entidades y migraciones. |
| Validación de solicitudes | `class-validator`, `class-transformer` y `ValidationPipe` de NestJS | Validación y transformación de cuerpos de entrada. |
| Autenticación | JWT de NestJS y `bcrypt` | Tokens de sesión y almacenamiento de contraseñas mediante hash. |
| Seguridad HTTP | Helmet y CORS de NestJS | Cabeceras de seguridad y control de orígenes. |
| Limitación de solicitudes | `@nestjs/throttler` | Límite general y controles más estrictos en operaciones sensibles. |
| Servidor web | NGINX 1.27 Alpine | Sirve la compilación del frontend y actúa como proxy de `/api/`. |
| Contenedores | Docker y Docker Compose | Entorno local con servicios separados. |
| Pruebas unitarias | Vitest 2 | Pruebas de utilidades del frontend. |
| Pruebas de integración | Node.js test runner | Pruebas HTTP del backend con PostgreSQL. |
| Pruebas de sistema | Playwright | Automatización de flujos en navegador. |

## Herramientas de desarrollo

- `ts-node` y `ts-node-dev` ejecutan TypeScript en las tareas de desarrollo y pruebas del backend.
- `@nestjs/cli` y `typescript` soportan la compilación del backend.
- `@vitejs/plugin-react` integra React con Vite.
- `npm` instala dependencias y ejecuta los scripts declarados por cada aplicación.

La aplicación no requiere una plataforma de Python ni un framework CSS adicional para ejecutarse.
