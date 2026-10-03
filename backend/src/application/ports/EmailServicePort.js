/**
 * Puerto de salida: contrato para notificar por correo electrónico.
 * La capa de aplicación solo conoce estos dos métodos; nunca sabe
 * si por debajo hay Nodemailer, SendGrid, SES, etc.
 */
class EmailServicePort {
  async enviarConfirmacionPedido({ usuario, pedido, items, total }) {
    throw new Error('No implementado');
  }

  async enviarNotificacionAdmin({ usuario, pedido, items, total }) {
    throw new Error('No implementado');
  }
}

module.exports = EmailServicePort;
