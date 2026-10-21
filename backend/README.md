# Backend

API REST de MantaLink construida con NestJS, TypeORM y PostgreSQL. Todas las rutas se publican bajo `/api`.

Para la introducción y el arranque de todo el proyecto, consulta el [README principal](../README.md). El estado y las tareas de producción están en [Docs/workflow](../Docs/workflow/README.md).

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
│       ├── auth/                #   registro, login, perfil, cambiar y recuperar contraseña
│       ├── archivos/            #   subida y descarga de fotos
│       ├── correo/              #   envío de correos (SMTP, o consola en desarrollo)
│       ├── contacto/            #   formulario de contacto general (CU11)
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
| GET | `/api/publicaciones?q=&categoria=&categorias=&ubicacion=&subcategoria=&orden=&pagina=&limite=` | Público |
| GET | `/api/publicaciones/:id` | Público |
| GET | `/api/categorias` | Público |
| POST | `/api/auth/registro`, `/api/auth/login` · GET `/api/auth/me` | Público / sesión |
| POST/PATCH/DELETE | `/api/publicaciones` · `/:id` · `/:id/agotada` · GET `/mias/lista` | Productor verificado |
| GET | `/api/admin/publicaciones/pendientes`, `/api/admin/usuarios/pendientes` | Admin |
| PATCH | `/api/admin/publicaciones/:id/moderar`, `/api/admin/usuarios/:id/estado` | Admin |

Además: `POST /api/publicaciones/:id/reportar` (público), `GET/POST/DELETE /api/favoritos`, `GET /api/admin/reportes`,
`PATCH /api/admin/reportes/:id/resolver`, `POST /api/auth/cambiar-contrasena`.

**Fotos:** `POST /api/archivos` (multipart, campo `archivo`, solo productores, JPG/PNG/WebP hasta 5 MB) devuelve `{ url: "/api/archivos/<uuid>.jpg" }`;
esa ruta se manda luego en `imagenes` al crear/editar la oferta. `GET /api/archivos/:nombre` es público. Se valida el tipo
REAL por los primeros bytes (no por la extensión), el nombre lo genera el servidor y se guardan en `UPLOADS_DIR` (volumen en Docker).

**Recuperar contraseña (CU5):** `POST /api/auth/olvide-contrasena {correo}` (responde igual exista o no la cuenta) y
`POST /api/auth/restablecer-contrasena {token, nueva}`. El enlace vence a los 30 min, sirve una vez, solo se guarda su hash y,
al cambiar la clave, las sesiones anteriores dejan de valer. Sin `SMTP_HOST` el correo se imprime en la consola del backend
(`docker compose logs backend`); para correo real ver `.env.example`.

**Perfil y administración:** `PATCH /api/auth/perfil` (nombre, teléfono, vereda, negocio; nada más). Admin: `GET /api/admin/usuarios?q=&estado=&pagina=`;
categorías `GET/POST /api/admin/categorias`, `PATCH /:id`, `POST /:id/desactivar {reasignarAId}` (obligatorio si tiene publicaciones), `POST /:id/activar`;
mensajes `GET /api/admin/mensajes?pendientes=true`, `PATCH /:id/atendido`. Público: `POST /api/contacto` (3 por minuto).
Las fotos que ninguna publicación usa se borran del disco solas cada 24 h (solo las de más de 24 h).

## Pruebas
`cd backend && npm test` — 22 pruebas de integración (necesita la BD `mantalink_test`).

## Seguridad: qué hay y qué falta
Hecho: hash bcrypt, JWT con rol/estado verificados en BD en cada petición (suspender tiene efecto inmediato), roles,
validación estricta de entradas (sin campos extra), límite de intentos (login/registro/reportes), cabeceras `helmet`,
CORS por lista, comodines LIKE escapados, config insegura bloquea el arranque en producción.
La migración de ubicación de publicaciones se ejecuta automáticamente al iniciar en producción. Las publicaciones existentes
sin ubicación propia usan como respaldo la vereda del productor. Los demás pendientes operativos se mantienen en
[Docs/workflow](../Docs/workflow/README.md).
