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
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  email: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '"Comercio Electrónico" <no-reply@comercio.local>',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@comercio.local',
    datosBancarios: {
      banco: process.env.BANK_NAME || 'Banco Ejemplo',
      titular: process.env.BANK_HOLDER || 'Comercio Electronico SA de CV',
      clabe: process.env.BANK_CLABE || '012345678901234567'
    }
  }
};
