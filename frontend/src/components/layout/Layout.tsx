import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { usePreferencias } from '../../context/PreferenciasContext';
import { BarraInferior } from './BarraInferior';
import { Encabezado } from './Encabezado';

export function Layout() {
  const { letra, setLetra } = usePreferencias();
  const { pathname } = useLocation();
  // Al cambiar de pantalla se vuelve arriba y el foco al contenido (accesibilidad para teclado/lector)
  useEffect(() => { window.scrollTo(0, 0); document.getElementById('contenido')?.focus({ preventScroll: true }); }, [pathname]);

  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <div className="flagbar" aria-hidden="true" />
      <Encabezado />
      <main id="contenido" tabIndex={-1} style={{ outline: 'none' }}><Outlet /></main>
      <BarraInferior />
      <button className={`a11y-fab${letra === 'grande' ? ' active' : ''}`} aria-pressed={letra === 'grande'}
        aria-label="Cambiar tamaño de letra" onClick={() => setLetra(letra === 'grande' ? 'normal' : 'grande')}>A+</button>
    </>
  );
}
