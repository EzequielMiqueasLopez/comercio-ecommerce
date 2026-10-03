/**
 * Plantilla de correo: confirmación de pedido + instrucciones de pago.
 * Función pura: recibe datos, devuelve { subject, html }. No conoce
 * Nodemailer ni ningún proveedor de correo.
 */
function plantillaConfirmacionPedido({ usuario, pedido, items, total, datosBancarios }) {
  const filas = items
    .map(
      (it) => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e0d5;">${it.nombre}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e0d5;text-align:center;">${it.cantidad}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e0d5;text-align:right;">$${Number(it.precioUnitario).toFixed(2)}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e0d5;text-align:right;">$${(it.cantidad * it.precioUnitario).toFixed(2)}</td>
    </tr>`
    )
    .join('');

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1B1B18;">
    <h2 style="color:#16302A;">Gracias por tu pedido, ${usuario.nombre}</h2>
    <p>Tu pedido <strong>#${pedido.id}</strong> fue registrado con estado <strong>Pendiente de Pago</strong>.</p>

    <table style="width:100%;border-collapse:collapse;margin:18px 0;">
      <thead>
        <tr style="background:#F1ECE1;">
          <th style="text-align:left;padding:8px 10px;">Producto</th>
          <th style="padding:8px 10px;">Cant.</th>
          <th style="text-align:right;padding:8px 10px;">Precio</th>
          <th style="text-align:right;padding:8px 10px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>

    <p style="text-align:right;font-weight:bold;font-size:1.15em;">
      Total a pagar: $${Number(total).toFixed(2)}
    </p>

    <div style="background:#F1ECE1;padding:18px;border-radius:6px;margin-top:22px;">
      <h3 style="margin-top:0;color:#16302A;">Instrucciones de pago</h3>
      <p>Realiza tu transferencia a los siguientes datos y usa el número de pedido como referencia:</p>
      <ul style="line-height:1.7;">
        <li><strong>Banco:</strong> ${datosBancarios.banco}</li>
        <li><strong>Titular:</strong> ${datosBancarios.titular}</li>
        <li><strong>CLABE:</strong> ${datosBancarios.clabe}</li>
        <li><strong>Referencia:</strong> ${pedido.id}</li>
      </ul>
      <p style="margin-bottom:0;">Una vez recibido tu pago, tu pedido cambiará a estado "Pagado".</p>
    </div>
  </div>`;

  return {
    subject: `Pedido #${pedido.id} registrado — instrucciones de pago`,
    html
  };
}

module.exports = { plantillaConfirmacionPedido };
