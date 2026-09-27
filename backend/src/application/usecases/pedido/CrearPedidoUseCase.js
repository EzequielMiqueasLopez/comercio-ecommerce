const { Pedido } = require('../../../domain/entities/Pedido');
const { verificarStockDisponible } = require('../../../domain/services/StockService');
const { calcularTotalPedido } = require('../../../domain/services/PedidoCalculator');

/**
 * Caso de uso principal del sistema: crear un pedido.
 * Orquesta 3 repositorios/servicios sin saber cómo están implementados:
 *   1. Verifica que el usuario exista.
 *   2. Verifica stock disponible de cada producto (regla de dominio).
 *   3. Calcula el total (regla de dominio).
 *   4. Persiste el pedido y descuenta el stock.
 */
class CrearPedidoUseCase {
  constructor(pedidoRepository, productoRepository, usuarioRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar({ usuarioId, items }) {
    if (!usuarioId || !Array.isArray(items) || items.length === 0) {
      throw new Error('El pedido debe tener un usuario y al menos un producto.');
    }

    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) throw new Error('El usuario del pedido no existe.');

    const productoIds = items.map((it) => it.productoId);
    const productos = await this.productoRepository.buscarPorIds(productoIds);

    const { valido, errores } = verificarStockDisponible(productos, items);
    if (!valido) throw new Error(errores.join(' '));

    const itemsConPrecio = items.map((it) => {
      const producto = productos.find((p) => p.id === it.productoId);
      return {
        productoId: it.productoId,
        cantidad: it.cantidad,
        precioUnitario: producto.precio // el precio se toma del catálogo, no del cliente
      };
    });

    const total = calcularTotalPedido(itemsConPrecio);

    const pedido = new Pedido({
      usuarioId,
      estado: 'pendiente',
      items: itemsConPrecio
    });

    // El repositorio se encarga de la transacción: crear pedido + detalle + descontar stock
    return this.pedidoRepository.crear(pedido, total);
  }
}

module.exports = CrearPedidoUseCase;
