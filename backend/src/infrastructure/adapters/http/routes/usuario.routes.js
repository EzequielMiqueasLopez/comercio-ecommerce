const { Router } = require('express');
const { permitirRoles } = require('../middlewares/rolesMiddleware');

function crearUsuarioRoutes(usuarioController, authMiddleware) {
  const router = Router();

  // Público: cualquiera puede crear su cuenta o iniciar sesión
  router.post('/registro', usuarioController.crear);
  router.post('/login', usuarioController.login);

  // Gestión de usuarios: SOLO admin
  router.get('/', authMiddleware, permitirRoles('admin'), usuarioController.listar);
  router.get('/:id', authMiddleware, permitirRoles('admin'), usuarioController.obtener);
  router.put('/:id', authMiddleware, permitirRoles('admin'), usuarioController.actualizar);
  router.delete('/:id', authMiddleware, permitirRoles('admin'), usuarioController.eliminar);

  return router;
}

module.exports = crearUsuarioRoutes;
