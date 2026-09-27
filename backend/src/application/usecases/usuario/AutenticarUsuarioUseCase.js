/**
 * Caso de uso de login. No genera el JWT aquí (eso es infraestructura),
 * solo valida credenciales y devuelve el usuario si son correctas.
 */
class AutenticarUsuarioUseCase {
  constructor(usuarioRepository, passwordHasher) {
    this.usuarioRepository = usuarioRepository;
    this.passwordHasher = passwordHasher;
  }

  async ejecutar({ email, password }) {
    const usuario = await this.usuarioRepository.buscarPorEmail(email);
    if (!usuario) throw new Error('Credenciales inválidas.');

    const coincide = await this.passwordHasher.comparar(password, usuario.passwordHash);
    if (!coincide) throw new Error('Credenciales inválidas.');

    return usuario;
  }
}

module.exports = AutenticarUsuarioUseCase;
