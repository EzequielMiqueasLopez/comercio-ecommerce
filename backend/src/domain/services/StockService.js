/**
 * Regla de negocio: comprobación de stock disponible al ordenar.
 * Recibe entidades Producto (dominio) y los items solicitados.
 */
function verificarStockDisponible(productos, itemsSolicitados) {
  const errores = [];

  for (const item of itemsSolicitados) {
    const producto = productos.find((p) => p.id === item.productoId);

    if (!producto) {
      errores.push(`El producto ${item.productoId} no existe.`);
      continue;
    }
    if (!producto.tieneStockSuficiente(item.cantidad)) {
      errores.push(
        `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, solicitado: ${item.cantidad}`
      );
    }
  }

  return { valido: errores.length === 0, errores };
}

module.exports = { verificarStockDisponible };
