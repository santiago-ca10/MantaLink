# Estado del proyecto

Este documento resume lo implementado en el repositorio y el trabajo operativo que queda antes de considerar un despliegue de producción. No es una lista de funcionalidades pendientes de portar desde el mockup: el frontend React ya está construido y funcionando con la API.

## Implementado

- Aplicación web React con catálogo, búsqueda, filtros por categoría y subcategoría, orden, paginación, detalle, favoritos y gestión de publicaciones.
- Filtros avanzados del catálogo por varias categorías y ubicación. La ubicación pertenece a cada publicación; las publicaciones antiguas usan la vereda del productor como respaldo.
- Registro, inicio de sesión, perfil, recuperación y cambio de contraseña.
- API NestJS con PostgreSQL, validación de entradas, control de roles, administración de categorías y usuarios, moderación, reportes y formulario de contacto.
- Carga y entrega de imágenes, y limpieza periódica de archivos sin uso.
- Preferencias de tema y tamaño de letra.
- Entorno de desarrollo Docker Compose y pruebas automatizadas de frontend y backend.
- Mockup estático disponible como demo independiente: [abrir el demo](https://santiago-ca10.github.io/MantaLink/).

## Pendiente antes de producción

- Definir y completar una estrategia de migraciones para todo el esquema. La migración de ubicación de publicaciones ya está incluida y se ejecuta al iniciar en producción; esto no sustituye migraciones para el resto de cambios futuros.
- Configurar y verificar el despliegue con HTTPS, orígenes CORS explícitos, secretos de producción y `trust proxy` cuando haya un proxy inverso.
- Decidir cómo guardar las sesiones de forma segura: el frontend actualmente conserva el token en `localStorage`; valorar cookies `httpOnly`, `Secure` y `SameSite` antes de producción.
- Definir copias de seguridad y recuperación de PostgreSQL y de los archivos cargados.
- Ejecutar pruebas de despliegue y validar la configuración real de correo SMTP, dominio y URL de recuperación.
- Revisar que las credenciales y datos demostrativos no se utilicen en producción.

## Validación disponible

- Frontend: `cd frontend` y `npm test`; `npm run build` para compilar.
- Backend: `cd backend` y `npm test` (requiere la base de datos de pruebas `mantalink_test`); `npm run build` para compilar.

Las cuentas de demostración, los datos del seed y el contenido del demo son exclusivamente para desarrollo y pruebas.
