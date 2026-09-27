const { ESTADOS_VALIDOS } = require('../../../domain/entities/Pedido');

class ActualizarEstadoPedidoUseCase {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async ejecutar(id, nuevoEstado) {
    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
    }
    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) throw new Error('Pedido no encontrado.');

    return this.pedidoRepository.actualizarEstado(id, nuevoEstado);
  }
}

module.exports = ActualizarEstadoPedidoUseCase;
