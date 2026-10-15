// Falla al arrancar en producción si la configuración es insegura, en vez de correr "a medias".
export function validarConfig() {
  if (process.env.NODE_ENV !== 'production') return;
  const faltan = ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGINS'].filter((k) => !process.env[k]);
  if (faltan.length) throw new Error(`Faltan variables de entorno: ${faltan.join(', ')}`);
  if ((process.env.JWT_SECRET as string).length < 32) throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
}
