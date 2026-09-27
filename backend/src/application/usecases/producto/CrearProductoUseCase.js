const Producto = require('../../../domain/entities/Producto');

class CrearProductoUseCase {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async ejecutar({ nombre, descripcion, precio, stock }) {
    if (!nombre || precio === undefined) {
      throw new Error('Nombre y precio son obligatorios.');
    }
    if (Number(precio) <= 0) {
      throw new Error('El precio debe ser mayor a 0.');
    }
    if (stock !== undefined && Number(stock) < 0) {
      throw new Error('El stock no puede ser negativo.');
    }

    const producto = new Producto({ nombre, descripcion, precio, stock: stock ?? 0 });
    return this.productoRepository.crear(producto);
  }
}

module.exports = CrearProductoUseCase;
