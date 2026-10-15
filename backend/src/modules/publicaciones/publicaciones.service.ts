import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Categoria, EstadoPublicacion, EstadoUsuario, Publicacion, Usuario } from '../../database/entities';
import { ActualizarPublicacionDto, CatalogoQueryDto, CrearPublicacionDto } from './dto';

const hoy = () => new Date().toISOString().slice(0, 10);
const sumarDias = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectRepository(Publicacion) private pubs: Repository<Publicacion>,
    @InjectRepository(Categoria) private cats: Repository<Categoria>,
    @InjectRepository(Usuario) private usuarios: Repository<Usuario>,
  ) {}

  // ---- Catálogo público (no requiere cuenta) ----
  async catalogo(q: CatalogoQueryDto) {
    const pagina = q.pagina ?? 1, limite = q.limite ?? 12;
    const qb = this.pubs.createQueryBuilder('p')
      .leftJoinAndSelect('p.categoria', 'c').leftJoinAndSelect('p.productor', 'u')
      .where('p.estado = :ok', { ok: EstadoPublicacion.APROBADA })
      .andWhere('u.estado = :act', { act: EstadoUsuario.ACTIVO }) // cuentas suspendidas no aparecen
      // Vencidas y eventos pasados no se muestran (se "quitan solas", como en el mockup)
      .andWhere(new Brackets((b) => b.where('p.vigenteHasta IS NULL').orWhere('p.vigenteHasta >= :hoy', { hoy: hoy() })))
      .andWhere(new Brackets((b) => b.where('p.fechaEvento IS NULL').orWhere('p.fechaEvento >= :hoy', { hoy: hoy() })));
    if (q.q) qb.andWhere(new Brackets((b) => b.where('p.titulo ILIKE :q').orWhere('p.descripcion ILIKE :q').orWhere('u.nombreNegocio ILIKE :q')), { q: `%${q.q.replace(/[\\%_]/g, '\\$&')}%` });
    if (q.categoria) qb.andWhere('c.nombre = :cat', { cat: q.categoria });
    if (q.subcategoria) qb.andWhere('p.subcategoria = :sub', { sub: q.subcategoria });
    // El precio es texto libre, así que ordenar por precio usa el primer número que aparezca en él
    const precioNum = `NULLIF(regexp_replace(split_part(p.precio, ' ', 1), '[^0-9]', '', 'g'), '')::numeric`;
    if (q.orden === 'precio_asc' || q.orden === 'precio_desc') {
      // TypeORM no deja ordenar por una expresión cruda junto con skip/take, así que se selecciona con alias
      qb.addSelect(precioNum, 'precio_num').orderBy('precio_num', q.orden === 'precio_asc' ? 'ASC' : 'DESC', 'NULLS LAST');
    }
    else qb.orderBy('p.creadoEn', 'DESC');
    const [items, total] = await qb.skip((pagina - 1) * limite).take(limite).getManyAndCount();
    return { items: items.map((p) => this.publica(p)), total, pagina, paginas: Math.ceil(total / limite) };
  }

  async detalle(id: number) {
    const p = await this.pubs.findOne({ where: { id } });
    const vigente = p && (!p.vigenteHasta || p.vigenteHasta >= hoy()) && (!p.fechaEvento || p.fechaEvento >= hoy());
    if (!p || p.estado !== EstadoPublicacion.APROBADA || p.productor.estado !== EstadoUsuario.ACTIVO || !vigente) throw new NotFoundException('Publicación no encontrada');
    return this.publica(p);
  }

  // Solo se exponen datos de contacto del productor, nunca documento ni hash
  private publica(p: Publicacion) {
    const { productor, ...resto } = p;
    return { ...resto, productor: { id: productor.id, nombre: productor.nombre, nombreNegocio: productor.nombreNegocio, vereda: productor.vereda } };
  }

  // ---- Productor ----
  misPublicaciones(uid: string) {
    return this.pubs.find({ where: { productor: { id: uid } }, order: { creadoEn: 'DESC' } });
  }

  async crear(uid: string, dto: CrearPublicacionDto) {
    const u = await this.usuarios.findOneByOrFail({ id: uid });
    if (u.estado !== EstadoUsuario.ACTIVO) throw new ForbiddenException('Tu cuenta aún no ha sido verificada por un administrador');
    const cat = await this.cats.findOneBy({ id: dto.categoriaId });
    if (!cat) throw new BadRequestException('Categoría no válida');
    if (dto.subcategoria && cat.subcategorias.length && !cat.subcategorias.includes(dto.subcategoria)) throw new BadRequestException('Subcategoría no válida para esa categoría');
    const p = this.pubs.create({
      titulo: dto.titulo, descripcion: dto.descripcion, precio: dto.precio, subcategoria: dto.subcategoria, imagenes: dto.imagenes ?? [],
      telefono: dto.telefono ?? u.telefono, whatsapp: dto.whatsapp, correoContacto: dto.correoContacto,
      productor: u, categoria: cat,
      estado: process.env.MODERACION_ACTIVA === 'false' ? EstadoPublicacion.APROBADA : EstadoPublicacion.PENDIENTE,
      ...this.vigencia(cat, dto.duracionDias, dto.fechaEvento),
    });
    return this.pubs.save(p);
  }

  private vigencia(cat: Categoria, dias?: number, fechaEvento?: string) {
    if (cat.esEvento) {
      if (!fechaEvento) throw new BadRequestException('Los eventos necesitan una fecha');
      if (fechaEvento < hoy()) throw new BadRequestException('La fecha del evento ya pasó');
      return { fechaEvento, vigenteHasta: null };
    }
    const d = dias ?? cat.diasMax;
    if (d < cat.diasMin || d > cat.diasMax) throw new BadRequestException(`Para ${cat.nombre} la publicación dura entre ${cat.diasMin} y ${cat.diasMax} días`);
    return { vigenteHasta: sumarDias(d), fechaEvento: null };
  }

  private async propia(id: number, uid: string, esAdmin = false) {
    const p = await this.pubs.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Publicación no encontrada');
    if (!esAdmin && p.productor.id !== uid) throw new ForbiddenException('Esta publicación no es tuya');
    return p;
  }

  async actualizar(id: number, uid: string, rol: string, dto: ActualizarPublicacionDto) {
    const p = await this.propia(id, uid, rol === 'ADMIN');
    const { duracionDias, fechaEvento, ...campos } = dto;
    Object.assign(p, campos);
    if (duracionDias !== undefined || fechaEvento !== undefined) Object.assign(p, this.vigencia(p.categoria, duracionDias, fechaEvento));
    // Si un productor edita algo ya aprobado o rechazado, vuelve a revisión
    if (rol !== 'ADMIN' && process.env.MODERACION_ACTIVA !== 'false') { p.estado = EstadoPublicacion.PENDIENTE; p.motivoRechazo = null; }
    return this.pubs.save(p);
  }

  async marcarAgotada(id: number, uid: string) {
    const p = await this.propia(id, uid);
    p.estado = EstadoPublicacion.AGOTADA;
    return this.pubs.save(p);
  }

  async eliminar(id: number, uid: string, rol: string) {
    await this.pubs.remove(await this.propia(id, uid, rol === 'ADMIN'));
    return { mensaje: 'Publicación eliminada' };
  }
}
