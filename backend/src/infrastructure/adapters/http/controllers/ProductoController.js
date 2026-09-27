class ProductoController {
  constructor({ crearProducto, listarProductos, obtenerProducto, actualizarProducto, eliminarProducto }) {
    this.crearProducto = crearProducto;
    this.listarProductos = listarProductos;
    this.obtenerProducto = obtenerProducto;
    this.actualizarProducto = actualizarProducto;
    this.eliminarProducto = eliminarProducto;
  }

  crear = async (req, res) => {
    try {
      const producto = await this.crearProducto.ejecutar(req.body);
      res.status(201).json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      const productos = await this.listarProductos.ejecutar();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  obtener = async (req, res) => {
    try {
      const producto = await this.obtenerProducto.ejecutar(req.params.id);
      res.json(producto);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  actualizar = async (req, res) => {
    try {
      const producto = await this.actualizarProducto.ejecutar(req.params.id, req.body);
      res.json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  eliminar = async (req, res) => {
    try {
      const resultado = await this.eliminarProducto.ejecutar(req.params.id);
      res.json(resultado);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
}

module.exports = ProductoController;
