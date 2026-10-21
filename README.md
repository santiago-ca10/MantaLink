# MantaLink

Portal web comunitario para conectar a habitantes, productores y visitantes de Manta, Cundinamarca.

<p align="center">
  <a href="https://santiago-ca10.github.io/MantaLink/">
    <img alt="Ver demo del mockup MantaLink" src="https://img.shields.io/badge/▶%20Ver%20demo-del%20mockup-3057C4?style=for-the-badge">
  </a>
</p>

> El demo es un mockup estático e independiente. Sus cuentas, publicaciones, filtros y acciones son demostrativos; no se conectan al backend ni representan datos reales.

## Proyecto

- [`backend/`](./backend/): API REST con NestJS, TypeORM y PostgreSQL.
- [`frontend/`](./frontend/): aplicación React, TypeScript y Vite que consume la API.
- [`Docs/mockup/`](./Docs/mockup/): archivos del prototipo publicado en el demo.
- [`Docs/images/`](./Docs/images/): imágenes de referencia y arquitectura.
- [`Docs/workflow/`](./Docs/workflow/): estado del proyecto, trabajo completado y pendientes.
- [`docker-compose.yml`](./docker-compose.yml): entorno local de desarrollo.

## Ejecutar localmente

Requiere Docker Desktop. Desde la raíz:

```bash
docker compose up --build
```

Abre la aplicación en [http://localhost:8080](http://localhost:8080). La API queda disponible en [http://localhost:3000/api](http://localhost:3000/api).

Para detener los servicios, usa `Ctrl+C` y luego:

```bash
docker compose down
```

Las credenciales incluidas en Docker son solo para desarrollo. No las uses en producción.

## Documentación

- [Índice de documentación](./Docs/README.md)
- [Guía del backend](./backend/README.md)
- [Guía del frontend](./frontend/README.md)
- [Guía del mockup](./Docs/mockup/README.md)
- [Estado y pendientes](./Docs/workflow/README.md)
