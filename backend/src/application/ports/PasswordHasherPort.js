/**
 * Puerto de salida: contrato para el módulo de cifrado de contraseñas.
 * La capa de aplicación solo conoce "hash" y "comparar", nunca sabe
 * si por debajo se usa bcrypt, argon2, etc.
 */
class PasswordHasherPort {
  async hash(passwordPlano) { throw new Error('No implementado'); }
  async comparar(passwordPlano, passwordHash) { throw new Error('No implementado'); }
}

module.exports = PasswordHasherPort;
