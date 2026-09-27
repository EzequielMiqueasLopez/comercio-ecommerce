/**
 * Adaptador de entrada: middleware que protege rutas verificando el JWT.
 */
function crearAuthMiddleware(jwtService) {
  return function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado.' });
    }

    const token = header.split(' ')[1];
    try {
      const payload = jwtService.verificar(token);
      req.usuario = payload; // { sub, rol }
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
  };
}

module.exports = crearAuthMiddleware;
