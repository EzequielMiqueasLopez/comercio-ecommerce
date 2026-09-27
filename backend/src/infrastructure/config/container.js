/**
 * Contenedor de inyección de dependencias.
 * Aquí, y SOLO aquí, se conectan las implementaciones concretas
 * (infraestructura) con las interfaces que espera la capa de aplicación.
 * Si mañana cambias PostgreSQL por MongoDB, solo tocas este archivo.
 */
const env = require('./env');
const pool = require('../adapters/persistence/db');

// Adaptadores de salida
const PgUsuarioRepository = require('../adapters/persistence/PgUsuarioRepository');
const PgProductoRepository = require('../adapters/persistence/PgProductoRepository');
const PgPedidoRepository = require('../adapters/persistence/PgPedidoRepository');
const BcryptPasswordHasher = require('../adapters/security/BcryptPasswordHasher');
const JwtService = require('../adapters/security/JwtService');

// Casos de uso: Usuario
const CrearUsuarioUseCase = require('../../application/usecases/usuario/CrearUsuarioUseCase');
const ListarUsuariosUseCase = require('../../application/usecases/usuario/ListarUsuariosUseCase');
const ObtenerUsuarioUseCase = require('../../application/usecases/usuario/ObtenerUsuarioUseCase');
const ActualizarUsuarioUseCase = require('../../application/usecases/usuario/ActualizarUsuarioUseCase');
const EliminarUsuarioUseCase = require('../../application/usecases/usuario/EliminarUsuarioUseCase');
const AutenticarUsuarioUseCase = require('../../application/usecases/usuario/AutenticarUsuarioUseCase');

// Casos de uso: Producto
const CrearProductoUseCase = require('../../application/usecases/producto/CrearProductoUseCase');
const ListarProductosUseCase = require('../../application/usecases/producto/ListarProductosUseCase');
const ObtenerProductoUseCase = require('../../application/usecases/producto/ObtenerProductoUseCase');
const ActualizarProductoUseCase = require('../../application/usecases/producto/ActualizarProductoUseCase');
const EliminarProductoUseCase = require('../../application/usecases/producto/EliminarProductoUseCase');

// Casos de uso: Pedido
const CrearPedidoUseCase = require('../../application/usecases/pedido/CrearPedidoUseCase');
const ListarPedidosUseCase = require('../../application/usecases/pedido/ListarPedidosUseCase');
const ObtenerPedidoUseCase = require('../../application/usecases/pedido/ObtenerPedidoUseCase');
const ActualizarEstadoPedidoUseCase = require('../../application/usecases/pedido/ActualizarEstadoPedidoUseCase');
const EliminarPedidoUseCase = require('../../application/usecases/pedido/EliminarPedidoUseCase');

// Adaptadores de entrada
const UsuarioController = require('../adapters/http/controllers/UsuarioController');
const ProductoController = require('../adapters/http/controllers/ProductoController');
const PedidoController = require('../adapters/http/controllers/PedidoController');
const crearAuthMiddleware = require('../adapters/http/middlewares/authMiddleware');

// --- Instanciación de adaptadores de salida ---
const usuarioRepository = new PgUsuarioRepository(pool);
const productoRepository = new PgProductoRepository(pool);
const pedidoRepository = new PgPedidoRepository(pool);
const passwordHasher = new BcryptPasswordHasher(env.bcryptSaltRounds);
const jwtService = new JwtService(env.jwt.secret, env.jwt.expiresIn);

// --- Instanciación de casos de uso, con sus dependencias inyectadas ---
const usuarioController = new UsuarioController({
  crearUsuario: new CrearUsuarioUseCase(usuarioRepository, passwordHasher),
  listarUsuarios: new ListarUsuariosUseCase(usuarioRepository),
  obtenerUsuario: new ObtenerUsuarioUseCase(usuarioRepository),
  actualizarUsuario: new ActualizarUsuarioUseCase(usuarioRepository, passwordHasher),
  eliminarUsuario: new EliminarUsuarioUseCase(usuarioRepository),
  autenticarUsuario: new AutenticarUsuarioUseCase(usuarioRepository, passwordHasher),
  jwtService
});

const productoController = new ProductoController({
  crearProducto: new CrearProductoUseCase(productoRepository),
  listarProductos: new ListarProductosUseCase(productoRepository),
  obtenerProducto: new ObtenerProductoUseCase(productoRepository),
  actualizarProducto: new ActualizarProductoUseCase(productoRepository),
  eliminarProducto: new EliminarProductoUseCase(productoRepository)
});

const pedidoController = new PedidoController({
  crearPedido: new CrearPedidoUseCase(pedidoRepository, productoRepository, usuarioRepository),
  listarPedidos: new ListarPedidosUseCase(pedidoRepository),
  obtenerPedido: new ObtenerPedidoUseCase(pedidoRepository),
  actualizarEstadoPedido: new ActualizarEstadoPedidoUseCase(pedidoRepository),
  eliminarPedido: new EliminarPedidoUseCase(pedidoRepository)
});

const authMiddleware = crearAuthMiddleware(jwtService);

module.exports = {
  usuarioController,
  productoController,
  pedidoController,
  authMiddleware
};
