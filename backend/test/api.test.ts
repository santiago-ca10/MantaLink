// Pruebas de integración: levantan la app real contra una BD de prueba (mantalink_test) y la golpean por HTTP.
// Correr:  npm test
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? 'postgres://mantalink:mantalink@localhost:5432/mantalink_test';
process.env.JWT_SECRET = 'secreto-de-pruebas-con-mas-de-32-caracteres-xx';
process.env.MODERACION_ACTIVA = 'true';
process.env.UPLOADS_DIR = require('os').tmpdir() + '/mantalink-test-uploads-' + process.pid; // fotos de prueba, fuera del proyecto
process.env.THROTTLE_OFF = '1'; // se reactiva solo en la prueba de límite de intentos

import 'reflect-metadata';
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { CorreoService } from '../src/modules/correo/correo.service';
import { ArchivosService } from '../src/modules/archivos/archivos.service';
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
after(async () => { await app.close(); require('fs').rmSync(process.env.UPLOADS_DIR!, { recursive: true, force: true }); });

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
test('catálogo: filtros avanzados combinan varias categorías y ubicación sin romper categoria', async () => {
  const categoria = await call('POST', '/admin/categorias', { nombre: 'Servicios', diasMin: 1, diasMax: 30 }, adminToken);
  assert.equal(categoria.status, 201);
  const alimentos = await call('POST', '/publicaciones', oferta({ titulo: 'Arepas frescas', ubicacion: 'Bermejal' }), prodToken);
  assert.equal(alimentos.status, 201);
  assert.equal((await call('PATCH', `/admin/publicaciones/${alimentos.body.id}/moderar`, { decision: 'APROBAR' }, adminToken)).status, 200);
  const pub = await call('POST', '/publicaciones', oferta({ titulo: 'Transporte', categoriaId: categoria.body.id, ubicacion: 'Manta Grande Abajo' }), prodToken);
  assert.equal(pub.status, 201);
  assert.equal((await call('PATCH', `/admin/publicaciones/${pub.body.id}/moderar`, { decision: 'APROBAR' }, adminToken)).status, 200);

  const avanzada = await call('GET', '/publicaciones?categorias=Alimentos&categorias=Servicios');
  assert.equal(avanzada.status, 200);
  assert.equal(avanzada.body.total, 2);
  assert.ok(avanzada.body.items.every((p: any) => ['Alimentos', 'Servicios'].includes(p.categoria.nombre)));
  assert.ok(avanzada.body.items.some((p: any) => p.categoria.nombre === 'Alimentos' && p.ubicacion === 'Bermejal'));
  assert.equal((await call('GET', '/publicaciones?categorias=Alimentos&categorias=Servicios&ubicacion=bermejal')).body.total, 1);
  assert.equal((await call('GET', '/publicaciones?categoria=Alimentos&ubicacion=BERMEJAL')).body.total, 1);
});
test('subida de fotos: solo imágenes reales, solo productores, y el nombre lo pone el servidor', async () => {
  const subir = async (bytes: Buffer, nombre: string, token?: string) => {
    const fd = new FormData(); fd.append('archivo', new Blob([new Uint8Array(bytes)]), nombre);
    const r = await fetch(base + '/archivos', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
    return { status: r.status, body: await r.json().catch(() => null) as any };
  };
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64)]);
  assert.equal((await subir(png, 'a.png')).status, 401); // sin sesión
  assert.equal((await subir(png, 'a.png', adminToken)).status, 403); // el admin no es productor
  const ok = await subir(png, '../../etc/passwd.png', prodToken); // el nombre del cliente se ignora
  assert.equal(ok.status, 201);
  assert.match(ok.body.url, /^\/api\/archivos\/[0-9a-f-]{36}\.png$/);
  const img = await fetch(base.replace('/api', '') + ok.body.url);
  assert.equal(img.status, 200);
  assert.equal(img.headers.get('content-type'), 'image/png');
  assert.equal(img.headers.get('x-content-type-options'), 'nosniff');
  // un "png" que en realidad es texto/HTML/script se rechaza aunque el nombre y el tipo digan imagen
  assert.equal((await subir(Buffer.from('<script>alert(1)</script>'), 'x.png', prodToken)).status, 400);
  assert.equal((await subir(Buffer.from('<svg onload=alert(1)>'), 'x.svg', prodToken)).status, 400);
  // demasiado grande
  assert.equal((await subir(Buffer.concat([png, Buffer.alloc(5 * 1024 * 1024)]), 'grande.png', prodToken)).status, 413);
  // no se pueden leer archivos fuera de la carpeta
  assert.equal((await fetch(base + '/archivos/..%2f..%2fpackage.json')).status, 404);
  assert.equal((await fetch(base + '/archivos/passwd')).status, 404);
  // la oferta acepta fotos subidas y enlaces https, pero no rutas inventadas ni javascript:
  assert.equal((await call('POST', '/publicaciones', oferta({ imagenes: [ok.body.url, 'https://ejemplo.com/a.jpg'] }), prodToken)).status, 201);
  assert.equal((await call('POST', '/publicaciones', oferta({ imagenes: ['/api/archivos/../../x.png'] }), prodToken)).status, 400);
  assert.equal((await call('POST', '/publicaciones', oferta({ imagenes: ['javascript:alert(1)'] }), prodToken)).status, 400);
});
test('perfil: solo se editan los datos permitidos', async () => {
  const ok = await call('PATCH', '/auth/perfil', { nombre: 'Prueba Editada', telefono: '311 555 9999', vereda: 'La Fragua', nombreNegocio: '' }, prodToken);
  assert.equal(ok.status, 200);
  assert.equal(ok.body.nombre, 'Prueba Editada'); assert.equal(ok.body.vereda, 'La Fragua'); assert.equal(ok.body.nombreNegocio, null);
  assert.equal((await call('PATCH', '/auth/perfil', { rol: 'ADMIN' }, prodToken)).status, 400);
  assert.equal((await call('PATCH', '/auth/perfil', { estado: 'ACTIVO' }, prodToken)).status, 400);
  assert.equal((await call('PATCH', '/auth/perfil', { correo: 'otro@x.com' }, prodToken)).status, 400);
  assert.equal((await call('PATCH', '/auth/perfil', { telefono: 'abc<script>' }, prodToken)).status, 400);
  assert.equal((await call('PATCH', '/auth/perfil', { nombre: 'x' })).status, 401);
});
test('admin: lista usuarios con filtros y no puede suspender a otro admin', async () => {
  assert.equal((await call('GET', '/admin/usuarios', undefined, prodToken)).status, 403);
  const todos = await call('GET', '/admin/usuarios', undefined, adminToken);
  assert.equal(todos.status, 200); assert.ok(todos.body.total >= 2);
  assert.ok(todos.body.items.every((u: any) => u.rol === 'PRODUCTOR' && u.contrasenaHash === undefined));
  const f = await call('GET', '/admin/usuarios?q=Prueba%20Editada&estado=ACTIVO', undefined, adminToken);
  assert.equal(f.body.items.length, 1);
  assert.equal((await call('GET', '/admin/usuarios?q=%25', undefined, adminToken)).body.total, 0); // el comodín % es texto
  assert.equal((await call('GET', '/admin/usuarios?estado=XX', undefined, adminToken)).status, 400);
  const adminId = (await call('GET', '/auth/me', undefined, adminToken)).body.id;
  assert.equal((await call('PATCH', `/admin/usuarios/${adminId}/estado`, { estado: 'SUSPENDIDO' }, adminToken)).status, 400);
});
test('categorías: crear, editar, desactivar con reasignación obligatoria', async () => {
  assert.equal((await call('POST', '/admin/categorias', { nombre: 'Pruebas', diasMin: 1, diasMax: 30 }, prodToken)).status, 403);
  const c = await call('POST', '/admin/categorias', { nombre: 'Pruebas', descripcion: 'x', diasMin: 1, diasMax: 30, subcategorias: ['A', 'B'] }, adminToken);
  assert.equal(c.status, 201); const id = c.body.id;
  assert.equal((await call('POST', '/admin/categorias', { nombre: 'pruebas', diasMin: 1, diasMax: 30 }, adminToken)).status, 409); // duplicada sin importar mayúsculas
  assert.equal((await call('POST', '/admin/categorias', { nombre: 'Mala', diasMin: 10, diasMax: 5 }, adminToken)).status, 400);
  assert.equal((await call('PATCH', `/admin/categorias/${id}`, { nombre: 'Pruebas 2', subcategorias: ['A', 'a'] }, adminToken)).status, 400); // repetidas
  assert.equal((await call('PATCH', `/admin/categorias/${id}`, { nombre: 'Pruebas 2' }, adminToken)).body.nombre, 'Pruebas 2');
  assert.ok((await call('GET', '/categorias')).body.some((x: any) => x.id === id));

  // una oferta en la categoría nueva
  const p = await call('POST', '/publicaciones', oferta({ categoriaId: id, subcategoria: 'A' }), prodToken);
  assert.equal(p.status, 201);
  assert.equal((await call('PATCH', `/admin/categorias/${id}`, { esEvento: true }, adminToken)).status, 400); // ya tiene ofertas

  // desactivar: obliga a reasignar, y el destino debe ser válido
  assert.equal((await call('POST', `/admin/categorias/${id}/desactivar`, {}, adminToken)).status, 400);
  assert.equal((await call('POST', `/admin/categorias/${id}/desactivar`, { reasignarAId: id }, adminToken)).status, 400);
  assert.equal((await call('POST', `/admin/categorias/${id}/desactivar`, { reasignarAId: 9999 }, adminToken)).status, 400);
  assert.equal((await call('POST', `/admin/categorias/${id}/desactivar`, { reasignarAId: 1 }, adminToken)).status, 201);
  const movida = (await call('GET', '/publicaciones/mias/lista', undefined, prodToken)).body.find((x: any) => x.id === p.body.id);
  assert.equal(movida.categoria.id, 1); assert.equal(movida.subcategoria, null);
  assert.ok(!(await call('GET', '/categorias')).body.some((x: any) => x.id === id)); // ya no sale en el portal
  assert.equal((await call('POST', '/publicaciones', oferta({ categoriaId: id }), prodToken)).status, 400); // ni acepta ofertas nuevas
  const todas = (await call('GET', '/admin/categorias', undefined, adminToken)).body;
  assert.equal(todas.find((x: any) => x.id === id).activa, false);
  assert.ok(todas.find((x: any) => x.id === 1).totalPublicaciones >= 1);
  assert.equal((await call('POST', `/admin/categorias/${id}/activar`, {}, adminToken)).body.activa, true);
});
test('contacto: público, validado, guardado y visible para el admin', async () => {
  const enviados: string[] = [];
  app.get(CorreoService).enviar = async (para: string) => { enviados.push(para); };
  const m = { nombre: 'Visitante', correo: 'visita@test.com', asunto: 'Una duda', mensaje: 'Quisiera saber cómo publicar mi producto' };
  assert.equal((await call('POST', '/contacto', { ...m, correo: 'malo' })).status, 400);
  assert.equal((await call('POST', '/contacto', { ...m, mensaje: 'corto' })).status, 400);
  assert.equal((await call('POST', '/contacto', { ...m, admin: true })).status, 400);
  assert.equal((await call('POST', '/contacto', m)).status, 201);
  assert.ok(enviados.includes('visita@test.com')); // confirmación al visitante
  assert.equal((await call('GET', '/admin/mensajes', undefined, prodToken)).status, 403);
  const lista = (await call('GET', '/admin/mensajes?pendientes=true', undefined, adminToken)).body;
  assert.equal(lista.length, 1); assert.equal(lista[0].asunto, 'Una duda');
  assert.equal((await call('PATCH', `/admin/mensajes/${lista[0].id}/atendido`, { atendido: true }, adminToken)).body.atendido, true);
  assert.equal((await call('GET', '/admin/mensajes?pendientes=true', undefined, adminToken)).body.length, 0);
});
test('limpieza de fotos: borra solo las huérfanas con más de 24 h', async () => {
  const fs = require('fs'); const arch = app.get(ArchivosService);
  const viejo = (u: string) => { fs.writeFileSync(`${arch.carpeta}/${u}.png`, 'x'); const t = new Date(Date.now() - 48 * 3600_000); fs.utimesSync(`${arch.carpeta}/${u}.png`, t, t); };
  const huerfana = '11111111-1111-4111-8111-111111111111', usada = '22222222-2222-4222-8222-222222222222', nueva = '33333333-3333-4333-8333-333333333333';
  viejo(huerfana); viejo(usada); fs.writeFileSync(`${arch.carpeta}/${nueva}.png`, 'x');
  assert.equal((await call('POST', '/publicaciones', oferta({ imagenes: [`/api/archivos/${usada}.png`] }), prodToken)).status, 201);
  fs.writeFileSync(`${arch.carpeta}/notas.txt`, 'no es del portal'); // archivos ajenos no se tocan
  assert.ok((await arch.limpiarHuerfanas()) >= 1);
  assert.equal(fs.existsSync(`${arch.carpeta}/${huerfana}.png`), false);
  assert.equal(fs.existsSync(`${arch.carpeta}/${usada}.png`), true);
  assert.equal(fs.existsSync(`${arch.carpeta}/${nueva}.png`), true);
  assert.equal(fs.existsSync(`${arch.carpeta}/notas.txt`), true);
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

test('recuperar contraseña: enlace de un solo uso, vence, no revela cuentas y cierra sesiones viejas', async () => {
  const enviados: { para: string; texto: string }[] = [];
  app.get(CorreoService).enviar = async (para: string, _a: string, texto: string) => { enviados.push({ para, texto }); };
  const tokenDe = (texto: string) => /token=([0-9a-f]{64})/.exec(texto)![1];
  await call('POST', '/auth/registro', registro('rec@test.com'));
  const sesionVieja = (await call('POST', '/auth/login', { correo: 'rec@test.com', contrasena: 'clave12345' })).body.token;

  // misma respuesta exista o no la cuenta, y solo se manda correo si existe
  const a = await call('POST', '/auth/olvide-contrasena', { correo: 'rec@test.com' });
  const b = await call('POST', '/auth/olvide-contrasena', { correo: 'noexiste@test.com' });
  assert.equal(a.status, 201); assert.equal(b.status, 201);
  assert.deepEqual(a.body, b.body);
  assert.equal(enviados.length, 1); assert.equal(enviados[0].para, 'rec@test.com');
  assert.equal((await call('POST', '/auth/olvide-contrasena', { correo: 'no-es-correo' })).status, 400);

  // solo se guarda el hash: el token no aparece en la base de datos
  const t1 = tokenDe(enviados[0].texto);
  assert.equal((await ds.query('SELECT 1 FROM tokens_recuperacion WHERE "tokenHash" = $1', [t1])).length, 0);

  // pedir otro enlace invalida el anterior
  await call('POST', '/auth/olvide-contrasena', { correo: 'rec@test.com' });
  const t2 = tokenDe(enviados[1].texto);
  assert.equal((await call('POST', '/auth/restablecer-contrasena', { token: t1, nueva: 'nueva12345' })).status, 400);

  // validaciones
  assert.equal((await call('POST', '/auth/restablecer-contrasena', { token: t2, nueva: 'corta' })).status, 400);
  assert.equal((await call('POST', '/auth/restablecer-contrasena', { token: 'a'.repeat(64), nueva: 'nueva12345' })).status, 400);

  await new Promise((r) => setTimeout(r, 1100)); // para que la sesión vieja sea claramente anterior al cambio
  assert.equal((await call('POST', '/auth/restablecer-contrasena', { token: t2, nueva: 'nueva12345' })).status, 201);
  assert.equal((await call('POST', '/auth/restablecer-contrasena', { token: t2, nueva: 'otra123456' })).status, 400); // un solo uso
  assert.equal((await call('POST', '/auth/login', { correo: 'rec@test.com', contrasena: 'clave12345' })).status, 401);
  assert.equal((await call('POST', '/auth/login', { correo: 'rec@test.com', contrasena: 'nueva12345' })).status, 201);
  assert.equal((await call('GET', '/auth/me', undefined, sesionVieja)).status, 401); // la sesión anterior al cambio ya no sirve

  // vencimiento (30 min)
  await call('POST', '/auth/olvide-contrasena', { correo: 'rec@test.com' });
  const t3 = tokenDe(enviados[2].texto);
  await ds.query(`UPDATE tokens_recuperacion SET "expiraEn" = now() - interval '1 minute' WHERE "usadoEn" IS NULL`);
  assert.equal((await call('POST', '/auth/restablecer-contrasena', { token: t3, nueva: 'otra123456' })).status, 400);

  // cuenta suspendida: no se envía nada
  await ds.query(`UPDATE usuarios SET estado = 'SUSPENDIDO' WHERE correo = 'rec@test.com'`);
  const antes = enviados.length;
  await call('POST', '/auth/olvide-contrasena', { correo: 'rec@test.com' });
  assert.equal(enviados.length, antes);
});

test('fuerza bruta: el login se bloquea tras demasiados intentos', async () => {
  process.env.THROTTLE_OFF = '0';
  try {
    const codigos: number[] = [];
    for (let i = 0; i < 12; i++) codigos.push((await call('POST', '/auth/login', { correo: 'admin@test.com', contrasena: 'incorrecta1' })).status);
    assert.ok(codigos.includes(429), `se esperaba un 429 y se obtuvo: ${codigos.join(',')}`);
  } finally { process.env.THROTTLE_OFF = '1'; }
});
