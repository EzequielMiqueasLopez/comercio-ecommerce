/**
 * Plantilla de correo: aviso al administrador de un nuevo pedido.
 */
function plantillaNotificacionAdmin({ usuario, pedido, items, total }) {
  const filas = items
    .map(
      (it) => `<li>${it.nombre} x${it.cantidad} — $${(it.cantidad * it.precioUnitario).toFixed(2)}</li>`
    )
    .join('');

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1B1B18;">
    <h2 style="color:#16302A;">Nuevo pedido recibido</h2>
    <p><strong>Pedido:</strong> #${pedido.id}</p>
    <p><strong>Cliente:</strong> ${usuario.nombre} (${usuario.email})</p>
    <p><strong>Estado:</strong> Pendiente de Pago</p>
    <ul style="line-height:1.6;">${filas}</ul>
    <p style="font-weight:bold;">Total: $${Number(total).toFixed(2)}</p>
  </div>`;

  return {
    subject: `Nuevo pedido #${pedido.id} — ${usuario.nombre}`,
    html
  };
}

module.exports = { plantillaNotificacionAdmin };
