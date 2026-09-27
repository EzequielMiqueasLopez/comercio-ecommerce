/**
 * Regla de negocio: validación de contraseñas en texto plano
 * (antes de ser hasheadas). No depende de bcrypt ni de nada externo.
 */
function validarPassword(passwordPlano) {
  const errores = [];

  if (!passwordPlano || typeof passwordPlano !== 'string') {
    errores.push('La contraseña es obligatoria.');
    return { valido: false, errores };
  }

  if (passwordPlano.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres.');
  }
  if (!/[A-Z]/.test(passwordPlano)) {
    errores.push('La contraseña debe incluir al menos una letra mayúscula.');
  }
  if (!/[0-9]/.test(passwordPlano)) {
    errores.push('La contraseña debe incluir al menos un número.');
  }

  return { valido: errores.length === 0, errores };
}

module.exports = { validarPassword };
