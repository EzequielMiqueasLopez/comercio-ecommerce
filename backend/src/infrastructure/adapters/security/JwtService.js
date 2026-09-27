const jwt = require('jsonwebtoken');

/**
 * Adaptador de salida: generación y verificación de tokens JWT
 * para las rutas protegidas. Separado del hashing de contraseñas
 * a propósito (son dos responsabilidades distintas).
 */
class JwtService {
  constructor(secret, expiresIn = '8h') {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generar(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verificar(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = JwtService;
