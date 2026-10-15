import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario, Usuario } from '../../database/entities';
import { CambiarContrasenaDto, LoginDto, RegistroDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Usuario) private usuarios: Repository<Usuario>, private jwt: JwtService) {}

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
    await this.usuarios.update(id, { contrasenaHash: await bcrypt.hash(dto.nueva, 10) });
    return { mensaje: 'Contraseña actualizada' };
  }

  perfil(id: string) { return this.usuarios.findOneByOrFail({ id }); }
}
