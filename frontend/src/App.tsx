import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { RutaProtegida } from './components/layout/RutaProtegida';
import { Cargando } from './components/ui/Mensaje';
import Inicio from './pages/Inicio';

// Las pantallas menos usadas se cargan solo cuando se visitan (la página inicial carga más rápido)
const Detalle = lazy(() => import('./pages/Detalle'));
const Ingresar = lazy(() => import('./pages/Ingresar'));
const OlvideContrasena = lazy(() => import('./pages/OlvideContrasena'));
const RestablecerContrasena = lazy(() => import('./pages/RestablecerContrasena'));
const Registro = lazy(() => import('./pages/Registro'));
const MisPublicaciones = lazy(() => import('./pages/MisPublicaciones'));
const PublicacionForm = lazy(() => import('./pages/PublicacionForm'));
const Favoritos = lazy(() => import('./pages/Favoritos'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Admin = lazy(() => import('./pages/Admin'));
const Ayuda = lazy(() => import('./pages/Ayuda'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const Configuracion = lazy(() => import('./pages/Configuracion'));
const NoEncontrada = lazy(() => import('./pages/NoEncontrada'));

export default function App() {
  return (
    <Suspense fallback={<Cargando />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="oferta/:id" element={<Detalle />} />
          <Route path="ingresar" element={<Ingresar />} />
          <Route path="olvide-contrasena" element={<OlvideContrasena />} />
          <Route path="restablecer" element={<RestablecerContrasena />} />
          <Route path="registro" element={<Registro />} />
          <Route path="ayuda" element={<Ayuda />} />
          <Route path="privacidad" element={<Privacidad />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="vender" element={<RutaProtegida><MisPublicaciones /></RutaProtegida>} />
          <Route path="vender/nueva" element={<RutaProtegida><PublicacionForm /></RutaProtegida>} />
          <Route path="vender/:id/editar" element={<RutaProtegida><PublicacionForm /></RutaProtegida>} />
          <Route path="favoritos" element={<RutaProtegida><Favoritos /></RutaProtegida>} />
          <Route path="perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
          <Route path="admin" element={<RutaProtegida soloAdmin><Admin /></RutaProtegida>} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
