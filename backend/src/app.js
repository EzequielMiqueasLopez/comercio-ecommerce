const express = require('express');
const cors = require('cors');

const { usuarioController, productoController, pedidoController, authMiddleware } = require('./infrastructure/config/container');

const crearUsuarioRoutes = require('./infrastructure/adapters/http/routes/usuario.routes');
const crearProductoRoutes = require('./infrastructure/adapters/http/routes/producto.routes');
const crearPedidoRoutes = require('./infrastructure/adapters/http/routes/pedido.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servicio: 'ecommerce-backend' });
});

app.use('/api/usuarios', crearUsuarioRoutes(usuarioController, authMiddleware));
app.use('/api/productos', crearProductoRoutes(productoController, authMiddleware));
app.use('/api/pedidos', crearPedidoRoutes(pedidoController, authMiddleware));

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejador de errores no controlados
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

module.exports = app;
