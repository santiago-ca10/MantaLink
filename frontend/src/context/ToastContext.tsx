import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

const Ctx = createContext<(mensaje: string) => void>(() => {});

/** Aviso corto abajo de la pantalla ("Publicación guardada"). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef<number>();
  const avisar = useCallback((m: string) => {
    setMsg(m); setVisible(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), 3200);
  }, []);
  return (
    <Ctx.Provider value={avisar}>
      {children}
      {/* aria-live: los lectores de pantalla anuncian el mensaje */}
      <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">{msg}</div>
    </Ctx.Provider>
  );
}
export const useToast = () => useContext(Ctx);
