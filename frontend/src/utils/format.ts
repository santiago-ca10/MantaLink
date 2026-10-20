// Utilidades puras (sin React). Tienen pruebas en format.test.ts.

/** Solo deja dígitos. */
export const soloDigitos = (s: string) => s.replace(/\D/g, '');

/** Número colombiano listo para wa.me / tel:. Devuelve null si no parece un número válido. */
export function telefonoCO(s?: string | null): string | null {
  if (!s) return null;
  let d = soloDigitos(s);
  if (d.startsWith('57') && d.length === 12) d = d.slice(2);
  if (d.length === 10 && d.startsWith('3')) return '57' + d; // celular
  if (d.length === 10 || d.length === 7) return d.length === 10 ? '57' + d : null; // fijo con indicativo
  return null;
}

export const enlaceWhatsApp = (tel?: string | null, texto?: string) => {
  const n = telefonoCO(tel);
  return n ? `https://wa.me/${n}${texto ? `?text=${encodeURIComponent(texto)}` : ''}` : null;
};
export const enlaceLlamada = (tel?: string | null) => {
  const n = telefonoCO(tel);
  return n ? `tel:+${n}` : null;
};

/** Solo se muestran imágenes http(s); cualquier otro esquema (javascript:, data:) se descarta. */
const FOTO_PROPIA = /^\/api\/archivos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

/** Solo deja pasar enlaces http(s) o las fotos que sube el propio portal. Todo lo demás (javascript:, data:…) se descarta. */
export function urlSegura(u?: string | null): string | null {
  if (!u) return null;
  if (FOTO_PROPIA.test(u)) return u;
  try {
    const url = new URL(u);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch { return null; }
}

export const fechaCorta = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const diasHasta = (iso?: string | null): number | null => {
  if (!iso) return null;
  const fin = new Date(iso + 'T23:59:59').getTime();
  return Math.ceil((fin - Date.now()) / 86_400_000);
};
