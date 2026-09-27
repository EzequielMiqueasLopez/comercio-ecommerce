/**
 * Regla de negocio: cálculo del monto total de un pedido
 * a partir de los items y el precio vigente de cada producto.
 */
function calcularTotalPedido(itemsConPrecio) {
  const total = itemsConPrecio.reduce(
    (acc, item) => acc + Number(item.cantidad) * Number(item.precioUnitario),
    0
  );
  return Number(total.toFixed(2));
}

module.exports = { calcularTotalPedido };
