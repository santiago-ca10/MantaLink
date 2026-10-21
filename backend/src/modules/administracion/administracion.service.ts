import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Categoria, Decision, EstadoPublicacion, EstadoUsuario, MensajeContacto, Publicacion, RevisionModeracion, Rol, Usuario } from '../../database/entities';
import { ActualizarCategoriaDto, CrearCategoriaDto, ModerarPublicacionDto, UsuariosQueryDto } from './dto';

@Injectable()
export class AdministracionService {
  constructor(
    @InjectRepository(Publicacion) private pubs: Repository<Publicacion>,
    @InjectRepository(Usuario) private usuarios: Repository<Usuario>,
    @InjectRepository(RevisionModeracion) private revisiones: Repository<RevisionModeracion>,
    @InjectRepository(Categoria) private cats: Repository<Categoria>,
    @InjectRepository(MensajeContacto) private mensajes: Repository<MensajeContacto>,
  ) {}

  publicacionesPendientes() { return this.pubs.find({ where: { estado: EstadoPublicacion.PENDIENTE }, order: { creadoEn: 'ASC' } }); }
  publicacionesTodas() { return this.pubs.find({ order: { creadoEn: 'DESC' }, take: 200 }); }
  cuentasPendientes() { return this.usuarios.find({ where: { estado: EstadoUsuario.PENDIENTE }, order: { creadoEn: 'ASC' } }); }

  async moderar(id: number, adminId: string, dto: ModerarPublicacionDto) {
    const p = await this.pubs.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Publicación no encontrada');
    if (dto.decision === 'RECHAZAR' && !dto.motivo) throw new BadRequestException('Indica el motivo del rechazo (el productor lo verá)');
    p.estado = dto.decision === 'APROBAR' ? EstadoPublicacion.APROBADA : EstadoPublicacion.RECHAZADA;
    p.motivoRechazo = dto.decision === 'RECHAZAR' ? dto.motivo! : null;
    await this.pubs.save(p);
    // Queda historial de cada decisión (trazabilidad, 6.5.2)
    await this.revisiones.save(this.revisiones.create({
      decision: dto.decision === 'APROBAR' ? Decision.APROBAR : Decision.RECHAZAR,
      comentario: dto.motivo ?? null, administrador: { id: adminId } as Usuario, publicacion: p,
    }));
    return p;
  }

  async cambiarEstadoUsuario(id: string, estado: 'ACTIVO' | 'SUSPENDIDO') {
    const u = await this.usuarios.findOneBy({ id });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    // un administrador no puede suspender a otro (ni a sí mismo): evita quedarse sin acceso al panel
    if (u.rol === Rol.ADMIN) throw new BadRequestException('No se puede cambiar el estado de un administrador');
    u.estado = estado as EstadoUsuario;
    return this.usuarios.save(u);
  }

  // ---- CU9: gestión de usuarios ----
  async usuariosLista(q: UsuariosQueryDto) {
    const pagina = q.pagina ?? 1, limite = q.limite ?? 20;
    const qb = this.usuarios.createQueryBuilder('u').where('u.rol = :r', { r: Rol.PRODUCTOR }).orderBy('u.creadoEn', 'DESC');
    if (q.estado) qb.andWhere('u.estado = :e', { e: q.estado });
    if (q.q) qb.andWhere(new Brackets((b) => b.where('u.nombre ILIKE :q').orWhere('u.correo ILIKE :q').orWhere('u.nombreNegocio ILIKE :q')), { q: `%${q.q.replace(/[\\%_]/g, '\\$&')}%` });
    const [items, total] = await qb.skip((pagina - 1) * limite).take(limite).getManyAndCount();
    return { items, total, pagina, paginas: Math.max(1, Math.ceil(total / limite)) };
  }

  // ---- CU7: gestión de categorías ----
  async categoriasTodas() {
    const cats = await this.cats.find({ order: { nombre: 'ASC' } });
    const filas: { id: number; total: string }[] = await this.pubs.createQueryBuilder('p').select('p."categoriaId"', 'id').addSelect('COUNT(*)', 'total').groupBy('p."categoriaId"').getRawMany();
    const cuenta = new Map(filas.map((f) => [Number(f.id), Number(f.total)]));
    return cats.map((c) => ({ ...c, totalPublicaciones: cuenta.get(c.id) ?? 0 }));
  }

  private validarCategoria(d: { diasMin: number; diasMax: number; subcategorias?: string[] }) {
    if (d.diasMin > d.diasMax) throw new BadRequestException('Los días mínimos no pueden ser mayores que los máximos');
    if (d.subcategorias) {
      const l = d.subcategorias.map((x) => x.trim()).filter(Boolean);
      if (new Set(l.map((x) => x.toLowerCase())).size !== l.length) throw new BadRequestException('Hay subcategorías repetidas');
    }
  }

  private async nombreLibre(nombre: string, exceptoId?: number) {
    const otra = await this.cats.createQueryBuilder('c').where('LOWER(c.nombre) = LOWER(:n)', { n: nombre.trim() }).getOne();
    if (otra && otra.id !== exceptoId) throw new ConflictException('Ya existe una categoría con ese nombre');
  }

  async crearCategoria(dto: CrearCategoriaDto) {
    this.validarCategoria(dto);
    await this.nombreLibre(dto.nombre);
    return this.cats.save(this.cats.create({
      nombre: dto.nombre.trim(), descripcion: dto.descripcion?.trim() || null, diasMin: dto.diasMin, diasMax: dto.diasMax,
      esEvento: dto.esEvento ?? false, subcategorias: (dto.subcategorias ?? []).map((x) => x.trim()).filter(Boolean), activa: true,
    }));
  }

  async actualizarCategoria(id: number, dto: ActualizarCategoriaDto) {
    const c = await this.cats.findOneBy({ id });
    if (!c) throw new NotFoundException('Categoría no encontrada');
    const nuevo = { diasMin: dto.diasMin ?? c.diasMin, diasMax: dto.diasMax ?? c.diasMax, subcategorias: dto.subcategorias };
    this.validarCategoria(nuevo);
    if (dto.nombre !== undefined) { await this.nombreLibre(dto.nombre, id); c.nombre = dto.nombre.trim(); }
    if (dto.descripcion !== undefined) c.descripcion = dto.descripcion.trim() || null;
    c.diasMin = nuevo.diasMin; c.diasMax = nuevo.diasMax;
    if (dto.esEvento !== undefined && dto.esEvento !== c.esEvento) {
      if (await this.pubs.count({ where: { categoria: { id } } })) throw new BadRequestException('No se puede cambiar el tipo (evento / no evento) de una categoría que ya tiene publicaciones');
      c.esEvento = dto.esEvento;
    }
    if (dto.subcategorias) c.subcategorias = dto.subcategorias.map((x) => x.trim()).filter(Boolean);
    return this.cats.save(c);
  }

  /** Desactivar: si tiene publicaciones, es OBLIGATORIO pasarlas a otra categoría activa del mismo tipo. */
  async desactivarCategoria(id: number, reasignarAId?: number) {
    const c = await this.cats.findOneBy({ id });
    if (!c) throw new NotFoundException('Categoría no encontrada');
    const total = await this.pubs.count({ where: { categoria: { id } } });
    return this.cats.manager.transaction(async (m) => {
      if (total > 0) {
        if (!reasignarAId || reasignarAId === id) throw new BadRequestException(`Esta categoría tiene ${total} publicación(es): elige a qué categoría pasarlas`);
        const destino = await m.findOneBy(Categoria, { id: reasignarAId });
        if (!destino || !destino.activa) throw new BadRequestException('La categoría de destino no existe o está desactivada');
        if (destino.esEvento !== c.esEvento) throw new BadRequestException('Las publicaciones solo pueden pasar a una categoría del mismo tipo (evento / no evento)');
        // la subcategoría vieja puede no existir en la nueva: se limpia
        await m.createQueryBuilder().update(Publicacion).set({ categoria: { id: reasignarAId } as Categoria, subcategoria: null as unknown as string }).where('"categoriaId" = :id', { id }).execute();
      }
      c.activa = false;
      return m.save(c);
    });
  }

  async activarCategoria(id: number) {
    const c = await this.cats.findOneBy({ id });
    if (!c) throw new NotFoundException('Categoría no encontrada');
    c.activa = true;
    return this.cats.save(c);
  }

  // ---- CU11: mensajes del formulario de contacto ----
  mensajesLista(soloPendientes: boolean) {
    return this.mensajes.find({ where: soloPendientes ? { atendido: false } : {}, order: { creadoEn: 'DESC' }, take: 200 });
  }

  async marcarMensaje(id: number, atendido: boolean) {
    const m = await this.mensajes.findOneBy({ id });
    if (!m) throw new NotFoundException('Mensaje no encontrado');
    m.atendido = atendido;
    return this.mensajes.save(m);
  }
}
