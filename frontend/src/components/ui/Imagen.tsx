import { useEffect, useState } from 'react';
import { urlSegura } from '../../utils/format';

/** Imagen que solo carga URLs http(s). Si no hay una válida, muestra un recuadro vacío. */
export function Imagen({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [fallo, setFallo] = useState(false);
  const ok = urlSegura(src);
  useEffect(() => setFallo(false), [ok]);
  if (!ok || fallo) return <div className={className} style={{ background: 'var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: '.8rem' }} role="img" aria-label={`${alt}: sin foto disponible`}>Sin foto</div>;
  // referrerPolicy: no le contamos a sitios externos desde dónde se visita
  return <img className={className} src={ok} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFallo(true)} />;
}
