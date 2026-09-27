const { Router } = require('express');
const { permitirRoles } = require('../middlewares/rolesMiddleware');

function crearPedidoRoutes(pedidoController, authMiddleware) {
  const router = Router();

  router.use(authMiddleware); // todas las rutas de pedidos requieren login

  // Ver el historial de pedidos: admin y el rol "pedidos"
  router.get('/', permitirRoles('admin', 'pedidos'), pedidoController.listar);
  router.get('/:id', permitirRoles('admin', 'pedidos'), pedidoController.obtener);

  // Crear / modificar / eliminar pedidos: SOLO admin
  router.post('/', permitirRoles('admin'), pedidoController.crear);
  router.patch('/:id/estado', permitirRoles('admin'), pedidoController.actualizarEstado);
  router.delete('/:id', permitirRoles('admin'), pedidoController.eliminar);

  return router;
}

module.exports = crearPedidoRoutes;
