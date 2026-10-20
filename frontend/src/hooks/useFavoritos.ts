import { useCallback, useEffect, useState } from 'react';
import { favoritos } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Publicacion } from '../types';

/** Ids de las ofertas favoritas del usuario y la acción de marcar/desmarcar. Sin sesión, no hace nada. */
export function useFavoritos() {
  const { usuario } = useAuth();
  const avisar = useToast();
  const [ids, setIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!usuario) { setIds(new Set()); return; }
    favoritos.listar().then((l) => setIds(new Set(l.map((p) => p.id)))).catch(() => {});
  }, [usuario]);

  const alternar = useCallback(async (p: Publicacion) => {
    if (!usuario) { avisar('Ingresa a tu cuenta para guardar favoritos'); return; }
    const era = ids.has(p.id);
    setIds((s) => { const n = new Set(s); era ? n.delete(p.id) : n.add(p.id); return n; }); // respuesta inmediata
    try { era ? await favoritos.quitar(p.id) : await favoritos.agregar(p.id); }
    catch { setIds((s) => { const n = new Set(s); era ? n.add(p.id) : n.delete(p.id); return n; }); avisar('No se pudo actualizar el favorito'); }
  }, [usuario, ids, avisar]);

  return { ids, alternar, hayUsuario: !!usuario };
}
