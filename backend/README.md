# MantaLink

Portal web comunitario para Manta (Cundinamarca). Arquitectura según la sección 6.4 del documento de la Actividad 4:
cliente-servidor en 3 capas, monolito modular.

- `backend/` — NestJS + TypeORM + PostgreSQL (API REST bajo `/api`)
- `frontend/` — React + TypeScript (pendiente: portar `mockup-referencia/`)
- `Docs/mockup/` — el mockup HTML/CSS/JS (ya está en el repo, no se toca)
- `docker-compose.yml` — levanta PostgreSQL + el backend (solo desarrollo)

## Estructura del backend

```
backend/
├── src/
│   ├── main.ts                  # arranque: seguridad, CORS, validación global
│   ├── app.module.ts            # une todos los módulos
│   ├── config/                  # validación de variables de entorno
│   ├── common/                  # piezas compartidas por todos los módulos
│   │   ├── guards/              #   JwtAuthGuard (sesión), RolesGuard (permisos)
│   │   └── decorators/          #   @Roles(), @UsuarioActual()
│   ├── database/
│   │   ├── entities/            # las 6 clases del diagrama (tablas)
│   │   └── seed/                # datos iniciales de ejemplo
│   └── modules/                 # UNA carpeta por módulo (sección 6.4.2 del documento)
│       ├── auth/                #   registro, login, perfil, cambiar contraseña
│       ├── publicaciones/       #   catálogo público + CRUD del productor
│       ├── categorias/
│       ├── favoritos/
│       ├── reportes/            #   reportar (público) + resolver (admin)
│       └── administracion/      #   verificar cuentas, moderar ofertas
│           ├── *.controller.ts  #     recibe la petición HTTP
│           ├── *.service.ts     #     lógica de negocio
│           ├── *.module.ts      #     junta controller + service
│           └── dto/             #     forma y validación de lo que llega
└── test/                        # pruebas de integración
```

Regla simple: **controller** recibe y responde, **service** decide, **dto** valida, **entity** es la tabla.
Para un módulo nuevo se copia la forma de cualquiera de los de arriba y se agrega a `app.module.ts`.

## Arrancar

**Opción A (recomendada): todo con Docker.** Solo necesitas Docker Desktop abierto. Desde la raíz del repo:

```bash
docker compose up --build
```
Levanta la base de datos y el backend, y carga los datos de ejemplo. Listo en `http://localhost:3000/api`.
Para apagar: `Ctrl+C` y luego `docker compose down` (agrega `-v` si quieres borrar también los datos).
Si cambias código del backend, vuelve a correr `docker compose up --build`.

**Opción B: backend en tu PC (para programar con recarga automática).** Necesitas Node 20+.

```bash
docker compose up -d db              # solo la base de datos
cd backend && cp .env.example .env   # (en PowerShell: copy .env.example .env)
npm install
npm run seed
npm run start:dev
```

Cuentas de prueba (solo desarrollo): `admin@mail.com / admin` y `productor.x@mail.com / productor123`.

## Endpoints del MVP

| Método | Ruta | Quién |
|---|---|---|
| GET | `/api/publicaciones?q=&categoria=&subcategoria=&orden=&pagina=&limite=` | Público |
| GET | `/api/publicaciones/:id` | Público |
| GET | `/api/categorias` | Público |
| POST | `/api/auth/registro`, `/api/auth/login` · GET `/api/auth/me` | Público / sesión |
| POST/PATCH/DELETE | `/api/publicaciones` · `/:id` · `/:id/agotada` · GET `/mias/lista` | Productor verificado |
| GET | `/api/admin/publicaciones/pendientes`, `/api/admin/usuarios/pendientes` | Admin |
| PATCH | `/api/admin/publicaciones/:id/moderar`, `/api/admin/usuarios/:id/estado` | Admin |

Además: `POST /api/publicaciones/:id/reportar` (público), `GET/POST/DELETE /api/favoritos`, `GET /api/admin/reportes`,
`PATCH /api/admin/reportes/:id/resolver`, `POST /api/auth/cambiar-contrasena`.

## Pruebas
`cd backend && npm test` — 14 pruebas de integración (necesita la BD `mantalink_test`).

## Seguridad: qué hay y qué falta
Hecho: hash bcrypt, JWT con rol/estado verificados en BD en cada petición (suspender tiene efecto inmediato), roles,
validación estricta de entradas (sin campos extra), límite de intentos (login/registro/reportes), cabeceras `helmet`,
CORS por lista, comodines LIKE escapados, config insegura bloquea el arranque en producción.
Antes de publicar: HTTPS, `CORS_ORIGINS`, `JWT_SECRET` >= 32 caracteres, `trust proxy` si hay proxy inverso, migraciones
en vez de `synchronize`, copias de seguridad de la BD (RNF Respaldo) y que el frontend nunca use `innerHTML` con datos del usuario.

## Pendiente (en orden)
1. Frontend React: catálogo, detalle, login/registro, publicar (portar del mockup)
2. (hecho en API) panel de moderación en el frontend
3. Subida real de imágenes (servicio de almacenamiento por definir)
4. Recuperar/cambiar contraseña, formulario de contacto, política de privacidad
5. Migraciones (hoy `synchronize` crea las tablas), pruebas, despliegue
