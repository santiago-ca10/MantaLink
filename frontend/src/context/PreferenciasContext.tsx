import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Idioma } from '../utils/i18n';

export type Tema = 'manta' | 'oscuro' | 'clasico';
export type TamanoLetra = 'normal' | 'grande';

interface Valor { tema: Tema; setTema: (t: Tema) => void; letra: TamanoLetra; setLetra: (l: TamanoLetra) => void; idioma: Idioma; setIdioma: (i: Idioma) => void; restaurar: () => void }
const Ctx = createContext<Valor | null>(null);

const leer = <T extends string>(clave: string, validos: readonly T[], porDefecto: T): T => {
  try { const v = localStorage.getItem(clave); return validos.includes(v as T) ? (v as T) : porDefecto; } catch { return porDefecto; }
};
const guardar = (clave: string, v: string) => { try { localStorage.setItem(clave, v); } catch { /* sin almacenamiento: no pasa nada */ } };

/** Tema de color y tamaño de letra: se guardan en el dispositivo y se aplican al <html>. */
export function PreferenciasProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => leer('mantalink.tema', ['manta', 'oscuro', 'clasico'] as const, 'manta'));
  const [letra, setLetra] = useState<TamanoLetra>(() => leer('mantalink.letra', ['normal', 'grande'] as const, 'normal'));
  const [idioma, setIdioma] = useState<Idioma>(() => leer('mantalink.idioma', ['es', 'en'] as const, 'es'));

  useEffect(() => { document.documentElement.dataset.theme = tema; guardar('mantalink.tema', tema); }, [tema]);
  useEffect(() => { document.documentElement.classList.toggle('text-grande', letra === 'grande'); guardar('mantalink.letra', letra); }, [letra]);
  useEffect(() => { document.documentElement.lang = idioma; guardar('mantalink.idioma', idioma); }, [idioma]);

  return <Ctx.Provider value={{ tema, setTema, letra, setLetra, idioma, setIdioma, restaurar: () => { setTema('manta'); setLetra('normal'); setIdioma('es'); } }}>{children}</Ctx.Provider>;
}
export function usePreferencias() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePreferencias debe usarse dentro de <PreferenciasProvider>');
  return v;
}
