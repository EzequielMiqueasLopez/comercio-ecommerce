const Usuario = require('../../../domain/entities/Usuario');
const { validarPassword } = require('../../../domain/services/PasswordPolicy');
const { ROLES_VALIDOS } = Usuario;

class CrearUsuarioUseCase {
  constructor(usuarioRepository, passwordHasher) {
    this.usuarioRepository = usuarioRepository;
    this.passwordHasher = passwordHasher;
  }

  async ejecutar({ nombre, email, password, rol }) {
    if (!nombre || !email) {
      throw new Error('Nombre y email son obligatorios.');
    }

    if (rol && !ROLES_VALIDOS.includes(rol)) {
      throw new Error(`Rol inválido. Debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
    }

    const { valido, errores } = validarPassword(password);
    if (!valido) {
      throw new Error(`Contraseña inválida: ${errores.join(' ')}`);
    }

    const existente = await this.usuarioRepository.buscarPorEmail(email);
    if (existente) {
      throw new Error('Ya existe un usuario registrado con ese email.');
    }

    const passwordHash = await this.passwordHasher.hash(password);

    const usuario = new Usuario({ nombre, email, passwordHash, rol });
    const usuarioCreado = await this.usuarioRepository.crear(usuario);

    return usuarioCreado.toPublicObject();
  }
}

module.exports = CrearUsuarioUseCase;
