import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api';

/** Carga datos al entrar a una pantalla (y cuando cambian las dependencias). Ignora respuestas viejas. */
export function useCarga<T>(cargar: () => Promise<T>, deps: DependencyList) {
  const [datos, setDatos] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const version = useRef(0);

  const ejecutar = useCallback(() => {
    const mia = ++version.current;
    setCargando(true); setError(null);
    cargar()
      .then((d) => { if (mia === version.current) setDatos(d); })
      .catch((e) => { if (mia === version.current) setError(e instanceof ApiError ? e.message : 'No se pudo cargar. Inténtalo de nuevo.'); })
      .finally(() => { if (mia === version.current) setCargando(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { ejecutar(); return () => { version.current++; }; }, [ejecutar]);
  return { datos, setDatos, error, cargando, recargar: ejecutar };
}
