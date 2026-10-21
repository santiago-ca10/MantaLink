# MantaLink — Frontend (rama MantaLink-Web)

React 18 + TypeScript + Vite + React Router. Consume la API REST del backend (`/api`).

## Cómo correrlo
1. Todo con Docker: `docker compose up --build` (raíz del repo) y abre http://localhost:8080
2. Modo desarrollo (recarga en vivo): levanta solo `docker compose up db backend`, y aquí `npm install` + `npm run dev`
3. En desarrollo abre http://localhost:5173 (Vite redirige `/api` al backend en :3000)

Cuenta admin de desarrollo: `admin@mail.com` / `admin`. Productores de ejemplo: contraseña `productor123`.

## Scripts
- `npm run dev` desarrollo · `npm run build` producción (carpeta `dist/`) · `npm test` pruebas unitarias

## Estructura (`src/`)
- `api/` cliente HTTP y llamadas al backend · `types/` tipos compartidos
- `context/` sesión, avisos y preferencias (letra grande, tema e idioma) · `hooks/` carga de datos y favoritos
- `components/layout|ui/` piezas reutilizables · `pages/` una pantalla por archivo · `utils/` funciones puras
- `styles/styles.css` estilos del mockup

El catálogo permite compartir ofertas; el detalle enlaza al perfil público del productor, donde se pueden consultar sus publicaciones y, con sesión, calificarlo. La traducción al inglés es parcial. Las imágenes remotas que usa el seed son demostrativas y dependen de terceros.

## Seguridad
- React escapa todo el texto (no se usa `innerHTML`); enlaces/fotos solo `http(s)`; WhatsApp/llamada se construyen solo con dígitos.
- Las rutas `/vender`, `/favoritos`, `/perfil`, `/admin` exigen sesión/rol (el backend vuelve a validar siempre).
- Las fotos se reducen a 1600 px y se convierten a JPEG en el navegador antes de subirse (ahorra datos); el servidor las revisa de nuevo.
- Pendiente antes de producción: HTTPS y token en cookie httpOnly (hoy va en localStorage).
