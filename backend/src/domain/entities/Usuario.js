/**
 * Entidad de dominio: Usuario
 * Clase pura, sin dependencias de Express, PostgreSQL ni ninguna libreria externa.
 */

// Regla de negocio: roles permitidos en el sistema.
//   admin     -> acceso total (usuarios + productos + pedidos)
//   productos -> solo puede VER el catálogo de productos
//   pedidos   -> solo puede VER el historial de pedidos
const ROLES_VALIDOS = ['admin', 'productos', 'pedidos'];

class Usuario {
  constructor({ id, nombre, email, passwordHash, rol = 'productos', createdAt, updatedAt }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.passwordHash = passwordHash;
    this.rol = rol;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  esAdmin() {
    return this.rol === 'admin';
  }

  // Representación segura: nunca exponer el passwordHash hacia afuera
  toPublicObject() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Usuario;
module.exports.ROLES_VALIDOS = ROLES_VALIDOS;
