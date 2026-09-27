const { Pool } = require('pg');

/**
 * Pool de conexiones a PostgreSQL. Único punto donde se lee la
 * configuración de la base de datos dentro de la capa de infraestructura.
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'comercio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

module.exports = pool;
