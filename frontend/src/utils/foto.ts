const LADO_MAX = 1600; // px: suficiente para verse bien y liviana para conexiones lentas
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Prepara una foto del celular antes de subirla: la reduce a máx. 1600 px y la convierte a JPEG.
 * Las fotos de celular pesan 4–8 MB; así quedan en ~300 KB y suben rápido incluso con datos limitados.
 */
export async function prepararFoto(archivo: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(archivo.type)) throw new Error('Solo se aceptan fotos JPG, PNG o WebP');
  try {
    const bmp = await createImageBitmap(archivo);
    const escala = Math.min(1, LADO_MAX / Math.max(bmp.width, bmp.height));
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(bmp.width * escala);
    lienzo.height = Math.round(bmp.height * escala);
    const ctx = lienzo.getContext('2d');
    if (!ctx) throw new Error('sin canvas');
    ctx.fillStyle = '#fff'; // fondo blanco para PNG con transparencia
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.drawImage(bmp, 0, 0, lienzo.width, lienzo.height);
    const blob = await new Promise<Blob | null>((ok) => lienzo.toBlob(ok, 'image/jpeg', 0.85));
    if (blob) return blob;
  } catch { /* si el navegador no puede procesarla, se intenta subir tal cual */ }
  if (archivo.size > MAX_BYTES) throw new Error('La foto pesa más de 5 MB');
  return archivo;
}
