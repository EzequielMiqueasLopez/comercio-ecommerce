const ProductoRepositoryPort = require('../../../application/ports/ProductoRepositoryPort');
const Producto = require('../../../domain/entities/Producto');

function mapRowToProducto(row) {
  if (!row) return null;
  return new Producto({
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: row.precio,
    stock: row.stock,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

class PgProductoRepository extends ProductoRepositoryPort {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async crear(producto) {
    const { rows } = await this.pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [producto.nombre, producto.descripcion, producto.precio, producto.stock]
    );
    return mapRowToProducto(rows[0]);
  }

  async buscarPorId(id) {
    const { rows } = await this.pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    return mapRowToProducto(rows[0]);
  }

  async buscarPorIds(ids) {
    if (ids.length === 0) return [];
    const { rows } = await this.pool.query('SELECT * FROM productos WHERE id = ANY($1)', [ids]);
    return rows.map(mapRowToProducto);
  }

  async listar() {
    const { rows } = await this.pool.query('SELECT * FROM productos ORDER BY created_at DESC');
    return rows.map(mapRowToProducto);
  }

  async actualizar(id, datos) {
    const campos = [];
    const valores = [];
    let i = 1;

    if (datos.nombre !== undefined) { campos.push(`nombre = $${i++}`); valores.push(datos.nombre); }
    if (datos.descripcion !== undefined) { campos.push(`descripcion = $${i++}`); valores.push(datos.descripcion); }
    if (datos.precio !== undefined) { campos.push(`precio = $${i++}`); valores.push(datos.precio); }
    if (datos.stock !== undefined) { campos.push(`stock = $${i++}`); valores.push(datos.stock); }

    valores.push(id);
    const { rows } = await this.pool.query(
      `UPDATE productos SET ${campos.join(', ')} WHERE id = $${i} RETURNING *`,
      valores
    );
    return mapRowToProducto(rows[0]);
  }

  async actualizarStock(id, nuevoStock) {
    const { rows } = await this.pool.query(
      'UPDATE productos SET stock = $1 WHERE id = $2 RETURNING *',
      [nuevoStock, id]
    );
    return mapRowToProducto(rows[0]);
  }

  async eliminar(id) {
    await this.pool.query('DELETE FROM productos WHERE id = $1', [id]);
  }
}

module.exports = PgProductoRepository;
