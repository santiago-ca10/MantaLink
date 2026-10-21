# Documentación de MantaLink

Guías y referencias del proyecto, organizadas por tema:

| Carpeta | Contenido |
|---|---|
| [`mockup/`](./mockup/README.md) | Prototipo HTML/CSS/JS, recorridos de demostración y limitaciones. |
| [`images/`](./images/) | Recursos visuales, incluido el [diagrama de arquitectura](./images/Arquitectura.png). |
| [`workflow/`](./workflow/README.md) | Funcionalidad implementada y pendientes del proyecto. |

## Guías por aplicación

- [Backend](../backend/README.md): ejecución, API, pruebas y notas del servidor.
- [Frontend](../frontend/README.md): ejecución, estructura y scripts de la aplicación React.
- [README principal](../README.md): introducción, botón al demo y ejecución local con Docker.

## Filtros del catálogo

La aplicación permite filtrar el catálogo por varias categorías y por vereda o sector:

- `GET /api/publicaciones?categorias=Alimentos&categorias=Servicios` combina categorías.
- `GET /api/publicaciones?ubicacion=salitre` busca, sin distinguir mayúsculas, en la ubicación de la publicación.
- `categoria` sigue disponible para enlaces existentes que filtran una sola categoría.

La ubicación se captura al crear una publicación y se puede cambiar al editarla. Para las publicaciones anteriores que no tengan ubicación, se usa la vereda del productor como respaldo.
