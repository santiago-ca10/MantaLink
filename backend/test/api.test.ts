// Pruebas de integración: levantan la app real contra una BD de prueba (mantalink_test) y la golpean por HTTP.
// Correr:  npm test
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? 'postgres://mantalink:mantalink@localhost:5432/mantalink_test';
process.env.JWT_SECRET = 'secreto-de-pruebas-con-mas-de-32-caracteres-xx';
process.env.MODERACION_ACTIVA = 'true';
process.env.THROTTLE_OFF = '1'; // se reactiva solo en la prueba de límite de intentos

import 'reflect-metadata';
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Categoria, EstadoUsuario, Rol, Usuario } from '../src/database/entities';

let app: any, base: string, ds: DataSource;
const call = async (method: string, path: string, body?: unknown, token?: string) => {
  const r = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, body: await r.json().catch(() => null) as any };
};
const registro = (correo: string) => ({ nombre: 'Prueba', tipoDocumento: 'CC', numeroDocumento: '1', correo, vereda: 'El Salitre', contrasena: 'clave12345', confirmarContrasena: 'clave12345', residente: true });
const oferta = (extra = {}) => ({ titulo: 'Queso campesino', descripcion: 'Rico', precio: '$10.000', categoriaId: 1, duracionDias: 10, ...extra });
let adminToken: string, prodToken: string, prodId: string, pubId: number;

before(async () => {
  app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(0);
  base = (await app.getUrl()).replace('[::1]', 'localhost') + '/api';
  ds = app.get(DataSource);
  await ds.synchronize(true); // BD de pruebas limpia
  await ds.getRepository(Categoria).save({ nombre: 'Alimentos', diasMin: 1, diasMax: 60, subcategorias: [] });
  await ds.getRepository(Usuario).save({ nombre: 'Admin', correo: 'admin@test.com', rol: Rol.ADMIN, estado: EstadoUsuario.ACTIVO, contrasenaHash: await bcrypt.hash('adminpass1', 4) });
  adminToken = (await call('POST', '/auth/login', { correo: 'admin@test.com', contrasena: 'adminpass1' })).body.token;
});
after(async () => { await app.close(); });

test('registro: no permite auto-asignarse rol ni estado', async () => {
  const r = await call('POST', '/auth/registro', { ...registro('a@test.com'), rol: 'ADMIN', estado: 'ACTIVO' });
  assert.equal(r.status, 400);
});
test('registro: exige residencia y contraseñas iguales', async () => {
  assert.equal((await call('POST', '/auth/registro', { ...registro('b@test.com'), residente: false })).status, 400);
  assert.equal((await call('POST', '/auth/registro', { ...registro('b@test.com'), confirmarContrasena: 'otra12345' })).status, 400);
});
test('registro + login; la respuesta nunca incluye el hash', async () => {
  assert.equal((await call('POST', '/auth/registro', registro('prod@test.com'))).status, 201);
  assert.equal((await call('POST', '/auth/registro', registro('prod@test.com'))).status, 409);
  const l = await call('POST', '/auth/login', { correo: 'prod@test.com', contrasena: 'clave12345' });
  assert.equal(l.status, 201);
  prodToken = l.body.token; prodId = l.body.usuario.id;
  assert.ok(!JSON.stringify(l.body).includes('contrasenaHash'));
  const me = await call('GET', '/auth/me', undefined, prodToken);
  assert.ok(!('contrasenaHash' in me.body));
});
test('login: mismo error para correo inexistente y clave mala', async () => {
  const a = await call('POST', '/auth/login', { correo: 'nadie@test.com', contrasena: 'clave12345' });
  const b = await call('POST', '/auth/login', { correo: 'prod@test.com', contrasena: 'incorrecta1' });
  assert.equal(a.status, 401); assert.deepEqual(a.body.message, b.body.message);
});
test('cuenta sin verificar no puede publicar', async () => {
  assert.equal((await call('POST', '/publicaciones', oferta(), prodToken)).status, 403);
});
test('endpoints protegidos exigen sesión y rol', async () => {
  assert.equal((await call('POST', '/publicaciones', oferta())).status, 401);
  assert.equal((await call('GET', '/admin/reportes', undefined, prodToken)).status, 403);
  assert.equal((await call('GET', '/publicaciones/mias/lista', undefined, 'token.falso.x')).status, 401);
});
test('flujo: verificar → publicar → pendiente invisible → aprobar → visible', async () => {
  assert.equal((await call('PATCH', `/admin/usuarios/${prodId}/estado`, { estado: 'ACTIVO' }, adminToken)).status, 200);
  const c = await call('POST', '/publicaciones', oferta(), prodToken);
  assert.equal(c.status, 201); assert.equal(c.body.estado, 'PENDIENTE'); pubId = c.body.id;
  assert.equal((await call('GET', '/publicaciones?q=queso')).body.total, 0);
  assert.equal((await call('GET', `/publicaciones/${pubId}`)).status, 404);
  assert.equal((await call('PATCH', `/admin/publicaciones/${pubId}/moderar`, { decision: 'RECHAZAR' }, adminToken)).status, 400); // rechazo exige motivo
  assert.equal((await call('PATCH', `/admin/publicaciones/${pubId}/moderar`, { decision: 'APROBAR' }, adminToken)).status, 200);
  assert.equal((await call('GET', '/publicaciones?q=queso')).body.total, 1);
});
test('validación de vigencia y datos', async () => {
  assert.equal((await call('POST', '/publicaciones', oferta({ duracionDias: 999 }), prodToken)).status, 400);
  assert.equal((await call('POST', '/publicaciones', oferta({ categoriaId: 999 }), prodToken)).status, 400);
  assert.equal((await call('POST', '/publicaciones', oferta({ imagenes: ['javascript:alert(1)'] }), prodToken)).status, 400);
  assert.equal((await call('POST', '/publicaciones', oferta({ titulo: '' }), prodToken)).status, 400);
});
test('un productor no puede tocar publicaciones ajenas', async () => {
  await call('POST', '/auth/registro', registro('otro@test.com'));
  const otroId = (await ds.getRepository(Usuario).findOneByOrFail({ correo: 'otro@test.com' })).id;
  await call('PATCH', `/admin/usuarios/${otroId}/estado`, { estado: 'ACTIVO' }, adminToken);
  const t = (await call('POST', '/auth/login', { correo: 'otro@test.com', contrasena: 'clave12345' })).body.token;
  assert.equal((await call('PATCH', `/publicaciones/${pubId}`, { titulo: 'hack' }, t)).status, 403);
  assert.equal((await call('DELETE', `/publicaciones/${pubId}`, undefined, t)).status, 403);
});
test('búsqueda: comodines SQL se tratan como texto y números gigantes no rompen el orden', async () => {
  assert.equal((await call('GET', '/publicaciones?q=%25')).body.total, 0);
  assert.equal((await call('GET', '/publicaciones?q=' + encodeURIComponent("'; DROP TABLE usuarios;--"))).status, 200);
  await call('POST', '/publicaciones', oferta({ titulo: 'Raro', precio: '9'.repeat(40) }), prodToken);
  assert.equal((await call('GET', '/publicaciones?orden=precio_asc')).status, 200);
  assert.equal((await call('GET', '/publicaciones?limite=5000')).status, 400);
});
test('reportes: público puede reportar; admin decide; queda historial', async () => {
  assert.equal((await call('POST', `/publicaciones/${pubId}/reportar`, { motivo: 'inventado' })).status, 400);
  assert.equal((await call('POST', `/publicaciones/${pubId}/reportar`, { motivo: 'Posible estafa' })).status, 201);
  const lista = (await call('GET', '/admin/reportes', undefined, adminToken)).body;
  assert.equal(lista.length, 1);
  assert.equal((await call('PATCH', `/admin/reportes/${lista[0].id}/resolver`, { decision: 'OCULTAR' }, adminToken)).status, 400); // sin comentario
  assert.equal((await call('PATCH', `/admin/reportes/${lista[0].id}/resolver`, { decision: 'OCULTAR', comentario: 'Revisado' }, adminToken)).status, 200);
  assert.equal((await call('GET', `/publicaciones/${pubId}`)).status, 404);
  const h = await ds.query('SELECT decision FROM revisiones_moderacion ORDER BY id');
  assert.deepEqual(h.map((x: any) => x.decision), ['APROBAR', 'OCULTAR']);
});
test('suspender una cuenta invalida su sesión al instante y oculta sus ofertas', async () => {
  await call('PATCH', `/admin/usuarios/${prodId}/estado`, { estado: 'SUSPENDIDO' }, adminToken);
  assert.equal((await call('GET', '/publicaciones/mias/lista', undefined, prodToken)).status, 401);
  assert.equal((await call('POST', '/auth/login', { correo: 'prod@test.com', contrasena: 'clave12345' })).status, 401);
});
test('cambiar contraseña exige la actual', async () => {
  const t = (await call('POST', '/auth/login', { correo: 'otro@test.com', contrasena: 'clave12345' })).body.token;
  assert.equal((await call('POST', '/auth/cambiar-contrasena', { actual: 'mala12345', nueva: 'nueva12345' }, t)).status, 401);
  assert.equal((await call('POST', '/auth/cambiar-contrasena', { actual: 'clave12345', nueva: 'nueva12345' }, t)).status, 201);
  assert.equal((await call('POST', '/auth/login', { correo: 'otro@test.com', contrasena: 'nueva12345' })).status, 201);
});

test('fuerza bruta: el login se bloquea tras demasiados intentos', async () => {
  process.env.THROTTLE_OFF = '0';
  try {
    const codigos: number[] = [];
    for (let i = 0; i < 12; i++) codigos.push((await call('POST', '/auth/login', { correo: 'admin@test.com', contrasena: 'incorrecta1' })).status);
    assert.ok(codigos.includes(429), `se esperaba un 429 y se obtuvo: ${codigos.join(',')}`);
  } finally { process.env.THROTTLE_OFF = '1'; }
});
