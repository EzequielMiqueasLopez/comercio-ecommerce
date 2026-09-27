class PedidoController {
  constructor({ crearPedido, listarPedidos, obtenerPedido, actualizarEstadoPedido, eliminarPedido }) {
    this.crearPedido = crearPedido;
    this.listarPedidos = listarPedidos;
    this.obtenerPedido = obtenerPedido;
    this.actualizarEstadoPedido = actualizarEstadoPedido;
    this.eliminarPedido = eliminarPedido;
  }

  crear = async (req, res) => {
    try {
      const pedido = await this.crearPedido.ejecutar(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      const usuarioId = req.query.usuarioId || null;
      const pedidos = await this.listarPedidos.ejecutar(usuarioId);
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  obtener = async (req, res) => {
    try {
      const pedido = await this.obtenerPedido.ejecutar(req.params.id);
      res.json(pedido);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  actualizarEstado = async (req, res) => {
    try {
      const pedido = await this.actualizarEstadoPedido.ejecutar(req.params.id, req.body.estado);
      res.json(pedido);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  eliminar = async (req, res) => {
    try {
      const resultado = await this.eliminarPedido.ejecutar(req.params.id);
      res.json(resultado);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
}

module.exports = PedidoController;
