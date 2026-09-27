class EliminarUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(id) {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) throw new Error('Usuario no encontrado.');
    await this.usuarioRepository.eliminar(id);
    return { mensaje: 'Usuario eliminado correctamente.' };
  }
}

module.exports = EliminarUsuarioUseCase;
