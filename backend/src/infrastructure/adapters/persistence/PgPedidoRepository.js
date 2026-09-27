const PedidoRepositoryPort = require('../../../application/ports/PedidoRepositoryPort');
const { Pedido, PedidoItem } = require('../../../domain/entities/Pedido');

function mapRowsToPedido(cabecera, detalleRows) {
  const items = detalleRows.map(
    (d) =>
      new PedidoItem({
        productoId: d.producto_id,
        cantidad: d.cantidad,
        precioUnitario: d.precio_unitario
      })
  );

  const pedido = new Pedido({
    id: cabecera.id,
    usuarioId: cabecera.usuario_id,
    estado: cabecera.estado,
    items,
    createdAt: cabecera.created_at,
    updatedAt: cabecera.updated_at
  });
  pedido.total = Number(cabecera.total);
  return pedido;
}

/**
 * Adaptador de salida: implementa PedidoRepositoryPort.
 * Usa una transacción de PostgreSQL para garantizar que la cabecera,
 * el detalle y el descuento de stock se guarden todos juntos o ninguno.
 */
class PgPedidoRepository extends PedidoRepositoryPort {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async crear(pedido, total) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: pedidoRows } = await client.query(
        `INSERT INTO pedidos (usuario_id, estado, total)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [pedido.usuarioId, pedido.estado, total]
      );
      const pedidoId = pedidoRows[0].id;

      const detalleRows = [];
      for (const item of pedido.items) {
        const { rows } = await client.query(
          `INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [pedidoId, item.productoId, item.cantidad, item.precioUnitario]
        );
        detalleRows.push(rows[0]);

        // Descuenta stock de forma atómica (nunca queda negativo por el CHECK de la tabla)
        await client.query(
          'UPDATE productos SET stock = stock - $1 WHERE id = $2',
          [item.cantidad, item.productoId]
        );
      }

      await client.query('COMMIT');
      return mapRowsToPedido(pedidoRows[0], detalleRows);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async buscarPorId(id) {
    const { rows: cabeceraRows } = await this.pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    if (cabeceraRows.length === 0) return null;

    const { rows: detalleRows } = await this.pool.query(
      'SELECT * FROM pedido_detalle WHERE pedido_id = $1',
      [id]
    );
    return mapRowsToPedido(cabeceraRows[0], detalleRows);
  }

  async listar() {
    const { rows: cabeceras } = await this.pool.query('SELECT * FROM pedidos ORDER BY created_at DESC');
    return this._adjuntarDetalles(cabeceras);
  }

  async listarPorUsuario(usuarioId) {
    const { rows: cabeceras } = await this.pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY created_at DESC',
      [usuarioId]
    );
    return this._adjuntarDetalles(cabeceras);
  }

  async _adjuntarDetalles(cabeceras) {
    const pedidos = [];
    for (const cabecera of cabeceras) {
      const { rows: detalleRows } = await this.pool.query(
        'SELECT * FROM pedido_detalle WHERE pedido_id = $1',
        [cabecera.id]
      );
      pedidos.push(mapRowsToPedido(cabecera, detalleRows));
    }
    return pedidos;
  }

  async actualizarEstado(id, estado) {
    const { rows } = await this.pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    const { rows: detalleRows } = await this.pool.query(
      'SELECT * FROM pedido_detalle WHERE pedido_id = $1',
      [id]
    );
    return mapRowsToPedido(rows[0], detalleRows);
  }

  async eliminar(id) {
    await this.pool.query('DELETE FROM pedidos WHERE id = $1', [id]);
  }
}

module.exports = PgPedidoRepository;
