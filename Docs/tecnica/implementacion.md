# Detalles de implementación

## Organización del código

### Frontend (`frontend/src/`)

- `pages/`: pantallas del catálogo, autenticación, publicaciones, perfil y administración.
- `components/layout/` y `components/ui/`: estructura compartida, controles y componentes de interfaz.
- `api/`: cliente HTTP y funciones que representan operaciones de la API.
- `context/`: estado compartido de autenticación, preferencias y notificaciones.
- `hooks/`: lógica reutilizable para carga de datos y favoritos.
- `types/`: tipos utilizados por la interfaz y las respuestas.
- `utils/`: funciones independientes para formato, enlaces, imágenes y traducciones.

`App.tsx` declara las rutas. Las pantallas secundarias se cargan de forma diferida; `RutaProtegida` limita las vistas autenticadas y administrativas. `main.tsx` monta los proveedores compartidos y React Router.

El cliente centralizado `api/` añade el token cuando corresponde, serializa JSON, admite `FormData`, convierte errores HTTP a `ApiError` y notifica el vencimiento de sesión. El frontend guarda el JWT en `localStorage`; el backend vuelve a comprobar usuario, estado y rol al autorizar cada petición.

### Backend (`backend/src/`)

- `main.ts`: valida configuración, habilita Helmet, CORS, prefijo `/api` y validación global.
- `app.module.ts`: configura módulos, entidades TypeORM, migraciones y límite general de solicitudes.
- `config/`: validación de variables de entorno.
- `common/`: guards y decoradores compartidos.
- `database/entities/`: entidades y enumeraciones de persistencia.
- `database/migrations/` y `database/seed/`: cambios de esquema y datos iniciales.
- `modules/`: funcionalidades agrupadas por dominio. En general, los controladores exponen endpoints y los servicios contienen reglas de negocio y persistencia.

## Validación y seguridad

- El `ValidationPipe` global transforma entradas, descarta propiedades no declaradas y rechaza campos adicionales (`whitelist`, `forbidNonWhitelisted`).
- Helmet añade cabeceras de seguridad; CORS puede limitarse a los orígenes indicados por `CORS_ORIGINS`.
- El guard JWT verifica las solicitudes protegidas y los guards de rol aplican permisos de administración. La autorización considera el estado actual de la cuenta.
- Las contraseñas se almacenan como hashes bcrypt, no en texto plano. Los tokens de recuperación se gestionan por separado y los cambios de contraseña invalidan sesiones anteriores.
- Existe limitación general de solicitudes y protecciones adicionales para operaciones sensibles.
- Las URL de imágenes y enlaces de contacto se validan en frontend y backend según su uso.

Estas medidas describen el código actual y no sustituyen una configuración de producción segura. El token del frontend está en `localStorage`; HTTPS y una cookie `httpOnly` están identificados como trabajo pendiente antes de producción.

## Datos y ciclo de vida

Las entidades TypeORM describen las tablas y relaciones. En desarrollo, TypeORM sincroniza el esquema; en producción, `synchronize` se deshabilita y se ejecutan las migraciones configuradas. No se debe ejecutar la prueba de integración sobre una base de datos con datos que se quieran conservar: el test limpia el esquema de la base configurada.

Las nuevas cuentas de productor requieren aprobación antes de publicar. Las publicaciones pasan por moderación y solo las aprobadas aparecen en el catálogo público. Las operaciones administrativas mantienen controles de rol en el backend, además de las restricciones de navegación en el frontend.

Las imágenes cargadas se verifican por el contenido real del archivo, se guardan en `UPLOADS_DIR` con un nombre generado por el servidor y se referencian desde las publicaciones. El proceso de limpieza elimina archivos huérfanos antiguos sin borrar archivos ajenos al portal.

## Configuración y ejecución

Variables centrales:

| Variable | Propósito |
|---|---|
| `DATABASE_URL` | Conexión PostgreSQL. |
| `JWT_SECRET` | Secreto de firma JWT; en producción se exige una longitud mínima de 32 caracteres. |
| `CORS_ORIGINS` | Orígenes autorizados separados por comas en producción. |
| `APP_URL` | URL pública utilizada para enlaces de la aplicación. |
| `PORT` | Puerto HTTP del backend (por defecto, `3000`). |
| `UPLOADS_DIR` | Directorio de archivos subidos. |
| `SMTP_HOST` y demás variables SMTP | Configuración de correo; sin SMTP configurado la recuperación no puede enviar correos reales. |

El backend se puede ejecutar con `npm run start:dev`, compilar con `npm run build` y ejecutar las pruebas de integración con `npm test`. En el frontend se usan `npm run dev`, `npm run build`, `npm test` y `npm run test:e2e`. La orquestación local completa se inicia desde la raíz con `docker compose up --build`.

Para las instrucciones completas de arranque y configuración, consulta [README principal](../../README.md), [backend](../../backend/README.md) y [frontend](../../frontend/README.md).
