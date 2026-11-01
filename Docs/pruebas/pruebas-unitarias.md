# Pruebas unitarias de MantaLink

Las pruebas unitarias del frontend comprueban funciones pequeñas de forma aislada, sin levantar el navegador, el backend ni la base de datos. Están escritas con Vitest.

## Ejecutar

Desde la carpeta `frontend`:

```bash
npm test
```

El comando ejecuta `vitest run` una vez y muestra el resultado en la terminal.

## Cobertura actual

Las pruebas están en `frontend/src/utils/format.test.ts` y cubren:

| Grupo | Qué se verifica |
|---|---|
| `telefonoCO` | Normalización de celulares colombianos con espacios, guiones y prefijos; rechazo de valores inválidos. |
| Enlaces | Generación de enlaces de WhatsApp con el texto codificado y rechazo de números inválidos para WhatsApp o llamada. |
| `urlSegura` | Aceptación de URLs HTTP/HTTPS y rechazo de esquemas peligrosos o valores que no son URLs. |
| Fotos subidas al portal | Aceptación de rutas `/api/archivos/<uuid>.<extensión permitida>` y rechazo de rutas inventadas o con `../`. |

En la ejecución reportada se aprobaron **7 pruebas** en **1 archivo**.

## Diferencia con las demás pruebas

- [Pruebas de integración](./pruebas-integracion.md): comprueban la colaboración entre la API y la base de datos.
- [Pruebas de sistema](./pruebas-sistema.md): recorren la aplicación completa en un navegador con Playwright.
