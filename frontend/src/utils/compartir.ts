export async function compartir(enlace: string, titulo: string): Promise<'compartido' | 'copiado' | 'cancelado'> {
  const url = new URL(enlace, window.location.origin).toString();
  if (navigator.share) {
    try {
      await navigator.share({ title: titulo, text: `Mira esta publicación en MantaLink: ${titulo}`, url });
      return 'compartido';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelado';
      throw error;
    }
  }
  if (!navigator.clipboard?.writeText) throw new Error('Este navegador no permite compartir ni copiar el enlace.');
  await navigator.clipboard.writeText(url);
  return 'copiado';
}
