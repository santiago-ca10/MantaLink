import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { IsNull, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario, TokenRecuperacion, Usuario } from '../../database/entities';
import { CorreoService } from '../correo/correo.service';
import { ActualizarPerfilDto, CambiarContrasenaDto, LoginDto, OlvideContrasenaDto, RegistroDto, RestablecerContrasenaDto } from './dto';

const MINUTOS_VIGENCIA = 30; // el documento (CU5) pide que el enlace expire
const sha256 = (t: string) => createHash('sha256').update(t).digest('hex');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private usuarios: Repository<Usuario>,
    @InjectRepository(TokenRecuperacion) private tokens: Repository<TokenRecuperacion>,
    private jwt: JwtService,
    private correo: CorreoService,
  ) {}

  async registrar(dto: RegistroDto) {
    if (dto.contrasena !== dto.confirmarContrasena) throw new BadRequestException('Las contraseñas no coinciden');
    const correo = dto.correo.toLowerCase();
    if (await this.usuarios.findOne({ where: { correo } })) throw new ConflictException('Ya existe una cuenta con ese correo');
    const u = this.usuarios.create({
      nombre: dto.nombre, tipoDocumento: dto.tipoDocumento, numeroDocumento: dto.numeroDocumento, correo,
      telefono: dto.telefono, vereda: dto.vereda, nombreNegocio: dto.nombreNegocio,
      contrasenaHash: await bcrypt.hash(dto.contrasena, 10),
      estado: EstadoUsuario.PENDIENTE, // el admin debe verificar la residencia antes de que publique
    });
    await this.usuarios.save(u);
    return { mensaje: 'Cuenta creada. Un administrador verificará tus datos antes de que puedas publicar.' };
  }

  async login(dto: LoginDto) {
    const u = await this.usuarios.findOne({ where: { correo: dto.correo.toLowerCase() }, select: { id: true, nombre: true, correo: true, rol: true, estado: true, contrasenaHash: true } });
    // mismo mensaje para correo inexistente y contraseña errónea: no revela qué cuentas existen
    if (!u || !(await bcrypt.compare(dto.contrasena, u.contrasenaHash))) throw new UnauthorizedException('Correo o contraseña incorrectos');
    if (u.estado === EstadoUsuario.SUSPENDIDO) throw new UnauthorizedException('Tu cuenta está suspendida');
    const token = await this.jwt.signAsync({ sub: u.id, rol: u.rol });
    return { token, usuario: { id: u.id, nombre: u.nombre, correo: u.correo, rol: u.rol, estado: u.estado } };
  }

  async cambiarContrasena(id: string, dto: CambiarContrasenaDto) {
    const u = await this.usuarios.findOne({ where: { id }, select: { id: true, contrasenaHash: true } });
    if (!u || !(await bcrypt.compare(dto.actual, u.contrasenaHash))) throw new UnauthorizedException('La contraseña actual no es correcta');
    await this.usuarios.update(id, { contrasenaHash: await bcrypt.hash(dto.nueva, 10), contrasenaCambiadaEn: new Date() });
    return { mensaje: 'Contraseña actualizada' };
  }

  /** CU5 paso 1: pide el enlace. Responde SIEMPRE lo mismo, exista o no el correo, para no revelar qué cuentas existen. */
  async olvideContrasena(dto: OlvideContrasenaDto) {
    const respuesta = { mensaje: 'Si ese correo tiene una cuenta, te enviamos un enlace para crear una contraseña nueva. Vence en 30 minutos.' };
    const u = await this.usuarios.findOneBy({ correo: dto.correo.toLowerCase() });
    if (!u || u.estado === EstadoUsuario.SUSPENDIDO) return respuesta;
    // un solo enlace vigente por cuenta: los anteriores se invalidan
    await this.tokens.update({ usuarioId: u.id, usadoEn: IsNull() }, { usadoEn: new Date() });
    const token = randomBytes(32).toString('hex'); // 64 caracteres, imposibles de adivinar
    await this.tokens.save(this.tokens.create({ usuarioId: u.id, tokenHash: sha256(token), expiraEn: new Date(Date.now() + MINUTOS_VIGENCIA * 60_000), usadoEn: null }));
    const base = (process.env.APP_URL ?? 'http://localhost:8080').replace(/\/+$/, '');
    try {
      await this.correo.enviar(u.correo, 'Restablecer tu contraseña de MantaLink',
        `Hola ${u.nombre},\n\nRecibimos una solicitud para crear una contraseña nueva.\nEntra a este enlace (vence en ${MINUTOS_VIGENCIA} minutos y solo sirve una vez):\n\n${base}/restablecer?token=${token}\n\nSi no fuiste tú, ignora este mensaje: tu contraseña sigue igual.`);
    } catch (e) { new Logger('Auth').error(`No se pudo enviar el correo de recuperación: ${(e as Error).message}`); } // al visitante no se le cuenta (no revelar nada)
    return respuesta;
  }

  /** CU5 paso 2: cambia la clave con el enlace. El token sirve una sola vez y vence a los 30 min. */
  async restablecerContrasena(dto: RestablecerContrasenaDto) {
    const t = await this.tokens.findOne({ where: { tokenHash: sha256(dto.token), usadoEn: IsNull(), expiraEn: MoreThan(new Date()) } });
    if (!t) throw new BadRequestException('El enlace no es válido o ya venció. Pide uno nuevo.');
    // se marca como usado ANTES de cambiar la clave, y solo si sigue sin usar (dos clics simultáneos no pasan los dos)
    const r = await this.tokens.update({ id: t.id, usadoEn: IsNull() }, { usadoEn: new Date() });
    if (!r.affected) throw new BadRequestException('El enlace no es válido o ya venció. Pide uno nuevo.');
    await this.usuarios.update(t.usuarioId, { contrasenaHash: await bcrypt.hash(dto.nueva, 10), contrasenaCambiadaEn: new Date() });
    await this.tokens.update({ usuarioId: t.usuarioId, usadoEn: IsNull() }, { usadoEn: new Date() });
    return { mensaje: 'Contraseña actualizada. Ya puedes iniciar sesión.' };
  }

  async actualizarPerfil(id: string, dto: ActualizarPerfilDto) {
    // texto vacío = borrar el dato (menos el nombre, que es obligatorio)
    const limpio = (v?: string) => (v === undefined ? undefined : v.trim() || null);
    const cambios: Partial<Usuario> = {};
    if (dto.nombre !== undefined) cambios.nombre = dto.nombre.trim();
    if (dto.telefono !== undefined) cambios.telefono = limpio(dto.telefono) as string;
    if (dto.vereda !== undefined) cambios.vereda = limpio(dto.vereda) as string;
    if (dto.nombreNegocio !== undefined) cambios.nombreNegocio = limpio(dto.nombreNegocio) as string;
    if (Object.keys(cambios).length) await this.usuarios.update(id, cambios);
    return this.perfil(id);
  }

  perfil(id: string) { return this.usuarios.findOneByOrFail({ id }); }
}
