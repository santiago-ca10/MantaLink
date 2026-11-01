# Pruebas de integración de MantaLink

Las pruebas de integración del backend levantan la aplicación NestJS y envían solicitudes HTTP reales contra una base de datos de pruebas. Comprueban que controladores, validaciones, permisos, servicios y persistencia trabajen juntos. Se ejecutan con el test runner integrado de Node.js.

## Ejecutar

Desde la carpeta `backend`:

```bash
npm test
```

El script ejecuta `test/api.test.ts` de forma secuencial. Requiere PostgreSQL y la base de datos aislada `mantalink_test`; se puede configurar la conexión mediante `TEST_DATABASE_URL`.

> **Importante:** la prueba sincroniza el esquema borrando las tablas existentes antes de crear sus datos (`synchronize(true)`). Usa únicamente una base de datos desechable de pruebas; nunca configures `TEST_DATABASE_URL` para apuntar a desarrollo o producción.

Las fotos de prueba se guardan en una carpeta temporal fuera del proyecto y se limpian al finalizar.

## Escenarios cubiertos

Las 24 pruebas actuales verifican:

- Registro y autenticación: validación de datos, protección del rol/estado, respuestas que no exponen el hash, errores de inicio de sesión uniformes y límite de intentos.
- Sesiones y permisos: rutas protegidas, roles, suspensión inmediata de cuentas y cambio o recuperación de contraseña.
- Publicaciones y moderación: flujo de publicación pendiente y aprobación, validación de vigencia/datos y restricciones de propiedad.
- Perfiles y calificaciones: perfil público, agrupación de publicaciones y calificación actualizable por cuenta.
- Administración: usuarios, categorías, reasignación al desactivar categorías y mensajes de contacto.
- Catálogo, eventos y reportes: filtros combinados, búsqueda, comodines tratados como texto y revisión de reportes.
- Archivos: validación de imágenes, carga con nombre generado por el servidor y limpieza de fotos huérfanas.

En la ejecución reportada se aprobaron **24 pruebas**, sin fallos.

## Advertencia de ejecución

La salida puede mostrar una advertencia deprecada de `pg` sobre consultas concurrentes en un mismo cliente. En la ejecución reportada no impidió que las 24 pruebas pasaran.

## Diferencia con las demás pruebas

- [Pruebas unitarias](./pruebas-unitarias.md): verifican funciones pequeñas del frontend de forma aislada.
- [Pruebas de sistema](./pruebas-sistema.md): recorren la aplicación completa desde el navegador.
