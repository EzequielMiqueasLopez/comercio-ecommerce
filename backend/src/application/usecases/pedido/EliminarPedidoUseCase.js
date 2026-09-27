class EliminarPedidoUseCase {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async ejecutar(id) {
    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) throw new Error('Pedido no encontrado.');
    await this.pedidoRepository.eliminar(id);
    return { mensaje: 'Pedido eliminado correctamente.' };
  }
}

module.exports = EliminarPedidoUseCase;
