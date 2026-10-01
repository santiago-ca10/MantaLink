# MantaLink — Mockup web

Prototipo navegable del portal comunitario MantaLink para explorar productos, servicios, eventos y emprendimientos de Manta. Este mockup representa flujos y decisiones de interfaz; no es un sistema de producción ni se conecta a un backend.

## Abrir el mockup

Abre `index.html` directamente en un navegador. No requiere instalación, compilación ni servidor local. La tipografía y las fotografías remotas necesitan conexión a internet; el resto de la interfaz funciona como archivos estáticos.

## Estructura

```text
docs/mockup/
├── index.html       Estructura de las pantallas y controles
├── css/styles.css   Temas, componentes y diseño adaptable
├── js/app.js        Datos de ejemplo, navegación y comportamiento
└── README.md        Esta guía
```

## Funcionalidades

- Catálogo con búsqueda por nombre, categorías y ubicación; los filtros avanzados se aplican juntos.
- Detalle de producto con imágenes, calificación y acceso al perfil público del vendedor.
- Perfiles públicos que agrupan las publicaciones de cada vendedor. El enlace al perfil está en el detalle de la publicación.
- Compartir tarjetas mediante el menú nativo del dispositivo o copiando el enlace directo.
- Registro, inicio de sesión simulado, perfil y gestión local de publicaciones.
- Publicación de eventos reservada al administrador.
- Panel de administración con revisión de cuentas, reportes, publicaciones y categorías.
- Resumen Balanced Scorecard con metas del proyecto y avances de demostración.
- Temas de color, idioma parcial, tamaño de letra y controles adaptados a escritorio y móvil.

## Recorridos de demostración

1. En Inicio, busca productos por nombre o abre **Filtros avanzados** para combinar categorías y vereda/sector.
2. Abre una tarjeta para ver el detalle. El nombre del vendedor dentro del detalle abre su perfil público; **Volver** regresa al detalle anterior.
3. Para probar la administración, inicia sesión con `admin@mail.com` y contraseña `admin`.
4. Desde el panel admin, revisa las cuentas pendientes o publica eventos. En este mockup, cualquier inicio de sesión de usuario con correo y contraseña no vacíos marca esa cuenta como verificada.

## Datos y persistencia

Los productos, vendedores, ubicaciones de ejemplo, cuentas iniciales y valores del BSC son datos demostrativos; las ubicaciones asociadas a los productos no representan una verificación geográfica real.

La demostración guarda en `localStorage` preferencias, favoritos, calificaciones, perfiles y estados de verificación. Las publicaciones nuevas, los reportes y las categorías agregadas son estado temporal de la página y se reinician al recargar. No se guardan contraseñas ni se valida identidad real.

## Indicadores BSC

El panel muestra las metas compartidas para el proyecto: 50 productores al año, 70 % de satisfacción, máximo 10 minutos para publicar y 4 capacitaciones al año. Los avances actuales (32 productores, 76 %, 8 minutos y 3 de 4 capacitaciones) son valores de demostración definidos en `INDICADORES_BSC` dentro de `js/app.js`; no son mediciones reales ni se calculan a partir del catálogo.

## Limitaciones

- Inicio de sesión, aprobación, reportes y administración son simulaciones cliente; no sustituyen autenticación ni permisos de servidor.
- Los botones de WhatsApp y llamada solo muestran un aviso; no contactan números reales.
- Imágenes y fuentes se cargan desde sitios externos y pueden cambiar o dejar de estar disponibles.
- El estado temporal y `localStorage` pertenecen al navegador actual; no hay sincronización entre usuarios o dispositivos.

## Mantenimiento

- `js/app.js`: datos de muestra (`UBICACIONES`, `productos`, `CATEGORIAS`), indicadores (`INDICADORES_BSC`), rutas y lógica de interacción.
- `css/styles.css`: variables de tema, estilos de componentes y reglas responsive.
- `index.html`: estructura semántica de pantallas, formularios y navegación.
