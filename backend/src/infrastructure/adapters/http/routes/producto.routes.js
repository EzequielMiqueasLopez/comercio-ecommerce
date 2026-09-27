const { Router } = require('express');
const { permitirRoles } = require('../middlewares/rolesMiddleware');

function crearProductoRoutes(productoController, authMiddleware) {
  const router = Router();

  router.use(authMiddleware); // ya no es público: hay que iniciar sesión para ver el catálogo

  // Ver el catálogo: admin y el rol "productos"
  router.get('/', permitirRoles('admin', 'productos'), productoController.listar);
  router.get('/:id', permitirRoles('admin', 'productos'), productoController.obtener);

  // Modificar el catálogo: SOLO admin
  router.post('/', permitirRoles('admin'), productoController.crear);
  router.put('/:id', permitirRoles('admin'), productoController.actualizar);
  router.delete('/:id', permitirRoles('admin'), productoController.eliminar);

  return router;
}

module.exports = crearProductoRoutes;
