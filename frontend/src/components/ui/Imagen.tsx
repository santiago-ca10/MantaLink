import { urlSegura } from '../../utils/format';

/** Imagen que solo carga URLs http(s). Si no hay una válida, muestra un recuadro vacío. */
export function Imagen({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const ok = urlSegura(src);
  if (!ok) return <div className={className} style={{ background: 'var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: '.8rem' }} role="img" aria-label={alt}>Sin foto</div>;
  // referrerPolicy: no le contamos a sitios externos desde dónde se visita
  return <img className={className} src={ok} alt={alt} loading="lazy" referrerPolicy="no-referrer" />;
}
