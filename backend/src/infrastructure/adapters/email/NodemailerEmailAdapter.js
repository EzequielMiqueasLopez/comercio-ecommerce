const nodemailer = require('nodemailer');
const EmailServicePort = require('../../../application/ports/EmailServicePort');
const { plantillaConfirmacionPedido } = require('./templates/confirmacionPedidoTemplate');
const { plantillaNotificacionAdmin } = require('./templates/notificacionAdminTemplate');

/**
 * Adaptador de salida: implementa EmailServicePort usando Nodemailer.
 * Este es el ÚNICO archivo del proyecto que sabe que usamos Nodemailer.
 *
 * Si se configuran SMTP_HOST/SMTP_USER/SMTP_PASS en el .env, se usa ese
 * proveedor real (por ejemplo Mailtrap). Si no hay configuración, el
 * adaptador crea automáticamente una cuenta de prueba en Ethereal
 * (https://ethereal.email) la primera vez que se necesita enviar un
 * correo, e imprime en consola la URL para ver el mensaje recibido.
 */
class NodemailerEmailAdapter extends EmailServicePort {
  constructor({ host, port, user, pass, from, adminEmail, datosBancarios }) {
    super();
    this.host = host;
    this.port = port;
    this.user = user;
    this.pass = pass;
    this.from = from || '"Comercio Electrónico" <no-reply@comercio.local>';
    this.adminEmail = adminEmail || 'admin@comercio.local';
    this.datosBancarios = datosBancarios;
    this._transporterPromise = null;
  }

  async _obtenerTransporter() {
    if (this._transporterPromise) return this._transporterPromise;

    this._transporterPromise = (async () => {
      if (this.host && this.user && this.pass) {
        return nodemailer.createTransport({
          host: this.host,
          port: this.port || 587,
          auth: { user: this.user, pass: this.pass }
        });
      }

      // Sin configuración SMTP: crea una cuenta de prueba de Ethereal al vuelo
      const cuentaPrueba = await nodemailer.createTestAccount();
      console.log('--- Cuenta Ethereal de prueba creada automáticamente ---');
      console.log('Usuario SMTP de prueba:', cuentaPrueba.user);

      return nodemailer.createTransport({
        host: cuentaPrueba.smtp.host,
        port: cuentaPrueba.smtp.port,
        secure: cuentaPrueba.smtp.secure,
        auth: { user: cuentaPrueba.user, pass: cuentaPrueba.pass }
      });
    })();

    return this._transporterPromise;
  }

  _logVistaPrevia(info) {
    const url = nodemailer.getTestMessageUrl(info);
    if (url) console.log('📧 Vista previa del correo (Ethereal):', url);
  }

  async enviarConfirmacionPedido({ usuario, pedido, items, total }) {
    const transporter = await this._obtenerTransporter();
    const { subject, html } = plantillaConfirmacionPedido({
      usuario,
      pedido,
      items,
      total,
      datosBancarios: this.datosBancarios
    });

    const info = await transporter.sendMail({ from: this.from, to: usuario.email, subject, html });
    this._logVistaPrevia(info);
    return info;
  }

  async enviarNotificacionAdmin({ usuario, pedido, items, total }) {
    const transporter = await this._obtenerTransporter();
    const { subject, html } = plantillaNotificacionAdmin({ usuario, pedido, items, total });

    const info = await transporter.sendMail({ from: this.from, to: this.adminEmail, subject, html });
    this._logVistaPrevia(info);
    return info;
  }
}

module.exports = NodemailerEmailAdapter;
