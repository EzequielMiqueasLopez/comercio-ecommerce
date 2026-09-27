require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'comercio',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secreto_inseguro_cambiar',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  },
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10
};
