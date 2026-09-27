/**
 * Entidad de dominio: Producto
 */
class Producto {
  constructor({ id, nombre, descripcion, precio, stock, createdAt, updatedAt }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = Number(precio);
    this.stock = Number(stock);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  tieneStockSuficiente(cantidad) {
    return this.stock >= cantidad;
  }

  // Regla de negocio: nunca se puede dejar el stock en negativo
  descontarStock(cantidad) {
    if (!this.tieneStockSuficiente(cantidad)) {
      throw new Error(
        `Stock insuficiente para "${this.nombre}". Disponible: ${this.stock}, solicitado: ${cantidad}`
      );
    }
    this.stock -= cantidad;
    return this.stock;
  }
}

module.exports = Producto;
