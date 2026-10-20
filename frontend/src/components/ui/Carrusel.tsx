import { useState } from 'react';
import { urlSegura } from '../../utils/format';
import { Imagen } from './Imagen';

/** Carrusel de fotos del detalle. Sin fotos válidas muestra un recuadro vacío. */
export function Carrusel({ imagenes, alt }: { imagenes: string[]; alt: string }) {
  const fotos = imagenes.map(urlSegura).filter((u): u is string => !!u);
  const [i, setI] = useState(0);
  if (fotos.length <= 1) return <Imagen src={fotos[0]} alt={alt} className="carousel-slide" />;
  const ir = (d: number) => setI((x) => (x + d + fotos.length) % fotos.length);
  return (
    <div className="carousel" role="group" aria-roledescription="carrusel" aria-label={`Fotos de ${alt}`}>
      <div className="carousel-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {fotos.map((f, n) => <Imagen key={f + n} src={f} alt={`${alt}, foto ${n + 1} de ${fotos.length}`} className="carousel-slide" />)}
      </div>
      <button className="carousel-arrow prev" onClick={() => ir(-1)} aria-label="Foto anterior">‹</button>
      <button className="carousel-arrow next" onClick={() => ir(1)} aria-label="Foto siguiente">›</button>
      <div className="carousel-dots">{fotos.map((_, n) => <span key={n} className={`dot${n === i ? ' active' : ''}`} onClick={() => setI(n)} />)}</div>
    </div>
  );
}
