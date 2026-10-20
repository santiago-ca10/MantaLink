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
- `context/` sesión, avisos y preferencias (letra grande, etc.) · `hooks/` carga de datos y favoritos
- `components/layout|ui/` piezas reutilizables · `pages/` una pantalla por archivo · `utils/` funciones puras
- `styles/styles.css` estilos del mockup

## Seguridad
- React escapa todo el texto (no se usa `innerHTML`); enlaces/fotos solo `http(s)`; WhatsApp/llamada se construyen solo con dígitos.
- Las rutas `/vender`, `/favoritos`, `/perfil`, `/admin` exigen sesión/rol (el backend vuelve a validar siempre).
- Pendiente antes de producción: HTTPS, token en cookie httpOnly (hoy va en localStorage), recuperación de contraseña, subida real de imágenes.
