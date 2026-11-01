# Pruebas de sistema de MantaLink

Estas pruebas automatizadas validan recorridos completos desde la interfaz web hasta la API y la base de datos usando Playwright. A diferencia de `npm test`, que ejecuta las pruebas unitarias del frontend, estas pruebas controlan un navegador real.

## Preparacion

1. Instalar las dependencias del frontend: `cd frontend` y `npm install`.
2. Instalar Chromium para Playwright: `npx playwright install chromium`.
3. Desde la raiz del proyecto, levantar la aplicacion con `docker compose up --build` y esperar a que finalice el seed.
4. En otra terminal, desde `frontend`, ejecutar `npm run test:e2e`.

## Casos automatizados

| ID | Escenario | Resultado esperado |
|---|---|---|
| PS-01 | Catalogo y detalle | El catalogo muestra la publicacion de seed **Panela organica**; al abrirla se muestra su detalle y enlace al perfil del productor. |
| PS-02 | Busqueda | Buscar **Panela** actualiza el parametro `q` y presenta el resultado correspondiente. |
| PS-03 | Acceso privado | Sin sesion, abrir `/favoritos` redirige al formulario de inicio de sesion. |
| PS-04 | Inicio de sesion administrativo | Con las credenciales de desarrollo, se abre el panel de administracion. |

El usuario y contrasena de administracion se pueden cambiar con `MANTALINK_ADMIN_EMAIL` y `MANTALINK_ADMIN_PASSWORD`. Para probar otro servidor, se puede definir `MANTALINK_BASE_URL` (por defecto `http://localhost:8080`). No ejecutar contra datos ni cuentas de produccion: la prueba administrativa inicia sesion de verdad.

Playwright muestra los resultados (**Aprobado** o **Fallido**) en la terminal y guarda trazas de los fallos en `frontend/test-results`.

## Diferencia con las otras pruebas

- [Pruebas unitarias](./pruebas-unitarias.md): verifican una pieza aislada, por ejemplo, cómo se normaliza un teléfono.
- [Pruebas de integración](./pruebas-integracion.md): verifican que varios componentes técnicos colaboren, como un endpoint HTTP conectado a la base de datos.
- **Sistema:** verifica un flujo completo desde la perspectiva del usuario, usando el frontend, el backend y la base de datos en conjunto; en este proyecto se automatiza con Playwright.
