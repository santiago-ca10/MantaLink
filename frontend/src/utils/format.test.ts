import { describe, expect, it } from 'vitest';
import { enlaceLlamada, enlaceWhatsApp, telefonoCO, urlSegura } from './format';

describe('telefonoCO', () => {
  it('normaliza celulares con espacios, guiones y prefijos', () => {
    expect(telefonoCO('300 123 4567')).toBe('573001234567');
    expect(telefonoCO('+57 (300) 123-4567')).toBe('573001234567');
    expect(telefonoCO('573001234567')).toBe('573001234567');
  });
  it('rechaza lo que no parece un teléfono', () => {
    expect(telefonoCO('abc')).toBeNull();
    expect(telefonoCO('123')).toBeNull();
    expect(telefonoCO(null)).toBeNull();
  });
});
describe('enlaces', () => {
  it('arma WhatsApp con texto codificado', () => {
    expect(enlaceWhatsApp('3001234567', 'Hola & gracias')).toBe('https://wa.me/573001234567?text=Hola%20%26%20gracias');
  });
  it('no genera enlace si el número es inválido (evita enlaces rotos o inyectados)', () => {
    expect(enlaceWhatsApp('javascript:alert(1)')).toBeNull();
    expect(enlaceLlamada('x')).toBeNull();
  });
});
describe('urlSegura', () => {
  it('acepta http/https y descarta esquemas peligrosos', () => {
    expect(urlSegura('https://ejemplo.com/a.jpg')).toBe('https://ejemplo.com/a.jpg');
    expect(urlSegura('javascript:alert(1)')).toBeNull();
    expect(urlSegura('data:text/html,<script>1</script>')).toBeNull();
    expect(urlSegura('no es url')).toBeNull();
  });
});

describe('urlSegura con fotos subidas al portal', () => {
  it('acepta /api/archivos/<uuid>.jpg', () => {
    const r = '/api/archivos/123e4567-e89b-12d3-a456-426614174000.jpg';
    expect(urlSegura(r)).toBe(r);
  });
  it('rechaza rutas inventadas o con ../', () => {
    expect(urlSegura('/api/archivos/../../etc/passwd')).toBeNull();
    expect(urlSegura('/api/archivos/x.svg')).toBeNull();
    expect(urlSegura('javascript:alert(1)')).toBeNull();
  });
});
