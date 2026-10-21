import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Calificacion, Categoria, EstadoPublicacion, EstadoUsuario, Publicacion, Rol, Usuario } from '../../database/entities';
import { ActualizarPublicacionDto, CalificarProductorDto, CatalogoQueryDto, CrearPublicacionDto } from './dto';

const hoy = () => new Date().toISOString().slice(0, 10);
const sumarDias = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const escaparLike = (texto: string) => texto.replace(/[\\%_]/g, '\\$&');

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectRepository(Publicacion) private pubs: Repository<Publicacion>,
    @InjectRepository(Categoria) private cats: Repository<Categoria>,
    @InjectRepository(Usuario) private usuarios: Repository<Usuario>,
    @InjectRepository(Calificacion) private calificaciones: Repository<Calificacion>,
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
    if (q.q) qb.andWhere(new Brackets((b) => b.where('p.titulo ILIKE :q').orWhere('p.descripcion ILIKE :q').orWhere('u.nombreNegocio ILIKE :q')), { q: `%${escaparLike(q.q)}%` });
    if (q.categorias?.length) qb.andWhere('c.nombre IN (:...categorias)', { categorias: q.categorias });
    else if (q.categoria) qb.andWhere('c.nombre = :cat', { cat: q.categoria });
    const ubicacion = q.ubicacion?.trim();
    if (ubicacion) qb.andWhere(`COALESCE(NULLIF(p.ubicacion, ''), u.vereda) ILIKE :ubicacion`, { ubicacion: `%${escaparLike(ubicacion)}%` });
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

  async perfilProductor(id: string) {
    const productor = await this.usuarios.findOne({ where: { id, rol: Rol.PRODUCTOR, estado: EstadoUsuario.ACTIVO } });
    if (!productor) throw new NotFoundException('Productor no encontrado');
    const [publicaciones, resumen] = await Promise.all([
      this.pubs.find({
        where: { productor: { id }, estado: EstadoPublicacion.APROBADA },
        order: { creadoEn: 'DESC' },
      }),
      this.calificaciones.createQueryBuilder('cal')
        .select('AVG(cal.puntuacion)', 'promedio')
        .addSelect('COUNT(cal.id)', 'cantidad')
        .where('cal.productorId = :id', { id })
        .getRawOne<{ promedio: string | null; cantidad: string }>(),
    ]);
    const hoyFecha = hoy();
    const vigentes = publicaciones.filter((p) => (!p.vigenteHasta || p.vigenteHasta >= hoyFecha) && (!p.fechaEvento || p.fechaEvento >= hoyFecha));
    return {
      productor: { id: productor.id, nombre: productor.nombre, nombreNegocio: productor.nombreNegocio, vereda: productor.vereda },
      publicaciones: vigentes.map((p) => this.publica(p)),
      calificacion: { promedio: resumen?.promedio ? Number(Number(resumen.promedio).toFixed(1)) : null, cantidad: Number(resumen?.cantidad ?? 0) },
    };
  }

  async calificarProductor(productorId: string, votanteId: string, dto: CalificarProductorDto) {
    const [productor, votante] = await Promise.all([
      this.usuarios.findOne({ where: { id: productorId, rol: Rol.PRODUCTOR, estado: EstadoUsuario.ACTIVO } }),
      this.usuarios.findOne({ where: { id: votanteId, estado: EstadoUsuario.ACTIVO } }),
    ]);
    if (!productor) throw new NotFoundException('Productor no encontrado');
    if (!votante) throw new ForbiddenException('Tu cuenta debe estar activa para calificar');
    if (productor.id === votante.id) throw new BadRequestException('No puedes calificar tu propio perfil');
    let calificacion = await this.calificaciones.findOne({ where: { productor: { id: productorId }, votante: { id: votanteId } } });
    if (calificacion) calificacion.puntuacion = dto.puntuacion;
    else calificacion = this.calificaciones.create({ puntuacion: dto.puntuacion, productor, votante });
    await this.calificaciones.save(calificacion);
    const resumen = await this.calificaciones.createQueryBuilder('cal')
      .select('AVG(cal.puntuacion)', 'promedio')
      .addSelect('COUNT(cal.id)', 'cantidad')
      .where('cal.productorId = :id', { id: productorId })
      .getRawOne<{ promedio: string | null; cantidad: string }>();
    return { promedio: Number(Number(resumen?.promedio ?? 0).toFixed(1)), cantidad: Number(resumen?.cantidad ?? 0), puntuacion: dto.puntuacion };
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
    if (u.rol !== Rol.ADMIN && u.estado !== EstadoUsuario.ACTIVO) throw new ForbiddenException('Tu cuenta aún no ha sido verificada por un administrador');
    const cat = await this.cats.findOneBy({ id: dto.categoriaId });
    if (!cat || !cat.activa) throw new BadRequestException('Categoría no válida');
    if (cat.esEvento && u.rol !== Rol.ADMIN) throw new ForbiddenException('Solo un administrador puede publicar eventos');
    if (dto.subcategoria && cat.subcategorias.length && !cat.subcategorias.includes(dto.subcategoria)) throw new BadRequestException('Subcategoría no válida para esa categoría');
    const p = this.pubs.create({
      titulo: dto.titulo, descripcion: dto.descripcion, precio: dto.precio, ubicacion: dto.ubicacion?.trim() || u.vereda, subcategoria: dto.subcategoria, imagenes: dto.imagenes ?? [],
      telefono: dto.telefono ?? u.telefono, whatsapp: dto.whatsapp, correoContacto: dto.correoContacto,
      productor: u, categoria: cat,
      estado: u.rol === Rol.ADMIN || process.env.MODERACION_ACTIVA === 'false' ? EstadoPublicacion.APROBADA : EstadoPublicacion.PENDIENTE,
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
