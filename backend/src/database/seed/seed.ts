import 'dotenv/config';
import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import * as entities from '../entities';
import { Categoria, EstadoPublicacion, EstadoUsuario, Publicacion, Rol, Usuario } from '../entities';

// Datos tomados del mockup (js/app.js) para que el portal real arranque con contenido parecido.
const CATEGORIAS = [
  { nombre: 'Alimentos', diasMin: 1, diasMax: 60, subcategorias: [] },
  { nombre: 'Artesanías', diasMin: 1, diasMax: 90, subcategorias: [] },
  { nombre: 'Turismo', diasMin: 1, diasMax: 60, subcategorias: [] },
  { nombre: 'Servicios', diasMin: 1, diasMax: 90, subcategorias: [] },
  { nombre: 'Animales', diasMin: 1, diasMax: 7, subcategorias: ['Bovinos', 'Porcinos', 'Avícolas', 'Otros'] },
  { nombre: 'Emprendimientos', diasMin: 1, diasMax: 60, subcategorias: ['Gastronómico', 'Artesanías', 'Lácteos', 'Panadería', 'Cárnicos', 'Otros'] },
  { nombre: 'Productos del agro', diasMin: 1, diasMax: 30, subcategorias: ['Frutas', 'Verduras', 'Tubérculos', 'Mazorca y cereales', 'Otros'] },
  { nombre: 'Eventos', diasMin: 1, diasMax: 1, esEvento: true, subcategorias: [] },
];

const PRODUCTOS = [
  { titulo: 'Panela orgánica', cat: 'Alimentos', negocio: 'Trapiche enramada de Bermejal', precio: '$8.000 libra', descripcion: 'Panela artesanal molida en trapiche familiar, sin químicos añadidos.' },
  { titulo: 'Ruana de lana virgen', cat: 'Artesanías', negocio: 'Doña Rosa Tejidos', precio: '$385.000', descripcion: 'Tejida a mano con técnicas heredadas de generación en generación.' },
  { titulo: 'Recorrido a la laguna', cat: 'Turismo', negocio: 'Guías Manta Rural', precio: '$35.000 p/persona', descripcion: 'Caminata ecológica de 2 horas con guía certificado, incluye refrigerio campesino.' },
  { titulo: 'Transporte veredal', cat: 'Servicios', negocio: 'Don Efraín', precio: 'Según destino', descripcion: 'Servicio de transporte entre veredas y casco urbano, disponible todos los días.' },
  { titulo: 'Taller de tejido artesanal', cat: 'Servicios', negocio: 'Doña Rosa Tejidos', precio: '$25.000', descripcion: 'Taller de 2 horas para aprender técnicas básicas de tejido.' },
  { titulo: 'Hotel boutique Corazón del Cielo', cat: 'Servicios', negocio: 'Hotel Boutique Corazón del Cielo', precio: '$60.000 noche', descripcion: 'Hospedaje boutique campestre con desayuno incluido, ideal para turistas.' },
  { titulo: 'Ternero bovino de levante', cat: 'Animales', sub: 'Bovinos', negocio: 'Finca Los Alpes', precio: '$3.500.000', descripcion: 'Precio negociable. Ternero sano, vacunado y desparasitado, listo para levante.' },
  { titulo: 'Panadería La Espiga Dorada', cat: 'Emprendimientos', sub: 'Panadería', negocio: 'La Espiga Dorada', precio: 'Desde $2.000', descripcion: 'Pan campesino, almojábanas y pan de queso recién horneados cada mañana.' },
  { titulo: 'Mazorcas frescas del agro', cat: 'Productos del agro', sub: 'Mazorca y cereales', negocio: 'Cultivos El Manantial', precio: '$3.000 unidad', descripcion: 'Mazorca recién cosechada, cultivada sin químicos en la vereda.' },
];

async function main() {
  if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin'))
    throw new Error('En producción define un ADMIN_PASSWORD seguro; no se permite la clave de demostración.');
  const ds = new DataSource({
    type: 'postgres', url: process.env.DATABASE_URL,
    entities: Object.values(entities).filter((e) => typeof e === 'function') as any[], synchronize: true,
  });
  await ds.initialize();
  const cats = ds.getRepository(Categoria), users = ds.getRepository(Usuario), pubs = ds.getRepository(Publicacion);

  for (const c of CATEGORIAS) if (!(await cats.findOneBy({ nombre: c.nombre }))) await cats.save(cats.create(c));

  const adminCorreo = process.env.ADMIN_CORREO ?? 'admin@mail.com';
  if (!(await users.findOneBy({ correo: adminCorreo }))) {
    await users.save(users.create({
      nombre: 'Administrador MantaLink', correo: adminCorreo, rol: Rol.ADMIN, estado: EstadoUsuario.ACTIVO,
      contrasenaHash: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'admin', 10),
    }));
  }

  // Un productor de demostración por cada negocio del mockup (ya verificados). Clave de prueba: productor123
  const slug = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');
  const hash = await bcrypt.hash('productor123', 10);
  const productorDe = async (negocio: string) => {
    const correo = `${slug(negocio)}@mail.com`;
    return (await users.findOneBy({ correo })) ?? users.save(users.create({
      nombre: negocio, nombreNegocio: negocio, correo, telefono: '3000000000', vereda: 'El Salitre',
      rol: Rol.PRODUCTOR, estado: EstadoUsuario.ACTIVO, contrasenaHash: hash,
    }));
  };

  if ((await pubs.count()) === 0) {
    const vence = new Date(); vence.setDate(vence.getDate() + 30);
    for (const p of PRODUCTOS) {
      await pubs.save(pubs.create({
        titulo: p.titulo, descripcion: p.descripcion, precio: p.precio, subcategoria: (p as any).sub,
        categoria: (await cats.findOneBy({ nombre: p.cat }))!, productor: await productorDe(p.negocio),
        estado: EstadoPublicacion.APROBADA, vigenteHasta: vence.toISOString().slice(0, 10), imagenes: [], telefono: '3000000000',
      }));
    }
  }
  console.log('Seed listo:', await cats.count(), 'categorías,', await users.count(), 'usuarios,', await pubs.count(), 'publicaciones');
  await ds.destroy();
}
main().catch((e) => { console.error(e); process.exit(1); });
