const bcrypt = require('bcryptjs');
const PasswordHasherPort = require('../../../application/ports/PasswordHasherPort');

/**
 * Adaptador de salida: implementa el puerto PasswordHasherPort usando bcrypt.
 * Este es el ÚNICO archivo del proyecto que sabe que usamos bcrypt.
 * Si mañana se cambia a argon2, solo se toca este archivo.
 */
class BcryptPasswordHasher extends PasswordHasherPort {
  constructor(saltRounds = 10) {
    super();
    this.saltRounds = saltRounds;
  }

  async hash(passwordPlano) {
    return bcrypt.hash(passwordPlano, this.saltRounds);
  }

  async comparar(passwordPlano, passwordHash) {
    return bcrypt.compare(passwordPlano, passwordHash);
  }
}

module.exports = BcryptPasswordHasher;
