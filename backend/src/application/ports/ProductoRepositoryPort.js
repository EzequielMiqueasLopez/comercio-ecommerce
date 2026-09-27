class ProductoRepositoryPort {
  async crear(producto) { throw new Error('No implementado'); }
  async buscarPorId(id) { throw new Error('No implementado'); }
  async buscarPorIds(ids) { throw new Error('No implementado'); }
  async listar() { throw new Error('No implementado'); }
  async actualizar(id, datos) { throw new Error('No implementado'); }
  async actualizarStock(id, nuevoStock) { throw new Error('No implementado'); }
  async eliminar(id) { throw new Error('No implementado'); }
}

module.exports = ProductoRepositoryPort;
