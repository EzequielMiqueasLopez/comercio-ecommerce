class ActualizarProductoUseCase {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async ejecutar(id, { nombre, descripcion, precio, stock }) {
    const producto = await this.productoRepository.buscarPorId(id);
    if (!producto) throw new Error('Producto no encontrado.');

    if (precio !== undefined && Number(precio) <= 0) {
      throw new Error('El precio debe ser mayor a 0.');
    }
    if (stock !== undefined && Number(stock) < 0) {
      throw new Error('El stock no puede ser negativo.');
    }

    const datos = {};
    if (nombre !== undefined) datos.nombre = nombre;
    if (descripcion !== undefined) datos.descripcion = descripcion;
    if (precio !== undefined) datos.precio = precio;
    if (stock !== undefined) datos.stock = stock;

    return this.productoRepository.actualizar(id, datos);
  }
}

module.exports = ActualizarProductoUseCase;
