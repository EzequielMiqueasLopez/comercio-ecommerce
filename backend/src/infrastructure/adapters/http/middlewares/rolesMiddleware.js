/**
 * Adaptador de entrada: middleware de autorización por rol.
 * Se usa DESPUÉS de authMiddleware (que ya dejó req.usuario = { sub, rol }).
 * Reglas del negocio:
 *   admin     -> acceso total
 *   productos -> solo puede VER el catálogo de productos
 *   pedidos   -> solo puede VER el historial de pedidos
 */
function permitirRoles(...rolesPermitidos) {
  return function rolesMiddleware(req, res, next) {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: `No tienes permisos para acceder a este recurso (rol requerido: ${rolesPermitidos.join(' o ')}).`
      });
    }
    next();
  };
}

module.exports = { permitirRoles };
