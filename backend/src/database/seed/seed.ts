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

type ProductoSeed = {
  titulo: string; cat: string; negocio: string; ubicacion: string; precio: string;
  descripcion: string; imagenes: string[]; sub?: string; productorAlternativo?: string;
};

const PRODUCTOS: ProductoSeed[] = [
  { titulo: 'Panela orgánica', cat: 'Alimentos', negocio: 'Trapiche enramada de Bermejal', ubicacion: 'Bermejal', precio: '$8.000 libra', descripcion: 'Panela artesanal molida en trapiche familiar, sin químicos añadidos.', imagenes: ['https://upra.gov.co/sites/default/files/styles/webp/public/2025-04/La%20panela%20colombiana%20conquista%20paladares%20en%20todo%20el%20mundo.jpg.webp?itok=z5_-ylRC'] },
  { titulo: 'Ruana de lana virgen', cat: 'Artesanías', negocio: 'Doña Rosa Tejidos', ubicacion: 'Palmar Arriba', precio: '$385.000', descripcion: 'Tejida a mano con técnicas heredadas de generación en generación.', imagenes: ['https://static.wixstatic.com/media/478bee_2029d26aec7447bc953625b8c61f0747~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/478bee_2029d26aec7447bc953625b8c61f0747~mv2.jpg'] },
  { titulo: 'Recorrido a la laguna', cat: 'Turismo', negocio: 'Guías Manta Rural', ubicacion: 'Palmar Arriba', precio: '$35.000 p/persona', descripcion: 'Caminata ecológica de 2 horas con guía certificado, incluye refrigerio campesino.', imagenes: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrJwr4f69e0bwk_ItoluDt4Xm3Sp6gwCq2tT5AXt7oa-S0LKVWdeHGSw_8&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAMXlmiG6SPpKH27zU4qTMMoWOfQBIfdVB6g1ip4kiVw&s=10', 'https://s0.wklcdn.com/image_246/7382818/128231972/81823917.700x525.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJcWmf8330qUcqK5ZGYIa-dfsky3imeLk180CNHeHo-A&s=10'] },
  { titulo: 'Transporte veredal', cat: 'Servicios', negocio: 'Don Efraín', ubicacion: 'Manta Grande Abajo', precio: 'Según destino', descripcion: 'Servicio de transporte entre veredas y casco urbano, disponible todos los días.', imagenes: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=500'] },
  { titulo: 'Taller de tejido artesanal', cat: 'Servicios', negocio: 'Claudia Mendez', productorAlternativo: 'Doña Rosa Tejidos', ubicacion: 'Salitre', precio: '$25.000', descripcion: 'Taller de 2 horas para aprender técnicas básicas de tejido.', imagenes: ['https://elpilon2024.s3.us-west-2.amazonaws.com/2024/05/foto-mochila.jpg'] },
  { titulo: 'Hotel boutique Corazón del Cielo', cat: 'Servicios', negocio: 'Hotel Boutique Corazón del Cielo', ubicacion: 'Centro o casco urbano', precio: '$60.000 noche', descripcion: 'Hospedaje boutique campestre con desayuno incluido, ideal para turistas.', imagenes: ['https://hotelboutiquecorazondelcielo.com/wp-content/uploads/2026/03/39af9076-674b-43e9-9229-490facb7da22-1-768x1024.jpg', 'https://hotelboutiquecorazondelcielo.com/wp-content/uploads/2026/03/PHOTO-2026-03-28-12-12-09-683x1024.jpg', 'https://hotelboutiquecorazondelcielo.com/wp-content/uploads/2026/03/c553d869-3c8f-4f88-96da-81906413726a-1005x1536.jpg'] },
  { titulo: 'Ternero bovino de levante', cat: 'Animales', sub: 'Bovinos', negocio: 'Finca Los Alpes', ubicacion: 'Juan Gordo', precio: '$3.500.000', descripcion: 'Precio negociable. Ternero sano, vacunado y desparasitado, listo para levante.', imagenes: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpL5Yuj33iIrl-OuVTPyoAYsG2XhkygtFcZ7gXMtS6sw&s=10'] },
  { titulo: 'Panadería La Espiga Dorada', cat: 'Emprendimientos', sub: 'Panadería', negocio: 'La Espiga Dorada', ubicacion: 'Capadocia', precio: 'Desde $2.000', descripcion: 'Pan campesino, almojábanas y pan de queso recién horneados cada mañana.', imagenes: ['https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=500'] },
  { titulo: 'Mazorcas frescas del agro', cat: 'Productos del agro', sub: 'Mazorca y cereales', negocio: 'Cultivos El Manantial', ubicacion: 'Minas', precio: '$3.000 unidad', descripcion: 'Mazorca recién cosechada, cultivada sin químicos en la vereda.', imagenes: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=500'] },
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
        titulo: p.titulo, descripcion: p.descripcion, precio: p.precio, ubicacion: p.ubicacion, subcategoria: p.sub,
        categoria: (await cats.findOneBy({ nombre: p.cat }))!, productor: await productorDe(p.negocio),
        estado: EstadoPublicacion.APROBADA, vigenteHasta: vence.toISOString().slice(0, 10), imagenes: p.imagenes, telefono: '3000000000',
      }));
    }
  } else {
    for (const p of PRODUCTOS) {
      const productorCorreo = `${slug(p.negocio)}@mail.com`;
      const existente = await pubs.findOne({ where: { titulo: p.titulo, productor: { correo: productorCorreo } } })
        ?? (p.productorAlternativo
          ? await pubs.findOne({ where: { titulo: p.titulo, productor: { correo: `${slug(p.productorAlternativo)}@mail.com` } } })
          : null);
      if (existente && existente.imagenes.length === 0) {
        existente.imagenes = p.imagenes;
        await pubs.save(existente);
      }
    }
  }
  console.log('Seed listo:', await cats.count(), 'categorías,', await users.count(), 'usuarios,', await pubs.count(), 'publicaciones');
  await ds.destroy();
}
main().catch((e) => { console.error(e); process.exit(1); });
