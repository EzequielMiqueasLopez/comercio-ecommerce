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
  constructor(pedidoRepository, productoRepository, usuarioRepository, emailService) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
    this.usuarioRepository = usuarioRepository;
    this.emailService = emailService; // puerto de salida, opcional
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
    const pedidoCreado = await this.pedidoRepository.crear(pedido, total);

    // Notificaciones por correo (puerto de salida). Regla de negocio importante:
    // si el correo falla, el pedido YA quedó registrado y NO debe revertirse ni
    // fallar la petición del cliente por eso. Solo se registra el error.
    if (this.emailService) {
      const itemsConNombre = itemsConPrecio.map((it) => ({
        ...it,
        nombre: productos.find((p) => p.id === it.productoId)?.nombre || 'Producto'
      }));

      try {
        await this.emailService.enviarConfirmacionPedido({
          usuario,
          pedido: pedidoCreado,
          items: itemsConNombre,
          total
        });
        await this.emailService.enviarNotificacionAdmin({
          usuario,
          pedido: pedidoCreado,
          items: itemsConNombre,
          total
        });
      } catch (error) {
        console.error('No se pudieron enviar las notificaciones por correo:', error.message);
      }
    }

    return pedidoCreado;
  }
}

module.exports = CrearPedidoUseCase;
