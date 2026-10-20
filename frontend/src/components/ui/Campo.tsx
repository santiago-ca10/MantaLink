import { ReactNode, useId } from 'react';

interface Props { etiqueta: string; requerido?: boolean; ayuda?: string; children: (id: string) => ReactNode }

/** Etiqueta + control, correctamente enlazados (importante para lectores de pantalla). */
export function Campo({ etiqueta, requerido, ayuda, children }: Props) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{etiqueta}{requerido && <span className="req"> *</span>}</label>
      {children(id)}
      {ayuda && <p className="field-hint">{ayuda}</p>}
    </div>
  );
}
