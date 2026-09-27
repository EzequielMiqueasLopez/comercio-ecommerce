const { validarPassword } = require('../../../domain/services/PasswordPolicy');

class ActualizarUsuarioUseCase {
  constructor(usuarioRepository, passwordHasher) {
    this.usuarioRepository = usuarioRepository;
    this.passwordHasher = passwordHasher;
  }

  async ejecutar(id, { nombre, email, password, rol }) {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) throw new Error('Usuario no encontrado.');

    const datos = {};
    if (nombre) datos.nombre = nombre;
    if (email) datos.email = email;
    if (rol) datos.rol = rol;

    if (password) {
      const { valido, errores } = validarPassword(password);
      if (!valido) throw new Error(`Contraseña inválida: ${errores.join(' ')}`);
      datos.passwordHash = await this.passwordHasher.hash(password);
    }

    const actualizado = await this.usuarioRepository.actualizar(id, datos);
    return actualizado.toPublicObject();
  }
}

module.exports = ActualizarUsuarioUseCase;
