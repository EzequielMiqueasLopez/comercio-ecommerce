/**
 * Puerto de salida: contrato que cualquier adaptador de persistencia
 * de Usuario debe cumplir. La capa de aplicación depende de esta
 * interfaz, nunca de una implementación concreta (PostgreSQL, etc).
 */
class UsuarioRepositoryPort {
  async crear(usuario) { throw new Error('No implementado'); }
  async buscarPorId(id) { throw new Error('No implementado'); }
  async buscarPorEmail(email) { throw new Error('No implementado'); }
  async listar() { throw new Error('No implementado'); }
  async actualizar(id, datos) { throw new Error('No implementado'); }
  async eliminar(id) { throw new Error('No implementado'); }
}

module.exports = UsuarioRepositoryPort;
