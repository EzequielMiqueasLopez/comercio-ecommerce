class ListarPedidosUseCase {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async ejecutar(usuarioId = null) {
    if (usuarioId) return this.pedidoRepository.listarPorUsuario(usuarioId);
    return this.pedidoRepository.listar();
  }
}

module.exports = ListarPedidosUseCase;
