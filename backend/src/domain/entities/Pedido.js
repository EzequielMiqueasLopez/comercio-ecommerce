/**
 * Entidad de dominio: Pedido
 * Un pedido agrega una lista de items (producto + cantidad + precio unitario).
 */
class PedidoItem {
  constructor({ productoId, cantidad, precioUnitario }) {
    this.productoId = productoId;
    this.cantidad = Number(cantidad);
    this.precioUnitario = Number(precioUnitario);
  }

  subtotal() {
    return Number((this.cantidad * this.precioUnitario).toFixed(2));
  }
}

const ESTADOS_VALIDOS = ['pendiente', 'pagado', 'enviado', 'cancelado'];

class Pedido {
  constructor({ id, usuarioId, estado = 'pendiente', items = [], createdAt, updatedAt }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.estado = estado;
    this.items = items.map((it) => (it instanceof PedidoItem ? it : new PedidoItem(it)));
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Regla de negocio: cálculo del monto total del pedido
  calcularTotal() {
    const total = this.items.reduce((acc, item) => acc + item.subtotal(), 0);
    return Number(total.toFixed(2));
  }

  cambiarEstado(nuevoEstado) {
    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
      throw new Error(`Estado de pedido inválido: ${nuevoEstado}`);
    }
    this.estado = nuevoEstado;
  }
}

module.exports = { Pedido, PedidoItem, ESTADOS_VALIDOS };
