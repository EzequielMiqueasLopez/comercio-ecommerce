const UsuarioRepositoryPort = require('../../../application/ports/UsuarioRepositoryPort');
const Usuario = require('../../../domain/entities/Usuario');

function mapRowToUsuario(row) {
  if (!row) return null;
  return new Usuario({
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    passwordHash: row.password_hash,
    rol: row.rol,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

/**
 * Adaptador de salida: implementa UsuarioRepositoryPort usando PostgreSQL.
 */
class PgUsuarioRepository extends UsuarioRepositoryPort {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async crear(usuario) {
    const { rows } = await this.pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [usuario.nombre, usuario.email, usuario.passwordHash, usuario.rol]
    );
    return mapRowToUsuario(rows[0]);
  }

  async buscarPorId(id) {
    const { rows } = await this.pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return mapRowToUsuario(rows[0]);
  }

  async buscarPorEmail(email) {
    const { rows } = await this.pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return mapRowToUsuario(rows[0]);
  }

  async listar() {
    const { rows } = await this.pool.query('SELECT * FROM usuarios ORDER BY created_at DESC');
    return rows.map(mapRowToUsuario);
  }

  async actualizar(id, datos) {
    const campos = [];
    const valores = [];
    let i = 1;

    if (datos.nombre !== undefined) { campos.push(`nombre = $${i++}`); valores.push(datos.nombre); }
    if (datos.email !== undefined) { campos.push(`email = $${i++}`); valores.push(datos.email); }
    if (datos.rol !== undefined) { campos.push(`rol = $${i++}`); valores.push(datos.rol); }
    if (datos.passwordHash !== undefined) { campos.push(`password_hash = $${i++}`); valores.push(datos.passwordHash); }

    valores.push(id);
    const { rows } = await this.pool.query(
      `UPDATE usuarios SET ${campos.join(', ')} WHERE id = $${i} RETURNING *`,
      valores
    );
    return mapRowToUsuario(rows[0]);
  }

  async eliminar(id) {
    await this.pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  }
}

module.exports = PgUsuarioRepository;
